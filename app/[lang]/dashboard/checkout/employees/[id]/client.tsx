"use client"


import * as z from 'zod';
import 'dayjs/locale/nl';
import Image from 'next/image';
import dayjs, { Dayjs } from 'dayjs';
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import ReactStars from "react-rating-stars-component";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/app/[lang]/components/ui/button';
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { toast } from '@/app/[lang]/components/ui/use-toast';
import { Textarea } from '@/app/[lang]/components/ui/textarea';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import logo from '@/app/assets/images/178884748_padded_logo.png';
import { CheckoutValidation } from "@/app/lib/validations/checkout";
import { haalShiftMetIdCard } from '@/app/lib/actions/shift.actions';
import DashNav from '@/app/[lang]/components/shared/navigation/Wrappers/NavigationWrapper';
//import { AuthorisatieCheck } from '@/app/[lang]/dashboard/AuthorisatieCheck';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { noShowCheckout, vulCheckout } from '@/app/lib/actions/checkout.actions';
import DropdownPauze from '@/app/[lang]/components/shared/Wrappers/DropdownPauze';
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/app/[lang]/components/ui/form";
import { getDictionary } from '@/app/[lang]/dictionaries';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];




export type SearchParamProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
  lang: Locale;
  id: string;
}


export default async function CheckoutCard({ params: { id }, searchParams }: SearchParamProps) {
  const lang = supportedLocales.includes(searchParams.lang as Locale) ? (searchParams.lang as Locale): 'en';
  const { dashboard, components } = await getDictionary(lang)
    const router = useRouter();
    const { control } = useForm();
    const [begintijd, setBegintijd] = useState<Dayjs | null>(dayjs('2022-04-17T08:00'));
    const [eindtijd, setEindtijd] = useState<Dayjs | null>(dayjs('2022-04-17T16:30'));
    const [checkout, setCheckout] = useState<any>(null);
    const [isBedrijf, setIsBedrijf] = useState(false);
    const { isLoaded, isSignedIn, user } = useUser();
    const [geauthoriseerd, setGeauthoriseerd] = useState<Boolean>(false);

    /* const isGeAuthorizeerd = async (id:string) => {
      const toegang = await AuthorisatieCheck(id, 3);
      setGeauthoriseerd(toegang);
    }
  
    isGeAuthorizeerd(id);
  
    if(!geauthoriseerd){
      return <h1>403 - Forbidden</h1>
    } */

    useEffect(() => {
      if (!isLoaded) return;
  
      if (!isSignedIn) {
        router.push("./sign-in");
        console.log("Niet ingelogd");
        alert(`${dashboard.Checkout.employer.ToastMessage1}`);
        return;
      }
  
      const userType = user?.organizationMemberships.length ?? 0;
      setIsBedrijf(userType >= 1);
    }, [isLoaded, isSignedIn, router, user]);
  
    if(isBedrijf){
      router.push('/dashboard');
    }

    useEffect(() => {
        const fetchCheckout = async () => {
            try {
                const data = await haalShiftMetIdCard(id);
                setCheckout(data);
            } catch (error) {
                console.error('Failed to fetch checkout data:', error);
            }
        };

        fetchCheckout();
    }, [id]);

    const DefaultValues = {
      begintijd: checkout?.begintijd || "",
      eindtijd: checkout?.eindtijd || "",
      pauze: checkout?.pauze || "30",
      rating: 5,
      opmerking: " ",
      feedback: " ",
    };
  
      const form = useForm<z.infer<typeof CheckoutValidation>>({
        resolver: zodResolver(CheckoutValidation),
        defaultValues: DefaultValues,
      })

    async function onSubmit(values: z.infer<typeof CheckoutValidation>) {
        try {
          const response = await vulCheckout({
                shiftId : id,
                rating: values.rating || 5,
                begintijd: values.begintijd || checkout?.begintijd,
                eindtijd: values.eindtijd || checkout?.eindtijd,
                pauze: values.pauze ? values.pauze.toString() : checkout?.pauze?.toString() || "30",
                feedback: values.feedback || " ",
                opmerking: values.opmerking || " "
            });
            if (response.success) {
              toast({
                variant: 'succes',
                description: `${dashboard.Checkout.employees.ToastMessage1}`
              });
              router.back();
            } else {
              toast({
                variant: 'destructive',
                description: `${dashboard.Checkout.employees.ToastMessage2}`
              });
            }
        } catch (error) {
            console.error('Failed to submit checkout:', error);
        }
    }

    const handleNoShow = async (shiftId: string) => {
      try {
        const response = await noShowCheckout({ shiftId: shiftId });
        if (response.success) {
          toast({
            variant: 'succes',
            description: `
              \n
              ${response.message}
              ${dashboard.Checkout.employees.ToastMessage1}
              `
          });
          router.back()
        }
      } catch (error: any) {
        toast({
          variant: 'destructive',
          description: `${dashboard.Checkout.employees.ToastMessage2}`
        });
      }
    };

    if (!checkout) {
        return <div>Loading...</div>;
    }

    console.log(form.formState.errors);

    return (
      <>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="nl">
          <DashNav lang={lang} />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="fixed inset-0 mt-14 bg-black bg-opacity-25 backdrop-blur-lg flex justify-center items-center overflow-hidden w-auto px-4 md:px-0"
            >
              <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
                {/* Image & Title Section */}
                <div className="flex justify-between items-center gap-4 pb-4 border-b border-gray-200">
                  <Image
                    className="object-cover rounded-lg w-16 h-16"
                    src={checkout?.afbeelding || logo}
                    alt="afbeelding"
                    width={64}
                    height={64}
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {checkout?.opdrachtgeverNaam || `${dashboard.Checkout.employees.FormFieldItems[1]}`} - {checkout?.functie || `${dashboard.Checkout.employees.FormFieldItems[2]}`}
                    </p>
                    <p className="text-gray-500">{checkout?.adres || `${dashboard.Checkout.employees.FormFieldItems[3]}`}</p>
                  </div>
                  <Button
                    className="bg-white text-red-800 border border-red-300 hover:bg-gray-100"
                    onClick={() => handleNoShow(checkout._id)}
                  >
                    {dashboard.Checkout.employees.FormFieldItems[4]}
                  </Button>
                </div>
    
                {/* Date & Time Information */}
                <div className="mt-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>
                      {checkout?.begindatum ? new Date(checkout.begindatum).toLocaleDateString() : `${dashboard.Checkout.employees.FormFieldItems[5]}`},{' '}
                      {checkout?.begintijd || `${dashboard.Checkout.employees.FormFieldItems[6]}`} - {checkout?.eindtijd || `${dashboard.Checkout.employees.FormFieldItems[7]}`}
                    </span>
                    <span>{checkout?.pauze || 0}  {dashboard.Checkout.employees.FormFieldItems[9]}</span>
                  </div>
                  <div className="text-gray-500 text-sm mt-1">
                    <p>{dashboard.Checkout.employees.FormFieldItems[9]} {dashboard.currencySign}{checkout?.uurtarief || '14.00'} </p>
                  </div>
                </div>
    
                <div className="flex flex-col gap-5 md:flex-row">
                  <Controller
                    control={form.control}
                    name="begintijd"
                    render={({ field }) => (
                      <div className="w-full">
                        <TimePicker
                          label={dashboard.Checkout.employees.FormFieldItems[6]}
                          value={
                            checkout && checkout.checkoutbegintijd && checkout.checkoutbegintijd !== ''
                              ? dayjs(checkout.checkoutbegintijd, "HH:mm")
                              : dayjs(checkout.begintijd || "08:00", "HH:mm") // Default fallback to "08:00"
                          }
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
                    name="eindtijd"
                    render={({ field }) => (
                      <div className="w-full">
                        <TimePicker
                          label={dashboard.Checkout.employees.FormFieldItems[7]}
                          value={
                            checkout && checkout.checkouteindtijd && checkout.checkouteindtijd !== ''
                              ? dayjs(checkout.checkouteindtijd, "HH:mm")
                              : dayjs(checkout.begintijd || "08:00", "HH:mm") // Default fallback to "08:00"
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
    
                {/* Centered Dropdown for Pauze */}
                <div className="w-full my-12 mx-48 text-center">
                  <FormField
                    control={form.control}
                    name="pauze"
                    render={({ field }) => (
                      <FormItem className="mx-auto">
                        <FormControl>
                          <DropdownPauze onChangeHandler={field.onChange} value={field.value} lang={lang} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
    
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
    
                {/* Comments Section */}
                <div className="my-4">
        <FormField
          control={form.control}
          name="opmerking"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea placeholder={dashboard.Checkout.employees.FormFieldItems[10]} {...field} className="textarea rounded-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    
                {/* Buttons */}
                <div className="flex justify-between mt-6">
                  <Button className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-100" onClick={() => router.back()}>
                    {components.forms.AvailabilityForm.Buttons[0]}
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => console.log('Button Clicked')}
                  >
                    {form.formState.isSubmitting ? `${dashboard.Checkout.employees.FormFieldItems[11]}` : `${dashboard.Checkout.employees.FormFieldItems[12]}`}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </LocalizationProvider>
      </>
    );    
}