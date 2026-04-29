import { NextRequest, NextResponse } from 'next/server';
import pool, { testConnection } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet') || '';

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM usage_records WHERE wallet_address = ? ORDER BY created_at DESC',
      [wallet]
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error('[API /usage GET] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[API /usage POST] Received body:', { ...body, evidence: body.evidence ? '<BASE64_IMAGE_TRUNCATED>' : null });

    // Test DB connection first
    const connOk = await testConnection();
    if (!connOk) {
      console.error('[API /usage POST] Database connection test FAILED — check DB_HOST, DB_PORT, and that MySQL is running');
      return NextResponse.json({ success: false, error: 'Cannot connect to MySQL' }, { status: 500 });
    }

    const {
      record_id,
      pocket_name,
      amount,
      asset,
      purpose,
      recipient,
      evidence,
      evidence_name,
      wallet_address,
    } = body;

    console.log('[API /usage POST] Inserting record_id:', record_id, 'wallet:', wallet_address);
    const [result] = await pool.execute(
      `INSERT INTO usage_records
        (record_id, pocket_name, amount, asset, purpose, recipient, evidence, evidence_name, wallet_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [record_id, pocket_name, amount, asset, purpose, recipient || null, evidence || null, evidence_name || null, wallet_address || null]
    );

    console.log('[API /usage POST] Insert SUCCESS — insertId:', (result as any).insertId);
    return NextResponse.json({ success: true, id: (result as any).insertId });
  } catch (error: any) {
    console.error('[API /usage POST] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
