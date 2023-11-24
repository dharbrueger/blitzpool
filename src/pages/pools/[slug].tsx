import { type Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import router from "next/router";
import { type Dispatch, type SetStateAction, useState, useRef } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

export type PoolWithRelations = Prisma.PoolGetPayload<{
  include: {
    type: true;
    commissioner: true;
    members: {
      include: { user: true };
    };
  };
}>;

type PoolHeaderProps = {
  pool: PoolWithRelations;
  setActiveTab: Dispatch<SetStateAction<string>>;
  activeTab: string;
};

type PoolMembersViewProps = {
  pool: PoolWithRelations;
};

type PoolPicksViewProps = {
  pool: PoolWithRelations;
  member: Prisma.MembershipGetPayload<{ include: { user: true } }> | undefined;
};

type PoolSettingsViewProps = {
  pool: PoolWithRelations;
};

const PoolHeader = ({ pool, setActiveTab, activeTab }: PoolHeaderProps) => {
  const picksRef = useRef<HTMLDivElement>(null);
  const membersRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { data: sessionData } = useSession();

  if (!pool) return null;

  const currentUserId = sessionData?.user.id ?? "";
  const currentUserIsCommissioner = pool.commissioner.id === currentUserId;

  const handleSetActiveTab = (e: React.MouseEvent<HTMLDivElement>) => {
    setActiveTab(e.currentTarget.id);
  };

  return (
    <div className="mb-4 max-w-fit rounded-[50px] border-2 border-[#283441] bg-[#12171D] p-[40px] text-left">
      {/* Begin PoolHeader header information */}
      <div className="mb-6 text-4xl font-light uppercase text-white">
        <div>
          {pool.name}
          <div className="text-2xl text-slate-500">{pool.type.name}</div>
        </div>
      </div>

      {/* Begin PoolHeaderControls */}
      <div className="flex w-full cursor-pointer select-none flex-col text-xl uppercase text-slate-300 md:w-fit md:flex-row">
        <div
          id="picks"
          ref={picksRef}
          className={`border-b-4 border-slate-300 p-4 hover:bg-slate-500 ${
            activeTab === "picks" ? "bg-slate-500" : "bg-slate-700"
          } rounded-t-3xl md:rounded-l-3xl md:rounded-t-none md:rounded-tl-3xl md:border-b-0 md:border-r-4`}
          onClick={(e) => handleSetActiveTab(e)}
        >
          <i className="fa fa-check-square mr-4 text-bp-primary" />
          <span className="">picks</span>
        </div>
        <div
          id="members"
          ref={membersRef}
          className={`border-b-4 border-slate-300 p-4 hover:bg-slate-500 ${
            activeTab === "members" ? "bg-slate-500" : "bg-slate-700"
          } md:border-b-0 md:border-r-4`}
          onClick={(e) => handleSetActiveTab(e)}
        >
          <i className="fa fa-user-group mr-4 text-bp-primary" />
          <span>members</span>
        </div>
        <div
          id="settings"
          ref={settingsRef}
          className={`p-4 ${
            activeTab === "settings" ? "bg-slate-500" : "bg-slate-700"
          } ${
            currentUserIsCommissioner
              ? "hover:bg-slate-500"
              : "cursor-not-allowed bg-slate-500 grayscale"
          } rounded-b-3xl md:rounded-b-none md:rounded-r-3xl md:rounded-br-3xl`}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onClick={
            currentUserIsCommissioner ? (e) => handleSetActiveTab(e) : () => null
          }
        >
          <i className="fa fa-cog mr-4 text-bp-primary" />
          <span className="">settings</span>
        </div>
      </div>
    </div>
  );
};

const PoolMembersView = ({ pool }: PoolMembersViewProps) => {
  if (!pool) return null;

  return (
    <div className="rounded-[50px] border-2 border-[#283441] bg-[#12171D] p-[40px] text-left">
      <div className="text-4xl font-light uppercase text-slate-300">
        <div className="mb-4 flex flex-col sm:flex-row">
          <span className="mb-2 sm:mr-4">Members</span>
          <div className="text-white">
            <div>
              <i className="fa fa-user-group" />
              <span className="ml-2">{pool?.members.length}</span>
            </div>
          </div>
        </div>
        <div>
          <ul className="text-xl text-slate-300">
            {pool?.members.map((member) => (
              <li key={member.id}>
                {member.userId === pool?.commissioner.id && (
                  <span className="text-bp-primary">Comissioner: </span>
                )}
                <span className="text-white">{member.user?.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const PoolPicksView = ({ pool, member }: PoolPicksViewProps) => {
  if (!pool || !member) return null;

  const { data } = api.schedules.getCurrentWeekAndYear.useQuery();
  const { data: picks } =
    api.picks.getAllPicksForPoolMemberByYearAndWeek.useQuery({
      membershipId: member.id,
      poolId: pool.id,
      year: data?.year.toString() ?? "",
      week: data?.week.toString() ?? "",
    });

  const { data: games } = api.competitions.getGamesByWeekAndYear.useQuery({
    week: data?.week.toString() ?? "",
    year: data?.year.toString() ?? "",
  });

  return (
    <div className="rounded-[50px] border-2 border-[#283441] bg-[#12171D] p-2 sm:p-[40px]">
      <div className="w-full text-3xl font-light uppercase text-slate-300 md:text-5xl">
        <div className="my-4 flex flex-col items-center">
          <div className="mb-8 w-full">
            {data?.year} Week {data?.week} Picks
          </div>
          <div className="w-full">
            {picks?.length === 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="text-xl">
                    <th className="text-left text-white">Away Team</th>
                    <th className="text-center text-white">Deadline</th>
                    <th className="text-right text-white">Home Team</th>
                  </tr>
                </thead>
                <tbody>
                  {games?.map((game) => (
                    <tr key={game.id}>
                      <td className="text-left text-white">
                        <div className="text-sm text-slate-300">
                          {
                            game.competitors?.find((c) => c.homeAway === "away")
                              ?.name
                          }
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col items-center text-center">
                          <div className="text-sm text-slate-300">
                            55/55/5555 55:5555
                          </div>
                        </div>
                      </td>
                      <td className="text-right text-white">
                        <div className="flex flex-col">
                          <div className="text-sm text-slate-300">
                            {
                              game.competitors?.find(
                                (c) => c.homeAway === "home"
                              )?.name
                            }
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span className="text-white">Picks made!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PoolSettingsView = ({ pool }: PoolSettingsViewProps) => {
  const { mutate } = api.pools.deletePool.useMutation({
    onSuccess: async (data) => {
      toast.success("Pool deleted successfully!");
      await router.push("/");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  return (
    <div className="rounded-[50px] border-2 border-[#283441] bg-[#12171D] p-[40px] text-center">
      <div className="text-4xl font-light uppercase text-slate-300">
        <div className="mb-4">
          <span>Settings</span>
        </div>
        <div>
          <button
            className="rounded-3xl bg-red-600 p-3 px-6 text-xl"
            onClick={() => mutate({ id: pool.id })}
          >
            Delete Pool
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Pools() {
  const { slug } = router.query;

  const pool = api.pools.findOne.useQuery({ id: slug as string })
    .data as PoolWithRelations;

  const { data: sessionData } = useSession();
  const currentUser = sessionData?.user;
  const currentMember = pool?.members.find(
    (member) => member.userId === currentUser?.id
  );

  const [activeTab, setActiveTab] = useState<string>("picks");

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "picks":
        return <PoolPicksView pool={pool} member={currentMember} />;
      case "members":
        return <PoolMembersView pool={pool} />;
      case "settings":
        return <PoolSettingsView pool={pool} />;
      default:
        return <PoolPicksView pool={pool} member={currentMember} />;
    }
  };

  return (
    <>
      <Head>
        <title>blitzpool - {pool?.name}</title>
        <meta
          name="description"
          content="Join Blitzpool, the ultimate NFL pick 'em site! Gain access to game schedules updated in real time, make weekly predictions, and compete with friends to see who can spot solid matchups with precision. Join the fun and enjoy the thrill of NFL football as you battle it out in Blitzpool official Pools or just amongst friends. Sign up now and prove yourself as the ultimate football oracle!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-full flex-col items-center p-6">
        <div>
          <PoolHeader
            pool={pool}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />

          {renderActiveTabContent()}
        </div>
      </main>
    </>
  );
}

Pools.requireAuth = true;
