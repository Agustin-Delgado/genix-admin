import { z } from "zod";

export const notificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  notification_type: z.enum(["in_app", "push"]),
  sent_by: z.string(),
  created_at: z.string(),
  clients_count: z.number(),
})

export const newNotificationSchema = z.object({
  title: z.string({ required_error: "El título es requerido" }).min(1, { message: "El título es requerido" }),
  body: z.string({ required_error: "El cuerpo es requerido" }).optional(),
  notification_type: z.string({ required_error: "El tipo de notificación es requerido" }).min(1, { message: "El tipo de notificación es requerido" }),
  client_ids: z.array(z.string()).optional(),
})

export const notificationResponseSchema = z.object({
  data: z.array(notificationSchema),
  current_page: z.number(),
  per_page: z.number(),
  total_pages: z.number(),
  total_elements: z.number(),
})

export type Notification = z.infer<typeof notificationSchema>
export type NotificationListResponse = z.infer<typeof notificationResponseSchema>