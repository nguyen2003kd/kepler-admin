"use client";

import baseConfig from "@/configs/base";
import Image from "next/image";
import type { PostImageProps } from "../types";

export function PostImage({ src, alt, className }: PostImageProps) {
  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return baseConfig.imgEndpointDomain + path;
  };

  const imageUrl = getImageUrl(src);

  if (!imageUrl) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-400 text-xs font-medium">No Image</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        sizes="64px"
        className="object-cover"
        loading="lazy"
      />
    </div>
  );
}
