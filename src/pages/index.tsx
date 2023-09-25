import { type Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState, type ReactNode } from "react";
import CreatePoolModal from "~/components/modals/CreatePoolModal";
import { api } from "~/utils/api";

interface HomeActionMenuProps {
  children: ReactNode;
}

interface HomeActionMenuCardProps {
  actionName: string;
  actionIcon: string;
  onClick?: () => void;
  enabled?: boolean;
}

type DashboardPoolsProps = {
  pools?: PoolsWithRelations[];
  currentUserId?: string;
};

type PoolsWithRelations = Prisma.PoolGetPayload<{
  include: { type: true; commissioner: true; members: true };
}>;

type DashboardPoolCardProps = {
  pool: PoolsWithRelations;
  currentUserId?: string;
};

const DashboardPools: React.FC<DashboardPoolsProps> = ({
  pools,
  currentUserId,
}) => {
  if (!pools || pools.length === 0) return null;

  return (
    <div className="w-4/5 border-[#283441] p-[20px] text-left lg:mx-4">
      <h1 className="text-4xl font-light uppercase text-white">My Pools</h1>
      <div className=" mb-6 text-xl font-light text-slate-500">
        work in progress...
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pools.map((pool) => (
          <DashboardPoolCard
            key={pool.id}
            pool={pool}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
};

const DashboardPoolCard: React.FC<DashboardPoolCardProps> = ({
  pool,
  currentUserId,
}) => {
  const userIsCommissioner = pool.commissioner.id === currentUserId;

  return (
    <div
      className="items-left mb-6 inline-flex flex-grow flex-col rounded-[30px] bg-gradient-to-br from-[#1b232c] via-[#12171D] 
                    to-[#0D0D10] p-6 font-light outline-none hover:outline-2 hover:outline-[#283441] sm:flex-row
    "
    >
      <div>
        <h1 className="mt-4 text-3xl uppercase text-white">{pool.name}</h1>
        <div className="mb-6 text-xl font-light uppercase text-slate-500">
          {pool.type.name}
        </div>
      </div>
      <div className="flex flex-1 flex-col items-start justify-center text-xl text-white sm:items-center">
        <div>
          <i className="fa fa-user-group">
            <span className="mx-2">{pool.members.length}</span>
          </i>
        </div>
        {userIsCommissioner && (
          <div className="flex flex-col sm:items-center">
            <hr className="my-1 hidden h-1 w-20 bg-white sm:block" />
            <div className="font-bold">C</div>
          </div>
        )}
      </div>
    </div>
  );
};

const HomeActionMenu: React.FC<HomeActionMenuProps> = ({ children }) => {
  return (
    <div className="w-4/5 rounded-[50px] border-2 border-[#283441] bg-[#12171D] p-[20px] text-center lg:mx-4">
      <h1 className="text-4xl font-light uppercase text-white">Dashboard</h1>
      <div className=" mb-6 text-xl font-light text-slate-500">
        more coming soon...
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        {children}
      </div>
    </div>
  );
};

const HomeActionMenuCard: React.FC<HomeActionMenuCardProps> = ({
  actionName,
  actionIcon,
  onClick,
  enabled,
}) => {
  if (!enabled)
    return (
      <div
        className="mb-6 inline-flex flex-grow cursor-not-allowed flex-col items-center rounded-[30px] grayscale bg-gradient-to-br from-[#12171D] to-[#283441] p-6 
                    text-center font-light text-gray-700 outline-none hover:outline-2 hover:outline-[#283441] md:mx-2 md:mt-4 md:p-8
    "
      >
        <i className={`fa text-7xl fa-${actionIcon}`}></i>
        <h1 className="mt-4 text-3xl uppercase">{actionName}</h1>
      </div>
    );

  return (
    <div
      onClick={onClick}
      className="mb-6 inline-flex flex-grow cursor-pointer flex-col items-center rounded-[30px] bg-gradient-to-br from-[#12171D] to-[#283441] p-6 text-center 
                    font-light text-white outline-none hover:outline-2 hover:outline-[#283441] md:mx-2 md:mt-4 md:p-8
    "
    >
      <i className={`fa text-7xl text-bp-primary fa-${actionIcon}`}></i>
      <h1 className="mt-4 text-3xl uppercase">{actionName}</h1>
    </div>
  );
};
export default function Home() {
  const [isCreatePoolModalOpen, setIsCreatePoolModalOpen] = useState(false);
  const { data: sessionData } = useSession();
  const currentUserId = sessionData?.user.id ?? "";

  const userPools = api.pools.userPools.useQuery({
    userId: currentUserId,
  }).data;

  return (
    <>
      <Head>
        <title>blitzpool - nfl pick &apos;em</title>
        <meta
          name="description"
          content="Join Blitzpool, the ultimate NFL pick 'em site! Gain access to game schedules updated in real time, make weekly predictions, and compete with friends to see who can spot solid matchups with precision. Join the fun and enjoy the thrill of NFL football as you battle it out in Blitzpool official Pools or just amongst friends. Sign up now and prove yourself as the ultimate football oracle!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-full flex-col items-center pb-6">
        <CreatePoolModal
          isOpen={isCreatePoolModalOpen}
          onClose={() => setIsCreatePoolModalOpen(false)}
        />
        <div className="flex w-full flex-col items-center gap-4">
          <HomeActionMenu>
            <HomeActionMenuCard
              actionName="Create A&nbsp;Pool"
              actionIcon="plus"
              onClick={() => setIsCreatePoolModalOpen(true)}
              enabled
            />
            <HomeActionMenuCard
              actionName="Join A&nbsp;Pool"
              actionIcon="user-plus"
            />
            <HomeActionMenuCard actionName="View Templates" actionIcon="file" />
          </HomeActionMenu>
          <DashboardPools pools={userPools} currentUserId={currentUserId} />
        </div>
      </main>
    </>
  );
}

Home.requireAuth = true;
