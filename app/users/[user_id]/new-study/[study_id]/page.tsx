'use client'

import FileUploader from "@/app/users/[user_id]/new-study/[study_id]/components/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useGetClientQuery } from "@/services/clients";
import { useGetStudyQuery } from "@/services/studies";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileIcon, Plus, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import NewBlockDialog from "./components/new-block-dialog";
import Blocks from "./components/blocks";
import { Square } from "./components/square";
import { createStudySchema } from "./utils";
import { Textarea } from "@/components/ui/textarea";

export default function NewStudyPage() {
  const { study_id, user_id } = useParams<{ study_id: string; user_id: string }>();

  const dynamicSchema = createStudySchema(study_id);

  const { data: study, isLoading: isStudyLoading } = useGetStudyQuery(study_id);
  const { data: client, isLoading: isClientLoading } = useGetClientQuery(user_id ?? "");

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof dynamicSchema>>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      user_id: "",
      study_id: "",
    },
  });

  function onSubmit(data: z.infer<typeof dynamicSchema>) {
    console.log(data);
  }

  const uploadedFile = useWatch({
    control: form.control,
    name: "file",
  });

  useEffect(() => {
    if (!study) return;
    form.setValue("study_id", study?.code);
  }, [study]);

  useEffect(() => {
    if (!client) return;
    form.setValue("user_id", client?.id);
  }, [client]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-4 h-full">
        <h1
          className={cn(
            "text-xl font-semibold transition-all duration-200",
            isStudyLoading ? "text-muted-foreground font-normal blur-[6px]" : "blur-none"
          )}
        >
          {isStudyLoading ? "texto de estudio" : study?.title}
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="bg-background p-6 rounded-md shadow-lg shadow-border border space-y-6">
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Usuario</FormLabel>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        type="button"
                        disableRipple
                        className={cn(
                          "justify-between px-3 bg-secondary cursor-default border-none hover:bg-secondary/50",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Square className={cn("bg-indigo-400/20 text-indigo-500 shadow-lg shadow-indigo-400/20")}>
                            <p
                              className={cn("transition-all duration-200", isClientLoading ? "blur-[4px]" : "blur-none")}
                            >
                              {isClientLoading ? "T" : client?.first_name?.charAt(0)}
                            </p>
                          </Square>
                          <p
                            className={cn("transition-all duration-200", isClientLoading ? "text-muted-foreground font-normal blur-[6px]" : "blur-none")}
                          >
                            {isClientLoading ? "Agustin Delgado" : `${client?.first_name} ${client?.last_name}`}
                          </p>
                        </div>
                      </Button>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="study_id"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Estudio</FormLabel>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        disableRipple
                        type="button"
                        className={cn(
                          "justify-between px-3 bg-secondary cursor-default border-none hover:bg-secondary/50",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Square className={cn("bg-indigo-400/20 text-indigo-500 shadow-lg shadow-indigo-400/20")}>
                            <p
                              className={cn("transition-all duration-200", isStudyLoading ? "blur-[4px]" : "blur-none")}
                            >
                              {isStudyLoading ? "T" : study?.title?.charAt(0)}
                            </p>
                          </Square>
                          <p
                            className={cn("transition-all duration-200", isStudyLoading ? "text-muted-foreground font-normal blur-[6px]" : "blur-none")}
                          >
                            {isStudyLoading ? "Agustin Delgado" : study?.title}
                          </p>
                        </div>
                      </Button>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="space-y-1 group col-span-2">
                  <FormLabel className={cn("group-focus-within:text-primary transition-colors", form.formState.errors.file && "group-focus-within:text-destructive")}>
                    PDF Adjunto
                  </FormLabel>
                  <FormControl>
                    <FileUploader onChange={field.onChange} />
                  </FormControl>
                  {uploadedFile && (
                    <div className="flex items-center gap-2 p-2 rounded-md bg-secondary transition-border justify-between shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-2">
                        <Square className="bg-indigo-400/20 text-indigo-500 shadow-lg shadow-indigo-400/20">
                          <FileIcon className="w-3.5 h-3.5" />
                        </Square>
                        <span className="font-medium text-sm">{uploadedFile.name}</span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-6 h-6 text-destructive hover:text-destructive/80"
                        onClick={() => form.resetField("file")}
                      >
                        <Trash />
                      </Button>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {study_id !== "lab" && study_id !== "in_body" && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <Label
                    className={cn(
                      form.formState.errors["metadata" as keyof z.infer<typeof dynamicSchema>] && "text-destructive"
                    )}
                  >
                    Bloques
                  </Label>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus />
                      Nuevo bloque
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="w-1/2 min-w-[400px] max-w-[700px] max-h-[600px] overflow-y-auto"
                    onInteractOutside={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <DialogHeader>
                      <DialogTitle>Nuevo bloque</DialogTitle>
                      <DialogDescription>
                        Los bloques son las secciones del estudio que el usuario verá en la app.
                      </DialogDescription>
                    </DialogHeader>
                    <NewBlockDialog setOpen={setOpen} />
                  </DialogContent>
                </div>
                <Blocks />
                {form.formState.errors["metadata" as keyof z.infer<typeof dynamicSchema>] && (
                  <p className={cn("text-sm font-medium text-destructive")}>
                    Al menos un bloque es requerido
                  </p>
                )}
              </div>
            )}
            {(study_id === "lab" || study_id === "in_body") && (
              <FormField
                control={form.control}
                name={"metadata.obs" as any}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ingresa observaciones"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {study_id === "supplements" && (
              <FormField
                control={form.control}
                name={"metadata.note" as any}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Nota</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ingresa una nota para el estudio"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-end">
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </Form>
      </div>
    </Dialog>
  );
}
