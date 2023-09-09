import Head from "next/head";
import type { ReactNode } from "react";

interface HomeActionMenuProps {
  children: ReactNode;
}

interface HomeActionMenuCardProps {
  actionName: string;
  actionIcon: string;
}

const HomeActionMenu: React.FC<HomeActionMenuProps> = ({ children }) => {
  return (
    <div className="text-center bg-[#12171D] rounded-[50px] min-w-[95%] border-2 border-[#283441] lg:mx-4 p-[20px]">
      <h1 className="text-white font-light uppercase text-4xl mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {children}
      </div>
    </div>
  );
};

const HomeActionMenuCard: React.FC<HomeActionMenuCardProps> = ({actionName, actionIcon}) => {
  return (
    <div className="flex-grow inline-flex flex-col items-center text-center bg-gradient-to-br from-[#12171D] to-[#283441] rounded-[30px] 
                    p-6 mb-6 md:p-8 md:mx-2 md:mt-4 font-light cursor-pointer outline-none hover:outline-2 hover:outline-[#283441]
    ">
      <i className={`text-bp-primary text-7xl fa fa-${actionIcon}`}></i>
      <h1 className="text-white text-3xl mt-4 uppercase select-none">{actionName}</h1>
    </div>
  );
};
export default function Home() {
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
        <HomeActionMenu>
          <HomeActionMenuCard actionName="Create A&nbsp;Pool" actionIcon="plus" />
          <HomeActionMenuCard actionName="Join A&nbsp;Pool" actionIcon="user-plus" />
          <HomeActionMenuCard actionName="View Templates" actionIcon="file" />
        </HomeActionMenu>
      </main>
    </>
  );
}

Home.requireAuth = true;
