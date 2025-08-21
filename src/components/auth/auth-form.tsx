
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { signUp, signIn } from "@/lib/auth-service";

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine(data => {
    // In signup mode, name is required.
    // This assumes a way to know the mode, which we don't have inside the schema directly.
    // We will handle this refinement logically before calling the auth service.
    // For now, the schema makes it optional and we will enforce it in the component.
    return true;
});


type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refine schema based on mode
  const finalSchema = mode === 'signup' 
    ? formSchema.extend({ name: z.string().min(2, { message: "Name must be at least 2 characters." })}) 
    : formSchema;


  const form = useForm<z.infer<typeof finalSchema>>({
    resolver: zodResolver(finalSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(mode === 'signup' && { name: '' }),
    },
  });

  async function onSubmit(values: z.infer<typeof finalSchema>) {
    setIsLoading(true);
    setError(null);
    try {
      if (mode === "signup") {
        // The schema for signup ensures `name` is a string.
        await signUp(values.email, values.password, values.name as string);
      } else {
        await signIn(values.email, values.password);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{mode === "login" ? "Log In" : "Sign Up"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Enter your credentials to access your cases."
            : "Create an account to become a detective."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Authentication Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {mode === 'signup' && (
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="John Watson" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="sherlock@holmes.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-headline" disabled={isLoading}>
              {isLoading ? (mode === 'login' ? 'Logging in...' : 'Signing up...') : (mode === 'login' ? 'Log In' : 'Sign Up')}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Log in
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
