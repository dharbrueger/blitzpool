import { FaUser } from "react-icons/fa";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const AuthShowcase = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      {!sessionData && (
        <div className="flex flex-col items-center justify-center gap-4">
          <div
            className="flex cursor-pointer items-center rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={() => void signIn()}
          >
            Login
          </div>
        </div>
      )}
      {sessionData && (
        <div className="flex items-center">
          <div className="mr-4 flex cursor-pointer items-center rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
            {sessionData.user.image ? (
              <img
                src={sessionData.user.image ?? "/images/default-avatar.png"}
                alt="User Avatar"
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <FaUser className="h-8 w-8 rounded-full" />
            )}
            <div className="ml-4 font-semibold text-white">
              <Link href="/profile">{sessionData.user.name}</Link>
            </div>
          </div>
          <div
            className="flex cursor-pointer items-center rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={() => void signOut()}
          >
            Logout
          </div>
        </div>
      )}
    </>
  );
};

export default AuthShowcase;
