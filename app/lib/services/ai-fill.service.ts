"use server";

import OpenAI from 'openai';
import { getActiveBudget } from '@/app/lib/actions/budget.actions';
import { searchWeb, getMarketData, getIndustryInsights } from './web-search.service';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface EmployerData {
  _id: string;
  name: string;
  displaynaam?: string;
  email: string;
  phone?: string;
  website?: string;
  description?: string;
  industry?: string;
  size?: string;
  location?: {
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    country?: string;
  };
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  companyType?: string;
  foundedYear?: number;
  employees?: number;
  revenue?: number;
  specialties?: string[];
  certifications?: string[];
  awards?: string[];
  culture?: string;
  benefits?: string[];
  workEnvironment?: string;
  remoteWork?: boolean;
  flexibleHours?: boolean;
  careerGrowth?: string;
  diversity?: string;
  sustainability?: string;
  innovation?: string;
  clientFocus?: string;
  marketPosition?: string;
  competitiveAdvantages?: string[];
  recentNews?: string[];
  companyValues?: string[];
  mission?: string;
  vision?: string;
}

export interface DocumentStructure {
  vacancy?: {
    title: string;
    function: string;
    description: string;
    skills: string[];
    dresscode: string[];
    hourlyRate: number;
    address: {
      housenumber: string;
      postcode: string;
      streetname: string;
      city: string;
    };
    startingDate: Date;
    endingDate: Date;
    workingHours: Array<{
      begintijd: string;
      eindtijd: string;
      pauze: number;
    }>;
    surcharge: boolean;
    surchargeType?: number;
    surchargePercentage?: number;
    surchargeVan?: string;
    surchargeTot?: string;
    image: string;
  };
  shift?: {
    title: string;
    function: string;
    description: string;
    skills: string[];
    dresscode: string[];
    hourlyRate: number;
    address: string;
    startingDate: Date;
    endingDate: Date;
    starting: string;
    ending: string;
    break: string;
    spots: number;
    image: string;
    inFlexpool: boolean;
    flexpoolId?: string;
  };
}

export interface BudgetData {
  name: string;
  type: 'daily' | 'weekly' | 'monthly';
  budgetAmount: {
    total: number;
    currency: string;
    isPercentage: boolean;
    percentage?: number;
    revenue?: number;
  };
  spending: {
    total: number;
    daily: Record<string, number>;
    weekly: Record<string, number>;
    monthly: Record<string, number>;
  };
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  utilizationPercentage: number;
  remainingBudget: number;
}

export interface AIFillContext {
  employer: EmployerData;
  budget?: BudgetData;
  documentType: 'vacancy' | 'shift';
  existingDocuments?: any[];
  marketContext?: {
    industry: string;
    location: string;
    currentTrends?: string[];
    salaryRanges?: {
      min: number;
      max: number;
      average: number;
      currency: string;
    };
    marketData?: string;
    jobDemand?: string;
    competition?: string;
    industryInsights?: string[];
  };
}

export interface AIFillResult {
  title: string;
  function: string;
  description: string;
  skills: string[];
  dresscode: string[];
  hourlyRate: number;
  address: any;
  startingDate: Date;
  endingDate: Date;
  workingHours?: Array<{
    begintijd: string;
    eindtijd: string;
    pauze: number;
  }>;
  starting?: string;
  ending?: string;
  break?: string;
  spots?: number;
  image?: string;
  inFlexpool?: boolean;
  flexpoolId?: string;
  surcharge?: boolean;
  surchargeType?: number;
  surchargePercentage?: number;
  surchargeVan?: string;
  surchargeTot?: string;
  reasoning?: string;
  marketInsights?: string[];
}

async function searchWebForContext(query: string): Promise<string> {
  try {
    const results = await searchWeb(query, 3);
    return results.map(result => `${result.title}: ${result.snippet}`).join('\n\n');
  } catch (error) {
    console.error('Web search error:', error);
    return '';
  }
}

async function getMarketContext(employer: EmployerData): Promise<any> {
  const industry = employer.industry || 'General Business';
  const location = employer.location?.city || 'Netherlands';
  
  try {
    // Get comprehensive market data
    const marketData = await getMarketData(industry, location);
    const industryInsights = await getIndustryInsights(industry);
    
    return {
      industry,
      location,
      currentTrends: marketData.trends,
      salaryRanges: marketData.salaryRanges,
      jobDemand: marketData.jobDemand,
      competition: marketData.competition,
      marketData: marketData.insights.join('\n'),
      industryInsights
    };
  } catch (error) {
    console.error('Market context error:', error);
    
    // Fallback data
    return {
      industry,
      location,
      currentTrends: [
        'Remote work flexibility',
        'Sustainability focus',
        'Digital transformation',
        'Work-life balance',
        'Diversity and inclusion'
      ],
      salaryRanges: {
        min: 12,
        max: 25,
        average: 18,
        currency: 'EUR'
      },
      jobDemand: 'medium',
      competition: 'medium',
      marketData: 'Standard market conditions',
      industryInsights: ['Industry experiencing steady growth']
    };
  }
}

function createSystemPrompt(context: AIFillContext): string {
    const { employer, budget, documentType, marketContext } = context;
    
    return `You are an expert HR and recruitment specialist with deep knowledge of the ${employer.industry || 'business'} industry. 
    
    Your task is to generate realistic, professional, and contextually appropriate data for a ${documentType} posting based on the following information:

    EMPLOYER INFORMATION:
    - Company: ${employer.name} (${employer.displaynaam || ''})
    - Industry: ${employer.industry || 'General Business'}
    - Location: ${employer.location?.city || 'Netherlands'}, ${employer.location?.country || 'Netherlands'}
    - Company Size: ${employer.employees || 'Unknown'} employees
    - Founded: ${employer.foundedYear || 'Unknown'}
    - Description: ${employer.description || 'Professional services company'}
    - Specialties: ${employer.specialties?.join(', ') || 'General business services'}
    - Company Values: ${employer.companyValues?.join(', ') || 'Professionalism, Quality, Innovation'}
    - Mission: ${employer.mission || 'To provide excellent services to our clients'}
    - Culture: ${employer.culture || 'Professional and collaborative'}
    - Work Environment: ${employer.workEnvironment || 'Modern office environment'}
    - Remote Work: ${employer.remoteWork ? 'Yes' : 'No'}
    - Flexible Hours: ${employer.flexibleHours ? 'Yes' : 'No'}

    ${budget ? `BUDGET CONTEXT:
    - Budget Name: ${budget.name}
    - Budget Type: ${budget.type}
    - Total Budget: ${budget.budgetAmount.currency} ${budget.budgetAmount.total.toLocaleString()}
    - Spent: ${budget.budgetAmount.currency} ${budget.spending.total.toLocaleString()}
    - Utilization: ${budget.utilizationPercentage.toFixed(1)}%
    - Remaining: ${budget.budgetAmount.currency} ${budget.remainingBudget.toLocaleString()}
    - Status: ${budget.status}` : ''}

    ${marketContext ? `MARKET CONTEXT:
    - Industry: ${marketContext.industry}
    - Location: ${marketContext.location}
    - Current Trends: ${marketContext.currentTrends?.join(', ')}
    - Salary Range: ${marketContext.salaryRanges?.currency || 'EUR'} ${marketContext.salaryRanges?.min}-${marketContext.salaryRanges?.max}/hour (avg: ${marketContext.salaryRanges?.average})
    - Market Insights: ${marketContext.marketData || 'General market conditions'}` : ''}

    REQUIREMENTS:
    1. Generate data that reflects the company's culture, values, and industry
    2. Use realistic salary ranges based on market data and budget constraints
    3. Create compelling, professional job descriptions
    4. Include relevant skills and requirements for the industry
    5. Consider the company's location and work environment
    6. Make the posting attractive to potential candidates
    7. Ensure all data is consistent and professional
    8. If crucial data is missing, use your knowledge of the industry and market trends

    Generate a JSON response with the following structure for a ${documentType}:
    ${documentType === 'vacancy' ? `
    {
      "title": "Compelling job title",
      "function": "Specific function/role",
      "description": "Detailed job description highlighting company culture and role requirements",
      "skills": ["skill1", "skill2", "skill3"],
      "dresscode": ["dresscode1", "dresscode2"],
      "hourlyRate": number,
      "address": {
        "housenumber": "string",
        "postcode": "string", 
        "streetname": "string",
        "city": "string"
      },
      "startingDate": "YYYY-MM-DD",
      "endingDate": "YYYY-MM-DD",
      "workingHours": [
        {
          "begintijd": "HH:MM",
          "eindtijd": "HH:MM", 
          "pauze": number
        }
      ],
      "surcharge": boolean,
      "surchargeType": number,
      "surchargePercentage": number,
      "surchargeVan": "HH:MM",
      "surchargeTot": "HH:MM",
      "image": "string (optional)",
      "reasoning": "Brief explanation of choices made",
      "marketInsights": ["insight1", "insight2"]
    }` : `
    {
      "title": "Compelling shift title",
      "function": "Specific function/role", 
      "description": "Detailed shift description highlighting company culture and role requirements",
      "skills": ["skill1", "skill2", "skill3"],
      "dresscode": ["dresscode1", "dresscode2"],
      "hourlyRate": number,
      "address": "Full address string",
      "startingDate": "YYYY-MM-DD",
      "endingDate": "YYYY-MM-DD", 
      "starting": "HH:MM",
      "ending": "HH:MM",
      "break": "X minuten",
      "spots": number,
      "image": "string (optional)",
      "inFlexpool": boolean,
      "flexpoolId": "string (optional)",
      "reasoning": "Brief explanation of choices made",
      "marketInsights": ["insight1", "insight2"]
    }`}

    Make the response professional, engaging, and tailored to ${employer.name}'s specific needs and culture.`;
  }

export async function generateAIFillData(
  employer: EmployerData,
  documentType: 'vacancy' | 'shift',
  existingDocuments?: any[]
): Promise<AIFillResult> {
    try {
      // Get budget data if available
      let budget: BudgetData | undefined;
      try {
        const activeBudget = await getActiveBudget(employer._id);
        if (activeBudget) {
        budget = {
          name: activeBudget.name,
          type: activeBudget.type,
          budgetAmount: activeBudget.budgetAmount,
          spending: activeBudget.spending,
          status: activeBudget.status,
          utilizationPercentage: activeBudget.budgetAmount.total === 0 ? 0 : (activeBudget.spending.total / activeBudget.budgetAmount.total) * 100,
          remainingBudget: activeBudget.budgetAmount.total - activeBudget.spending.total
        };
        }
      } catch (error) {
        console.log('No budget data available:', error);
      }

      // Get market context
      const marketContext = await getMarketContext(employer);

      // Create context for AI
      const context: AIFillContext = {
        employer,
        budget,
        documentType,
        existingDocuments,
        marketContext
      };

      // Generate AI response
      const systemPrompt = createSystemPrompt(context);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Please generate realistic ${documentType} data for ${employer.name} based on the provided context. Focus on creating compelling, professional content that reflects the company's culture and industry standards.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from AI service');
      }

      // Parse JSON response
      const aiData = JSON.parse(response);
      
      // Convert date strings to Date objects
      if (aiData.startingDate) {
        aiData.startingDate = new Date(aiData.startingDate);
      }
      if (aiData.endingDate) {
        aiData.endingDate = new Date(aiData.endingDate);
      }

      return aiData;
    } catch (error) {
      console.error('AI Fill Service Error:', error);
      
      // Fallback to basic data generation
      return generateFallbackData(employer, documentType);
    }
  }

function generateFallbackData(employer: EmployerData, documentType: 'vacancy' | 'shift'): AIFillResult {
    const baseData = {
      title: `Nieuwe ${documentType === 'vacancy' ? 'vacature' : 'shift'} bij ${employer.name}`,
      function: 'Allround medewerker',
      description: `We zoeken een gemotiveerde freelancer voor ${employer.name}. Taken: ondersteuning op de werkvloer, klantcontact en lichte administratieve werkzaamheden.`,
      skills: ['Communicatief', 'Teamspeler', 'Betrouwbaar'],
      dresscode: ['Zwarte broek', 'Zwarte schoenen'],
      hourlyRate: 14,
      address: documentType === 'vacancy' ? {
        housenumber: employer.location?.housenumber || '1',
        postcode: employer.location?.postcode || '1000AA',
        streetname: employer.location?.street || 'Hoofdstraat',
        city: employer.location?.city || 'Amsterdam'
      } : `${employer.location?.street || 'Hoofdstraat'} ${employer.location?.housenumber || '1'}, ${employer.location?.city || 'Amsterdam'}`,
      startingDate: new Date(),
      endingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      reasoning: 'Fallback data generated due to AI service unavailability',
      marketInsights: ['Standard market rates applied']
    };

    if (documentType === 'vacancy') {
      return {
        ...baseData,
        workingHours: [{
          begintijd: '08:00',
          eindtijd: '16:30',
          pauze: 30
        }],
        surcharge: false,
        surchargeType: 0,
        surchargePercentage: 100,
        surchargeVan: '',
        surchargeTot: ''
      };
    } else {
      return {
        ...baseData,
        starting: '08:00',
        ending: '16:30',
        break: '30 minuten',
        spots: 3,
        inFlexpool: false,
        flexpoolId: ''
      };
    }
}
