import cn from "clsx";

export type InputDescriptionBaseProps = {
  /** Description of the input */
  description: string | React.ReactNode;

  /** TailwindCSS format - Description's font size
   * - e.g. text-base
   */
  descriptionFontSize: string;

  /** TailwindCSS format - Description's font family
   * - e.g. font-sans
   */
  descriptionFontFamily: string;

  /** TailwindCSS format - Description's text color
   * - e.g. text-semantic-node-disconnected-default-stroke
   */
  descriptionTextColor: string;

  /** TailwindCSS format - Description's line height
   * - e.g. leading-normal
   */
  descriptionLineHeight: string;

  /** TailwindCSS format - Description's font weight
   * - e.g. font-normal
   */
  descriptionFontWeight: string;

  /**
   * TailwindCSS format - Description's width
   * - e.g. w-full
   */
  descriptionWidth: string;

  /**
   * TailwindCSS format - Description can have html <a> tag, this imply the color of the <a>
   * - e.g. text-blue
   */
  descriptionLinkTextColor: string;

  /**
   * TailwindCSS format - Description can have html <a> tag, this imply the text decoration of the <a>
   * - e.g. underline
   */
  descriptionLinkTextDecoration: string;
};

export const InputDescriptionBase = (props: InputDescriptionBaseProps) => {
  const {
    description,
    descriptionWidth,
    descriptionFontFamily,
    descriptionFontSize,
    descriptionFontWeight,
    descriptionLineHeight,
    descriptionTextColor,
    descriptionLinkTextColor,
    descriptionLinkTextDecoration,
  } = props;

  return (
    <p
      className={cn(
        descriptionWidth,
        descriptionFontFamily,
        descriptionFontSize,
        descriptionFontWeight,
        descriptionLineHeight,
        descriptionTextColor,
        descriptionLinkTextColor,
        descriptionLinkTextDecoration
      )}
    >
      {description}
    </p>
  );
};
