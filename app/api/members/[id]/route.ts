import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/members/:id  — update expectedRole / growthTheme
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as {
      expectedRole?: string;
      growthTheme?: string;
    };

    const member = await prisma.member.update({
      where: { id },
      data: {
        ...(body.expectedRole !== undefined && { expectedRole: body.expectedRole || null }),
        ...(body.growthTheme !== undefined && { growthTheme: body.growthTheme || null }),
      },
    });
    return NextResponse.json(member);
  } catch (error) {
    console.error('[PUT /api/members/:id]', error);
    return NextResponse.json({ error: 'メンバーの更新に失敗しました。' }, { status: 500 });
  }
}
