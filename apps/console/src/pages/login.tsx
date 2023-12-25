import * as z from "zod";
import { useEffect, useState } from "react";
import { NextPageWithLayout } from "./_app";
import {
  AuthPageBase,
  ChangePasswordForm,
  ChangePasswordFormSchema,
  LoginForm,
  LoginFormSchema,
} from "../components";
import {
  Nullable,
  authLoginAction,
  changePasswordMutation,
  getInstillApiErrorMessage,
  useUserMe,
} from "@instill-ai/toolkit";
import { useToast } from "@instill-ai/design-system";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/router";
import { useTrackToken } from "../lib/useTrackToken";

const LoginPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [isDefaultPWD, setIsDefaultPWD] = useState(false);
  const [accessToken, setAccessToken] = useState<Nullable<string>>(null);
  const [loginIsComplete, setLoginIsComplete] = useState(false);
  const [changePasswordIsComplete, setChangePasswordIsComplete] =
    useState(false);
  const { toast } = useToast();

  const trackToken = useTrackToken({
    enabled: !!accessToken && changePasswordIsComplete,
  });

  const user = useUserMe({
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
      if (isAxiosError(error)) {
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
      if (isAxiosError(error)) {
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

  useEffect(() => {
    if (!loginIsComplete) {
      return;
    }

    if (isDefaultPWD && !changePasswordIsComplete) {
      return;
    }

    if (!user.isSuccess) {
      return;
    }

    if (trackToken.isSuccess) {
      router.push(`/${user.data.id}/pipelines`);
    }
  }, [
    trackToken.data,
    trackToken.isSuccess,
    isDefaultPWD,
    loginIsComplete,
    changePasswordIsComplete,
    user.data,
    user.isSuccess,
    router,
  ]);

  return (
    <div className="m-auto flex w-[360px] flex-col">
      <h1 className="mb-8 text-semantic-fg-primary product-headings-heading-1">
        {isDefaultPWD ? "Change password" : "Login"}
      </h1>
      {isDefaultPWD ? (
        <ChangePasswordForm onSubmit={changePassword} />
      ) : (
        <LoginForm onSubmit={login} />
      )}
    </div>
  );
};

LoginPage.getLayout = (page) => {
  return (
    <AuthPageBase>
      <AuthPageBase.Container>
        <AuthPageBase.Content>{page}</AuthPageBase.Content>
      </AuthPageBase.Container>
    </AuthPageBase>
  );
};

export default LoginPage;
