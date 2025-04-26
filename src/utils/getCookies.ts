"use server";

import { cookies } from "next/headers";

export async function getCookies() {
  const cookieStore = await cookies();
  const tokenExist = cookieStore.has("MapToken");
  if (tokenExist) {
    const token = cookieStore.get("MapToken");
    return token?.value;
  } else {
    return null;
  }
}
