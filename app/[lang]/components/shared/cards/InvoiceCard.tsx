"use client"

import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { fetchBedrijfDetails, isBedrijf } from '@/app/lib/actions/employer.actions';
import { Iinvoice} from '@/app/lib/models/invoice.model';
import Link from 'next/link';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';


type CardProps = {
  factuur:  Iinvoice
}

const Card = async ({ factuur, lang }: CardProps & { lang: Locale }) => {
  const { user } = useUser();
  const userId = user?.id as string;
  const [isEenBedrijf, setIsEenBedrijf] = useState<boolean | undefined>(false);
  const [bedrijfDetails, setBedrijfsdetails] = useState<any>(null);
  const { components } = await getDictionary(lang);
  // const [linkHref, setLinkHref] = useState<string | null>('');

  const bedrijfCheck = async () => {
  try {
    const isEventCreator = await isBedrijf() // Assuming isBedrijf is a function that returns a boolean
    setIsEenBedrijf(isEventCreator); // Set the state with the boolean result
  } catch (error) {
    console.error("Error checking if user is a bedrijf:", error);
  }
};

bedrijfCheck()
  

  useEffect(() => {
    const getBedrijfDetails = async () => {
      try {
        const details = await fetchBedrijfDetails(userId);
        setBedrijfsdetails(details);
      } catch (error) {
        console.error('Error fetching bedrijf details:', error);
      }
    };

    getBedrijfDetails();
  }, [userId]);
  const afbeelding = bedrijfDetails ? bedrijfDetails.profielfoto : "https://utfs.io/f/72e72065-b298-4ffd-b1a2-4d12b06230c9-n2dnlw.webp"
  let linkHref : string = `//NotFound`;

  // Check of het een opdrachtgever of opdrachtnemer is
  const isOpdrachtgever = factuur.employer != null;
  const isOpdrachtnemer = factuur.employee != null;
  
  // Check of het om gewerkte uren als freelancer of uitzendkracht gaat
  const isFreelancerFactuur = factuur.shifts?.length > 0;
  const isUitzendkrachtFactuur = factuur.jobs?.length > 0;
  
  if (isOpdrachtnemer) {
    if (isFreelancerFactuur) {
      linkHref = `/dashboard/factuur/freelancer/${factuur._id}`;
    } else if (isUitzendkrachtFactuur) {
      linkHref = `/dashboard/loonstrook/pagina/${factuur._id}`;
    }
  } else if (isOpdrachtgever) {
    if (isFreelancerFactuur) {
      linkHref = `/dashboard/factuur/bedrijf/${factuur._id}`;
    } else if (isUitzendkrachtFactuur) {
      linkHref = `/dashboard/vacature/factuur/${factuur._id}`;
    }
  } else {
    // Wanneer zowel opdrachtgever als opdrachtnemer leeg zijn
    linkHref = `/NotFound`;
  }

  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
    
          <Link 
          href={linkHref}
          style={{ backgroundImage: `url(${afbeelding})` }}
          className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
        />
      

      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
        <div className="flex gap-2">
          <p className="p-semibold-14 w-full py-1 text-grey-500 line-clamp-2">
            {components.cards.InvoiceCard.week} {factuur.week} 
          </p>
        </div>
        <div>
        {factuur.shifts.length === 1 ? (
                   <>
               <p className="p-semibold-14 w-full py-1 text-grey-500 line-clamp-2">
                 {factuur.shifts.length} {components.cards.InvoiceCard.shift} 
               </p>
             </>
            ) : (
              <p className="p-semibold-14 w-full py-1 text-grey-500 line-clamp-2">
                {factuur.shifts.length} {components.cards.InvoiceCard.hvl_shifts}
              </p>
            )}
          </div>
        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 text-grey-600">
           {components.cards.InvoiceCard.currencySign} {factuur.totalAmount}
          </p>
          <p className="p-medium-14 md:p-medium-16 text-grey-600">
            {factuur.isCompleted ? "voldaan" : "openstaand"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Card;