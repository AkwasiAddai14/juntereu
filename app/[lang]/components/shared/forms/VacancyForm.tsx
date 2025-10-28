"use client";

import React, { useState, useEffect, } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { VacancyValidation } from '@/app/lib/validations/vacancy';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useToast } from '@/app/[lang]/components/ui/use-toast';
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
import { getUserImages } from '@/app/lib/actions/image.actions';
import { useAIFill } from '@/app/lib/hooks/useAIFill';


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

export type AIActions = { fillWithAI: () => void };

const VacatureForm = forwardRef<AIActions, {
  userId: string;
  type: "maak" | "update";
  vacature?: any;
  vacatureId?: string;
  components: any;
  validations: any;
}>(({
  userId,
  type,
  vacature,
  vacatureId,
  components,
  validations
}, ref) => {
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
  const [submittingHours, setSubmittingHours] = useState(false);
  const [werktijden, setWerktijden] = useState([
    { begintijd: "", eindtijd: "", pauze: 0 },
  ]);
  const { toast } = useToast();
  const [showToeslagFields, setShowToeslagFields] = useState(false);
  const [toeslagType, setToeslagType] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [bedrijfDetails, setBedrijfDetails] = useState<any>(null);
  const [storedImages, setStoredImages] = useState<any[]>([]);
  const [selectedStoredImage, setSelectedStoredImage] = useState<string>('');
  const [existingVacancies, setExistingVacancies] = useState<any[]>([]);



  const steps = components.forms.VacancyForm.steps.map((step: { id: any; name: any; fields: any; }) => ({
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

  useEffect(() => {
    const fetchStoredImages = async () => {
      if (userId) {
        try {
          console.log('🔍 VacancyForm - Fetching stored images for userId:', userId);
          console.log('🔍 VacancyForm - UserId type:', typeof userId);
          const images = await getUserImages(userId);
          console.log('🔍 VacancyForm - Received images:', images);
          console.log('🔍 VacancyForm - Images count:', images.length);
          setStoredImages(images);
        } catch (error) {
          console.error('❌ VacancyForm - Error fetching stored images:', error);
          setStoredImages([]); // Set empty array on error
        }
      } else {
        console.log('⚠️ VacancyForm - No userId available for fetching images');
        setStoredImages([]);
      }
    };
    fetchStoredImages();
  }, [userId]);

  // AI Fill functionality
  const { generateAIFillData, isLoading: aiLoading, error: aiError } = useAIFill({
    employer: bedrijfDetails || {},
    documentType: 'vacancy',
    existingDocuments: existingVacancies,
    onSuccess: (data) => {
      console.log('🤖 AI Fill Success - Vacancy data:', data);
      
      // Fill form with AI-generated data
      setValue('title', data.title);
      setValue('function', data.function);
      setValue('description', data.description);
      setValue('skills', Array.isArray(data.skills) ? data.skills.join(', ') : data.skills);
      setValue('dresscode', Array.isArray(data.dresscode) ? data.dresscode.join(', ') : data.dresscode);
      setValue('hourlyRate', data.hourlyRate);
      
      // Set address fields
      if (data.address && typeof data.address === 'object') {
        setValue('housenumber', data.address.housenumber || '');
        setValue('postcode', data.address.postcode || '');
        setValue('street', data.address.streetname || '');
        setValue('city', data.address.city || '');
        setStreet(data.address.streetname || '');
        setCity(data.address.city || '');
      }
      
      // Set dates
      if (data.startingDate) {
        setStartDate(new Date(data.startingDate));
        setValue('startingDate', new Date(data.startingDate));
      }
      if (data.endingDate) {
        setEndDate(new Date(data.endingDate));
        setValue('endingDate', new Date(data.endingDate));
      }
      
      // Set working hours
      if (data.workingHours && data.workingHours.length > 0) {
        setWerktijden(data.workingHours);
      }
      
      // Set surcharge data
      if (data.surcharge !== undefined) {
        setValue('surcharge', data.surcharge);
        setShowToeslagFields(data.surcharge);
      }
      if (data.surchargeType !== undefined) {
        setValue('surchargetype', data.surchargeType);
      }
      if (data.surchargePercentage !== undefined) {
        setValue('surchargepercentage', data.surchargePercentage);
      }
      if (data.surchargeVan) {
        setValue('surchargeVan', data.surchargeVan);
      }
      if (data.surchargeTot) {
        setValue('surchargeTot', data.surchargeTot);
      }
      
      // Set image if available
      if (data.image) {
        setValue('image', data.image);
      }
      
      toast({
        title: "AI Fill Complete",
        description: data.reasoning || "Form filled with AI-generated data based on your company profile.",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('❌ AI Fill Error:', error);
      toast({
        title: "AI Fill Failed",
        description: error.message || "Failed to generate AI data. Please try again.",
        variant: "destructive",
      });
    }
  });

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

  // Functie om werktijden te valideren en feedback te geven
  const handleSubmitHours = async () => {
    setSubmittingHours(true);
    
    try {
      // Valideer werktijden
      const validWerktijden = werktijden.filter(werktijd => 
        werktijd.begintijd && werktijd.eindtijd
      );
      
      if (validWerktijden.length === 0) {
        toast({
          title: "Geen werktijden ingevuld",
          description: "Vul ten minste één werktijd in voordat je doorgaat.",
          variant: "destructive",
        });
        return;
      }

      // Simuleer een korte delay voor feedback
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Werktijden opgeslagen",
        description: `${validWerktijden.length} werktijd(en) succesvol toegevoegd.`,
        variant: "default",
      });
      
      // Ga naar de volgende stap
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      
    } catch (error) {
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan van de werktijden.",
        variant: "destructive",
      });
    } finally {
      setSubmittingHours(false);
    }
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
     startingDate: new Date(),
     endingDate: new Date(),
     starting: '12:00',
     ending: '20:00',
     hourlyRate: 12,
     surcharge: false,
     surchargetype: 0,
     surchargepercentage: 100,
     housenumber: '',
     city: '',
     postcode: '',
     street: '',
     break: '30',
     surchargeVan: '',
     surchargeTot: '',
    }
  });

  // Sync form values with state - moved after useForm hook
  useEffect(() => {
    setValue('startingDate', startDate || new Date());
    setValue('endingDate', endDate || new Date());
  }, [startDate, endDate, setValue]);

  const selectedToeslagType = watch("surchargetype");

  // Debug form state
  console.log('🔍 Form errors:', errors);
  console.log('🔍 Form values:', watch());
  console.log('🔍 Current step:', currentStep);

  // Expose AI fill function to parent
  useImperativeHandle(ref, () => ({
    fillWithAI: () => {
      if (!bedrijfDetails?._id) {
        toast({
          title: "Company Data Required",
          description: "Please wait for company data to load before using AI fill.",
          variant: "destructive",
        });
        return;
      }
      
      generateAIFillData();
    }
  }));

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
    setLoading(true);
    console.log('🚀 PROCESSFORM CALLED - Processing form with data:', data);
    console.log('🚀 Current step:', currentStep);
    console.log('🚀 Form errors:', errors);
    
    // Valideer vereiste velden
    if (!bedrijfDetails?._id) {
      toast({
        title: "Bedrijfsgegevens ontbreken",
        description: "Er zijn geen bedrijfsgegevens gevonden. Probeer opnieuw in te loggen.",
        variant: "destructive",
      });
      return;
    }

    if (!data.function || !data.hourlyRate) {
      toast({
        title: "Verplichte velden ontbreken",
        description: "Vul alle verplichte velden in voordat je de vacature aanmaakt.",
        variant: "destructive",
      });
      return;
    }

    if (werktijden.length === 0 || !werktijden.some(w => w.begintijd && w.eindtijd)) {
      toast({
        title: "Werktijden ontbreken",
        description: "Voeg ten minste één werktijd toe voordat je de vacature aanmaakt.",
        variant: "destructive",
      });
      return;
    }
    
    // Toon loading feedback
    toast({
      title: "Vacature wordt aangemaakt",
      description: "Bezig met het aanmaken van de vacature...",
      variant: "default",
    });
    
    // Je zou de data kunnen mappen naar het juiste formaat voor de createVacature functie
    const vacatureInput = {
      opdrachtgever: bedrijfDetails?._id ?? "", // Bedrijf ID
      titel: data.title, // Titel van de vacature
      opdrachtgeverNaam: bedrijfDetails?.displayname ?? "", // Naam van het bedrijf
      functie: data.function, // Functienaam
      afbeelding: data.image || '', // Afbeelding die bij de vacature hoort (bijv. logo van het bedrijf)
      uurloon: data.hourlyRate, // Uurloon voor de functie
      adres: {
        huisnummer: data.housenumber || '',
        postcode: data.postcode || '',
        straatnaam: (street ?? data.street) || '',
        stad: (city ?? data.city) || '',
      }, // Adres van de werkplek
      begindatum: startDate || new Date(data.startingDate), // Startdatum van de functie
      einddatum: endDate || new Date(data.endingDate), // Einddatum van de functie
      tijden: werktijden,
      beschrijving: data.description || '', // Algemene beschrijving van de functie
      vaardigheden: Array.isArray(data.skills) ? data.skills : data.skills ? data.skills.split(',') : [], // Vaardigheden, controleer of het een array is
      kledingsvoorschriften: Array.isArray(data.dresscode) ? data.dresscode : data.dresscode ? data.dresscode.split(',') : [], // Kledingsvoorschriften, controleer of het een array is
      toeslagen: [{
      toeslag: data.surcharge,
      toeslagType: data.surchargetype || 0,
      toeslagPercentage: data.surchargepercentage || 100,
      toeslagVan: data.surchargeVan || '',
      toeslagTot: data.surchargeTot || '',
    }]
    };

    console.log('Vacature input:', vacatureInput);

    // Roep de createVacature functie aan om de vacature op te slaan
    const nieuweVacature = await createVacature(vacatureInput);
    console.log('Vacature succesvol aangemaakt:', nieuweVacature);
    
    // Success feedback
    toast({
      title: "Vacature succesvol aangemaakt!",
      description: "De vacature is succesvol aangemaakt en is nu zichtbaar in je dashboard.",
      variant: "default",
    });
    
    // Redirect to dashboard after successful creation
    router.push('/dashboard');
  } catch (error: any) {
    console.error('Fout bij het aanmaken van de vacature:', error);
    toast({
      title: "Fout bij aanmaken vacature",
      description: error.message || "Er is een onverwachte fout opgetreden bij het aanmaken van de vacature.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
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
      <form onSubmit={(e) => {
        console.log('🎯 FORM SUBMIT TRIGGERED');
        console.log('🎯 Current step:', currentStep);
        console.log('🎯 Form valid:', !Object.keys(errors).length);
        console.log('🎯 Form errors:', errors);
        handleSubmit(processForm)(e);
      }} className="relative my-8  items-center rounded-lg bg-white shadow-lg ring-1 ring-black/5">
      
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
                      <div className="mt-2 sm:col-span-2 sm:mt-0 space-y-4">
                        {/* Stored Images Dropdown */}
                        <div>
                          <label htmlFor="stored-images" className="block text-sm font-medium text-gray-700 mb-2">
                            Select from stored images
                          </label>
                          <select
                            id="stored-images"
                            value={selectedStoredImage}
                            onChange={(e) => {
                              setSelectedStoredImage(e.target.value);
                              if (e.target.value) {
                                setValue('image', e.target.value, { shouldValidate: true });
                              }
                            }}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">
                              {storedImages.length > 0 ? 'Choose a stored image...' : 'No stored images available'}
                            </option>
                            {storedImages.map((image) => (
                              <option key={image._id} value={image.url}>
                                {image.filename || image.metadata?.alt || 'Untitled Image'}
                              </option>
                            ))}
                          </select>
                          {storedImages.length === 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              Upload images first to see them in this dropdown
                            </p>
                          )}
                        </div>
                        
                        {/* Current Image Uploader */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Or upload a new image
                          </label>
                          <FileUploader
                            onFieldChange={(uploadedUrl: string) => {
                              setValue('image', uploadedUrl, { shouldValidate: true });
                              setSelectedStoredImage(''); // Clear stored image selection
                            }}
                            imageUrl={watch('image') || ''}
                            setFiles={setFiles}
                          />
                        </div>
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
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {components.forms.VacancyForm.data.fieldLabels[0]}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">
                          {components.forms.VacancyForm.data.fieldLabels[1]}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => {
                              setStartDate(date);
                              setValue('startingDate', date || new Date());
                            }}
                            dateFormat="dd/MM/yyyy"
                            className="h-12 pl-10 pr-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholderText="Select start date"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">
                          {components.forms.VacancyForm.data.fieldLabels[2]}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <DatePicker
                            selected={endDate}
                            onChange={(date) => {
                              setEndDate(date);
                              setValue('endingDate', date || new Date());
                            }}
                            dateFormat="dd/MM/yyyy"
                            className="h-12 pl-10 pr-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholderText="Select end date"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

{werktijden.map((werktijd, index) => (
  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-4">
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Working Hours {index + 1}
      </h4>
      {werktijden.length > 1 && (
        <button
          type="button"
          onClick={() => verwijderWerktijd(index)}
          className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove
        </button>
      )}
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 space-y-2">
      <div className="space-y-2">
        <label htmlFor={`begintijd-${index}`} className="text-sm font-medium text-gray-700 block">
          {components.forms.VacancyForm.data.fieldLabels[3]}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <input
            type="time"
            id={`begintijd-${index}`}
            value={werktijd.begintijd}
            onChange={(e) => werkWerktijdBij(index, "begintijd", e.target.value)}
            className="h-12 pl-10 pr-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor={`eindtijd-${index}`} className="text-sm font-medium text-gray-700 block">
          {components.forms.VacancyForm.data.fieldLabels[4]}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <input
            type="time"
            id={`eindtijd-${index}`}
            value={werktijd.eindtijd}
            onChange={(e) => werkWerktijdBij(index, "eindtijd", e.target.value)}
            className="h-12 pl-10 pr-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>
      </div>

      <div className="space-y-2 mb-10">
        <label htmlFor={`pauze-${index}`} className="text-sm font-medium text-gray-700 block">
          {components.forms.VacancyForm.data.fieldLabels[5]}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <input
            type="number"
            id={`pauze-${index}`}
            value={werktijd.pauze || 0}
            onChange={(e) => werkWerktijdBij(index, "pauze", parseInt(e.target.value))}
            className="h-12 pl-10 pr-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            min={0}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  </div>
))}

<div className="items-center justify-center flex flex-col sm:flex-row gap-4 pt-10">
  <button
    type="button"
    onClick={voegWerktijdToe}
    className="inline-flex items-center gap-2 bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 transition-colors shadow-sm font-medium"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
    {components.forms.VacancyForm.data.buttons[1]}
  </button>

  <button
    type="button"
    onClick={handleSubmitHours}
    disabled={submittingHours}
    className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {submittingHours ? (
      <>
        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Bezig met opslaan...
      </>
    ) : (
      <>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {components.forms.VacancyForm.data.buttons[2]}
      </>
    )}
  </button>
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
                    {...register("hourlyRate", { 
                      required: "uurloon is verplicht",
                      valueAsNumber: true
                    })}
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
                  {(toeslagType !== "zon_en_feestdagen" && toeslagType !== "zaterdag") && (
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

      {currentStep === 4 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="px-8 space-y-7 sm:space-y-16">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900 pt-10">
                    {components.forms.VacancyForm.titles[4]?.headTitle || "Vacature Compleet"}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                    {components.forms.VacancyForm.titles[4]?.subTitle || "Alle informatie is verzameld. Klik op 'Finish' om de vacature aan te maken."}
                  </p>
                  
                  <div className="mt-8 bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Samenvatting</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Titel:</strong> {watch('title') || 'Niet ingevuld'}</p>
                      <p><strong>Functie:</strong> {watch('function') || 'Niet ingevuld'}</p>
                      <p><strong>Uurloon:</strong> €{watch('hourlyRate') || '0'}/uur</p>
                      <p><strong>Startdatum:</strong> {startDate ? startDate.toLocaleDateString('nl-NL') : 'Niet ingevuld'}</p>
                      <p><strong>Einddatum:</strong> {endDate ? endDate.toLocaleDateString('nl-NL') : 'Niet ingevuld'}</p>
                    </div>
                  </div>
                </div>
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
        disabled={loading}
        className="inline-flex items-center gap-2 justify-center rounded-md border border-transparent bg-orange-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Bezig met aanmaken...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {components.forms.VacancyForm.buttons[2] || 'Finish'}
          </>
        )}
      </button>
    )}
        </div>
        </form>
      </section>
    </main>
    </LocalizationProvider>
  );
});

export default VacatureForm;