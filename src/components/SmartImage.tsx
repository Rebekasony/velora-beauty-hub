import { useEffect, useState, type ImgHTMLAttributes, type SyntheticEvent } from "react";

type SmartImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  fallbackSrc?: string;
};

const DEFAULT_FALLBACK =
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80";

export function SmartImage({ src, fallbackSrc = DEFAULT_FALLBACK, onError, ...props }: SmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }

    if (onError) {
      onError(event);
    }
  };

  return <img {...props} src={currentSrc} onError={handleError} />;
}
