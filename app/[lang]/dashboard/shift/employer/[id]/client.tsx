"use client"

import { AanmeldingenSectie } from '@/app/[lang]/components/employers/AanmeldingenSectie';
import { AangenomenSectie } from '@/app/[lang]/components/employers/Aangenomen';
import { haalShiftMetId } from '@/app/lib/actions/shift.actions'
import Image from 'next/image';
import calendar from '@/app/assets/images/calendar.svg';
import location from '@/app/assets/images/location-grey.svg'
import { UserIcon } from '@heroicons/react/20/solid';
import DashNav from '@/app/[lang]/components/shared/navigation/Wrappers/NavigationWrapper';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from 'react';
import { AuthorisatieCheck } from '@/app/[lang]/dashboard/AuthorisatieCheck';
import ApplicationsCarousel from '@/app/[lang]/components/shared/ApplicationsCarousel';
import React, { useState, useEffect } from 'react';
import { IShiftArray } from '@/app/lib/models/shiftArray.model';
import { FlattenMaps } from 'mongoose';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'da', 'no', 'lu',
  'sv', 'at', 'nlBE', 'frBE', 'itCH', 'frCH', 'deCH',
];



export type SearchParamProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

interface ShiftDetailsClientProps {
  id: string;
  lang: Locale;
  dashboard: any;
  shift: any;
}

const shiftDetails = ({ id, lang, dashboard, shift: shiftData }: ShiftDetailsClientProps) => {
  
  const [toegang, setToegang] = useState<boolean | null>(null);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        console.log('Checking authorization for shift ID:', id);
        
        // First, get the shift data to check the employer
        const response = await fetch(`/api/shift/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch shift data');
        }
        const shiftData = await response.json();
        console.log('Shift data:', shiftData);
        
        if (!shiftData) {
          console.log('Shift not found');
          setToegang(false);
          return;
        }
        
        // Check if the current user is the employer of this shift
        if (user && shiftData.employer) {
          // Get the current user's employer record
          const response = await fetch('/api/get-employer-by-clerk-id', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clerkId: user.id }),
          });
          
          if (response.ok) {
            const employerData = await response.json();
            console.log('Current user employer data:', employerData);
            console.log('Shift employer ID:', shiftData.employer);
            console.log('Current user employer ID:', employerData._id);
            
            const isAuthorized = employerData._id === shiftData.employer;
            console.log('Authorization result:', isAuthorized);
            setToegang(isAuthorized);
          } else {
            console.log('Failed to get employer data');
            setToegang(false);
          }
        } else {
          console.log('No user or shift employer found');
          setToegang(false);
        }
      } catch (error) {
        console.error('Authorization check failed:', error);
        console.error('Error details:', error);
        setToegang(false);
      }
    };

    if (id && user) {
    checkAuthorization();
    }
  }, [id, user]);

  if (toegang === null) {
    // Show a loading indicator while checking authorization
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-medium">Loading shift details...</p>
        </div>
      </div>
    );
  }

  if (!toegang) {
    // Show 403 Forbidden if not authorized
    console.log('User not authorized, showing error page');
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-red-100 text-xl mb-6">You don't have permission to view this shift.</p>
          <button 
            onClick={() => router.push(`/${lang}/dashboard`)}
            className="px-6 py-3 bg-white text-red-900 font-bold rounded-lg hover:bg-gray-100 transition duration-300"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render the regular page if authorized
  if (!shiftData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-4xl font-bold text-white mb-4">Shift Not Found</h1>
          <p className="text-red-100 text-xl">The requested shift could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <style jsx>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { 
          opacity: 0; 
          transform: translateY(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      
      .animate-fade-in {
        animation: fadeIn 0.8s ease-out;
      }
      
      .animate-slide-up {
        animation: slideUp 0.6s ease-out forwards;
        opacity: 0;
      }
    `}</style>
    <DashNav lang={lang}/>
    
    {/* Applications Carousel - Top */}
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <ApplicationsCarousel 
          shiftId={shiftData._id as string} 
          lang={lang} 
          dictionary={dashboard}
        />
      </div>
    </div>
    
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-[500px] overflow-hidden animate-fade-in">
          {/* Enhanced background elements for better visibility */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/30 to-purple-600/30"></div>
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative">
              <Image 
                src={shiftData.image}
                alt="hero image"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl object-cover w-full h-[350px] lg:h-[450px] transform group-hover:scale-105 transition duration-700"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-10 text-white">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <span className="relative px-8 py-4 bg-white/95 text-black rounded-full text-lg font-bold border-2 border-white/80 shadow-2xl backdrop-blur-sm group-hover:shadow-3xl transition-all duration-300 flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">👤</span>
                    </div>
                    {shiftData.employerName}
                  </span>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/40 to-emerald-500/40 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <span className="relative px-8 py-4 bg-green-500/95 text-black rounded-full text-lg font-bold border-2 border-green-400/80 shadow-2xl backdrop-blur-sm group-hover:shadow-3xl transition-all duration-300 flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-black/20 to-black/10 rounded-full flex items-center justify-center">
                      <span className="text-black text-sm">💼</span>
                    </div>
                    {shiftData.function}
                  </span>
                </div>
              </div>
              <h1 className="text-6xl lg:text-7xl font-black mb-10 leading-tight text-white drop-shadow-2xl relative">
                <span className="text-black absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-sm"></span>
                <span className="relative z-10 bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
                 
                </span>
              </h1>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-3xl blur-lg"></div>
                <p className="text-black relative z-10 text-2xl leading-relaxed bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-md px-8 py-6 rounded-3xl border-2 border-white/60 shadow-2xl font-bold">
                  {/* {shiftData.description?.substring(0, 120)}... */}
                  {shiftData.title}
                </p>
              </div>
            </div>

            {/* Key Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Hourly Rate Card */}
              <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-green-200 group-hover:scale-110 transition-all duration-300">
                      <span className="text-white font-bold text-2xl">€</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">+</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">Hourly Rate</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">€{shiftData.hourlyRate}</p>
                    <p className="text-xs text-gray-500 mt-1">per hour</p>
                  </div>
                </div>
              </div>

              {/* Available Spots Card */}
              <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-200 group-hover:scale-110 transition-all duration-300">
                      <UserIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{shiftData.spots}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">Available</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{shiftData.spots}</p>
                    <p className="text-xs text-gray-500 mt-1">spots left</p>
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 ${
                      shiftData.inFlexpool 
                        ? 'bg-gradient-to-br from-purple-500 to-purple-600 group-hover:shadow-purple-200' 
                        : 'bg-gradient-to-br from-gray-500 to-gray-600 group-hover:shadow-gray-200'
                    }`}>
                      <span className="text-white text-2xl">
                        {shiftData.inFlexpool ? '✨' : '🔒'}
                      </span>
                    </div>
                    <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                      shiftData.inFlexpool ? 'bg-purple-400' : 'bg-gray-400'
                    }`}>
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">Status</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {shiftData.inFlexpool ? 'Flexpool' : 'Private'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {shiftData.inFlexpool ? 'Open to all' : 'Invite only'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Duration Card */}
              <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-orange-200 group-hover:scale-110 transition-all duration-300">
                      <span className="text-white text-2xl">⏰</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">h</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">Duration</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {shiftData.starting} - {shiftData.ending}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.abs(new Date(shiftData.endingDate).getTime() - new Date(shiftData.startingDate).getTime()) / (1000 * 60 * 60)} hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Main Content */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* Shift Details */}
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-10 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] animate-slide-up">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Image src={calendar} alt="calendar" width={32} height={32} className="text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900">Shift Details</h2>
          </div>

            <div className="space-y-10">
              <div className="flex items-center gap-10 p-10 bg-white rounded-3xl hover:shadow-2xl transition duration-300 shadow-xl">
                <div className="p-6 bg-blue-600 rounded-3xl shadow-xl">
                  <Image src={calendar} alt="calendar" width={40} height={40} />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 mb-3">
                    {new Date(shiftData.startingDate).toLocaleDateString(`${dashboard.localDateString}`)}
                  </p>
                  <p className="text-gray-900 font-black text-2xl">
                    {shiftData.starting} - {shiftData.ending}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-10 p-10 bg-white rounded-3xl hover:shadow-2xl transition duration-300 shadow-xl">
                <div className="p-6 bg-red-600 rounded-3xl shadow-xl">
                  <Image src={location} alt="location" width={40} height={40} />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 mb-3">Location</p>
                  <p className="text-gray-900 font-black text-2xl">{shiftData.adres}</p>
                </div>
              </div>

              <div className="flex items-center gap-10 p-10 bg-white rounded-3xl hover:shadow-2xl transition duration-300 shadow-xl">
                <div className="p-6 bg-purple-600 rounded-3xl shadow-xl">
                  <UserIcon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 mb-3">Available Spots</p>
                  <p className="text-gray-900 font-black text-2xl">
                    {shiftData.spots} {dashboard.Shift.employer.FormFieldItems[2]}
                  </p>
                </div>
              </div>
              </div>
            </div>

          {/* Description */}
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-10 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                <span className="text-white font-bold text-2xl">📝</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                {dashboard.Shift.employer.FormFieldItems[6]}
              </h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-900 leading-relaxed text-2xl font-bold bg-gray-100 p-8 rounded-3xl shadow-xl">
                {shiftData.description}
              </p>
            </div>
          </div>
            </div>

        {/* Right Column - Skills & Requirements */}
        <div className="space-y-16">
          {/* Skills */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-300 p-12 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] animate-slide-up" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center gap-6 mb-10">
              <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl shadow-xl">
                <span className="text-white font-black text-3xl">🎯</span>
              </div>
              <h3 className="text-4xl font-black text-gray-900">
                {dashboard.Shift.employer.FormFieldItems[4]}
              </h3>
            </div>
            <div className="space-y-6">
              {shiftData.skills?.map((vaardigheid: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, index: Key | null | undefined) => (
                <div key={index} className="flex items-center gap-8 p-8 bg-white rounded-3xl hover:shadow-xl transition duration-300 shadow-lg">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg"></div>
                  <span className="text-gray-900 font-black text-2xl">{vaardigheid}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dress Code */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-300 p-12 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] animate-slide-up" style={{animationDelay: '0.6s'}}>
            <div className="flex items-center gap-6 mb-10">
              <div className="p-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl shadow-xl">
                <span className="text-white font-black text-3xl">👔</span>
              </div>
              <h3 className="text-4xl font-black text-gray-900">
                {dashboard.Shift.employer.FormFieldItems[5]}
              </h3>
            </div>
            <div className="space-y-6">
              {shiftData.dresscode?.map((kleding: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined, index: Key | null | undefined) => (
                <div key={index} className="flex items-center gap-8 p-8 bg-white rounded-3xl hover:shadow-xl transition duration-300 shadow-lg">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg"></div>
                  <span className="text-gray-900 font-black text-2xl">{kleding}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Applications and Accepted Sections */}
    <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl shadow-lg">
              <span className="text-white font-bold text-3xl">👥</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900">
              Applications & Team Management
            </h2>
          </div>
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
            Manage your shift applications and accepted team members
          </p>
            </div>

        <div className="space-y-16">
          {/* Accepted Members Section */}
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-10 animate-slide-up" style={{animationDelay: '0.8s'}}>
            <AangenomenSectie shiftId={shiftData._id as string}/>
          </div>
          
          {/* Applications Section - Original */}
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-10 animate-slide-up" style={{animationDelay: '1.0s'}}>
            <AanmeldingenSectie shiftId={shiftData._id as string}/>
          </div>
        </div>
      </div>
    </section>

    </>
  )
}

export default shiftDetails;