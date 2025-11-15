'use client';

import { 
  CloudArrowUpIcon, 
  LockClosedIcon, 
  ServerIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  FingerPrintIcon,
  ShieldCheckIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon
} from '@heroicons/react/20/solid';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { use } from 'react';
import PayrollCalculator from './PayrollCalculator';
import iStockHoreca3 from '@/app/assets/images/iStock-Horeca-3.jpg';
import { 
  FadeInUp, 
  FadeInLeft, 
  FadeInRight, 
  SimpleStaggerContainer, 
  SimpleStaggerItem 
} from '../components/shared/animations/AnimationUtils';
import { getDictionary } from '../dictionaries';
import type { Locale } from '../dictionaries';

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

interface PayrollingProps {
  params: Promise<{ lang: string }>;
}

export default function Payrolling({ params }: PayrollingProps) {
  const resolvedParams = use(params);
  const lang = supportedLocales.includes(resolvedParams.lang as Locale) 
    ? (resolvedParams.lang as Locale) 
    : 'en';
  const [dictionary, setDictionary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const dict = await getDictionary(lang);
        setDictionary(dict);
      } catch (error) {
        console.error('Error loading dictionary:', error);
        // Fallback to English
        try {
          const dict = await getDictionary('en');
          setDictionary(dict);
        } catch (fallbackError) {
          console.error('Error loading fallback dictionary:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDictionary();
  }, [lang]);

  if (loading || !dictionary) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const page = dictionary.pages?.payrollingPage || {};
  const features = page.features || [];
  
  // Map icon names to components
  const iconMap: { [key: string]: any } = {
    LockClosedIcon,
    ServerIcon,
    CloudArrowUpIcon,
    ArrowPathIcon,
    Cog6ToothIcon,
    FingerPrintIcon,
    ShieldCheckIcon,
    ClipboardDocumentCheckIcon,
    DocumentTextIcon,
  };

  const featuresWithIcons = features.map((feature: any) => {
    const iconName = feature.icon || 'LockClosedIcon';
    return {
      ...feature,
      icon: iconMap[iconName] || LockClosedIcon,
    };
  });
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <FadeInLeft className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <FadeInUp delay={0.1}>
                <h2 className="text-base/7 font-semibold text-sky-600">{page.badge || 'Payrolling with Junter'}</h2>
              </FadeInUp>
              <FadeInUp delay={0.2}>
                <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                  {page.headText || 'Less hassle. More focus on your business.'}
                </p>
              </FadeInUp>
              <FadeInUp delay={0.3}>
                <p className="mt-6 text-lg/8 text-gray-700">
                  {page.subText || 'With payrolling, you outsource the complete employer administration to Junter.'}
                </p>
              </FadeInUp>
              <SimpleStaggerContainer className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {featuresWithIcons.map((feature: any, index: number) => (
                  <SimpleStaggerItem key={feature.name || index} delay={index * 0.1}>
                    <div className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        <feature.icon aria-hidden="true" className="absolute top-1 left-1 size-5 text-sky-600" />
                        {feature.name || ''}
                      </dt>{' '}
                      <dd className="inline">{feature.description || ''}</dd>
                    </div>
                  </SimpleStaggerItem>
                ))}
              </SimpleStaggerContainer>
            </div>
          </FadeInLeft>

          <FadeInRight className="flex items-center justify-center">
            <div className="relative isolate overflow-hidden rounded-xl shadow-xl ring-1 ring-gray-400/10">
              <div
                aria-hidden="true"
                className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-30deg] bg-sky-100 opacity-20 ring-1 ring-inset ring-white"
              />
              <Image
                alt={page.imageAlt || 'Restaurant server delivering food - Payrolling service'}
                src={iStockHoreca3}
                width={2432}
                height={1442}
                className="w-full max-w-none rounded-xl object-cover sm:w-[57rem] md:-ml-4 lg:-ml-0"
                priority
              />
            </div>
          </FadeInRight>
        </div>
        <PayrollCalculator dictionary={dictionary} lang={lang} />
      </div>
    </div>
  )
}
