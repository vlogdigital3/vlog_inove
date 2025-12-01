"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { api } from "@/services/api";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    onRemove: (value: string) => void;
    disabled?: boolean;
}

export function ImageUpload({
    value,
    onChange,
    onRemove,
    disabled
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newUrls: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const url = await api.uploadImage(file);
                newUrls.push(url);
            }
            onChange([...value, ...newUrls]);
        } catch (error) {
            console.error("Error uploading images:", error);
            alert("Erro ao fazer upload das imagens. Tente novamente.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {value.map((url) => (
                    <div key={url} className="relative aspect-square rounded-lg overflow-hidden border bg-secondary">
                        <div className="absolute top-2 right-2 z-10">
                            <Button
                                type="button"
                                onClick={() => onRemove(url)}
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>

            <div
                className={cn(
                    "border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center gap-2",
                    (disabled || isUploading) && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    disabled={disabled || isUploading}
                />
                {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                )}
                <div className="text-sm text-muted-foreground">
                    {isUploading ? (
                        <p>Enviando...</p>
                    ) : (
                        <>
                            <p className="font-semibold">Clique para fazer upload</p>
                            <p className="text-xs">ou arraste e solte (suporta múltiplas imagens)</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
