import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { getBlockSchemaAndDefaults } from "../utils";
import { useCreateBlockNote } from "@blocknote/react";
import { locales } from "@blocknote/core";
import { cn } from "@/lib/utils";

export const MarkdownArea = dynamic(() => import("./markdown-area"), { ssr: false });

export default function NewBlockDialog({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { study_id } = useParams<{ study_id: string; user_id: string }>();
  const { schema: blockSchema, defaultValues: blockDefaultValues, fields } = getBlockSchemaAndDefaults(study_id);

  const form = useForm<z.infer<typeof blockSchema>>({
    resolver: zodResolver(blockSchema),
    defaultValues: blockDefaultValues,
  });

  const { setValue, getValues } = useFormContext<any>();

  const locale = locales["es"];

  const editor = useCreateBlockNote({
    dictionary: {
      ...locale,
      placeholders: {
        ...locale.placeholders,
        default: "Escribe aquí...",
      },
    },
  });

  const onSubmit = async (data: z.infer<typeof blockSchema>) => {
    const currentMetadata = getValues("metadata") || {};
    const currentBlocks: any[] = currentMetadata.blocks || [];
    const updatedBlocks = [...currentBlocks, data];

    setValue("metadata", { ...currentMetadata, blocks: updatedBlocks });

    form.reset();
    editor.replaceBlocks(editor.document, await editor.tryParseMarkdownToBlocks(""));
    setOpen(false);
  };

  return (
    <Form {...form}>
      <div className="space-y-4">
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as keyof z.infer<typeof blockSchema>}
            render={({ field: inputField }) => (
              <FormItem className="space-y-1 group">
                <FormLabel className={cn("group-focus-within:text-primary transition-colors", form.formState.errors[field.name as keyof z.infer<typeof blockSchema>] && "group-focus-within:text-destructive")}>
                  {field.label}
                </FormLabel>
                <FormControl>
                  {field.type === "textarea" ? (
                    <MarkdownArea
                      setValue={form.setValue}
                      editor={editor}
                    />
                  ) : (
                    <Input
                      className={form.formState.errors[field.name as keyof z.infer<typeof blockSchema>] && "border-destructive hover:border-destructive focus:!border-destructive focus:!shadow-destructive/25"}
                      placeholder={field.label}
                      {...inputField}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <div className="flex justify-end">
          <Button type="button" onClick={form.handleSubmit(onSubmit)}>
            Agregar
          </Button>
        </div>
      </div>
    </Form>
  );
}
