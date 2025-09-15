"use client"

import React from "react";
import {useEffect, useState} from "react";
import { IVacancy } from "@/app/lib/models/vacancy.model";
import { haalDienstenMetId, haalVacatureMetId } from "@/app/lib/actions/vacancy.actions";

    export type SearchParamProps = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }
  
  export default function Jobs ({
    id,
    dashboard,
  }: {
    id: string;
    dashboard: any;
  }) {
    const [dienst, setDienst] = useState<any | null> (null);
    const [ vacancy, SetVacancy] = useState<IVacancy | null> (null);
 

      useEffect(() => {
        const fetchData = async () => {
          try {
            const vacancy = await haalVacatureMetId(id);
            if (vacancy) {
              // Only update the state if the data has actually changed
              if (vacancy) {
                SetVacancy(vacancy);
              }
              
            } else {
              console.log("No vacancy found.");
              SetVacancy(null);   
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
      
        fetchData();
      }, [id]); 

      useEffect(() => {
        const fetchData = async () => {
          try {
            const job = await haalDienstenMetId(id);
            if (job) {
              // Only update the state if the data has actually changed
              if (job) {
                setDienst(job);
              }
            } else {
              console.log("No job found.");
              setDienst(null);   
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
      
        fetchData();
      }, [id]);


      const features = [
        { name: `${dashboard.Jobs.FormFieldItems[0]}`, description: `${vacancy?.adres}` },
        { name: `${dashboard.Jobs.FormFieldItems[1]}`, description: `${dienst?.date}` },
        { name: `${dashboard.Jobs.FormFieldItems[2]}`, description: `${dienst?.workingtime.starting} - ${dienst?.workingtime.ending} \n Break: ${dienst?.workingtime.break} minuten` },
        { name: `${dashboard.Jobs.FormFieldItems[3]}`, description: `${dienst?.amount}` },
        { name: `${dashboard.Jobs.FormFieldItems[4]}`, description: vacancy?.skills?.length ? vacancy.skills.join(', ') : 'Geen vaardigheden vereist' },
        { name: `${dashboard.Jobs.FormFieldItems[5]}`, description: vacancy?.dresscode?.length ? vacancy.dresscode.join(', ') : 'Geen specifieke voorschriften'  },
      ]

    return (
      <div className="bg-white">

        <div aria-hidden="true" className="relative">
          <img
            alt="Job image"
            src={vacancy?.image}
            className="h-96 w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-white" />
        </div>
  
        <div className="relative mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{vacancy?.title}</h2>
            <p className="mt-4 text-gray-500">
              {vacancy?.description}
            </p>
          </div>
  
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
            {features.map((feature) => (
              <div key={feature.name} className="border-t border-gray-200 pt-4">
                <dt className="font-medium text-gray-900">{feature.name}</dt>
                <dd className="mt-2 text-sm text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
        
      </div>
    )
  }
  