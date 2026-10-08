import { NextResponse } from 'next/server';
import { getCollection, isMongoConfigured } from '@/lib/mongodb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!isMongoConfigured()) {
      return NextResponse.json({ profile: null, mode: 'local' });
    }

    const profilesCol = await getCollection('profiles');
    let profile = null;

    if (userId) {
      profile = await profilesCol.findOne({ user_id: userId });
    } else {
      profile = await profilesCol.findOne({}, { sort: { updated_at: -1 } });
    }

    return NextResponse.json({ profile, success: true });
  } catch (error) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, user_id, business_name, business_category, city, google_review_link, preferred_language, discount_percentage } = body;

    if (!isMongoConfigured()) {
      return NextResponse.json({ success: true, mode: 'local', profile: body });
    }

    const profilesCol = await getCollection('profiles');
    const now = new Date().toISOString();
    const profileId = id || 'biz_' + Math.random().toString(36).substring(2, 11);

    const updateDoc = {
      id: profileId,
      user_id: user_id || 'user-default-01',
      business_name: business_name || 'My Business',
      business_category: business_category || 'Healthcare & Dental',
      city: city || '',
      google_review_link: google_review_link || 'https://search.google.com/local/writereview',
      preferred_language: preferred_language || 'en',
      discount_percentage: Number(discount_percentage) || 0,
      updated_at: now,
    };

    await profilesCol.updateOne(
      { id: profileId },
      {
        $set: updateDoc,
        $setOnInsert: { created_at: now },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, profile: updateDoc });
  } catch (error) {
    console.error('Save profile error:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
