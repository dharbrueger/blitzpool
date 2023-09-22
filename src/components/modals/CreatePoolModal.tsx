import { Dialog } from "@headlessui/react";
import CreatePoolForm from "../forms/CreatePoolForm";

export default function CreatePoolModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl rounded-[50px] border-2 border-[#283441] bg-[#12171D] p-12 text-white">
          <Dialog.Title className="mb-4 text-5xl font-light">
            New Pool
          </Dialog.Title>
          <Dialog.Description className="text-slate-700">
            Note: you will be assigned as the pool commissioner.
          </Dialog.Description>

          <div className="mt-4">
            <CreatePoolForm onClose={onClose}/>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
