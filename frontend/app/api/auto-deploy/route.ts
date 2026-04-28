import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // 1. Define paths
    const rootDir = path.resolve(process.cwd(), '..');
    const contractsDir = path.join(rootDir, 'contracts');
    const wasmPath = path.join(rootDir, 'target/wasm32v1-none/release/ka_ching.wasm');

    console.log('--- Auto-Deploy Started ---');

    // 2. Build the contract
    console.log('Building contract...');
    await execAsync('stellar contract build', { cwd: contractsDir });

    // 3. Deploy the contract
    console.log('Deploying contract...');
    const { stdout: deployOutput } = await execAsync(
      `stellar contract deploy --wasm "${wasmPath}" --source dev --network testnet`,
      { cwd: contractsDir }
    );

    // 4. Extract Contract ID
    const contractId = deployOutput.trim();
    console.log('New Contract ID:', contractId);

    if (!contractId || contractId.length < 50) {
      throw new Error('Failed to capture a valid Contract ID from deployment output.');
    }

    return NextResponse.json({ 
      success: true, 
      contractId,
      message: 'Contract deployed successfully'
    });

  } catch (error: any) {
    console.error('Auto-Deploy Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error during deployment' 
    }, { status: 500 });
  }
}
