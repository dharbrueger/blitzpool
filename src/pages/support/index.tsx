import Head from "next/head";

export default function SupportPage() {
  return (
    <>
      <Head>
        <title>blitzpool - support</title>
        <meta
          name="description"
          content="Find help in the documentation or contact the support team for further assistance."
        />
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center"></div>
    </>
  );
}

SupportPage.requireAuth = true;
