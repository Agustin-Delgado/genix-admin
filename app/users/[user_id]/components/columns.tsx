import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ClientStudies } from "@/schemas/clients";
import {
  ColumnDef,
  Row
} from "@tanstack/react-table";
import { format, parse } from "date-fns";
import { Ellipsis, FileDown, SquarePen, Trash } from "lucide-react";
import { useTransitionRouter } from "next-view-transitions";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { study_status_adapter } from "@/lib/adapters";

function RowActions({ row }: { row: Row<ClientStudies['data'][0]> }) {
  const router = useTransitionRouter()

  return (
    <TooltipProvider delayDuration={1000}>
      <div className="flex justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="shadow-none rounded-full"
            // onClick={() => router.push(`/dashboard/users/${row.original.id}/new-study`)}
            >
              <FileDown />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs !z-[9999]">
            Descagar estudio
          </TooltipContent>
        </Tooltip>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="shadow-none rounded-full">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <SquarePen />
                <span>Editar</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash />
                <span>Eliminar</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}

export const columns: ColumnDef<ClientStudies['data'][0]>[] = [
  {
    header: "Título",
    accessorKey: "title",
    cell: ({ row }) => <div className="font-medium">
      {row.original.title}
    </div>,
    size: 180,
    enableHiding: false,
  },
  {
    header: "Fecha",
    accessorKey: "date",
    size: 220,
    cell: ({ row }) => format(parse(row.original.date, "dd/MM/yyyy", new Date()), "dd MMM yyyy", { locale: es }),
  },
  {
    header: "Estado",
    accessorFn: (row) => row.state,
    id: "status",
    cell: ({ row }) => {
      const state = row.original.state as keyof typeof study_status_adapter
      return <Badge
        className={cn("shadow-lg",
          study_status_adapter[state].color,
        )}
      >
        {study_status_adapter[state].label}
      </Badge>
    },
    size: 100,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
];
