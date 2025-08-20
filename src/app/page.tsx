import { DetectiveBoard } from '@/components/detective-board';
import { getCase } from '@/lib/case-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default async function Home() {
  const { caseData, error } = await getCase('case-1');

  if (error || !caseData) {
    return (
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="font-headline text-5xl font-bold text-primary">Detective Nexus</h1>
          <p className="text-muted-foreground mt-2">Unravel the mystery. One clue at a time.</p>
        </header>
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Failed to Load Case Data</AlertTitle>
          <AlertDescription>
            Could not load case data from Firestore. Please ensure you have uploaded the case data.
            <pre className="mt-2 rounded-md bg-muted p-4 text-sm">
              <code>{error}</code>
            </pre>
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="font-headline text-5xl font-bold text-primary">Detective Nexus</h1>
        <p className="text-muted-foreground mt-2">Unravel the mystery. One clue at a time.</p>
      </header>
      <Card className="mb-8 bg-card/50 border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">{caseData.title}</CardTitle>
          <CardDescription>{caseData.difficulty} Case</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-body text-lg">{caseData.description}</p>
        </CardContent>
      </Card>
      <DetectiveBoard initialCaseData={caseData} />
    </main>
  );
}
