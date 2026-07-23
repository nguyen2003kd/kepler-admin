"use client";

import { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { X, RotateCw, ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropModalProps {
  isOpen: boolean;
  imageUrl: string;
  aspectRatio?: number;
  onClose: () => void;
  onCropComplete: (croppedImageUrl: string, croppedBlob: Blob) => void;
}

export function ImageCropModal({
  isOpen,
  imageUrl,
  aspectRatio = 16 / 9,
  onClose,
  onCropComplete,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize crop when image loads
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Calculate crop to fit entire image with aspect ratio
    let cropWidth = 100;
    let cropHeight = 100;
    
    if (aspectRatio) {
      const imageAspect = width / height;
      if (imageAspect > aspectRatio) {
        // Image is wider, fit to height
        cropHeight = 100;
        cropWidth = (aspectRatio * height / width) * 100;
      } else {
        // Image is taller, fit to width
        cropWidth = 100;
        cropHeight = (width / (aspectRatio * height)) * 100;
      }
    }

    setCrop({
      unit: "%",
      width: cropWidth,
      height: cropHeight,
      x: (100 - cropWidth) / 2,
      y: (100 - cropHeight) / 2,
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setScale(1);
      setRotate(0);
      setLockAspect(true);
      setCrop(undefined);
    }
  }, [isOpen]);

  const generateCroppedImage = async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.save();

    const centerX = crop.width * scaleX / 2;
    const centerY = crop.height * scaleY / 2;

    ctx.translate(centerX, centerY);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    ctx.restore();

    return new Promise<{ url: string; blob: Blob }>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Failed to create blob from canvas");
            reject(new Error("Failed to create blob"));
            return;
          }
          console.log("Blob created successfully:", {
            size: blob.size,
            type: blob.type,
          });
          const croppedImageUrl = URL.createObjectURL(blob);
          resolve({ url: croppedImageUrl, blob });
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleCropComplete = async () => {
    try {
      const result = await generateCroppedImage();
      if (result) {
        console.log("Crop complete, sending blob:", {
          blobSize: result.blob.size,
          blobType: result.blob.type,
        });
        onCropComplete(result.url, result.blob);
        onClose();
      }
    } catch (error) {
      console.error("Error generating cropped image:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200]">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Cắt hình ảnh</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Lock Aspect Ratio Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="lockAspect"
                checked={lockAspect}
                onChange={(e) => setLockAspect(e.target.checked)}
                className="cursor-pointer"
              />
              <label htmlFor="lockAspect" className="text-sm cursor-pointer">
                Khóa tỷ lệ
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale(Math.max(0.5, scale - 0.1))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale(Math.min(3, scale + 0.1))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotate((rotate - 90) % 360)}
              >
                <RotateCw className="h-4 w-4 transform -scale-x-100" />
              </Button>
              <span className="text-sm min-w-[60px] text-center">
                {rotate}°
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotate((rotate + 90) % 360)}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setScale(1);
                setRotate(0);
                setLockAspect(true);
              }}
            >
              Đặt lại
            </Button>
          </div>

          {/* Crop Area */}
          <div className="max-h-[500px] overflow-auto flex items-center justify-center bg-gray-100 rounded-lg p-4">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={lockAspect ? aspectRatio : undefined}
              minWidth={50}
              minHeight={50}
            >
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Crop preview"
                crossOrigin="anonymous"
                onLoad={onImageLoad}
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  maxWidth: "100%",
                  maxHeight: "450px",
                }}
              />
            </ReactCrop>
          </div>

          {/* Hidden canvas for generating cropped image */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="p-4 border-t flex justify-end gap-2 bg-white">
          <Button variant="outline" onClick={onClose} size="lg">
            Hủy
          </Button>
          <Button 
            onClick={handleCropComplete}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Xác nhận cắt ảnh
          </Button>
        </div>
      </div>
    </div>
  );
}
