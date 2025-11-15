
import React, { ComponentType,  } from 'react'
import Link from 'next/link'
import { getDictionary } from '@/app/[lang]/dictionaries'
import { CurrencyEuroIcon, UserGroupIcon, UsersIcon } from '@heroicons/react/24/outline'
import dashboardLogo from '@/app/assets/images/A sleek modern dashboard displayed on a computer screen in a compact office space.jpg'
import officeLogo from '@/app/assets/images/A smaller office with people working very fast.jpg'
import euroBillsLogo from '@/app/assets/images/Euro bills flying around in the air.jpg'
import Xedular from '@/app/assets/images/Screenshot 2025-09-23 at 23.19.27.png'
import Xedular2 from '@/app/assets/images/Screenshot 2025-09-23 at 23.39.29.png'
import Image, {StaticImageData} from 'next/image'
import { SparklesIcon, BanknotesIcon, MagnifyingGlassCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { ArrowPathIcon, CalendarDateRangeIcon, CloudArrowUpIcon, Cog6ToothIcon, FingerPrintIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid';
import { CheckIcon } from '@heroicons/react/20/solid';

import { Check, Bell, Clock3, Cpu, PlugZap, MessageSquare, CreditCardIcon, UserPlusIcon } from "lucide-react"; // voorbeeldicons
import WhatsAppButton from '../components/shared/WhatsAppButton';
import ScrollStickyWhatsAppButton from '../components/shared/ScrollStickyWhatsAppButton';
import { 
  FadeInUp, 
  FadeInLeft, 
  FadeInRight, 
  SimpleStaggerContainer, 
  SimpleStaggerItem, 
  SimpleFadeIn 
} from '../components/shared/animations/AnimationUtils';
import PricingCardWithModal from '../components/shared/PricingCardWithModal';

type Bullet = { title: string; desc: string; icon?: IconName; } // optional if some items have no icon 
type IconName = 'Cpu' | 'Clock3' | 'MessageSquare' | 'PlugZap' | 'CalendarDateRangeIcon' | 'UserPlusIcon' | 'UserGroupIcon' | 'CreditCardIcon' | 'CheckIcon' | 'LockClosedIcon'; // voeg meer icon namen toe indien nodig};
type Card = { title: string; desc: string };




const features = [
  {
    name: 'Push to deploy.',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'SSL certificates.',
    description: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
    icon: LockClosedIcon,
  },
  {
    name: 'Database backups.',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: ServerIcon,
  },
]

const includedFeatures = [
  'Private forum access',
  'Member resources',
  'Entry to annual conference',
  'Official member t-shirt',
]

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];








const page = async ({ params }: { params: { lang: string }}) => {
  const lang = supportedLocales.includes(params.lang as Locale) ? (params.lang as Locale) : 'en';
  const { pages } = await getDictionary(lang);

  type Freq = "monthly" | "annually";

const monthlyLabel  = pages.employersPage.Xedular.pricing.plans.Monthly.Maandelijks;
const yearlyLabel   = pages.employersPage.Xedular.pricing.plans.Yearly.Jaarlijks;
const monthlyPrice  = pages.employersPage.Xedular.pricing.plans.Monthly.Prijs;
const yearlyPrice   = pages.employersPage.Xedular.pricing.plans.Yearly.Prijs;

const [frequency, setFrequency] = ("monthly");
const isMonthly = frequency === "monthly";
const currentPrice = isMonthly ? monthlyPrice : yearlyPrice;


  const imageMapping: { [key: string]: StaticImageData } = {
    euroBillsLogo,
    officeLogo,
    dashboardLogo,
  };

  const iconMapping: { [key: string]: ComponentType<any> } = {
    PlusCircleIcon: PlusCircleIcon,
    SparklesIcon: SparklesIcon,
    MagnifyingGlassCircleIcon: MagnifyingGlassCircleIcon,
    BanknotesIcon: BanknotesIcon,
    UsersIcon: UsersIcon,
    UserGroupIcon: UserGroupIcon,
    CurrencyEuroIcon: CurrencyEuroIcon,
  };

const icon2Mapping: Record<IconName, React.ComponentType<any>> = {
  Cpu,
  Clock3,
  MessageSquare,
  PlugZap,
  CalendarDateRangeIcon,
  UserPlusIcon,
  UserGroupIcon,
  CreditCardIcon,
  CheckIcon,
  LockClosedIcon
};




  return (
    <>
    <div className="bg-white">
          <div className="mx-auto max-w-7xl py-4 sm:px-2 sm:py-32 lg:px-4">
              <div className="mx-auto max-w-2xl px-4 lg:max-w-none">
                  <FadeInUp className="border-b border-gray-200 pb-10 sm:mt-16 sm:pt-16 ">
                      <h2 className="font-semibold text-gray-500">{pages.employersPage.title}</h2>
                      <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{pages.employersPage.headText}</p>
                      <p className="mt-4 text-gray-500">
                          {pages.employersPage.subText}
                      </p>
                      <div className="mt-8 flex justify-center">
                        <ScrollStickyWhatsAppButton
                          type="employer"
                          lang={lang}
                          size="lg"
                          variant="primary"
                        />
                      </div>
                  </FadeInUp>
                  <SimpleStaggerContainer className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {pages.employersPage.EmployTypes.map((feature) => {
  const IconComponent = iconMapping[feature.icon];
  
  // Map feature types to routes - using explicit matching for reliability
  const getRoute = (type: string): string => {
    const typeLower = type.toLowerCase().trim();
    
    // Explicit matching for each feature type
    if (typeLower.includes('freelancer')) {
      return `/${lang}/temporary`;
    }
    if (typeLower.includes('temporary') || typeLower.includes('secondment') || typeLower.includes("uitzenden") || typeLower.includes("tijdelijk")) {
      return `/${lang}/temporary`;
    }
    if (typeLower.includes('recruitment') || typeLower.includes('selection') || typeLower.includes("werving") || typeLower.includes("selectie")) {
      return `/${lang}/recruitment`;
    }
    if (typeLower.includes('payroll')) {
      return `/${lang}/payrolling`;
    }
    // Fallback
    return '#';
  };

  const route = getRoute(feature.type);
  
  return (
    <SimpleStaggerItem key={feature.type}>
      <Link href={route} className="group relative block pl-16 rounded-lg p-4 transition-all duration-300 hover:scale-105 hover:bg-orange-50 hover:shadow-lg">
        <dt className="text-base font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
          <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600 group-hover:bg-orange-600 transition-colors duration-300">
            {IconComponent ? (
              <IconComponent className="h-6 w-6 text-white" aria-hidden="true" />
            ) : (
              <span className="h-6 w-6 text-white">?</span>
            )}
          </div>
          {feature.type}
        </dt>
        <dd className="mt-2 text-base text-gray-600 group-hover:text-gray-700 transition-colors">{feature.explanation}</dd>
      </Link>
    </SimpleStaggerItem>
  );
})}
          </dl>
        </SimpleStaggerContainer>
                  <SimpleStaggerContainer className="mt-10 space-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16">
                  {pages.employersPage.Benefits.map((feature, index) => {
  const imageSrc = imageMapping[feature.imageSrc]; // Haal de juiste afbeelding op
  return (
    <SimpleStaggerItem key={feature.benefit} className="flex flex-col-reverse lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8">
      <FadeInLeft className="mt-6 lg:col-span-5 lg:mt-0 xl:col-span-4">
        <h3 className="text-lg font-medium text-gray-900">{feature.benefit}</h3>
        <p className="mt-2 text-sm text-gray-500">{feature.explanation}</p>
      </FadeInLeft>
      <FadeInRight className="flex-auto lg:col-span-7 xl:col-span-8">
        <div className="aspect-h-2 aspect-w-5 overflow-hidden rounded-lg bg-gray-100">
          {imageSrc && <Image src={imageSrc} alt={feature.imageAlt} className="object-cover object-center" />}
        </div>
      </FadeInRight>
    </SimpleStaggerItem>
  );
})}
                  </SimpleStaggerContainer>
              </div>
          </div>
      </div>
      <div className="bg-white py-24 sm:py-32">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <FadeInUp className="mx-auto max-w-2xl lg:mx-0">
                      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                          {pages.employersPage.Features.headText}
                      </h2>
                      <p className="mt-6 text-lg leading-8 text-gray-600">
                          {pages.employersPage.Features.subText}
                      </p>
                  </FadeInUp>
                  <SimpleStaggerContainer className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                      <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                      {pages.employersPage.Features.features.map((feature) => {
                  const IconComponent = iconMapping[feature.icon]; // Haal de juiste icon-component op
  
  return (
    <SimpleStaggerItem key={feature.feature} className="flex flex-col">
      <dt className="text-base font-semibold leading-7 text-gray-900">
        <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600">
        {IconComponent ? (
            <IconComponent className="h-6 w-6 text-white" aria-hidden="true" />
          ) : (
            <span className="h-6 w-6 text-white">?</span> // Fallback icon or placeholder
          )}
        </div>
        {feature.feature}
      </dt>
      <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
        <p className="flex-auto">{feature.explanation}</p>
      </dd>
    </SimpleStaggerItem>
  );
})}

                      </dl>
                  </SimpleStaggerContainer>
              </div>
          </div> 

 <div className="bg-white py-24 sm:py-32">
  <div className="mx-auto max-w-7xl px-6 lg:px-8">
    {/* make both columns equal height on lg+ */}
    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-stretch">

      {/* LEFT: two screenshots stacked */}
      <FadeInLeft className="self-stretch">
        {/* two crop boxes that share the column height */}
        <div className="h-full flex flex-col gap-6">
          <div className="flex-1 overflow-hidden rounded-xl shadow-xl ring-1 ring-gray-400/10">
            <img
              alt="Product screenshot 1"
              src={Xedular2.src}
              className="h-full w-full object-cover object-left-top"
            />
          </div>
          <div className="flex-1 overflow-hidden rounded-xl shadow-xl ring-1 ring-gray-400/10">
            <img
              alt="Product screenshot 2"
              src={Xedular.src /* or a different crop */}
              className="h-full w-full object-cover object-left-bottom"
            />
          </div>
        </div>
      </FadeInLeft>
         
          <FadeInRight className="lg:pt-4 lg:pl-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-sky-600">{pages.employersPage.Xedular.hrmSection.eyebrow}</h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                Junter x Xedular
              </p>
               <h2 className="mt-6 text-base/7 font-semibold text-orange-600">{pages.employersPage.Xedular.hrmSection.title}</h2>
              <p className="mt-6 text-lg/8 text-gray-600">
                {pages.employersPage.Xedular.hrmSection.subtitle}
              </p>
            <SimpleStaggerContainer className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
  {pages.employersPage.Xedular.hrmSection.bullets.map((feature) => {
    const IconComponent =
      feature.icon ? icon2Mapping[feature.icon as IconName] : undefined;

    return (
      <SimpleStaggerItem key={feature.title} className="relative pl-9">
        <dt className="inline font-semibold text-gray-900">
          {IconComponent ? (
            <IconComponent
              aria-hidden="true"
              className="absolute top-1 left-1 size-5 text-sky-600"
            />
          ) : (
            <span
              aria-hidden="true"
              className="absolute top-1 left-1 inline-block h-5 w-5 rounded bg-sky-600/20"
            />
          )}
          {feature.title}
        </dt>{" "}
        <dd className="inline">{feature.desc}</dd>
      </SimpleStaggerItem>
    );
  })}
</SimpleStaggerContainer>
            </div>
          </FadeInRight>
        </div>
      </div>
    </div>
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeInUp className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
            {pages.employersPage.Xedular.allInOne.title}
          </h2>
          <p className="mt-6 text-lg/8 text-gray-700">
            {pages.employersPage.Xedular.allInOne.intro}
          </p>
        </FadeInUp>
        <SimpleStaggerContainer className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base/7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {pages.employersPage.Xedular.allInOne.cards.map((feature) => (
            <SimpleStaggerItem key={feature.title}>
              <dt className="font-semibold text-gray-900">{feature.title}</dt>
              <dd className="mt-1 text-gray-600">{feature.desc}</dd>
            </SimpleStaggerItem>
          ))}
        </SimpleStaggerContainer>
      </div>
    </div>

     <form className="group/tiers bg-white py-24 sm:py-32">
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeInUp className="mx-auto max-w-4xl sm:text-center">
          <h2 className="text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-6xl sm:text-balance">
            Simple no-tricks pricing
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
           {pages.employersPage.Xedular.storeSnippet.oneLiner}
          </p>
        </FadeInUp>
        <div className="mt-16 flex justify-center">
    <fieldset aria-label="Payment frequency">
      <div className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs/5 font-semibold ring-1 ring-gray-200">
        {/* Monthly */}
        <label className="relative rounded-full">
          <input
            type="radio"
            name="frequency"
            value="monthly"
            defaultChecked
            className="peer sr-only"
          />
          <span className="block rounded-full px-2.5 py-1 text-gray-500 transition peer-checked:bg-sky-600 peer-checked:text-white">
            {pages.employersPage.Xedular.pricing.plans.Monthly.Maandelijks}
          </span>
        </label>

        {/* Yearly */}
        <label className="relative rounded-full">
          <input
            type="radio"
            name="frequency"
            value="annually"
            className="peer sr-only"
          />
          <span className="block rounded-full px-2.5 py-1 text-gray-500 transition peer-checked:bg-sky-600 peer-checked:text-white">
            {pages.employersPage.Xedular.pricing.plans.Yearly.Jaarlijks}
          </span>
        </label>
      </div>
    </fieldset>
  </div>
        <SimpleFadeIn className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <FadeInLeft className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-3xl font-semibold tracking-tight text-gray-900">{pages.employersPage.Xedular.pricing.plans.headText}</h3>
            <p className="mt-6 text-base/7 text-gray-600">
              {pages.employersPage.Xedular.pricing.plans.subText}
            </p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm/6 font-semibold text-sky-600">What's included</h4>
              <div className="h-px flex-auto bg-gray-100" />
            </div>
            <SimpleStaggerContainer className="mt-8 grid grid-cols-1 gap-4 text-sm/6 text-gray-600 sm:grid-cols-2 sm:gap-6">
              {pages.employersPage.Xedular.pricing.plans.enterprise.features.map((feature) => (
                <SimpleStaggerItem key={feature} className="flex gap-x-3">
                  <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-sky-600" />
                  {feature}
                </SimpleStaggerItem>
              ))}
            </SimpleStaggerContainer>
          </FadeInLeft>
          <FadeInRight className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:shrink-0">
            <PricingCardWithModal
              monthlyLabel={pages.employersPage.Xedular.pricing.plans.Monthly.Maandelijks}
              yearlyLabel={pages.employersPage.Xedular.pricing.plans.Yearly.Jaarlijks}
              monthlyPrice={pages.employersPage.Xedular.pricing.plans.Monthly.Prijs}
              yearlyPrice={pages.employersPage.Xedular.pricing.plans.Yearly.Prijs}
              usp={pages.employersPage.Xedular.pricing.usp}
              invoiceText="Invoices and receipts available for easy company reimbursement"
            />
          </FadeInRight>
        </SimpleFadeIn>
      </div>
    </div>
    </form>


          </>
  )
}

export default page

const Oplossingen = [
  {
    name: 'Uitzenden of Detacheren',
    description:
    'Vind snel en flexibel de juiste professionals voor tijdelijke of langdurige opdrachten, zonder administratieve rompslomp.',
    icon: PlusCircleIcon,
  },
  {
    name: 'Freelancers',
    description:
    'Ervaren freelancers die klaarstaan om uw projecten naar een hoger niveau te tillen. Flexibel, specialistisch en inzetbaar wanneer u dat nodig heeft.',
    icon: SparklesIcon,
  },
  {
    name: 'Werving en Selectie',
    description:
    'Bespaar tijd en laat ons de perfecte kandidaat vinden voor uw organisatie. Met ons uitgebreide netwerk en expertise brengen we talent en uw bedrijf samen.',
    icon: MagnifyingGlassCircleIcon,
  },
  {
    name: 'Payrolling',
    description:
    'Concentreer u op uw zaak terwijl wij de werkgeverschap overnemen. Met payrolling haalt u eenvoudig personeel in huis.',
    icon: BanknotesIcon,
  },
]

const features2 = [
  {
    name: 'Reserves',
    description:
    'Bij klussen kunnen meer mensen worden aangenomen dan beschikbare plekken, waarbij extra personen als reserve worden opgenomen. Als een aangenomen persoon uitvalt, schuiven de reserves automatisch door naar beschikbare plekken.',
    href: '#',
    icon: UsersIcon,
  },
  {
    name: 'Flexpool',
    description:
    'Als u met freelancers werkt worden freelancers in de flexpool automatisch geaccepteerd voor de klussen waar zij op reageren. Dit betekent dat u freelancers waarmee u graag werkt vaker en sneller kunt oproepen.',
    href: '#',
    icon: UserGroupIcon,
  },
  {
    name: 'Competitve pricing',
    description:
      'Als een shift langere tijd onvervuld blijft, heeft u de mogelijkheid om het tarief van de shift automatisch te verhogen. Dit stelt u in staat om snel gekwalificeerde kandidaten aan te trekken en de bezetting van de shift te waarborgen.',
    href: '#',
    icon: CurrencyEuroIcon,
  },
  ]

  const bigfeatures = [
    {
      name: 'Kosten',
      description:
        'Door te kiezen voor ons platform, profiteer je van een transparant en eenvoudig kostenmodel, waarbij je alleen betaalt voor de daadwerkelijk gewerkte uren van de flexwerkers die je uitnodigt. Nodig onbeperkt flexwerkers uit vanaf €16,50 per gewerkt uur.',
      imageSrc: euroBillsLogo,
      imageAlt: 'Bills flying around.',
    },
    {
      name: 'Administratie',
      description:
        "Bij ons platform wordt vrijwel alle administratie voor je uit handen genomen, zodat jij je kunt focussen op wat echt belangrijk is. Ons team staat klaar om je te ondersteunen en ervoor te zorgen dat alles soepel verloopt, zodat je bedrijf efficiënt en probleemloos kan blijven draaien.",
      imageSrc: officeLogo,
      imageAlt: 'Save on administrstive work and leave it to us.',
    },
    {
      name: 'Dashboard',
      description:
        'Met het dashboard behoud je als bedrijf volledig overzicht over al je activiteiten. Het dashboard biedt je inzicht in geplaatste klussen, reacties op klussen, openstaande checkouts en facturen, en de status van je flexpools. Met het dashboard heb je alle essentiële informatie binnen handbereik.',
      imageSrc: dashboardLogo,
      imageAlt: 'Simple and easy, sleek and modern dashboard to have a great overview of your business.',
    },
  ]

  const features1 = [
  {
    name: 'Push to deploy',
    description:
      'Aut illo quae. Ut et harum ea animi natus. Culpa maiores et sed sint et magnam exercitationem quia. Ullam voluptas nihil vitae dicta molestiae et. Aliquid velit porro vero.',
  },
  {
    name: 'SSL certificates',
    description:
      'Mollitia delectus a omnis. Quae velit aliquid. Qui nulla maxime adipisci illo id molestiae. Cumque cum ut minus rerum architecto magnam consequatur. Quia quaerat minima.',
  },
  {
    name: 'Simple queues',
    description:
      'Aut repellendus et officiis dolor possimus. Deserunt velit quasi sunt fuga error labore quia ipsum. Commodi autem voluptatem nam. Quos voluptatem totam.',
  },
  {
    name: 'Advanced security',
    description:
      'Magnam provident veritatis odit. Vitae eligendi repellat non. Eum fugit impedit veritatis ducimus. Non qui aspernatur laudantium modi. Praesentium rerum error deserunt harum.',
  },
  {
    name: 'Powerful API',
    description:
      'Sit minus expedita quam in ullam molestiae dignissimos in harum. Tenetur dolorem iure. Non nesciunt dolorem veniam necessitatibus laboriosam voluptas perspiciatis error.',
  },
  {
    name: 'Database backups',
    description:
      'Ipsa in earum deserunt aut. Quos minus aut animi et soluta. Ipsum dicta ut quia eius. Possimus reprehenderit iste aspernatur ut est velit consequatur distinctio.',
  },
]


  // Icon mapping voor bullets/cards (optioneel, pas aan naar smaak)
  const iconByTitle: Record<string, React.ElementType> = {
    "AI-planning": Cpu,
    "Urenregistratie (kiosk & mobiel)": Clock3,
    "Communicatiekanalen": MessageSquare,
    "POS & API-koppelingen": PlugZap,
  };

  // Tailwind-kleur voor Junter
  const brand = "text-sky-600"; // = #0ea5e9