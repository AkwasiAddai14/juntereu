"use client"

import NavBar from '@/app/[lang]/components/shared/navigation/NavBar';
import Footer from '@/app/[lang]/components/shared/navigation/Footer';
import Testimonials from "@/app/[lang]/components/homepage/Testimonials";
import {Faqs}  from "@/app/[lang]/components/homepage/FAQs";
import { Features }  from "@/app/[lang]/components/homepage/Features";
import Branches from "@/app/[lang]/components/homepage/Branches";
import  Hero  from "@/app/[lang]/components/homepage/HeroSection";
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'

export default function Home() {
/*   const { isLoaded, user } = useUser();
  const router = useRouter();
 


  useEffect(() => {
    if (isLoaded && user) {
      router.push('/dashboard', { scroll: false }) // Navigate to the dashboard if the user is signed in
    }
  }, [isLoaded, user]);
 */
  return (
    <main>
      <NavBar lang={'en'}/>
      <Hero lang={"en"}/> 
      <Features lang={"en"}/>
      <Branches lang={"en"}/>
       <Testimonials lang={"en"}/> 
      <Faqs lang={"en"}/>
      <Footer lang={"en"}/>
    </main>
  );
}