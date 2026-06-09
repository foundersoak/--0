/**
 * Renders a JSON-LD structured-data block. Server component; the payload is
 * trusted (built from our own config), so JSON.stringify output is injected
 * directly. Pass a single schema object or an array of them.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
