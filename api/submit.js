import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    const {
      type = '',
      name = '',
      phone = '',
      email = '',
      heard = '',
      reason = '',
      freeTime = '',
      interest = ''
    } = req.body || {};

    if (!name) {
      return res.status(400).json({ status: 'error', message: 'name is required' });
    }

    await client.execute({
      sql: `INSERT INTO submissions (type, name, phone, email, heard, reason, free_time, interest)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [type, name, phone, email, heard, reason, freeTime, interest]
    });

    res.status(200).json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'server error' });
  }
}
