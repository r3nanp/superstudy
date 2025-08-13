import { httpClient } from "@/lib/http-client";
import type { APIErrorResponse, User } from "@/lib/types";

export const getUser = async () => {
  const { data, status } = await httpClient.get<User>(`/api/users`);

  if (status !== 200) {
    const error = data as unknown as APIErrorResponse;

    throw new Error(error.error.message, { cause: error.error.code });
  }

  return data;
};
