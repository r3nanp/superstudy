import { createClient } from "@/supabase/server";
import z from "zod";

const schema = z.object({
  type: z.enum(["avatar", "audio", "document"]),
  userSupabaseId: z.string(),
});

const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME;

export const POST = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const parsedSearchParams = schema.parse(Object.fromEntries(searchParams));

  try {
    if (!BUCKET_NAME) {
      return new Response(
        JSON.stringify({
          error: {
            message: "Bucket name is not set",
            code: "BUCKET_NAME_NOT_SET",
          },
        }),
        {
          status: 500,
        }
      );
    }

    const supabase = await createClient();
    const { type, userSupabaseId } = parsedSearchParams;

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!userSupabaseId) {
      return new Response(
        JSON.stringify({
          error: {
            message: "User ID is required",
            code: "USER_ID_REQUIRED",
          },
        }),
        {
          status: 400,
        }
      );
    }

    const getPath = () => {
      if (type === "avatar") {
        return `avatars/${userSupabaseId}-${Date.now()}-${file.name}`;
      }

      if (type === "audio") {
        return `audios/${userSupabaseId}-${Date.now()}-${file.name}`;
      }

      return `documents/${userSupabaseId}-${Date.now()}-${file.name}`;
    };

    const filePath = getPath();

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      return new Response(
        JSON.stringify({
          error: {
            message: error.message,
            code: "UPLOAD_ERROR",
          },
        }),
        {
          status: 400,
        }
      );
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return new Response(JSON.stringify({ url: urlData.publicUrl }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({
        error: {
          message: "Erro ao fazer upload",
          code: "UPLOAD_ERROR",
        },
      }),
      { status: 500 }
    );
  }
};
