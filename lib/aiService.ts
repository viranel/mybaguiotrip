// AI Service for OpenRouter DeepSeek v3.1 API integration
import { config } from './config';

export interface ItineraryRequest {
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  currency: string;
  preference: string;
  destination?: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
  estimatedCost: number;
  notes?: string;
}

export interface Activity {
  time: string;
  name: string;
  location: string;
  description: string;
  duration: string;
  cost: number;
  category: 'attraction' | 'food' | 'accommodation' | 'transport' | 'shopping' | 'entertainment';
  bookingRequired?: boolean;
  tips?: string;
}

export interface GeneratedItinerary {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  travelers: number;
  totalBudget: number;
  currency: string;
  preference: string;
  days: ItineraryDay[];
  summary: string;
  tips: string[];
  createdAt: string;
}

class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.openRouter.apiKey;
    this.baseUrl = config.openRouter.baseUrl;
    
    if (!this.apiKey) {
      console.warn('OpenRouter API key not found. Please set EXPO_PUBLIC_OPENROUTER_API_KEY in your environment variables.');
    }
  }

  async generateItinerary(request: ItineraryRequest): Promise<GeneratedItinerary> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    try {
      console.log('Generating itinerary with AI...', request);
      
      const prompt = this.buildPrompt(request);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': config.app.url,
          'X-Title': config.app.name,
        },
        body: JSON.stringify({
          model: config.openRouter.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert travel planner specializing in Baguio City, Philippines. Create detailed, practical itineraries with specific times, locations, and costs in Philippine Peso (PHP).'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: config.openRouter.maxTokens,
          temperature: config.openRouter.temperature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenRouter API error:', response.status, errorData);
        
        let errorMessage = `API request failed: ${response.status}`;
        
        if (response.status === 401) {
          errorMessage = 'Invalid API key. Please check your OpenRouter configuration.';
        } else if (response.status === 429) {
          errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
        } else if (response.status >= 500) {
          errorMessage = 'AI service is temporarily unavailable. Please try again later.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('AI response received:', data);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from AI service');
      }

      const aiResponse = data.choices[0].message.content;
      return this.parseAIResponse(aiResponse, request);

    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw error;
    }
  }

  private buildPrompt(request: ItineraryRequest): string {
    const destination = request.destination || 'Baguio City, Philippines';
    const days = this.calculateDays(request.startDate, request.endDate);
    
    return `
Create a detailed ${days}-day itinerary for ${destination} with the following specifications:

**Trip Details:**
- Start Date: ${request.startDate}
- End Date: ${request.endDate}
- Duration: ${days} days
- Number of Travelers: ${request.travelers}
- Budget: ${request.currency} ${request.budget} per day
- Travel Style: ${request.preference}

**Requirements:**
1. Create a day-by-day itinerary with specific times (morning, afternoon, evening)
2. Include exact locations, addresses, and contact information where possible
3. Provide realistic costs in Philippine Peso (PHP)
4. Include transportation options and costs
5. Suggest restaurants with local specialties
6. Include cultural sites, natural attractions, and activities
7. Provide practical tips and recommendations
8. Consider the weather and seasonal factors
9. **IMPORTANT: The first activity of Day 1 must ALWAYS be "2:00 PM - Check in at hotel"**

**Output Format:**
Please respond with a JSON object containing:
{
  "title": "Trip title",
  "summary": "Brief trip overview",
  "days": [
    {
      "day": 1,
      "date": "MM/DD/YYYY",
      "activities": [
        {
          "time": "9:00 AM",
          "name": "Activity name",
          "location": "Exact location/address",
          "description": "Detailed description",
          "duration": "2 hours",
          "cost": 500,
          "category": "attraction|food|accommodation|transport|shopping|entertainment",
          "bookingRequired": true/false,
          "tips": "Helpful tips"
        }
      ],
      "estimatedCost": 2000,
      "notes": "Day summary and tips"
    }
  ],
  "tips": ["General tip 1", "General tip 2"],
  "totalEstimatedCost": 8000
}

Focus on authentic Baguio experiences, local cuisine, and must-see attractions. Make it practical and achievable within the budget.
    `.trim();
  }

  private calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end days
  }

  private parseAIResponse(aiResponse: string, request: ItineraryRequest): GeneratedItinerary {
    try {
      console.log('Raw AI response:', aiResponse);
      
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('No JSON found in AI response, using fallback');
        return this.createFallbackItinerary(request);
      }

      const parsedData = JSON.parse(jsonMatch[0]);
      console.log('Parsed AI data:', parsedData);
      
      // Validate required fields
      if (!parsedData.days || !Array.isArray(parsedData.days) || parsedData.days.length === 0) {
        console.warn('Invalid days data in AI response, using fallback');
        return this.createFallbackItinerary(request);
      }
      
      // Generate a unique ID
      const id = `itinerary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Calculate total budget
      const totalBudget = parsedData.totalEstimatedCost || 
        parsedData.days.reduce((sum: number, day: any) => sum + (day.estimatedCost || 0), 0);

      return {
        id,
        title: parsedData.title || `${request.destination || 'Baguio'} Adventure`,
        destination: request.destination || 'Baguio City, Philippines',
        startDate: request.startDate,
        endDate: request.endDate,
        duration: this.calculateDays(request.startDate, request.endDate),
        travelers: request.travelers,
        totalBudget,
        currency: request.currency,
        preference: request.preference,
        days: parsedData.days || [],
        summary: parsedData.summary || 'AI-generated itinerary for your Baguio adventure',
        tips: parsedData.tips || [],
        createdAt: new Date().toISOString(),
      };

    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.log('Using fallback itinerary due to parsing error');
      
      // Fallback: create a basic itinerary structure
      return this.createFallbackItinerary(request);
    }
  }

  private createFallbackItinerary(request: ItineraryRequest): GeneratedItinerary {
    const days = this.calculateDays(request.startDate, request.endDate);
    const dailyBudget = request.budget;
    
    return {
      id: `fallback_${Date.now()}`,
      title: `${request.destination || 'Baguio'} Adventure`,
      destination: request.destination || 'Baguio City, Philippines',
      startDate: request.startDate,
      endDate: request.endDate,
      duration: days,
      travelers: request.travelers,
      totalBudget: dailyBudget * days,
      currency: request.currency,
      preference: request.preference,
      days: Array.from({ length: days }, (_, index) => {
        const activities = index === 0 ? [
          {
            time: '2:00 PM',
            name: 'Check in at hotel',
            location: 'Hotel Reception',
            description: 'Arrive at your hotel and complete check-in procedures',
            duration: '30 minutes',
            cost: 0,
            category: 'accommodation' as const,
            bookingRequired: true,
            tips: 'Have your ID and booking confirmation ready'
          },
          {
            time: '3:00 PM',
            name: 'Explore Baguio City',
            location: 'Baguio City Center',
            description: 'Discover the beauty of Baguio City',
            duration: 'Full day',
            cost: Math.floor(dailyBudget * 0.6),
            category: 'attraction' as const,
            bookingRequired: false,
            tips: 'Wear comfortable walking shoes'
          }
        ] : [
          {
            time: '9:00 AM',
            name: 'Explore Baguio City',
            location: 'Baguio City Center',
            description: 'Discover the beauty of Baguio City',
            duration: 'Full day',
            cost: Math.floor(dailyBudget * 0.6),
            category: 'attraction' as const,
            bookingRequired: false,
            tips: 'Wear comfortable walking shoes'
          }
        ];

        return {
          day: index + 1,
          date: request.startDate, // You might want to calculate actual dates
          activities,
          estimatedCost: dailyBudget,
          notes: `Day ${index + 1} of your Baguio adventure`
        };
      }),
      summary: 'AI-generated itinerary for your Baguio adventure',
      tips: [
        'Pack warm clothes as Baguio can be chilly',
        'Try the local strawberry taho',
        'Visit Burnham Park for relaxation'
      ],
      createdAt: new Date().toISOString(),
    };
  }

  // Test method to verify API connection
  async testConnection(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }
}

export const aiService = new AIService();
