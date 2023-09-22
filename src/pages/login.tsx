import { NextPageWithLayout } from "./_app";
import { AuthPageBase, LoginForm } from "@/components";

const LoginPage: NextPageWithLayout = () => {
  return (
    <div className="m-auto flex w-[360px] flex-col">
      <h1 className="mb-8 text-semantic-fg-primary product-headings-heading-1">
        Login
      </h1>
      <LoginForm />
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
