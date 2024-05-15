const IDInvalidError =
  "The ID should be lowercase without any space or special character besides the underscore or hyphen, it can not start with number or hyphen, and should be less than 32 characters.";

const KeyInvalidError =
  "The key should be lowercase without any space or special character besides the underscore or hyphen, it can not start with number or hyphen, and should be less than 32 characters.";

const NoCustomHardwareNameError =
  "You should specify your custom hardware name.";

export const InstillErrors = {
  IDInvalidError,
  KeyInvalidError,
  NoCustomHardwareNameError,
};
