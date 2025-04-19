"use client"
 
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { reageerShift } from '@/app/lib/actions/shift.actions'
import { IShiftArray } from '@/app/lib/models/shiftArray.model'
import { useToast } from '@/app/[lang]/components/ui/use-toast';
import { useUser } from '@clerk/nextjs'




const AanmeldButton = ({ shift }: { shift: IShiftArray }) => {
  const [userId, setUserId] = useState('');
  const { toast } = useToast();
  const hasShiftFinished = /* new Date(shift.begindatum) < new Date(); */ false;
  const shiftArrayId = shift._id as string;
  const { isLoaded, user } = useUser();
  
  useEffect(() => {
    if (isLoaded && user) {
      setUserId(user.id);
    }
  }, [isLoaded, user]);
  
 
  const handleAanmelden = async () => {
    try {
      const reageer = await reageerShift({shiftArrayId, freelancerId: userId});
  
      if (reageer.success) {
        toast({
          variant: 'succes',
          description: "Aangemeld voor de shift! 👍"
        });
      }
      
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: "Actie is niet toegestaan! ❌"
      });
      console.log(error)
    }
  };

  return (
    <div className="flex items-center gap-3">
      {hasShiftFinished ? (
        <p className="p-2 text-red-400">Sorry, je kan je niet meer aanmelden voor de shift.</p>
      ): (
        <>
          <Button 
          className="button rounded-full" size="lg"
          onClick={() => handleAanmelden()}
          >
              Aanmelden
            </Button>
        </>
      )}
    </div>
  )
}

export default AanmeldButton;