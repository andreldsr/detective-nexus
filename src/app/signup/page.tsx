
import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
       <header className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold text-primary">Detective Nexus</h1>
        <p className="text-muted-foreground mt-2">Create an account to start your career</p>
      </header>
      <AuthForm mode="signup" />
    </main>
  );
}
