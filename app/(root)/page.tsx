const countries = [
    { name: 'United Kingdom', description: 'English', href: '/en', flag: 'gb' },
    { name: 'Deutschland', description: 'Deutsch', href: '/de', flag: 'de' },
    { name: 'Nederland', description: 'Nederlands', href: 'https://nl.junter.eu', flag: 'nl' },
    { name: 'België', description: 'Nederlands', href: '/benl', flag: 'be' },
    { name: 'France', description: 'Français', href: '/fr', flag: 'fr' },
    { name: 'España', description: 'Español', href: '/es', flag: 'es' },
    { name: 'Portugal', description: 'Português', href: '/pt', flag: 'pt' },
    { name: 'Italia', description: 'Italiano', href: '/it', flag: 'it' },
    { name: 'Osterreich', description: 'Deutsch', href: '/os', flag: 'at' },
    { name: 'Schweiz', description: 'Deutsch', href: '/sude', flag: 'ch' },
    { name: 'Suomi', description: 'Suomeksi', href: '/fi', flag: 'fi' },
    { name: 'Danmark', description: 'Dansk', href: '/dk', flag: 'dk' },
    { name: 'Sverige', description: 'Svenska', href: '/sw', flag: 'se' },
    { name: 'Norge', description: 'Norsk', href: '/no', flag: 'no' },
    { name: 'Suisse', description: 'Français', href: '/sufr', flag: 'ch' },
    { name: 'Svizzera', description: 'Italiano', href: '/suit', flag: 'ch' },
    { name: 'Bégique', description: 'Français', href: '/befr', flag: 'be' },
  ]

const posts = [
    {
      id: 1,
      title: 'United Kingdom',
      href: '/en',
      description:
        'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
      imageUrl:
      `https://flagcdn.com/w320/${countries[0].flag}.png`,
    },
    {
        id: 2,
        title: 'Suomi',
        href: '/fi',
        description:
          'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
        imageUrl:
        `https://flagcdn.com/w320/${countries[10].flag}.png`,
      },
      {
        id: 3,
        title: 'Sverige',
        href: '/sw',
        description:
          'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
        imageUrl:
        `https://flagcdn.com/w320/${countries[12].flag}.png`,
      },
      {
        id: 4,
        title: 'Danmark',
        href: '/dk',
        description:
          'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
        imageUrl:
        `https://flagcdn.com/w320/${countries[11].flag}.png`,
      },
      {
        id: 5,
        title: 'Norge',
        href: '/no',
        description:
          'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
        imageUrl:
        `https://flagcdn.com/w320/${countries[13].flag}.png`,
      },
      {
        id: 6,
        title: 'Nederland',
        href: '/nl',
        description:
          'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
        imageUrl:
        `https://flagcdn.com/w320/${countries[3].flag}.png`,
      },
      {
        id: 7,
        title: 'France',
        href: '/fr',
        description:
          'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
        imageUrl:
        `https://flagcdn.com/w320/${countries[4].flag}.png`,
      },
      {
        id: 8,
        title: 'Deutschland',
        href: '/de',
        description:
          'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
        imageUrl:
        `https://flagcdn.com/w320/${countries[2].flag}.png`,
      },
      {
        id: 9,
        title: 'België',
        href: '/benl',
        description:
          'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
        imageUrl:
        `https://flagcdn.com/w320/${countries[3].flag}.png`,
      },
      {
        id: 10,
        title: 'Luxembourg',
        href: '/lu',
        description:
          'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
        imageUrl:
        `https://flagcdn.com/w320/lu.flag.png`,
      },
      {
        id: 11,
        title: 'Suisse',
        href: '/sufr',
        description:
          'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
        imageUrl:
        `https://flagcdn.com/w320/${countries[9].flag}.png`,
      },
      {
        id: 12,
        title: 'Osterreich',
        href: '/os',
        description:
          'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
        imageUrl:
        `https://flagcdn.com/w320/${countries[8].flag}.png`,
      },
      {
        id: 13,
        title: 'Italia',
        href: '/it',
        description:
          'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
        imageUrl:
        `https://flagcdn.com/w320/${countries[7].flag}.png`,
      },
      {
        id: 14,
        title: 'España',
        href: '/es',
        description:
          'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
        imageUrl:
        `https://flagcdn.com/w320/${countries[5].flag}.png`,
      },
      {
        id: 15,
        title: 'Portugal',
        href: '/pt',
        description:
          'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
        imageUrl:
        `https://flagcdn.com/w320/${countries[6].flag}.png`,
      },
  ]

  
  export default function RootPage() {
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
              Welcome to Junter!
            </h2>
            <p className="mt-2 text-lg/8 text-gray-600">Select your country please.</p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="flex flex-col items-start justify-between">
                <div className="relative w-full">
                  <img
                    alt={post.title}
                    src={post.imageUrl}
                    className="aspect-video w-full rounded-2xl bg-gray-100 object-cover sm:aspect-2/1 lg:aspect-3/2"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-gray-900/10 ring-inset" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    )
  }
  