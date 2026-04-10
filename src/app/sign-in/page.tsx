import type { Metadata } from "next";
import { SignInPanel } from "@/components/auth/sign-in-panel";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = { title: "Sign in — OpusRoster" };

export default function SignInPage() {
  return (
    <div className="flex min-h-screen">
      <SignInPanel />
      <SignInForm />
    </div>
  );
}
