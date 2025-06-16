'use client'

import { CalendarDateRangeIcon, BanknotesIcon, 
  BuildingOffice2Icon, BriefcaseIcon, 
  ClipboardDocumentCheckIcon } from '@heroicons/react/20/solid';
import { Sollicitaties } from '@/app/[lang]/components/shared/Sollicitaties';
import  Dienstensectie  from '@/app/[lang]/components/shared/Dienstensectie';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';


interface BedrijvenPageProps {
    vacature: {
      vactureID: any;
      afbeelding: string;
      titel: string;
      functie: string;
      adres: { 
        straatnaam: string, 
        huisnummer: string, 
        postcode: string, 
        stad: string 
      };
      beschrijving: string;
      kledingsvoorschriften: string[];
      vaardigheden: string[];
      begindatum: string;
      einddatum: string;
      begintijd: string;
      uurloon: number;
      eindtijd: string;
      toeslag: boolean;
      toeslagtype: number;
      toeslagpercentage: number;
    };
    diensten: [{
    dienstId: string;
    opdrachtgever: string;
    vacature: string;
    datum: string
    werktijden: {
        begintijd: string,
        eindtijd: string,
        pauze: number
    }
    opdrachtnemers: [{
        freelancerId: string
        naam: string,
        profielfoto: string
        rating: number;
        geboortedatum: string;
        emailadres: string;
        telefoonnummer: string;
        klussen: number;
        stad: string;
    }],
    bedrag: number,
    status: string,
    index: number, // Replace `any[]` with the correct type if known
}],

    sollicitaties: [
      sollicitatie: {
        sollicitatieId: string,
        opdrachtgever: string,
        vacature: string,
        diensten: [
        {
            dienstId: string,
            datum:string,
            begintijd: string,
            eindtijd: string,
            pauze: number,
            opdrachtnemers: number,
        }
    ],
        opdrachtnemer: {
            opdrachtnemerId: string,
            naam: string,
            profielfoto: string,
            geboortedatum: string,
            bio: string,
            stad: string,
            emailadres: string,
            telefoonnumer: string,
            klussen: string,
            rating: number,
        }
    }
]
}
  

export default async function BedrijvenPage({vacature, diensten, sollicitaties}: BedrijvenPageProps, { lang }: { lang: Locale }) {
  const { components } = await getDictionary(lang);
    const features = [
        {
          name: 'Loon',
          description: `${components.forms.VacancyForm.salaris.currencySign} ${vacature.uurloon} / ${diensten.length}`,
          icon: BanknotesIcon,
        },
        {
          name: 'Data',
          description: `${components.forms.VacancyForm.salaris.fieldLabels[6]} ${vacature.begindatum} ${components.forms.VacancyForm.salaris.fieldLabels[7]} ${vacature.einddatum}`,
          icon: CalendarDateRangeIcon,
        },
        {
          name: 'Adres',
          description:`${vacature.adres.straatnaam} ${vacature.adres.huisnummer} \n
          ${vacature.adres.postcode} ${vacature.adres.stad}`,
          icon: BuildingOffice2Icon,
        },
        {
          name: 'Kledingsvoorschriften',
          description: vacature.kledingsvoorschriften?.length 
          ? vacature.kledingsvoorschriften.join(', ') 
          : 'Geen specifieke voorschriften',
          icon: BriefcaseIcon,
        },
        {
            name: 'Vaardigheden',
            description: vacature.vaardigheden?.length 
            ? vacature.vaardigheden.join(', ') 
            : 'Geen vaardigheden vereist', 
            icon: ClipboardDocumentCheckIcon,
          },
      ]

  return (
    <>
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
          <div className="px-6 lg:px-0 lg:pr-4 lg:pt-4">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-sky-600">{vacature.functie}</h2>
              <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {vacature.titel}
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
              {vacature.beschrijving}
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
                  src={vacature.afbeelding}
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
    <Sollicitaties sollicitaties={sollicitaties} lang={'en'}/>
    <Dienstensectie diensten={diensten} lang={lang}/>
    </>
  )
}
