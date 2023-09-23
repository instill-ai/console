import { GetServerSideProps } from "next";
import { NextPageWithLayout } from "./_app";
import { AuthPageBase } from "@/components";
import { authLogoutAction, removeCookie } from "@instill-ai/toolkit";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { cookies } = req;

  if (cookies["instill-auth-session"]) {
    const accessToken = JSON.parse(
      cookies["instill-auth-session"]
    ).access_token;

    await authLogoutAction({ accessToken });

    removeCookie({
      res,
      key: "instill-auth-session",
    });

    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

const LogoutPage: NextPageWithLayout = () => {
  return <></>;
};

LogoutPage.getLayout = (page) => {
  return (
    <AuthPageBase>
      <AuthPageBase.Container>
        <AuthPageBase.Content>{page}</AuthPageBase.Content>
      </AuthPageBase.Container>
    </AuthPageBase>
  );
};

export default LogoutPage;
