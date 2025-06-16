"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/app/[lang]/components/ui/button';
import Image from 'next/image';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/[lang]/components/ui/form";
import { Controller, useForm } from 'react-hook-form';
import { CheckoutValidation } from "@/app/lib/validations/checkout";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod';
import { Textarea } from '@/app/[lang]/components/ui/textarea';
import { haalcheckout, noShowCheckout, weigerCheckout, } from '@/app/lib/actions/checkout.actions';
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from 'dayjs';
import ReactStars from "react-rating-stars-component";
import DropdownPauze from '@/app/[lang]/components/shared/DropdownPauze';
import { useRouter } from 'next/navigation';
import DashNav from '@/app/[lang]/components/shared/navigation/Navigation';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/nl';
import { haalFreelancerVoorCheckout } from '@/app/lib/actions/employee.actions';
import { StarIcon } from '@heroicons/react/24/outline';
import { toast } from '@/app/[lang]/components/ui/use-toast';
import Checkbox from '@mui/material/Checkbox';
import React from 'react';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';

export type SearchParamProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
  isVisible: boolean;
  onClose: () => void;
}

export default async function Checkoutgegevens({ params: { id }, isVisible, onClose, lang }: SearchParamProps & { lang: Locale }) {
    if (!isVisible) return null;
    const { components } = await getDictionary(lang);
    const router = useRouter()
    const { control } = useForm();
    const [begintijd, setBegintijd] = useState<Dayjs | null>(dayjs('2022-04-17T15:30'));
    const [eindtijd, setEindtijd] = useState<Dayjs | null>(dayjs('2022-04-17T16:30'));
    const [checkout, setCheckout] = useState<any>(null);
    const [freelancer, setFreelancer] = useState<any>(null);
    const [accepteer, setAccepteer] = useState(true);
    const [checked, setChecked] = React.useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCheckout = async () => {
          try {
            setLoading(true);
            const data = await haalcheckout({ shiftId: id });
            setCheckout(data);
          } catch (error) {
            console.error('Failed to fetch checkout data:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchCheckout();
      }, [id]);

  useEffect(() => {
    const fetchCheckout = async () => {
      try {
        if (!checkout?.opdrachtnemer) {
            console.error('opdrachtnemer is null or undefined');
            return;
        }
        const data = await haalFreelancerVoorCheckout(checkout.opdrachtnemer);
        setFreelancer(data);
    } catch (error) {
        console.error('Failed to fetch checkout data:', error);
    }
};
    fetchCheckout();
}, [id, checkout]);


const DefaultValues = {
 begintijd: checkout?.begintijd || "" || eindtijd,
 eindtijd: checkout?.eindtijd || "" || eindtijd,
 pauze: checkout?.pauze || "30",
 rating: 5,
 opmerking: " ",
 feedback: " ",
 laat: false,
};

    const form = useForm<z.infer<typeof CheckoutValidation>>({
      resolver: zodResolver(CheckoutValidation),
      defaultValues: DefaultValues,
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
    };

   const handleNoShow = async (shiftId: string) => {
    try{
      await noShowCheckout({shiftId})
    } catch (error) {
      console.error('Failed to submit checkout:', error);
  }
  onClose()
  router.refresh();
   }
    
    async function onSubmit(values: z.infer<typeof CheckoutValidation>) {
      try {
        const response = await weigerCheckout(
          {
            shiftId: id, 
            rating: values.rating || 5,
            begintijd: values.begintijd || checkout?.begintijd || begintijd,
            eindtijd: values.eindtijd || checkout?.eindtijd || eindtijd,
            pauze: values.pauze ? values.pauze.toString() : checkout?.pauze?.toString() || "30",
            feedback: values.feedback || " ",
            opmerking: values.opmerking || " ",
            laat: false || values.laat,
          }
        )
        if (response.success) {
          toast({
            variant: 'succes',
            description: `${components.shared.CheckoutModal.ToastMessage1}`
          });
          onClose();
        } else {
          toast({
            variant: 'destructive',
            description: `${components.shared.CheckoutModal.ToastMessage2}`
          });
        }
      } catch (error) {
        console.error('Failed to submit checkout:', error);
        toast({
            variant: 'destructive',
            description: `${components.shared.CheckoutModal.ToastMessage3}`
          });
    }
    router.refresh();
  };

if (loading) return <p>Loading...</p>;

  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
    <DashNav lang={'en'} />
    <Form {...form}>
  <form
    onSubmit={form.handleSubmit(onSubmit)}
    className="fixed inset-0 mt-14 bg-black bg-opacity-25 backdrop-blur-lg flex justify-center items-center w-auto p-4 md:p-0"
  >
    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 overflow-y-auto"
    style={{ maxHeight: '90vh' }}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <Image
          className="rounded-full"
          src={freelancer?.profielfoto || "https://utfs.io/f/72e72065-b298-4ffd-b1a2-4d12b06230c9-n2dnlw.webp"}
          alt="profielfoto"
          width={64}
          height={48}
        />
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg font-semibold text-gray-800">{freelancer?.voornaam} {freelancer?.achternaam}</p>
          <p className="text-gray-500">{freelancer?.ratingCount} {components.shared.CheckoutModal.fieldLabels[0]}</p>
          <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                {freelancer?.rating ?  freelancer?.rating.toFixed(1) : 5}
                <StarIcon aria-hidden="true" className="h-4 w-5 text-gray-400" />
          </dd>
        </div>
        <Button className="bg-red-500 text-white border-2 border-red-500 hover:text-black" onClick={() => handleNoShow(id)}>
          {components.shared.CheckoutModal.buttons[4]}
        </Button>
      </div>

      {/* Date and Time Information */}
      <div className="my-4">
      <p className="text-sm font-semibold leading-6 text-gray-900">{components.shared.CheckoutModal.fieldLabels[1]}</p>
        <p className="text-gray-500 text-sm mt-1">{checkout?.begindatum ? new Date(checkout.begindatum).toLocaleDateString(`${components.shared.CheckoutModal.localDateString}`) : 'N/A'}, {checkout?.begintijd} - {checkout?.eindtijd}</p>
        <p className="text-gray-500 text-sm mt-1">{checkout?.pauze} {components.shared.CheckoutModal.fieldLabels[2]}</p>
        <p className="text-gray-500 text-sm mt-1">{components.shared.CheckoutModal.fieldLabels[3]}: {components.shared.CheckoutModal.currencySign}{checkout?.uurtarief} {components.shared.CheckoutModal.per_Uur}</p>
      </div>

      <div className="my-4">
        <p className="text-sm font-semibold leading-6 text-gray-900">{components.shared.CheckoutModal.fieldLabels[4]}</p>
        <p className="text-gray-500 text-sm mt-1">{ checkout?.begindatum ? new Date(checkout.begindatum).toLocaleDateString(`${components.shared.CheckoutModal.localDateString}`) : 'N/A' }, {checkout?.checkoutbegintijd} - { checkout?.checkouteindtijd }</p>
        <p className="text-gray-500 text-sm mt-1">{ checkout?.checkoutpauze || 30 } {components.shared.CheckoutModal.fieldLabels[2]}</p>
      </div>

      {/* Conditional Form Fields */}
     
  
    <div className="flex flex-col gap-5 md:flex-row">
      <Controller
        control={form.control}
        name="begintijd"
        render={({ field }) => (
          <div className="w-full">
            <TimePicker
              label={components.forms.VacancyForm.data.fieldLabels[3]}
              value={
                checkout && checkout.checkoutbegintijd && checkout.checkoutbegintijd !== ''
                  ? dayjs(checkout.checkoutbegintijd, "HH:mm")
                  : dayjs(checkout.begintijd || "08:00", "HH:mm") 
              }
              onChange={(newValue) => {
                console.log("Selected Time:", newValue ? newValue.format("HH:mm") : "08:00");
                const formattedTime = newValue ? newValue.format("HH:mm") : "08:00";
                setBegintijd(newValue); 
                field.onChange(formattedTime); 
              }}
            />
          </div>
        )}
      />
      <Controller
        control={form.control}
        name="eindtijd"
        render={({ field }) => (
          <div className="w-full">
            <TimePicker
              label={components.forms.VacancyForm.data.fieldLabels[4]}
              value={
                checkout && checkout.checkouteindtijd && checkout.checkouteindtijd !== ''
                  ? dayjs(checkout.checkouteindtijd, "HH:mm")
                  : dayjs(checkout.begintijd || "16:00", "HH:mm") 
              }
              onChange={(newValue) => {
                console.log("Selected Time:", newValue ? newValue.format("HH:mm") : "16:00");
                const formattedTime = newValue ? newValue.format("HH:mm") : "16:00";
                setEindtijd(newValue);
                field.onChange(formattedTime);
              }}
            />
          </div>
        )}
      />
    </div>

    <div className="w-full my-12 mx-48 text-center">
      <FormField
        control={form.control}
        name="pauze"
        render={({ field }) => (
          <FormItem className="mx-auto">
            <FormControl>
              <DropdownPauze onChangeHandler={field.onChange} value={field.value} lang={lang}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    <div className="w-full mx-auto flex flex-col items-center justify-center">
  <FormField
    control={form.control}
    name="laat"
    render={({ field }) => (
      <FormItem className="mx-auto">
        <FormControl className="flex flex-col items-center">
          {/* Wrap FormLabel and Checkbox in a fragment to ensure a single child */}
          <>
            <Checkbox
              checked={field.value || false} // Use `|| false` to provide a default value
              onChange={(event) => field.onChange(event.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <FormLabel className="text-gray-700 text-sm mb-2">{components.shared.CheckoutModal.fieldLabels[5]}</FormLabel>
          </>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>


              {/* Rating, Feedback, and Actions */}
                {/* Centered Rating Field */}
                <div className="justify-center w-full my-8 mx-36 text-center">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem className="w-full mx-auto">
                        <FormControl>
                          <ReactStars count={5} size={56} isHalf={true} activeColor="#ffd700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
        

    <div className="my-4">
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea placeholder="feedback" {...field} className="textarea rounded-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-4 mt-6">
      <Button className="bg-white text-black border-2 border-black hover:text-white" onClick={() => onClose()}>
                                {components.shared.CheckoutModal.buttons[3]}
      </Button>
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="bg-sky-500 text-white hover:bg-sky-600"
        >
          {form.formState.isSubmitting ? `${components.shared.CheckoutModal.buttons[0]}` : accepteer ? `${components.shared.CheckoutModal.buttons[1]}` : `${components.shared.CheckoutModal.buttons[2]}`}
        </Button>
      </div>
  </div>
  </form>
</Form>
    </LocalizationProvider>
    </>
  )
}

       