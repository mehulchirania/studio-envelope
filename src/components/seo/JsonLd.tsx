import type { ReactElement } from "react";

type JsonLdProps = {
  schema: Record<string, unknown> | Array<Record<string, unknown>>;
};

export default function JsonLd({ schema }: JsonLdProps): ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
