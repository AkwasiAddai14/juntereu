'use client'


import { useEffect, useState } from "react";
import { Field, Label, Switch, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { haalFreelancer, addWorkExperience, updateWorkExperience, deleteWorkExperience, addEducation, updateEducation, deleteEducation, updateProfilePhoto } from "@/app/lib/actions/employee.actions";
import * as React from "react";
import { getDictionary } from '@/app/[lang]/dictionaries';
import { useUser } from "@clerk/nextjs";
import { getFallbackData } from '@/app/[lang]/lib/fallbackData';
import { showErrorToast } from '@/app/[lang]/lib/errorHandler';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { FileUploader } from '@/app/[lang]/components/shared/FileUploader';
import { ProfilePhotoUploader } from './ProfilePhotoUploader';



interface ProfileClientProps {
  dashboard: any;
}

export default function Profile({ dashboard }: ProfileClientProps) {
  const { isLoaded, user } = useUser();
  const [freelancerId, setFreelancerId] = useState<any>(null);
  const [freelancer, setFreelancer] = useState<any>(null);
  const [automaticTimezoneEnabled, setAutomaticTimezoneEnabled] = useState(true);
  
  // Modal states
  const [isWorkExperienceModalOpen, setIsWorkExperienceModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingWorkExperience, setEditingWorkExperience] = useState<any>(null);
  const [editingEducation, setEditingEducation] = useState<any>(null);
  
  // Data states
  const [workExperiences, setWorkExperiences] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Photo upload states
  const [files, setFiles] = useState<File[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [photoLoading, setPhotoLoading] = useState(false);

  // Helper function to get fallback data
  const getData = (field: string) => {
    return getFallbackData(field, { freelancer, user });
  };

  // Helper function to format date of birth as dd-mm-yyyy
  const formatDateOfBirth = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if invalid
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original if formatting fails
    }
  };

  // Modal handlers
  const openWorkExperienceModal = (experience?: any) => {
    setEditingWorkExperience(experience || null);
    setIsWorkExperienceModalOpen(true);
  };

  const openEducationModal = (education?: any) => {
    setEditingEducation(education || null);
    setIsEducationModalOpen(true);
  };

  const closeWorkExperienceModal = () => {
    setIsWorkExperienceModalOpen(false);
    setEditingWorkExperience(null);
  };

  const closeEducationModal = () => {
    setIsEducationModalOpen(false);
    setEditingEducation(null);
  };

  const saveWorkExperience = async (data: any) => {
    if (!user?.id) {
      showErrorToast('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      if (editingWorkExperience) {
        // Update existing
        await updateWorkExperience(user.id, editingWorkExperience._id, data);
        setWorkExperiences(prev => 
          prev.map(exp => exp._id === editingWorkExperience._id ? { ...exp, ...data } : exp)
        );
      } else {
        // Add new
        const newExperience = await addWorkExperience(user.id, data);
        setWorkExperiences(prev => [...prev, newExperience]);
      }
      closeWorkExperienceModal();
    } catch (error) {
      console.error('Error saving work experience:', error);
      showErrorToast('Failed to save work experience');
    } finally {
      setLoading(false);
    }
  };

  const saveEducation = async (data: any) => {
    if (!user?.id) {
      showErrorToast('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      if (editingEducation) {
        // Update existing
        await updateEducation(user.id, editingEducation._id, data);
        setEducations(prev => 
          prev.map(edu => edu._id === editingEducation._id ? { ...edu, ...data } : edu)
        );
      } else {
        // Add new
        const newEducation = await addEducation(user.id, data);
        setEducations(prev => [...prev, newEducation]);
      }
      closeEducationModal();
    } catch (error) {
      console.error('Error saving education:', error);
      showErrorToast('Failed to save education');
    } finally {
      setLoading(false);
    }
  };

  // Photo upload handler
  const handlePhotoChange = async (url: string) => {
    if (!user?.id) {
      showErrorToast('User not authenticated');
      return;
    }

    setPhotoLoading(true);
    try {
      await updateProfilePhoto(user.id, url);
      setProfilePhoto(url);
      showErrorToast('Profile photo updated successfully!');
    } catch (error) {
      console.error('Error updating profile photo:', error);
      showErrorToast('Failed to update profile photo');
    } finally {
      setPhotoLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      setFreelancerId(user?.id)
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const getFreelancerId = async () => {
      try {
        const freelancer = await haalFreelancer(user!.id);
        if (freelancer) {
          setFreelancer(freelancer);
          
          // Load work experiences and educations from database
          setWorkExperiences(freelancer.experience || []);
          setEducations(freelancer.education || []);
          
          // Load profile photo
          setProfilePhoto(freelancer.profilephoto || '');
        } else{
          showErrorToast("User profile not found. Please complete your profile setup.");
        }
      } catch (error) {
        showErrorToast("Failed to load user profile. Please try again.");
      }
    };
    if (user && !freelancerId) {  // Only fetch if user exists and freelancerId is not already set
      getFreelancerId();
    }
  }, [freelancerId]);


  return (
    <>
        <main className="px-6 py-16 sm:px-8 lg:flex-auto lg:px-4 lg:py-20">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
              <h2 className="text-base/7 font-semibold text-gray-900">{dashboard.werknemersPage.BentoGrid.profiel.headTitle}</h2>
              <p className="mt-1 text-sm/6 text-gray-500">
                {dashboard.werknemersPage.BentoGrid.profiel.subTitle}
              </p>

              <dl className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
                <div className="py-6 sm:flex">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                    <div className="col-span-full flex items-center gap-x-8">
                      <div className="size-24 flex-none rounded-lg bg-gray-800 object-cover overflow-hidden">
                        {profilePhoto ? (
                          <img
                            alt="Profile photo"
                            src={profilePhoto}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <ProfilePhotoUploader
                          imageUrl={profilePhoto}
                          onFieldChange={handlePhotoChange}
                          setFiles={setFiles}
                          loading={photoLoading}
                        />
                        <p className="mt-2 text-xs/5 text-gray-400">{dashboard.werknemersPage.BentoGrid.profiel.placeholderTextButton}</p>
                      </div>
                    </div>
                    </div>
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{dashboard.werknemersPage.BentoGrid.profiel.formItems[0]}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{getData('firstName')} {getData('infix')} {getData('lastName')}</div>
                    {/* <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Update
                    </button> */}
                  </dd>
                </div>
                <div className="py-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{dashboard.werknemersPage.BentoGrid.profiel.formItems[1]}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{getData('email')}</div>
                    <button type="button" className="font-semibold text-sky-600 hover:text-sky-500">
                      {dashboard.werknemersPage.BentoGrid.profiel.taalendata.button}
                    </button>
                  </dd>
                </div>
                <div className="py-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{dashboard.werknemersPage.BentoGrid.profiel.formItems[2]}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{getData('phoneNumber')}</div>
                    <button type="button" className="font-semibold text-sky-600 hover:text-sky-500">
                    {dashboard.werknemersPage.BentoGrid.profiel.taalendata.button}
                    </button>
                  </dd>
                </div>
                <div className="py-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{dashboard.werknemersPage.BentoGrid.profiel.formItems[3]}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{formatDateOfBirth(getData('dateOfBirth'))}</div>
                    {/* <button type="button" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Update
                    </button> */}
                  </dd>
                </div>
                <div className="py-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{dashboard.werknemersPage.BentoGrid.profiel.formItems[4]}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{getData('street')}</div>
                    <button type="button" className="font-semibold text-sky-600 hover:text-sky-500">
                    {dashboard.werknemersPage.BentoGrid.profiel.taalendata.button}
                    </button>
                  </dd>
                </div>
                <div className="py-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{dashboard.werknemersPage.BentoGrid.profiel.formItems[5]}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{getData('housenumber')}</div>
                    <button type="button" className="font-semibold text-sky-600 hover:text-sky-500">
                    {dashboard.werknemersPage.BentoGrid.profiel.taalendata.button}
                    </button>
                  </dd>
                </div>
                <div className="py-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">IBAN</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">{getData('iban')}</div>
                    <button type="button" className="font-semibold text-sky-600 hover:text-sky-500">
                    {dashboard.werknemersPage.BentoGrid.profiel.taalendata.button}
                    </button>
                  </dd>
                </div>

                <Field className="flex pt-6">
                  <Label as="dt" passive className="flex-none pr-6 font-medium text-gray-900 sm:w-64">
                  {dashboard.werknemersPage.BentoGrid.profiel.formItems[6]}
                  </Label>
                  <dd className="flex flex-auto items-center justify-end">
                    <Switch
                      checked={automaticTimezoneEnabled}
                      onChange={setAutomaticTimezoneEnabled}
                      className="group flex w-8 cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 data-[checked]:bg-sky-600"
                    >
                      <span
                        aria-hidden="true"
                        className="size-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                      />
                    </Switch>
                  </dd>
                </Field>

                <Field className="flex pt-6">
                  <Label as="dt" passive className="flex-none pr-6 font-medium text-gray-900 sm:w-64">
                  {dashboard.werknemersPage.BentoGrid.profiel.formItems[7]}
                  </Label>
                  <dd className="flex flex-auto items-center justify-end">
                    <Switch
                      checked={automaticTimezoneEnabled}
                      onChange={setAutomaticTimezoneEnabled}
                      className="group flex w-8 cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 data-[checked]:bg-sky-600"
                    >
                      <span
                        aria-hidden="true"
                        className="size-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                      />
                    </Switch>
                  </dd>
                </Field>
              </dl>
            </div>

            <div>
              <h2 className="text-base/7 font-semibold text-gray-900">{dashboard.werknemersPage.BentoGrid.profiel.werkervaring.headTitle}</h2>
              <p className="mt-1 text-sm/6 text-gray-500">{dashboard.werknemersPage.BentoGrid.profiel.werkervaring.subTitle}</p>

              <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
                {workExperiences.map((experience, index) => (
                  <li key={experience._id || experience.id || `experience-${index}`} className="flex justify-between gap-x-6 py-6">
                    <div className="font-medium text-gray-900">{experience.bedrijf || experience.company}</div>
                    <button 
                      type="button" 
                      className="font-semibold text-sky-600 hover:text-sky-500"
                      onClick={() => openWorkExperienceModal(experience)}
                    >
                      {dashboard.werknemersPage.BentoGrid.profiel.werkervaring.button}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex border-t border-gray-100 pt-6">
                <button 
                  type="button" 
                  className="text-sm/6 font-semibold text-sky-600 hover:text-sky-500"
                  onClick={() => openWorkExperienceModal()}
                >
                  <span aria-hidden="true">+</span> {dashboard.werknemersPage.BentoGrid.profiel.werkervaring.subTitle}
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-base/7 font-semibold text-gray-900">{dashboard.werknemersPage.BentoGrid.profiel.opleiding.headTitle}</h2>
              <p className="mt-1 text-sm/6 text-gray-500">{dashboard.werknemersPage.BentoGrid.profiel.opleiding.subTitle}</p>

              <ul role="list" className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
                {educations.map((education, index) => (
                  <li key={education._id || education.id || `education-${index}`} className="flex justify-between gap-x-6 py-6">
                    <div className="font-medium text-gray-900">{education.naam || education.institution}</div>
                    <button 
                      type="button" 
                      className="font-semibold text-sky-600 hover:text-sky-500"
                      onClick={() => openEducationModal(education)}
                    >
                      {dashboard.werknemersPage.BentoGrid.profiel.opleiding.button}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex border-t border-gray-100 pt-6">
                <button 
                  type="button" 
                  className="text-sm/6 font-semibold text-sky-600 hover:text-sky-500"
                  onClick={() => openEducationModal()}
                >
                  <span aria-hidden="true">+</span> {dashboard.werknemersPage.BentoGrid.profiel.opleiding.subTitle}
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-base/7 font-semibold text-gray-900">{dashboard.werknemersPage.BentoGrid.profiel.taalendata.headTitle}</h2>
              <p className="mt-1 text-sm/6 text-gray-500">
                {dashboard.werknemersPage.BentoGrid.profiel.taalendata.subTitle}
              </p>

              <dl className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
                <div className="py-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{dashboard.werknemersPage.BentoGrid.profiel.taalendata.formItems[0]}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">English</div>
                    <button type="button" className="font-semibold text-sky-600 hover:text-sky-500">
                      {dashboard.werknemersPage.BentoGrid.profiel.taalendata.button}
                    </button>
                  </dd>
                </div>
                <div className="py-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{dashboard.werknemersPage.BentoGrid.profiel.taalendata.formItems[1]}</dt>
                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <div className="text-gray-900">DD-MM-YYYY</div>
                    <button type="button" className="font-semibold text-sky-600 hover:text-sky-500">
                      {dashboard.werknemersPage.BentoGrid.profiel.taalendata.button}
                    </button>
                  </dd>
                </div>
                <Field className="flex pt-6">
                  <Label as="dt" passive className="flex-none pr-6 font-medium text-gray-900 sm:w-64">
                    {dashboard.werknemersPage.BentoGrid.profiel.taalendata.dataLabel}
                  </Label>
                  <dd className="flex flex-auto items-center justify-end">
                    <Switch
                      checked={automaticTimezoneEnabled}
                      onChange={setAutomaticTimezoneEnabled}
                      className="group flex w-8 cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 data-[checked]:bg-sky-600"
                    >
                      <span
                        aria-hidden="true"
                        className="size-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                      />
                    </Switch>
                  </dd>
                </Field>
              </dl>
            </div>
          </div>
        </main>

        {/* Work Experience Modal */}
        <WorkExperienceModal 
          isOpen={isWorkExperienceModalOpen}
          onClose={closeWorkExperienceModal}
          onSave={saveWorkExperience}
          editingData={editingWorkExperience}
        />

        {/* Education Modal */}
        <EducationModal 
          isOpen={isEducationModalOpen}
          onClose={closeEducationModal}
          onSave={saveEducation}
          editingData={editingEducation}
        />
    </>
  )
}

// Work Experience Modal Component
interface WorkExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingData?: any;
}

function WorkExperienceModal({ isOpen, onClose, onSave, editingData }: WorkExperienceModalProps) {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  useEffect(() => {
    if (editingData) {
      // Map database fields to form fields
      setFormData({
        company: editingData.bedrijf || '',
        position: editingData.functie || '',
        startDate: editingData.startDate || '',
        endDate: editingData.endDate || '',
        description: editingData.description || ''
      });
    } else {
      setFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    }
  }, [editingData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-sm rounded bg-white p-6">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {editingData ? 'Edit Work Experience' : 'Add Work Experience'}
          </DialogTitle>
          
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
              >
                {editingData ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

// Education Modal Component
interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingData?: any;
}

function EducationModal({ isOpen, onClose, onSave, editingData }: EducationModalProps) {
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  useEffect(() => {
    if (editingData) {
      // Map database fields to form fields
      setFormData({
        institution: editingData.naam || '',
        degree: editingData.school || '',
        field: editingData.niveau || '',
        startDate: editingData.startDate || '',
        endDate: editingData.endDate || '',
        description: editingData.description || ''
      });
    } else {
      setFormData({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    }
  }, [editingData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-sm rounded bg-white p-6">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {editingData ? 'Edit Education' : 'Add Education'}
          </DialogTitle>
          
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Institution</label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Degree/Certification</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Field of Study</label>
              <input
                type="text"
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
              >
                {editingData ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
