import { type Session } from "next-auth";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import dynamic from "next/dynamic";
import { AuthProvider } from "~/components/AuthProvider";
import AuthGuard from "~/components/AuthGuard";
import type { NextPage } from "next";
import { SessionProvider } from "next-auth/react";
const Navbar = dynamic(() => import("~/components/Navbar"), {
  ssr: false,
});

export type NextApplicationPage<P = any, IP = P> = NextPage<P, IP> & {
  requireAuth?: boolean;
};

const Blitzpool: AppType<{ session: Session | null }> = ({
  Component: PageComponent,
  pageProps: { session, ...pageProps },
}) => {
  const Component = PageComponent as NextApplicationPage;
  console.log(session);

  return (
    <div className="bg-gradient-to-b from-[#202232] to-[#0D0D10]">
      <SessionProvider session={session}>
        <AuthProvider>
          {/* if requireAuth property is present - protect the page */}
          {Component.requireAuth ? (
            <AuthGuard>
              <>
                <Navbar />
                <Component {...pageProps} />
              </>
            </AuthGuard>
          ) : (
            <>
              <Component {...pageProps} />
            </>
          )}
        </AuthProvider>
      </SessionProvider>
    </div>
  );
};

export default api.withTRPC(Blitzpool);
