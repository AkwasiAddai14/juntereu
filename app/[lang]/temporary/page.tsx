'use client';

import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  Cog6ToothIcon,
  FingerPrintIcon,
  LockClosedIcon,
  ServerIcon,
  BoltIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
  SparklesIcon,
  BanknotesIcon,
} from '@heroicons/react/20/solid';
import { InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { use } from 'react';
import iStockLogistiek3 from '@/app/assets/images/iStock-Logistiek-3.jpg';
import { 
  FadeInUp, 
  FadeInLeft, 
  FadeInRight, 
  SimpleStaggerContainer, 
  SimpleStaggerItem,
  SimpleFadeIn
} from '../components/shared/animations/AnimationUtils';
import { getDictionary } from '../dictionaries';
import type { Locale } from '../dictionaries';

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

interface TemporaryProps {
  params: Promise<{ lang: string }>;
}

export default function Temporary({ params }: TemporaryProps) {
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

  const page = dictionary.pages?.temporaryPage || {};
  const features = page.features || [];
  const promotion = page.promotion || {};
  
  const iconMap: { [key: string]: any } = {
    LockClosedIcon,
    ServerIcon,
    CloudArrowUpIcon,
    ArrowPathIcon,
    Cog6ToothIcon,
    FingerPrintIcon,
    BoltIcon,
    ShieldCheckIcon,
    CheckBadgeIcon,
    SparklesIcon,
    BanknotesIcon,
  };

  const featuresWithIcons = features.map((feature: any) => {
    const iconName = feature.icon || 'LockClosedIcon';
    return {
      ...feature,
      icon: iconMap[iconName] || LockClosedIcon,
    };
  });
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeInUp className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-base/7 font-semibold text-sky-600">{page.badge || 'Need extra hands quickly?'}</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl sm:text-balance">
            {page.headText || 'Filling shifts? Temporary hire or freelancer — you choose.'}
          </p>
          <p className="mt-6 text-lg/8 text-gray-600">
            {page.subText || 'With Junter, you fill open shifts quickly with experienced people.'}
          </p>
        </FadeInUp>
      </div>

      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SimpleFadeIn delay={0.2}>
            <div className="relative isolate overflow-hidden rounded-xl shadow-2xl ring-1 ring-gray-900/10">
              <div
                aria-hidden="true"
                className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-30deg] bg-sky-100 opacity-20 ring-1 ring-inset ring-white"
              />
              <Image
                alt={page.imageAlt || 'Warehouse worker operating pallet jack - Temporary staffing service'}
                src={iStockLogistiek3}
                width={2432}
                height={1442}
                className="mb-[-12%] w-full rounded-xl object-cover"
                priority
              />
            </div>
          </SimpleFadeIn>
          <div aria-hidden="true" className="relative">
            <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <SimpleStaggerContainer className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base/7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {featuresWithIcons.map((feature: any, index: number) => (
            <SimpleStaggerItem key={feature.name || index} delay={index * 0.1}>
              <div className="relative pl-9">
                <dt className="inline font-semibold text-gray-900">
                  <feature.icon aria-hidden="true" className="absolute left-1 top-1 size-5 text-sky-600" />
                  {feature.name || ''}
                </dt>{' '}
                <dd className="inline">{feature.description || ''}</dd>
              </div>
            </SimpleStaggerItem>
          ))}
        </SimpleStaggerContainer>
      </div>
      <SimpleFadeIn>
        <section className="relative isolate overflow-hidden bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInUp className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-sky-600">{promotion.badge || 'Action until December 31, 2025'}</p>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                {promotion.headText || '€0.50 discount per hour worked'}
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                {promotion.subText || 'Fill your shifts faster and more affordably.'}
              </p>

              <div className="mt-8 flex items-center justify-center gap-4">
                <a
                  href="#activeer-korting"
                  className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-colors"
                >
                  {promotion.activateButton || 'Activate discount'}
                </a>
                <a
                  href="#voorwaarden"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  <InformationCircleIcon className="h-5 w-5" aria-hidden="true" />
                  {promotion.viewConditionsButton || 'View conditions'}
                </a>
              </div>
            </FadeInUp>

            {/* Voorwaarden */}
            <FadeInUp delay={0.2} className="mx-auto mt-12 max-w-3xl">
              <div id="voorwaarden">
                <p className="text-sm font-semibold text-slate-900">{promotion.conditionsTitle || 'The discount applies when one of the following conditions is met:'}</p>
                <SimpleStaggerContainer>
                  <ul className="mt-4 space-y-3">
                    {(promotion.conditions || []).map((condition: any, index: number) => (
                      <SimpleStaggerItem key={index}>
                        <li className="flex gap-3">
                          <CheckCircleIcon className="mt-0.5 h-5 w-5 flex-none text-sky-600" aria-hidden="true" />
                          <span className="text-slate-700">
                            <span className="font-medium">{condition.text || ''}</span> {condition.detail || ''}
                          </span>
                        </li>
                      </SimpleStaggerItem>
                    ))}
                  </ul>
                </SimpleStaggerContainer>

                <p className="mt-6 text-xs text-slate-500">
                  {promotion.disclaimer || '* Discount applies to hours worked until 12-31-2025.'}
                </p>
              </div>
            </FadeInUp>
          </div>
        </section>
      </SimpleFadeIn>
    </div>
  )
}

