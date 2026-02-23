import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, FileIcon } from "lucide-react";

interface DocumentViewerProps {
  storageId?: Id<"_storage">;
  label: string;
}

export function DocumentViewer({ storageId, label }: DocumentViewerProps) {
  const fileUrl = useQuery(
    api.modules.patientIntake.patientIntake.getFileUrl,
    storageId ? { storageId } : "skip"
  );

  if (!storageId) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <FileIcon className="h-4 w-4" />
        <span className="text-sm">{label}: Not uploaded</span>
      </div>
    );
  }

  if (fileUrl === undefined) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  const isImage = fileUrl && !fileUrl.includes(".pdf");

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      {isImage && fileUrl ? (
        <div className="relative">
          <img
            src={fileUrl}
            alt={label}
            className="max-h-48 rounded border object-contain"
          />
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2"
            asChild
          >
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
          </Button>
        </div>
      ) : fileUrl ? (
        <Button variant="outline" size="sm" asChild>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLinkIcon className="mr-1 h-4 w-4" />
            View PDF
          </a>
        </Button>
      ) : (
        <span className="text-sm text-muted-foreground">Not available</span>
      )}
    </div>
  );
}
