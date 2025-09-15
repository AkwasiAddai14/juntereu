'use client'


import { useEffect, useState } from "react";
import { Field, Label, Switch } from '@headlessui/react';
import { haalFreelancer } from "@/app/lib/actions/employee.actions";
import * as React from "react";
import { getDictionary } from '@/app/[lang]/dictionaries';
import { useUser } from "@clerk/nextjs";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys



interface ProfileClientProps {
  dashboard: any;
}

export default function Profile({ dashboard }: ProfileClientProps) {
  const { isLoaded, user } = useUser();
  const [freelancerId, setFreelancerId] = useState<any>(null);
  const [freelancer, setFreelancer] = useState<any>(null);
  const [automaticTimezoneEnabled, setAutomaticTimezoneEnabled] = useState(true);

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
        <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
              <h2 className="text-base/7 font-semibold text-gray-900">{dashboard.werknemersPage.BentoGrid.profiel.headTitle}</h2>
              <p className="mt-1 text-sm/6 text-gray-500">
                {dashboard.werknemersPage.BentoGrid.profiel.subTitle}
              </p>

              <dl className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
                <div className="py-6 sm:flex">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="col-span-full flex items-center gap-x-8">
                      <img
                        alt="Profilephoto"
                        src={freelancer.profilephoto}
                        className="size-24 flex-none rounded-lg bg-gray-800 object-cover"
                      />
                      <div>
                        <button
                          type="button"
                          className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                        >
                          {dashboard.werknemersPage.BentoGrid.profiel.ProfielFotoButton}
                        </button>
                        <p className="mt-2 text-xs/5 text-gray-400">{dashboard.werknemersPage.BentoGrid.profiel.placeholderTextButton}</p>
                      </div>
                    </div>
                    </div>
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{dashboard.werknemersPage.BentoGrid.profiel.formItems[0]}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{freelancer.firstname} {freelancer.infix} {freelancer.lastname}</div>
                    {/* <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Update
                    </button> */}
                  </dd>
                </div>
                <div className="py-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{dashboard.werknemersPage.BentoGrid.profiel.formItems[1]}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{freelancer.email}</div>
                    <button type="button" className="font-semibold text-sky-600 hover:text-sky-500">
                      {dashboard.werknemersPage.BentoGrid.profiel.taalendata.button}
                    </button>
                  </dd>
                </div>
                <div className="py-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{dashboard.werknemersPage.BentoGrid.profiel.formItems[2]}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{freelancer.phone}</div>
                    <button type="button" className="font-semibold text-sky-600 hover:text-sky-500">
                    {dashboard.werknemersPage.BentoGrid.profiel.taalendata.button}
                    </button>
                  </dd>
                </div>
                <div className="py-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{dashboard.werknemersPage.BentoGrid.profiel.formItems[3]}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{freelancer.dateOfBirth}</div>
                    {/* <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Update
                    </button> */}
                  </dd>
                </div>
                <div className="py-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{dashboard.werknemersPage.BentoGrid.profiel.formItems[4]}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{freelancer.street}</div>
                    <button type="button" className="font-semibold text-sky-600 hover:text-sky-500">
                    {dashboard.werknemersPage.BentoGrid.profiel.taalendata.button}
                    </button>
                  </dd>
                </div>
                <div className="py-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{dashboard.werknemersPage.BentoGrid.profiel.formItems[5]}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{freelancer.housenumber}</div>
                    <button type="button" className="font-semibold text-sky-600 hover:text-sky-500">
                    {dashboard.werknemersPage.BentoGrid.profiel.taalendata.button}
                    </button>
                  </dd>
                </div>
                <div className="py-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">IBAN</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{freelancer.iban}</div>
                    <button type="button" className="font-semibold text-sky-600 hover:text-sky-500">
                    {dashboard.werknemersPage.BentoGrid.profiel.taalendata.button}
                    </button>
                  </dd>
                </div>

                <Field className="flex pt-6">
                  <Label as="dt" passive className="flex-none pr-6 font-medium text-gray-900 sm:w-64">
                  {dashboard.werknemersPage.BentoGrid.profiel.formItems[6]}
                  </Label>
                  <dd className="flex flex-auto items-center justify-end">
                    <Switch
                      checked={automaticTimezoneEnabled}
                      onChange={setAutomaticTimezoneEnabled}
                      className="group flex w-8 cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 data-[checked]:bg-sky-600"
                    >
                      <span
                        aria-hidden="true"
                        className="size-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                      />
                    </Switch>
                  </dd>
                </Field>

                <Field className="flex pt-6">
                  <Label as="dt" passive className="flex-none pr-6 font-medium text-gray-900 sm:w-64">
                  {dashboard.werknemersPage.BentoGrid.profiel.formItems[7]}
                  </Label>
                  <dd className="flex flex-auto items-center justify-end">
                    <Switch
                      checked={automaticTimezoneEnabled}
                      onChange={setAutomaticTimezoneEnabled}
                      className="group flex w-8 cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 data-[checked]:bg-sky-600"
                    >
                      <span
                        aria-hidden="true"
                        className="size-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                      />
                    </Switch>
                  </dd>
                </Field>
              </dl>
            </div>

            <div>
              <h2 className="text-base/7 font-semibold text-gray-900">{dashboard.werknemersPage.BentoGrid.profiel.werkervaring.headTitle}</h2>
              <p className="mt-1 text-sm/6 text-gray-500">{dashboard.werknemersPage.BentoGrid.profiel.werkervaring.subTitle}</p>

              <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
                <li className="flex justify-between gap-x-6 py-6">
                  <div className="font-medium text-gray-900">TD Canada Trust</div>
                  <button type="button" className="font-semibold text-sky-600 hover:text-sky-500">
                    {dashboard.werknemersPage.BentoGrid.profiel.werkervaring.button}
                  </button>
                </li>
              </ul>

              <div className="flex border-t border-gray-100 pt-6">
                <button type="button" className="text-sm/6 font-semibold text-sky-600 hover:text-sky-500">
                  <span aria-hidden="true">+</span> {dashboard.werknemersPage.BentoGrid.profiel.werkervaring.subTitle}
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-base/7 font-semibold text-gray-900">{dashboard.werknemersPage.BentoGrid.profiel.opleiding.headTitle}</h2>
              <p className="mt-1 text-sm/6 text-gray-500">{dashboard.werknemersPage.BentoGrid.profiel.opleiding.subTitle}</p>

              <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
                <li className="flex justify-between gap-x-6 py-6">
                  <div className="font-medium text-gray-900">QuickBooks</div>
                  <button type="button" className="font-semibold text-sky-600 hover:text-sky-500">
                    {dashboard.werknemersPage.BentoGrid.profiel.opleiding.button}
                  </button>
                </li>
              </ul>

              <div className="flex border-t border-gray-100 pt-6">
                <button type="button" className="text-sm/6 font-semibold text-sky-600 hover:text-sky-500">
                  <span aria-hidden="true">+</span> {dashboard.werknemersPage.BentoGrid.profiel.opleiding.subTitle}
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-base/7 font-semibold text-gray-900">{dashboard.werknemersPage.BentoGrid.profiel.taalendata.headTitle}</h2>
              <p className="mt-1 text-sm/6 text-gray-500">
                {dashboard.werknemersPage.BentoGrid.profiel.taalendata.subTitle}
              </p>

              <dl className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
                <div className="py-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{dashboard.werknemersPage.BentoGrid.profiel.taalendata.formItems[0]}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">English</div>
                    <button type="button" className="font-semibold text-sky-600 hover:text-sky-500">
                      {dashboard.werknemersPage.BentoGrid.profiel.taalendata.button}
                    </button>
                  </dd>
                </div>
                <div className="py-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{dashboard.werknemersPage.BentoGrid.profiel.taalendata.formItems[1]}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">DD-MM-YYYY</div>
                    <button type="button" className="font-semibold text-sky-600 hover:text-sky-500">
                      {dashboard.werknemersPage.BentoGrid.profiel.taalendata.button}
                    </button>
                  </dd>
                </div>
                <Field className="flex pt-6">
                  <Label as="dt" passive className="flex-none pr-6 font-medium text-gray-900 sm:w-64">
                    {dashboard.werknemersPage.BentoGrid.profiel.taalendata.dataLabel}
                  </Label>
                  <dd className="flex flex-auto items-center justify-end">
                    <Switch
                      checked={automaticTimezoneEnabled}
                      onChange={setAutomaticTimezoneEnabled}
                      className="group flex w-8 cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 data-[checked]:bg-sky-600"
                    >
                      <span
                        aria-hidden="true"
                        className="size-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                      />
                    </Switch>
                  </dd>
                </Field>
              </dl>
            </div>
          </div>
        </main>
    </>
  )
}
