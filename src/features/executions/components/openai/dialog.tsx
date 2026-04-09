"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";

import { useForm } from "@tanstack/react-form";
import { useStore } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";

export const AVAILABLE_MODELS = [
  "gpt-4.1-nano",
  "gpt-4.1-mini",
  "gpt-4.1",
  "gpt-4o",
  "gpt-4o-mini-2024-07-18",
  "gpt-5-2025-08-07",
  "gpt-5.1",
  "gpt-5.2-2025-12-11",
  "gpt-5.2-pro-2025-12-11",
  "o4-mini-2025-04-16",
] as const;

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z-0-9_$]*$/, {
      message:
        "Variable name must start with a letter or underscore and contain only letters, numbers or underscores",
    }),
  model: z.enum(AVAILABLE_MODELS),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt is required"),
  //.refine(),
});

export type OpenAIValues = z.infer<typeof formSchema>;

type OpenAIProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<OpenAIValues>;
};

export const OpenAIDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: OpenAIProps) => {
  const form = useForm({
    defaultValues: {
      model: defaultValues.model || AVAILABLE_MODELS[0],
      systemPrompt: defaultValues.systemPrompt || "",
      userPrompt: defaultValues.userPrompt || "",
      variableName: defaultValues.variableName || "",
    } as OpenAIValues,

    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        model: defaultValues.model || AVAILABLE_MODELS[0],
        systemPrompt: defaultValues.systemPrompt || "",
        userPrompt: defaultValues.userPrompt || "",
        variableName: defaultValues.variableName || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = useStore(
    form.store,
    (state) => state.values.variableName || "openai",
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Open AI</DialogTitle>
          <DialogDescription>
            Configure the AI model and prompts for this node
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-8 mt-4"
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="variableName"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Variable Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="openai"
                    autoComplete="off"
                  />
                  <FieldDescription>
                    "Use this name to reference the result in other nodes:{" "}
                    {`{{${watchVariableName}.aiResponse}}`}
                  </FieldDescription>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              );
            }}
          />
          <FieldGroup>
            <form.Field
              name="model"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Model</FieldLabel>
                    <Select
                      onValueChange={(value) =>
                        field.handleChange(
                          value as (typeof AVAILABLE_MODELS)[number],
                        )
                      }
                      defaultValue={field.state.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_MODELS.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      The OpenAI Model to use for completion
                    </FieldDescription>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            />

            <form.Field
              name="systemPrompt"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      System Prompt (Optional)
                    </FieldLabel>
                    <Textarea
                      className="min-h-20 font-mono text-sm"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="You are a helpfull assistant"
                      autoComplete="off"
                    />
                    <FieldDescription>
                      Sets the behavior of assistant. Use {"{{variables}}"} for
                      simple values or {"{{json variable}}"} to stringify
                      objects
                    </FieldDescription>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            />

            <form.Field
              name="userPrompt"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>User Prompt</FieldLabel>
                    <Textarea
                      className="min-h-30 font-mono text-sm"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Summarize this text {{json httpResponse.data}}"
                      autoComplete="off"
                    />
                    <FieldDescription>
                      The prompt to send to AI. Use {"{{variables}}"} for simple
                      values or {"{{json variable}}"} to stringify objects
                    </FieldDescription>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
