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
import { haalShiftMetIdDelete, verwijderShiftArray } from '@/app/lib/actions/shift.actions';

export const DeleteConfirmation = ({
  shiftId,
  lang,
  dictionary,
}: {
  shiftId: string;
  lang: string;
  dictionary: any;
}) => {
  const pathname = usePathname()
  let [isPending, startTransition] = useTransition()
  const [shift, setShift] = useState<any>(null);
  const components = dictionary?.components || {};

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
          <AlertDialogTitle>{components?.shared?.DeleteConfirmation?.DialogText?.[0] || 'Delete Confirmation'}</AlertDialogTitle>
          <AlertDialogDescription className="p-regular-16 text-grey-600">
            {components?.shared?.DeleteConfirmation?.DialogText?.[1] || 'Are you sure you want to delete this item?'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{components?.shared?.DeleteConfirmation?.buttons?.[0] || 'Cancel'}</AlertDialogCancel>

          {shiftArrayId ? (
            <AlertDialogAction
              onClick={() =>
                startTransition(async () => {
                  await verwijderShiftArray({ shiftArrayId, forceDelete: true, path: pathname || "/dashboard" })
                })
              }>
              {isPending ? `${components?.shared?.DeleteConfirmation?.buttons?.[1] || 'Deleting...'}` : `${components?.shared?.DeleteConfirmation?.buttons?.[2] || 'Delete'}`}
            </AlertDialogAction>
          ) : (
            <p>{components?.shared?.DeleteConfirmation?.ToastMessage1 || 'No shift found'}</p>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
};
