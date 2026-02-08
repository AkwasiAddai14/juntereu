'use client'

import { useState, Fragment } from 'react';
import { createLead } from '@/app/lib/actions/lead.actions';
import { XMarkIcon, CheckCircleIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react';

/** Shape returned by /api/kvk */
interface KvkApiResponse {
  companyName: string
  streetName: string
  houseNumber: string
  houseNumberAddition: string
  houseLetter: string
  postalCode: string
  place: string
}

/** Display shape for company info in the modal */
interface KvkData {
  bedrijfsnaam: string
  adres: string
  stad: string
}

export default function PartnerModal({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
  const [step, setStep] = useState('form') // 'form' of 'success'
  const [loadingKvk, setLoadingKvk] = useState(false)
  const [kvkData, setKvkData] = useState<KvkData | null>(null)
  const [kvkError, setKvkError] = useState<string | null>(null)
  
  // State voor formulier velden
  const [formData, setFormData] = useState({
    voornaam: '',
    tussenvoegsel: '',
    achternaam: '',
    email: '',
    telefoon: '',
    kvk: '',
    btw: '',
    iban: '',
  })

  // Update formulier data
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const fetchKvkData = async () => {
    const kvk = formData.kvk.replace(/\D/g, '')
    if (kvk.length !== 8) {
      setKvkData(null)
      setKvkError(null)
      return
    }

    setLoadingKvk(true)
    setKvkError(null)
    setKvkData(null)

    try {
      const res = await fetch(`/api/kvk?kvkNummer=${encodeURIComponent(kvk)}`)
      const data = await res.json()

      if (!res.ok) {
        setKvkData(null)
        setKvkError(data?.error ?? 'Kon bedrijfsgegevens niet ophalen.')
        return
      }

      const api = data as KvkApiResponse
      const adresParts = [
        api.streetName,
        [api.houseNumber, api.houseNumberAddition, api.houseLetter].filter(Boolean).join(''),
        api.postalCode,
        api.place
      ].filter(Boolean)
      setKvkData({
        bedrijfsnaam: api.companyName || 'Onbekend bedrijf',
        adres: adresParts.join(', '),
        stad: api.place || ''
      })
    } catch {
      setKvkData(null)
      setKvkError('Ophalen van KVK-gegevens mislukt.')
    } finally {
      setLoadingKvk(false)
    }
  }


  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      setStep('form')
      setKvkData(null)
      setKvkError(null)
      setFormData({
        voornaam: '', tussenvoegsel: '', achternaam: '',
        email: '', telefoon: '', kvk: '', btw: '', iban: ''
      })
    }, 500)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map je formulier data naar het formaat dat Zod verwacht
    const leadDataForServer = {
        companyName: kvkData?.bedrijfsnaam || 'Onbekend Bedrijf', // Gebruik KVK data indien beschikbaar
        kvkNumber: formData.kvk,
        contactPersonFirstname: formData.voornaam,
        contactPersonLastname: formData.achternaam,
        // Tussenvoegsel eventueel samenvoegen met achternaam of apart veld in model maken
        contactEmail: formData.email,
        contactPhone: formData.telefoon,
        // notes, etc... kun je toevoegen als je formulier die velden krijgt
    };

    try {
        // Roep de Server Action aan
        await createLead({ formData: leadDataForServer });
        
        // Als succesvol, ga naar succes scherm
        setStep('success');
        console.log('Lead succesvol verzonden naar de server!');
    } catch (error: any) {
        console.error('Fout bij verzenden lead:', error.message);
        // Hier zou je een error state aan je UI kunnen toevoegen om de gebruiker te informeren
        alert(`Er is iets misgegaan: ${error.message}`);
    }
};

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-2xl bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                
                {/* Sluit knop */}
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Sluiten</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* --- FASE 1: FORMULIER --- */}
                {step === 'form' && (
                  <form onSubmit={handleSubmit}>
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 sm:mx-0 sm:h-10 sm:w-10">
                        <BuildingOfficeIcon className="h-6 w-6 text-sky-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                        <DialogTitle as="h3" className="text-xl font-semibold leading-6 text-gray-900">
                          Partner worden
                        </DialogTitle>
                        <p className="mt-2 text-sm text-gray-500">
                          Vul je gegevens in om je aan te melden. 
                        </p>

                        {/* Input Grid */}
                        <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-6">
                          
                          {/* Naam Sectie */}
                          <div className="sm:col-span-2">
                            <label htmlFor="voornaam" className="block text-sm font-medium leading-6 text-gray-900">Voornaam</label>
                            <input type="text" name="voornaam" required value={formData.voornaam} onChange={handleChange} className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                          </div>
                          <div className="sm:col-span-2">
                            <label htmlFor="tussenvoegsel" className="block text-sm font-medium leading-6 text-gray-900">Tussenv.</label>
                            <input type="text" name="tussenvoegsel" value={formData.tussenvoegsel} onChange={handleChange} className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                          </div>
                          <div className="sm:col-span-2">
                            <label htmlFor="achternaam" className="block text-sm font-medium leading-6 text-gray-900">Achternaam</label>
                            <input type="text" name="achternaam" required value={formData.achternaam} onChange={handleChange} className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                          </div>

                          {/* Contact Sectie */}
                          <div className="sm:col-span-3">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">E-mailadres</label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                          </div>
                          <div className="sm:col-span-3">
                            <label htmlFor="telefoon" className="block text-sm font-medium leading-6 text-gray-900">Telefoonnummer</label>
                            <input type="tel" name="telefoon" required value={formData.telefoon} onChange={handleChange} className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                          </div>

                          {/* Zakelijke Sectie */}
                          <div className="sm:col-span-6 relative">
                            <label htmlFor="kvk" className="block text-sm font-medium leading-6 text-gray-900">KVK Nummer</label>
                            <div className="relative mt-1">
                                <input 
                                    type="text" 
                                    name="kvk" 
                                    required 
                                    value={formData.kvk} 
                                    onChange={handleChange} 
                                    onBlur={fetchKvkData} // Trigger API bij verlaten veld
                                    className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" 
                                    placeholder="12345678"
                                />
                                {loadingKvk && (
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <svg className="animate-spin h-5 w-5 text-sky-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                )}
                            </div>
                          </div>

                          {/* KVK RESULTAAT WEERGAVE */}
                          {kvkError && (
                            <div className="sm:col-span-6 rounded-md bg-red-50 p-3 ring-1 ring-inset ring-red-200">
                              <p className="text-sm text-red-700">{kvkError}</p>
                            </div>
                          )}
                          {kvkData && (
                            <div className="sm:col-span-6 rounded-md bg-sky-50 p-3 ring-1 ring-inset ring-sky-200">
                              <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                  <CheckCircleIcon className="h-5 w-5 text-sky-500" aria-hidden="true" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-sky-900">{kvkData.bedrijfsnaam}</p>
                                  {kvkData.adres && (
                                    <p className="mt-1 text-sm text-sky-700">{kvkData.adres}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="sm:col-span-3">
                            <label htmlFor="btw" className="block text-sm font-medium leading-6 text-gray-900">BTW ID</label>
                            <input type="text" name="btw" placeholder="NL..." required value={formData.btw} onChange={handleChange} className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                          </div>
                          <div className="sm:col-span-3">
                            <label htmlFor="iban" className="block text-sm font-medium leading-6 text-gray-900">IBAN Nummer</label>
                            <input type="text" name="iban" placeholder="NL..." required value={formData.iban} onChange={handleChange} className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                          </div>

                        </div>
                      </div>
                    </div>
                    <div className="mt-8 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 sm:ml-3 sm:w-auto"
                      >
                        Aanmelden
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={handleClose}
                      >
                        Annuleren
                      </button>
                    </div>
                  </form>
                )}

                {/* --- FASE 2: SUCCES MELDING --- */}
                {step === 'success' && (
                  <div className="text-center py-6">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                      <CheckCircleIcon className="h-10 w-10 text-green-600" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-gray-900">Aanvraag ontvangen!</h3>
                    <p className="mt-4 text-gray-500 max-w-sm mx-auto">
                      Bedankt voor je aanmelding, <strong>{formData.voornaam}</strong>. 
                      <br /><br />
                      We hebben je gegevens in goede orde ontvangen. Je ontvangt binnen enkele minuten een e-mail met verdere instructies en je inloggegevens voor het partner portal.
                    </p>
                    <div className="mt-8">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 sm:w-auto"
                      >
                        Sluiten en terugkeren
                      </button>
                    </div>
                  </div>
                )}

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}