import { useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { XIcon, FileIcon, ImageIcon } from "lucide-react";

interface FileUploadProps {
  label: string;
  storageId?: Id<"_storage">;
  onUpload: (storageId: Id<"_storage">) => void;
  onRemove: () => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({
  label,
  storageId,
  onUpload,
  onRemove,
  accept = "image/jpeg,image/png,application/pdf",
  maxSize = 10,
  className,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.modules.patientIntake.patientIntake.generateUploadUrl);
  const fileUrl = useQuery(
    api.modules.patientIntake.patientIntake.getFileUrl,
    storageId ? { storageId } : "skip"
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    const acceptedTypes = accept.split(",").map((t) => t.trim());
    if (!acceptedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload JPG, PNG, or PDF");
      return;
    }

    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { storageId: newStorageId } = await response.json();
      onUpload(newStorageId);
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onRemove();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const isImage = fileUrl && (fileUrl.includes(".jpg") || fileUrl.includes(".jpeg") || fileUrl.includes(".png") || !fileUrl.includes(".pdf"));

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium">{label}</label>

      {storageId && fileUrl ? (
        <div className="relative rounded-lg border p-4">
          <div className="flex items-center gap-3">
            {isImage ? (
              <div className="relative h-20 w-20 overflow-hidden rounded border">
                <img
                  src={fileUrl}
                  alt={label}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded border bg-muted">
                <FileIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">File uploaded</p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                View file
              </a>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="text-muted-foreground hover:text-destructive"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
            "hover:border-primary hover:bg-primary/5",
            isUploading && "pointer-events-none opacity-50"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-2 text-sm font-medium">Click to upload</p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, or PDF (max {maxSize}MB)
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
