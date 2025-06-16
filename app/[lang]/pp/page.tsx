'use client'

import React from 'react'
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'dk', 'no', 'lu',
  'sw', 'os', 'benl', 'befr', 'suit', 'sufr', 'sude',
];

/* // ✅ REQUIRED als je [lang] route gebruikt
export async function generateStaticParams() {
  return supportedLocales.map((lang) => ({ lang }));
} */

const page = async ({ params }: { params: { lang: string } }) => {

  const lang = supportedLocales.includes(params.lang as Locale) ? (params.lang as Locale) : 'en';
  const { pages } = await getDictionary(lang);
  
  return (
        <div className="bg-white px-6 py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
            <p className="text-base font-semibold leading-7 text-sky-600">{pages.privacypolicyPage.privacyPolicyEmployee.title}{/* PrivacyBeleid */}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{pages.privacypolicyPage.privacyPolicyEmployee.subtitle}{/* Voor werknemers */}</h1>
            <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">{pages.privacypolicyPage.privacyPolicyEmployee.introduction.heading}{/* Inleiding */}</h2>
            <p className="mt-6 text-xl leading-8">
            {pages.privacypolicyPage.privacyPolicyEmployee.introduction.text}
   {/*  Welkom bij Junter. 
    Wij waarderen uw vertrouwen in ons en nemen uw privacy serieus. 
    Dit privacybeleid is bedoeld om u te informeren over hoe wij uw persoonlijke gegevens verzamelen, 
    gebruiken, delen en beschermen wanneer u gebruikmaakt van ons platform. */}
        </p>
            <div className="mt-10 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">{pages.privacypolicyPage.privacyPolicyEmployee.section1.heading}{/* 1. Gegevens die wij verzamelen */}</h2>
              <p className="mt-7">
              {pages.privacypolicyPage.privacyPolicyEmployee.section1.text}
             {/*  Wij verzamelen verschillende soorten gegevens om onze diensten te kunnen leveren en verbeteren.
   
    Persoonlijke Gegevens: {'\n'}Voornaam, achternaam, geboortedatum, e-mailadres, telefoonnummer, adres, BSN, BTW-id, en bankrekeningnummer (IBAN).
    Professionele Gegevens: Werkervaring, vaardigheden, opleidingen, profielafbeelding, en beoordelingen.
    Gebruik van het Platform: Informatie over uw interacties met ons platform, zoals de diensten die u aanbiedt of aanvraagt, communicatie met bedrijven, en uw deelname aan projecten. */}
              </p>

              <h2 className=" mt-16 text-2xl font-bold tracking-tight text-gray-900">{pages.privacypolicyPage.privacyPolicyEmployee.section2.heading}{/* 2. Hoe wij uw gegevens gebruiken */}</h2>
              <p className="mt-7">
              {pages.privacypolicyPage.privacyPolicyEmployee.section2.text}
              {/* Wij gebruiken uw gegevens voor de volgende doeleinden:
    
    Dienstverlening: Om u in staat te stellen om projecten te vinden en aan te nemen, en om bedrijven in staat te stellen om uw diensten te boeken.
    Communicatie: Om contact met u op te nemen over uw account, projecten, en andere gerelateerde zaken.
    Verbetering van het Platform: Om ons platform en onze diensten te analyseren en te verbeteren.
    Wettelijke Verplichtingen: Om te voldoen aan wettelijke en regelgevende vereisten. */}
              </p>

              <h2 className=" mt-16 text-2xl font-bold tracking-tight text-gray-900">{pages.privacypolicyPage.privacyPolicyEmployee.section3.heading}{/*  3. Delen van uw gegevens */}</h2>
              <p className="mt-7">
              {pages.privacypolicyPage.privacyPolicyEmployee.section3.text}
              {/* Wij delen uw gegevens alleen met derden wanneer dit noodzakelijk is voor de uitvoering van onze diensten, zoals:
    
    Bedrijven: Om bedrijven in staat te stellen contact met u op te nemen en uw diensten te boeken.
    Dienstverleners: Om technische ondersteuning en andere diensten te verlenen die noodzakelijk zijn voor het functioneren van ons platform.
    Wettelijke Autoriteiten: Indien wij wettelijk verplicht zijn om uw gegevens te verstrekken. */}
              </p>

              <h2 className=" mt-16 text-2xl font-bold tracking-tight text-gray-900">{pages.privacypolicyPage.privacyPolicyEmployee.section4.heading}{/* 4. Beveiliging van uw gegevens */}</h2>
              <p className="mt-7">
              {pages.privacypolicyPage.privacyPolicyEmployee.section4.text}
              {/* Wij nemen passende technische en organisatorische maatregelen om uw gegevens te beschermen tegen ongeautoriseerde toegang, verlies, vernietiging of wijziging. Ondanks onze inspanningen kunnen wij de veiligheid van gegevensoverdracht via internet niet volledig garanderen. */}
              </p>

              <h2 className=" mt-16 text-2xl font-bold tracking-tight text-gray-900">{pages.privacypolicyPage.privacyPolicyEmployee.section5.heading}{/* 5. Bewaartermijnen */}</h2>
              <p className="mt-7">
              {pages.privacypolicyPage.privacyPolicyEmployee.section5.text}
              {/* Wij bewaren uw persoonlijke gegevens niet langer dan noodzakelijk is voor de doeleinden waarvoor zij zijn verzameld, tenzij een langere bewaartermijn wettelijk vereist is. */}
              </p>

              <h2 className=" mt-16 text-2xl font-bold tracking-tight text-gray-900">{pages.privacypolicyPage.privacyPolicyEmployee.section6.heading}{/* 6. Uw rechten */}</h2>
              <p className="mt-7">
              {pages.privacypolicyPage.privacyPolicyEmployee.section6.text}
              {/* U heeft het recht om:
    
    Toegang te vragen tot uw persoonlijke gegevens.
    Correctie te vragen van onjuiste of onvolledige gegevens.
    Verwijdering te vragen van uw persoonlijke gegevens.
    Beperking te vragen van de verwerking van uw gegevens.
    Bezwaar te maken tegen de verwerking van uw gegevens.
    Gegevensoverdraagbaarheid te vragen van uw gegevens.
    Indien u één van deze rechten wilt uitoefenen, neem dan contact met ons op via support@junter.works. */}
              </p>

              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">{pages.privacypolicyPage.privacyPolicyEmployee.section7.heading}{/* 7. Wijzigingen in dit privacybeleid */}</h2>
              <p className="mt-7">
              {pages.privacypolicyPage.privacyPolicyEmployee.section7.text}
              {/* Wij kunnen dit privacybeleid van tijd tot tijd wijzigen. Wij zullen u op de hoogte stellen van wezenlijke wijzigingen door een kennisgeving op ons platform te plaatsen of door u rechtstreeks te informeren. */}
              </p>

            <div className="mt-16 max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">{pages.privacypolicyPage.privacyPolicyEmployee.section8.heading}{/* 8. Contact */}</h2>
              <p className="mt-6">
              {pages.privacypolicyPage.privacyPolicyEmployee.section8.text}
              {/* Indien u vragen of opmerkingen heeft over dit privacybeleid, neem dan contact met ons op via: */}
              </p>
              <p className="mt-8">
              <a className="font-semibold text-sky-600" href="mailto:support@junter.works">
              {pages.privacypolicyPage.privacyPolicyEmployee.section8.email}    {/* //support@junter.works */}
              </a>
              </p>
            </div>
          </div>
        </div>
        </div>
    )
 }

export default page;