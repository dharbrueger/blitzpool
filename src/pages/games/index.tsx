import type { NextPage } from "next";
import Head from "next/head";

const GamesPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>blitzpool - schedules</title>
        <meta
          name="description"
          content="Get access to real time NFL schedule data."
        />
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center"></div>
    </>
  );
};

export default GamesPage;
