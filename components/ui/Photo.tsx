import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { images, type ImageKey } from "@/lib/content/images";

/** A print on the album page: intrinsic aspect ratio, lazy by default, alt text from messages. */
export async function Photo({
  id,
  sizes,
  className = "",
  imgClassName = "",
  eager = false,
}: {
  id: ImageKey;
  sizes: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  const t = await getTranslations("Images");
  const img = images[id];
  return (
    <div className={`overflow-hidden bg-paper-deep ${className}`}>
      <Image
        src={img.src}
        alt={t(id)}
        width={img.width}
        height={img.height}
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        className={`h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-album)] ${imgClassName}`}
      />
    </div>
  );
}
