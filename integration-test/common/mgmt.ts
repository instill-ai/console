export const removeRegisteredUser = async () => {
  await fetch(
    `${process.env.NEXT_PUBLIC_MGMT_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/local-user`,
    { method: "patch", body: JSON.stringify({ cookie_token: "" }) }
  );
};
