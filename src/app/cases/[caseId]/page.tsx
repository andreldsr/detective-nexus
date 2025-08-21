
import { DetectiveBoard } from '@/components/detective-board';
import { getCase } from '@/lib/case-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getCaseProgress } from '@/lib/user-service';
import { getCurrentUser } from '@/lib/server-auth';

export default async function CasePage({ params }: { params: { caseId: string } }) {
  const { caseData, error } = await getCase(params.caseId);
  const user = await getCurrentUser();
  
  let savedProgress: string[] | null = null;
  if (user) {
    savedProgress = await getCaseProgress(params.caseId, user.uid);
  }

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
            <p>Could not load case data for case ID &quot;{params.caseId}&quot; from Firestore. Please ensure the case exists and you have uploaded the data.</p>
            <pre className="mt-2 rounded-md bg-muted p-4 text-sm">
              <code>{error}</code>
            </pre>
          </AlertDescription>
        </Alert>
         <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/">
              <ArrowLeft />
              Back to Case Selection
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  // Combine starting clues with saved progress, removing duplicates
  const initialUnlockedClues = new Set([
    ...caseData.startingClueIds,
    ...(savedProgress || [])
  ]);

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex items-center justify-between">
        <Button asChild variant="outline">
          <Link href="/">
             <ArrowLeft />
            Back to Case Selection
          </Link>
        </Button>
        <div className="text-center">
            <h1 className="font-headline text-5xl font-bold text-primary">Detective Nexus</h1>
            <p className="text-muted-foreground mt-2">Unravel the mystery. One clue at a time.</p>
        </div>
        <div className="w-36"></div>
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
      <DetectiveBoard 
        caseId={params.caseId}
        initialCaseData={caseData} 
        initialUnlockedClueIds={Array.from(initialUnlockedClues)}
      />
    </main>
  );
}
