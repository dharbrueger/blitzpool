import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import dynamic from "next/dynamic";
import { Raleway } from 'next/font/google';
const raleway = Raleway({ subsets: ['latin'] });
const Navbar = dynamic(() => import("~/components/Navbar"), {
  ssr: false,
});

const Blitzpool: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div className={`${raleway.className} bg-gradient-to-b from-[#202232] to-[#0D0D10]`}>
      <SessionProvider session={session}>
        <Navbar />
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  );
};

export default api.withTRPC(Blitzpool);
