import cn from "clsx";
import * as React from "react";
import sanitizeHtml from "sanitize-html";
import { Nullable } from "../../types/general";

/**
 * This component will allow some default attribute plus "a" and "rel"
 * ref:
 *   - https://stackoverflow.com/a/69940844
 *   - https://github.com/airbytehq/airbyte/blob/59e20f20de73ced59ae2c782612fa7554fc1fced/airbyte-webapp/src/components/TextWithHTML/TextWithHTML.tsx
 */

const allowedAttributes = {
  a: [...sanitizeHtml.defaults.allowedAttributes["a"], "rel", "class"],
  strong: ["class"],
  em: ["class"],
  code: ["class"],
};

export const ParagraphWithHTML = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { text: Nullable<string> }
>(({ className, text, ...props }, ref) => {
  if (!text) return null;

  const sanitizedHtmlText = sanitizeHtml(text, {
    allowedAttributes,
    allowedTags: ["a", "strong", "em", "code"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
        class: "text-semantic-accent-default underline",
      }),
      strong: sanitizeHtml.simpleTransform("strong", {
        class: "font-bold",
      }),
      em: sanitizeHtml.simpleTransform("strong", {
        class: "font-bold",
      }),
      code: sanitizeHtml.simpleTransform("code", {
        class: "bg-semantic-bg-secondary rounded px-1 py-0.5 text-[0.8em]",
      }),
    },
  });

  return (
    <p
      {...props}
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtmlText }}
    />
  );
});
ParagraphWithHTML.displayName = "ParagraphWithHTML";
