import Head from "next/head";
import { useState, type ReactNode } from "react";
import CreatePoolModal from "~/components/modals/CreatePoolModal";

interface HomeActionMenuProps {
  children: ReactNode;
}

interface HomeActionMenuCardProps {
  actionName: string;
  actionIcon: string;
  onClick?: () => void;
}

const DashboardPools: React.FC = () => (
  <div className="w-4/5 border-[#283441] p-[20px] text-left lg:mx-4">
    <h1 className="mb-6 text-4xl font-light uppercase text-white">My Pools</h1>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ">
      {/* {children} */}
    </div>
  </div>
);

const DashboardPoolCard: React.FC = () => (
  <div className="flex-grow inline-flex flex-col items-center text-center bg-gradient-to-br from-[#12171D] to-[#283441] rounded-[30px] 
                    p-6 mb-6 md:p-8 md:mx-2 md:mt-4 font-light cursor-pointer outline-none hover:outline-2 hover:outline-[#283441]
    ">
    <i className={`text-bp-primary text-7xl fa fa-plus`}></i>
    <h1 className="text-white text-3xl mt-4 uppercase">Create A&nbsp;Pool</h1>
  </div>
);

const HomeActionMenu: React.FC<HomeActionMenuProps> = ({ children }) => {
  return (
    <div className="text-center bg-[#12171D] rounded-[50px] w-4/5 border-2 border-[#283441] lg:mx-4 p-[20px]">
      <h1 className="text-white font-light uppercase text-4xl">Dashboard</h1>
      <div className=" text-slate-500 font-light text-xl mb-6">coming soon...</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {children}
      </div>
    </div>
  );
};

const HomeActionMenuCard: React.FC<HomeActionMenuCardProps> = ({actionName, actionIcon, onClick}) => {
  return (
    <div
      // onClick={onClick}
      className="flex-grow cursor-not-allowed text-gray-700 grayscale inline-flex flex-col items-center text-center bg-gradient-to-br from-[#12171D] to-[#283441] rounded-[30px] 
                    p-6 mb-6 md:p-8 md:mx-2 md:mt-4 font-light outline-none hover:outline-2 hover:outline-[#283441]
    ">
      <i className={`text-7xl fa fa-${actionIcon}`}></i>
      <h1 className="text-3xl mt-4 uppercase">{actionName}</h1>
    </div>
  );
};
export default function Home() {
  const [isCreatePoolModalOpen, setIsCreatePoolModalOpen] = useState(false);

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
        <div className="flex flex-col items-center gap-4 w-full">
          <HomeActionMenu>
            <HomeActionMenuCard
              actionName="Create A&nbsp;Pool"
              actionIcon="plus"
              onClick={() => setIsCreatePoolModalOpen(true)}
            />
            <HomeActionMenuCard
              actionName="Join A&nbsp;Pool"
              actionIcon="user-plus"
            />
            <HomeActionMenuCard actionName="View Templates" actionIcon="file" />
          </HomeActionMenu>
          {/* <DashboardPools /> */}
        </div>
      </main>
    </>
  );
}

Home.requireAuth = true;
