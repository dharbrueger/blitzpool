import Head from "next/head";

export default function ProfilePage() {
  return (
    <>
      <Head>
        <title>blitzpool - profile</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center"></div>
    </>
  );
}

ProfilePage.requireAuth = true;
