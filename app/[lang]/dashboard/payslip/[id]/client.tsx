'use client'

import { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import {Label,Listbox,ListboxButton,ListboxOption,ListboxOptions,
    Menu,MenuButton,MenuItem,MenuItems} from '@headlessui/react';
import { CalendarDaysIcon,CreditCardIcon,EllipsisVerticalIcon,
    FaceFrownIcon,FaceSmileIcon,
    FireIcon,HandThumbUpIcon,HeartIcon,PaperClipIcon,
    UserCircleIcon,XMarkIcon as XMarkIconMini } from '@heroicons/react/20/solid';
import DashNav from '@/app/[lang]/components/shared/navigation/Wrappers/NavigationWrapper';
import { IPayslip } from '@/app/lib/models/payslip.model';
import junterLogo from '@/app/assets/images/178884748_padded_logo.png';
import Image from 'next/image'
import { haalloonstrook } from '@/app/lib/actions/payslip.actions';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys



function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export type SearchParamProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

interface PayslipClientProps {
  lang: Locale;
  id: string;
  dictionary: any;
}

export default function Payslip({ lang, id, dictionary }: PayslipClientProps) {
  const { dashboard } = dictionary;
  const moods = [
    { name: `${dashboard.Payslip.moods[0]}`, value: 'excited', icon: FireIcon, iconColor: 'text-white', bgColor: 'bg-red-500' },
    { name: `${dashboard.Payslip.moods[1]}`, value: 'loved', icon: HeartIcon, iconColor: 'text-white', bgColor: 'bg-pink-400' },
    { name: `${dashboard.Payslip.moods[2]}`, value: 'happy', icon: FaceSmileIcon, iconColor: 'text-white', bgColor: 'bg-green-400' },
    { name: `${dashboard.Payslip.moods[3]}`, value: 'sad', icon: FaceFrownIcon, iconColor: 'text-white', bgColor: 'bg-yellow-400' },
    { name: `${dashboard.Payslip.moods[4]}`, value: 'thumbsy', icon: HandThumbUpIcon, iconColor: 'text-white', bgColor: 'bg-blue-500' },
    { name: `${dashboard.Payslip.moods[5]}`, value: null, icon: XMarkIconMini, iconColor: 'text-gray-400', bgColor: 'bg-transparent' },
  ]
  const [selected, setSelected] = useState(moods[5]);
  const [loonstrook, setLoonstrook] = useState<IPayslip | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loonstrook = await haalloonstrook(id);
        if (loonstrook) {
          // Only update the state if the data has actually changed
          if (loonstrook) {
            setLoonstrook(loonstrook);
          }
        } else {
          console.log("No payslip found.");
          setLoonstrook(null);   
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [id]);

  const invoice = {
    subTotal: loonstrook?.subtotal,
    tax: loonstrook?.tap,
    total: loonstrook?.amount,
    /* jobs: [
      {
        id: 1,
        title: 'Logo redesign',
        description: 'New logo and digital asset playbook.',
        hours: '20.0',
        rate: '$100.00',
        price: '$2,000.00',
      },
      {
        id: 2,
        title: 'Website redesign',
        description: 'Design and program new company website.',
        hours: '52.0',
        rate: '$100.00',
        price: '$5,200.00',
      },
      {
        id: 3,
        title: 'Business cards',
        description: 'Design and production of 3.5" x 2.0" business cards.',
        hours: '12.0',
        rate: '$100.00',
        price: '$1,200.00',
      },
      {
        id: 4,
        title: 'T-shirt design',
        description: 'Three t-shirt design concepts.',
        hours: '4.0',
        rate: '$100.00',
        price: '$400.00',
      },
    ], */
  }

/*   const activity = [
    { id: 1, type: 'created', person: { name: 'Chelsea Hagon' }, date: '7d ago', dateTime: '2023-01-23T10:32' },
    { id: 2, type: 'edited', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:03' },
    { id: 3, type: 'sent', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:24' },
    {
      id: 4,
      type: 'commented',
      person: {
        name: 'Chelsea Hagon',
        imageUrl:
          'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      comment: 'Called client, they reassured me the invoice would be paid by the 25th.',
      date: '3d ago',
      dateTime: '2023-01-23T15:56',
    },
    { id: 5, type: 'viewed', person: { name: 'Alex Curren' }, date: '2d ago', dateTime: '2023-01-24T09:12' },
    { id: 6, type: 'paid', person: { name: 'Alex Curren' }, date: '1d ago', dateTime: '2023-01-24T09:20' },
  ] */


  return (
    <>
     <DashNav lang={lang} />
      <main>
        <header className="relative isolate pt-16">
          <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-full left-16 -mt-16 transform-gpu opacity-50 blur-3xl xl:left-1/2 xl:-ml-80">
              <div
                style={{
                  clipPath:
                    'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
                }}
                className="aspect-1154/678 w-288.5 bg-linear-to-br from-[#FFF] to-[#0EA5E9]"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gray-900/5" />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
              <div className="flex items-center gap-x-6">
                <Image
                  alt="Junter logo"
                  src={junterLogo}
                  className="size-16 flex-none rounded-full ring-1 ring-gray-900/10"
                />
                <h1>
                  <div className="text-sm/6 text-gray-500">
                  {dashboard.Payslip.FormFieldItems[0]} <span className="text-gray-700">#00011</span>
                  </div>
                  <div className="mt-1 text-base font-semibold text-gray-900">Junter</div>
                </h1>
              </div>
              <div className="flex items-center gap-x-4 sm:gap-x-6">
                <button type="button" className="hidden text-sm/6 font-semibold text-gray-900 sm:block">
                {dashboard.Payslip.FormFieldItems[1]}
                </button>
                <a
                  href="#"
                  className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  {dashboard.Payslip.FormFieldItems[2]}
                </a>

                <Menu as="div" className="relative sm:hidden">
                  <MenuButton className="-m-3 block p-3">
                    <span className="sr-only">More</span>
                    <EllipsisVerticalIcon aria-hidden="true" className="size-5 text-gray-500" />
                  </MenuButton>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <MenuItem>
                      <button
                        type="button"
                        className="block w-full px-3 py-1 text-left text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                      >
                        {dashboard.Payslip.FormFieldItems[1]}
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                      >
                        {dashboard.Payslip.FormFieldItems[2]}
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* Invoice summary */}
            <div className="lg:col-start-3 lg:row-end-1">
              <h2 className="sr-only">{dashboard.Payslip.FormFieldItems[3]}</h2>
              <div className="rounded-lg bg-gray-50 shadow-xs ring-1 ring-gray-900/5">
                <dl className="flex flex-wrap">
                  <div className="flex-auto pt-6 pl-6">
                    <dt className="text-sm/6 font-semibold text-gray-900">{dashboard.Payslip.FormFieldItems[4]}</dt>
                    <dd className="mt-1 text-base font-semibold text-gray-900">{loonstrook?.amount}</dd>
                  </div>
                  <div className="flex-none self-end px-6 pt-4">
                    <dt className="sr-only">{dashboard.Payslip.FormFieldItems[5]}</dt>
                    {
                      loonstrook?.status === 'Paid' ? 
                      <dd className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-green-600/20 ring-inset">
                      {loonstrook?.status}
                    </dd>
                    : 
                    <dd className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-600/20 ring-inset">
                      {loonstrook?.status}
                    </dd>
                    }
                  </div>
                  <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                    <dt className="flex-none">
                      <span className="sr-only">Client</span>
                      <UserCircleIcon aria-hidden="true" className="h-6 w-5 text-gray-400" />
                    </dt>
                    <dd className="text-sm/6 font-medium text-gray-900">{loonstrook?.employee.name}</dd>
                  </div>
                  <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                    <dt className="flex-none">
                      <span className="sr-only">{dashboard.Payslip.FormFieldItems[6]}</span>
                      <CalendarDaysIcon aria-hidden="true" className="h-6 w-5 text-gray-400" />
                    </dt>
                    <dd className="text-sm/6 text-gray-500">
                      <time dateTime="2023-01-31">{loonstrook?.dueDate}</time>
                    </dd>
                  </div>
                  <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                    <dt className="flex-none">
                      <span className="sr-only">Status</span>
                      <CreditCardIcon aria-hidden="true" className="h-6 w-5 text-gray-400" />
                    </dt>
                    <dd className="text-sm/6 text-gray-500">{loonstrook?.employee.IBAN}</dd>
                  </div>
                </dl>
                <div className="mt-6 border-t border-gray-900/5 px-6 py-6">
                  <a href="#" className="text-sm/6 font-semibold text-gray-900">
                  {dashboard.Payslip.FormFieldItems[7]} <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Invoice */}
            <div className="-mx-4 px-4 py-8 shadow-xs ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pt-16 xl:pb-20">
              <h2 className="text-base font-semibold text-gray-900">{dashboard.Payslip.FormFieldItems[0]}</h2>
              <dl className="mt-6 grid grid-cols-1 text-sm/6 sm:grid-cols-2">
                <div className="sm:pr-4">
                  <dt className="inline text-gray-500">{dashboard.Payslip.FormFieldItems[8]}</dt>{' '}
                  <dd className="inline text-gray-700">
                    <time dateTime="2023-23-01">{loonstrook?.issueDate}</time>
                  </dd>
                </div>
                <div className="mt-2 sm:mt-0 sm:pl-4">
                  <dt className="inline text-gray-500">{dashboard.Payslip.FormFieldItems[6]}</dt>{' '}
                  <dd className="inline text-gray-700">
                    <time dateTime="2023-31-01">{loonstrook?.dueDate}</time>
                  </dd>
                </div>
                <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
                  <dt className="font-semibold text-gray-900">{dashboard.Payslip.FormFieldItems[9]}</dt>
                  <dd className="mt-2 text-gray-500">
                    <span className="font-medium text-gray-900">Junter</span>
                    <br />
                    Kruislaan 233
                    <br />
                    1097GA Amsterdam
                  </dd>
                </div>
                <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pt-6 sm:pl-4">
                  <dt className="font-semibold text-gray-900">{dashboard.Payslip.FormFieldItems[10]}</dt>
                  <dd className="mt-2 text-gray-500">
                    <span className="font-medium text-gray-900">{loonstrook?.employee.name}</span>
                    <br />
                    {loonstrook?.employee.street} {loonstrook?.employee.housenumber}
                    <br />
                    {loonstrook?.employee.postcode} {loonstrook?.employee.city}
                  </dd>
                </div>
              </dl>
              <table className="mt-16 w-full text-left text-sm/6 whitespace-nowrap">
                <colgroup>
                  <col className="w-full" />
                  <col />
                  <col />
                  <col />
                </colgroup>
                <thead className="border-b border-gray-200 text-gray-900">
                  <tr>
                    <th scope="col" className="px-0 py-3 font-semibold">
                    {dashboard.Payslip.FormFieldItems[11]}
                    </th>
                    <th scope="col" className="hidden py-3 pr-0 pl-8 text-right font-semibold sm:table-cell">
                    {dashboard.Payslip.FormFieldItems[12]}
                    </th>
                    <th scope="col" className="hidden py-3 pr-0 pl-8 text-right font-semibold sm:table-cell">
                    {dashboard.Payslip.FormFieldItems[13]}
                    </th>
                    <th scope="col" className="py-3 pr-0 pl-8 text-right font-semibold">
                    {dashboard.Payslip.FormFieldItems[14]}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loonstrook?.jobs.map((job) => (
                    <tr key={job.id as unknown as string} className="border-b border-gray-100">
                      <td className="max-w-0 px-0 py-5 align-top">
                        <div className="truncate font-medium text-gray-900">{job.title}</div>
                        <div className="truncate text-gray-500">{job.date}</div>
                      </td>
                      <td className="hidden py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums sm:table-cell">
                        {job.hours}
                      </td>
                      <td className="hidden py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums sm:table-cell">
                        {job.rate} 
                      </td>
                      <td className="py-5 pr-0 pl-8 text-right align-top text-gray-700 tabular-nums">{job.amount}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th scope="row" className="px-0 pt-6 pb-0 font-normal text-gray-700 sm:hidden">
                    {dashboard.Payslip.FormFieldItems[15]}
                    </th>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden px-0 pt-6 pb-0 text-right font-normal text-gray-700 sm:table-cell"
                    >
                      {dashboard.Payslip.FormFieldItems[15]}
                    </th>
                    <td className="pt-6 pr-0 pb-0 pl-8 text-right text-gray-900 tabular-nums">{invoice.subTotal}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="pt-4 font-normal text-gray-700 sm:hidden">
                    {dashboard.Payslip.FormFieldItems[16]}
                    </th>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-4 text-right font-normal text-gray-700 sm:table-cell"
                    >
                      {dashboard.Payslip.FormFieldItems[16]}
                    </th>
                    <td className="pt-4 pr-0 pb-0 pl-8 text-right text-gray-900 tabular-nums">{invoice.tax}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="pt-4 font-semibold text-gray-900 sm:hidden">
                    {dashboard.Payslip.FormFieldItems[17]}
                    </th>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-4 text-right font-semibold text-gray-900 sm:table-cell"
                    >
                      {dashboard.Payslip.FormFieldItems[17]}
                    </th>
                    <td className="pt-4 pr-0 pb-0 pl-8 text-right font-semibold text-gray-900 tabular-nums">
                      {invoice.total}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="lg:col-start-3">
              {/* Activity feed */}
              <h2 className="text-sm/6 font-semibold text-gray-900">Activity</h2>
              <ul role="list" className="mt-6 space-y-6">
                {loonstrook?.activity.map((activityItem, activityItemIdx) => (
                  <li key={activityItem.id} className="relative flex gap-x-4">
                    <div
                      className={classNames(
                        activityItemIdx === activityItem.id - 1 ? 'h-6' : '-bottom-6',
                        'absolute top-0 left-0 flex w-6 justify-center',
                      )}
                    >
                      <div className="w-px bg-gray-200" />
                    </div>
                    {activityItem.activitytype === 'commented' ? (
                      <>
                        <img
                          alt={activityItem.person.name}
                          src={activityItem.person.profilephoto}
                          className="relative mt-3 size-6 flex-none rounded-full bg-gray-50"
                        />
                        <div className="flex-auto rounded-md p-3 ring-1 ring-gray-200 ring-inset">
                          <div className="flex justify-between gap-x-4">
                            <div className="py-0.5 text-xs/5 text-gray-500">
                              <span className="font-medium text-gray-900">{activityItem.person.name}</span> {dashboard.Payslip.FormFieldItems[18]}
                            </div>
                            <time dateTime={activityItem.date} className="flex-none py-0.5 text-xs/5 text-gray-500">
                              {activityItem.date as unknown as string}
                            </time>
                          </div>
                          <p className="text-sm/6 text-gray-500">{activityItem.comment}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="relative flex size-6 flex-none items-center justify-center bg-white">
                          {activityItem.activitytype === 'Paid' ? (
                            <CheckCircleIcon aria-hidden="true" className="size-6 text-sky-600" />
                          ) : (
                            <div className="size-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                          )}
                        </div>
                        <p className="flex-auto py-0.5 text-xs/5 text-gray-500">
                          <span className="font-medium text-gray-900">{activityItem.person.name}</span>{' '}
                          {activityItem.activitytype} {dashboard.Payslip.FormFieldItems[19]} {activityItem.dateTime as unknown as string}
                        </p>
                        <time dateTime={activityItem.date} className="flex-none py-0.5 text-xs/5 text-gray-500">
                          {activityItem.dateTime as unknown as string}
                        </time>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              {/* New comment form */}
              <div className="mt-6 flex gap-x-3">
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="size-6 flex-none rounded-full bg-gray-50"
                />
                <form action="#" className="relative flex-auto">
                  <div className="overflow-hidden rounded-lg pb-12 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-sky-600">
                    <label htmlFor="comment" className="sr-only">
                    {dashboard.Payslip.FormFieldItems[20]}
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows={2}
                      placeholder={dashboard.Payslip.FormFieldItems[21]}
                      className="block w-full resize-none bg-transparent px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                      defaultValue={''}
                    />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pr-2 pl-3">
                    <div className="flex items-center space-x-5">
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="-m-2.5 flex size-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                        >
                          <PaperClipIcon aria-hidden="true" className="size-5" />
                          <span className="sr-only">{dashboard.Payslip.FormFieldItems[22]}</span>
                        </button>
                      </div>
                      <div className="flex items-center">
                        <Listbox value={selected} onChange={setSelected}>
                          <Label className="sr-only">{dashboard.Payslip.FormFieldItems[23]}</Label>
                          <div className="relative">
                            <ListboxButton className="relative -m-2.5 flex size-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                              <span className="flex items-center justify-center">
                                {selected.value === null ? (
                                  <span>
                                    <FaceSmileIcon aria-hidden="true" className="size-5 shrink-0" />
                                    <span className="sr-only">{dashboard.Payslip.FormFieldItems[24]}</span>
                                  </span>
                                ) : (
                                  <span>
                                    <span
                                      className={classNames(
                                        selected.bgColor,
                                        'flex size-8 items-center justify-center rounded-full',
                                      )}
                                    >
                                      <selected.icon aria-hidden="true" className="size-5 shrink-0 text-white" />
                                    </span>
                                    <span className="sr-only">{selected.name}</span>
                                  </span>
                                )}
                              </span>
                            </ListboxButton>

                            <ListboxOptions
                              transition
                              className="absolute bottom-10 z-10 -ml-6 w-60 rounded-lg bg-white py-3 text-base shadow-sm ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:ml-auto sm:w-64 sm:text-sm"
                            >
                              {moods.map((mood) => (
                                <ListboxOption
                                  key={mood.value}
                                  value={mood}
                                  className="relative cursor-default bg-white px-3 py-2 select-none data-focus:bg-gray-100"
                                >
                                  <div className="flex items-center">
                                    <div
                                      className={classNames(
                                        mood.bgColor,
                                        'flex size-8 items-center justify-center rounded-full',
                                      )}
                                    >
                                      <mood.icon
                                        aria-hidden="true"
                                        className={classNames(mood.iconColor, 'size-5 shrink-0')}
                                      />
                                    </div>
                                    <span className="ml-3 block truncate font-medium">{mood.name}</span>
                                  </div>
                                </ListboxOption>
                              ))}
                            </ListboxOptions>
                          </div>
                        </Listbox>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                    >
                      {dashboard.Payslip.FormFieldItems[25]}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
};
