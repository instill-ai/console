import * as React from "react";
import * as sanitizeHtml from "sanitize-html";
import cn from "clsx";

/**
 * This component will allow some default attribute plus "a" and "rel"
 * ref:
 *   - https://stackoverflow.com/a/69940844
 *   - https://github.com/airbytehq/airbyte/blob/59e20f20de73ced59ae2c782612fa7554fc1fced/airbyte-webapp/src/components/TextWithHTML/TextWithHTML.tsx
 */

const allowedAttributes = {
  ...sanitizeHtml.defaults.allowedAttributes,
  a: [...sanitizeHtml.defaults.allowedAttributes["a"], "rel", "class"],
};

export type TextWithHtmlProps = {
  text: string;
  width: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  textColor: string;
  linkFontFamily: string;
  linkFontSize: string;
  linkFontWeight: string;
  linkLineHeight: string;
  linkTextColor: string;
  linkTextDecoration: string;
};

const TextWithHtml = (props: TextWithHtmlProps) => {
  const {
    text,
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    textColor,
    width,
    linkFontFamily,
    linkFontSize,
    linkFontWeight,
    linkLineHeight,
    linkTextColor,
    linkTextDecoration,
  } = props;

  if (!text) return null;

  const sanitizedHtmlText = sanitizeHtml.default(text, {
    allowedAttributes,
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
        class: cn(
          linkFontFamily,
          linkFontSize,
          linkFontWeight,
          linkLineHeight,
          linkTextColor,
          linkTextDecoration
        ),
      }),
    },
  });

  return (
    <span
      className={cn(
        width,
        fontFamily,
        fontSize,
        fontWeight,
        lineHeight,
        textColor
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedHtmlText }}
    />
  );
};

export default TextWithHtml;
