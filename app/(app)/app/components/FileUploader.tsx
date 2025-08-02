"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useUser } from "@/hooks/use-user";
import { httpClient } from "@/lib/http-client";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { type ChangeEvent, useCallback, useRef, useState } from "react";
import { toast } from "sonner";

const MAX_SIZE_MB = 5;
const toMegaBytes = (bytes: number) => bytes / 1024 / 1024;

export function FileUploader() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (toMegaBytes(file.size) > MAX_SIZE_MB) {
      toast.error(`O arquivo não pode exceder ${MAX_SIZE_MB}MB`);
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleFileUpload = useCallback(async () => {
    if (!selectedFile) return;

    try {
      setIsLoading(true);

      const isAudio = selectedFile.type.startsWith("audio/");
      const params = new URLSearchParams();
      params.set("type", isAudio ? "audio" : "avatar");
      params.set("userSupabaseId", user?.externalId ?? "");

      const formData = new FormData();
      formData.append("file", selectedFile);

      const { data: uploadData, status } = await httpClient.post(
        "/api/upload",
        formData,
        {
          params,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (status !== 200) {
        throw new Error("Failed to upload file");
      }

      const { status: userStatus } = await httpClient.put(
        "/api/users",
        {
          type: isAudio ? "audio" : "avatar",
          url: uploadData.url,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (userStatus !== 200) {
        throw new Error("Failed to update user");
      }

      queryClient.invalidateQueries({ queryKey: ["user"] });

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      toast.error("Erro no upload do arquivo");
    } finally {
      setIsLoading(false);
    }
  }, [queryClient, selectedFile]);

  return (
    <div className="space-y-4">
      <Input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />

      <Button
        variant="hero"
        className="h-auto p-6 flex-col space-y-2"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
      >
        <BookOpenIcon className="h-6 w-6" />
        <span>{isLoading ? "Carregando..." : "Carregar arquivo"}</span>
      </Button>

      {selectedFile ? (
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>Arquivo:</strong> {selectedFile.name}
          </p>
          <p>
            <strong>Tamanho:</strong>{" "}
            {toMegaBytes(selectedFile.size).toFixed(2)} MB
          </p>
          <Button onClick={handleFileUpload} disabled={isLoading}>
            {isLoading ? "Enviando..." : "Confirmar envio"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
