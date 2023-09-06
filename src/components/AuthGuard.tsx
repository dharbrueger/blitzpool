import { useAuth } from "./AuthProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { RiseLoader } from "react-spinners";

export default function AuthGuard({ children }: { children: JSX.Element }) {
  const { user, initializing, setRedirect } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (!initializing) {
        // auth is initialized and there is no user
        if (!user) {
          // remember the page that the user tried to access
          setRedirect(router.route);
          await router.push("/auth");
        }
      }
    };

    void checkUserAndRedirect();
  }, [initializing, router, user, setRedirect]);

  /* show loading indicator while the auth provider is still initializing */
  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#202232] to-[#0D0D10]">
        <RiseLoader color="#36d7b7" />
      </div>
    );
  }

  // if auth initialized with a valid user show protected page
  if (!initializing && user) {
    return <>{children}</>;
  }

  /* otherwise don't return anything, will do a redirect from useEffect */
  return null;
}
