/**
 * Emits one or more JSON-LD blocks.
 *
 * `<` is escaped because the payload is serialised into a <script> element:
 * a literal `</script>` anywhere inside it would close the tag early. None of
 * the values come from user input today, but a helper that is safe only by
 * accident is a trap for whoever passes one through tomorrow.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(block).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
