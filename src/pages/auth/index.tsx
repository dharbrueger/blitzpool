import Head from "next/head";
import Image from "next/image";
import LogoImage from "public/logo.png";
import AuthForm from "./AuthForm";

export default function Auth() {
  return (
    <>
      <Head>
        <title>blitzpool - log in / sign up</title>
        <meta
          name="description"
          content="Join Blitzpool, the ultimate NFL pick 'em site! Gain access to game schedules updated in real time, make weekly predictions, and compete with friends to see who can spot solid matchups with precision. Join the fun and enjoy the thrill of NFL football as you battle it out in Blitzpool official Pools or just amongst friends. Sign up now and prove yourself as the ultimate football oracle!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col items-center">
        <div className="mx-12 mt-24 pb-8">
          <Image src={LogoImage} alt="The Blitzpool logo." quality={100} />
        </div>
        <div className="text-2xl font-light text-white">
          Sign in to your account
        </div>
        <div className="mt-8 flex flex-col items-center">
          <AuthForm />
        </div>
      </div>
    </>
  );
}
