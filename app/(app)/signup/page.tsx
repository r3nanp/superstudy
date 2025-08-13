import type { Metadata } from "next";

import { SignUpPage } from "../components/signup";

export const metadata: Metadata = {
  title: "Crie uma conta | SuperStudy",
  description: "Crie uma conta para começar a usar o SuperStudy",
  alternates: {
    canonical: "/sign-up",
  },
};

export default function SignUp() {
  return <SignUpPage />;
}
