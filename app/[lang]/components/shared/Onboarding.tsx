'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { getDictionary } from '../../dictionaries';

interface OnboardingDialogProps {
  onFreelancerSelected: () => void;
  onCompanySelected: () => void;
  lang: Locale
}

export default function OnboardingDialog({ onFreelancerSelected, onCompanySelected, lang }: OnboardingDialogProps) {
  const [components, setComponents] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDictionary = async () => {
      try {
        const dict = await getDictionary(lang);
        setComponents(dict.components);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dictionary:', error);
        setLoading(false);
      }
    };
    
    fetchDictionary();
  }, [lang]);

  if (loading || !components) {
    return (
      <Dialog open onClose={() => {}} className="fixed inset-0 z-10" as="div">
        <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <DialogPanel className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:max-w-lg sm:p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto"></div>
            <p className="mt-4 text-center text-gray-600">Loading...</p>
          </DialogPanel>
        </div>
      </Dialog>
    );
  }
    
  return (
    <Dialog open onClose={() => {}} className="fixed inset-0 z-10" as="div">
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <DialogPanel className="relative overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:max-w-lg sm:p-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-500">
            <UserCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
              {components.shared.OnboardingDialog.headTitle}
            </DialogTitle>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
              {components.shared.OnboardingDialog.subTitle}
              </p>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
              onClick={onCompanySelected }
            >
              {components.shared.OnboardingDialog.buttons[1]}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-sky-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              onClick={onFreelancerSelected}
            >
              {components.shared.OnboardingDialog.buttons[0]}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

