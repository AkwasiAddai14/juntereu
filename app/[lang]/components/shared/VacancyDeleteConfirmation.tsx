'use client'

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {  AlertDialog,  AlertDialogAction,  
  AlertDialogCancel,  AlertDialogContent, 
  AlertDialogDescription,  AlertDialogFooter,  
  AlertDialogHeader,  AlertDialogTitle,  
  AlertDialogTrigger 
} from '@/app/[lang]/components/ui/alert-dialog';
import del from "@/app/assets/images/delete.svg";
import { verwijderVacature } from '@/app/lib/actions/vacancy.actions';
import { useToast } from '@/app/[lang]/components/ui/use-toast';

export const VacancyDeleteConfirmation = ({
  vacancyId,
  lang,
  dictionary,
}: {
  vacancyId: string;
  lang: string;
  dictionary: any;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  let [isPending, startTransition] = useTransition();
  const [vacancy, setVacancy] = useState<any>(null);
  const components = dictionary?.components || {};

  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        // We don't need to fetch the vacancy details for deletion
        // Just set a placeholder to show the dialog
        setVacancy({ _id: vacancyId });
      } catch (error) {
        console.error("Error preparing vacancy deletion:", error);
      }
    };

    fetchVacancy();
  }, [vacancyId]);

  const handleDelete = async () => {
    try {
      const result = await verwijderVacature(vacancyId);
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        
        // Redirect to dashboard or refresh the page
        router.push('/dashboard');
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting vacancy:", error);
      toast({
        title: "Error",
        description: "Er ging iets mis bij het verwijderen van de vacature.",
        variant: "destructive",
      });
    }
  };

  if (!vacancy) {
    return <p>Loading...</p>;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Image src={del} alt="delete" width={20} height={20} />
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {components?.shared?.VacancyDeleteConfirmation?.DialogText?.[0] || 'Delete Vacancy'}
          </AlertDialogTitle>
          <AlertDialogDescription className="p-regular-16 text-grey-600">
            {components?.shared?.VacancyDeleteConfirmation?.DialogText?.[1] || 'Are you sure you want to delete this vacancy? This action cannot be undone and will also delete all related jobs and applications.'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            {components?.shared?.VacancyDeleteConfirmation?.buttons?.[0] || 'Cancel'}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              startTransition(async () => {
                await handleDelete();
              })
            }
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? 
              `${components?.shared?.VacancyDeleteConfirmation?.buttons?.[1] || 'Deleting...'}` : 
              `${components?.shared?.VacancyDeleteConfirmation?.buttons?.[2] || 'Delete Vacancy'}`
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
};
