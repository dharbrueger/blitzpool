import { Dialog } from "@headlessui/react";
import CreatePoolForm from "../forms/CreatePoolForm";
import { type PoolsWithRelations } from "~/pages";

export default function CreatePoolModal({
  isOpen,
  onClose,
  loadUserPools,
}: {
  isOpen: boolean;
  onClose: () => void;
  loadUserPools: (pools: PoolsWithRelations[]) => void;
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-[100%] rounded-[50px] border-2 border-[#283441] bg-[#12171D] p-10 text-white">
          <Dialog.Title className="mb-4 text-5xl font-light uppercase">
            New Pool
          </Dialog.Title>
          <Dialog.Description className="text-slate-500">
            Note: you will be assigned as the&nbsp;pool&nbsp;commissioner.
          </Dialog.Description>

          <div className="mt-4">
            <CreatePoolForm onClose={onClose} loadUserPools={loadUserPools} />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
