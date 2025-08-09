export async function POST(request: Request ) {

   const { vtoken } = await request.json();

  const response = await fetch('https://n8n.srv869586.hstgr.cloud/webhook/8d5c8115-df0f-4ae0-8ebc-0ab02e9b34e4', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${vtoken}`,
    },
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
