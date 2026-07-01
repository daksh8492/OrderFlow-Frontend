import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function ImageGallery(props: { imageUrls?: string[] }) {
  const { imageUrls } = props;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const hasImages = !!imageUrls?.length;

  const showPrevious = () => {
    if (!hasImages) return;

    setSelectedIndex((prev) => (prev === 0 ? imageUrls!.length - 1 : prev - 1));
  };

  const showNext = () => {
    if (!hasImages) return;

    setSelectedIndex((prev) => (prev === imageUrls!.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        showPrevious();
      }
      if (event.key === "ArrowRight") {
        showNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, imageUrls]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [imageUrls]);

  return (
    <div className="lg:col-span-5">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border bg-muted">
        {imageUrls?.length ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <img
                draggable={false}
                src={imageUrls[selectedIndex]}
                className="h-full w-full object-cover"
              />
            </DialogTrigger>
            <DialogContent className="max-w-6xl border-none bg-transparent shadow-none">
              <div className="relative flex items-center justify-center">
                <img
                  src={imageUrls[selectedIndex]}
                  draggable={false}
                  className="max-h-[85vh] rounded-xl object-contain"
                />

                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4"
                  onClick={showPrevious}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4"
                  onClick={showNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                <div className="absolute bottom-4 rounded-full bg-black/70 px-3 py-1 text-sm text-white">
                  {selectedIndex + 1} / {imageUrls.length}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center text-muted-foreground cursor-zoom-in">
            <div className="rounded-full border bg-background p-5">
              <ImageOff className="h-8 w-8" />
            </div>
            <div>
              <p className="font-medium">No Image Available</p>
              <p className="mt-1 text-sm">
                Upload product images to preview them here.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
        {imageUrls?.map((image, index) => (
          <button
            key={image}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "h-20 w-20 overflow-hidden rounded-xl border transition-all",
              selectedIndex === index
                ? "border-primary ring-2 ring-primary"
                : "hover:border-primary/50",
            )}
          >
            <img
              src={image}
              alt={`Product image ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;
