"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        await authClient.signIn.email({
          email: value.email,
          password: value.password,
          fetchOptions: {
            onSuccess: () => {
              toast.success("Login Successfully");
              router.replace("/");
            },
            onError: ({ error }) => {
              toast.error(error.message);
            },
          },
        });
      });
    },
  });

  const githubSignIn = async () => {
    await authClient.signIn.social({
      provider: "github",
      fetchOptions: {
        onSuccess: () => {
          router.replace("/");
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    });
  };

  const googleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      fetchOptions: {
        onSuccess: () => {
          router.replace("/");
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              loginForm.handleSubmit();
            }}
          >
            <FieldGroup>
              <Field>
                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    disabled={isPending}
                    onClick={githubSignIn}
                  >
                    <Image
                      alt="GitHub"
                      src="/logos/github.svg"
                      width={20}
                      height={20}
                    />
                    Login with Github
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    disabled={isPending}
                    onClick={googleSignIn}
                  >
                    <Image
                      alt="Google"
                      src={"/logos/google.svg"}
                      width={20}
                      height={20}
                    />
                    Login with Google
                  </Button>
                </div>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <loginForm.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        type="email"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="m@example.com"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <loginForm.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        type="password"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="********"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <Field>
                <Button disabled={isPending} type="submit">
                  {isPending ? "Loading..." : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      {/* <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription> */}
    </div>
  );
}
