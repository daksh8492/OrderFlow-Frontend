import { Button } from "@/components/ui/button";
import { uploadImage } from "@/services/imageService";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageIcon, ImagePlus, Loader2, Trash2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { VariantFormData } from "../../schema/variantSchema";

function ImageUpload(props: { form: UseFormReturn<VariantFormData> }) {
  const { form } = props;
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const uploadedImages = form.watch("imageUrls") ?? [];

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    setIsUploading(true);

    try {
      const urls = await Promise.all(
        Array.from(files).map(async (file) => {
          const result = await uploadImage(file);
          return result.secure_url;
        }),
      );
      const currentImages = form.getValues("imageUrls") ?? [];

      form.setValue("imageUrls", [...currentImages, ...urls], {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <ImageIcon className="mr-2 h-4 w-4" />
          Manage Images {uploadedImages.length}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Images</DialogTitle>
        </DialogHeader>

        {/* Upload Area */}
        <label
          htmlFor="image-upload"
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors hover:border-primary hover:bg-muted/50"
        >
          <ImagePlus className="mb-3 h-10 w-10 text-muted-foreground" />

          <p className="font-medium">Click to upload images</p>

          <p className="text-sm text-muted-foreground">PNG, JPG or WEBP</p>

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageSelect}
          />
        </label>

        {isUploading && (
          <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading images...
          </div>
        )}

        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {uploadedImages.map((url) => (
              <div
                key={url}
                className="group relative overflow-hidden rounded-lg border"
              >
                <img
                  src={url}
                  alt="Uploaded"
                  className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />

                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() =>
                    form.setValue(
                      "imageUrls",
                      uploadedImages.filter((image) => image !== url),
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    )
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ImageUpload;
