/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from "react";
import { NextRouter } from "next/router";
import { UseFormReturn } from "react-hook-form";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type Nullable<T> = T | null;

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type UseCustomHookResult<T> = [
  T,
  React.Dispatch<React.SetStateAction<T>>,
];

export type InstillAiUserCookie = {
  cookie_token: string;
};

export type GeneralUseFormReturn = UseFormReturn<
  { [k: string]: any },
  any,
  undefined
>;

export type GeneralRecord = Record<string, any>;

export type InstillAppEnv = "APP_ENV_CORE" | "APP_ENV_CLOUD";

export type GeneralPageProp = {
  router: NextRouter | AppRouterInstance;
  enableQuery: boolean;
  accessToken: Nullable<string>;
};
