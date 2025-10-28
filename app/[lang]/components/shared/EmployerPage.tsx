'use client'

import { CalendarDateRangeIcon, BanknotesIcon, 
  BuildingOffice2Icon, BriefcaseIcon, 
  ClipboardDocumentCheckIcon } from '@heroicons/react/20/solid';
import DashNav from '@/app/[lang]/components/shared/navigation/Wrappers/NavigationWrapper';
import  Sollicitaties  from '@/app/[lang]/components/shared/Wrappers/Sollicitaties';
import  Dienstensectie  from '@/app/[lang]/components/shared/Wrappers/Dienstensectie';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { IApplication } from '@/app/lib/models/application.model';
import { IJob } from '@/app/lib/models/job.model';
import { IVacancy } from '@/app/lib/models/vacancy.model';


interface Props {
  vacature: IVacancy;
  diensten: IJob[];
  sollicitaties: IApplication[];
  lang: Locale;
  dictionary: any;
}
  

export default function BedrijvenPage({ vacature, diensten, sollicitaties, lang, dictionary }: Props) {
  const components = dictionary.components;
    const features = [
        {
          name: 'Loon',
          description: `${components.forms.VacancyForm.salaris.currencySign} ${vacature.hourlyRate} / ${diensten.length}`,
          icon: BanknotesIcon,
        },
        {
          name: 'Data',
          description: `${components.forms.VacancyForm.salaris.fieldLabels[6]} ${vacature.startingDate} ${components.forms.VacancyForm.salaris.fieldLabels[7]} ${vacature.endingDate}`,
          icon: CalendarDateRangeIcon,
        },
        {
          name: 'Adres',
          description:`${vacature.adres.street} ${vacature.adres.housenumber} \n
          ${vacature.adres.postcode} ${vacature.adres.city}`,
          icon: BuildingOffice2Icon,
        },
        {
          name: 'Kledingsvoorschriften',
          description: vacature.dresscode?.length 
          ? vacature.dresscode.join(', ') 
          : 'Geen specifieke voorschriften',
          icon: BriefcaseIcon,
        },
        {
            name: 'Vaardigheden',
            description: vacature.skills?.length 
            ? vacature.skills.join(', ') 
            : 'Geen vaardigheden vereist', 
            icon: ClipboardDocumentCheckIcon,
          },
      ]

  return (
    <>
    <DashNav lang={lang}/>
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
          <div className="px-6 lg:px-0 lg:pr-4 lg:pt-4">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-sky-600">{vacature.function}</h2>
              <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {vacature.title}
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
              {vacature.description}
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon aria-hidden="true" className="absolute left-1 top-1 size-5 text-sky-600" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="sm:px-6 lg:px-0">
            <div className="relative isolate overflow-hidden bg-sky-500 px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pl-16 sm:pr-0 sm:pt-16 lg:mx-0 lg:max-w-none">
              <div
                aria-hidden="true"
                className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-30deg] bg-sky-100 opacity-20 ring-1 ring-inset ring-white"
              />
              <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
                <img
                  alt="vacature afbeelding"
                  src={vacature.image}
                  width={2432}
                  height={1442}
                  className="-mb-12 w-[57rem] max-w-none rounded-tl-xl bg-gray-800 ring-1 ring-white/10"
                />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 sm:rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <Sollicitaties sollicitaties={sollicitaties} lang={lang}/>
    <Dienstensectie diensten={diensten} lang={lang}/>
    </>
  )
}
