/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UseFormReturn } from "react-hook-form";

export type Nullable<T> = T | null;

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type UseCustomHookResult<T> = [
  T,
  React.Dispatch<React.SetStateAction<T>>,
];

export type InstillAiUserCookie = {
  cookieToken: string;
};

export type GeneralUseFormReturn = UseFormReturn<
  { [k: string]: any },
  any,
  { [k: string]: any }
>;

export type GeneralRecord = Record<string, any>;

export type InstillAppEnv = "APP_ENV_CORE" | "APP_ENV_CLOUD";

export type GeneralAppPageProp = {
  router: AppRouterInstance;
  enableQuery: boolean;
  accessToken: Nullable<string>;
};
