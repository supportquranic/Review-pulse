import { NextResponse } from 'next/server';
import { getCollection, isMongoConfigured } from '@/lib/mongodb';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isMongoConfigured()) {
      return NextResponse.json({ success: true, mode: 'local' });
    }

    const requestsCol = await getCollection('review_requests');
    const request = await requestsCol.findOne({ id });

    if (!request) {
      return NextResponse.json({ error: 'Review request not found' }, { status: 404 });
    }

    const profilesCol = await getCollection('profiles');
    const profile =
      (await profilesCol.findOne({
        $or: [{ id: request.business_id }, { user_id: request.business_id }],
      })) || (await profilesCol.findOne({}, { sort: { updated_at: -1 } }));

    // Mark as opened if first time
    if (request.status === 'sent') {
      await requestsCol.updateOne(
        { id },
        { $set: { status: 'opened', updated_at: new Date().toISOString() } }
      );
    }

    return NextResponse.json({
      success: true,
      request,
      business: profile || null,
    });
  } catch (error) {
    console.error('Fetch review request error:', error);
    return NextResponse.json({ error: 'Failed to fetch review request' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { rating, customer_original_text, customer_improved_text } = body;

    const now = new Date().toISOString();

    if (!isMongoConfigured()) {
      return NextResponse.json({
        success: true,
        mode: 'local',
        request: {
          id,
          rating,
          customer_original_text,
          customer_improved_text,
          status: 'completed',
          updated_at: now,
        },
      });
    }

    const requestsCol = await getCollection('review_requests');
    await requestsCol.updateOne(
      { id },
      {
        $set: {
          rating: Number(rating) || 5,
          customer_original_text: customer_original_text || '',
          customer_improved_text: customer_improved_text || '',
          status: 'completed',
          updated_at: now,
        },
      }
    );

    const updated = await requestsCol.findOne({ id });
    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error('Submit review error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
