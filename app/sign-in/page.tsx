'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { signInSchema } from "@/schemas/auth"
import { useSignInMutation } from "@/services/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import Cookies from 'js-cookie'
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useTransitionRouter } from "next-view-transitions"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function SignIn() {
  const router = useTransitionRouter()

  const { toast } = useToast()
  const [authUser, { isLoading }] = useSignInMutation();

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    try {
      const response = await authUser(values).unwrap()

      if ("token" in response) {
        Cookies.set('sessionToken', response.token);
      }

      router.push("/users")
    } catch (err: any) {
      toast({
        title: "Algo salió mal",
        variant: "destructive",
        description: 'data' in err ? err.data.message : "Por favor, intenta de nuevo",
      })
    }
  }


  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="shadow-lg shadow-border border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription className="text-base">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6">
                <div className="grid gap-2 group">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor="email"
                          className={cn("group-focus-within:text-primary transition-colors", form.formState.errors.email && "group-focus-within:text-destructive")}
                        >
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            className={cn(form.formState.errors.email && "border-destructive hover:border-destructive focus:!border-destructive focus:!shadow-destructive/25")}
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2 group">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor="password"
                          className={cn("group-focus-within:text-primary transition-colors", form.formState.errors.password && "group-focus-within:text-destructive")}
                        >
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="password"
                              type={isVisible ? "text" : "password"}
                              placeholder="•••••••••••"
                              className={cn(form.formState.errors.password && "border-destructive hover:border-destructive focus:!border-destructive focus:!shadow-destructive/25")}
                              {...field}
                            />
                            <Button
                              className="absolute inset-y-0 end-0 flex p-0 !w-7 !h-7 items-center justify-center rounded-full text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 top-1/2 transform -translate-y-1/2 right-1.5 focus-visible:!ring-0 focus-visible:!outline-none focus-visible:!shadow-none focus-visible:ring-offset-0"
                              variant="ghost"
                              type="button"
                              onClick={toggleVisibility}
                              aria-label={isVisible ? "Hide password" : "Show password"}
                              aria-pressed={isVisible}
                              aria-controls="password"
                            >
                              {isVisible ? (
                                <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                              ) : (
                                <Eye size={16} strokeWidth={2} aria-hidden="true" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button disabled={isLoading} className="w-full relative overflow-hidden">
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
                        Sign in
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}