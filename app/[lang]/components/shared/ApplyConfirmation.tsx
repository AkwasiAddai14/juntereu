'use client'

import { useEffect, useState, useTransition } from 'react'
import Image from 'next/image'
import apply from "@/app/assets/images/edit.svg"
import spinner from "@/app/assets/images/spinner.svg"
import { haalShiftMetIdApply, reageerShift } from '@/app/lib/actions/shift.actions'
import { useToast } from '@/app/[lang]/components/ui/use-toast';
import { useUser } from '@clerk/nextjs'
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';


export const ApplyConfirmation = async ({ shiftId, lang }: { shiftId: string } & { lang: Locale }) => {
  let [isPending, startTransition] = useTransition()
  const [userId, setUserId] = useState(''); 
  const [shift, setShift] = useState<any>(null);
  const { toast } = useToast();
  const { user, isLoaded } = useUser();
  const { components } = await getDictionary(lang);
 
  useEffect(() => {
    if (isLoaded && user) {
     setUserId(user?.id)
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const fetchShift = async () => {
      const fetchedShift = await haalShiftMetIdApply(shiftId);
      setShift({
        ...fetchedShift,
        _id: fetchedShift._id.toString(), // Convert to string if not done already
        opdrachtgever: fetchedShift.opdrachtgever.toString(), // If needed
      });
    };
    
    fetchShift();
  }, [shiftId]);
  
  if (!shift) {
    return <p>Loading...</p>; // or a loading indicator
  }
  
  const shiftArrayId = shift._id;
  const freelancerId = userId;

  const handleAanmelden = async () => {
    try {
      const reageer = await reageerShift({shiftArrayId, freelancerId});
  
      if (reageer.success) {
        toast({
          variant: 'succes',
          description: `${components.shared.ApplyConfirmation.ToastMessage1}`
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: `${components.shared.ApplyConfirmation.ToastMessage2}`
      });
      console.log(error)
    }
  };

  return (
    <button
    className="rounded-md"
          onClick={() => startTransition(async () => {
            await handleAanmelden()}
            )}
            >
                {
                isPending ? 
                <Image src={spinner} alt="edit" width={20} height={20} />
                 : 
                <Image src={apply} alt="edit" width={20} height={20} />
                }
    </button>
  )
}