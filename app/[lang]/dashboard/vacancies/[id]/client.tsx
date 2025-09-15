"use client"

import BedrijvenPage from "@/app/[lang]/components/shared/Wrappers/EmployerPage";
import ForbiddenPage from "@/app/[lang]/components/shared/ForbiddenPage";
import NotFoundPage from "@/app/[lang]/components/shared/NotFoundPage";
import WerknemerPage from "@/app/[lang]/components/shared/Wrappers/EmployeePage";
import { haalgebruikerMetId, haalVacatureMetId, haalDienstenMetId, haalSollicitatiesMetId } from "@/app/lib/actions/vacancy.actions";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys


const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];

type Props = {
  id: string;
  lang: Locale;
  dictionary: any;
};

const vacaturePagina = ({ id, lang, dictionary }: Props) => {
    
    const { isLoaded, user } = useUser();
    const [loading, setLoading] = useState(true);
    const [vacature, setVacature] = useState<any>(null);
    const [diensten, setDiensten] = useState<any>(null);
    const [sollicitaties, setSollicitaties] = useState<any>(null);
    const [userId, setUserId] = useState<string>("");
    const [gebruiker, setGebruiker] = useState<number>(0);
    
 
  useEffect(() => {
    if (isLoaded && user) {
        setUserId(user?.id)
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const bepaalGebruiker = async () => {
      if (!id) return; // Voorkom onnodige aanroepen
  
      try {
        const result = await haalgebruikerMetId(userId);
        if (result.type === 'bedrijf') {
          setGebruiker(1); // Bedrijf
        } else if (result.type === 'freelancer') {
          setGebruiker(2); // Freelancer
        } else {
          setGebruiker(0); // Geen van beide
        }
      } catch (error) {
        console.error("Error user details:", error);
        setGebruiker(3);
      }
    };
  
    bepaalGebruiker();
  }, [id]);


  useEffect(() => {
    const fetchVacvatureDetails = async () => {
      try {
        const VacatureDetails = await haalVacatureMetId(id);
        setVacature(VacatureDetails);
        }
        catch (error) {
            console.error("Error fetching vacature details:", error);
          }
    };

    fetchVacvatureDetails();
  }, [id]);

  useEffect(() => {
    const fetchVacvatureDetails = async () => {
      try {
        const diensten = await haalDienstenMetId(id);
        setDiensten(diensten);
        }
        catch (error) {
            console.error("Error fetching diensten details:", error);
          }
    };

    fetchVacvatureDetails();
  }, [id]);

  useEffect(() => {
    const fetchVacvatureDetails = async () => {
      try {
        const sollicitaties = await haalSollicitatiesMetId(id);
        setSollicitaties(sollicitaties);
        }
        catch (error) {
            console.error("Error fetching sollicitatie details:", error);
          }
    };

    fetchVacvatureDetails();
  }, [id]);

    if (vacature && gebruiker !== 3){
        setLoading(false)
    }

    if (loading) {
        return  <div>Loading...</div>
      }

      return gebruiker === 0 ? (
        <ForbiddenPage lang={lang} />
      ) : gebruiker === 1 ? (
        <BedrijvenPage vacature={vacature} diensten={diensten} sollicitaties={sollicitaties} lang={lang} />
      ) : gebruiker === 2 ? (
        <WerknemerPage vacature={vacature} diensten={diensten} lang={lang} />
      ) : (
        <NotFoundPage lang={lang} /> // Optional: Fallback for unexpected values
      );

      }

      export default vacaturePagina;
