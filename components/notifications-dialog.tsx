'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store"
import { cn } from "@/lib/utils"
import { newNotificationSchema } from "@/schemas/notifications"
import { useGetAllClientsQuery } from "@/services/clients"
import { useCreateNotificationMutation } from "@/services/notifications"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import MultipleSelector from "./multi-select"
import { Button } from "./ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

const MarkdownArea = dynamic(() => import("../components/markdown-area"), { ssr: false });

export default function NotificationsDialog() {
  const { toast } = useToast()

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const payload = dialogState.payload as { clients_count: number, clients_ids: string[], global: boolean }

  const [createNotification, { isLoading }] = useCreateNotificationMutation()
  const { data: clients } = useGetAllClientsQuery({
    query: "",
  })

  const form = useForm<z.infer<typeof newNotificationSchema>>({
    resolver: zodResolver(newNotificationSchema),
    defaultValues: {
      title: "",
      body: "",
      notification_type: "",
    },
  })

  const selectedClients = useWatch({
    control: form.control,
    name: "client_ids",
  })

  const onOpenChange = () => {
    closeDialogs()
    form.reset()
  }

  async function onSubmit(data: z.infer<typeof newNotificationSchema>) {
    try {
      const response = await createNotification({
        notification_type: data.notification_type,
        title: data.title,
        body: data.body,
        client_ids: data.client_ids && data.client_ids.length > 0 ? data.client_ids : null,
      })

      if (response.data?.id) {
        toast({
          title: "Notificación enviada",
          description: "La notificación se ha enviado correctamente",
        })
        closeDialogs()
      }

    } catch (err) {
      toast({
        title: "Algo salió mal",
        variant: "destructive",
        description: "No se pudo enviar la notificación, por favor intenta de nuevo",
      })
    }
  }

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState)
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    form.setValue("client_ids", payload?.clients_ids)
  }, [payload])

  return (
    <Dialog
      open={dialogState.open === "notifications"}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva notificación</DialogTitle>
          <DialogDescription>
            Enviaras la notificación a {
              selectedClients?.length === 0
                ? 'todos los clientes.'
                : selectedClients && selectedClients?.length > 1 ? `${selectedClients?.length} clientes.` : `${selectedClients?.length} cliente.`
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="notification_type"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Tipo de notificación</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className={cn(form.formState.errors.notification_type && "border-destructive hover:border-destructive focus-visible:!border-destructive focus-visible:!shadow-destructive/25 data-[state=open]:!border-destructive data-[state=open]:!shadow-destructive/25")}
                        >
                          <SelectValue placeholder="Selecciona un tipo de notificación" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="push">Push</SelectItem>
                        <SelectItem value="in_app">In app</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="client_ids"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Clientes</FormLabel>
                    <FormControl>
                      <MultipleSelector
                        commandProps={{
                          label: "Clientes",
                          filter: (itemValue: string, search: string) => {
                            const option = clients?.find(inst => inst.id === itemValue);
                            return option && option.name.toLowerCase().includes(search.toLowerCase())
                              ? 1
                              : -1;
                          },
                        }}
                        options={clients?.map((institution) => ({
                          label: institution.name,
                          value: institution.id,
                        }))}
                        placeholder="Selecciona los clientes"
                        value={field.value?.map((value) => ({
                          label: clients?.find(inst => inst.id === value)?.name || "",
                          value,
                        }))}
                        onChange={(values) => {
                          form.setValue("client_ids", values.map((value) => value.value))
                        }}
                        emptyIndicator={
                          <p className="text-center text-sm">No hay clientes disponibles</p>
                        }
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Selecciona los clientes a los que deseas enviar la notificación, si no seleccionas ninguno se enviará a todos los clientes.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-1 group">
                    <FormLabel className={cn("group-focus-within:text-primary transition-colors", form.formState.errors.title && "group-focus-within:text-destructive")}>
                      Título
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={form.formState.errors.title && "border-destructive hover:border-destructive focus:!border-destructive focus:!shadow-destructive/25"}
                        placeholder="Nueva notificación!"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem className="space-y-1 group">
                    <FormLabel className={cn("group-focus-within:text-primary transition-colors", form.formState.errors.body && "group-focus-within:text-destructive")}>
                      Cuerpo
                    </FormLabel>
                    <FormControl>
                      <MarkdownArea
                        setValue={form.setValue}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="w-[86px]"
              //disabled={isLoading}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center justify-center"
                    >
                      <Loader2 className="!w-5 !h-5 animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                    >
                      Envíar
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}