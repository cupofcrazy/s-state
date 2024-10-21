import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useDrag } from '@use-gesture/react';
import styles from './scroll.module.css';

interface ScrollContainerProps {
  children: React.ReactNode;
  intersectionThreshold?: number;
  onElementInView?: (element: HTMLElement, isIntersecting: boolean) => void;
  className?: string;
  onProgressChange?: (progress: number) => void;
  speed?: number;
}

const lerp = (a: number, b: number, t: number) => {
  return a + (b - a) * t;
};

const ScrollContainer: React.FC<ScrollContainerProps> = ({ 
  children, 
  onElementInView, 
  intersectionThreshold = 0.25, 
  className, 
  onProgressChange,
  speed = 1 // Default speed is 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [targetTranslateX, setTargetTranslateX] = useState(0);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [progress, setProgress] = useState(0);

  const updateMaxTranslate = useCallback(() => {
    if (containerRef.current && contentRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const contentWidth = contentRef.current.scrollWidth;
      const newMaxTranslate = Math.min(0, containerWidth - contentWidth);
      setMaxTranslate(newMaxTranslate);

      // Adjust current position if it's out of bounds after resize
      setTranslateX(prevTranslateX => Math.max(newMaxTranslate, Math.min(0, prevTranslateX)));
      setTargetTranslateX(prevTargetTranslateX => Math.max(newMaxTranslate, Math.min(0, prevTargetTranslateX)));
    }
  }, []);

  useEffect(() => {
    updateMaxTranslate();

    const handleResize = () => {
      updateMaxTranslate();
      updateProgress(translateX / maxTranslate);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateMaxTranslate, children]);

  const updateProgress = useCallback((progress: number) => {
    setProgress(progress);
    if (onProgressChange) {
      onProgressChange(progress);
    }
  }, [onProgressChange]);

  const animateScroll = useCallback(() => {
    setTranslateX(prevTranslateX => {
      const newTranslateX = lerp(prevTranslateX, targetTranslateX, 0.1);
      if (Math.abs(newTranslateX - targetTranslateX) < 0.1) {
        return targetTranslateX;
      }
      return newTranslateX;
    });
  }, [targetTranslateX]);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      animateScroll();
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [animateScroll]);

  const bind = useDrag(
    ({ delta: [dx], event, first, last }) => {
      event.preventDefault()
      const dragFactor = 2 * speed; // Apply speed to dragFactor

      setTargetTranslateX(prevTargetTranslateX => {
        const newTargetTranslateX = prevTargetTranslateX + dx * dragFactor;
        return Math.max(maxTranslate, Math.min(0, newTargetTranslateX));
      });

      updateProgress(translateX / maxTranslate);
    },
    {
      filterTaps: true,
      rubberband: true,
      eventOptions: { passive: false },
      drag: {
        delay: 0,
        filterTaps: true,
      }
    }
  );

  useEffect(() => {
    if (containerRef.current && onElementInView) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            onElementInView(entry.target as HTMLElement, entry.isIntersecting);
          });
        },
        { root: containerRef.current, threshold: intersectionThreshold }
      );

      Array.from(contentRef.current?.children || []).forEach((child) => {
        observer.observe(child);
      });

      return () => observer.disconnect();
    }
  }, [children, onElementInView, intersectionThreshold]);

  return (
    <div
      ref={containerRef}
      className={`${styles['scroll-container']} ${className}`}
      {...bind()}
    >
      <div 
        ref={contentRef}
        className={styles['scroll-content']}
        style={{ transform: `translateX(${translateX}px)` }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollContainer;
