"use server";

import axiosClient from "@/config/axios";
import { cookies } from "next/headers";

export async function getAuthenticateUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("MapToken");
  if (!token) {
    return;
  }
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token?.value}`,
    },
  };
  const { data } = await axiosClient("/profile", config);
  return data.user;
}
