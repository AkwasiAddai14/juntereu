import { OpenAI } from 'openai';

// Function to get OpenAI client with proper error handling
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({
    apiKey: apiKey,
  });
}

interface UserData {
  aangemeld: any[];
  sollicitaties: any[];
  geaccepteerd: any[];
  diensten: any[];
  flexpool: any[];
  factuur: any[];
  workExperiences?: any[];
  educations?: any[];
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

interface SummaryOptions {
  section: 'shifts' | 'applications' | 'work' | 'education' | 'overview';
  userData: UserData;
  language?: string;
}

export async function generateAISummary({ section, userData, language = 'nl' }: SummaryOptions): Promise<string> {
  try {
    const { aangemeld, sollicitaties, geaccepteerd, diensten, flexpool, factuur, workExperiences, educations, user } = userData;
    
    // Create a data summary for the AI
    const dataSummary = {
      user: {
        name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Gebruiker',
        email: user?.email || 'Niet beschikbaar'
      },
      statistics: {
        aangemeldShifts: aangemeld.length,
        sollicitaties: sollicitaties.length,
        geaccepteerdShifts: geaccepteerd.length,
        diensten: diensten.length,
        flexpools: flexpool.length,
        facturen: factuur.length,
        workExperiences: workExperiences?.length || 0,
        educations: educations?.length || 0
      },
      recentActivity: {
        recentShifts: aangemeld.slice(0, 3).map(shift => ({
          title: shift.title || shift.function || 'Shift',
          date: shift.date || shift.startDate || 'Datum onbekend'
        })),
        recentApplications: sollicitaties.slice(0, 3).map(app => ({
          title: app.title || app.function || 'Sollicitatie',
          status: app.status || 'In behandeling'
        }))
      }
    };

    // Generate section-specific prompts
    const prompts = {
      shifts: `Genereer een korte, motiverende samenvatting (max 2 zinnen) voor een freelancer dashboard over hun shift activiteit. 
      Data: ${dataSummary.statistics.aangemeldShifts} aangemelde shifts, ${dataSummary.statistics.geaccepteerdShifts} geaccepteerde shifts.
      Focus op prestaties en motivatie. Gebruik een vriendelijke, professionele toon.`,
      
      applications: `Genereer een korte, motiverende samenvatting (max 2 zinnen) voor een freelancer dashboard over hun sollicitatie activiteit.
      Data: ${dataSummary.statistics.sollicitaties} sollicitaties.
      Focus op groei en kansen. Gebruik een vriendelijke, professionele toon.`,
      
      work: `Genereer een korte, motiverende samenvatting (max 2 zinnen) voor een freelancer dashboard over hun werkervaring.
      Data: ${dataSummary.statistics.workExperiences} werkervaringen, ${dataSummary.statistics.educations} opleidingen.
      Focus op expertise en ontwikkeling. Gebruik een vriendelijke, professionele toon.`,
      
      education: `Genereer een korte, motiverende samenvatting (max 2 zinnen) voor een freelancer dashboard over hun opleidingen.
      Data: ${dataSummary.statistics.educations} opleidingen.
      Focus op leren en groei. Gebruik een vriendelijke, professionele toon.`,
      
      overview: `Genereer een korte, motiverende samenvatting (max 2 zinnen) voor een freelancer dashboard over hun algemene activiteit.
      Data: ${dataSummary.statistics.aangemeldShifts} aangemelde shifts, ${dataSummary.statistics.sollicitaties} sollicitaties, ${dataSummary.statistics.geaccepteerdShifts} geaccepteerde shifts, ${dataSummary.statistics.facturen} facturen.
      Focus op prestaties en groei. Gebruik een vriendelijke, professionele toon.`
    };

    const systemPrompt = `Je bent een AI-assistent die korte, motiverende samenvattingen genereert voor freelancer dashboards. 
    Je schrijft in het Nederlands en gebruikt een vriendelijke, professionele toon. 
    Focus op prestaties, groei en motivatie. Houd het kort en krachtig (max 2 zinnen).`;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompts[section] }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return completion.choices[0].message.content || getFallbackText(section, userData);

  } catch (error) {
    console.error('Error generating AI summary:', error);
    return getFallbackText(section, userData);
  }
}

function getFallbackText(section: string, userData: UserData): string {
  const { aangemeld, sollicitaties, geaccepteerd, diensten, flexpool, factuur, workExperiences, educations } = userData;
  
  const fallbackTexts = {
    shifts: `Je hebt ${aangemeld.length} aangemelde shifts en ${geaccepteerd.length} geaccepteerde shifts. Blijf doorgaan met het zoeken naar nieuwe kansen!`,
    applications: `Je hebt ${sollicitaties.length} actieve sollicitaties. Elke sollicitatie brengt je dichter bij je volgende kans!`,
    work: `Je profiel toont ${workExperiences?.length || 0} werkervaringen en ${educations?.length || 0} opleidingen. Je expertise groeit elke dag!`,
    education: `Je hebt ${educations?.length || 0} opleidingen in je profiel. Blijf investeren in je persoonlijke ontwikkeling!`,
    overview: `Je dashboard toont ${aangemeld.length} aangemelde shifts, ${sollicitaties.length} sollicitaties en ${factuur.length} facturen. Je bent actief bezig met je carrière!`
  };

  return fallbackTexts[section as keyof typeof fallbackTexts] || 'Je dashboard toont je recente activiteit en prestaties.';
}
