import { useEffect, useRef, useId, useState, ReactNode, CSSProperties } from 'react';
import './GlassSurface.css';

interface GlassSurfaceProps {
  children: ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: 'R' | 'G' | 'B' | 'A';
  yChannel?: 'R' | 'G' | 'B' | 'A';
  mixBlendMode?: string;
  className?: string;
  style?: CSSProperties;
}

interface ContainerElement extends HTMLDivElement {
  _cachedSize?: { width: number; height: number };
}

const GlassSurface = ({
  children,
  width = 200,
  height = 80,
  borderRadius = 20,
  borderWidth = 0.07,
  brightness = 50,
  opacity = 0.93,
  blur = 11,
  displace = 0,
  backgroundOpacity = 0,
  saturation = 1,
  distortionScale = -180,
  redOffset = 0,
  greenOffset = 10,
  blueOffset = 20,
  xChannel = 'R',
  yChannel = 'G',
  mixBlendMode = 'difference',
  className = '',
  style = {}
}: GlassSurfaceProps) => {
  const uniqueId = useId().replace(/:/g, '-');
  const filterId = `glass-filter-${uniqueId}`;
  const redGradId = `red-grad-${uniqueId}`;
  const blueGradId = `blue-grad-${uniqueId}`;

  const containerRef = useRef<ContainerElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const redChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const gaussianBlurRef = useRef<SVGFEGaussianBlurElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);

  const generateDisplacementMap = (): string => {
    const rect = containerRef.current?.getBoundingClientRect();
    const actualWidth = rect?.width || 400;
    const actualHeight = rect?.height || 200;
    const edgeSize = Math.min(actualWidth, actualHeight) * (borderWidth * 0.5);

    const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${redGradId})" />
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mixBlendMode}" />
        <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  };

  const updateDisplacementMap = (): void => {
    // Skip if displace is 0 (no chromatic aberration needed)
    if (displace === 0 || !feImageRef.current) return;
    
    // Debounce updates for large elements to reduce CPU usage
    const rect = containerRef.current?.getBoundingClientRect();
    const area = rect ? rect.width * rect.height : 0;
    const isLargeElement = area > 200000; // Elements larger than ~200k pixels
    
    if (isLargeElement) {
      // For large elements, use a simpler, cached approach
      // Only update if dimensions actually changed significantly
      const cachedSize = containerRef.current?._cachedSize;
      if (cachedSize && 
          Math.abs(cachedSize.width - (rect?.width || 0)) < 50 &&
          Math.abs(cachedSize.height - (rect?.height || 0)) < 50) {
        return; // Skip update if size hasn't changed much
      }
      if (rect && containerRef.current) {
        containerRef.current._cachedSize = { width: rect.width, height: rect.height };
      }
    }
    
    feImageRef.current.setAttribute('href', generateDisplacementMap());
  };

  useEffect(() => {
    // Only update displacement map if displace > 0 (chromatic aberration enabled)
    if (displace > 0) {
      updateDisplacementMap();
      [
        { ref: redChannelRef, offset: redOffset },
        { ref: greenChannelRef, offset: greenOffset },
        { ref: blueChannelRef, offset: blueOffset }
      ].forEach(({ ref, offset }) => {
        if (ref.current) {
          ref.current.setAttribute('scale', (distortionScale + offset).toString());
          ref.current.setAttribute('xChannelSelector', xChannel);
          ref.current.setAttribute('yChannelSelector', yChannel);
        }
      });
      gaussianBlurRef.current?.setAttribute('stdDeviation', displace.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    width,
    height,
    borderRadius,
    borderWidth,
    brightness,
    opacity,
    blur,
    displace,
    distortionScale,
    redOffset,
    greenOffset,
    blueOffset,
    xChannel,
    yChannel,
    mixBlendMode
  ]);

  useEffect(() => {
    // Skip ResizeObserver if displace=0 (no displacement map needed)
    if (!containerRef.current || displace === 0) return;

    let timeoutId: NodeJS.Timeout;
    const resizeObserver = new ResizeObserver(() => {
      // Debounce resize updates, especially for large elements
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        updateDisplacementMap();
      }, 100); // 100ms debounce
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displace]);

  useEffect(() => {
    // Only update displacement map if displace > 0
    if (displace > 0) {
      setTimeout(updateDisplacementMap, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, displace]);

  // Lazy load glass effects for large elements - only enable when visible
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Detect if this is a large element
    const isLarge = (typeof width === 'string' && width.includes('%')) || (typeof width === 'number' && width > 600);
    
    if (!isLarge) {
      // Small elements always enabled
      setIsVisible(true);
      setIsNearViewport(true);
      return;
    }

    // For large elements, use IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Enable when element is within 200px of viewport
          setIsNearViewport(entry.isIntersecting || entry.intersectionRatio > 0);
          // Fully enable when actually visible
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: [0, 0.1, 0.5, 1]
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [width]);

  const supportsSVGFilters = (): boolean => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }

    const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);

    if (isWebkit || isFirefox) {
      return false;
    }

    const div = document.createElement('div');
    div.style.backdropFilter = `url(#${filterId})`;
    return div.style.backdropFilter !== '';
  };

  const containerStyle: CSSProperties = {
    ...style,
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: `${borderRadius}px`,
    '--glass-frost': backgroundOpacity,
    '--glass-saturation': saturation,
    '--filter-id': `url(#${filterId})`
  } as CSSProperties;

  // Detect if this is a large element for performance optimization
  const isLargeElement = (): boolean => {
    if (typeof width === 'string' && width.includes('%')) return true; // Full width elements
    if (typeof width === 'number' && width > 600) return true;
    return false;
  };

  const largeClass = isLargeElement() ? 'glass-surface--large' : '';
  const dataLarge = isLargeElement() ? { 'data-large': 'true' } : {};
  
  // For large elements, disable backdrop-filter until visible
  const shouldEnableGlass = !isLargeElement() || isNearViewport;
  const glassClass = shouldEnableGlass 
    ? (supportsSVGFilters() ? 'glass-surface--svg' : 'glass-surface--fallback')
    : 'glass-surface--disabled';

  return (
    <div
      ref={containerRef}
      className={`glass-surface ${glassClass} ${largeClass} ${className}`}
      style={containerStyle}
      {...dataLarge}
    >
      {/* Simplified SVG filter - chromatic aberration removed when displace=0 */}
      <svg className="glass-surface__filter" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            {displace > 0 ? (
              <>
                <feImage ref={feImageRef} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
                <feDisplacementMap ref={redChannelRef} in="SourceGraphic" in2="map" id="redchannel" result="dispRed" />
                <feColorMatrix
                  in="dispRed"
                  type="matrix"
                  values="1 0 0 0 0
                          0 0 0 0 0
                          0 0 0 0 0
                          0 0 0 1 0"
                  result="red"
                />
                <feDisplacementMap
                  ref={greenChannelRef}
                  in="SourceGraphic"
                  in2="map"
                  id="greenchannel"
                  result="dispGreen"
                />
                <feColorMatrix
                  in="dispGreen"
                  type="matrix"
                  values="0 0 0 0 0
                          0 1 0 0 0
                          0 0 0 0 0
                          0 0 0 1 0"
                  result="green"
                />
                <feDisplacementMap ref={blueChannelRef} in="SourceGraphic" in2="map" id="bluechannel" result="dispBlue" />
                <feColorMatrix
                  in="dispBlue"
                  type="matrix"
                  values="0 0 0 0 0
                          0 0 0 0 0
                          0 0 1 0 0
                          0 0 0 1 0"
                  result="blue"
                />
                <feBlend in="red" in2="green" mode="screen" result="rg" />
                <feBlend in="rg" in2="blue" mode="screen" result="output" />
                <feGaussianBlur ref={gaussianBlurRef} in="output" stdDeviation="0.7" />
              </>
            ) : (
              // Minimal filter when displace=0 - just passes through
              <feGaussianBlur in="SourceGraphic" stdDeviation="0" />
            )}
          </filter>
        </defs>
      </svg>

      <div className="glass-surface__content">{children}</div>
    </div>
  );
};

export default GlassSurface;

