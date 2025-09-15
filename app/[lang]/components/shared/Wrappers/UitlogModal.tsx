import { getDictionary } from '@/app/[lang]/dictionaries';
import UitlogModal from '@/app/[lang]/components/shared/UitlogModal';
import type { Locale } from '@/app/[lang]/dictionaries'; // define this type based on keys

export default async function Page({ params }: { params: { lang: Locale } }) {
  const { components } = await getDictionary(params.lang);

  return (
    <main>
      {/* andere content */}
      <UitlogModal isVisible={true} onClose={() => {}} components={components} />
    </main>
  );
}