export default function customImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // If the image is from /uploads/, return it as-is (no optimization)
  // These are served directly by the backend
  if (src.startsWith('/uploads/')) {
    return src;
  }
  
  // For local public images (like /headshot.jpg), return as-is
  // These don't need optimization and are already in the public folder
  if (src.startsWith('/') && !src.startsWith('/api') && !src.startsWith('/_next')) {
    // Check if it's a common image file in public folder
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    if (imageExtensions.some(ext => src.toLowerCase().endsWith(ext))) {
      return src;
    }
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
  
  // For other local Next.js images, use Next.js optimization
  const params = new URLSearchParams();
  params.set('url', src);
  params.set('w', width.toString());
  if (quality) {
    params.set('q', quality.toString());
  }
  return `/image?${params.toString()}`;
}

