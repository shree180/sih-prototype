import { headers } from 'next/headers';
import { query } from '@/lib/db/local';

export const dynamic = 'force-dynamic';

export async function GET() {
  const headersList = headers();
  const userId = headersList.get('x-user-id');

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const result = await query<{
      id: string;
      disaster_type: string;
      description: string | null;
      final_severity: string | null;
      ai_confidence: number | null;
      priority_score: number | null;
      verification_status: string;
      operational_status: string;
      submitted_at: Date;
    }>(
      `SELECT id, disaster_type, description, final_severity, ai_confidence, priority_score,
              verification_status, operational_status, submitted_at 
       FROM reports 
       WHERE reporter_id = $1 
       ORDER BY submitted_at DESC 
       LIMIT 10`,
      [userId]
    );

    const reports = result.rows;
    const totalReports = reports.length;
    const verifiedCount = reports.filter(r => r.verification_status === 'verified').length;
    const pendingCount = reports.filter(r => 
      r.verification_status === 'needs_review' || r.verification_status === 'unverified'
    ).length;

    return Response.json({
      reports,
      totalReports,
      verifiedCount,
      pendingCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}