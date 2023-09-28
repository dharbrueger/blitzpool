import React, { useState, useMemo } from "react";
import Pagination from "../components/Pagination";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import type { PoolsWithRelations } from "~/pages";

const PageSize = 5;

type PoolGridProps = {
  onClose: () => void;
  loadUserPools: (pools: PoolsWithRelations[]) => void;
};

export default function PoolGrid({ onClose, loadUserPools }: PoolGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const currentUserId = useSession()?.data?.user?.id;

  const pools = api.pools.publicList
    .useQuery()
    .data?.filter(
      (pool) => !pool.members.some((member) => member.userId === currentUserId)
    );

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return pools?.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, pools]);

  const { mutate } = api.pools.joinPool.useMutation({
    onSuccess: (data) => {
      toast.success("Pool joined successfully!");
      onClose();
      loadUserPools(data);
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  const handleJoinPool = (id: string) => {
    mutate({
      id,
      userId: currentUserId!,
    });
  };

  return (
    <>
      {currentTableData?.length === 0 ? (
        <div className="text-xl font-light uppercase text-slate-500">
          No public pools available
        </div>
      ) : (
        <table className="w-full border-separate border-spacing-y-4">
          <thead className="text-left">
            <tr>
              <th className="text-xl font-light uppercase text-slate-400">
                NAME
              </th>
              <th className="text-xl font-light uppercase text-slate-400">
                Commissioner
              </th>
              <th className="text-xl font-light uppercase text-slate-400">
                Members
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTableData?.map((item) => {
              return (
                <tr
                  key={item.id}
                  onClick={() => handleJoinPool(item.id)}
                  className="w-full cursor-pointer bg-[#1b232c] pl-2 text-xl text-slate-200 hover:bg-[#0D0D10]"
                >
                  <td className="py-4 pl-2 pr-6">{item.name}</td>
                  <td className="">{item.commissioner.name}</td>
                  <td className="">{item.members.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <Pagination
        currentPage={currentPage}
        totalCount={pools?.length ?? 0}
        pageSize={PageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
}
