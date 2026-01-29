// Types for Interior Design Studio

export interface HeroContent {
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

export interface AboutContent {
  title: string;
  description: string;
  image: string;
  stats: {
    years: number;
    projects: number;
    satisfaction: number;
  };
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'apartments' | 'houses' | 'commercial';
  image: string;
  description: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  projectType: string;
  text: string;
  rating: number;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  socialLinks: {
    instagram?: string;
    telegram?: string;
    whatsapp?: string;
  };
}

export interface SiteContent {
  companyName: string;
  hero: HeroContent;
  about: AboutContent;
  portfolio: PortfolioItem[];
  services: Service[];
  testimonials: Testimonial[];
  contacts: ContactInfo;
}

export interface AdminUser {
  username: string;
  password: string;
}

// New Project type with gallery
export interface Project {
  id: string;
  title: string;
  category: 'apartments' | 'houses' | 'commercial';
  coverImage: string;
  description: string;
  images: string[]; // Gallery images (10-20 photos)
  area?: string; // e.g. "120 м²"
  location?: string; // e.g. "Москва"
  year?: string; // e.g. "2024"
  createdAt: number; // timestamp
}

export interface ProjectsData {
  projects: Project[];
}
