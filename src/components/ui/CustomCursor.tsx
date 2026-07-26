'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const cursorPos = useRef({ x: -100, y: -100 });
  const outerPos = useRef({ x: -100, y: -100 });
  const requestRef = useRef<number>(0);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const onMouseMove = (e: MouseEvent) => {
      cursorPos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseDown = () => setIsActive(true);
    const onMouseUp = () => setIsActive(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isTouchDevice]);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-magnetic]')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isTouchDevice]);

  // RAF loop for position updates — avoids duplicate animate prop
  useEffect(() => {
    if (isTouchDevice) return;

    const updateCursor = () => {
      outerPos.current.x += (cursorPos.current.x - outerPos.current.x) * 0.15;
      outerPos.current.y += (cursorPos.current.y - outerPos.current.y) * 0.15;

      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outerPos.current.x - 20}px, ${outerPos.current.y - 20}px)`;
      }

      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${cursorPos.current.x - 4}px, ${cursorPos.current.y - 4}px)`;
      }

      requestRef.current = requestAnimationFrame(updateCursor);
    };

    requestRef.current = requestAnimationFrame(updateCursor);

    return () => cancelAnimationFrame(requestRef.current);
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  const outerScale = isActive ? 0.9 : isHovered ? 1.5 : 1;
  const outerShadow = isActive
    ? '0 0 10px rgba(212,175,55,0.2)'
    : isHovered
    ? '0 0 20px rgba(212,175,55,0.4)'
    : '0 0 0 rgba(212,175,55,0)';
  const innerScale = isActive ? 0.4 : isHovered ? 0.5 : 1;

  return (
    <>
      {/* Outer Ring */}
      <div
        ref={outerRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '40px',
          height: '40px',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
      >
        <motion.div
          animate={{
            scale: outerScale,
            boxShadow: outerShadow,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '1px solid #D4AF37',
            backgroundColor: 'rgba(212, 175, 55, 0.05)',
          }}
        />
      </div>

      {/* Inner Dot */}
      <div
        ref={innerRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
      >
        <motion.div
          animate={{ scale: innerScale }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: '#D4AF37',
          }}
        />
      </div>
    </>
  );
}
