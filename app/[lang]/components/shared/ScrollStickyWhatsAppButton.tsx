'use client';

import React, { useState, useEffect, useRef } from 'react';
import WhatsAppButton from './WhatsAppButton';
import type { Locale } from '@/app/[lang]/dictionaries';

interface ScrollStickyWhatsAppButtonProps {
  type: 'employer' | 'employee';
  lang: Locale;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  stickyClassName?: string;
}

const ScrollStickyWhatsAppButton: React.FC<ScrollStickyWhatsAppButtonProps> = ({
  type,
  lang,
  size = 'lg',
  variant = 'primary',
  className = '',
  stickyClassName = ''
}) => {
  const [isSticky, setIsSticky] = useState(false);
  const [originalPosition, setOriginalPosition] = useState(0);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // If the button is scrolled out of view (above the viewport)
        if (rect.top < 0) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    // Set initial position
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setOriginalPosition(rect.top + window.pageYOffset);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Original button in header */}
      <div ref={buttonRef} className={`${isSticky ? 'invisible' : 'visible'} ${className}`}>
        <WhatsAppButton
          type={type}
          lang={lang}
          size={size}
          variant={variant}
          className="!w-auto !h-auto !px-8 !py-4"
        />
      </div>

      {/* Sticky button */}
      <div className={`fixed bottom-6 right-6 z-[9999] pointer-events-auto transition-opacity duration-300 ${isSticky ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${stickyClassName}`}>
        <WhatsAppButton
          type={type}
          lang={lang}
          size={size}
          variant={variant}
          className="!w-auto !h-auto !px-8 !py-4"
        />
      </div>
    </>
  );
};

export default ScrollStickyWhatsAppButton;
