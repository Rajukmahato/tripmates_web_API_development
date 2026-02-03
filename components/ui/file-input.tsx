import * as React from "react";
import Image from "next/image";
import { cn, getProfileImageUrl } from "@/lib/utils";

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  onChange?: (file: File | null) => void;
  error?: string;
  currentImage?: string;
  currentImagePath?: string | null;
  previewClassName?: string;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, onChange, error, currentImage, currentImagePath, previewClassName, ...props }, ref) => {
    const [preview, setPreview] = React.useState<string | null>(null);
    const [fileName, setFileName] = React.useState<string>("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (!file) {
        setPreview(null);
        setFileName("");
        onChange?.(null);
        return;
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert("Invalid file type. Please select a JPEG, PNG, GIF, or WebP image.");
        e.target.value = "";
        return;
      }

      // Validate file size
      if (file.size > MAX_SIZE) {
        alert("File size exceeds 5MB. Please select a smaller image.");
        e.target.value = "";
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setFileName(file.name);
      onChange?.(file);
    };

    const handleClear = () => {
      setPreview(null);
      setFileName("");
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      onChange?.(null);
    };

    // Priority: preview > currentImagePath > currentImage
    const displayImage = preview || (currentImagePath ? getProfileImageUrl(currentImagePath) : currentImage);

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={inputRef}
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className={cn(
              "block w-full text-sm text-slate-500",
              "file:mr-4 file:py-2 file:px-4",
              "file:rounded-md file:border-0",
              "file:text-sm file:font-semibold",
              "file:bg-blue-50 file:text-blue-700",
              "hover:file:bg-blue-100",
              "file:cursor-pointer cursor-pointer",
              "dark:file:bg-blue-900/20 dark:file:text-blue-400",
              "dark:hover:file:bg-blue-900/30",
              className
            )}
            {...props}
          />
          {(preview || fileName) && (
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {fileName && (
          <p className="text-xs text-muted-foreground">
            Selected: {fileName}
          </p>
        )}

        {displayImage && (
          <div className={cn("mt-2 relative w-full max-w-xs h-48", previewClassName)}>
            <Image
              src={displayImage}
              alt="Preview"
              fill
              className="rounded-lg border border-border object-cover"
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <p className="text-xs text-muted-foreground">
          Accepted formats: JPEG, PNG, GIF, WebP (Max 5MB)
        </p>
      </div>
    );
  }
);
FileInput.displayName = "FileInput";

export { FileInput };
