'use client';

import React from 'react';
import type { Locale } from '@/app/[lang]/dictionaries';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  whatsappUrl?: string;
  buttonText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  lang?: Locale;
  type?: 'employer' | 'employee';
  iconOnly?: boolean;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message,
  whatsappUrl,
  buttonText,
  className = '',
  size = 'md',
  variant = 'primary',
  lang = 'en',
  type = 'employer',
  iconOnly = false
}) => {
  // Default content based on language and type
  const getDefaultContent = () => {
    if (whatsappUrl) {
      return { url: whatsappUrl, text: buttonText || 'Sign up via WhatsApp' };
    }

    // Map all languages to either Dutch or English
    const isDutch = ['nl', 'nlBE'].includes(lang);
    const languageKey = isDutch ? 'nl' : 'en';

    const content = {
      employer: {
        en: {
          url: 'https://wa.me/message/O7L3TX3O4MNGF1', //'https://wa.me/message/6GNNES3WHRBVG1',
          text: 'Sign up quickly',
          message: "Hi, I would like to quickly invite temporary workers!"
        },
        nl: {
          url: 'https://wa.me/message/O7L3TX3O4MNGF1', //'https://wa.me/message/N3H7PVGTT73MG1',
          text: 'Aanmelden via WhatsApp',
          message: "Hi, Ik wil mij graag aanmelden als opdrachtgever!"
        }
      },
      employee: {
        en: {
          url: 'https://wa.me/message/O7L3TX3O4MNGF1', //'https://wa.me/message/QLWIB7HXNSXEF1',
          text: 'Sign up via WhatsApp',
          message: "Hi! I'm interested in signing up as an employee on Junter. Can you help me get started?"
        },
        nl: {
          url: 'https://wa.me/message/O7L3TX3O4MNGF1', //'https://wa.me/message/VHOTXG3EJV6NM1',
          text: 'Snel Aanmelden',
          message: "Hi! Ik wil mij graag aanmelden als werknemer bij Junter. Kun je me helpen om te beginnen?"
        }
      }
    };

    return content[type][languageKey];
  };

  const content = getDefaultContent();

  const handleWhatsAppClick = () => {
    if (whatsappUrl || content.url) {
      window.open(whatsappUrl || content.url, '_blank');
    } else if (phoneNumber && message) {
      const encodedMessage = encodeURIComponent(message);
      const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(url, '_blank');
    }
  };

  const sizeClasses = {
    sm: 'px-4 py-4 text-sm w-12 h-12',
    md: 'px-6 py-6 text-base w-16 h-16',
    lg: iconOnly ? 'px-6 py-6 text-lg w-16 h-16' : 'px-8 py-4 text-lg'
  };


  const variantClasses = {
    primary: 'bg-green-500 hover:bg-green-600 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-green-600 border-2 border-green-500 hover:border-green-600',
    outline: 'bg-transparent hover:bg-green-50 text-green-600 border-2 border-green-500 hover:border-green-600'
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className={`inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={{ minWidth: '64px', minHeight: '64px' }}
    >
      <svg 
        className="w-7 h-7 flex-shrink-0" 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
      </svg>
      {!iconOnly && (
        <span className="ml-2">{content.text}</span>
      )}
    </button>
  );
};

export default WhatsAppButton;
