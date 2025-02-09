import { Notification } from "@/schemas/notifications";
import {
  ColumnDef
} from "@tanstack/react-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const notificationType = {
  in_app: "In-app",
  push: "Push",
}

export const columns: ColumnDef<Notification>[] = [
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
    header: "Envíado por",
    accessorKey: "sent_by",
    size: 180,
    cell: ({ row }) => <div>
      {row.original.sent_by}
    </div>
  },
  {
    header: "Tipo",
    accessorKey: "notification_type",
    size: 220,
    cell: ({ row }) => <div>
      {notificationType[row.original.notification_type as keyof typeof notificationType]}
    </div>,
  },
  {
    header: "Clientes alcanzados",
    accessorKey: "clients_count",
    size: 220,
  },
  {
    header: "Creado el",
    accessorKey: "created_at",
    size: 220,
    cell: ({ row }) => <div>
      {format(new Date(row.original.created_at), "dd MMM yyyy - HH:mm a", { locale: es })}
    </div>,
  },
];
