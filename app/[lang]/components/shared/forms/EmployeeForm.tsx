"use client";

import { z } from 'zod';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import DatePicker from 'react-datepicker';
import { CheckIcon } from '@radix-ui/react-icons';
import React, { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { zodResolver } from '@hookform/resolvers/zod';
import { useUploadThing } from '@/app/lib/uploadthing';
import { useForm, SubmitHandler } from 'react-hook-form';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { createEmployeeValidation } from '@/app/lib/validations/employee';
import { createEmployee } from '@/app/lib/actions/employee.actions';
import { FileUploader } from '@/app/[lang]/components/shared/FileUploader';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys



const steps = [
  { id: 1, name: 'Persoonlijke gegevens', fields: ['firstname', 'infix', 'lastname', 'dateOfBirth', 'country', 'SocialSecurity'] },
  { id: 2, name: 'Zakelijke gegevens', fields: ['companyRegistrationNumber', 'VATidnr', 'iban', 'housenumber', 'postcode', 'street', 'city'] },
  { id: 3, name: 'Profiel', fields: ['profilephoto', 'bio', 'cv'] },
  { id: 4, name: 'Compleet' }
];

const countries = [
  { name: 'United Kingdom', id: "VerenigdKoninkrijk", icon: '🇬🇧' },
  { name: 'Nederland', id: "Nederland",  icon: '🇳🇱' },
  { name: 'France', id: "Frankrijk",  icon: '🇫🇷' },
  { name: 'Italia', id: "Italie",  icon: '🇮🇹' },
  { name: 'België/Bégique', id: "Belgie",  icon: '🇧🇪' },
  { name: 'Österreich', id: "Oostenrijk",  icon: '🇦🇹' },
  { name: 'España', id: "Spanje", icon: '🇪🇸' },
  { name: 'Portugal', id: "Portugal", icon: '🇵🇹' },
  { name: 'Deutschland', id: "Duitsland", icon: '🇩🇪' },
  { name: 'Sverige', id: "Zweden",  icon: '🇸🇪' },
  { name: 'Danmark', id: "Denemarken",  icon: '🇩🇰' },
  { name: 'Norge', id: "Noorwegen",  icon: '🇳🇴' },
  { name: 'Suomi', id: "Finland",  icon: '🇫🇮' },
  { name: 'Suisse', id: "Zwitserland", icon: '🇨🇭' }
]

type Inputs = z.infer<typeof createEmployeeValidation>;

type Props = {
  lang: Locale;
  userId: string;
  user: any;
  components: any;
};


const EmployeeForm = ({ lang, userId, user, components }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const router = useRouter();
  const { startUpload } = useUploadThing("media");
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  

  const steps = components.forms.EmployeeForm.steps.map((step: { id: string; name: any; fields: any; }) => ({
    id: parseInt(step.id),
    name: step.name,
    fields: step.fields || []
  }));

  const fetchAddressData = async (postcode: string, housenumber: string) => {
    try {
      const url = `/api/postcode?postcode=${postcode}&huisnummer=${housenumber}`;
  
      const response = await axios.get(url);
  
      const { street, city } = response.data;
  
      setStreet(street);
      setCity(city);
  
      setValue('street', street);
      setValue('city', city);
    } catch (error) {
      console.error('Error fetching address data:', error);
    }
  };

  type FieldName = keyof Inputs;

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

  const getUserPhoneNumber = (user: any) => {
    if (user?.primaryPhoneNumber) {
      return user.primaryPhoneNumber;
    }
    
    const primaryPhone = user?.phoneNumbers?.find(
      (phoneNumber: any) => phoneNumber.id === user?.primaryPhoneNumberId
    );
  
    return primaryPhone?.primaryPhoneNumber || "";
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
    resolver: zodResolver(createEmployeeValidation),
    defaultValues: {
      employeeId:  user?.id || "",
      profilephoto: user?.imageUrl || "",
      country: "United Kingdom",
      firstname:  user?.firstName || user?.fullName || "",
      infix:  "",
      lastname:  user?.lastName ||"",
      dateOfBirth:  new Date("01/01/2000"),
      email:  user?.emailAddresses[0].emailAddress || "" ,
      phone:  getUserPhoneNumber(user) || "",
      VATidnr:  "",
      iban:  "",
      bio: ""
    }
  });

  useEffect(() => {
    const fetchDetails = async () => {
      const postcode = watch('postcode');
      const housenumber = watch('housenumber');
      if (postcode && housenumber) {
        await fetchAddressData(postcode, housenumber);
      }
    };
  
    fetchDetails();
  }, [watch('postcode'), watch('housenumber')]);

  const selectedDate = watch('dateOfBirth') as unknown as Date | undefined;

  const processForm: SubmitHandler<Inputs> = async (data) => {

    let uploadedImageUrl = data.profilephoto;

// Check if there are files to upload
if (files.length > 0) {
  try {
    // Start the upload and wait for the response
    const uploadedImages = await startUpload(files);

    // Check if the upload was successful
    if (!uploadedImages || uploadedImages.length === 0) {
      console.error('Failed to upload images');
      return;
    }

    // Use the URL provided by the upload service
    uploadedImageUrl = uploadedImages[0].url;
    console.log("Final URL:", uploadedImageUrl);
  } catch (error) {
    console.error('Error uploading image:', error);
    return;
  }
}
    setLoading(true)
    user?.update({
      unsafeMetadata: { country: data.country },
    })
    await createEmployee({


      clerkId: user?.id || "0000",
      firstname: data.firstname || user?.firstName || user?.fullName ||"",
      infix: data.infix || "",
      lastname: data.lastname || user?.lastName || "",
      dateOfBirth: data.dateOfBirth || new Date("01/01/2000"),
      country: data.country,
      email: data.email ||  user?.emailAddresses[0].emailAddress || "",
      phone: data.phone || getUserPhoneNumber(user) || "",
      postcode: data.postcode || "",
      housenumber: data.housenumber || "",
      street: data.street || "",
      city: data.city,
      SalaryTaxDiscount: false,
      taxBenefit: false,
      VATidnr: data.VATidnr || "",
      iban: data.iban || "",
      onboarded: false,
      profilephoto: data.profilephoto || user?.imageUrl,
      experience: [], // Pass an empty array
      skills: [], // Pass an empty array
      education: [], // Pass an empty array
      bio: data.bio || "",
      companyRegistrationNumber: data.companyRegistrationNumber || '',
      SocialSecurity: ""  // Ensure bsn is provided
    });
    setLoading(false)
    router.push("../dashboard")
  };

  if (loading) {
    return  <div>Loading...</div>
  }

  return (
    <main>
      <section className="flex flex-col justify-between p-24">
        <nav aria-label="Progress">
          <ol role="list" className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
            {steps.map((step : { id: any; name: any; fields: any; }, stepIdx: number) => (
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
                    <h2 className="text-base font-semibold leading-7 mt-10 text-gray-900">{components.forms.EmployeeForm.headTitle}</h2>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                      {components.forms.EmployeeForm.subTtitle}
                    </p>
                    <div className="mt-10 space-y-8 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          {components.forms.EmployeeForm.Location}
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <div className="relative">
                            <select
                              id="country"
                              {...register('country', { required: true })}
                              className="block w-full appearance-none rounded-md border-0 py-1.5 pl-3 pr-8 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                            >
                              {countries.map((country) => (
                                <option key={country.name} value={country.name}>
                                  {country.icon} {country.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDownIcon
                              className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                              aria-hidden="true"
                            />
                          </div>
                          {errors.country && <p className="mt-2 text-sm text-red-600">{errors.country.message}</p>}
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label htmlFor="voornaam" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          {components.forms.EmployeeForm.formItems[0]}
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            {...register('firstname', { required: true })}
                            id="voornaam"
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                          {errors.firstname && <p className="mt-2 text-sm text-red-600">{errors.firstname.message}</p>}
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label htmlFor="infix" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          {components.forms.EmployeeForm.formItems[1]}
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            {...register('infix')}
                            id="tussenvoegsel"
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                        </div>
                      </div>
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label htmlFor="lastname" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                          {components.forms.EmployeeForm.formItems[2]}
                        </label>
                        <div className="mt-2 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            {...register('lastname', { required: true })}
                            id="achternaam"
                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                          {errors.lastname && <p className="mt-2 text-sm text-red-600">{errors.lastname.message}</p>}
                        </div>
                      </div>

                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                      {components.forms.EmployeeForm.formItems[3]}
                    <p className="text-sm text-slate-400">(MM/dd/yyyy)</p>
                    </label>
                    
                    <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <DatePicker
                        selected={selectedDate} // Assign selectedDate or null to the selected attribute
                        onChange={(date: Date | null) => setValue('dateOfBirth', date as Date, { shouldValidate: true })} // Update the form state
                        dateFormat="MM/dd/yyyy"
                        wrapperClassName="datePicker"
                      />
                      {errors.dateOfBirth && <p className="mt-2 text-sm text-red-600">{errors.dateOfBirth.message}</p>}
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
                  <h2 className="text-base font-semibold leading-7 mt-10 text-gray-900">{components.forms.EmployeeForm.head2Title}</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                    {components.forms.EmployeeForm.sub2Title}
                  </p>
                  <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="btwid" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                        {components.forms.EmployeeForm.formItems[8]}
                      </label>
                      <p className="text-sm text-slate-400">({components.forms.CompanyForm.optioneel})</p>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          {...register('VATidnr', { required: true })}
                          id="btwid"
                          className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                        {errors.VATidnr && <p className="mt-2 text-sm text-red-600">{errors.VATidnr.message}</p>}
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="iban" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                      {components.forms.EmployeeForm.formItems[9]}
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          {...register('iban', { required: true })}
                          id="iban"
                          className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                        {errors.iban && <p className="mt-2 text-sm text-red-600">{errors.iban.message}</p>}
                      </div>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="huisnummer" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                      {components.forms.EmployeeForm.formItems[4]}
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
                      {components.forms.EmployeeForm.formItems[5]}
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
                      {components.forms.EmployeeForm.formItems[7]}
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
                      {components.forms.EmployeeForm.formItems[6]}
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          {...register('street', { required: true })}
                          id="street"
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
                  <h2 className="text-base font-semibold leading-7 mt-10 text-gray-900">{components.forms.EmployeeForm.head3Title}</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                    {components.forms.EmployeeForm.sub3Title}
                  </p>

                  <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="profielfoto" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                        {components.forms.EmployeeForm.formItems[11]}
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                      <FileUploader
                        onFieldChange={(uploadedUrl: string) => setValue('profilephoto', uploadedUrl, { shouldValidate: true })}
                        imageUrl={watch('profilephoto') || ''}
                        setFiles={setFiles}
                      />  
                        {errors.profilephoto && <p className="mt-2 text-sm text-red-600">{errors.profilephoto.message}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 space-y-8  pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                      <label htmlFor="bio" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                        {components.forms.EmployeeForm.formItems[10]}
                      </label>
                      <div className="mt-2 sm:col-span-2 sm:mt-0">
                        <textarea
                          {...register('bio')}
                          id="bio"
                          rows={4}
                          className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6" />
                        {errors.bio && <p className="mt-2 text-sm text-red-600">{errors.bio.message}</p>}
                      </div>
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
             {components.forms.EmployeeForm.buttons[0]}
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              {components.forms.EmployeeForm.buttons[1]}
            </button>
          )}
          {currentStep === steps.length - 1 && (
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
      >
        {components.forms.EmployeeForm.buttons[2]}
      </button>
    )}
        </div>
        </form>
      </section>
    </main>
  );
}

export default EmployeeForm;
