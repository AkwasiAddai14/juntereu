import { Locale } from '@/i18n.config'
import { getDictionary } from '@/app/[lang]/dictionaries'

export default async function Example({ lang }: { lang: Locale }) {
  const { pages, navigation, footer } = await getDictionary(lang);
    return (
      <div className="relative bg-white">
        <div className="lg:absolute lg:inset-0 lg:left-1/2">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=2560&h=3413&&q=80"
            className="h-64 w-full bg-gray-50 object-cover sm:h-80 lg:absolute lg:h-full"
          />
        </div>
        <div className="pb-24 pt-16 sm:pb-32 sm:pt-24 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:pt-32">
          <div className="px-6 lg:px-8">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                {pages.contactPage.headText}
              </h2>
              <p className="mt-2 text-lg/8 text-gray-600">
                {pages.contactPage.subText}
              </p>
              <form action="#" method="POST" className="mt-16">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-900">
                      {pages.contactPage.formItems[0].voornaamItem}
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="first-name"
                        name="first-name"
                        type="text"
                        autoComplete="given-name"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900">
                    {pages.contactPage.formItems[1].achternaamItem} 
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="last-name"
                        name="last-name"
                        type="text"
                        autoComplete="family-name"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900">
                    {pages.contactPage.formItems[2].emailadresItem}
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="company" className="block text-sm/6 font-semibold text-gray-900">
                    {pages.contactPage.formItems[3].bedrijfItem}
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex justify-between text-sm/6">
                      <label htmlFor="phone" className="block font-semibold text-gray-900">
                      {pages.contactPage.formItems[4].telefoonItem} Phone
                      </label>
                      <p id="phone-description" className="text-gray-400">
                      {pages.contactPage.formItems[4].optionalItem} Optional
                      </p>
                    </div>
                    <div className="mt-2.5">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        aria-describedby="phone-description"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex justify-between text-sm/6">
                      <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900">
                      {pages.contactPage.formItems[5].questionItem} How can we help you?
                      </label>
                      <p id="message-description" className="text-gray-400">
                      {pages.contactPage.formItems[5].description} Max 500 characters
                      </p>
                    </div>
                    <div className="mt-2.5">
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        aria-describedby="message-description"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-sky-600"
                        defaultValue={''}
                      />
                    </div>
                  </div>
                  <fieldset className="sm:col-span-2">
                    <legend className="block text-sm/6 font-semibold text-gray-900">{pages.contactPage.expectedBudget.title}</legend>
                    <div className="mt-4 space-y-4 text-sm/6 text-gray-600">
                      <div className="flex gap-x-2.5">
                        <input
                          defaultValue={pages.contactPage.expectedBudget.budgetButtons[0]}
                          id={pages.contactPage.expectedBudget.budgetButtons[0]}
                          name="budget"
                          type="radio"
                          className="relative mt-1 size-4 appearance-none rounded-full border border-gray-300 before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-sky-600 checked:bg-indigo500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                        />
                        <label htmlFor="budget-under-25k">{pages.contactPage.expectedBudget.budgetButtons[0]}</label>
                      </div>
                      <div className="flex gap-x-2.5">
                        <input
                          defaultValue={pages.contactPage.expectedBudget.budgetButtons[1]}
                          id={pages.contactPage.expectedBudget.budgetButtons[1]}
                          name="budget"
                          type="radio"
                          className="relative mt-1 size-4 appearance-none rounded-full border border-gray-300 before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-sky-600 checked:bg-sky-600  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                        />
                        <label htmlFor="budget-25k-50k">{pages.contactPage.expectedBudget.budgetButtons[1]}</label>
                      </div>
                      <div className="flex gap-x-2.5">
                        <input
                          defaultValue={pages.contactPage.expectedBudget.budgetButtons[2]}
                          id={pages.contactPage.expectedBudget.budgetButtons[2]}
                          name="budget"
                          type="radio"
                          className="relative mt-1 size-4 appearance-none rounded-full border border-gray-300 before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-sky-600 checked:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                        />
                        <label htmlFor="budget-50k-100k">{pages.contactPage.expectedBudget.budgetButtons[2]}</label>
                      </div>
                      <div className="flex gap-x-2.5">
                        <input
                          defaultValue={pages.contactPage.expectedBudget.budgetButtons[3]}
                          id={pages.contactPage.expectedBudget.budgetButtons[3]}
                          name="budget"
                          type="radio"
                          className="relative mt-1 size-4 appearance-none rounded-full border border-gray-300 before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-sky-600 checked:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                        />
                        <label htmlFor="budget-over-100k">{pages.contactPage.expectedBudget.budgetButtons[3]}</label>
                      </div>
                      <div className="flex gap-x-2.5">
                        <input
                          defaultValue={pages.contactPage.expectedBudget.budgetButtons[4]}
                          id={pages.contactPage.expectedBudget.budgetButtons[4]}
                          name="budget"
                          type="radio"
                          className="relative mt-1 size-4 appearance-none rounded-full border border-gray-300 before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-sky-600 checked:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
                        />
                        <label htmlFor={pages.contactPage.expectedBudget.budgetButtons[4]}>{pages.contactPage.expectedBudget.budgetButtons[4]}</label>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="mt-10 flex justify-end border-t border-gray-900/10 pt-8">
                  <button
                    type="submit"
                    className="rounded-md bg-sky-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                  >
                    {pages.contactPage.pageButton} 
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
  