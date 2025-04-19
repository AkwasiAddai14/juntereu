"use client"

import BedrijvenPage from "@/app/[lang]/components/shared/EmployerPage";
import ForbiddenPage from "@/app/[lang]/components/shared/ForbiddenPage";
import NotFoundPage from "@/app/[lang]/components/shared/NotFoundPage";
import WerknemerPage from "@/app/[lang]/components/shared/EmployeePage";
import { haalgebruikerMetId, haalVacatureMetId, haalDienstenMetId, haalSollicitatiesMetId } from "@/app/lib/actions/vacancy.actions";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export type SearchParamProps = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }

const vacaturePagina = ({ params: { id }, searchParams }: SearchParamProps) => {

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
        <ForbiddenPage />
      ) : gebruiker === 1 ? (
        <BedrijvenPage vacature={vacature} diensten={diensten} sollicitaties={sollicitaties} />
      ) : gebruiker === 2 ? (
        <WerknemerPage vacature={vacature} diensten={diensten}/>
      ) : (
        <NotFoundPage /> // Optional: Fallback for unexpected values
      );

      }

      export default vacaturePagina;
