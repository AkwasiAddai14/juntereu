"use client"

import Link from 'next/link';
import Image from 'next/image'; 
import { useState } from 'react';
import { Dialog, Disclosure, 
  DisclosureButton, DisclosurePanel, 
  Popover, PopoverButton, PopoverGroup, 
  PopoverPanel } from '@headlessui/react';
  import { ChevronDownIcon } from '@heroicons/react/20/solid';
  import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
  import logo from '@/app/assets/images/178884748_padded_logo.png'; 
  import  delivery  from "@/app/assets/images/iStock-1824077027.jpg";
  import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys




const countries = [
  { name: 'United Kingdom', description: 'English', href: '/en', flag: 'gb' },
  { name: 'Deutschland', description: 'Deutsch', href: '/de', flag: 'de' },
  { name: 'Nederland', description: 'Nederlands', href: '/nl', flag: 'nl' },
  { name: 'België', description: 'Nederlands', href: '/nl-BE', flag: 'be' },
  { name: 'France', description: 'Français', href: '/fr', flag: 'fr' },
  { name: 'España', description: 'Español', href: '/es', flag: 'es' },
  { name: 'Portugal', description: 'Português', href: '/pt', flag: 'pt' },
  { name: 'Italia', description: 'Italiano', href: '/it', flag: 'it' },
  { name: 'Osterreich', description: 'Deutsch', href: '/at', flag: 'at' },
  { name: 'Schweiz', description: 'Deutsch', href: '/de-CH', flag: 'ch' },
  { name: 'Suomi', description: 'Suomeksi', href: '/fi', flag: 'fi' },
  { name: 'Danmark', description: 'Dansk', href: '/da', flag: 'dk' },
  { name: 'Sverige', description: 'Svenska', href: '/sv', flag: 'se' },
  { name: 'Norge', description: 'Norsk', href: '/no', flag: 'no' },
  { name: 'Suisse', description: 'Français', href: '/fr-CH', flag: 'ch' },
  { name: 'Svizzera', description: 'Italiano', href: '/it-CH', flag: 'ch' },
  { name: 'Bégique', description: 'Français', href: '/fr-BE', flag: 'be' },
]

type Props = {
  lang: Locale;
  pages: any;
  navigation: any;
  components: any;
};
  
  export default function NavBar({ lang, pages, navigation, components }: Props) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   
  
    return (
      <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8" aria-label="Global">
            <a href={`/${lang}`} className="-m-1.5 p-1.5">
              <span className="sr-only">Junter</span>
              <Image className="h-32 w-auto" src={logo} alt="Junter logo" /> {/* Use Image component for optimized images */}
            </a>
           <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div> 
          <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          {navigation.navLinks.map((item: {name: string, link: string}, index: number) => (
            <Link key={`nav-${index}-${item.name}`} href={`/${lang}/${item.link}`} className="text-sm/6 font-semibold text-gray-900">
            {item.name}
            </Link>
            ))}
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
              {navigation.Taal.name}
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <div className="p-4">
                {countries.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                  >
                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                    <img src={`https://flagcdn.com/w320/${item.flag}.png`} alt="Spain" className="w-6 h-4" />
                    {/* <Flag code={item.flag} size="L" hasDropShadow className='border-lg'/> */}
                    {/* <ReactCountryFlag countryCode={item.flag} /> */}
                    </div>
                    <div className="flex-auto">
                      <a href={item.href} className="block font-semibold text-gray-900">
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                {pages.landingsPage.CTA.map((item:{ name: string, href: string}) => (
                  <a
                    key={item.name}
                    href={`../${lang}/${item.href}`}
                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                  >
                    {/* <item.icon aria-hidden="true"  
                    // className="size-5 flex-none text-gray-400" 
                    /> */}
                    {item.name}
                  </a>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
        </PopoverGroup>
          <div className="flex flex-1 items-center justify-end gap-x-6">
            <a href={`../${lang}/sign-in`} className="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-white">
              {components.navigation.NavBar.inloggen}
            </a>
            <a
              href={`../${lang}/sign-up`}
              className="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              {components.navigation.NavBar.aanmelden}
            </a>
          </div>
          {/* <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div> */}
        </nav>
        </div>
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center gap-x-6">
              <a href="" className="-m-1.5 p-1.5">
                <span className="sr-only">Junter</span>
                <Image
                  className="h-8 w-auto"
                  src={logo}
                  alt="Junter logo"
                />
              </a>
              <a
                href={`../${lang}/sign-up`}
                className="ml-auto rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                {components.navigation.NavBar.aanmelden}
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                  {navigation.Taal.name}
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-[open]:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...countries/* , ...pages.landingsPage.CTA */].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pl-6 pr-3 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                {navigation.navLinks.map((item: {name: string, link: string}, index: number) => (
            <Link key={`mobile-nav-${index}-${item.name}`} href={`/${lang}/${item.link}`} className="-mx-3 block rounded-lg px-3 py-2 text-sm/6 font-semibold text-gray-900">
            {item.name}
            </Link>
            ))}
              </div>
                <div className="py-6">
                  <a
                    href={`../${lang}/sign-in`}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-50"
                  >
                    {navigation['Log-in'].name}
                  </a>
                </div>
            </div>
        </div>
          </Dialog.Panel>
        </Dialog>
        {/* <LocaleSwitcher /> */}
      </header>
      <div className="relative">
<div className="mx-auto max-w-7xl">
  <div className="relative z-10 pt-14 lg:w-1/2">
    <svg
      className="absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 transform fill-white lg:block"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polygon points="0,0 90,0 50,100 0,100" />
    </svg>

    <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56 lg:pr-0">
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
        <div className="hidden sm:mb-10 sm:flex">
          <div className="relative rounded-full px-4 py-2 text-sm leading-6 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          {pages.landingsPage.header.Text1}{' '}
            <a href={`../${lang}/employees`} className="whitespace-nowrap font-semibold text-sky-600">
              <span className="absolute inset-0 justify-end" aria-hidden="true" />
              {pages.landingsPage.CTA[1].name} <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        {pages.landingsPage.header.headText}
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
        {pages.landingsPage.header.subText}
        </p>
        <div className="mt-10 rounded-lg flex items-center gap-x-6">
          <a
            href={`../${lang}/sign-up`}
            className="rounded-lg bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {pages.landingsPage.CTA[0].name}
          </a>
          <a href={`../${lang}/employees`} className="text-sm font-semibold leading-6 text-gray-900">
          {pages.landingsPage.CTA[1].name} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
<div className="bg-gray-50 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
  <Image
    className="aspect-[3/2] object-cover lg:aspect-auto lg:h-full lg:w-full"
    src={delivery}
    alt="Delivery"
  />
</div>
</div>
</div>
    )
  }