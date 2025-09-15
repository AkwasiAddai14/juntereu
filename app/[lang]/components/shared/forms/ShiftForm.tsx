"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/app/[lang]/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/[lang]/components/ui/form";
import { Input } from "@/app/[lang]/components/ui/input";
import { createShiftValidation } from "@/app/lib/validations/shift";
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


const ShiftForm = ({ userId, type, shift, shiftId, components }: ShiftFormProps & { components: any }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [begintijd, setBegintijd] = useState<Dayjs | null>(dayjs('2022-04-17T08:00'));
  const [eindtijd, setEindtijd] = useState<Dayjs | null>(dayjs('2022-04-17T16:30'));
  const [flexpools, setFlexpools] = useState<IFlexpool[]>([]);
  const [isInFlexpool, setIsInFlexpool] = useState(false);
  const [bedrijfDetails, setBedrijfDetails] = useState<any>(null);
  const [query, setQuery] = useState('');
  const [shifts, setShifts] = useState<any[]>([]);
  const [selectedShift, setSelectedShift] = useState<IShiftArray | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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

  const form = useForm<z.infer<typeof createShiftValidation>>({
    resolver: zodResolver(createShiftValidation),
    defaultValues: initialValues,
  });

  const { handleSubmit, control, getValues } = form;

  async function onSubmit(values: z.infer<typeof createShiftValidation>) {
    if (!bedrijfDetails || !bedrijfDetails._id || !bedrijfDetails.displaynaam) {
      console.error("Bedrijf details are not properly loaded.");
      return;
    }
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
          opdrachtgeverNaam: bedrijfDetails.displaynaam,
          titel: values.title,
          functie: values.function,
          afbeelding: values.image,
          uurtarief: Number(values.hourlyRate),
          plekken: Number(values.spots), // Convert to number
          adres:  `${bedrijfDetails.straat} ${bedrijfDetails.huisnummer}, ${bedrijfDetails.stad}` || values.adres,
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
          router.back();
        }
      } catch (error) {
        console.log(error);
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
          opdrachtgeverNaam: bedrijfDetails.displaynaam,
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
          router.push("/dashboard");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function makeUnpublishedShift(values: z.infer<typeof createShiftValidation>) {
    setLoading(true)
    try {
      const unpublished = await maakOngepubliceerdeShift({
        opdrachtgever: bedrijfDetails._id,
        opdrachtgeverNaam: bedrijfDetails.displaynaam,
        titel: values.title,
        functie: values.function,
        afbeelding: bedrijfDetails.profielfoto || values.image,
        uurtarief: values.hourlyRate,
        plekken: Number(values.spots), // Convert to number
        adres: `${bedrijfDetails.stad}, ${bedrijfDetails.straat}, ${bedrijfDetails.huisnummer}` || values.adres,
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
      }
    } catch (error: any) {
      console.error(`${components.forms.ShiftForm.ToastMessage3}`, error);
      toast({
        variant: 'destructive',
        description: `${error}`
      });
    }
  }

  const adres = bedrijfDetails
  ? `${bedrijfDetails.straat || ""} ${bedrijfDetails.huisnummer || ""}, ${bedrijfDetails.stad || ""}`
  : "locatie";

  useEffect(() => {
    const fetchShifts = async () => {
      const shifts = await fetchUnpublishedShifts(userId);
      if(shifts){
        setShifts(shifts)
      } else {
        setShifts([])
      }
    }
    fetchShifts();
  }, [shifts, bedrijfDetails])

  const filteredShifts = shifts.filter(shifts => {
    const shiftTitel = `${shifts.titel.toLowerCase()}`;
    return shiftTitel.includes(query.toLowerCase());
  });


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
    <Form {...form}>
      {type === 'maak' && (
              <Combobox
              as="div"
              value={selectedShift}
              onChange={(shift) => {
                setQuery('');
                setSelectedShift(shift);
              }}
              className="mb-10"
            >
              <Label className="block text-sm font-medium leading-6 text-gray-900">{components.forms.ShiftForm.selectShifts}</Label>
              <div className="relative mt-2">
                <ComboboxInput
                  className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  onChange={(event) => setQuery(event.target.value)}
                  onBlur={() => setQuery('')}
                  displayValue={(shift: any) => shift ? `${shift.titel} ` : ''}
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </ComboboxButton>
      
                {filteredShifts.length > 0 && (
                  <ComboboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredShifts.map((shift) => (
                      <ComboboxOption
                        key={shift.titel}
                        value={shift}
                        className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-sky-600 data-[focus]:text-white"
                      >
                        <div className="flex items-center">
                          <img src={shift.afbeelding} alt="profielfoto" className="h-6 w-6 flex-shrink-0 rounded-full" />
                          <span className="ml-3 truncate group-data-[selected]:font-semibold">{shift.titel}</span>
                        </div>
      
                        <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-sky-600 group-data-[selected]:flex group-data-[focus]:text-white">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                )}
              </div>
            </Combobox>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                 <FormLabel className="justify-end font-semibold">{components.forms.ShiftForm.formItems[0]}</FormLabel>
                <FormControl>
                  <Input 
                  placeholder={selectedShift ? selectedShift.title : `${components.forms.ShiftForm.PlaceholderTexts[0]}`}
                  defaultValue={selectedShift ? selectedShift.title : undefined} 
                  {...field} 
                  className="input-field" />
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
                <FormLabel>{components.forms.ShiftForm.formItems[1]}</FormLabel>
                <FormControl>
                <div className="flex-center  h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                <DropdownCategorie 
                      onChangeHandler={field.onChange}
                      value={selectedShift ? selectedShift.function : field.value} components={undefined}                />
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
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <Textarea 
                  {...field}
                  placeholder={selectedShift ? selectedShift.description : `${components.forms.ShiftForm.PlaceholderTexts[1]}`}
                  defaultValue={selectedShift ? selectedShift.description : undefined } 
                  className="textarea rounded-2xl" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <FileUploader onFieldChange={field.onChange} imageUrl={selectedShift ? selectedShift.image : field.value} setFiles={setFiles} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="adres"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                  </svg>
                    <Input
                     placeholder={selectedShift ? selectedShift.adres : `${components.forms.ShiftForm.PlaceholderTexts[2]}`} 
                     defaultValue={selectedShift ? selectedShift.adres : undefined}
                     {...field} 
                     className="input-field" />
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
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                  </svg>
                    <p className="whitespace-nowrap text-grey-600">{components.forms.ShiftForm.formItems[6]}</p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      wrapperClassName="datePicker"
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
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                  </svg>

                    <p className="whitespace-nowrap text-grey-600">{components.forms.ShiftForm.formItems[7]}</p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date | null) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      wrapperClassName="datePicker"
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
        value={selectedShift ? dayjs(selectedShift.starting) : begintijd}
        onChange={(newValue) => {
          console.log("Selected Time:", newValue ? newValue.format("HH:mm") : "08:00");
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
          label={`${components.forms.ShiftForm.formItems[9]}`}
          value={selectedShift ? dayjs(selectedShift.ending) : eindtijd}
          onChange={(newValue) => {
            console.log("Selected Time:", newValue ? newValue.format("HH:mm") : "08:00");
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
                <FormLabel>{components.forms.ShiftForm.formItems[10]}</FormLabel>
                <FormControl>
                <div className="flex-center  h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 mr-3">
                <path fillRule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
               </svg>
               <DropdownPauze onChangeHandler={field.onChange} value={selectedShift ? selectedShift.break as unknown as string : field.value} options={[]} />
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
                <FormLabel>{components.forms.ShiftForm.formItems[4]}</FormLabel>
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 mr-3">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.902 7.098a3.75 3.75 0 0 1 3.903-.884.75.75 0 1 0 .498-1.415A5.25 5.25 0 0 0 8.005 9.75H7.5a.75.75 0 0 0 0 1.5h.054a5.281 5.281 0 0 0 0 1.5H7.5a.75.75 0 0 0 0 1.5h.505a5.25 5.25 0 0 0 6.494 2.701.75.75 0 1 0-.498-1.415 3.75 3.75 0 0 1-4.252-1.286h3.001a.75.75 0 0 0 0-1.5H9.075a3.77 3.77 0 0 1 0-1.5h3.675a.75.75 0 0 0 0-1.5h-3c.105-.14.221-.274.348-.402Z" clipRule="evenodd" />
                  </svg>
                    <Input
                      type="number"
                      placeholder={selectedShift ? selectedShift.hourlyRate as unknown as string : `${components.forms.ShiftForm.PlaceholderTexts[5]}`}
                      { ...field}
                      defaultValue={selectedShift ? selectedShift.hourlyRate : undefined}
                      className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                <FormLabel>{components.forms.ShiftForm.formItems[11]}</FormLabel>
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 mr-3">
                  <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
                  </svg>
                    <Input
                      {...field}
                      type="number"
                      placeholder={selectedShift ? selectedShift.spots as unknown as string : `${components.forms.ShiftForm.PlaceholderTexts[6]}`}
                      defaultValue={selectedShift ? selectedShift.spots : undefined}
                      className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
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
            name="skills"
            render={({ field }) => (
              <FormItem className="w-full justify-end">
                 <FormLabel className="justify-end font-semibold">{components.forms.ShiftForm.formItems[13]}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={components.forms.ShiftForm.PlaceholderTexts[7]}
                    {...field}
                    className="input-field"
                  />
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
                <FormLabel>{components.forms.ShiftForm.formItems[14]}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={components.forms.ShiftForm.PlaceholderTexts[8]}
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormMessage />
               
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="inFlexpool"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <label htmlFor="Flexpool" className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {components.forms.ShiftForm.formItems[15]}
                    </label>
                    <Checkbox
                      onCheckedChange={(checked) => {
                        if (typeof checked === "boolean") {
                          field.onChange(checked);
                          setIsInFlexpool(checked);
                        }
                      }}
                      checked={field.value}
                      id="Flexpool"
                      className="mr-2 h-5 w-5 border-2 border-primary-500"
                    />
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
                  <FormControl>
                  <Dropdown
                      onChangeHandler={field.onChange}
                      value={field.value}
                      flexpoolsList={bedrijfDetails?.flexpools || flexpools} // Pass an array of objects
                      userId={bedrijfDetails._id} components={undefined}                  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

                {type === 'maak' ? (
                  <>
            <Button type="button" onClick={() => {
              const values = getValues(); // Get form values
              makeUnpublishedShift(values);}} size="lg" disabled={loading} className="button col-span-2 w-full">
              {loading ? `${components.forms.ShiftForm.buttonsTitle[0]}` : `${components.forms.ShiftForm.buttonsTitle[1]}`}
            </Button>
            
            <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="button col-span-2 w-full bg-white text-sky-500 border-sky-500 border-2">
                {form.formState.isSubmitting ? `${components.forms.ShiftForm.buttonsTitle[2]}` : `${components.forms.ShiftForm.buttonsTitle[3]}`}
            </Button>

              </>
                ) : (
              <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="button col-span-2 w-full">
                {form.formState.isSubmitting ? `${components.forms.ShiftForm.buttonsTitle[4]}` : `${components.forms.ShiftForm.buttonsTitle[5]}`}
              </Button>
              )}

      </form>
    </Form>
    </LocalizationProvider>
  )
}

export default ShiftForm;
