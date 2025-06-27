// app/api/announcement/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface Announcement {
  message: string;
  date?: string; // ISO date, optional
}

let announcements: Announcement[] = [
  { message: "📢 Livraison gratuite ce week-end !" },
];

// GET all announcements
export function GET() {
  return NextResponse.json({ announcements });
}

// POST new announcement
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { message, date } = body;

  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Message requis' }, { status: 400 });
  }

  announcements.unshift({ message, date });
  return NextResponse.json({ success: true, announcements });
}

// DELETE by index
export async function DELETE(req: NextRequest) {
  const { index } = await req.json();

  if (typeof index !== 'number' || index < 0 || index >= announcements.length) {
    return NextResponse.json({ error: 'Index invalide' }, { status: 400 });
  }

  announcements.splice(index, 1);
  return NextResponse.json({ success: true, announcements });
}
