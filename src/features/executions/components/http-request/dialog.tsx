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

const formSchema = z.object({
  endpoint: z.url({ message: "Please enter a valid url" }),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
  //.refine(),
});

export type FormValues = z.infer<typeof formSchema>;

type ManualTriggerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<FormValues>;
};

export const HTTPRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: ManualTriggerDialogProps) => {
  const form = useForm({
    defaultValues: {
      endpoint: defaultValues.endpoint,
      method: defaultValues.method,
      body: defaultValues.body,
    } as FormValues,

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
        endpoint: defaultValues.endpoint || "",
        method: defaultValues.method || "GET",
        body: defaultValues.body || "",
      });
    }
  }, [open, defaultValues, form]);

  const method = useStore(form.store, (state) => state.values.method);
  const showBodyField = ["POST", "PUT", "PATCH"].includes(method);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>
            Configure settings for the HTTP Request node
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-8 mt-4"
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field
              name="method"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Method</FieldLabel>
                    <Select
                      defaultValue={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as FormValues["method"])
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a" />
                      </SelectTrigger>
                      <SelectContent>
                        {["GET", "POST", "PUT", "PATCH", "DELETE"].map(
                          (method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      The HTTP method to use for this request
                    </FieldDescription>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            />

            <form.Field
              name="endpoint"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Endpoit Url</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="https://api/example.com/users/{{httpResponse.data.id}}"
                      autoComplete="off"
                    />
                    <FieldDescription>
                      Static URL or use {"{{variables}}"} for simple values or{" "}
                      {"{{json variable}}"} to stringfy objects
                    </FieldDescription>
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                );
              }}
            />
            {showBodyField && (
              <form.Field
                name="body"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Request Body</FieldLabel>
                      <Textarea
                        className="min-h-30 font-mono text-sm"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder={
                          '{\n  "userId": "{{httpResponse.data.id}}",\n  "name": "{{httpResponse.data.name}}",\n  "items": "{{httpResponse.data.items}}"\n}'
                        }
                        autoComplete="off"
                      />
                      <FieldDescription>
                        JSON with template variables. Use {"{{variables}}"} for
                        simple values or {"{{json variable}}"} to stringify
                        objects
                      </FieldDescription>
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  );
                }}
              />
            )}
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
