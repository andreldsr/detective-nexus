import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { admin } from '@/lib/firebase-admin';
import { getDbUser } from '@/lib/user-service';

export async function GET(_request: NextRequest, { params }: { params: { caseId: string } }) {
  try {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ progress: null }, { status: 200 });
    }

    const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
    const uid = decodedToken.uid;

    const user = await getDbUser(uid);
    const progress = user?.caseProgress?.[params.caseId] ?? null;

    return NextResponse.json({ progress }, { status: 200 });
  } catch (error) {
    try {
      cookies().delete('session');
    } catch (_) {
      // ignore
    }
    return NextResponse.json({ progress: null }, { status: 200 });
  }
}
