import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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

    const [result] = await pool.execute(
      `INSERT INTO usage_records
        (record_id, pocket_name, amount, asset, purpose, recipient, evidence, evidence_name, wallet_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [record_id, pocket_name, amount, asset, purpose, recipient || null, evidence || null, evidence_name || null, wallet_address || null]
    );

    return NextResponse.json({ success: true, id: (result as any).insertId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
