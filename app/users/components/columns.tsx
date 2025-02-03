import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { status_adapter } from "@/lib/adapters";
import { cn } from "@/lib/utils";
import { Client } from "@/schemas/clients";
import {
  ColumnDef,
  Row
} from "@tanstack/react-table";
import { Bell, Ellipsis, Eye, FileUp, SquarePen, Trash } from "lucide-react";
import { Link, useTransitionRouter } from "next-view-transitions";

function RowActions({ row }: { row: Row<Client> }) {
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
              onClick={() => router.push(`/users/${row.original.id}/new-study`)}
            >
              <FileUp />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs">
            Cargar estudio
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
              <DropdownMenuItem
                onClick={() => router.push(`/users/${row.original.id}`)}
              >
                <Eye />
                <span>Ver detalles</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                <span>Envíar notificación</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
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

export const columns: ColumnDef<Client>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => <div className="font-medium">
      <Link href={`/users/${row.original.id}`} className="hover:underline">
        {row.original.first_name}
        {" "}
        {row.original.last_name}
      </Link>
    </div>,
    size: 180,
    enableHiding: false,
  },
  {
    header: "Email",
    accessorKey: "user.email",
    size: 220,
  },
  {
    header: "DNI",
    accessorKey: "identification_number",
    size: 220,
  },
  {
    header: "Status",
    accessorFn: (row) => row.user.state,
    id: "status",
    cell: ({ row }) => (
      <Badge
        className={cn("shadow-lg",
          status_adapter[row.original.user.state].color,
        )}
      >
        {status_adapter[row.original.user.state].label}
      </Badge>
    ),
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
