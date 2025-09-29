'use client';

import { z } from 'zod';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { CheckIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { easeInOut, motion } from 'framer-motion';
import { useOrganizationList } from "@clerk/nextjs";
import { zodResolver } from '@hookform/resolvers/zod';
import { useUploadThing } from "@/app/lib/uploadthing";
import { useForm, SubmitHandler } from 'react-hook-form';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { maakBedrijf } from '@/app/lib/actions/employer.actions';
import { createCompanyValidation } from '@/app/lib/validations/employer';
import { FileUploader } from "@/app/[lang]/components/shared/FileUploader";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


type Inputs = z.infer<typeof createCompanyValidation>;

const steps = [
    {
        id: '1',
        name: 'Gegevens',
        fields: ['voornaam', 'tussenvoegsel', 'achternaam', 'kvk']
    },
    {
        id: ' 2',
        name: 'Profiel',
        fields: ['displaynaam', 'profielfoto', 'bio']
    },
    {
        id: '3',
        name: 'Compleet'
    }
];

const countries = [
    { name: 'United Kingdom', id: "VerenigdKoninkrijk", icon: '🇬🇧' },
    { name: 'Nederland', id: "Nederland",  icon: '🇳🇱' },
    { name: 'France', id: "Frankrijk",  icon: '🇫🇷' },
    { name: 'België/Bégique', id: "Belgie",  icon: '🇧🇪' },
    { name: 'Deutschland', id: "Duitsland", icon: '🇩🇪' },
    { name: 'Österreich', id: "Oostenrijk",  icon: '🇦🇹' },
    { name: 'España', id: "Spanje", icon: '🇪🇸' },
    { name: 'Portugal', id: "Portugal", icon: '🇵🇹' },
    { name: 'Italia', id: "Italie",  icon: '🇮🇹' },
    { name: 'Suisse', id: "Zwitserland", icon: '🇨🇭' },
    { name: 'Sverige', id: "Zweden",  icon: '🇸🇪' },
    { name: 'Danmark', id: "Denemarken",  icon: '🇩🇰' },
    { name: 'Norge', id: "Noorwegen",  icon: '🇳🇴' },
    { name: 'Suomi', id: "Finland",  icon: '🇫🇮' },
  ]

  interface ClientProps {
    lang: Locale;
    userId: string | null;
    components: any,
    validations: any
  }

const BedrijfsForm = ({ lang, userId, components, validations }: ClientProps) => {
    const { createOrganization } = useOrganizationList();
    const [organizationName, setOrganizationName] = useState("");
    const router = useRouter();
    const pathname = usePathname();
    const [kvkNummer, setKvkNummer] = useState('');
    const { isLoaded, user } = useUser();
    const [files, setFiles] = useState<File[]>([]);
    const { startUpload } = useUploadThing("media");
    const [loading, setLoading] = useState(false);


    const steps = components.forms.CompanyForm.steps.map((step: { id: any; name: any; fields: any; }) => ({
        id: parseInt(step.id),
        name: step.name,
        fields: step.fields || []
      }));

    const haalBedrijfsData = async (kvkNummer: string) => {
        try {
            const response = await axios.get(`/api/kvk?kvkNummer=${kvkNummer}`);
            if (response.data) {
                const { companyName, streetName, houseNumber, houseNumberAddition, houseLetter, postalCode, place } = response.data;

                return {
                    companyName,
                    streetName,
                    houseNumber: `${houseNumber}${houseNumberAddition}${houseLetter}`,
                    postalCode,
                    place
                };
            } else {
                throw new Error('No company data found for the provided KVK number.');
            }
        } catch (error) {
            console.error('Error fetching company details:', error);
            throw error;
        }
    };
    const getUserPhoneNumber = (user: any) => {
        if (user?.primaryPhoneNumber?.phoneNumber) {
          return user.primaryPhoneNumber.phoneNumber;
        }
        
        const primaryPhone = user?.phoneNumbers?.find(
          (phoneNumber: any) => phoneNumber.id === user?.primaryPhoneNumberId
        );
      
        return primaryPhone?.phoneNumber || "";
      };
    const { register, handleSubmit, watch, reset, trigger, setValue, formState: { errors } } = useForm<Inputs>({
        resolver: zodResolver(createCompanyValidation),
        defaultValues: {
            companyId:  user?.id,
            name: '',
            profilephoto:  user?.imageUrl || "",
            country: 'United Kingdom',
            displayname:  '',
            CompanyRegistrationNumber:  '',
            VATidnr:  '',
            postcode: '',
            housenumber:  '',
            city: '',
            street:  '',
            email:  user?.emailAddresses[0].emailAddress || "",
            phone:  getUserPhoneNumber(user) || "",
            iban:  '',
            
        },
    });

    useEffect(() => {
        const fetchDetails = async () => {
            if (kvkNummer.length === 8) {
                try {
                    const details = await haalBedrijfsData(kvkNummer);
                    console.log('Company Details:', details);
                    setValue('displayname', details.companyName);
                    setValue('street', details.streetName);
                    setValue('housenumber', details.houseNumber);
                    setValue('postcode', details.postalCode);
                    setValue('city', details.place);
                } catch (error: any) {
                    console.error('Error:', error.message);
                }
            }
        };

        fetchDetails();
    }, [kvkNummer, setValue]);

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
        user?.update({
                     unsafeMetadata: { country: data.country },
                     })
        
            setLoading(true)
            console.log(data)
            try {
                const result =  await maakBedrijf({
                    clerkId: user?.id || "bedrijf",
                    name: data.name || user?.firstName || user?.fullName ||"",
                    profilephoto: data.profilephoto || user?.imageUrl || "",
                    displayname: data.displayname,
                    CompanyRegistrationNumber: data.CompanyRegistrationNumber || '',
                    VATidnr: data.VATidnr,
                    postcode: data.postcode,
                    housenumber: data.housenumber,
                    city: data.city,
                    street: data.street,
                    email: data.email ||  user?.emailAddresses[0].emailAddress || "",
                    phone: data.phone || getUserPhoneNumber(user) || "",
                    iban: data.iban,
                });
                console.log("Submission Result:", result);
                if (createOrganization) {
                    await createOrganization({ name: data.displayname });
                    setOrganizationName(data.displayname);
                } else {
                    console.error("createOrganization function is undefined");
                }
                if (pathname === 'profiel/wijzigen') {
                    router.back();
                } else {
                    setLoading(false)
                    router.push('../dashboard');
                }
            } catch (error:any) {
                console.error('Error processing form:', error);
                console.log(error);
            }
        
    };

    const [previousStep, setPreviousStep] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const delta = currentStep - previousStep;

    const next = async () => {
        const fields = steps[currentStep].fields;
        const output = await trigger(fields as (keyof Inputs)[], { shouldFocus: true });
        console.log("Validation Output: ", output);
        console.log(errors);

        if (!output) return;

        if (currentStep < steps.length - 1) {
            setPreviousStep(currentStep);
            setCurrentStep((step) => step + 1);
        }
    };

    const prev = () => {
        if (currentStep > 0) {
            setPreviousStep(currentStep);
            setCurrentStep((step) => step - 1);
        }
    };

    if (loading) {
        return  <div>Loading...</div>
      }

    return (
        <section className="flex flex-col justify-between p-24">
            <nav aria-label="Progress">
                <ol role="list" className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
                    {steps.map((step : { id: any; name: any; fields: any; }, stepIdx: number) => (
                        <li key={step.name} className="relative md:flex md:flex-1">
                            {currentStep > stepIdx ? (
                                <span className="flex items-center px-6 py-4 text-sm font-medium">
                                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-600 group-hover:bg-sky-800">
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
                                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                                        <span className="text-gray-500 group-hover:text-gray-900">{step.id}</span>
                                    </span>
                                    <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">{step.name}</span>
                                </span>
                            )}
                            {stepIdx !== steps.length - 1 && (
                                 <div className="absolute top-0 right-0 hidden h-full w-5 md:block" aria-hidden="true">
                                    <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                                        <path
                                            d="M0 -2L20 40L0 82"
                                            vectorEffect="non-scaling-stroke"
                                            stroke="currentcolor"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

            <form onSubmit={handleSubmit(processForm)} className=" mt-8 items-center rounded-lg bg-white shadow-lg ring-1 ring-black/5">
            {currentStep === 0 && (
    <motion.div
        initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: easeInOut }}
    >
        <div className="px-8 space-y-12 sm:space-y-16">
            <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold mt-10 leading-7 text-gray-900">{components.forms.CompanyForm.headTitle}</h2>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-6">
                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                        {components.forms.CompanyForm.location}
                    </label>
                    <div className="mt-2">
                        <div className="relative">
                            <select
                                id="country"
                                {...register('country', { required: true })}
                                className="block w-full appearance-none rounded-md border-0 py-1.5 pl-3 pr-8 text-base text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                    <div className="sm:col-span-6">
                        <label htmlFor="kvk" className="block text-sm font-medium leading-6 text-gray-900">
                            {components.forms.CompanyForm.formItems[0]}
                        </label>
                        <div className="mt-2">
                            <input
                                id="kvknr"
                                {...register('CompanyRegistrationNumber')}
                                value={kvkNummer}
                                onChange={(e) => setKvkNummer(e.target.value)}
                                type="text"
                                autoComplete="textinput"
                                className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.CompanyRegistrationNumber && (
                                <p className="text-red-500 text-sm">{errors.CompanyRegistrationNumber.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                        {components.forms.CompanyForm.formItems[1]}
                        </label>
                        <div className="mt-2">
                            <input
                                id="name"
                                {...register('name')}
                                type="text"
                                autoComplete="name"
                                placeholder=''
                                className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm">{errors.name.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                            {components.forms.CompanyForm.formItems[2]}
                        </label>
                        <div className="mt-2">
                            <input
                                id="postal-code"
                                {...register('postcode')}
                                type="text"
                                autoComplete="postal-code"
                                placeholder=''
                                className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={watch('postcode')}
                                onChange={(e) => setValue('postcode', e.target.value)}
                            />
                            {errors.postcode && (
                                <p className="text-red-500 text-sm">{errors.postcode.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="housenumber" className="block text-sm font-medium leading-6 text-gray-900">
                            {components.forms.CompanyForm.formItems[3]}
                        </label>
                        <div className="mt-2">
                            <input
                                id="huisnummer"
                                {...register('housenumber')}
                                type="text"
                                autoComplete="textinput"
                                placeholder=''
                                className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={watch('housenumber')}
                                onChange={(e) => setValue('housenumber', e.target.value)}
                            />
                            {errors.housenumber && (
                                <p className="text-red-500 text-sm">{errors.housenumber.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="street" className="block text-sm font-medium leading-6 text-gray-900">
                            {components.forms.CompanyForm.formItems[4]}
                        </label>
                        <div className="mt-2">
                            <input
                                id="street"
                                {...register('street')}
                                type="text"
                                autoComplete="textinput"
                                placeholder=''
                                className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={watch('street')}
                                onChange={(e) => setValue('street', e.target.value)}
                            />
                            {errors.street && (
                                <p className="text-red-500 text-sm">{errors.street.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                            {components.forms.CompanyForm.formItems[5]}
                        </label>
                        <div className="mt-2">
                            <input
                                id="city"
                                {...register('city')}
                                type="text"
                                autoComplete="stad"
                                className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                value={watch('city')}
                                onChange={(e) => setValue('city', e.target.value)}
                            />
                            {errors.city && (
                                <p className="text-red-500 text-sm">{errors.city.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                            {components.forms.CompanyForm.formItems[6]}
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                {...register('email')}
                                type="text"
                                autoComplete="emailadres"
                                className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                            {components.forms.CompanyForm.formItems[7]}
                        </label>
                        <div className="mt-2">
                            <input
                                id="phone"
                                {...register('phone')}
                                type="text"
                                autoComplete="phone"
                                className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm">{errors.phone.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="vatid" className="block text-sm font-medium leading-6 text-gray-900">
                            {components.forms.CompanyForm.formItems[8]}
                        </label>
                        <p className="text-sm text-slate-400">({components.forms.CompanyForm.optioneel})</p>
                        <div className="mt-2">
                            <input
                                id="vatid"
                                {...register('VATidnr')}
                                type="text"
                                autoComplete="vat-id"
                                placeholder="Enter your VAT ID number"
                                className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.VATidnr && (
                                <p className="text-red-500 text-sm">{errors.VATidnr.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="iban" className="block text-sm font-medium leading-6 text-gray-900">
                            {components.forms.CompanyForm.formItems[9]}
                        </label>
                        <p className="text-sm text-slate-400">({components.forms.CompanyForm.optioneel})</p>
                        <div className="mt-2">
                            <input
                                id="iban"
                                {...register('iban')}
                                type="text"
                                autoComplete="iban"
                                placeholder="Enter your IBAN"
                                className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.iban && (
                                <p className="text-red-500 text-sm">{errors.iban.message}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
)}


                 {currentStep === 1 && (
                    <motion.div
                        initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: easeInOut }}
                    >
                        <div className="px-8 space-y-12 sm:space-y-16">
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base font-semibold  mt-10 leading-7 text-gray-900">{components.forms.CompanyForm.headTitle}</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    {components.forms.CompanyForm.subTitle}
                                </p>

                                 <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                 <div className="col-span-full sm:col-span-4">
                                        <label htmlFor="displaynaam" className="block text-sm font-medium leading-6 text-gray-900">
                                            {components.forms.CompanyForm.formItems[10]}
                                        </label>
                                        <input
                                            id="displaynaam"
                                            {...register('displayname')}
                                            type="text"
                                            autoComplete="displaynaam"
                                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {errors.displayname && (
                                            <p className="text-red-500 text-sm">{errors.displayname.message}</p>
                                        )}
                                    </div>

                                         <div className="mt-10 space-y-8 col-span-full pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                                            <div className="sm:grid sm:grid-cols-1 sm:items-start sm:gap-4 sm:py-6">
                                              <label htmlFor="profielfoto" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                                               {components.forms.CompanyForm.formItems[12]}
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

                                    <div className="col-span-full">
                                        <label htmlFor="bio" className="block text-sm font-medium leading-6 text-gray-900">
                                            {components.forms.CompanyForm.formItems[11]}
                                        </label>
                                        <p className="mt-3 text-sm leading-6 text-gray-600">
                                                {components.forms.CompanyForm.bioSubtitle}
                                            </p>
                                        <div className="mt-2">
                                            <textarea
                                                id="bio"
                                                {...register('bio')}
                                                rows={14}
                                                className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            ></textarea>
                                            {errors.bio && (
                                                <p className="text-red-500 text-sm">{errors.bio.message}</p>
                                            )}
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
                        transition={{ duration: 0.3, ease: easeInOut }}
                    >
                        <div className="px-8 space-y-12 sm:space-y-16">
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="mt-7 text-base font-semibold leading-7 text-gray-900">{components.forms.CompanyForm.final_page_header}</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                {components.forms.CompanyForm.final_page_subtitle}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="mt-8 pb-10 pr-10 flex justify-end space-x-4">
                {currentStep > 0 && (
                    <button
                        type="button"
                        onClick={prev}
                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    >
                        {components.forms.CompanyForm.buttons[0]}
                    </button>
                )}
                {currentStep < 2 ? (
                    <button
                        type="button"
                        onClick={next}
                        className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        {components.forms.CompanyForm.buttons[1]}
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        {components.forms.CompanyForm.buttons[2]}
                    </button>
                )}
            </div>
        </form>
        </section>
    );
}

export default BedrijfsForm;
