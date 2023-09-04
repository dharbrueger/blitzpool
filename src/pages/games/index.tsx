import type { NextPage } from "next";
import Head from "next/head";

export default function GamesPage() {
  return (
    <>
      <Head>
        <title>blitzpool - games</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center"></div>
    </>
  );
}

GamesPage.requireAuth = true;
