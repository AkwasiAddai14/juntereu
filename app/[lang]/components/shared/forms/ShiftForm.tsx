"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/app/[lang]/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/[lang]/components/ui/form";
import { Input } from "@/app/[lang]/components/ui/input";
import { createShiftValidation } from "@/app/lib/validations/shift";
import { forwardRef, useImperativeHandle } from 'react';
import * as z from "zod";
import { Textarea } from "@/app/[lang]/components/ui/textarea";
import { FileUploader } from "@/app/[lang]/components/shared/FileUploader";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useUploadThing } from "@/app/lib/uploadthing";
import dayjs, { Dayjs } from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "@/app/[lang]/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useToast } from '@/app/[lang]/components/ui/use-toast';
import { maakOngepubliceerdeShift, maakShift, updateShift } from "@/app/lib/actions/shift.actions";
import Dropdown from "@/app/[lang]/components/shared/Dropdown";
import DropdownPauze from "@/app/[lang]/components/shared/DropdownPauze";
import DropdownCategorie from "@/app/[lang]/components/shared/DropdownCategorie";
import { fetchBedrijfDetails } from "@/app/lib/actions/employer.actions";
import { getUserImages } from '@/app/lib/actions/image.actions';
import { useAIFill } from '@/app/lib/hooks/useAIFill';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/nl';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { IFlexpool } from "@/app/lib/models/flexpool.model";
import { haalFlexpools } from "@/app/lib/actions/flexpool.actions";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from '@headlessui/react';
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "lucide-react";
import { IShiftArray } from "@/app/lib/models/shiftArray.model";
import { fetchUnpublishedShifts } from "@/app/lib/actions/shiftArray.actions";


type ShiftFormProps = {
  userId: string;
  type: "maak" | "update";
  shift?: IShiftArray;
  shiftId?: string;
};

export type AIActions = { fillWithAI: () => void };


const ShiftForm = forwardRef<AIActions, ShiftFormProps & { components: any }>(({ userId, type, shift, shiftId, components }, ref) => {
  const [files, setFiles] = useState<File[]>([]);
  const [begintijd, setBegintijd] = useState<Dayjs | null>(dayjs('2022-04-17T08:00'));
  const [eindtijd, setEindtijd] = useState<Dayjs | null>(dayjs('2022-04-17T16:30'));
  const [flexpools, setFlexpools] = useState<IFlexpool[]>([]);
  const [isInFlexpool, setIsInFlexpool] = useState(false);
  const [bedrijfDetails, setBedrijfDetails] = useState<any>(null);
  const [bedrijfLoading, setBedrijfLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [shifts, setShifts] = useState<any[]>([]);
  const [selectedShift, setSelectedShift] = useState<IShiftArray | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [storedImages, setStoredImages] = useState<any[]>([]);
  const [selectedStoredImage, setSelectedStoredImage] = useState<string>('');
  const [existingShifts, setExistingShifts] = useState<any[]>([]);
  const router = useRouter();
  const { startUpload } = useUploadThing("media");
  const { toast } = useToast();
  
  const DefaultValues = selectedShift ? {
    opdrachtgever: selectedShift.employer,
    opdrachtgeverNaam: selectedShift.employerName,
    opdrachtnemers: "",
    afbeelding: selectedShift.image,
    titel: selectedShift.title,
    functie: selectedShift.function,
    uurtarief: selectedShift.hourlyRate,
    begindatum: new Date(),
    einddatum: new Date(),
    adres: selectedShift.adres,
    begintijd: selectedShift.starting,  // Ensure initial state is passed as default
    eindtijd: selectedShift.ending,
    pauze: "",
    plekken: selectedShift.spots,
    beschrijving: selectedShift.description,
    vaardigheden: selectedShift.skills,
    kledingsvoorschriften: selectedShift.dresscode,
    beschikbaar: true,
    geplubliceerd: false,
    inFlexpool: false,
    flexpoolId: "",
    path: "",
    shiftArrayId: "",
    checkoutbegintijd:"",
      checkouteindtijd: "",
      checkoutpauze:"",
      feedback:"",
      opmerking:"",
      ratingFreelancer: "",
      ratingBedrijf: "",
  } : {
    opdrachtgever: "",
    opdrachtgeverNaam: " ",
    opdrachtnemers: "",
    afbeelding: "",
    titel: "",
    functie: "",
    uurtarief: 14,
    begindatum: new Date(),
    einddatum: new Date(),
    adres: "",
    begintijd: "08:00",  // Ensure initial state is passed as default
    eindtijd: "16:30",
    pauze: "",
    plekken: 1,
    beschrijving: "",
    vaardigheden: "",
    kledingsvoorschriften: "",
    beschikbaar: true,
    geplubliceerd: false,
    inFlexpool: false,
    flexpoolId: "",
    path: "",
    shiftArrayId: "",
    checkoutbegintijd:"",
      checkouteindtijd: "",
      checkoutpauze:"",
      feedback:"",
      opmerking:"",
      ratingFreelancer: "",
      ratingBedrijf: "",
  };
  
  useEffect(() => {
    if (userId) {
      setBedrijfLoading(true);
      fetchBedrijfDetails(userId)
        .then((details) => {
          setBedrijfDetails(details);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setBedrijfLoading(false);
        });
    }
  }, [userId]);

  useEffect(() => {
    const getFlexpools = async () => {
      if (bedrijfDetails && bedrijfDetails._id) {
        try {
          const fetchedFlexpools = await haalFlexpools(bedrijfDetails._id);
          setFlexpools(fetchedFlexpools);
        } catch (error) {
          console.error("Error fetching flexpools:", error);
        }
      }
    };

    getFlexpools();
  }, [bedrijfDetails]);

  

  const initialValues =
    shift && type === "update"
      ? {
          ...shift,
          opdrachtgever: bedrijfDetails?._id ?? "",
          afbeelding: bedrijfDetails?.profielfoto ?? shift.image,
          adres: shift.adres ? `${shift.adres}` : "",
          begindatum: new Date(shift.startingDate),
          einddatum: new Date(shift.endingDate),
          pauze: shift.break? shift.break : "30 minuten",
          inFlexpool: shift.inFlexpool || false,
          flexpoolId: shift.flexpools?.toString() ? shift.flexpools.toString() : ""

        }
      : DefaultValues;

  const form = useForm({
    resolver: zodResolver(createShiftValidation),
    defaultValues: {
      ...initialValues,
      image: (initialValues as any).afbeelding || '',
      title: (initialValues as any).titel || '',
      function: (initialValues as any).functie || '',
      adres: (initialValues as any).adres || '',
      starting: (initialValues as any).begintijd || '',
      ending: (initialValues as any).eindtijd || '',
      hourlyRate: (initialValues as any).uurtarief || 0,
      spots: (initialValues as any).plekken || 0,
      description: (initialValues as any).beschrijving || '',
      skills: (initialValues as any).vaardigheden || '',
      dresscode: (initialValues as any).kledingsvoorschriften || '',
    },
  });

  const { handleSubmit, control, getValues, setValue, watch, trigger } = form;
  
  // Monitor image field changes
  const imageValue = watch('image');
  useEffect(() => {
    console.log('ShiftForm - image field changed to:', imageValue);
  }, [imageValue]);
  
  // Force form field update when image changes
  const [forceUpdate, setForceUpdate] = useState(0);
  useEffect(() => {
    if (imageValue && imageValue !== '') {
      console.log('ShiftForm - Forcing update for image:', imageValue);
      setForceUpdate(prev => prev + 1);
    }
  }, [imageValue]);

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

  async function onSubmit(values: z.infer<typeof createShiftValidation>) {
    if (bedrijfLoading) {
      toast({
        title: "Bedrijfsgegevens worden geladen",
        description: "Wacht even terwijl de bedrijfsgegevens worden geladen.",
        variant: "default",
      });
      return;
    }
    
    if (!bedrijfDetails || !bedrijfDetails._id) {
      console.error("Bedrijf details are not properly loaded.");
      toast({
        title: "Bedrijfsgegevens ontbreken",
        description: "Er zijn geen bedrijfsgegevens gevonden. Probeer opnieuw in te loggen.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    let uploadedImageUrl = values.image;

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
    if (type === "maak") {
      try {
        const newShift = await maakShift({
          opdrachtgever: bedrijfDetails._id,
          opdrachtgeverNaam: bedrijfDetails.displayname || 'Company',
          titel: values.title || 'Nieuwe shift',
          functie: values.function || 'Allround medewerker',
          afbeelding: uploadedImageUrl || values.image || '',
          uurtarief: Number(values.hourlyRate) || 14,
          plekken: Number(values.spots) || 3,
          adres: values.adres || (() => {
            console.log('BedrijfDetails for address construction:', bedrijfDetails);
            const street = bedrijfDetails.street || bedrijfDetails.straat || '';
            const housenumber = bedrijfDetails.housenumber || bedrijfDetails.huisnummer || '';
            const city = bedrijfDetails.city || bedrijfDetails.stad || '';
            const postcode = bedrijfDetails.postcode || '';
            
            console.log('Address components:', { street, housenumber, city, postcode });
            
            const addressParts = [street, housenumber].filter(Boolean);
            const locationParts = [postcode, city].filter(Boolean);
            
            if (addressParts.length > 0 && locationParts.length > 0) {
              return `${addressParts.join(' ')}, ${locationParts.join(' ')}`;
            } else if (addressParts.length > 0) {
              return addressParts.join(' ');
            } else if (locationParts.length > 0) {
              return locationParts.join(' ');
            }
            return 'Adres niet beschikbaar';
          })(),
          begindatum: values.startingDate,
          einddatum: values.endingDate,
          begintijd: values.starting || '08:00',
          eindtijd: values.ending || '16:30',
          pauze: values.break || '30 minuten',
          beschrijving: values.description || 'Shift beschrijving',
          vaardigheden: typeof values.skills === 'string'
          ? values.skills.split(", ") // If it's a string, split it into an array
          : Array.isArray(values.skills)
            ? values.skills // If it's already an array, use it as is
            : [], // Default to an empty array if it's neither
          kledingsvoorschriften: typeof values.dresscode === 'string' ? values.dresscode.split(", ") : [],
          opdrachtnemers: [],
          flexpoolId: values.flexpoolId,
          path: "/dashboard",
          status: "beschikbaar",
          checkoutbegintijd:  "00:00",  // Provide a default time if not available
          checkouteindtijd:  "00:00",  
          checkoutpauze: "",
          feedback: "",
          opmerking: "",
          shiftArrayId: "0000",
          ratingFreelancer: 5,
          ratingBedrijf: 5,
        });

        if (newShift) {
          form.reset();
          setLoading(false);
          router.back();
        }
      } catch (error) {
        console.error('Error creating shift:', error);
        toast({
          variant: 'destructive',
          description: 'Er is een fout opgetreden bij het aanmaken van de shift. Probeer het opnieuw.'
        });
        setLoading(false);
      }
    }

    if (type === "update") {
      if (!shiftId) {
        router.back();
        return;
      }

      try {
        
        const updatedShift = await updateShift({
          opdrachtgever: bedrijfDetails._id,
          opdrachtgeverNaam: bedrijfDetails.displayname,
          titel: values.title,
          functie: values.function,
          afbeelding: bedrijfDetails.profielfoto || values.image,
          uurtarief: values.hourlyRate,
          plekken: Number(values.spots), // Convert to number
          adres: `${bedrijfDetails.stad}, ${bedrijfDetails.straat}, ${bedrijfDetails.huisnummer}` || values.adres,
          begindatum: values.startingDate,
          einddatum: values.endingDate,
          begintijd: values.starting,
          eindtijd: values.ending,
          pauze: values.break,
          beschrijving: values.description,
          vaardigheden: typeof values.skills === 'string'
          ? values.skills.split(", ") // If it's a string, split it into an array
          : Array.isArray(values.skills)
            ? values.skills // If it's already an array, use it as is
            : [], // Default to an empty array if it's neither
          kledingsvoorschriften: typeof values.dresscode === "string" ? values.dresscode.split(", ") : [],
          opdrachtnemers: [],
          flexpoolId: values.flexpoolId,
          path: "/dashboard",
          status: "beschikbaar",
          checkoutbegintijd: "",
          checkouteindtijd: "",
          checkoutpauze: "",
          feedback: "",
          opmerking: "",
          shiftArrayId: "0000",
          ratingFreelancer: 5,
          ratingBedrijf: 5,
        });

        if (updatedShift) {
          form.reset();
          setLoading(false);
          router.push("/dashboard");
        }
      } catch (error) {
        console.error('Error updating shift:', error);
        toast({
          variant: 'destructive',
          description: 'Er is een fout opgetreden bij het bijwerken van de shift. Probeer het opnieuw.'
        });
        setLoading(false);
      }
    }
  }

  async function makeUnpublishedShift(values: z.infer<typeof createShiftValidation>) {
    setLoading(true)
    try {
      const unpublished = await maakOngepubliceerdeShift({
        opdrachtgever: bedrijfDetails._id,
        opdrachtgeverNaam: bedrijfDetails.displayname || 'Company',
        titel: values.title,
        functie: values.function,
        afbeelding: bedrijfDetails.profielfoto || values.image,
        uurtarief: values.hourlyRate,
        plekken: Number(values.spots), // Convert to number
        adres: values.adres || (() => {
          console.log('BedrijfDetails for unpublished shift address:', bedrijfDetails);
          const street = bedrijfDetails.street || bedrijfDetails.straat || '';
          const housenumber = bedrijfDetails.housenumber || bedrijfDetails.huisnummer || '';
          const city = bedrijfDetails.city || bedrijfDetails.stad || '';
          const postcode = bedrijfDetails.postcode || '';
          
          console.log('Unpublished shift address components:', { street, housenumber, city, postcode });
          
          const addressParts = [street, housenumber].filter(Boolean);
          const locationParts = [postcode, city].filter(Boolean);
          
          if (addressParts.length > 0 && locationParts.length > 0) {
            return `${addressParts.join(' ')}, ${locationParts.join(' ')}`;
          } else if (addressParts.length > 0) {
            return addressParts.join(' ');
          } else if (locationParts.length > 0) {
            return locationParts.join(' ');
          }
          return 'Adres niet beschikbaar';
        })(),
        begindatum: values.startingDate || new Date(),
        einddatum: values.endingDate || new Date(),
        begintijd: values.starting,
        eindtijd: values.ending,
        pauze: values.break,
        beschrijving: values.description,
        vaardigheden: typeof values.skills === 'string'
        ? values.skills.split(", ") // If it's a string, split it into an array
        : Array.isArray(values.skills)
          ? values.skills // If it's already an array, use it as is
          : [], // Default to an empty array if it's neither
        kledingsvoorschriften: typeof values.dresscode === "string" ? values.dresscode.split(", ") : [],
      })

      if(unpublished.succes){
        toast({
          variant: 'succes',
          description: `${components.forms.ShiftForm.ToastMessage1}`
        });
        setLoading(false);
        router.back();
      } else {
        toast({
          variant: 'destructive',
          description: `${components.forms.ShiftForm.Toastmessage2}`
        });
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Error creating unpublished shift:', error);
      toast({
        variant: 'destructive',
        description: 'Er is een fout opgetreden bij het aanmaken van de shift. Probeer het opnieuw.'
      });
      setLoading(false);
    }
  }

  const adres = bedrijfDetails
  ? `${bedrijfDetails.straat || ""} ${bedrijfDetails.huisnummer || ""}, ${bedrijfDetails.stad || ""}`
  : "locatie";

  useEffect(() => {
    const fetchShifts = async () => {
      try {
      const shifts = await fetchUnpublishedShifts(userId);
        console.log("Fetched shifts:", shifts);
        if(shifts && Array.isArray(shifts)){
        setShifts(shifts)
      } else {
        setShifts([])
        }
      } catch (error) {
        console.error("Error fetching shifts:", error);
        setShifts([]);
      }
    }
    fetchShifts();
  }, [userId, bedrijfDetails])

  useEffect(() => {
    const fetchStoredImages = async () => {
      if (userId) {
        try {
          console.log('🔍 ShiftForm - Fetching stored images for userId:', userId);
          console.log('🔍 ShiftForm - UserId type:', typeof userId);
          const images = await getUserImages(userId);
          console.log('🔍 ShiftForm - Received images:', images);
          console.log('🔍 ShiftForm - Images count:', images.length);
          setStoredImages(images);
        } catch (error) {
          console.error('❌ ShiftForm - Error fetching stored images:', error);
          setStoredImages([]); // Set empty array on error
        }
      } else {
        console.log('⚠️ ShiftForm - No userId available for fetching images');
        setStoredImages([]);
      }
    };
    fetchStoredImages();
  }, [userId]);

  // Update form fields when selectedShift changes
  useEffect(() => {
    if (selectedShift) {
      console.log('🔄 ShiftForm - Updating form with selected shift:', selectedShift);
      
      // Update all form fields with selected shift data
      setValue('title', selectedShift.title || '');
      setValue('function', selectedShift.function || '');
      setValue('description', selectedShift.description || '');
      setValue('adres', selectedShift.adres || '');
      setValue('image', selectedShift.image || '');
      setValue('hourlyRate', selectedShift.hourlyRate || 14);
      setValue('spots', selectedShift.spots || 1);
      setValue('skills', Array.isArray(selectedShift.skills) ? selectedShift.skills.join(', ') : selectedShift.skills || '');
      setValue('dresscode', Array.isArray(selectedShift.dresscode) ? selectedShift.dresscode.join(', ') : selectedShift.dresscode || '');
      setValue('break', selectedShift.break || '30 minuten');
      setValue('inFlexpool', selectedShift.inFlexpool || false);
      setValue('flexpoolId', selectedShift.flexpools?.toString() || '');
      
      // Update dates
      if (selectedShift.startingDate) {
        setValue('startingDate', new Date(selectedShift.startingDate));
      }
      if (selectedShift.endingDate) {
        setValue('endingDate', new Date(selectedShift.endingDate));
      }
      
      // Update times and local state
      if (selectedShift.starting) {
        setValue('starting', selectedShift.starting);
        setBegintijd(dayjs(selectedShift.starting));
      }
      if (selectedShift.ending) {
        setValue('ending', selectedShift.ending);
        setEindtijd(dayjs(selectedShift.ending));
      }
      
      // Update flexpool state
      setIsInFlexpool(selectedShift.inFlexpool || false);
    }
  }, [selectedShift, setValue]);

  // AI Fill functionality
  const { generateAIFillData, isLoading: aiLoading, error: aiError } = useAIFill({
    employer: bedrijfDetails || {},
    documentType: 'shift',
    existingDocuments: existingShifts,
    onSuccess: (data) => {
      console.log('🤖 AI Fill Success - Shift data:', data);
      
      // Fill form with AI-generated data
      setValue('title', data.title);
      setValue('function', data.function);
      setValue('description', data.description);
      setValue('skills', Array.isArray(data.skills) ? data.skills.join(', ') : data.skills);
      setValue('dresscode', Array.isArray(data.dresscode) ? data.dresscode.join(', ') : data.dresscode);
      setValue('hourlyRate', data.hourlyRate);
      setValue('spots', data.spots || 3);
      
      // Set address
      if (data.address) {
        setValue('adres', data.address);
      }
      
      // Set dates
      if (data.startingDate) {
        setValue('startingDate', new Date(data.startingDate));
      }
      if (data.endingDate) {
        setValue('endingDate', new Date(data.endingDate));
      }
      
      // Set times
      if (data.starting) {
        setValue('starting', data.starting);
        setBegintijd(dayjs(data.starting));
      }
      if (data.ending) {
        setValue('ending', data.ending);
        setEindtijd(dayjs(data.ending));
      }
      if (data.break) {
        setValue('break', data.break);
      }
      
      // Set flexpool data
      if (data.inFlexpool !== undefined) {
        setValue('inFlexpool', data.inFlexpool);
        setIsInFlexpool(data.inFlexpool);
      }
      if (data.flexpoolId) {
        setValue('flexpoolId', data.flexpoolId);
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

  const filteredShifts = shifts.filter(shift => {
    if (!shift || !shift.title) return false;
    try {
      const shiftTitle = `${shift.title.toLowerCase()}`;
      return shiftTitle.includes(query.toLowerCase());
    } catch (error) {
      console.error("Error filtering shift:", error, shift);
      return false;
    }
  });


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
    <Form {...form}>
      {type === 'maak' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 mt-4 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Select Existing Shift
          </h3>
              <Combobox
              as="div"
              value={selectedShift}
              onChange={(shift) => {
                setQuery('');
                setSelectedShift(shift);
              }}
            className="w-full"
          >
            <Label className="block text-sm font-medium text-gray-700 mb-3">
              {components.forms.ShiftForm.selectShifts || 'Choose a shift to use as template'}
            </Label>
            <div className="relative">
                <ComboboxInput
                className="h-12 w-full rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-12 text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  onChange={(event) => setQuery(event.target.value)}
                  onBlur={() => setQuery('')}
                displayValue={(shift: any) => shift ? `${shift.title}` : ''}
                placeholder="Search for existing shifts..."
                />
              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 focus:outline-none">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </ComboboxButton>
      
                {filteredShifts.length > 0 && (
                <ComboboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg bg-gray-50 border border-gray-200 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredShifts.map((shift) => (
                      <ComboboxOption
                      key={shift.title}
                        value={shift}
                      className="group relative cursor-default select-none py-3 pl-4 pr-9 text-gray-800 hover:bg-blue-50 data-[focus]:bg-blue-600 data-[focus]:text-white transition-colors"
                      >
                        <div className="flex items-center">
                        <img src={shift.image || "/placeholder-avatar.svg"} alt="profielfoto" className="h-6 w-6 flex-shrink-0 rounded-full" />
                        <span className="ml-3 truncate group-data-[selected]:font-semibold">{shift.title}</span>
                        </div>
      
                      <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-blue-600 group-data-[selected]:flex group-data-[focus]:text-white">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                )}
              </div>
            </Combobox>
        </div>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
        {/* Basic Information Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                  <FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                    {components.forms.ShiftForm.formItems[0]}
                  </FormLabel>
                <FormControl>
                  <Input 
                  placeholder={selectedShift ? selectedShift.title : `${components.forms.ShiftForm.PlaceholderTexts[0]}`}
                  {...field} 
                      className="h-12 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="function"
            render={({ field }) => (
              <FormItem className="w-full">
                  <FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                    {components.forms.ShiftForm.formItems[1]}
                  </FormLabel>
                <FormControl>
                    <div className="h-12 w-full overflow-hidden rounded-lg bg-white border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
                    <DropdownCategorie 
                      onChangeHandler={field.onChange}
                        value={field.value} 
                        components={components} 
                      />
                </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
        </div>

        {/* Description and Media Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Description & Media
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                  <FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                    {components.forms.ShiftForm.formItems[11] || 'Description'}
                  </FormLabel>
                  <FormControl>
                  <Textarea 
                  {...field}
                  placeholder={selectedShift ? selectedShift.description : `${components.forms.ShiftForm.PlaceholderTexts[1]}`}
                      className="min-h-[200px] px-4 py-3 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
              render={({ field }) => {
                console.log('FormField - field.value:', field.value);
                console.log('FormField - field.onChange:', typeof field.onChange);
                return (
              <FormItem className="w-full">
                    <FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                      Shift Image
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
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
                                setValue('image', e.target.value, { shouldValidate: true, shouldDirty: true });
                                field.onChange(e.target.value);
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
                          <div className="pl-60 pt-20 items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                            <FileUploader 
                              key={`${field.value || 'empty'}-${forceUpdate}`} // Force re-render when imageUrl changes
                              onFieldChange={(url) => {
                                console.log('FormField - onFieldChange called with URL:', url);
                                console.log('FormField - Current field.value before update:', field.value);
                                
                                // Multiple approaches to ensure update
                                setValue('image', url, { shouldValidate: true, shouldDirty: true });
                                console.log('FormField - setValue called with URL:', url);
                                
                                field.onChange(url);
                                console.log('FormField - field.onChange called');
                                
                                trigger('image');
                                console.log('FormField - trigger called');
                                
                                setSelectedStoredImage(''); // Clear stored image selection
                                
                                // Force a re-render
                                setTimeout(() => {
                                  setValue('image', url, { shouldValidate: true, shouldDirty: true });
                                  console.log('FormField - setTimeout setValue called with URL:', url);
                                  console.log('FormField - Field value after timeout:', field.value);
                                }, 50);
                              }} 
                              imageUrl={field.value || ''} 
                              setFiles={setFiles}
                              // Debug: Log the imageUrl prop being passed
                              {...(() => {
                                console.log('ShiftForm - Passing imageUrl to FileUploader:', field.value || '');
                                return {};
                              })()} 
                            />
                          </div>
                        </div>
                      </div>
                </FormControl>
                <FormMessage />
              </FormItem>
                );
              }}
          />
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Location
          </h3>
          <FormField
            control={form.control}
            name="adres"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-medium text-gray-700 mb-2 block">
                  Address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                    </div>
                    <Input
                     placeholder={selectedShift ? selectedShift.adres : `${components.forms.ShiftForm.PlaceholderTexts[2]}`} 
                     {...field} 
                      className="h-12 pl-10 pr-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="startingDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                  {components.forms.ShiftForm.formItems[5] || 'Start Date'}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                    </div>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      wrapperClassName="w-full"
                      className="h-12 pl-10 pr-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholderText="Select start date"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endingDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                  {components.forms.ShiftForm.formItems[6] || 'End Date'}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                    </div>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      wrapperClassName="w-full"
                      className="h-12 pl-10 pr-4 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholderText="Select end date"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
        <Controller
  control={form.control}
  name="starting"
  render={({ field }) => (
    <div className="w-full">
      <TimePicker
        label={`${components.forms.ShiftForm.formItems[8]}`}
        value={field.value ? dayjs(field.value) : begintijd}
        onChange={(newValue) => {
          const formattedTime = newValue ? newValue.format("HH:mm") : "08:00";
          setBegintijd(newValue); // Update local state for display
          field.onChange(formattedTime); // Update form state
        }}
      />
    </div>
  )}
/>

          <Controller
            control={form.control}
            name="ending"
            render={({ field }) => (
              <div className="w-full">
                <div className="">
                <TimePicker
          label={`${components.forms.ShiftForm.formItems[7]}`}
          value={field.value ? dayjs(field.value) : eindtijd}
          onChange={(newValue) => {
            const formattedTime = newValue ? newValue.format("HH:mm") : "08:00";
            setEindtijd(newValue);
            field.onChange(formattedTime); // Convert to ISO string
          }}
        />
                </div>
              </div>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
        <FormField
            control={form.control}
            name="break"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                  {components.forms.ShiftForm.formItems[9] || 'Break Duration'}
                </FormLabel>
                <FormControl>
                  <div className="h-12 w-full border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
                    <DropdownPauze 
                      onChangeHandler={field.onChange} 
                      value={field.value} 
                      options={[
                        { value: "0", label: `${components.shared.DropdownPauze.options[0].label}` },
                        { value: "15", label: `${components.shared.DropdownPauze.options[1].label}` },
                        { value: "30", label: `${components.shared.DropdownPauze.options[2].label}` },
                        { value: "45", label: `${components.shared.DropdownPauze.options[3].label}` },
                        { value: "60", label: `${components.shared.DropdownPauze.options[4].label}` },
                        { value: "90", label: `${components.shared.DropdownPauze.options[5].label}` },
                        { value: "120", label: `${components.shared.DropdownPauze.options[6].label}` }
                      ]} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hourlyRate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                  {components.forms.ShiftForm.formItems[3] || 'Hourly Rate'}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                    </div>
                    <Input
                      type="number"
                      placeholder={selectedShift ? selectedShift.hourlyRate as unknown as string : `${components.forms.ShiftForm.PlaceholderTexts[5]}`}
                      {...field}
                      className="h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="spots"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                  {components.forms.ShiftForm.formItems[10] || 'Available Spots'}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                    </div>
                    <Input
                      {...field}
                      type="number"
                      placeholder={selectedShift ? selectedShift.spots as unknown as string : `${components.forms.ShiftForm.PlaceholderTexts[6]}`}
                      className="h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Skills and Requirements Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Skills & Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                    {components.forms.ShiftForm.formItems[12] || 'Required Skills'}
                  </FormLabel>
                <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                  <Input
                    placeholder={components.forms.ShiftForm.PlaceholderTexts[7]}
                    {...field}
                        className="h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dresscode"
            render={({ field }) => (
              <FormItem className="w-full">
                  <FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                    {components.forms.ShiftForm.formItems[13] || 'Dress Code'}
                  </FormLabel>
                <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                  <Input
                    placeholder={components.forms.ShiftForm.PlaceholderTexts[8]}
                    {...field}
                        className="h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
        </div>

        {/* Flexpool Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Flexpool Options
          </h3>
          <div className="space-y-6">
          <FormField
            control={form.control}
            name="inFlexpool"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                    <div className="flex items-center space-x-3">
                    <Checkbox
                      onCheckedChange={(checked) => {
                        if (typeof checked === "boolean") {
                          field.onChange(checked);
                          setIsInFlexpool(checked);
                        }
                      }}
                      checked={field.value}
                      id="Flexpool"
                        className="h-5 w-5 border-2 border-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                    />
                      <label htmlFor="Flexpool" className="text-sm font-medium text-gray-700 cursor-pointer">
                        {components.forms.ShiftForm.formItems[14] || 'Add shift to flexpool'}
                      </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isInFlexpool && (
            <FormField
              control={form.control}
              name="flexpoolId"
              render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                      Select Flexpool
                    </FormLabel>
                  <FormControl>
                      <div className="w-full">
                  <Dropdown
                      onChangeHandler={field.onChange}
                      value={field.value}
                          flexpoolsList={bedrijfDetails?.flexpools || flexpools}
                          userId={bedrijfDetails._id} 
                          components={components} 
                        />
                      </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
                {type === 'maak' ? (
                  <>
                <Button 
                  type="button" 
                  onClick={() => {
                    const values = getValues();
                    makeUnpublishedShift(values);
                  }} 
                  disabled={loading} 
                  className="flex-1 h-12 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
              {loading ? `${components.forms.ShiftForm.buttonsTitle[0]}` : `${components.forms.ShiftForm.buttonsTitle[1]}`}
            </Button>
            
                <Button 
                  type="submit" 
                  disabled={form.formState.isSubmitting || bedrijfLoading || !bedrijfDetails} 
                  className="flex-1 h-12 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                {form.formState.isSubmitting ? `${components.forms.ShiftForm.buttonsTitle[2]}` : `${components.forms.ShiftForm.buttonsTitle[3]}`}
            </Button>
              </>
                ) : (
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting || bedrijfLoading || !bedrijfDetails} 
                className="w-full h-12 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                {form.formState.isSubmitting ? `${components.forms.ShiftForm.buttonsTitle[4]}` : `${components.forms.ShiftForm.buttonsTitle[5]}`}
              </Button>
              )}
          </div>
        </div>

      </form>
    </Form>
    </LocalizationProvider>
  )
});

export default ShiftForm;
