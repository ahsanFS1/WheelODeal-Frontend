export interface Prize {
  id: string;
  text: string;
  color: string;
  probability: number;
  redirectUrl: string;
  glowColor: string;
}

export interface SpinResult {
  prize: Prize;
  rotation: number; // Add this line
}


export interface CarouselImage {
  url: string;
  alt: string;
}


export interface LandingPageConfig {
  hero: {
    headline: string;
    subheadline: string;
    ctaButton: {
      text: string;
      color: string;
      textColor: string;
      link: string;
    };
    backgroundImage?: string;
    logo?:string;
  };
  demo: {
    title: string;
    caption: string;
    secondaryCta: {
      text: string;
      color: string;
      textColor: string;
      link: string;
    };
  };
  features: {
    title: string;
    description: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  benefits: {
    title: string;
    description: string;
    items: string[];
  };
  howItWorks: {
    title: string;
    steps: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: Array<{
      id: string;
      content: string;
      name: string;
      role: string;
      company: string;
      rating: number;
    }>;
  };
  pricing: {
    title: string;
    plans: Array<{
      id: string;
      name: string;
      price: string;
      features: string[];
      buttonText: string;
      buttonColor: string;
      buttonTextColor: string;
      buttonLink: string;
    }>;
  };
  faq: {
    title: string;
    items: Array<{
      id: string;
      question: string;
      answer: string;
    }>;
  };
  finalCta: {
    title: string;
    buttonText: string;
    buttonLink: string;
    buttonColor: string;
    buttonTextColor: string;
    guarantee: string;
  };
}

export interface PageConfig {
  landingPage: LandingPageConfig;
  prizes: Prize[];
  backgroundColor: string;
  logo?: string;
  headerTitle?: string;
  subtitle?: string;
  backgroundImage?: string;
  carouselImages: CarouselImage[];
}