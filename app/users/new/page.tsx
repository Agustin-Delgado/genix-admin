"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { AtSign, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

const FormSchema = z.object({
  firstname: z.string().min(2, {
    message: "El nombre es requerido",
  }),
  lastname: z.string().min(2, {
    message: "El apellido es requerido",
  }),
  email: z.string().email({
    message: "El email es requerido",
  }),
  password: z.string().min(6, {
    message: "La contraseña es requerida",
  }),
  is_active: z.boolean(),
})

export default function NewUserPage() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      is_active: true,
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Crear un nuevo cliente</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-background p-4 rounded-md shadow-lg shadow-border border space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem className="space-y-1 group">
                  <FormLabel className={cn("group-focus-within:text-primary transition-colors", form.formState.errors.email && "group-focus-within:text-destructive")}>
                    Nombre
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={form.formState.errors.firstname && "border-destructive hover:border-destructive focus:!border-destructive focus:!shadow-destructive/25"}
                      placeholder="Jhon"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem className="space-y-1 group">
                  <FormLabel className={cn("group-focus-within:text-primary transition-colors", form.formState.errors.email && "group-focus-within:text-destructive")}>
                    Apellido
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={form.formState.errors.lastname && "border-destructive hover:border-destructive focus:!border-destructive focus:!shadow-destructive/25"}
                      placeholder="Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1 group">
                  <FormLabel className={cn("group-focus-within:text-primary transition-colors", form.formState.errors.email && "group-focus-within:text-destructive")}>
                    Correo electrónico
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className={cn("peer ps-9", form.formState.errors.email && "border-destructive hover:border-destructive focus:!border-destructive focus:!shadow-destructive/25")}
                        placeholder="jhondoe@gmail.com"
                        type="email"
                        {...field}
                      />
                      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                        <AtSign size={16} strokeWidth={2} aria-hidden="true" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1 group">
                  <FormLabel
                    className={cn("group-focus-within:text-primary transition-colors", form.formState.errors.email && "group-focus-within:text-destructive")}>
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className={cn("pe-9", form.formState.errors.email && "border-destructive hover:border-destructive focus:!border-destructive focus:!shadow-destructive/25")}
                        placeholder="Password"
                        type={isVisible ? "text" : "password"}
                        {...field}
                      />
                      <button
                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={() => setIsVisible((prevState) => !prevState)}
                        aria-label={isVisible ? "Hide password" : "Show password"}
                        aria-pressed={isVisible}
                        aria-controls="password"
                      >
                        <motion.div
                          key={isVisible ? "eye-off" : "eye"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isVisible ? (
                            <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                          ) : (
                            <Eye size={16} strokeWidth={2} aria-hidden="true" />
                          )}
                        </motion.div>
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}