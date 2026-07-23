import { COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const res = Response.json({ success: true });
  res.headers.set(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`
  );
  return res;
}
