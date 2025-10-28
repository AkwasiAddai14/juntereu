'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, UserIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface Application {
  _id: string;
  status: string;
  jobs: Array<{
    jobId: string;
    date: string;
    amount: string;
    starting: string;
    ending: string;
    break: number;
  }>;
  employees: {
    employeeId: string;
    name: string;
    profilephoto: string;
    rating: number;
    bio: string;
    dateOfBirth: string;
    shifts: number;
    city: string;
    email: string;
    phone: string;
  };
}

interface ApplicationsCarouselProps {
  shiftId: string;
  lang: string;
  dictionary: any;
}

export default function ApplicationsCarousel({ shiftId, lang, dictionary }: ApplicationsCarouselProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`/api/shift/${shiftId}/applications`);
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        } else {
          console.error('Failed to fetch applications');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (shiftId) {
      fetchApplications();
    }
  }, [shiftId]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === applications.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? applications.length - 1 : prevIndex - 1
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
            <UserIcon className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-black mb-2">
            {dictionary?.dashboard?.Applications?.noApplications || 'No Applications Yet'}
          </h3>
          <p className="text-black">
            {dictionary?.dashboard?.Applications?.noApplicationsDescription || 'No one has applied for this shift yet.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-black">
          {dictionary?.dashboard?.Applications?.title || 'Applications'} ({applications.length})
        </h3>
        {applications.length > 1 && (
          <div className="flex space-x-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ChevronRightIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {applications.map((application, index) => (
            <div key={application._id} className="w-full flex-shrink-0 px-4">
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Profile Photo */}
                  <div className="flex-shrink-0">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden">
                      {application.employees.profilephoto ? (
                        <Image
                          src={application.employees.profilephoto}
                          alt={application.employees.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-black truncate">
                          {application.employees.name}
                        </h4>
                        <p className="text-sm text-black">
                          {application.employees.city} • {calculateAge(application.employees.dateOfBirth)} years old
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-medium text-black">
                          {application.employees.rating || 5.0}
                        </span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-black mt-3 line-clamp-2">
                      {application.employees.bio || 'No bio available'}
                    </p>

                    {/* Job Details */}
                    <div className="mt-4 space-y-3">
                      {application.jobs.map((job, jobIndex) => (
                        <div key={jobIndex} className="bg-gray-50 rounded-md p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-black">
                                {formatDate(job.date)}
                              </p>
                              <p className="text-xs text-black">
                                {job.starting} - {job.ending} ({job.break}min break)
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-green-600">
                                €{job.amount}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Contact Info */}
                    <div className="mt-4 flex space-x-4 text-xs text-black">
                      <span>{application.employees.email}</span>
                      <span>{application.employees.phone}</span>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        application.status === 'accepted' 
                          ? 'bg-green-100 text-green-800'
                          : application.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {applications.length > 1 && (
        <div className="flex justify-center mt-6 space-x-3">
          {applications.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
