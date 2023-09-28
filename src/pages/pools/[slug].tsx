import { type Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export type PoolsWithRelations = Prisma.PoolGetPayload<{
  include: { type: true; commissioner: true; members: true };
}>;

export default function Pools() {
  const router = useRouter();
  const { slug } = router.query;

  const pool = api.pools.findOne.useQuery({ id: slug as string }).data;

  const { data: sessionData } = useSession();
  const currentUserId = sessionData?.user.id ?? "";

  return (
    <>
      <Head>
        <title>blitzpool - {pool?.name}</title>
        <meta
          name="description"
          content="Join Blitzpool, the ultimate NFL pick 'em site! Gain access to game schedules updated in real time, make weekly predictions, and compete with friends to see who can spot solid matchups with precision. Join the fun and enjoy the thrill of NFL football as you battle it out in Blitzpool official Pools or just amongst friends. Sign up now and prove yourself as the ultimate football oracle!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-full flex-col items-center pb-6">
        <div className="w-fit sm:w-3/5 rounded-[50px] border-2 border-[#283441] bg-[#12171D] text-center pt-[40px]  p-[40px] xl:p-[60px] xl:text-left lg:mx-4">
          <div className="text-4xl font-light uppercase text-white">
            <div>
              {pool?.name ?? "No Pool Name"}
              <h1 className="text-2xl font-light uppercase text-slate-500">
                {pool?.type.name ?? "No Pool Type"}
              </h1>
            </div>
          </div>
          <div className="mt-6">
            <h1 className="text-2xl font-light uppercase text-slate-300">Members:</h1>
            <ul className="text-white">
              {pool?.members.map((member) => (
                <li key={member.id}>{member.user?.name}</li>
              ))}
            </ul>
          </div>
        </div>
        {/* <CreatePoolModal
          isOpen={isCreatePoolModalOpen}
          onClose={() => setIsCreatePoolModalOpen(false)}
          loadUserPools={loadUserPools}
        /> */}
        <div className="flex w-full flex-col items-center gap-4"></div>
      </main>
    </>
  );
}

Pools.requireAuth = true;
