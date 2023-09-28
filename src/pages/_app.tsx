import { type Session } from "next-auth";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Navbar from "~/components/Navbar";
import { AuthProvider } from "~/components/AuthProvider";
import AuthGuard from "~/components/AuthGuard";
import type { NextPage } from "next";
import { SessionProvider } from "next-auth/react";
import { Raleway } from "next/font/google";
import { Toaster } from "react-hot-toast";
const raleway = Raleway({ subsets: ["latin"] });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NextApplicationPage<P = any, IP = P> = NextPage<P, IP> & {
  requireAuth?: boolean;
};

const Blitzpool: AppType<{ session: Session | null }> = ({
  Component: PageComponent,
  pageProps: { session, ...pageProps },
}) => {
  const Component = PageComponent as NextApplicationPage;

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={24}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 2000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          // Default options for specific types
          success: {
            duration: 3000,
          },
        }}
      />
      <div
        className={`${raleway.className} min-h-screen bg-gradient-to-b from-[#202232] to-[#0D0D10]`}
      >
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
    </>
  );
};

export default api.withTRPC(Blitzpool);
