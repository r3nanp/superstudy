import { createSupabaseClient } from "@/lib/supabase";
import z from "zod";

const schema = z.object({
  file: z.instanceof(File),
  type: z.enum(["avatar", "audio"]),
  userId: z.string().optional(),
});

const BUCKET_NAME = "uploads";

export const POST = async (request: Request) => {
  try {
    const { file, type, userId } = schema.parse(await request.json());
    const supabase = createSupabaseClient();

    const filePath =
      type === "avatar"
        ? `avatars/${userId ?? Date.now()}-${file.name}`
        : `audios/${crypto.randomUUID()}-${file.name}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return new Response(JSON.stringify({ url: urlData.publicUrl }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro ao fazer upload" }), {
      status: 400,
    });
  }
};
