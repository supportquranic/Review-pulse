import { NextResponse } from 'next/server';
import { getCollection, isMongoConfigured } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (!isMongoConfigured()) {
      return NextResponse.json({
        success: true,
        mode: 'local',
        user: { id: 'user-default-01', email },
      });
    }

    const usersCol = await getCollection('users');
    const user = await usersCol.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const profilesCol = await getCollection('profiles');
    const profile = await profilesCol.findOne({ user_id: user.id });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email },
      profile: profile || null,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
