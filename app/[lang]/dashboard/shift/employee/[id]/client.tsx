"use client"

import Image from 'next/image';
import { useUser } from "@clerk/nextjs"
import { UserIcon } from '@heroicons/react/20/solid';
import calendar from '@/app/assets/images/calendar.svg';
import location from '@/app/assets/images/location-grey.svg'
import Collection from '@/app/[lang]/components/employees/Collection';
import { checkAlreadyApplied } from '@/app/lib/actions/shift.actions'
import AanmeldButton from '@/app/[lang]/components/employees/AanmeldButton';
import { haalFreelancerVoorAdres } from '@/app/lib/actions/employee.actions';
import DashNav from '@/app/[lang]/components/shared/navigation/Wrappers/NavigationWrapper';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key, useState, useEffect } from 'react';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { AuthorisatieCheck } from '@/app/[lang]/dashboard/AuthorisatieCheck';


type Props = {
  lang: Locale;
  dashboard: any;
  shift: any;
  relatedEvents: { data: any[]; totalPages: number };
};


const shiftDetails = ({ lang, dashboard, shift, relatedEvents }: Props) => {
  
  const [hasApplied, setHasApplied] = useState(false);
  const { isLoaded, user } = useUser();
  const [freelancerId, setFreelancerId] = useState<string>("");
  const [profielfoto, setProfilePhoto] = useState<string>("");
  const [geauthoriseerd, setGeauthoriseerd] = useState<Boolean>(false);

  useEffect(() => {
    if (isLoaded && user) {
      setProfilePhoto(user?.imageUrl);
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (isLoaded && user && shift?.id) {
        try {
          const toegang = await AuthorisatieCheck(shift.id, 1);
          setGeauthoriseerd(toegang);
        } catch (error) {
          console.error('Authorization check failed:', error);
          setGeauthoriseerd(false);
        }
      }
    };

    checkAuthorization();
  }, [isLoaded, user, shift?.id]);

  useEffect(() => {
    const getFreelancerId = async () => {
      try {
        const opdrachtnemer = await haalFreelancerVoorAdres(user!.id);
        if (opdrachtnemer) {
          setFreelancerId(opdrachtnemer._id.toString());
        } else{
          console.log("geen freelancerId gevonden.")
        }
      } catch (error) {
        console.error("Error fetching freelancer by Clerk ID:", error);
      }
    };
  
    if (user && !freelancerId) {  // Only fetch if user exists and freelancerId is not already set
      getFreelancerId();
    }
  }, [user, freelancerId])

  useEffect(()=>{
    const fetchApplied = async () => {
      const applied = await checkAlreadyApplied({ freelancerObjectId: freelancerId,
        shiftArrayObjectId: shift.id,})
      setHasApplied(applied);
    }
    fetchApplied();
  }, [freelancerId])
  
  // Show loading or unauthorized message
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-medium">Loading shift details...</p>
        </div>
      </div>
    );
  }

  if (!geauthoriseerd) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-red-100 text-xl">You don't have permission to view this shift.</p>
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
    
    {/* Hero Section */}
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-[500px] overflow-hidden animate-fade-in">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative">
              <Image 
                src={shift.afbeelding}
                alt="hero image"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl object-cover w-full h-[350px] lg:h-[450px] transform group-hover:scale-105 transition duration-700"
              />
              <div className="absolute top-6 right-6">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border ${
                  shift.inFlexpool 
                    ? 'bg-green-500/20 text-green-100 border-green-400/30' 
                    : 'bg-gray-500/20 text-gray-100 border-gray-400/30'
                }`}>
                  {shift.inFlexpool ? '✨ Flexpool' : '🔒 Private'}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 text-white">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/20">
                  {shift.opdrachtgeverNaam}
                </span>
                <span className="px-4 py-2 bg-green-500/20 backdrop-blur-sm text-green-100 rounded-full text-sm font-medium border border-green-400/30">
                  {shift.functie}
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {shift.titel}
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                {shift.beschrijving?.substring(0, 120)}...
              </p>
            </div>

            {/* Key Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <span className="text-green-300 font-bold text-lg">€</span>
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs font-medium">Hourly Rate</p>
                    <p className="text-xl font-bold text-white">{shift.uurtarief}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <UserIcon className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs font-medium">Available Spots</p>
                    <p className="text-xl font-bold text-white">
                      {shift.plekken - shift.aanmeldingen.length} / {shift.plekken}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            {shift.status === "beschikbaar" && shift.beschikbaar && !hasApplied && (
              <div className="pt-6">
                <AanmeldButton shift={shift} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

    {/* Main Content */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shift Details */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.02] animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Image src={calendar} alt="calendar" width={20} height={20} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Shift Details</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition duration-300">
                <div className="p-3 bg-blue-500 rounded-lg shadow-md">
                  <Image src={calendar} alt="calendar" width={20} height={20} />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900 mb-1">
                    {new Date(shift.begindatum).toLocaleDateString('nl-NL', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-blue-600 font-medium text-base">
                    {shift.begintijd} - {shift.eindtijd}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100 hover:shadow-md transition duration-300">
                <div className="p-3 bg-red-500 rounded-lg shadow-md">
                  <Image src={location} alt="location" width={20} height={20} />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900 mb-1">Location</p>
                  <p className="text-red-600 font-medium text-base">{shift.adres}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100 hover:shadow-md transition duration-300">
                <div className="p-3 bg-purple-500 rounded-lg shadow-md">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900 mb-1">Applications</p>
                  <p className="text-purple-600 font-medium text-base">
                    {shift.aanmeldingen.length} {dashboard.Shift.employee.FormFieldItems[1]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.02] animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                <span className="text-white font-bold text-lg">📝</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {dashboard.Shift.employee.FormFieldItems[3]}
              </h2>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-base">
                {shift.beschrijving}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Skills & Requirements */}
        <div className="space-y-6">
          {/* Skills */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.02] animate-slide-up" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                <span className="text-white font-bold text-lg">🎯</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {dashboard.Shift.employer.FormFieldItems[4]}
              </h3>
            </div>
            <div className="space-y-2">
              {shift.vaardigheden?.map((vaardigheid: string, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100 hover:shadow-md transition duration-300">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-sm"></div>
                  <span className="text-gray-800 font-medium text-base">{vaardigheid}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dress Code */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 hover:scale-[1.02] animate-slide-up" style={{animationDelay: '0.6s'}}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                <span className="text-white font-bold text-lg">👔</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {dashboard.Shift.employer.FormFieldItems[5]}
              </h3>
            </div>
            <div className="space-y-2">
              {shift.kledingsvoorschriften?.map((kleding: string, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100 hover:shadow-md transition duration-300">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-sm"></div>
                  <span className="text-gray-800 font-medium text-base">{kleding}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Related Shifts */}
    <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <span className="text-white font-bold text-2xl">🔍</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              {dashboard.Shift.employee.FormFieldItems[4]}
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover more opportunities like this one and expand your professional network
          </p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
          <Collection 
            data={relatedEvents?.data}
            emptyTitle="Geen relevante shifts gevonden"
            emptyStateSubtext="Kom later nog eens terug"
            collectionType="All_Events"
            limit={36}
            page={1}
            totalPages={relatedEvents?.totalPages} 
            lang={lang}
          />
        </div>
      </div>
    </section>
    </>
  )
}

export default shiftDetails;