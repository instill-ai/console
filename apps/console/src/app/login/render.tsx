"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as z from "zod";

import {
  changePasswordMutation,
  Nullable,
  toastInstillError,
  useAuthenticatedUser,
} from "@instill-ai/toolkit";
import { authLoginAction } from "@instill-ai/toolkit/server";

import {
  AuthPageBase,
  ChangePasswordForm,
  ChangePasswordFormSchema,
  LoginForm,
  LoginFormSchema,
} from "~/components";
import { useAppTrackToken } from "~/lib/useAppTrackToken";

export const LoginPageRender = () => {
  const router = useRouter();
  const [isDefaultPWD, setIsDefaultPWD] = React.useState(false);
  const [accessToken, setAccessToken] = React.useState<Nullable<string>>(null);
  const [loginIsComplete, setLoginIsComplete] = React.useState(false);
  const [changePasswordIsComplete, setChangePasswordIsComplete] =
    React.useState(false);

  const trackToken = useAppTrackToken({
    enabled: !!accessToken && changePasswordIsComplete,
  });

  const me = useAuthenticatedUser({
    enabled: !!accessToken,
    accessToken: accessToken,
  });

  async function login(data: z.infer<typeof LoginFormSchema>) {
    try {
      const res = await authLoginAction({ payload: data });

      await axios.post("/api/set-user-cookie", {
        key: "instill-auth-session",
        value: JSON.stringify({
          accessToken: res,
        }),
      });

      if (data.password === "password") {
        setIsDefaultPWD(true);
        setAccessToken(res);
        setLoginIsComplete(true);
      } else {
        setAccessToken(res);
        setLoginIsComplete(true);
        setChangePasswordIsComplete(true);
      }
    } catch (error) {
      toastInstillError({
        title: "Something went wrong when login",
        error,
      });
    }
  }

  async function changePassword(
    data: z.infer<typeof ChangePasswordFormSchema>,
  ) {
    if (!accessToken) {
      return;
    }

    try {
      await changePasswordMutation({
        payload: {
          oldPassword: "password",
          newPassword: data.newPassword,
        },
        accessToken,
      });

      setChangePasswordIsComplete(true);
    } catch (error) {
      toastInstillError({
        title: "Something went wrong when change password",
        error,
      });
    }
  }

  React.useEffect(() => {
    if (!loginIsComplete) {
      return;
    }

    if (isDefaultPWD && !changePasswordIsComplete) {
      return;
    }

    if (!me.isSuccess) {
      return;
    }

    if (trackToken.isSuccess) {
      router.push(`/${me.data.id}/pipelines`);
    }
  }, [
    trackToken.data,
    trackToken.isSuccess,
    isDefaultPWD,
    loginIsComplete,
    changePasswordIsComplete,
    me.data,
    me.isSuccess,
    router,
  ]);

  return (
    <AuthPageBase>
      <AuthPageBase.Container>
        <AuthPageBase.Content>
          <div className="m-auto flex w-[360px] flex-col">
            <h1 className="text-semantic-fg-primary product-headings-heading-1 mb-8">
              {isDefaultPWD ? "Change password" : "Login"}
            </h1>
            {isDefaultPWD ? (
              <ChangePasswordForm onSubmit={changePassword} />
            ) : (
              <LoginForm onSubmit={login} />
            )}
          </div>
        </AuthPageBase.Content>
      </AuthPageBase.Container>
    </AuthPageBase>
  );
};
