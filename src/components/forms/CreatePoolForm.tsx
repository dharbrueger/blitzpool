import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import PoolTypeSelector from "../selectors/PoolTypeSelector";
import { useSession } from "next-auth/react";
import { type PoolsWithRelations } from "~/pages";

type CreatePoolFormProps = {
  onClose: () => void;
  loadUserPools: (pools: PoolsWithRelations[]) => void;
};

export default function CreatePoolForm({
  onClose,
  loadUserPools,
}: CreatePoolFormProps) {
  const [name, setName] = useState("");
  const [poolTypeId, setPoolTypeId] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const { data: sessionData } = useSession();

  const handlePoolTypeChange = (value: string) => {
    setPoolTypeId(value);
  };

  const handlePrivacyCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsPrivate(event.target.checked);
  };

  const { mutate } = api.pools.create.useMutation({
    onSuccess: (data) => {
      toast.success("Pool created successfully!");
      loadUserPools(data);
      onClose();
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

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (!name) {
      toast.error("Please enter a pool name");
      return;
    }

    mutate({
      name,
      private: isPrivate,
      typeId: poolTypeId,
      commissionerId: sessionData!.user.id,
    });
  };

  return (
    <Form.Root className="grid w-[280px] md:w-[500px]">
      <Form.Field className="mb-9 grid" name="poolName">
        <Form.Label className="mr-6 text-lg font-light uppercase leading-[35px] text-white">
          pool name
        </Form.Label>
        <Form.Message
          className="text-left text-[13px] text-red-500 opacity-[0.8]"
          match="valueMissing"
        >
          Please enter a pool name
        </Form.Message>
        <Form.Control asChild>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="box-border inline-flex h-[40px] items-center justify-center border-b-2 border-solid border-slate-500 bg-transparent text-lg outline-none"
            type="text"
            required
          />
        </Form.Control>
      </Form.Field>
      <Form.Field className="mb-[10px] grid" name="poolType">
        <div className="flex w-full items-center">
          <div className="w-full text-lg font-light leading-[35px] text-white">
            <div className="flex w-full">
              <div className="uppercase">pool type</div>

              <div className="flex flex-1 items-center justify-end text-slate-400">
                <Form.Label className="mr-[5px]">private?</Form.Label>
                <input
                  type="checkbox"
                  name="poolPrivacy"
                  onChange={handlePrivacyCheckboxChange}
                />
              </div>
            </div>
          </div>
          <Form.Message
            className="text-left text-[13px] text-red-500 opacity-[0.8]"
            match="valueMissing"
          >
            Please enter a pool type
          </Form.Message>
        </div>
        <Form.Control asChild>
          <PoolTypeSelector
            onChange={handlePoolTypeChange}
            className="box-border inline-flex h-[40px] items-center justify-center border-b-2 border-solid border-slate-500 bg-transparent text-lg outline-none"
            optionsClassName="bg-black text-white"
          />
        </Form.Control>
      </Form.Field>
      <div className="mt-6 flex flex-col sm:flex-row">
        <button
          onClick={(e) => handleSubmit(e)}
          className="mb-4 mr-6 inline-flex h-[35px] w-full items-center justify-center rounded-[6px] bg-bp-primary p-6 font-light uppercase text-black hover:bg-[#ffef5eb7] sm:w-2/5"
        >
          Create
        </button>
        <button
          className="inline-flex h-[35px] items-center justify-center rounded-[6px] border-2 border-b-2 border-solid bg-transparent px-4 py-6 font-light uppercase text-white hover:bg-[#2834418a] sm:w-2/5"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Form.Root>
  );
}
