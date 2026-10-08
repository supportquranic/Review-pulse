import { NextResponse } from 'next/server';
import { getCollection, isMongoConfigured } from '@/lib/mongodb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');

    if (!isMongoConfigured()) {
      return NextResponse.json({ requests: [], mode: 'local' });
    }

    const requestsCol = await getCollection('review_requests');
    const query = businessId ? { business_id: businessId } : {};
    const requests = await requestsCol.find(query).sort({ created_at: -1 }).toArray();

    return NextResponse.json({ requests, success: true });
  } catch (error) {
    console.error('Fetch requests error:', error);
    return NextResponse.json({ error: 'Failed to fetch review requests' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { business_id, customer_name, contact_method, order_service_name } = body;

    const reqId = 'req_' + Math.random().toString(36).substring(2, 10);
    const now = new Date().toISOString();

    const newRequest = {
      id: reqId,
      business_id: business_id || 'biz-default-01',
      customer_name: customer_name || '',
      contact_method: contact_method || 'whatsapp',
      order_service_name: order_service_name || '',
      status: 'sent',
      created_at: now,
      updated_at: now,
    };

    if (!isMongoConfigured()) {
      return NextResponse.json({ success: true, mode: 'local', request: newRequest });
    }

    const requestsCol = await getCollection('review_requests');
    await requestsCol.insertOne(newRequest);

    return NextResponse.json({ success: true, request: newRequest });
  } catch (error) {
    console.error('Create request error:', error);
    return NextResponse.json({ error: 'Failed to create review request' }, { status: 500 });
  }
}
