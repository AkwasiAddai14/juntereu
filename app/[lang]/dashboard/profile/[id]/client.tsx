"use client";

import { MenuButton, MenuItems, MenuItem, Field, Label, Switch } from '@headlessui/react';
import { CodeBracketIcon, EllipsisVerticalIcon, FlagIcon, PaperClipIcon, StarIcon } from '@heroicons/react/20/solid';
import { Menu } from 'lucide-react';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { haalFreelancer } from "@/app/lib/actions/employee.actions";
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { IEmployee } from '@/app/lib/models/employee.model';

type Props = {
  dashboard: any;
};

export default function Profiel({ dashboard }: Props) {
  const { isLoaded, user } = useUser();
  const [freelancerId, setFreelancerId] = useState<any>(null);
  const [freelancer, setFreelancer] = useState<IEmployee | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      setFreelancerId(user?.id)
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const getFreelancerId = async () => {
      try {
        const freelancer = await haalFreelancer(user!.id);
        if (freelancer) {
          setFreelancer(freelancer);
        } else{
          console.log("geen freelancerId gevonden.")
        }
      } catch (error) {
        console.error("Error fetching freelancer by Clerk ID:", error);
      }
    };
    if (user && !freelancerId) {  // Only fetch if user exists and freelancerId is not already set
      getFreelancerId();
    }
  }, [freelancerId]);
  
  return (
    <>
      <div className="px-4 sm:px-0">
        <h3 className="text-base/7 font-semibold text-gray-900">Profile settings</h3>
        <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">Personal details</p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">{dashboard.werknemersPage.Profiel.ProfielItems[0]}</dt> 
            <dd className="mt-1 flex text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="grow">{freelancer?.firstname} {freelancer?.infix ? freelancer?.infix : ""} {freelancer?.lastname}</span>
              <span className="ml-4 shrink-0">
                {/* <button type="button" className="rounded-md bg-white font-medium text-sky-600 hover:text-sky-500">
                  Update
                </button> */}
              </span>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">{dashboard.werknemersPage.Profiel.ProfielItems[1]}</dt> 
            <dd className="mt-1 flex text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="grow">{freelancer?.dateOfBirth.toString()}</span>
              <span className="ml-4 shrink-0">
                {/* <button type="button" className="rounded-md bg-white font-medium text-sky-600 hover:text-sky-500">
                  Update
                </button> */}
              </span>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">{dashboard.werknemersPage.Profiel.ProfielItems[2]}</dt>
            <dd className="mt-1 flex text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="grow">{freelancer?.email}</span>
              <span className="ml-4 shrink-0">
                <button type="button" className="rounded-md bg-white font-medium text-sky-600 hover:text-sky-500">
                  Update
                </button>
              </span>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">{dashboard.werknemersPage.Profiel.ProfielItems[3]}</dt> 
            <dd className="mt-1 flex text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="grow">{freelancer?.rating} Rating</span>
           
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">{dashboard.werknemersPage.Profiel.ProfielItems[4]}</dt> 
            <dd className="mt-1 flex text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="grow">{freelancer?.shifts.length} shifts</span>
             
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">{dashboard.werknemersPage.Profiel.ProfielItems[5]}</dt> 
            <dd className="mt-1 flex text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="grow">{freelancer?.jobs.length} jobs</span>
              
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">About</dt>
            <dd className="mt-1 flex text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              <span className="grow">
                {freelancer?.bio}
              </span>
              <span className="ml-4 shrink-0">
                <button type="button" className="rounded-md bg-white font-medium text-sky-600 hover:text-sky-500">
                  Update
                </button>
              </span>
            </dd>
          </div>

        {/*
           <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Attachments</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
                  <div className="flex w-0 flex-1 items-center">
                    <PaperClipIcon aria-hidden="true" className="size-5 shrink-0 text-gray-400" />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">resume_back_end_developer.pdf</span>
                      <span className="shrink-0 text-gray-400">2.4mb</span>
                    </div>
                  </div>
                  <div className="ml-4 flex shrink-0 space-x-4">
                    <button
                      type="button"
                      className="rounded-md bg-white font-medium text-sky-600 hover:text-sky-500"
                    >
                      Update
                    </button>
                    <span aria-hidden="true" className="text-gray-200">
                      |
                    </span>
                    <button type="button" className="rounded-md bg-white font-medium text-gray-900 hover:text-gray-800">
                      Remove
                    </button>
                  </div>
                </li>
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
                  <div className="flex w-0 flex-1 items-center">
                    <PaperClipIcon aria-hidden="true" className="size-5 shrink-0 text-gray-400" />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">coverletter_back_end_developer.pdf</span>
                      <span className="shrink-0 text-gray-400">4.5mb</span>
                    </div>
                  </div>
                  <div className="ml-4 flex shrink-0 space-x-4">
                    <button
                      type="button"
                      className="rounded-md bg-white font-medium text-sky-600 hover:text-sky-500"
                    >
                      Update
                    </button>
                    <span aria-hidden="true" className="text-gray-200">
                      |
                    </span>
                    <button type="button" className="rounded-md bg-white font-medium text-gray-900 hover:text-gray-800">
                      Remove
                    </button>
                  </div>
                </li>
              </ul>
            </dd>
          </div> 
          */}

          
        </dl>
      </div>
    </>
  )
};
