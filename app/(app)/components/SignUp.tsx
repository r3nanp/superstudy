"use client";

import {
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { Input } from "@/components/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Branding } from "@/components/branding";
import { signup } from "@/lib/actions/auth";
import { Spinner } from "@/components/spinner";

const FormSchema = z
  .object({
    name: z.string().min(1, { message: "Nome é obrigatório." }),
    email: z.email({ message: "Email inválido." }),
    password: z.string().min(8, {
      message: "Senha deve ter pelo menos 8 caracteres.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Confirmação de senha deve ter pelo menos 8 caracteres.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem.",
  });

type SignUpFormData = z.infer<typeof FormSchema>;

export function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync: signupMutation, isPending } = useMutation({
    mutationFn: async (data: SignUpFormData) => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("name", data.name);

      await signup(formData);
    },
    onSuccess: () => {
      toast.success("Conta criada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar conta!");
    },
  });

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SignUpFormData) {
    await signupMutation(data);
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-5">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-4">
          <Branding />
          <CardTitle>Crie uma conta</CardTitle>
          <CardDescription>
            Crie uma conta para começar a usar o superstudy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormDescription>
                      Este nome será usado para identificar você no sistema.
                    </FormDescription>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="pr-10"
                        />

                        <button
                          type="button"
                          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <EyeIcon className="size-5" />
                          ) : (
                            <EyeSlashIcon className="size-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmação de senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          className="pr-10"
                        />

                        <button
                          type="button"
                          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                        >
                          {showPassword ? (
                            <EyeIcon className="size-5" />
                          ) : (
                            <EyeSlashIcon className="size-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Criando conta..." : "Começar agora"}
                {isPending ? (
                  <Spinner className="size-5" />
                ) : (
                  <ArrowRightIcon className="size-5" />
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
