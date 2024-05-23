"use client";

import * as React from "react";
import * as z from "zod";
import {
  AuthPageBase,
  ChangePasswordForm,
  ChangePasswordFormSchema,
  LoginForm,
  LoginFormSchema,
} from "components";
import { useRouter } from "next/navigation";
import {
  Nullable,
  changePasswordMutation,
  getInstillApiErrorMessage,
  useAuthenticatedUser,
} from "@instill-ai/toolkit";
import { useToast } from "@instill-ai/design-system";
import { useAppTrackToken } from "lib/useAppTrackToken";
import axios from "axios";
import { authLoginAction } from "@instill-ai/toolkit/server";

export const LoginPageRender = () => {
  const router = useRouter();
  const [isDefaultPWD, setIsDefaultPWD] = React.useState(false);
  const [accessToken, setAccessToken] = React.useState<Nullable<string>>(null);
  const [loginIsComplete, setLoginIsComplete] = React.useState(false);
  const [changePasswordIsComplete, setChangePasswordIsComplete] =
    React.useState(false);
  const { toast } = useToast();

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
          access_token: res,
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
      if (axios.isAxiosError(error)) {
        toast({
          title: "Something went wrong when login",
          variant: "alert-error",
          size: "large",
          description: getInstillApiErrorMessage(error),
        });
      } else {
        toast({
          title: "Something went wrong when login",
          variant: "alert-error",
          size: "large",
          description: "Please try again later",
        });
      }
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
          old_password: "password",
          new_password: data.new_password,
        },
        accessToken,
      });

      setChangePasswordIsComplete(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Something went wrong when login",
          variant: "alert-error",
          size: "large",
          description: getInstillApiErrorMessage(error),
        });
      } else {
        toast({
          title: "Something went wrong when login",
          variant: "alert-error",
          size: "large",
          description: "Please try again later",
        });
      }
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
