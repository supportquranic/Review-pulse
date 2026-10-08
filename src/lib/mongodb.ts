import { MongoClient, Db, Collection, Document } from 'mongodb';
import dns from 'dns';

// Ensure robust SRV DNS resolution across local and cloud environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore in environments where custom DNS servers cannot be set
}

export function getMongoUri(): string {
  return process.env.MONGODB_URI || '';
}

const dbName = process.env.MONGODB_DB_NAME || 'reviewpulse';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  const uri = getMongoUri();
  return Boolean(uri && uri.trim().length > 0 && !uri.includes('placeholder'));
}

export async function getMongoClient(): Promise<MongoClient> {
  const uri = getMongoUri();
  if (!isMongoConfigured()) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    if (dns.setDefaultResultOrder) {
      dns.setDefaultResultOrder('ipv4first');
    }
  } catch {
    // Ignore DNS override errors if in restricted environment
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so the client is cached across module reloads
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    // In production mode, avoid global variable
    if (!clientPromise) {
      client = new MongoClient(uri);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

export async function getDb(): Promise<Db> {
  const mClient = await getMongoClient();
  return mClient.db(dbName);
}

export async function getCollection<T extends Document = Document>(name: string): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}
