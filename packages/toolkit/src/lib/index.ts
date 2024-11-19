import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";

export * from "./amplitude";
export * from "./dashboard";
export * from "./dot";
export * from "./github";
export * from "./hook";
export * from "./pathname-evaluator";
export * from "./react-query-service";
export * from "./store";
export * from "./table";
export * from "./tip-tap";
export * from "./type";
export * from "./use-callback-ref";
export * from "./use-controllable-state";
export * from "./use-instill-form";
export * from "./use-instill-store";
export * from "./use-smart-hint";
export * from "./sdk-helper";
export * from "./fillArrayWithZero";
export * from "./isArtifactRelatedInstillFormat";
export * from "./isDownloadableArtifactBlobURL";
export * from "./isPublicModel";
export * from "./isPublicPipeline";
export * from "./isValidURL";
export * from "./toastInstillError";
export * from "./useRouteInfo";
export * from "./getCaptializeTwoWordsFromName";
export * from "./convertLongNumberToK";
export * from "./formatNumberToLocale";
export * from "./generateDateInPast";
export * from "./createNaiveRandomString";
export * from "./convertSentenceToCamelCase";
export * from "./useUserNamespaces";
export * from "./stringToHash32Bit";
export * from "./clientCookies";

export { initializeIntegrationConnection } from "./integrations/helpers";

export { debounce };

export { isEqual };
