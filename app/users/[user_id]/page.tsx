'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { gender_adapter, status_adapter } from "@/lib/adapters";
import { cn } from "@/lib/utils";
import { useGetClientQuery } from "@/services/clients";
import { format, parse } from "date-fns";
import { Cake, IdCard, Mail, Pencil, Phone, User } from "lucide-react";
import { useTransitionRouter } from "next-view-transitions";
import { useParams } from "next/navigation";
import UserStudiesTable from "./components/user-studies-table";

export default function UserDetailsPage() {
  const params = useParams()
  const router = useTransitionRouter()

  const user_id = params.user_id as string

  const { data: client, isLoading } = useGetClientQuery(user_id ?? "")

  const birthDate = client?.birth_date && parse(client.birth_date, "dd/MM/yyyy", new Date())

  return (
    <ResizablePanelGroup direction="horizontal" className="gap-2 !overflow-visible">
      <ResizablePanel defaultSize={75} className="w-full !overflow-visible">
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold">Estudios del cliente</h1>
          <UserStudiesTable />
        </div>
      </ResizablePanel>
      <ResizableHandle disabled className="sr-only" />
      <ResizablePanel defaultSize={25} className="bg-background border rounded-lg shadow-lg shadow-border !overflow-visible min-w-[350px]">
        <div className="flex h-full flex-col w-full overflow-hidden">
          <div className="border-b w-full p-6 h-fit flex items-center gap-2">
            <Avatar className="w-14 h-14 border shadow-lg shadow-border">
              <AvatarFallback>
                <p
                  className={cn("font-medium transition-all duration-200",
                    isLoading ? "text-muted-foreground font-normal blur-[6px]" : "blur-none"
                  )}
                >
                  {isLoading ? "AD" : client?.first_name?.charAt(0)}{client?.last_name?.charAt(0)}
                </p>
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col w-full">
              <div className="flex justify-between">
                <span className="text-lg font-medium relative w-full">
                  <p
                    className={cn("font-medium transition-all duration-200",
                      isLoading ? "text-muted-foreground font-normal blur-[6px]" : "blur-none"
                    )}
                  >
                    {isLoading ? "Agustin Delgado" : `${client?.first_name} ${client?.last_name}`}
                  </p>
                  <Button
                    size="icon"
                    variant="outline"
                    className="shadow-md shadow-border rounded-full absolute right-0 top-1/2 transform -translate-y-1/2"
                    onClick={() => router.push(`/users/${user_id}/edit`)}
                  >
                    <Pencil />
                  </Button>
                </span>
              </div>
              <Badge
                className={cn("shadow-lg w-fit",
                  isLoading ? status_adapter['inactive'].color :
                    status_adapter[client?.user.state as keyof typeof status_adapter].color
                )}
              >
                <p
                  className={cn("transition-all duration-200",
                    isLoading ? "blur-[6px]" : "blur-none"
                  )}
                >
                  {isLoading ? status_adapter['inactive'].label : status_adapter[client?.user.state as keyof typeof status_adapter].label}
                </p>
              </Badge>
            </div>
          </div>
          <div className="flex flex-col p-6 gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="w-5 h-5" />
                <span>Correo electrónico</span>
              </div>
              <div className="ml-7">
                <p
                  className={cn("font-medium transition-all duration-200",
                    isLoading ? "text-muted-foreground font-normal blur-[6px]" : "blur-none"
                  )}
                >
                  {isLoading ? "agustindariodelgado@gmail.com" : client?.user.email}
                </p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <IdCard className="w-5 h-5" />
                <span>Identificación</span>
              </div>
              <p
                className={cn("font-medium transition-all duration-200 ml-7",
                  isLoading ? "text-muted-foreground font-normal blur-[6px]" : "blur-none"
                )}
              >
                {isLoading ? "123456789" : client?.identification_number}
              </p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Cake className="w-5 h-5" />
                <span>Fecha de nacimiento</span>
              </div>
              <p
                className={cn("font-medium transition-all duration-200 ml-7",
                  isLoading ? "text-muted-foreground font-normal blur-[6px]" : "blur-none"
                )}
              >
                {isLoading ? "01 de January de 2000" : format(birthDate ?? "", "dd 'de' MMMM 'de' yyyy")}
              </p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <User className="w-5 h-5" />
                <span>
                  Género
                </span>
              </div>
              <p
                className={cn("font-medium transition-all duration-200 ml-7",
                  isLoading ? "text-muted-foreground font-normal blur-[6px]" : "blur-none"
                )}
              >
                {isLoading ? "Masculino" : gender_adapter[client?.gender as keyof typeof gender_adapter]}
              </p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="w-5 h-5" />
                <span>Número de teléfono</span>
              </div>
              <p
                className={cn("font-medium transition-all duration-200 ml-7",
                  isLoading ? "text-muted-foreground font-normal blur-[6px]" : "blur-none"
                )}
              >
                {isLoading ? "+5491182829393" : client?.phone_number}
              </p>
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}