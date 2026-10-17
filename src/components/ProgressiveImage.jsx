import { useEffect, useRef, useState } from 'react';

// Use this component for every photo, with a local ?progressive image import.
export default function ProgressiveImage({ image, alt, className = '', loading = 'lazy', fallback = 'Imagen no disponible', style, ...props }) {
  const ref = useRef(null);
  const [loadedSrc, setLoadedSrc] = useState(null);
  const [failedSrc, setFailedSrc] = useState(null);
  const failed = failedSrc === image.src;
  const loaded = loadedSrc === image.src;
  const state = failed ? 'error' : loaded ? 'loaded' : 'loading';

  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoadedSrc(image.src);
  }, [image.src]);

  async function reveal(event) {
    const element = event.currentTarget;
    try { await element.decode(); } catch { /* The load event already succeeded. */ }
    if (ref.current === element && element.currentSrc === new URL(image.src, document.baseURI).href) setLoadedSrc(image.src);
  }

  return (
    <span className={`progressive-image ${className}`} data-state={state} aria-busy={state === 'loading'} style={{ aspectRatio: `${image.width} / ${image.height}`, ...style }}>
      <span className="image-placeholder" aria-hidden="true" style={{ backgroundImage: `url("${image.placeholder}")` }} />
      <img {...props} ref={ref} src={image.src} alt={alt} width={image.width} height={image.height} loading={loading} decoding="async" onLoad={reveal} onError={() => setFailedSrc(image.src)} />
      {failed && <span className="image-fallback" aria-hidden="true">{fallback}</span>}
    </span>
  );
}
