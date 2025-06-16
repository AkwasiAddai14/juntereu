'use client'

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import {  Fragment,  useEffect, useState } from "react";
import { haalFacturenFreelancer } from "@/app/lib/actions/invoice.actions";
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';



export default async function Financien ({ lang }: { lang: Locale }) {
  const { dashboard } = await getDictionary(lang);
  const { isLoaded, user } = useUser();
  const [facturen, setFacturen] = useState<any[]>([]);
  const [freelancerId, setFreelancerId] = useState<any>(null);

  useEffect(() => {
    if (isLoaded && user) {
      setFreelancerId(user?.id)
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const fetchFactuur = async () => {
      try {
        const response = await haalFacturenFreelancer(freelancerId);
        setFacturen(response || []);
      } catch (error) {
        console.error('Error fetching factuur:', error);
      }
    };
    
    fetchFactuur();
  }, [freelancerId]); 

  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-gray-900">{dashboard.werknemersPage.BentoGrid.Financien.headTitle}</h1>
            <p className="mt-2 text-sm text-gray-700">
              {dashboard.werknemersPage.BentoGrid.Financien.subtitle}
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-sky-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              Export
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      {dashboard.werknemersPage.BentoGrid.Financien.ColumnTitles[0]}
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {dashboard.werknemersPage.BentoGrid.Financien.ColumnTitles[1]}
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {dashboard.werknemersPage.BentoGrid.Financien.ColumnTitles[2]}
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {dashboard.werknemersPage.BentoGrid.Financien.ColumnTitles[3]} 
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      {dashboard.werknemersPage.BentoGrid.Financien.ColumnTitles[4]}
                    </th>
                    <th scope="col" className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {facturen.map((factuur) => (
                    <tr key={factuur.id}>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">{factuur.id}</td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                        {factuur.week}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{factuur.shifts}</td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{factuur.totalAmount}</td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{factuur.isCompleted}</td>
                      <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <a href="#" className="text-sky-600 hover:text-sky-900">
                        {dashboard.werknemersPage.BentoGrid.Financien.button}<span className="sr-only">, {factuur.id}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  ) 
}
