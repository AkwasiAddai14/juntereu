"use client"

import { haalFactuur, haalFactuurShifts } from "@/app/lib/actions/invoice.actions";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image'; 
import logo from '@/app/assets/images/178884748_padded_logo.png'; 
import { useUser } from "@clerk/nextjs";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


export type SearchParamProps = {
  params: { id: string }
}

export default function factuurFreelancer({ id, lang, dashboard }: {
  id: string;
  lang: Locale;
  dashboard: any;
}) {
  const router = useRouter();
  const [shifts, setShifts] = useState<any[]>([]);
  const { isLoaded, isSignedIn, user } = useUser();
  const [isBedrijf, setIsBedrijf] = useState(false);
  const [factuur, setFactuur] = useState<any| null>(null);
  

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("./sign-in");
      console.log("Niet ingelogd");
      alert(`${dashboard.Invoice.employees.ToastMessage1}`);
      return;
    }

    const userType = user?.organizationMemberships.length ?? 0;
    setIsBedrijf(userType >= 1);
  }, [isLoaded, isSignedIn, router, user]);

  if(isBedrijf){
    router.push('/dashboard');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {

        const factuur = await haalFactuur(id);
        if(factuur){

          setFactuur(factuur)
          console.log(factuur, shifts);

        }
        else{
          console.log("Factuur niet gevonden.");
        }

      } catch (error: any){
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id])

  useEffect(() => {
    const fetchData = async () => {
      try{

        const shifts = await haalFactuurShifts(id);
        if(shifts){
          setShifts(shifts)
          console.log(factuur, shifts);
        }
        else{
          console.log("shifts niet gevonden.");
        }

      } catch (error: any){
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id])

  // Function to calculate the subtotal for each shift
  function calculateWorkedHours(begintijd: string, eindtijd: string, pauze: number = 0): number {
    // Parse the begintijd and eindtijd strings into Date objects
    const startTime = new Date(`1970-01-01T${begintijd}:00`);
    const endTime = new Date(`1970-01-01T${eindtijd}:00`);

    // Calculate the difference in milliseconds between startTime and endTime
    const timeDiffMilliseconds = endTime.getTime() - startTime.getTime();

    if (timeDiffMilliseconds < 0) {
        throw new Error('End time cannot be before start time.');
    }

    // Convert the time difference from milliseconds to hours
    const totalHours = timeDiffMilliseconds / (1000 * 60 * 60); // ms to hours

    // Subtract the break time (pauze) from the total hours
    const workedHours = totalHours - pauze / 60;

    // Return the result rounded to two decimal places
    return Math.max(0, Math.round(workedHours * 100) / 100); // Ensure no negative result
}

    // Function to calculate the subtotal for each shift
    const calculateShiftSubtotal = (uren: number, uurtarief: number): number => {
      return uren * uurtarief;
    };


  const factuurShifts = shifts.map((shift) => ({
    _id: shift._id,
    titel: shift.titel,
    afbeelding: shift.afbeelding,
    datum: shift.begindatum,
    uurtarief: shift.uurtarief,
    checkoutbegintijd: shift.checkoutbegintijd,
    checkouteindtijd: shift.checkouteindtijd,
    checkoutpauze: shift.checkoutpauze,
    uren: calculateWorkedHours(shift.checkoutbegintijd, shift.checkouteindtijd, parseInt(shift.checkoutpauze)),
    subtotaal: calculateShiftSubtotal(calculateWorkedHours(shift.checkoutbegintijd, shift.checkouteindtijd, parseInt(shift.checkoutpauze)), shift.uurtarief),
    btw: (calculateShiftSubtotal(calculateWorkedHours(shift.checkoutbegintijd, shift.checkouteindtijd, parseInt(shift.checkoutpauze)) , shift.uurtarief) * 0.21).toFixed(2)
}));

const totaalSubtotaal = factuurShifts.reduce((acc, shift) => {
  return acc + shift.subtotaal;
}, 0);

// Tax and total calculations
const belasting = totaalSubtotaal * 0.21; // 21% tax
const totaalbedrag = totaalSubtotaal + belasting;

  
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Junter</span>
            <Image className="h-32 w-auto" src={logo} alt="Junter logo" /> {/* Use Image component for optimized images */}
          </a>
        </div>
          <h1 className="mt-10 text-base font-semibold leading-6 text-gray-900">{dashboard.Invoice.employees.FormFieldItems[0]}</h1>
          <p className="mt-2 text-lg text-gray-700">
             {factuur?.week ? factuur.week : 52}
          </p>
        </div>
        <div className="flex flex-row justify-between gap-4 mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
            type="button"
            className="block rounded-md bg-orange-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            onClick={() => router.back()}
          >
            {dashboard.Invoice.employees.FormFieldItems[1]}
          </button>
          <button
            type="button"
            className="block rounded-md bg-sky-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            {dashboard.Invoice.employees.FormFieldItems[2]}
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    {dashboard.Invoice.employees.FormFieldItems[3]}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {dashboard.Invoice.employees.FormFieldItems[4]}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {dashboard.Invoice.employees.FormFieldItems[5]}
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {dashboard.Invoice.employees.FormFieldItems[6]}
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Download</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {factuurShifts.map((shift) => (
                  <tr key={shift._id}>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-11 w-11 flex-shrink-0">
                          <img alt="shift afbeelding" src={shift.afbeelding} className="h-11 w-11 rounded-full" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{shift.datum.toDateString()}</div>
                          <div className="mt-1 text-gray-500">{shift.titel}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div className="text-gray-900">{shift.checkoutbegintijd} - {shift.checkouteindtijd}, {shift.checkoutpauze} {dashboard.Invoice.employees.FormFieldItems[7]}</div>
                      <div className="mt-1 text-gray-500">{shift.uren} {dashboard.Invoice.employees.FormFieldItems[8]}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <div className="text-gray-900">{dashboard.currencySign}{shift.uurtarief}</div>
                      
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      {dashboard.currencySign}{shift.subtotaal} +
                      <div className="mt-1 text-gray-500">{dashboard.Invoice.employees.FormFieldItems[9]} {dashboard.currencySign}{shift.btw} </div>
                      </td>
                    <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a href="#" className="text-sky-600 hover:text-sky-900">
                        Download<span className="sr-only">, {shift.titel}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
              >
                {dashboard.Invoice.employees.FormFieldItems[11]}
              </th>
              <th scope="row" className="pl-4 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">
                {dashboard.Invoice.employees.FormFieldItems[11]}
              </th>
              <td className="pl-3 pr-4 pt-6 text-right text-sm text-gray-500 sm:pr-0">{totaalSubtotaal}</td>
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
              >
                {dashboard.Invoice.employees.FormFieldItems[12]}
              </th>
              <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">
                {dashboard.Invoice.employees.FormFieldItems[12]}
              </th>
              <td className="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-0">{belasting}</td>
            </tr>
            <tr>
              <th
                scope="row"
                colSpan={3}
                className="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0"
              >
                {dashboard.Invoice.employees.FormFieldItems[13]}
              </th>
              <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden">
                {dashboard.Invoice.employees.FormFieldItems[13]}
              </th>
              <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">{totaalbedrag}</td>
            </tr>
          </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
};
