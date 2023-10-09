import { type Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { type Dispatch, type SetStateAction, useState, useRef } from "react";
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
};

type PoolSettingsViewProps = {
  pool: PoolWithRelations;
};

const PoolHeader = ({ pool, setActiveTab, activeTab }: PoolHeaderProps) => {
  const picksRef = useRef<HTMLDivElement>(null);
  const membersRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  if (!pool) return null;

  const handleSetActiveTab = (e: React.MouseEvent<HTMLDivElement>) => {
    setActiveTab(e.currentTarget.id);
  };

  return (
    <div className="w-4/5 rounded-[50px] border-2 border-[#283441] bg-[#12171D] p-[40px] text-left sm:w-3/5 lg:mx-4 xl:p-[60px]">
      {/* Begin PoolHeader header information */}
      <div className="mb-6 text-4xl font-light uppercase text-white">
        <div>
          {pool.name}
          <div className="text-2xl text-slate-500">{pool.type.name}</div>
        </div>
      </div>

      {/* Begin PoolHeaderControls */}
      <div className="flex w-full cursor-pointer flex-col text-xl select-none uppercase text-slate-300 md:w-fit md:flex-row">
        <div
          id="picks"
          ref={picksRef}
          className={`border-b-4 border-slate-300 p-4 hover:bg-slate-500 ${
            activeTab === "picks" ? "bg-slate-500" : "bg-slate-700"
          } md:rounded-l-3xl md:border-b-0 md:border-r-4`}
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
          className={`p-4 hover:bg-slate-500 ${
            activeTab === "settings" ? "bg-slate-500" : "bg-slate-700"
          } md:rounded-r-3xl`}
          onClick={(e) => handleSetActiveTab(e)}
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
    <div className="mt-4 w-4/5 rounded-[50px] border-2 border-[#283441] bg-[#12171D] p-[40px] pt-[40px] text-left sm:w-3/5 lg:mx-4 xl:p-[60px] xl:text-left">
      <div className="text-4xl font-light uppercase text-slate-300">
        <div className="mb-4">
          <span className="mr-4">Members</span>
          <div className="text-white">
            <i className="fa fa-user-group" />
            &nbsp;<span>{pool?.members.length}</span>
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

const PoolPicksView = ({ pool }: PoolPicksViewProps) => {
  return (
    <div className="mt-4 w-4/5 rounded-[50px] border-2 border-[#283441] bg-[#12171D] p-[40px] pt-[40px] text-left sm:w-3/5 lg:mx-4 xl:p-[60px] xl:text-left">
      <div className="text-4xl font-light uppercase text-slate-300">
        <div className="mb-4">
          <span className="mr-4">Picks</span>
        </div>
      </div>
    </div>
  );
};

const PoolSettingsView = ({ pool }: PoolSettingsViewProps) => {
  return (
    <div className="mt-4 w-4/5 rounded-[50px] border-2 border-[#283441] bg-[#12171D] p-[40px] pt-[40px] text-left sm:w-3/5 lg:mx-4 xl:p-[60px] xl:text-left">
      <div className="text-4xl font-light uppercase text-slate-300">
        <div className="mb-4">
          <span className="mr-4">Settings</span>
        </div>
      </div>
    </div>
  );
};

export default function Pools() {
  const router = useRouter();
  const { slug } = router.query;

  const pool = api.pools.findOne.useQuery({ id: slug as string })
    .data as PoolWithRelations;

  const { data: sessionData } = useSession();
  const currentUserId = sessionData?.user.id ?? "";

  const [activeTab, setActiveTab] = useState<string>("picks");

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "picks":
        return <PoolPicksView pool={pool} />;
      case "members":
        return <PoolMembersView pool={pool} />;
      case "settings":
        return <PoolSettingsView pool={pool} />;
      default:
        return <PoolPicksView pool={pool} />;
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
      <main className="flex min-h-full flex-col items-center pb-6">
        <PoolHeader
          pool={pool}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />

        {renderActiveTabContent()}
      </main>
    </>
  );
}

Pools.requireAuth = true;
