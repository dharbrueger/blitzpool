import Head from "next/head";

export default function Home() {

  return (
    <>
      <Head>
        <title>blitzpool - nfl pick 'em</title>
        <meta name="description" content="Join Blitzpool, the ultimate NFL pick 'em site! Gain access to game schedules updated in real time, make weekly predictions, and compete with friends to see who can spot solid matchups with precision. Join the fun and enjoy the thrill of NFL football as you battle it out in Blitzpool official Pools or just amongst friends. Sign up now and prove yourself as the ultimate football oracle!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#202232] to-[#0D0D10]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        </div>
      </main>
    </>
  );
}
