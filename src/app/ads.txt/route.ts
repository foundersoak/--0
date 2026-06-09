// Serves /ads.txt from the AdSense publisher ID, so there's a single place to
// configure ads (NEXT_PUBLIC_ADSENSE_CLIENT) for both the loader and ads.txt.
export function GET(): Response {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT; // e.g. ca-pub-1234567890123456
  const pub = client?.replace(/^ca-/, ""); // -> pub-1234567890123456
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : "# Set NEXT_PUBLIC_ADSENSE_CLIENT (ca-pub-...) to publish your AdSense ads.txt line.\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
