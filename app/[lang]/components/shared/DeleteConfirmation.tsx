'use client'

import { useEffect, useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {  AlertDialog,  AlertDialogAction,  
  AlertDialogCancel,  AlertDialogContent, 
  AlertDialogDescription,  AlertDialogFooter,  
  AlertDialogHeader,  AlertDialogTitle,  
  AlertDialogTrigger 
} from '@/app/[lang]/components/ui/alert-dialog';
import del from "@/app/assets/images/delete.svg";
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { haalShiftMetIdDelete, verwijderShiftArray } from '@/app/lib/actions/shift.actions'

export const DeleteConfirmation = async ({ shiftId, lang }: { shiftId: string } & { lang: Locale }) => {
  const pathname = usePathname()
  let [isPending, startTransition] = useTransition()
  const [shift, setShift] = useState<any>(null);
  const { components } = await getDictionary(lang);

  useEffect(() => {
    const fetchShift = async () => {
      const fetchedShift = await haalShiftMetIdDelete(shiftId);
      setShift(fetchedShift);
    };

    fetchShift();
  }, [shiftId]);

  if (!shift) {
    return <p>Loading...</p>; // or a loading indicator
  }

  const shiftArrayId = shift._id;

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Image src={del} alt="edit" width={20} height={20} />
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>{components.shared.DeleteConfirmation.DialogText[0]}</AlertDialogTitle>
          <AlertDialogDescription className="p-regular-16 text-grey-600">
            {components.shared.DeleteConfirmation.DialogText[1]}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{components.shared.DeleteConfirmation.buttons[0]}</AlertDialogCancel>

          {shiftArrayId ? (
            <AlertDialogAction
              onClick={() =>
                startTransition(async () => {
                  await verwijderShiftArray({ shiftArrayId, forceDelete: true, path: pathname || "/dashboard" })
                })
              }>
              {isPending ? `${components.shared.DeleteConfirmation.buttons[1]}` : `${components.shared.DeleteConfirmation.buttons[2]}`}
            </AlertDialogAction>
          ) : (
            <p>{components.shared.DeleteConfirmation.ToastMessage1}</p>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
