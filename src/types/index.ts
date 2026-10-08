export type Language = 'ru' | 'uz';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  startingPrice: string;
  priceRaw: number; // in UZS
  category: 'web' | 'bot' | 'mvp' | 'ai' | string;
  deliverables: string[];
  timeline: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  titleUz?: string;
  type: string;
  typeUz?: string;
  category: 'web' | 'bot' | 'mvp' | 'ai';
  shortDescription: string;
  shortDescriptionUz?: string;
  fullDescription: string;
  fullDescriptionUz?: string;
  isDemo: boolean;
  tags: string[];
  metrics: string;
  metricsUz?: string;
  previewColor: string;
  previewImage?: string;
  features: string[];
  featuresUz?: string[];
  link?: string;
}

export interface CalculatorState {
  serviceId: string;
  hasDesign: boolean;
  hasContent: boolean;
  urgency: 'standard' | 'fast';
  customNotes?: string;
}

export interface OrderSubmission {
  id: string;
  name: string;
  contact: string;
  serviceType: string;
  description: string;
  budget: string;
  createdAt: string;
}
