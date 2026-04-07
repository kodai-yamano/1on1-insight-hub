import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/members
export async function GET() {
  try {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error('[GET /api/members]', error);
    return NextResponse.json({ error: 'メンバーの取得に失敗しました。' }, { status: 500 });
  }
}

// POST /api/members
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      expectedRole?: string;
      growthTheme?: string;
    };
    if (!body.name?.trim()) {
      return NextResponse.json({ error: '名前を入力してください。' }, { status: 400 });
    }
    const member = await prisma.member.create({
      data: {
        name: body.name.trim(),
        expectedRole: body.expectedRole?.trim() || null,
        growthTheme: body.growthTheme?.trim() || null,
      },
    });
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('[POST /api/members]', error);
    return NextResponse.json({ error: 'メンバーの作成に失敗しました。' }, { status: 500 });
  }
}
