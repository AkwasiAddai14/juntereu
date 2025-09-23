import Image from 'next/image';
import foodDelivery from '@/app/assets/images/iStock-1469919334.jpg';
import forkliftDriver from '@/app/assets/images/iStock-1308572401.jpg';
import clothingStore from '@/app/assets/images/iStock-2149706236.jpg';
import footballStadium from '@/app/assets/images/iStock-1936803756.jpg';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys
import { getDictionary } from '@/app/[lang]/dictionaries'
import { FadeInLeft, SimpleFadeIn, SimpleStaggerContainer, SimpleStaggerItem } from '@/app/[lang]/components/shared/animations/AnimationUtils'

export default async function Example({ lang }: { lang: Locale }) {
  const { pages } = await getDictionary(lang);
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:min-w-full lg:max-w-none lg:flex-none lg:gap-y-8">
          <FadeInLeft className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{pages.landingsPage.branches.headText}</h2>
            <p className="mt-6 text-xl leading-8 text-gray-600">
              {pages.landingsPage.branches.subText}
            </p>
          </FadeInLeft>
          
          <SimpleStaggerContainer className="flex flex-wrap items-start justify-end gap-6 sm:gap-8 lg:contents">
            {/* <SimpleStaggerItem className="w-0 flex-auto lg:ml-auto lg:w-auto lg:flex-none lg:self-end hidden sm:block sm:w-0 sm:flex-auto"> */}
              <SimpleFadeIn>
                <Image
                  src={foodDelivery}
                  alt="Food delivery service"
                  width={592}
                  height={423}
                  className="aspect-[7/5] w-[37rem] max-w-none rounded-2xl bg-gray-50 object-cover"
                  priority
                />
              </SimpleFadeIn>
            {/* </SimpleStaggerItem> */}
            
            <div className="contents lg:col-span-2 lg:col-end-2 lg:ml-auto lg:flex lg:w-[37rem] lg:items-start lg:justify-end lg:gap-x-8">
              {/* <SimpleStaggerItem className="order-first flex w-64 flex-none justify-end self-end lg:w-auto"> */}
                <SimpleFadeIn delay={0.2}>
                  <Image
                    src={forkliftDriver}
                    alt="Forklift driver at work"
                    width={384}
                    height={288}
                    className="aspect-[4/3] w-[24rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                  />
                </SimpleFadeIn>
              {/* </SimpleStaggerItem> */}
              
              {/* <SimpleStaggerItem className="flex w-96 flex-auto justify-end lg:w-auto lg:flex-none"> */}
                <SimpleFadeIn delay={0.4}>
                  <Image
                    src={footballStadium}
                    alt="Football stadium event"
                    width={592}
                    height={423}
                    className="aspect-[7/5] w-[37rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                  />
                </SimpleFadeIn>
              {/* </SimpleStaggerItem> */}
              
              {/* <SimpleStaggerItem className="hidden sm:block sm:w-0 sm:flex-auto lg:w-auto lg:flex-none"> */}
                <SimpleFadeIn delay={0.6}>
                  <Image
                    src={clothingStore}
                    alt="Clothing store retail"
                    width={384}
                    height={288}
                    className="aspect-[4/3] w-[24rem] max-w-none rounded-2xl bg-gray-50 object-cover"
                  />
                </SimpleFadeIn>
              {/* </SimpleStaggerItem> */}
            </div>
          </SimpleStaggerContainer>
        </div>
      </div>
    </div>
  )
}