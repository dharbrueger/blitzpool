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

  const handlePrivacyCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      commissionerId: sessionData!.user.id 
    });
  };

  return (
    <Form.Root className="grid w-[320px]">
      <Form.Field className="mb-[10px] grid" name="poolName">
        <div className="flex items-center">
          <Form.Label className="mr-6 text-[15px] font-light leading-[35px] text-white">
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
            className="shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex h-[35px] w-4/5 appearance-none items-center justify-center rounded-[4px] bg-slate-400 px-[10px] text-[15px] leading-none text-black shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
            type="text"
            required
          />
        </Form.Control>
      </Form.Field>
      <Form.Field className="mb-[10px] grid" name="poolType">
        <div className="flex items-center w-full">
          <div className="mr-6 text-[15px] font-light leading-[35px] text-white">
            <div className="flex items-center w-full">
              <div className="mr-[120px]">pool type</div>

              <div className="flex items-center justify-center text-slate-400">
                <Form.Label className="mr-[5px]">private?</Form.Label>
                <input type="checkbox" name="poolPrivacy" onChange={handlePrivacyCheckboxChange} />
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
            className="shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex h-[35px] w-4/5 appearance-none items-center justify-center rounded-[4px] bg-slate-400 px-[10px] text-[15px] leading-none text-black shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
          />
        </Form.Control>
      </Form.Field>
      <div className="mt-6 flex flex-col sm:flex-row">
        <Form.Submit asChild className="mb-5">
          <button
            onClick={handleSubmit}
            className="mr-6 inline-flex h-[35px] w-4/5 items-center justify-center rounded-[34px] bg-bp-primary p-6 font-light uppercase text-black hover:bg-[#ffef5eb7] sm:w-2/5"
          >
            Create
          </button>
        </Form.Submit>
        <button
          className="inline-flex h-[35px] w-4/5 items-center justify-center rounded-[34px] bg-[#283441] px-4 py-6 font-light uppercase text-white hover:bg-[#2834418a] sm:w-2/5"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Form.Root>
  );
}
