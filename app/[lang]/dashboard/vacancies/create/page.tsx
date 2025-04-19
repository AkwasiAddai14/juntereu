"use client"

import { useUser } from "@clerk/nextjs";
import VacatureForm from "@/app/[lang]/components/shared/forms/VacancyForm"
import DashNav from "@/app/[lang]/components/shared/navigation/Navigation";
import Footer from "@/app/[lang]/components/shared/navigation/Footer4";


const MaakVacature = () => {
  const { user } = useUser();
 

  const userId = user?.id as string;

  return (
    <>
    <DashNav />
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper font-bold text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] text-center sm:text-left">Nieuwe shift</h3>
      </section>
      <div className="wrapper my-8">
        <VacatureForm userId={userId} type="maak" />
      </div>
    <Footer />
    </>
  )
}

export default MaakVacature;