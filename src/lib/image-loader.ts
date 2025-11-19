export default function customImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // If the image is from /uploads/, return it as-is (no optimization)
  // These are served directly by the backend
  if (src.startsWith('/uploads/')) {
    return src;
  }
  
  // For remote images (http/https), use Next.js optimization API
  if (src.startsWith('http://') || src.startsWith('https://')) {
    const params = new URLSearchParams();
    params.set('url', src);
    params.set('w', width.toString());
    if (quality) {
      params.set('q', quality.toString());
    }
    return `/image?${params.toString()}`;
  }
  
  // For local Next.js images (starting with /), use Next.js optimization
  // This handles images in the public folder and other local assets
  const params = new URLSearchParams();
  params.set('url', src);
  params.set('w', width.toString());
  if (quality) {
    params.set('q', quality.toString());
  }
  return `/image?${params.toString()}`;
}

