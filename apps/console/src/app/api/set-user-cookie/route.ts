import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();

  const res = await request.json();

  if (!res?.key) {
    return new Response("Key not provided", { status: 500 });
  }

  if (!res?.value) {
    return new Response("Value not provided", { status: 500 });
  }

  console.log("set-user-cookie", res);

  cookieStore.set(res.key, res.value);

  return new Response("Cookie set", { status: 200 });
}
