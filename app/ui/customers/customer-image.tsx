'use client';

import { CldImage } from 'next-cloudinary';
import { useState } from 'react';

export default function CustomerImage({ 
  src, 
  alt, 
  className 
}: { 
  src: string | null | undefined, 
  alt: string,
  className?: string 
}) {
  const [hasError, setHasError] = useState(false);
  const defaultImage = 'default_dafhf7';

  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return defaultImage;
    return url;
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <>
      {!hasError ? (
        <CldImage
          width={28}
          height={28}
          src={getImageUrl(src)}
          alt={alt}
          className={className}
          crop="fill"
          quality={80}
          format="auto"
          onError={handleError}
        />
      ) : (
        <CldImage
          width={28}
          height={28}
          src={defaultImage}
          alt="Default"
          className={className}
          crop="fill"
          quality={80}
          format="auto"
        />
      )}
    </>
  );
} 