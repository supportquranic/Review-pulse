import { NextResponse } from 'next/server';
import { getCollection, isMongoConfigured } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, business_name, business_category, city, google_review_link, preferred_language, discount_percentage } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (!isMongoConfigured()) {
      return NextResponse.json({
        success: true,
        mode: 'local',
        user: { id: 'user-' + Date.now(), email },
        profile: {
          id: 'biz-' + Date.now(),
          user_id: 'user-' + Date.now(),
          business_name: business_name || 'My Business',
          business_category: business_category || 'Healthcare & Dental',
          city: city || '',
          google_review_link: google_review_link || 'https://search.google.com/local/writereview',
          preferred_language: preferred_language || 'en',
          discount_percentage: Number(discount_percentage) || 0,
        },
      });
    }

    const usersCol = await getCollection('users');
    const existingUser = await usersCol.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = 'usr_' + Math.random().toString(36).substring(2, 11);
    const businessId = 'biz_' + Math.random().toString(36).substring(2, 11);

    const now = new Date().toISOString();

    await usersCol.insertOne({
      _id: userId as unknown as import('mongodb').ObjectId,
      id: userId,
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      created_at: now,
    });

    const profilesCol = await getCollection('profiles');
    const newProfile = {
      _id: businessId as unknown as import('mongodb').ObjectId,
      id: businessId,
      user_id: userId,
      business_name: business_name || 'My Business',
      business_category: business_category || 'Healthcare & Dental',
      city: city || '',
      google_review_link: google_review_link || 'https://search.google.com/local/writereview',
      preferred_language: preferred_language || 'en',
      discount_percentage: Number(discount_percentage) || 0,
      created_at: now,
      updated_at: now,
    };

    await profilesCol.insertOne(newProfile);

    return NextResponse.json({
      success: true,
      user: { id: userId, email: email.toLowerCase() },
      profile: newProfile,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
