import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import PoolTypeSelector from "../selectors/PoolTypeSelector";
import { useSession } from "next-auth/react";

type CreatePoolFormProps = {
  onClose: () => void;
};

export default function CreatePoolForm({ onClose }: CreatePoolFormProps) {
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
    onSuccess: () => {
      toast.success("Pool created successfully!");
      onClose();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  const handleSubmit = () => {
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
        <div className="flex items-center max-w-[90%]">
          <Form.Label className="mr-6 text-lg font-light uppercase leading-[35px] text-white">
            pool name
          </Form.Label>
          <Form.Message
            className="text-left text-[13px] text-red-500 opacity-[0.8]"
            match="valueMissing"
          >
            Please enter a pool name
          </Form.Message>
        </div>
        <Form.Control asChild>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow-blackA9 selection:color-white border-b-2 border-solid border-slate-500 selection:bg-blackA9 box-border inline-flex h-[40px] appearance-none items-center justify-center bg-transparent underline px-[10px] text-lg outline-none"
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

              <div className="flex items-center justify-end flex-1 text-slate-400">
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
            className="border-b-2 border-solid border-slate-500 box-border inline-flex h-[40px] items-center justify-center bg-transparent pr-[10px] text-lg outline-none"
            optionsClassName="bg-black text-white"
          />
        </Form.Control>
      </Form.Field>
      <div className="mt-6 flex flex-col sm:flex-row">
        <Form.Submit asChild className="mb-5">
          <button
            onClick={handleSubmit}
            className="mr-6 inline-flex h-[35px] w-full items-center justify-center rounded-[6px] bg-bp-primary p-6 font-light uppercase text-black hover:bg-[#ffef5eb7] sm:w-2/5"
          >
            Create
          </button>
        </Form.Submit>
        <button
          className="inline-flex h-[35px] items-center justify-center rounded-[6px] bg-transparent border-2 border-b-2 border-solid px-4 py-6 font-light uppercase text-white hover:bg-[#2834418a] sm:w-2/5"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Form.Root>
  );
}
