"use client";

import React, { useState, useEffect, } from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { VacancyValidation } from '@/app/lib/validations/vacancy';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import "react-datepicker/dist/react-datepicker.css";
import { FileUploader } from '@/app/[lang]/components/shared/FileUploader';
import { useUploadThing } from '@/app/lib/uploadthing';
import DatePicker from 'react-datepicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/nl';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { IVacancy } from '@/app/lib/models/vacancy.model';
import { createVacature } from '@/app/lib/actions/vacancy.actions';
import { fetchBedrijfDetails } from "@/app/lib/actions/employer.actions";
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';

const steps = [
  { id: 1, name: 'Vacature details', fields: ['titel', 'functie', 'beschrijving', 'adres', 'kledingsvoorschriften', 'vaardigheden', 'afbeelding'] },
  { id: 2, name: 'Adres', fields: ['postcode', 'huisnummer', 'straatnaam', 'stad'] },
  { id: 3, name: 'Data', fields: ['begindatum', 'einddatum', 'begintijd', 'eindtijd'] },
  { id: 4, name: 'Uurloon', fields: ['uurloon', 'toeslag', 'toeslagtype', 'toeslagpercentage'] },
  { id: 5, name: 'Compleet' }
];

type Inputs = z.infer<typeof VacancyValidation>;

type FieldName = keyof Inputs;

interface Props {
  vacature: {
    vactureID: any;
    afbeelding: string;
    titel: string;
    functie: string;
    adres: string;
    beschrijving: string;
    kledingsvoorschriften: string;
    vaardigheden: string;
    begindatum: string;
    einddatum: string;
    begintijd: string;
    uurloon: number;
    eindtijd: string;
    toeslag: boolean;
    toeslagtype: number;
    toeslagpercentage: number
  };
}

type VacatureFormProps = {
  userId: string;
  type: "maak" | "update";
  vacature?: IVacancy;
  vacatureId?: string;
};

const  VacatureForm = async ({ userId, type, vacature, vacatureId }: VacatureFormProps, { lang }: { lang: Locale }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const router = useRouter();
  const { startUpload } = useUploadThing("media");
  const pathname = usePathname();
  const {user, isLoaded} = useUser()
  const [loading, setLoading] = useState(false);
  const [werktijden, setWerktijden] = useState([
    { begintijd: "", eindtijd: "", pauze: 0 },
  ]);
  const [showToeslagFields, setShowToeslagFields] = useState(false);
  const [toeslagType, setToeslagType] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date('2025-01-01'));
  const [endDate, setEndDate] = useState<Date | null>(new Date('2025-01-01'));
  const [bedrijfDetails, setBedrijfDetails] = useState<any>(null);
  const { components } = await getDictionary(lang);

  const steps = components.forms.VacancyForm.steps.map(step => ({
    id: step.id,
    name: step.name,
    fields: step.fields || []
  }));

  useEffect(() => {
    if (userId) {
      fetchBedrijfDetails(userId)
        .then((details) => {
          setBedrijfDetails(details);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userId]);

  const voegWerktijdToe = () => {
    setWerktijden([...werktijden, { begintijd: "", eindtijd: "", pauze: 0 }]);
  };

  // Functie om een werktijd aan te passen
  const werkWerktijdBij = (index: number, field: string, value: string | number) => {
    const nieuweWerktijden = [...werktijden];
    nieuweWerktijden[index] = { ...nieuweWerktijden[index], [field]: value };
    setWerktijden(nieuweWerktijden);
  };

  // Functie om een werktijd te verwijderen
  const verwijderWerktijd = (index: number) => {
    const nieuweWerktijden = werktijden.filter((_, i) => i !== index);
    setWerktijden(nieuweWerktijden);
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    setValue,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(VacancyValidation),
    defaultValues: {
     image: '',
     title: '',
     function: '',
     description: '',
     skills: '',
     dresscode: "zwarte broek, zwarte schoenen",
     startingDate: new Date('01-01-2025'),
     endingDate: new Date('01-01-2025'),
     starting: '12:00',
     ending: '20:00',
     hourlyRate: 12,
     surcharge: false,
     surchargetype: 0,
     surchargepercentage:100,
    }
  });

  const selectedToeslagType = watch("surchargetype");

const nextStep = async () => {
  console.log("Current Step Before: ", currentStep);
  const fields = steps[currentStep].fields;
  const output = await trigger(fields as FieldName[], { shouldFocus: true });
  console.log("Validation Output: ", output);
  console.log(errors);

  if (!output) return;

  setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  console.log("Current Step After: ", currentStep);
};

const prevStep = () => {
  setPreviousStep(currentStep);
  setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
};

const delta = currentStep - previousStep;

const processForm: SubmitHandler<Inputs> = async (data) => {
  try {
    // Je zou de data kunnen mappen naar het juiste formaat voor de createVacature functie
    const vacatureInput = {
      opdrachtgever: bedrijfDetails?._id ?? "", // Bedrijf ID
      titel: data.title, // Titel van de vacature
      opdrachtgeverNaam: bedrijfDetails?.opdrachtgeverNaam ?? "", // Naam van het bedrijf
      functie: data.function, // Functienaam
      afbeelding: data.image, // Afbeelding die bij de vacature hoort (bijv. logo van het bedrijf)
      uurloon: data.hourlyRate, // Uurloon voor de functie
      adres: {
        huisnummer: data.housenumber,
        postcode: data.postcode,
        straatnaam: street ?? data.street,
        stad: city ?? data.city,
      }, // Adres van de werkplek
      begindatum: new Date(data.startingDate), // Startdatum van de functie
      einddatum: new Date(data.endingDate), // Einddatum van de functie
      tijden: werktijden,
      beschrijving: data.description, // Algemene beschrijving van de functie
      vaardigheden: Array.isArray(data.skills) ? data.skills : data.skills ? data.skills.split(',') : [], // Vaardigheden, controleer of het een array is
      kledingsvoorschriften: Array.isArray(data.dresscode) ? data.dresscode : data.dresscode ? data.dresscode.split(',') : [], // Kledingsvoorschriften, controleer of het een array is
      toeslagen: [{
      toeslag: data.surcharge,
      toeslagType: data.surchargetype,
      toeslagPercentage: data.surchargepercentage,
      toeslagVan: data.surchargeVan,
      toeslagTot: data.surchargeTot,
    }]
    };

    // Roep de createVacature functie aan om de vacature op te slaan
    const nieuweVacature = await createVacature(vacatureInput);
    console.log('Vacature succesvol aangemaakt:', nieuweVacature);
  } catch (error) {
    console.error('Fout bij het aanmaken van de vacature:', error);
  }
};

if (loading) {
  return  <div>Loading...</div>
}

return (
  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
  <main>
    <section className="flex flex-col justify-between p-24">
      <nav aria-label="Progress">
        <ol role="list" className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative md:flex md:flex-1">
              {currentStep > stepIdx ? (
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-600 group-hover:bg-sky-600">
                    <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-900">{step.name}</span>
                </span>
              ) : currentStep === stepIdx ? (
                <div className="flex items-center px-6 py-4 text-sm font-medium" aria-current="step">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-sky-600">
                    <span className="text-sky-600">{step.id}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-sky-600">{step.name}</span>
                </div>
              ) : (
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
                    <span className="text-gray-500">{step.id}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-500">{step.name}</span>
                </span>
              )}

              {stepIdx !== steps.length - 1 && (
                <div className="absolute top-0 right-0 hidden h-full w-5 md:block" aria-hidden="true">
                  <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentColor"
                      strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <form onSubmit={handleSubmit(processForm)} className="relative my-8  items-center rounded-lg bg-white shadow-lg ring-1 ring-black/5">
      
      {currentStep === 0 && (
            <>
              <motion.div
                initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }} 
              >
                <div className="px-8 space-y-12 sm:space-y-16">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 mt-10 text-gray-900">{components.forms.VacancyForm.titles[0].headTitle}</h2>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                      {components.forms.VacancyForm.titles[0].subTitle}
                    </p>
                    <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">

                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label htmlFor="titel" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          {components.forms.VacancyForm.formItems[0]}
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            {...register('title', { required: true })}
                            id="titel"
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                          {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
                        </div>
                      </div>


                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label htmlFor="functie" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          {components.forms.VacancyForm.formItems[1]}
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            {...register('function', { required: true })}
                            id="functie"
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                          {errors.function && <p className="mt-2 text-sm text-red-600">{errors.function.message}</p>}
                        </div>
                      </div>

                      <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="beschrijving" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                        {components.forms.VacancyForm.formItems[2]}
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                        <textarea
                          {...register('description')}
                          id="beschrijving"
                          rows={4}
                          className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                        {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
                      </div>
                    </div>
                  </div>

                    <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="afbeelding" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                       {components.forms.VacancyForm.formItems[3]}
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <FileUploader
                        onFieldChange={(uploadedUrl: string) => setValue('image', uploadedUrl, { shouldValidate: true })}
                        imageUrl={watch('image') || ''}
                        setFiles={setFiles}
                      />  
                        {errors.image && <p className="mt-2 text-sm text-red-600">{errors.image.message}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label htmlFor="vaardigheden" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          {components.forms.VacancyForm.formItems[4]}
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            {...register('skills', { required: true })}
                            id="vaardigheden"
                            placeholder={components.forms.VacancyForm.placeholderTexts[0]}
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                          {errors.skills && <p className="mt-2 text-sm text-red-600">{errors.skills.message}</p>}
                        </div>
                      </div>


                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label htmlFor="kledingsvoorschriften" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          {components.forms.VacancyForm.formItems[5]}
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            {...register('dresscode', { required: true })}
                            id="kledingsvoorschriften"
                            placeholder={components.forms.VacancyForm.placeholderTexts[1]}
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                          {errors.dresscode && <p className="mt-2 text-sm text-red-600">{errors.dresscode.message}</p>}
                        </div>
                      </div>

                    </div>
               </div>
                </div>
              </motion.div>
            </>
          )}

{currentStep === 1 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-8 space-y-12 sm:space-y-16">
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 mt-10 text-gray-900">{components.forms.VacancyForm.titles[1].headTitle}</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                    {components.forms.VacancyForm.titles[1].subTitle}
                  </p>
                  <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="huisnummer" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                        {components.forms.VacancyForm.locatie.fieldLabels[0]}
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          {...register('housenumber', { required: true })}
                          id="huisnummer"
                          className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                        {errors.housenumber && <p className="mt-2 text-sm text-red-600">{errors.housenumber.message}</p>}
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="postcode" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                      {components.forms.VacancyForm.locatie.fieldLabels[1]}
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          {...register('postcode', { required: true })}
                          id="postcode"
                          className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                        {errors.postcode && <p className="mt-2 text-sm text-red-600">{errors.postcode.message}</p>}
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="stad" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                      {components.forms.VacancyForm.locatie.fieldLabels[2]}
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          {...register('city', { required: true })}
                          id="stad"
                          className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                        {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>}
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="straatnaam" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                      {components.forms.VacancyForm.locatie.fieldLabels[3]}
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          {...register('street', { required: true })}
                          id="straatnaam"
                          className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                        />
                        {errors.street && <p className="mt-2 text-sm text-red-600">{errors.street.message}</p>}
                      </div>
                    </div>

                  </div>

                  </div>
                </div>
              </motion.div>
          )}


{currentStep === 2 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-8 space-y-12 sm:space-y-16">
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 mt-10 text-gray-900">{components.forms.VacancyForm.titles[2].headTitle}</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                    {components.forms.VacancyForm.titles[2].subTitle}
                  </p>
                  <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                  <h1 className="text-lg font-bold">{components.forms.VacancyForm.data.fieldLabels[0]}</h1>

                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                  </svg>
                    <p className="whitespace-nowrap text-grey-600">{components.forms.VacancyForm.data.fieldLabels[1]}</p>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="dd/MM/yyyy"
                      wrapperClassName="datePicker"
                      />
                  </div>


                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                  </svg>

                    <p className="whitespace-nowrap text-grey-600">{components.forms.VacancyForm.data.fieldLabels[2]}</p>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      dateFormat="dd/MM/yyyy"
                      wrapperClassName="datePicker"
                    />
                  </div>

{werktijden.map((werktijd, index) => (
  <div key={index} className="flex flex-wrap items-center gap-4 border p-4 rounded-lg">
    <div className="flex flex-col">
      <label htmlFor={`begintijd-${index}`} className="text-sm font-medium">
      {components.forms.VacancyForm.data.fieldLabels[3]}
      </label>
      <input
        type="time"
        id={`begintijd-${index}`}
        value={werktijd.begintijd}
        onChange={(e) => werkWerktijdBij(index, "begintijd", e.target.value)}
        className="border rounded px-2 py-1"
        required
      />
    </div>

    <div className="flex flex-col">
      <label htmlFor={`eindtijd-${index}`} className="text-sm font-medium">
      {components.forms.VacancyForm.data.fieldLabels[4]}
      </label>
      <input
        type="time"
        id={`eindtijd-${index}`}
        value={werktijd.eindtijd}
        onChange={(e) => werkWerktijdBij(index, "eindtijd", e.target.value)}
        className="border rounded px-2 py-1"
        required
      />
    </div>

    <div className="flex flex-col">
      <label htmlFor={`pauze-${index}`} className="text-sm font-medium">
      {components.forms.VacancyForm.data.fieldLabels[5]}
      </label>
      <input
        type="number"
        id={`pauze-${index}`}
        value={werktijd.pauze}
        onChange={(e) => werkWerktijdBij(index, "pauze", parseInt(e.target.value))}
        className="border rounded px-2 py-1"
        min={0}
      />
    </div>

    <button
      type="button"
      onClick={() => verwijderWerktijd(index)}
      className="text-red-600 hover:underline"
    >
      {components.forms.VacancyForm.data.buttons[0]}
    </button>
  </div>
))}

<button
  type="button"
  onClick={voegWerktijdToe}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
{components.forms.VacancyForm.data.buttons[1]}
</button>

<button
  type="submit"
  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
>
{components.forms.VacancyForm.data.buttons[2]}
</button>

                  </div>

                  </div>
                </div>
              </motion.div>
          )}

{currentStep === 3 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-8 space-y-12 sm:space-y-16">
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 mt-10 text-gray-900">{components.forms.VacancyForm.titles[3].headTitle}</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                  {components.forms.VacancyForm.titles[3].subTitle}
                  </p>

                  <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                  <div className="mt-10 space-y-8 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="uurloon"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  {components.forms.VacancyForm.salaris.fieldLabels[0]}
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0">
                  <input
                    type="number"
                    {...register("hourlyRate", { required: "uurloon is verplicht" })}
                    id="brutoloon"
                    className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  {errors.hourlyRate && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.hourlyRate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Toeslag Toggle */}
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="toeslagToggle"
                  className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >
                  {components.forms.VacancyForm.salaris.fieldLabels[1]}
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0 flex items-center">
                  <input
                    type="checkbox"
                    id="toeslagToggle"
                    {...register("surcharge")}
                    onChange={(e) => setShowToeslagFields(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
                  />
                  <label
                    htmlFor="toeslagToggle"
                    className="ml-2 text-sm text-gray-600"
                  >
                    {components.forms.VacancyForm.salaris.fieldLabels[2]}
                  </label>
                </div>
              </div>

              {/* Toeslagvelden */}
              {showToeslagFields && (
                <div className="space-y-4">
                  {/* Type Toeslag */}
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="toeslagType"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      {components.forms.VacancyForm.salaris.fieldLabels[3]}
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <select
                        {...register("surchargetype", { required: true })}
                        id="toeslagType"
                        className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                        onChange={(e) => setToeslagType(e.target.value)}
                      >
                        <option value="">{components.forms.VacancyForm.salaris.fieldLabels[4]}</option>
                        <option value="doordeweeks">{components.forms.VacancyForm.salaris.typeToeslag[0]}</option>
                        <option value="zaterdag">{components.forms.VacancyForm.salaris.typeToeslag[1]}</option>
                        <option value="zon_en_feestdagen">
                        {components.forms.VacancyForm.salaris.typeToeslag[2]}
                        </option>
                      </select>
                      {errors.surchargetype && (
                        <p className="mt-2 text-sm text-red-600">
                          {components.forms.VacancyForm.salaris.fieldLabels[5]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Percentage Toeslag */}
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label
                      htmlFor="toeslagPercentage"
                      className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    >
                      {components.forms.VacancyForm.salaris.percentageToeslag[4]}
                    </label>
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <select
                        {...register("surchargepercentage", { required: true })}
                        id="toeslagPercentage"
                        className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">{components.forms.VacancyForm.salaris.fieldLabels[4]}</option>
                        <option value="125">{components.forms.VacancyForm.salaris.percentageToeslag[0]}</option>
                        <option value="150">{components.forms.VacancyForm.salaris.percentageToeslag[1]}</option>
                        <option value="200">{components.forms.VacancyForm.salaris.percentageToeslag[2]}</option>
                      </select>
                    </div>
                  </div>

                  {/* Tijdinstellingen */}
                  {toeslagType !== "zon_en_feestdagen" || "zaterdag" && (
                    <>
                      {/* Van tijd */}
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label
                          htmlFor="toeslagVan"
                          className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                        >
                          {components.forms.VacancyForm.salaris.fieldLabels[6]}
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="time"
                            {...register("surchargeVan", { required: true })}
                            id="toeslagVan"
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      {/* Tot tijd */}
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label
                          htmlFor="toeslagTot"
                          className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                        >
                          {components.forms.VacancyForm.salaris.fieldLabels[7]}
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="time"
                            {...register("surchargeTot", { required: true })}
                            id="toeslagTot"
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
                  </div>
                    </div>
              </div>
            </motion.div>
          )}

      {currentStep === 3 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-8 space-y-7 sm:space-y-16">
                <h2 className="text-base font-semibold leading-7 text-gray-900 pt-10">{components.forms.EmployeeForm.compleet}</h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                  {components.forms.EmployeeForm.final_page_header}
                </p>
              </div>
            </motion.div>
          )}

<div className="mt-8 pb-10 pr-10 flex justify-end space-x-4">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              {components.forms.VacancyForm.buttons[0]}
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              {components.forms.VacancyForm.buttons[1]}
            </button>
          )}
          {currentStep === steps.length - 1 && (
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
      >
        {components.forms.VacancyForm.buttons[2]}
      </button>
    )}
        </div>
        </form>
      </section>
    </main>
    </LocalizationProvider>
  );
}

export default VacatureForm;