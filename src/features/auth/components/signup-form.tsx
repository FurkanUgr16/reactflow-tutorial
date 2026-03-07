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
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

const signupSchema = z
  .object({
    fullName: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
  });

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const signupForm = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: signupSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        await authClient.signUp.email({
          name: value.fullName,
          email: value.email,
          password: value.password,
          fetchOptions: {
            onSuccess: () => {
              toast.success("Signup Successfully");
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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signupForm.handleSubmit();
            }}
          >
            <FieldGroup>
              <signupForm.Field
                name="fullName"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="John Doe"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <signupForm.Field
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
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <signupForm.Field
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
                  <signupForm.Field
                    name="confirmPassword"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>
                            Confirm Password
                          </FieldLabel>
                          <Input
                            type="password"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            autoComplete="off"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button disabled={isPending} type="submit">
                  {isPending ? "Loading..." : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="#">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
