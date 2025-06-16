'use client'

import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { XMarkIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';

interface FormData {
  dateType: 'single' | 'multiple'
  singleDate: Date
  startDate: Date
  endDate: Date
  fromTime: string
  toTime: string
  mainCategories: string[]
  subCategories: string[]
  addressType: 'current' | 'different' | 'any'
  distance: string
  street: string
  houseNumber: string
  postcode: string
  city: string
}

const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
  const hours = Math.floor(i / 4)
  const minutes = (i % 4) * 15
  return format(new Date().setHours(hours, minutes), 'HH:mm')
})
//'[]
const mainCategories = ['Category 1', 'Category 2', 'Category 3']
const subCategories = ['Sub 1', 'Sub 2', 'Sub 3']
const distanceOptions = ['0 km', '5 km', '10 km', '15 km', '20 km', '50 km', '100 km']

export default async function AvailabilityForm( { lang }: { lang: Locale } ) {
  const { components } = await getDictionary(lang);
  const [open, setOpen] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    dateType: 'single',
    singleDate: new Date(),
    startDate: new Date(),
    endDate: new Date(),
    fromTime: format(new Date(), 'HH:mm'),
    toTime: format(new Date(), 'HH:mm'),
    mainCategories: [],
    subCategories: [],
    addressType: 'current',
    distance: '20 km',
    street: '',
    houseNumber: '',
    postcode: '',
    city: ''
  })

  const handleSave = () => {
    setOpen(false)
  }

  const handleCancel = () => {
    setShowCancelModal(true)
  }

  const handleConfirmCancel = () => {
    setShowCancelModal(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-2xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1">
                  <div className="flex h-full">
                    {/* Left side - Display */}
                    <div className="w-1/2 border-r border-gray-200 p-6">
                      <h2 className="text-lg font-medium text-gray-900">{components.forms.AvailabilityForm.headTitle}</h2>
                      <div className="mt-4 space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">{components.forms.AvailabilityForm.Dates}</h3>
                          <p className="mt-1 text-sm text-gray-900">
                            {formData.dateType === 'single'
                              ? format(formData.singleDate, 'PPP')
                              : `${format(formData.startDate, 'PPP')} - ${format(formData.endDate, 'PPP')}`}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">{components.forms.AvailabilityForm.Times}</h3>
                          <p className="mt-1 text-sm text-gray-900">
                            {formData.fromTime} - {formData.toTime}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">{components.forms.AvailabilityForm.Categories}</h3>
                          <div className="mt-1">
                            <p className="text-sm text-gray-900">{components.forms.AvailabilityForm.Section2.formItems[0]}: {formData.mainCategories.join(', ')}</p>
                            <p className="text-sm text-gray-900">{components.forms.AvailabilityForm.Section2.formItems[1]}: {formData.subCategories.join(', ')}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">{components.forms.AvailabilityForm.Distance}</h3>
                          <p className="mt-1 text-sm text-gray-900">
                            {formData.addressType === 'current'
                              ? 'Current Address'
                              : formData.addressType === 'different'
                              ? `${formData.street} ${formData.houseNumber}, ${formData.postcode} ${formData.city}`
                              : 'Any Location'}
                            {' - '}
                            {formData.distance}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Form */}
                    <div className="w-1/2 p-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900">{components.forms.AvailabilityForm.subTitle}</h2>
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="rounded-md text-gray-400 hover:text-gray-500"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="mt-6 space-y-8">
                        {/* Section 1 */}
                        <div>
                          <h3 className="text-base font-medium text-gray-900">{components.forms.AvailabilityForm.Section1.subTitle}</h3>
                          
                          {/* Dates subsection */}
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700">{components.forms.AvailabilityForm.Section1.HeadTitles[0]}</h4>
                            <div className="mt-2 space-y-4">
                              <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="dateType"
                                    value="single"
                                    checked={formData.dateType === 'single'}
                                    onChange={(e) => setFormData({ ...formData, dateType: 'single' })}
                                    className="h-4 w-4 text-sky-600"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">{components.forms.AvailabilityForm.Section1.formItems[0]}</span>
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="dateType"
                                    value="multiple"
                                    checked={formData.dateType === 'multiple'}
                                    onChange={(e) => setFormData({ ...formData, dateType: 'multiple' })}
                                    className="h-4 w-4 text-sky-600"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">{components.forms.AvailabilityForm.Section1.formItems[1]}</span>
                                </label>
                              </div>

                              {formData.dateType === 'single' ? (
                                <div className="relative">
                                  <input
                                    type="date"
                                    value={format(formData.singleDate, 'dd-MM-yyyy')}
                                    onChange={(e) => setFormData({ ...formData, singleDate: new Date(e.target.value) })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                  />
                                  <CalendarIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <div className="relative">
                                    <input
                                      type="date"
                                      value={format(formData.startDate, 'dd-MM-yyyy')}
                                      onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                    />
                                    <CalendarIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                  </div>
                                  <div className="relative">
                                    <input
                                      type="date"
                                      value={format(formData.endDate, 'dd-MM-yyyy')}
                                      onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                    />
                                    <CalendarIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Times subsection */}
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700">{components.forms.AvailabilityForm.Section1.HeadTitles[1]}</h4>
                            <div className="mt-2 grid grid-cols-2 gap-4">
                              <div className="relative">
                                <select
                                  value={formData.fromTime}
                                  onChange={(e) => setFormData({ ...formData, fromTime: e.target.value })}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                >
                                  {timeOptions.map((time) => (
                                    <option key={time} value={time}>
                                      {time}
                                    </option>
                                  ))}
                                </select>
                                <ClockIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                              </div>
                              <div className="relative">
                                <select
                                  value={formData.toTime}
                                  onChange={(e) => setFormData({ ...formData, toTime: e.target.value })}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                >
                                  {timeOptions.map((time) => (
                                    <option key={time} value={time}>
                                      {time}
                                    </option>
                                  ))}
                                </select>
                                <ClockIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section 2 */}
                        <div>
                          <h3 className="text-base font-medium text-gray-900">{components.forms.AvailabilityForm.Section2.HeadTitles[0]} & {components.forms.AvailabilityForm.Section2.HeadTitles[1]}</h3>
                          
                          {/* Category Preference */}
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700">{components.forms.AvailabilityForm.Section2.subTitles[0]}</h4>
                            <div className="mt-2 grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm text-gray-700">{components.forms.AvailabilityForm.Section2.formItems[0]}</label>
                                <div className="mt-1 space-y-2">
                                  {mainCategories.map((category) => (
                                    <label key={category} className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={formData.mainCategories.includes(category)}
                                        onChange={(e) => {
                                          const newCategories = e.target.checked
                                            ? [...formData.mainCategories, category]
                                            : formData.mainCategories.filter((c) => c !== category)
                                          setFormData({ ...formData, mainCategories: newCategories })
                                        }}
                                        className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                                      />
                                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm text-gray-700">{components.forms.AvailabilityForm.Section2.formItems[2]}</label>
                                <div className="mt-1 space-y-2">
                                  {subCategories.map((category) => (
                                    <label key={category} className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={formData.subCategories.includes(category)}
                                        onChange={(e) => {
                                          const newCategories = e.target.checked
                                            ? [...formData.subCategories, category]
                                            : formData.subCategories.filter((c) => c !== category)
                                          setFormData({ ...formData, subCategories: newCategories })
                                        }}
                                        className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                                      />
                                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Distance Preference */}
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700">{components.forms.AvailabilityForm.Section2.subTitles[1]}</h4>
                            <div className="mt-2 grid grid-cols-2 gap-4">
                              <div>
                                <select
                                  value={formData.addressType}
                                  onChange={(e) => {
                                    const newType = e.target.value as 'current' | 'different' | 'any'
                                    setFormData({
                                      ...formData,
                                      addressType: newType,
                                      distance: newType === 'any' ? '100 km' : formData.distance
                                    })
                                  }}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                >
                                  <option value="current">{components.forms.AvailabilityForm.Section2.formItems[2]}</option>
                                  <option value="different">{components.forms.AvailabilityForm.Section2.formItems[3]}</option>
                                  <option value="any">{components.forms.AvailabilityForm.Section2.formItems[4]}</option>
                                </select>
                              </div>
                              <div>
                                <select
                                  value={formData.distance}
                                  onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                                  disabled={formData.addressType === 'any'}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                >
                                  {distanceOptions.map((distance) => (
                                    <option key={distance} value={distance}>
                                      {distance}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {formData.addressType === 'different' && (
                              <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                  <input
                                    type="text"
                                    placeholder={components.forms.AvailabilityForm.Section2.placeholderTexts[2]}
                                    value={formData.street}
                                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    placeholder={components.forms.AvailabilityForm.Section2.placeholderTexts[0]}
                                    value={formData.houseNumber}
                                    onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    placeholder={components.forms.AvailabilityForm.Section2.placeholderTexts[1]}
                                    value={formData.postcode}
                                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    placeholder={components.forms.AvailabilityForm.Section2.placeholderTexts[3]}
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      {components.forms.AvailabilityForm.Buttons[0]}
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                    >
                      {components.forms.AvailabilityForm.Buttons[1]}
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Dialog open={showCancelModal} onClose={() => setShowCancelModal(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="mx-auto max-w-sm rounded-lg bg-white p-6">
            <h3 className="text-lg font-medium text-gray-900">{components.forms.AvailabilityForm.CancelModal.headText}</h3>
            <p className="mt-2 text-sm text-gray-500">
              {components.forms.AvailabilityForm.CancelModal.subText}
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                {components.forms.AvailabilityForm.Buttons[2]}
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                {components.forms.AvailabilityForm.Buttons[3]}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Dialog>
  )
}