import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.libsql://prayer-conference-visionwave.aws-ap-northeast-1.turso.io,
  authToken: process.env.eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODMxNTE0ODgsImlkIjoiMDE5ZjJjMTItOGYwMS03NWRlLWFjMTAtZWI5ZGU5MzU1NWMzIiwia2lkIjoiaGVOdGIzSy1CSmZYU3JEbTA3STJiVTA2b2Fuc2F6QjZObzVfUGRVNlExcyIsInJpZCI6IjI0OTJlMGIwLTc0ZjQtNGU5Ni05MWNiLTdjYjM1MjExMzA0MSJ9.OIwdSsaJLQs67LUfD-1hGc6sUt_hQ4fwtchuTnYGL9wCwG8JhSQi6LqLaEcL2BW0M6cQ3Y0Jel4rJ5qSGYwADw});

function isAuthorized(req) {
  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme !== 'Basic' || !encoded) return false;

  const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
  const separatorIndex = decoded.indexOf(':');
  const user = decoded.slice(0, separatorIndex);
  const pass = decoded.slice(separatorIndex + 1);

  return user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS;
}

export default async function handler(req, res) {
  if (!isAuthorized(req)) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin"');
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }

  try {
    const result = await client.execute('SELECT * FROM submissions ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'server error' });
  }
}
