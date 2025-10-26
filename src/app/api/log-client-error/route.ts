export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('client-error', body?.message, body?.stack?.slice(0, 500));
  } catch {
    // ignore
  }
  return Response.json({ ok: true });
}
