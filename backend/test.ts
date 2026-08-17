async function test() {
  const baseUrl = 'http://localhost:3000/api';
  
  // Wait a bit to ensure server restarted
  await new Promise(r => setTimeout(r, 2000));

  console.log('--- 1. Testing POST /api/emails ---');
  let createRes = await fetch(`${baseUrl}/emails`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: 'test@example.com',
      subject: 'Test Subject',
      content: 'Test content',
      scheduledAt: new Date(Date.now() + 100000).toISOString(),
      timezone: 'Asia/Ho_Chi_Minh'
    })
  });
  console.log('Status:', createRes.status);
  const email = await createRes.json();
  console.log(email);

  console.log('\n--- 2. Testing Validation Failure (Past Date) ---');
  let createFailRes = await fetch(`${baseUrl}/emails`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: 'invalid',
      subject: '',
      content: '',
      scheduledAt: new Date(Date.now() - 100000).toISOString(),
      timezone: ''
    })
  });
  console.log('Status:', createFailRes.status);
  console.log(JSON.stringify(await createFailRes.json(), null, 2));

  console.log('\n--- 3. Testing GET /api/emails ---');
  let getRes = await fetch(`${baseUrl}/emails`);
  console.log('Status:', getRes.status);
  console.log(`Found ${((await getRes.json()) as any[]).length} emails`);

  console.log(`\n--- 4. Testing GET /api/emails/${email.id} ---`);
  let getByIdRes = await fetch(`${baseUrl}/emails/${email.id}`);
  console.log('Status:', getByIdRes.status);
  console.log((await getByIdRes.json()).id === email.id ? 'ID Matches' : 'ID Mismatch');

  console.log('\n--- 5. Testing GET /api/emails/invalid-id ---');
  let getMissingRes = await fetch(`${baseUrl}/emails/invalid-id`);
  console.log('Status:', getMissingRes.status);

  console.log(`\n--- 6. Testing POST /api/emails/${email.id}/cancel ---`);
  let cancelRes = await fetch(`${baseUrl}/emails/${email.id}/cancel`, { method: 'POST' });
  console.log('Status:', cancelRes.status);
  console.log((await cancelRes.json()).status);

  console.log(`\n--- 7. Testing POST /api/emails/${email.id}/cancel (again) ---`);
  let cancelAgainRes = await fetch(`${baseUrl}/emails/${email.id}/cancel`, { method: 'POST' });
  console.log('Status:', cancelAgainRes.status);
  console.log(JSON.stringify(await cancelAgainRes.json(), null, 2));
}

test().catch(console.error);
