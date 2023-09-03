import { FaUser } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

const AuthShowcase = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="text-white">
      {sessionData && (
        <div className="flex items-center">
          <div className="text-black mr-4 flex cursor-pointer items-center rounded-full bg-white px-8 py-2 font-semibold no-underline transition hover:bg-white/80">
            {sessionData.user.image ? (
              <Image
                src={sessionData.user.image}
                width={32}
                height={32}
                alt="User Avatar"
                className="rounded-full"
              />
            ) : (
              <FaUser className="h-6 w-6 rounded-full" />
            )}
            <div className="ml-4">
              <Link href="/profile">{sessionData.user.name}</Link>
            </div>
          </div>
          <div
            className="flex cursor-pointer items-center rounded-full bg-white/10 px-10 py-2 no-underline transition hover:bg-white/20"
            onClick={() => void signOut()}
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthShowcase;
