import React from "react";
import * as Form from "@radix-ui/react-form";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { signIn } from "next-auth/react";

const AuthForm = () => (
  <Form.Root className="grid w-[320px]">
    <Form.Field className="mb-[10px] grid" name="email">
      <div className="flex items-baseline justify-between">
        <Form.Label className="text-[15px] font-light leading-[35px] text-white">
          email
        </Form.Label>
        <Form.Message
          className="text-[13px] text-white opacity-[0.8]"
          match="valueMissing"
        >
          Please enter your email
        </Form.Message>
        <Form.Message
          className="text-[13px] text-white opacity-[0.8]"
          match="typeMismatch"
        >
          Please provide a valid email
        </Form.Message>
      </div>
      <Form.Control asChild>
        <input
          className="shadow-blackA9 selection:color-white selection:bg-blackA9 box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded-[4px] bg-slate-400 px-[10px] text-[15px] leading-none text-black shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
          type="email"
          required
        />
      </Form.Control>
    </Form.Field>
    <Form.Field className="mb-[10px] grid" name="password">
      <div className="flex items-baseline justify-between">
        <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
          password
        </Form.Label>
        <Form.Message
          className="text-[13px] text-white opacity-[0.8]"
          match="valueMissing"
        >
          Please enter your password
        </Form.Message>
      </div>
      <Form.Control asChild>
        <input
          className="shadow-blackA9 selection:color-white selection:bg-blackA9 mb-[15px] box-border inline-flex h-[35px] w-full resize-none appearance-none items-center justify-center rounded-[4px] bg-slate-400 px-[10px] text-[15px] leading-none text-black shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
          type="password"
          required
        />
      </Form.Control>
    </Form.Field>
    <Form.Submit asChild className="mb-5">
      <button className="text-violet11 shadow-blackA7 hover:bg-mauve3 box-border inline-flex h-[35px] w-2/5 items-center justify-center place-self-center rounded-[4px] bg-bp-primary px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none">
        Sign In
      </button>
    </Form.Submit>
    <div
      onClick={() => void signIn('google', { callbackUrl: '/schedules' })}
      className="text-violet11 shadow-blackA7 hover:bg-mauve3 mb-[75px] box-border inline-flex h-[35px] w-3/5 cursor-pointer items-center justify-center place-self-center rounded-[4px] bg-white font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
    >
      <i className="fab fa-google pr-3"></i> Sign In with Google
    </div>
    <div className="text-light place-self-center text-gray-600">
      <span className="pr-[5px]">don&apos;t have an account?</span>
      <a href="/signup" className="text-white">
        sign up
      </a>
    </div>
  </Form.Root>
);

export default AuthForm;
