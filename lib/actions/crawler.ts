"use server";
import { httpClient } from "../http-client";

export const crawlerAction = async (prevState: any, formData: FormData) => {
  const url = formData.get("url");

  if (!url) {
    return {
      error: "URL is required",
    };
  }

  try {
    const parsedUrl = new URL(url as string);
    const { data, status } = await httpClient.get(
      `/api/crawler?url=${parsedUrl.toString()}`
    );

    if (status !== 200) {
      throw new Error("Failed to crawl the website");
    }

    console.log(data);

    return data;
  } catch (error) {
    console.error(error);

    return {
      error: "Failed to crawl the website",
    };
  }
};
