export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  process: string[];
  icon: string;
  imageUrl?: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  description: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  businessType: string;
  message: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}
