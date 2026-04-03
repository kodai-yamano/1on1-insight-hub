import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/records?memberId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');

    const records = await prisma.record.findMany({
      where: memberId ? { memberId } : undefined,
      include: { member: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error('[GET /api/records]', error);
    return NextResponse.json({ error: '履歴の取得に失敗しました。' }, { status: 500 });
  }
}

// POST /api/records
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      memberId?: string;
      inputData?: unknown;
      resultData?: unknown;
    };

    if (!body.memberId) {
      return NextResponse.json({ error: 'memberIdは必須です。' }, { status: 400 });
    }
    if (!body.inputData || !body.resultData) {
      return NextResponse.json({ error: 'inputDataとresultDataは必須です。' }, { status: 400 });
    }

    const record = await prisma.record.create({
      data: {
        memberId: body.memberId,
        inputData: JSON.stringify(body.inputData),
        resultData: JSON.stringify(body.resultData),
      },
    });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('[POST /api/records]', error);
    return NextResponse.json({ error: '履歴の保存に失敗しました。' }, { status: 500 });
  }
}
