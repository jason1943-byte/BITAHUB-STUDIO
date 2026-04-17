import React, { useEffect, useRef, useState } from 'react';

interface CarouselItem {
  name: string;
  desc: string;
  downloads: string;
  size: string;
  recommendedGpu: string;
  images: string[];
}

interface Props {
  items: CarouselItem[];
  onItemClick: (item: CarouselItem) => void;
}

export const ImageCarousel: React.FC<Props> = ({ items, onItemClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const requestRef = useRef<number>();
  const isHovered = useRef(false);

  // Duplicate items for infinite scroll
  const displayItems = [...items, ...items, ...items, ...items, ...items];
  const itemWidth = 320; // Width of each card
  const gap = 40;
  const singleSetWidth = items.length * (itemWidth + gap);

  useEffect(() => {
    // Start at the second set to ensure we have items on the left
    setScrollPos(singleSetWidth);
  }, [singleSetWidth]);

  useEffect(() => {
    const animate = () => {
      if (!isHovered.current) {
        setScrollPos((prev) => {
          let next = prev + 1; // Scroll speed
          if (next >= singleSetWidth * 2) {
            next -= singleSetWidth;
          }
          return next;
        });
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [singleSetWidth]);

  return (
    <div 
      className="relative w-full overflow-hidden py-24 bg-[#0a0a0a]"
      style={{ perspective: '1200px' }}
      onMouseEnter={() => isHovered.current = true}
      onMouseLeave={() => isHovered.current = false}
      ref={containerRef}
    >
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background: 'linear-gradient(to right, #0a0a0a 0%, transparent 15%, transparent 85%, #0a0a0a 100%)'
      }} />
      
      <div className="flex items-center" style={{ transformStyle: 'preserve-3d' }}>
        <div 
          className="flex gap-10"
          style={{ 
            transform: `translateX(${-scrollPos}px)`,
            transformStyle: 'preserve-3d',
            width: `${displayItems.length * (itemWidth + gap)}px`,
            marginLeft: '50vw' // Center the active item
          }}
        >
          {displayItems.map((item, index) => {
            // Calculate distance from center for 3D effect
            // The item's center relative to the container's left edge
            const itemCenter = (index * (itemWidth + gap)) + (itemWidth / 2);
            // The distance from the center of the screen
            // Since the container is offset by 50vw, scrollPos = itemCenter means the item is exactly at the center
            const distanceFromCenter = itemCenter - scrollPos;
            
            // Normalize distance
            const normalizedDistance = Math.max(-1, Math.min(1, distanceFromCenter / 600));
            
            const rotateY = normalizedDistance * -45; // Max 45 deg rotation
            const translateZ = Math.abs(normalizedDistance) * -200; // Push back side items
            const opacity = 1 - Math.abs(normalizedDistance) * 0.5;
            const zIndex = 50 - Math.floor(Math.abs(normalizedDistance) * 10);

            return (
              <div
                key={index}
                className="shrink-0 relative group"
                style={{
                  width: itemWidth,
                  transform: `perspective(1200px) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
                  opacity: opacity,
                  zIndex: zIndex,
                  transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
                }}
              >
                <div 
                  onClick={() => onItemClick(item)}
                  className="relative w-full h-full cursor-pointer transition-transform duration-300 group-hover:scale-110"
                >
                  <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden group-hover:border-white/30 transition-colors h-[420px] flex flex-col relative z-0 shadow-2xl">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={item.images[0]} 
                        alt={item.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-gray-500 text-xs">镜像名称</span>
                        <span className="text-gray-300 text-sm font-mono text-right max-w-[180px] truncate" title={item.name}>{item.name}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-500 text-xs">镜像大小</span>
                        <span className="text-gray-300 text-sm font-mono">{item.size}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-500 text-xs">下载数量</span>
                        <span className="text-gray-300 text-sm font-mono">{item.downloads}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-gray-500 text-xs">推荐配置</span>
                        <span className="text-gray-300 text-sm font-mono">{item.recommendedGpu}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Overlay for Description */}
                  <div className="absolute inset-0 bg-black/90 p-6 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm rounded-lg z-10 border border-amber-500/50 pointer-events-none group-hover:pointer-events-auto">
                    <h3 className="text-white font-medium mb-4">{item.name}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8">{item.desc}</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemClick(item);
                      }}
                      className="px-6 py-2 bg-amber-500 text-black text-sm font-medium rounded hover:bg-amber-400 transition-colors"
                    >
                      立即部署
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
