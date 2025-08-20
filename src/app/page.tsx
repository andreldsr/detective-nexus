import { DetectiveBoard } from '@/components/detective-board';
import { caseData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
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
