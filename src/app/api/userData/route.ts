

export async function Post(vtoken: string) {
  const response = await fetch('https://n8n.srv869586.hstgr.cloud/webhook/portal', {
    method: 'POST',
    headers: {
     
      'Authorization': `Bearer ${vtoken}`,
    },
    body: JSON.stringify({
          action: "list",
          table: "emps",
          filter1: 'email=eq.digital.rdmc@ratpdev.com'
        })
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}
