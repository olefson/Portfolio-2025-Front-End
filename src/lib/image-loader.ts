export default function customImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // If the image is from /uploads/, return it as-is (no optimization)
  // These are served directly by the backend
  if (src.startsWith('/uploads/')) {
    return src;
  }
  
  // For local public images (like /headshot.jpg, /logo.png, /images/tools/*.svg, etc.), return as-is
  // These don't need optimization and are already in the public folder
  // Note: We check for /image? (with ?) to exclude the optimization API endpoint, not /images/ paths
  if (src.startsWith('/') && !src.startsWith('/api') && !src.startsWith('/_next') && !src.startsWith('/image?')) {
    // Check if it's a common image file in public folder
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];
    const lowerSrc = src.toLowerCase();
    if (imageExtensions.some(ext => lowerSrc.endsWith(ext))) {
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

