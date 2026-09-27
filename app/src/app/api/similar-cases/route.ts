import { NextResponse } from 'next/server';
import { getClinicalCohortUnified } from '@/lib/stagingRegistry';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    let profile: any = {};
    try {
      profile = await request.json();
    } catch {
      profile = {};
    }
    
    // Dynamically calculate the matching cohort and survival metrics based on cancer plugin
    const matchedCohort = getClinicalCohortUnified(profile);

    return NextResponse.json({ success: true, data: matchedCohort });
  } catch (error: any) {
    console.error('Error fetching similar cases:', error);
    const safeError = process.env.NODE_ENV === 'production' ? '获取相似病理队列数据失败，请稍后重试' : (error.message || '获取相似病理队列数据失败');
    return NextResponse.json({ success: false, error: safeError }, { status: 500 });
  }
}
