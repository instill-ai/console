import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();

  const res = await request.json();

  if (!res.body.key) {
    return new Response("Key not provided", { status: 500 });
  }

  const targetCookie = cookieStore.get(res.body.key);

  if (targetCookie) {
    cookieStore.delete(res.body.key);
  }
}
