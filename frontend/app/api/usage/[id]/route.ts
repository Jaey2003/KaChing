import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await pool.execute('DELETE FROM usage_records WHERE record_id = ?', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
