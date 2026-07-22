export async function GET() {
  return Response.json({
    success: true,
    service: "dtnetwork-zaap-bridge",
    status: "online",
    timestamp: new Date().toISOString(),
  });
}
