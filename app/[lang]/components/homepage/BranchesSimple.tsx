import Image from 'next/image';
import foodDelivery from '@/app/assets/images/iStock-1469919334.jpg';
import forkliftDriver from '@/app/assets/images/iStock-1308572401.jpg';
import clothingStore from '@/app/assets/images/iStock-2149706236.jpg';
import footballStadium from '@/app/assets/images/iStock-1936803756.jpg';
import type { Locale } from '@/app/[lang]/dictionaries';
import { getDictionary } from '@/app/[lang]/dictionaries'
import { FadeInLeft, StaggerContainer, StaggerItem } from '@/app/[lang]/components/shared/animations/AnimationUtils'

export default async function BranchesSimple({ lang }: { lang: Locale }) {
  const { pages } = await getDictionary(lang);
  
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <FadeInLeft className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {pages.landingsPage.branches.headText}
            </h2>
            <p className="mt-6 text-xl leading-8 text-gray-600">
              {pages.landingsPage.branches.subText}
            </p>
          </FadeInLeft>
          
          <StaggerContainer className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <StaggerItem>
              <div className="relative">
                <Image
                  src={foodDelivery}
                  alt="Food delivery service"
                  width={400}
                  height={300}
                  className="aspect-[4/3] w-full rounded-2xl bg-gray-50 object-cover"
                />
                <div className="absolute inset-0 rounded-2xl bg-black bg-opacity-20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">Food Delivery</h3>
                </div>
              </div>
            </StaggerItem>
            
            <StaggerItem>
              <div className="relative">
                <Image
                  src={forkliftDriver}
                  alt="Forklift driver at work"
                  width={400}
                  height={300}
                  className="aspect-[4/3] w-full rounded-2xl bg-gray-50 object-cover"
                />
                <div className="absolute inset-0 rounded-2xl bg-black bg-opacity-20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">Logistics</h3>
                </div>
              </div>
            </StaggerItem>
            
            <StaggerItem>
              <div className="relative">
                <Image
                  src={footballStadium}
                  alt="Football stadium event"
                  width={400}
                  height={300}
                  className="aspect-[4/3] w-full rounded-2xl bg-gray-50 object-cover"
                />
                <div className="absolute inset-0 rounded-2xl bg-black bg-opacity-20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">Events</h3>
                </div>
              </div>
            </StaggerItem>
            
            <StaggerItem>
              <div className="relative">
                <Image
                  src={clothingStore}
                  alt="Clothing store retail"
                  width={400}
                  height={300}
                  className="aspect-[4/3] w-full rounded-2xl bg-gray-50 object-cover"
                />
                <div className="absolute inset-0 rounded-2xl bg-black bg-opacity-20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">Retail</h3>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>
    </div>
  )
}
