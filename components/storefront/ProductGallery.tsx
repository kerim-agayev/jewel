interface GalleryImage {
  url: string;
  alt: string;
}

/** Adapts to the image count (1 / 2-3 / 4) — see CLAUDE.md "Maximum 4 images per product". */
export function ProductGallery({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="aspect-square rounded-sm overflow-hidden bg-surface-container-low">
        {/* eslint-disable-next-line @next/next/no-img-element -- external Pexels/R2 URL */}
        <img src={images[0].url} alt={images[0].alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  if (images.length === 4) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {images.map((image, i) => (
          <div key={i} className="aspect-square rounded-sm overflow-hidden bg-surface-container-low">
            {/* eslint-disable-next-line @next/next/no-img-element -- external Pexels/R2 URL */}
            <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    );
  }

  const [main, ...rest] = images;
  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="col-span-3 aspect-square rounded-sm overflow-hidden bg-surface-container-low">
        {/* eslint-disable-next-line @next/next/no-img-element -- external Pexels/R2 URL */}
        <img src={main.url} alt={main.alt} className="w-full h-full object-cover" />
      </div>
      <div className="col-span-1 flex flex-col gap-2">
        {rest.map((image, i) => (
          <div key={i} className="aspect-square rounded-sm overflow-hidden bg-surface-container-low">
            {/* eslint-disable-next-line @next/next/no-img-element -- external Pexels/R2 URL */}
            <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
