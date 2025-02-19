

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface DynamicImageProps {
  imageUrl: string | null; // Allow null for missing images
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const DynamicImageComponent = ({ imageUrl, alt, width, height }: DynamicImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>(imageUrl || '/images/fall-back.webp'); // Default to fallback if no imageUrl

  useEffect(() => {
    if (!imageUrl) {
      setImgSrc('/images/fall-back.webp'); // Set fallback if no imageUrl
    } else {
      setImgSrc(imageUrl); // Otherwise, use the provided imageUrl
    }
  }, [imageUrl]);

  const handleError = () => {
    setImgSrc('/images/fall-back.webp'); // Set fallback if image fails to load
  };

  return (
    <div className="relative w-full h-full">
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        onError={handleError}
        className="rounded-lg object-cover"
      />
    </div>
  );
};

export default DynamicImageComponent;
