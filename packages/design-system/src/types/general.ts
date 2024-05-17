export type BasicInputProps = {
  /** Input field's id */
  id: string;

  /** Whether the input has error or not */
  error: Nullable<string>;

  /**
   * The additional message will display on the label
   * - e.g. {label} - {message}
   */

  additionalMessageOnLabel: Nullable<string>;

  /** TailwindCSS format - Message's text color
   * - e.g. text-semantic-node-disconnected-default-stroke
   */
  messageTextColor: string;

  /** TailwindCSS format - Message's font weight
   * - e.g. font-normal
   */
  messageFontWeight: string;

  /** TailwindCSS format - Message's font size
   * - e.g. text-base
   */
  messageFontSize: string;

  /** TailwindCSS format - Message's font family
   * - e.g. font-sans
   */
  messageFontFamily: string;

  /** TailwindCSS format - Message's line height
   * - e.g. leading-normal
   */
  messageLineHeight: string;

  /** TailwindCSS format - Background color when input has error
   * - e.g. bg-white
   * - https://tailwindcss.com/docs/background-color
   */
  errorInputBgColor: string;

  /** TailwindCSS format - Border color when input has error
   * - e.g. bg-white
   * - https://tailwindcss.com/docs/background-color
   */
  errorInputBorderColor: string;

  /** TailwindCSS format - Border width when input has error
   * - e.g. border-2
   * - https://tailwindcss.com/docs/border-width
   */
  errorInputBorderWidth: string;

  /** TailwindCSS format - Border style when input has error
   * - e.g. border-dashed
   * - https://tailwindcss.com/docs/border-style
   */
  errorInputBorderStyle: string;

  /** TailwindCSS format - Text color when input has error
   * - e.g. text-semantic-node-disconnected-default-stroke
   * - https://tailwindcss.com/docs/text-color
   */
  errorInputTextColor: string;

  /** TailwindCSS format - Label's text color when input has error
   * - e.g. text-semantic-node-disconnected-default-stroke
   */
  errorLabelTextColor: string;

  /** TailwindCSS format - Label's font weight when input has error
   * - e.g. font-normal
   */
  errorLabelFontWeight: string;

  /** TailwindCSS format - Label's font size when input has error
   * - e.g. text-base
   */
  errorLabelFontSize: string;

  /** TailwindCSS format - Label's font family when input has error
   * - e.g. font-sans
   */
  errorLabelFontFamily: string;

  /** TailwindCSS format - Label's line height when input has error
   * - e.g. leading-normal
   */
  errorLabelLineHeight: string;

  /** Field's label Name */
  label: Nullable<string>;

  /** Field's description */
  description: string | React.ReactNode;

  /** TailwindCSS format - Background color of input
   * - e.g. bg-white
   * - https://tailwindcss.com/docs/background-color
   */
  inputBgColor: string;

  /** TailwindCSS format - Background color when input is disabled
   * - e.g. bg-white
   * - https://tailwindcss.com/docs/background-color
   */
  disabledInputBgColor: string;

  /** TailwindCSS format - Border color when input is disabled
   * - e.g. border-instillGrey30
   * - https://tailwindcss.com/docs/border-color
   */
  disabledInputBorderColor: string;

  /** TailwindCSS format - Border width when input is disabled
   * - e.g. border-2
   * - https://tailwindcss.com/docs/border-width
   */
  disabledInputBorderWidth: string;

  /** TailwindCSS format - Border style when input is disabled
   * - e.g. border-dashed
   * - https://tailwindcss.com/docs/border-style
   */
  disabledInputBorderStyle: string;

  /** TailwindCSS format - Text color when input is disabled
   * - e.g. text-semantic-node-disconnected-default-stroke
   * - https://tailwindcss.com/docs/text-color
   */
  disabledInputTextColor: string;

  /** TailwindCSS format - Cursor when input is disabled
   * - e.g. cursor-not-allowed
   * - https://tailwindcss.com/docs/cursor
   */
  disabledCursor: string;

  /** TailwindCSS format - Background color when input is read-only
   * - e.g. bg-white
   * - https://tailwindcss.com/docs/background-color
   */
  readOnlyInputBgColor: string;

  /** TailwindCSS format - Border color when input is read-only
   * - e.g. border-instillGrey30
   * - https://tailwindcss.com/docs/border-color
   */
  readOnlyInputBorderColor: string;

  /** TailwindCSS format - Border width when input is read-only
   * - e.g. border-2
   * - https://tailwindcss.com/docs/border-width
   */
  readOnlyInputBorderWidth: string;

  /** TailwindCSS format - Border style when input is read-only
   * - e.g. border-dashed
   * - https://tailwindcss.com/docs/border-style
   */
  readOnlyInputBorderStyle: string;

  /** TailwindCSS format - Text color when input is read-only
   * - e.g. text-semantic-node-disconnected-default-stroke
   * - https://tailwindcss.com/docs/text-color
   */
  readOnlyInputTextColor: string;

  /** TailwindCSS format - Cursor when input is read-only
   * - e.g. cursor-not-allowed
   * - https://tailwindcss.com/docs/cursor
   */
  readOnlyCursor: string;

  /** TailwindCSS format
   * - Input's font size
   */
  inputFontSize: string;

  /** TailwindCSS format
   * - Input's font line height
   */
  inputLineHeight: string;

  /** TailwindCSS format
   * - Input's font weight
   */
  inputFontWeight: string;

  /** TailwindCSS format
   * - Input's text color
   */
  inputTextColor: string;

  /** TailwindCSS format
   * - Input's background color
   */
  bgColor: string;

  /** TailwindCSS format - The border color of the input */
  inputBorderColor: string;

  /** TailwindCSS formt - The border style of the input */
  inputBorderStyle: string;

  /** TailwindCSS formt - The border width of the input */
  inputBorderWidth: string;

  /** TailwindCSS format - The border radius of the input */
  inputBorderRadius: string;

  /** TailwindCSS format
   * - Default is w-full, please make sure this component's parent has defined width
   * - if you are not sure about the defined number, please use abitrary number like w-[number-unit] w-[20px].
   */
  inputWidth: string;

  /** focusHighlight
   * - enable: border highlight with intstill blue30
   * - disable: remove default input border highlight, the border will remain initial color and width
   */
  focusHighlight: boolean;

  /** TailwindCSS format
   * - Default is h-[70px]
   * - if you are not sure about the defined number, please use abitrary number like w-[number-unit] w-[20px].
   */
  inputHeight: Nullable<string>;

  /** They type of input label
   * - normal: Act as normal positioned title
   * - hide: Hide label
   */
  inputLabelType: "normal" | "hide";

  /** TailwindCSS format - Input placeholder's font size
   * - Please add persudo class "placeholder:"
   * - e.g. placeholder:text-base
   * - https://tailwindcss.com/docs/font-size
   */
  placeholderFontSize: string;

  /** TailwindCSS format - Input placeholder's text color
   * - Please add persudo class "placeholder:"
   * - e.g. placeholder:text-semantic-node-disconnected-default-stroke
   * - https://tailwindcss.com/docs/text-color
   */
  placeholderTextColor: string;

  /** TailwindCSS format - Input placeholder's line height
   * - Please add persudo class "placeholder:"
   * - e.g. placeholder:leading-normal
   * - https://tailwindcss.com/docs/line-height
   */
  placeholderLineHeight: string;

  /** TailwindCSS format - Input placeholder's font family
   * - Please add persudo class "placeholder:"
   * - e.g. placeholder:font-sans
   * - https://tailwindcss.com/docs/font-family
   */
  placeholderFontFamily: string;

  /** TailwindCSS format - Input placeholder's font weight
   * - Please add persudo class "placeholder:"
   * - e.g. placeholder:font-normal
   * - https://tailwindcss.com/docs/font-weight
   */
  placeholderFontWeight: string;

  /** TailwindCSS format - Label's text color
   * - e.g. text-semantic-node-disconnected-default-stroke
   */
  labelTextColor: string;

  /** TailwindCSS format - Label's font weight
   * - e.g. font-normal
   */
  labelFontWeight: string;

  /** TailwindCSS format - Label's font size
   * - e.g. text-base
   */
  labelFontSize: string;

  /** TailwindCSS format - Label's font family
   * - e.g. font-sans
   */
  labelFontFamily: string;

  /** TailwindCSS format - Label's line height
   * - e.g. leading-normal
   */
  labelLineHeight: string;

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
   * TailwindCSS format - Description can have html <a> tag, this imply the color of the <a>
   * - e.g. text-blue
   */
  descriptionLinkTextColor: string;

  /**
   * TailwindCSS format - Description can have html <a> tag, this imply the text decoration of the <a>
   * - e.g. underline
   */
  descriptionLinkTextDecoration: string;

  /**
   * TailwindCSS format - Description's width
   * - e.g. w-full
   */
  descriptionWidth: string;
};

export type Nullable<T> = T | null;

export type State = PipelineState | ModelState | "STATE_LOADING";

export type PipelineState =
  | "STATE_UNSPECIFIED"
  | "STATE_ACTIVE"
  | "STATE_INACTIVE"
  | "STATE_ERROR"
  | "STATE_DELETED";

export type ModelState =
  | "STATE_UNSPECIFIED"
  | "STATE_OFFLINE"
  | "STATE_SCALING"
  | "STATE_ACTIVE"
  | "STATE_IDLE"
  | "STATE_ERROR";

export type IconStyle = {
  width: string;
  height: string;
  position?: string;
  color?: string;
};

export type PipelineMode = "MODE_UNSPECIFIED" | "MODE_SYNC" | "MODE_ASYNC";

export type IconStyleWithoutColor = Omit<IconStyle, "color">;

export type SelectOption = {
  label: string;
  value: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};
