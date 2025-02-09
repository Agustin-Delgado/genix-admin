'use client'

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetClientQuery } from "@/services/clients";
import { useGetClientStudyQuery } from "@/services/studies";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Edit, Trash } from "lucide-react";
import { Link } from "next-view-transitions";
import { Square } from "../components/square";
import { setDialogsState } from "@/lib/store/dialogs-store";

export default function ClientStudyDetailsPage() {
  const { client_study_id, user_id } = useParams<{ client_study_id: string; user_id: string }>();

  const { data: client, isLoading: isClientLoading } = useGetClientQuery(user_id ?? "");
  const { data: clientStudy, isLoading: isStudyLoading } = useGetClientStudyQuery(client_study_id ?? "");

  console.log(isClientLoading, isStudyLoading);

  const containerClass =
    "p-4 rounded-md bg-secondary shadow-sm hover:shadow-md hover:bg-secondary/50 transition-all relative group";

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between">
        <h1
          className={cn(
            "text-xl font-semibold transition-all duration-200",
            isStudyLoading ? "text-muted-foreground font-normal blur-[6px]" : "blur-none"
          )}
        >
          {isStudyLoading ? "texto de estudio" : clientStudy?.title}
        </h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            asChild
          >
            <Link href={`/users/${user_id}/${client_study_id}/edit-study`}>
              <Edit />
              Editar
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-9 w-9"
            onClick={() => setDialogsState({
              open: "delete-client-study",
              payload: {
                client_study_id: client_study_id,
                user_id: user_id
              }
            })}
          >
            <Trash />
          </Button>
        </div>
      </div>
      <div className="bg-background p-6 rounded-md shadow-lg shadow-border border space-y-6">
        <div className="flex gap-4">
          <div className="flex flex-col w-full space-y-2">
            <Label>Cliente</Label>
            <Button
              variant="outline"
              role="combobox"
              type="button"
              disableRipple
              className={cn(
                "justify-between px-3 bg-secondary cursor-default border-none hover:bg-secondary/50",
                !client?.id && "text-muted-foreground"
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
          </div>
          <div className="flex flex-col w-full space-y-2">
            <Label>Estudio</Label>
            <Button
              variant="outline"
              role="combobox"
              type="button"
              disableRipple
              className={cn(
                "justify-between px-3 bg-secondary cursor-default border-none hover:bg-secondary/50",
                !clientStudy?.id && "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <Square className={cn("bg-indigo-400/20 text-indigo-500 shadow-lg shadow-indigo-400/20")}>
                  <p
                    className={cn("transition-all duration-200", isStudyLoading ? "blur-[4px]" : "blur-none")}
                  >
                    {isStudyLoading ? "T" : clientStudy?.title?.charAt(0)}
                  </p>
                </Square>
                <p
                  className={cn("transition-all duration-200", isStudyLoading ? "text-muted-foreground font-normal blur-[6px]" : "blur-none")}
                >
                  {isStudyLoading ? "Agustin Delgado" : `${clientStudy?.title}`}
                </p>
              </div>
            </Button>
          </div>
        </div>
        <div className={cn("space-y-2", !clientStudy?.metadata.blocks?.length && "hidden")}>
          <Label>Bloques</Label>
          {clientStudy?.code === "nutritional" && (
            clientStudy?.metadata?.blocks?.map((block, index: number) => (
              <div key={index} className={containerClass}>
                <span className="font-medium">{block.title}</span>
                <MarkdownPreview
                  wrapperElement={{ "data-color-mode": "light" }}
                  source={block.body}
                  className="!text-sm"
                  style={{ padding: 16, all: "revert" }}
                />
              </div>
            ))
          )}
          {clientStudy?.code === "training" && (
            clientStudy?.metadata?.blocks?.map((block, index: number) => (
              <div key={index} className={containerClass}>
                <span className="font-medium">
                  {block.day}
                </span>
                <MarkdownPreview
                  wrapperElement={{ "data-color-mode": "light" }}
                  source={block.body}
                  className="!text-sm"
                  style={{ padding: 16, all: "revert" }}
                />
              </div>
            ))
          )}
          {clientStudy?.code === "supplements" && (
            clientStudy?.metadata?.blocks?.map((block, index: number) => (
              <div key={index} className={containerClass}>
                <div className="flex gap-1">
                  <span className="font-semibold">
                    {block.supplement}:
                  </span>
                  {block.supplement}
                </div>
                <div>
                  <span>{block.dose}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={cn("space-y-2", !clientStudy?.metadata.obs && "hidden")}>
          <Label>Observaciones</Label>
          <div className={containerClass}>
            <span>{clientStudy?.metadata.obs || "No hay observaciones"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}