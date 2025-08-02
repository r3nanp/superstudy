"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/button";
import {
  Form,
  FormControl,
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
import {
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Branding } from "@/components/branding";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "@/components/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginSchema = z.object({
  email: z.email({ message: "Email inválido." }),
  password: z.string().min(8, {
    message: "Senha deve ter pelo menos 8 caracteres.",
  }),
});

export function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof LoginSchema>) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const data = await response.json();

        if (data.error.code === "INVALID_CREDENTIALS") {
          toast.error("Email ou senha inválidos");
          return;
        }

        throw new Error(data.error.message);
      }

      return response.json();
    },
    onError: (error) => {
      if (error.message.includes("USER_NOT_FOUND")) {
        toast.info("Deseja criar uma nova conta?", {
          action: {
            label: "Criar conta",
            onClick: () => {
              router.push("/sign-up");
            },
          },
        });
      } else {
        toast.error(
          error instanceof Error ? error.message : "Erro ao fazer login"
        );
      }
    },
    onSuccess: () => {
      router.push("/app");
    },
  });

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    await login(data);
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-5">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-4">
          <Branding />
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            Entre com seu email e senha para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Spinner className="size-5 animate-spin" />
                ) : (
                  <>
                    Entrar
                    <ArrowRightIcon className="size-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
