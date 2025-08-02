import type { Metadata } from "next";
import { SignUp } from "../components/SignUp";

export const metadata: Metadata = {
  title: "Crie uma conta | SuperStudy",
  description: "Crie uma conta para começar a usar o SuperStudy",
  alternates: {
    canonical: "/sign-up",
  },
};

export default function SignUpPage() {
  return <SignUp />;
}
