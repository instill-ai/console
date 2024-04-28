import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();

  const res = await request.json();

  if (!res?.key) {
    return new Response("Key not provided", { status: 500 });
  }

  const targetCookie = cookieStore.get(res.key);

  if (targetCookie) {
    cookieStore.delete(res.key);
  }

  return new Response("Cookie removed", { status: 200 });
}
