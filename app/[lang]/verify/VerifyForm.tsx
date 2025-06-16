'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Locale } from '@/i18n.config';

const supportedLocales: Locale[] = [
  'en', 'nl', 'fr', 'de', 'es', 'it', 'pt', 'fi', 'dk', 'no', 'lu',
  'sw', 'os', 'benl', 'befr', 'suit', 'sufr', 'sude',
];

export default function Example({ pages, params }: { pages: any; navigation: any; footer: any, params: { lang: string } }) {
  const lang = supportedLocales.includes(params.lang as Locale)
  ? (params.lang as Locale)
  : 'en';
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const { signOut } = useClerk();
  const [agreed, setAgreed] = useState(true);
  const [isBedrijf, setIsBedrijf] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "Junter",
    email: "",
    phoneNumber: "",
    message: "",
  });

  // Handle user type and determine if it's a bedrijf
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("./sign-in");
      console.log("Niet ingelogd");
      return;
    }

    const userType = user?.organizationMemberships.length ?? 0;
    setIsBedrijf(userType >= 1);
  }, [isLoaded, isSignedIn, router, user]);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!agreed) {
      alert("You must agree to the privacy policy before submitting.");
      return;
    }

    if(formData.firstName === '' || formData.message === ''){
      alert('You must atleast fill in your firstname and a message.');
      return;
    }

    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Bericht verstuurd!");
        setFormData({
          firstName: "",
          lastName: "",
          company: "",
          email: "",
          phoneNumber: "",
          message: "",
        });
        signOut({ redirectUrl: '/' });
      } else {
        const errorData = await response.json();
        alert(`Failed to send email: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again later.");
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  let timer: string | number | NodeJS.Timeout | undefined;

  const resetTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      alert("Je wordt binnen enkele seconden uitgelogd wegens inactiviteit.");
      signOut({ redirectUrl: '/' });
    }, 300000); // 5 minuten
  };
  
  // Event listeners voor gebruikersactiviteit
  window.addEventListener('mousemove', resetTimer);
  window.addEventListener('keydown', resetTimer);
  
  // Start timer bij het laden van de pagina
  resetTimer();


  return (
  <div className="relative isolate bg-white">
  <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
    {/* Content Section */}
    <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
      <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
        <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          {pages.verifyPage.title}
        </h2>
        {isBedrijf ? (
          <div className="mt-10 gap-y-4 text-lg/8 text-gray-600">
            {pages.verifyPage.headText1}
            <ul className="list-disc pl-6 mt-10">
              
              <li>
              - {  pages.verifyPage.EmployersPage.requiredDocuments[0]}
              </li>
              <li>
              - { pages.verifyPage.EmployersPage.requiredDocuments[1]}
              </li>
            </ul>
             <div className="mt-10">
            {pages.verifyPage.instructions[0]} {" "}
            </div>
            <strong>
              <a href="mailto:onboarding@junter.works" className="hover:text-gray-900">
              onboarding@junter.works
              </a>
            </strong>{" "}
            {pages.verifyPage.instructions[1]}:
            <ul className="list-disc pl-6 mt-7">
              <li> - { pages.verifyPage.EmployersPage.informationRequired[0]}</li>
              <li> - { pages.verifyPage.EmployersPage.informationRequired[1]}</li>
              <li> - { pages.verifyPage.EmployersPage.informationRequired[2]}</li>
            </ul>
            <p className="mt-10">
            {pages.verifyPage.endingSentence}
            </p>
          </div>
        ) : (
          <div className="mt-10 text-lg/8 text-gray-600">
            {pages.verifyPage.headText2}
            <ul className="list-disc pl-6 mt-4">
              <li> - {pages.verifyPage.EmployersPage.requiredDocuments[0]}</li>
              <li>
                - {pages.verifyPage.EmployersPage.requiredDocuments[1]}
              </li>
            </ul>
            <div className="mt-10">
            {pages.verifyPage.instructions[0]} {" "}
            </div>
            <strong>
              <a href="mailto:onboarding@junter.works" className="hover:text-gray-900">
                onboarding@junter.works 
              </a>
            </strong>
            {" "}
            {pages.verifyPage.instructions[1]}
            <ul className="list-disc pl-6 mt-7">
              <li> - {pages.verifyPage.EmployeesPage.informationRequired[0]}</li>
              <li> - {pages.verifyPage.EmployeesPage.informationRequired[1]}</li>
              <li> - {pages.verifyPage.EmployeesPage.informationRequired[2]}</li>
              <li> - {pages.verifyPage.EmployeesPage.informationRequired[3]}</li>
            </ul>
            <p className="mt-10">
            {pages.verifyPage.endingSentence}
            </p>
          </div>
        )}
      </div>
      <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => signOut({ redirectUrl: '/' })}
            className="rounded-md bg-orange-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            {pages.verifyPage.Button1}
          </button>
        </div>

  <form onSubmit={handleSubmit} className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48">
  <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <div>
          <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-900">
            {pages.verifyPage.formItems[0].voornaamItem}
          </label>
          <div className="mt-2.5">
            <input
              id="first-name "
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleChange}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>
        <div>
          <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900">
            {pages.verifyPage.formItems[1].achternaamItem}
          </label>
          <div className="mt-2.5">
            <input
              id="last-name"
              name="lastName"
              type="text"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">
            {pages.verifyPage.formItems[2].emailadresItem}
          </label>
          <div className="mt-2.5">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="phone-number" className="block text-sm/6 font-semibold text-gray-900">
            {pages.verifyPage.formItems[3].telefoonItem}
          </label>
          <div className="mt-2.5">
            <input
              id="phone-number"
              name="phoneNumber"
              type="tel"
              autoComplete="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900">
            {pages.verifyPage.formItems[4].questionItem}
          </label>
          <div className="mt-2.5">
            <textarea
              id="message"
              name="message"
              rows={4}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm/6"
              value={formData.message}
              onChange={handleChange}
              placeholder={pages.verifyPage.formItems[4].description}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-sky-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
        >
          {pages.verifyPage.Button2}
        </button>
      </div>
    </div>
  </form>
    </div>
    </div>
</div>
    )
}