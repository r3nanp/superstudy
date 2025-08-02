import { httpClient } from "@/lib/http-client";
import type { User } from "./types";

export const getUser = async () => {
  const { data, status } = await httpClient.get<User>(`/api/users`);

  if (status !== 200) {
    const error = data as unknown as {
      error: { code: string; message: string };
    };

    throw new Error(error.error.message, { cause: error.error.code });
  }

  return data;
};
