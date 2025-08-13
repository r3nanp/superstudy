"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { cn } from "@/lib/utils";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useCallback, ChangeEvent } from "react";

const MAX_SIZE_MB = 5;

function toMegaBytes(bytes: number) {
  return bytes / (1024 * 1024);
}

export function FileUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (toMegaBytes(file.size) > MAX_SIZE_MB) {
      alert(`O arquivo não pode exceder ${MAX_SIZE_MB}MB`);
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleFileUpload = useCallback(async () => {
    if (!selectedFile) return;
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("Upload concluído!");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      alert("Erro no upload");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  return (
    <div className="w-full">
      <Input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="audio/*,image/*,application/pdf"
      />

      <div
        className={cn(
          "border-2 border-dashed rounded-lg w-full p-6 flex flex-col items-center justify-center text-center cursor-pointer transition",
          isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-foreground/10"
        )}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        {selectedFile ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleFileUpload();
              }}
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Confirmar envio"}
            </Button>
          </div>
        ) : (
          <>
            <ArrowUpTrayIcon className="size-8 text-gray-500 mb-2" />
            <span className="text-sm font-medium">
              {isLoading ? "Carregando..." : "Carregar arquivo"}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Áudio, imagem ou PDF (máx. {MAX_SIZE_MB}MB)
            </span>
          </>
        )}
      </div>
    </div>
  );
}
