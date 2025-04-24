"use client"

import Link from 'next/link'
import { Locale } from '@/i18n.config'
import { getDictionary } from '@/app/[lang]/dictionaries'
import LocaleSwitcher from '@/app/[lang]/components/shared/LocaleSwitcher'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Dialog, Disclosure, DisclosureButton, DisclosurePanel, Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react'
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image'; 
import logo from '@/app/assets/images/178884748_padded_logo.png'; 



  const countries = [
    { name: 'United Kingdom', description: 'English', href: '/[en]', icon: '🇬🇧' },
    { name: 'Nederland', description: 'Nederlands', href: 'https://nl.junter.eu', icon: '🇳🇱' },
    { name: 'France', description: 'Français', href: '/[fr]', icon: '🇫🇷' },
    { name: 'Italia', description: 'Italiano', href: '/[it]', icon: '🇮🇹' },
    { name: 'België', description: 'Nederlands', href: 'https://nl.junter.eu', icon: '🇧🇪' },
    { name: 'Belgique', description: 'Français', href: '/[fr]', icon: '🇧🇪' },
    { name: 'España', description: 'Español', href: '/[es]', icon: '🇪🇸' },
    { name: 'Portugal', description: 'Português', href: '/[pt]', icon: '🇵🇹' },
    { name: 'Deutschland', description: 'Deutsch', href: '/[de]', icon: '🇩🇪' },
    { name: 'Sverige', description: 'Svenska', href: '/[sw]', icon: '🇸🇪' },
    { name: 'Danmark', description: 'Dansk', href: '/[dk]', icon: '🇩🇰' },
    { name: 'Norge', description: 'Norsk', href: '/[no]', icon: '🇳🇴' },
    { name: 'Suomi', description: 'Suomeksi', href: '/[fi]', icon: '🇫🇮' },
    { name: 'الإمارات العربية المتحدة', description: 'عربي', href: '/[ar]', icon: '🇦🇪' },
  ]
  
  export default async function Example({ lang }: { lang: Locale }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { pages, navigation } = await getDictionary(lang);
  
    return (
      <header className="bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Junter</span>
              <Image className="h-32 w-auto" src={logo} alt="Junter logo" /> {/* Use Image component for optimized images */}
            </a>
          </div>
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
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
              {navigation.navLinks[3].name}
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
                    <item.icon 
                        // className="size-6 text-gray-600 group-hover:text-indigo-600" 
                        aria-hidden="true" 
                    />
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
                {pages.landingsPage.CTA.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                  >
                    <item.icon aria-hidden="true" /* className="size-5 flex-none text-gray-400"  *//>
                    {item.name}
                  </a>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
          {navigation.navLinks.map((item) => (
            <Link href={`/${lang}/item.link`} className="text-sm/6 font-semibold text-gray-900">
            {item.name}
            </Link>
            ))}
        </PopoverGroup>
          <div className="flex flex-1 items-center justify-end gap-x-6">
            <a href="../sign-in" className="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900">
              Inloggen
            </a>
            <a
              href="../sign-up"
              className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Aanmelden
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </nav>
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center gap-x-6">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Junter</span>
                <Image
                  className="h-8 w-auto"
                  src={logo}
                  alt=""
                />
              </a>
              <a
                href="../sign-up"
                className="ml-auto rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Aanmelden
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
                  {navigation.navLinks[3].name}
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-[open]:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...countries, ...pages.landingsPage.CTA].map((item) => (
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
                {navigation.navLinks.map((item) => (
            <Link href={`/${lang}/item.link`} className="text-sm/6 font-semibold text-gray-900">
            {item.name}
            </Link>
            ))}
              </div>
                <div className="py-6">
                  <a
                    href="../sign-in"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Inloggen
                  </a>
                </div>
            </div>
        </div>
          </Dialog.Panel>
        </Dialog>
        <LocaleSwitcher />
      </header>
    )
  }