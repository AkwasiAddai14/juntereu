'use client'

import { useState } from 'react';
import Image from "next/image";
import { Dialog, DialogPanel } from '@headlessui/react';
import { motion } from 'framer-motion'; // Zorg dat je: npm install framer-motion
import PartnerModal from './PartnerModal' // Pas pad aan indien nodig
import {
  Bars3Icon,
  XMarkIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import {
  CurrencyEuroIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  BoltIcon,
  GlobeEuropeAfricaIcon,
  TrophyIcon,
} from '@heroicons/react/20/solid';
import logo from '@/app/assets/images/178884748_padded_logo.png'; 

// --- DATA CONFIGURATIE ---

const navigation = [
  { name: 'Hoe het werkt', href: '#how-it-works' },
  { name: 'Verdienmodel', href: '#earnings' },
  { name: 'Academy', href: '#academy' },
  { name: 'Support', href: '#team' },
]

const stats = [
  { label: 'Gemiddelde commissie', value: '€450+' },
  { label: 'Uitbetaald aan partners', value: '€120k+' },
  { label: 'Tevredenheidsscore', value: '4.9/5' },
  { label: 'Actieve bedrijven', value: '250+' },
]

const values = [
  {
    name: 'Ongelimiteerd Potentieel.',
    description: 'Je start in je eigen netwerk, maar de markt is oneindig. Wij leren je hoe je opschaalt buiten je bekende kringen.',
    icon: GlobeEuropeAfricaIcon,
  },
  {
    name: 'Geen Administratie.',
    description: 'Jij doet de introductie, Junter doet de contracten, facturatie en onboarding. Jij focust 100% op scoren.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Directe Uitbetaling.',
    description: 'Transparantie staat voorop. Via jouw persoonlijke dashboard zie je je deals en wordt je commissie snel overgemaakt.',
    icon: CurrencyEuroIcon,
  },
  {
    name: 'Gratis Sales Training.',
    description: 'Nog nooit koud gebeld? Geen probleem. Wij bieden scripts, templates en coaching om je op weg te helpen.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Schaalbaar Inkomen.',
    description: 'Begin als side-hustle naast je studie of baan, en bouw het uit tot een volwaardige onderneming.',
    icon: ChartBarIcon,
  },
  {
    name: 'Snel Starten.',
    description: 'Geen lange sollicitatieprocedures. Schrijf je in en je kunt vandaag nog je eerste lead aanmelden.',
    icon: BoltIcon,
  },
]

const team = [
  {
    name: 'Sander de Vries',
    role: 'Partner Manager',
    imageUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Support & Onboarding',
  },
  {
    name: 'Lisa van den Berg',
    role: 'Sales Coach',
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Sales Trainingen',
  },
  {
    name: 'Mark Janssen',
    role: 'Growth Specialist',
    imageUrl:'/assets/images/mark.jpg',
      // 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Lead Generation',
  },
  {
    name: 'Sarah El Amrani',
    role: 'Community Lead',
    imageUrl:'/assets/images/sarah.jpg',
      // 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    location: 'Events & Network',
  },
]

const benefits = [
  'Hoge commissies per deal (Recurring mogelijk)',
  'Volledige vrijheid: Werk waar en wanneer je wilt',
  'Toegang tot exclusieve Junter Netwerkborrels',
  'Persoonlijke Sales Coach & Scripts',
  'Starten zonder startkapitaal',
  'Bouw aan je CV en zakelijk netwerk',
]

// --- ANIMATIE COMPONENTS ---

function FloatingIcons() {
  // Iconen die subtiel op de achtergrond bewegen
  const icons = [
    { Icon: TrophyIcon, x: '10%', y: '20%', delay: 0 },
    { Icon: CurrencyEuroIcon, x: '85%', y: '15%', delay: 2 },
    { Icon: RocketLaunchIcon, x: '80%', y: '60%', delay: 1 },
    { Icon: UserGroupIcon, x: '15%', y: '70%', delay: 3 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {icons.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-sky-300 opacity-20"
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [0, -20, 0], // Zweef effect
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          <item.Icon className="h-16 w-16 sm:h-24 sm:w-24" />
        </motion.div>
      ))}
    </div>
  )
}

function FadeInSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

// --- MAIN COMPONENT ---

export default function ABA_LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  return (
    <div className="bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Junter ABA</span>
              {/* Pas hier de src aan naar het Junter Logo */}
              <Image
                alt="Junter Logo"
                src={logo}
                className="h-32 w-auto"
              />
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
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="https://junter.nl" target="_blank" rel="noopener noreferrer" className="hidden lg:block rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-colors">
                Inloggen {/* Portal   <span aria-hidden="true">&rarr;</span> */}
            </a>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Junter</span>
                <Image
                  alt="Junter Logo"
                  src={logo}
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="https://junter.nl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Inloggen
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <main className="relative isolate overflow-hidden">
        {/* Animated Background Icons */}
        <FloatingIcons />

        {/* Background Gradients */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-4 -z-20 flex transform-gpu justify-center overflow-hidden blur-3xl"
        >
          <div
            style={{
              clipPath:
                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
            }}
            className="aspect-1108/632 w-[69.25rem] flex-none bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25"
          />
        </div>

        {/* Hero Section */}
        <div className="px-6 pt-14 lg:px-8">
          <div className="mx-auto max-w-2xl pt-24 text-center sm:pt-40">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
                Verzilver je netwerk <br />
                <span className="text-sky-600">Bouw je toekomst</span>
              </h1>
              <p className="mt-8 text-lg font-medium text-gray-600 sm:text-xl/8">
                Word onderdeel van het <strong>Junter ABA programma</strong>. Help bedrijven met personeel of software en verdien structurele commissies. 
                Jij bent de ondernemer, wij leveren de tools.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="#"
                  className="rounded-md bg-sky-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 transition-all hover:scale-105"
                  onClick={() => setIsModalOpen(true)}
                >
                  Start als Partner
                </a>
                <a href="#how-it-works" className="text-sm font-semibold leading-6 text-gray-900">
                  Bekijk de mogelijkheden {/* <span aria-hidden="true">→</span> */}
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stat Section (Social Proof) */}
        <FadeInSection>
          <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-8">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="mx-auto flex max-w-xs flex-col gap-y-4">
                  <dt className="text-base/7 text-gray-600">{stat.label}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </FadeInSection>

        {/* Image Section (Modern Entrepreneur Vibe) */}
        <FadeInSection>
          <div className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
            <img
              alt="Jonge ondernemers werken samen in een moderne omgeving"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2894&q=80"
              className="aspect-9/4 w-full object-cover rounded-3xl shadow-2xl"
            />
          </div>
        </FadeInSection>

        {/* Values / "Why ABA?" Section */}
        <div id="how-it-works" className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Waarom Partner worden?</h2>
            <p className="mt-6 text-lg/8 text-gray-600">
              ABA is niet zomaar een referral programma. Het is jouw opstap naar zelfstandig ondernemerschap, gesteund door de kracht van Junter.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base/7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-16">
            {values.map((value) => (
              <FadeInSection key={value.name}>
                <div className="relative pl-9 group hover:bg-gray-50 p-4 rounded-lg transition-colors">
                  <dt className="inline font-semibold text-gray-900">
                    <value.icon aria-hidden="true" className="absolute top-5 left-1 size-5 text-sky-600 group-hover:text-sky-500" />
                    {value.name}
                  </dt>{' '}
                  <dd className="inline">{value.description}</dd>
                </div>
              </FadeInSection>
            ))}
          </dl>
        </div>

        {/* THE HUNTER SECTION (Active Motivation) */}
        <div className="mt-32 sm:mt-40 bg-gray-900 py-24 sm:py-32 relative overflow-hidden isolate">
           {/* Dark background generic visual */}
           <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
           <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gray-900 shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
           
          <FadeInSection>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Jagen buiten je roedel</h2>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  De meeste partners beginnen met vrienden en familie. Dat is prima. Maar de echte groeiers gaan verder.
                  Wij leren je hoe je via LinkedIn en slimme acquisitie bedrijven vindt die zitten te springen om personeel.
                  Durf jij de stap te zetten?
                </p>
              </div>
              <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
                  <a href="#" className="hover:text-sky-400 transition-colors">Bekijk Sales Scripts <span aria-hidden="true">&rarr;</span></a>
                  <a href="#" className="hover:text-sky-400 transition-colors">LinkedIn Training <span aria-hidden="true">&rarr;</span></a>
                  <a href="#" className="hover:text-sky-400 transition-colors">Lead-Gen Tools <span aria-hidden="true">&rarr;</span></a>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>

        {/* Team Section (Support) */}
        <div id="team" className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Jouw Support Team</h2>
            <p className="mt-6 text-lg/8 text-gray-600">
              Je staat er niet alleen voor. Ons team van experts helpt je bij elke stap: van je eerste pitch tot het sluiten van de deal.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4"
          >
            {team.map((person) => (
              <FadeInSection key={person.name}>
                <li>
                  <img
                    alt={person.name}
                    src={person.imageUrl}
                    className="aspect-square w-full rounded-2xl object-cover shadow-lg"
                  />
                  <h3 className="mt-6 text-lg/8 font-semibold tracking-tight text-gray-900">{person.name}</h3>
                  <p className="text-base/7 text-sky-600 font-medium">{person.role}</p>
                  <p className="text-sm/6 text-gray-500">{person.location}</p>
                </li>
              </FadeInSection>
            ))}
          </ul>
        </div>

        {/* CTA Section */}
        <div className="relative isolate mt-32 sm:mt-40 mb-20">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-2xl flex-col gap-16 bg-white/75 px-6 py-16 shadow-2xl ring-1 ring-gray-900/5 sm:rounded-3xl sm:p-8 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center lg:py-20 xl:gap-x-20 xl:px-20">
              <img
                alt="Business Succes"
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80"
                className="h-96 w-full flex-none rounded-2xl object-cover lg:aspect-square lg:h-auto lg:max-w-sm shadow-xl"
              />
              <div className="w-full flex-auto">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Klaar om te starten?
                </h2>
                <p className="mt-6 text-lg/8 text-gray-600">
                  Sluit je aan bij de snelst groeiende community van zakelijke bemiddelaars. Geen inschrijfkosten, direct aan de slag.
                </p>
                <ul
                  role="list"
                  className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 text-base/7 text-gray-900 sm:grid-cols-2"
                >
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-x-3">
                      <CheckCircleIcon aria-hidden="true" className="h-7 w-5 flex-none text-sky-600" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex">
                  <a 
                  href="#" 
                  className="font-semibold text-sky-600 hover:text-sky-400 text-lg"
                  onClick={() => setIsModalOpen(true)}
                  > 
                    Meld je aan als Partner <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mx-auto max-w-7xl px-6 pb-8 lg:px-8">
          <div className="border-t border-gray-900/10 pt-8">
            <p className="text-sm/6 text-gray-600">&copy; 2026 Junter Platform. All rights reserved.</p>
          </div>
        </footer>
      </main>
      <PartnerModal open={isModalOpen} setOpen={setIsModalOpen} />
    </div>
  )
}