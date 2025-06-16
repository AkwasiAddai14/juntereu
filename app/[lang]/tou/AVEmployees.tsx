import React from 'react';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'dk', 'no', 'lu',
  'sw', 'os', 'benl', 'befr', 'suit', 'sufr', 'sude',
];

const AVfreelancers = async ({ params }: { params: { lang: string } }) => {
      const lang = supportedLocales.includes(params.lang as Locale)
      ? (params.lang as Locale)
      : 'en';
      const { pages } = await getDictionary(lang);
  return (
   <div className="bg-white px-6 py-32 lg:px-8">
        <div className="mx-auto items-center justify-center max-w-3xl text-base leading-7 text-gray-700">
          <p className="text-base font-semibold leading-7 text-sky-600">{pages.termsofusePage.termsFreelancers.header}{/* Algemene voorwaarden */}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{pages.termsofusePage.termsFreelancers.title}{/* Voor freelancers */}</h1>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">{pages.termsofusePage.termsFreelancers.introduction.heading}{/*  Inleiding */}</h2>
           {/*  <div
            className="relative left-1/2 -z-50 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#0EA5E9] to-[#dbeafe] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{clipPath:'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}
            /> */}
          <p className="mt-6 text-xl leading-8">
          <div className="absolute inset-x-0 top-[-20rem] -z-50 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
</div>
{pages.termsofusePage.termsFreelancers.introduction.text}
{/* Welkom bij Junter. Door gebruik te maken van ons platform, gaat u akkoord met deze algemene voorwaarden. Lees deze voorwaarden zorgvuldig door voordat u van onze diensten gebruikt.
 */}          </p>
          <div className="mt-10 max-w-2xl mx-auto">
      {pages.termsofusePage.termsFreelancers.sections.map((section: { heading: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; text: string },  index: React.Key | null | undefined) => (
        <div key={index} className={index !== 0 ? 'mt-16' : ''}>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{section.heading}</h2>
          {section.text.split('\n').map((line, i) => (
            <p key={i} className="mt-2">{line}</p>
          ))}
        </div>
      ))}

      <div className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">{pages.termsofusePage.termsFreelancers.contact.heading}</h2>
        <p className="mt-2">{pages.termsofusePage.termsFreelancers.contact.text}</p>
        {pages.termsofusePage.termsFreelancers.contact.emails.map((email: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, i: React.Key | null | undefined) => (
          <a key={i} className="font-semibold text-sky-600 block mt-2" href={`mailto:${email}`}>
            {email}
          </a>
        ))}
      </div>
    </div>
        </div>
      </div>
  )
}

export default AVfreelancers