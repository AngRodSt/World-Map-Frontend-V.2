import axios from "axios";

export default function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error) && error.response) {
    const message: string =
      error.response.data.msg || "An unexpected error occurred";
    return message;
  }

  return "An unexpected error occurred";
}
