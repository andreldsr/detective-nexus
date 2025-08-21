
import { listCases } from '@/lib/case-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Search, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignOutButton } from '@/components/auth/sign-out-button';

export default async function Home() {
  const { cases, error } = await listCases();

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-12">
        <div className="text-center flex-1">
          <h1 className="font-headline text-5xl font-bold text-primary">Detective Nexus</h1>
          <p className="text-muted-foreground mt-2">Select a case file to begin your investigation.</p>
        </div>
        <SignOutButton />
      </header>

      {error && (
         <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Failed to Load Cases</AlertTitle>
          <AlertDescription>
            Could not load case files from Firestore. Please ensure you have set up your Firebase credentials correctly and uploaded at least one case.
            <pre className="mt-2 rounded-md bg-muted p-4 text-sm">
              <code>{error}</code>
            </pre>
          </AlertDescription>
        </Alert>
      )}

      {cases && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem) => (
             <Card key={caseItem.id} className="flex flex-col hover:ring-2 hover:ring-primary/50 transition-all">
               <CardHeader>
                 <CardTitle className="font-headline text-2xl">{caseItem.title}</CardTitle>
                 <CardDescription>Difficulty: {caseItem.difficulty}</CardDescription>
               </CardHeader>
               <CardContent className="flex-grow">
                 <p className="text-muted-foreground">{caseItem.description}</p>
               </CardContent>
               <div className="p-6 pt-0">
                <Button asChild className="w-full font-headline">
                  <Link href={`/cases/${caseItem.id}`}>
                    <Search />
                    Start Investigation
                  </Link>
                </Button>
               </div>
             </Card>
          ))}
        </div>
      )}

      {!error && cases && cases.length === 0 && (
        <div className="text-center text-muted-foreground py-16">
          <p className="text-lg">No cases found.</p>
          <p>Run `npm run db:upload` to upload the default case file.</p>
        </div>
      )}
    </main>
  );
}
