import { doctor, education, experience, awards, publications, research, conferences, contactInfo, expertise } from "@/lib/doctor-data";
import {
  DEFAULT_BLOGS,
  DEFAULT_REVIEWS,
  DEFAULT_SERVICES,
} from "@/lib/default-content-data";
import type { AboutContent, Blog, Review, Service } from "@/types/content";

// Navigation item type
export type NavLink = { label: string; href: string };

// Section types
export type HomeContent = {
  hero: {
    eyebrow: string;
    title: string;
    emphasis: string;
    summary: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
  };
  aboutPreview: {
    quote: string;
    summary: string;
    highlights: Array<{ title: string; desc: string }>;
  };
  cta: {
    eyebrow: string;
    title: string;
    summary: string;
    appointmentLabel: string;
    appointmentHref: string;
    whatsappLabel: string;
    servicesLabel: string;
    hospitalLocation: string;
  };
  beforeAfterGallery: {
    eyebrow: string;
    title: string;
    subtitle: string;
    images: Array<{ src: string; alt: string; label: string }>;
  };
  awardsSummary: {
    title: string;
    subtitle: string;
  };
};

export type AboutPageContent = {
  heading: string;
  qualifications: string;
  pageDescription: string;
};

export type ExperiencePageContent = {
  heading: string;
  summary: string;
};

export type TestimonialsPageContent = {
  heading: string;
  subheading: string;
  video: {
    eyebrow: string;
    title: string;
    subtitle: string;
    youtubeUrl: string;
    videoTitle: string;
    videoNote: string;
  };
  written: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
};

export type BlogPageContent = {
  heading: string;
  subheading: string;
};

export type ServicesPageContent = {
  heading: string;
  subheading: string;
  categoryCosmeticTitle: string;
  categoryReconstructiveTitle: string;
};

export type DoctorTalkPageContent = {
  heading: string;
  subheading: string;
};

export type DoctorTalkItem = {
  id: string;
  type: "article" | "video";
  title: string;
  description: string;
  content?: string;
  category?: string;
  date?: string;
  readTime?: string;
  youtubeUrl?: string;
};

export type ContactPageContent = {
  heading: string;
  subheading: string;
  calendarHeading: string;
  calendarSubheading: string;
  formHeading: string;
  locationHeading: string;
  locationAddress: string;
  formLabels: {
    fullName: string;
    phone: string;
    email: string;
    concern: string;
    preferredTime: string;
    howDidYouHear: string;
    submit: string;
  };
};

export type NavigationContent = {
  links: NavLink[];
  services: {
    reconstructive: NavLink[];
    cosmetic: NavLink[];
  };
};

export type FooterContent = {
  bio: string;
  qualifications: string;
  servicesTitle: string;
  services: NavLink[];
  contactTitle: string;
  contactLocation: string;
  contactEmail: string;
  linksTitle: string;
  links: NavLink[];
  copyright: string;
};

export type SiteSeoContent = {
  titleDefault: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  openGraph: {
    type: "website";
    locale: string;
    siteName: string;
  };
};

export type PageSeoEntry = {
  title: string;
  description: string;
  keywords: string[];
  canonicalPath: string;
};

export type PageSeoContent = {
  home: PageSeoEntry;
  about: PageSeoEntry;
  aboutUs: PageSeoEntry;
  experience: PageSeoEntry;
  doctorsTalk: PageSeoEntry;
  drVideo: PageSeoEntry;
  testimonials: PageSeoEntry;
  reviews: PageSeoEntry;
  blog: PageSeoEntry;
  services: PageSeoEntry;
  contact: PageSeoEntry;
  contactUs: PageSeoEntry;
};

export type SiteContent = {
  // Navigation & Layout
  navigation: NavigationContent;
  footer: FooterContent;
  siteSeo: SiteSeoContent;
  pageSeo: PageSeoContent;
  
  // Pages
  home: HomeContent;
  aboutPage: AboutPageContent;
  experiencePage: ExperiencePageContent;
  testimonialsPage: TestimonialsPageContent;
  blogPage: BlogPageContent;
  servicesPage: ServicesPageContent;
  doctorTalkPage: DoctorTalkPageContent;
  contactPage: ContactPageContent;
  
  // Dynamic content
  about: AboutContent & {
    bio: string;
    qualifications: string;
    currentPosition: string;
    experienceSummary: string;
    philosophy: string;
    education: typeof education;
    expertise: typeof import("@/lib/doctor-data").expertise;
    awards: typeof awards;
  };
  experience: {
    experience: typeof experience;
    publications: typeof publications;
    research: typeof research;
    conferences: typeof conferences;
    awards: typeof awards;
  };
  doctorTalk: DoctorTalkItem[];
  testimonials: Review[];
  blog: Blog[];
  services: Service[];
  contact: {
    phone: string;
    email: string;
    address: string;
    hospital: string;
  };
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  // Navigation
  navigation: {
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/aboutus" },
      { label: "Experience", href: "/experience" },
      { label: "Doctor's Talk", href: "/drvideo" },
      { label: "Testimonials", href: "/reviews" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contactus" },
    ],
    services: {
      reconstructive: [
        { label: "Onco Reconstruction", href: "/services/onco-reconstruction" },
        { label: "Breast Reconstruction", href: "/services/breast-reconstruction" },
        { label: "Trauma Reconstruction", href: "/services/trauma-reconstruction" },
        { label: "Hand Surgery", href: "/services/hand-surgery" },
        { label: "Microvascular Surgery", href: "/services/microvascular-surgery" },
        { label: "Maxillofacial Trauma", href: "/services/maxillofacial-trauma" },
        { label: "Facial Plastic Surgery", href: "/services/facial-plastic-surgery" },
      ],
      cosmetic: [
        { label: "Breast Augmentation", href: "/services/breast-augmentation" },
        { label: "Breast Reduction", href: "/services/breast-reduction" },
        { label: "Breast Lift", href: "/services/breast-lift" },
        { label: "Rhinoplasty", href: "/services/rhinoplasty" },
        { label: "Tummy Tuck", href: "/services/tummy-tuck" },
        { label: "Body Lipocontouring", href: "/services/body-lipocontouring" },
        { label: "Gynecomastia Reduction", href: "/services/gynecomastia-reduction" },
      ],
    },
  },

  // Footer
  footer: {
    bio: "Consultant Plastic & Reconstructive Surgeon at CARE Hospitals, Gachibowli, Hyderabad. Specialising in aesthetic and reconstructive plastic surgery with over 14 years of clinical experience.",
    qualifications: "MCh Plastic Surgery · Board-Certified",
    servicesTitle: "Services",
    services: [
      { label: "Onco Reconstruction", href: "/services/onco-reconstruction" },
      { label: "Breast Reconstruction", href: "/services/breast-reconstruction" },
      { label: "Microvascular Surgery", href: "/services/microvascular-surgery" },
      { label: "Breast Augmentation", href: "/services/breast-augmentation" },
      { label: "Breast Lift", href: "/services/breast-lift" },
      { label: "Rhinoplasty", href: "/services/rhinoplasty" },
      { label: "Body Lipocontouring", href: "/services/body-lipocontouring" },
      { label: "Gynecomastia", href: "/services/gynecomastia-reduction" },
    ],
    contactTitle: "Contact",
    contactLocation:
      "Room No. 20, 1st Floor, AIG Hospitals, Banjara Hills, Hyderabad – 500034",
    contactEmail: "Appointments via AIG Hospitals",
    linksTitle: "Links",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/aboutus" },
      { label: "Services", href: "/services" },
      { label: "Experience", href: "/experience" },
      { label: "Testimonials", href: "/reviews" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contactus" },
    ],
    copyright: "Dr. Divya Sai Narsingam. All rights reserved.",
  },

  siteSeo: {
    titleDefault:
      "Dr. Divya Sai Narsingam | Plastic & Reconstructive Surgeon Hyderabad",
    titleTemplate: "%s | Dr. Divya Sai Narsingam",
    description:
      "Dr. Divya Sai Narsingam – Board-certified Plastic & Reconstructive Surgeon at CARE Hospitals, Gachibowli, Hyderabad. MCh Plastic Surgery. Expert in cosmetic surgery, breast reconstruction, and microvascular surgery.",
    keywords: [
      "Plastic Surgeon in Hyderabad",
      "Reconstructive Surgeon Gachibowli",
      "Breast Reconstruction Surgeon Hyderabad",
      "Dr Divya Sai Narsingam",
      "CARE Hospitals Hyderabad plastic surgery",
      "cosmetic surgeon Hyderabad",
      "MCh Plastic Surgery Hyderabad",
    ],
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: "Dr. Divya Sai Narsingam – Plastic Surgeon",
    },
  },

  pageSeo: {
    home: {
      title:
        "Plastic & Reconstructive Surgeon in Hyderabad | Dr. Divya Sai Narsingam",
      description:
        "Dr. Divya Sai Narsingam – MCh Plastic Surgery. Consultant at CARE Hospitals Gachibowli, Hyderabad. 14+ years experience in reconstructive and cosmetic surgery.",
      keywords: [
        "plastic surgeon Hyderabad",
        "reconstructive surgeon Hyderabad",
        "cosmetic surgeon Hyderabad",
        "CARE Hospitals Gachibowli",
      ],
      canonicalPath: "/",
    },
    about: {
      title: "About Dr. Divya Sai Narsingam | Plastic Surgeon Hyderabad",
      description:
        "Learn about Dr. Divya Sai Narsingam – MCh Plastic Surgery, University Topper, Consultant at CARE Hospitals Gachibowli. 14+ years of reconstructive and cosmetic surgery experience in Hyderabad.",
      keywords: [
        "Dr Divya Sai Narsingam biography",
        "MCh Plastic Surgery Hyderabad",
        "CARE Hospitals plastic surgeon",
        "plastic surgeon Gachibowli",
      ],
      canonicalPath: "/aboutus",
    },
    aboutUs: {
      title: "About Dr. Divya Sai Narsingam | Plastic Surgeon Hyderabad",
      description:
        "Learn about Dr. Divya Sai Narsingam – qualifications, experience, and patient-centered reconstructive and cosmetic surgery practice in Hyderabad.",
      keywords: [
        "about Dr Divya Sai Narsingam",
        "plastic surgeon Hyderabad profile",
        "CARE Hospitals doctor biography",
      ],
      canonicalPath: "/aboutus",
    },
    experience: {
      title: "Experience & Academics | Dr. Divya Sai Narsingam",
      description:
        "Academic and professional timeline of Dr. Divya Sai Narsingam – publications, research, conference presentations, and career experience at CARE Hospitals Hyderabad.",
      keywords: [
        "Dr Divya Sai experience",
        "plastic surgeon academic profile Hyderabad",
        "CARE Hospitals surgeon publications",
      ],
      canonicalPath: "/experience",
    },
    doctorsTalk: {
      title: "Doctor's Talk | Articles & Videos by Dr. Divya Sai Narsingam",
      description:
        "Educational articles, clinical insights, and video content by Dr. Divya Sai Narsingam – Plastic & Reconstructive Surgeon at CARE Hospitals, Hyderabad.",
      keywords: [
        "doctor talk plastic surgery",
        "plastic surgery education Hyderabad",
        "Dr Divya articles and videos",
      ],
      canonicalPath: "/drvideo",
    },
    drVideo: {
      title: "Doctor Videos & Educational Talks | Dr. Divya Sai Narsingam",
      description:
        "Explore doctor talk videos and educational patient guidance from Dr. Divya Sai Narsingam.",
      keywords: [
        "plastic surgery videos Hyderabad",
        "Dr Divya educational videos",
        "patient guidance plastic surgeon",
      ],
      canonicalPath: "/drvideo",
    },
    testimonials: {
      title: "Testimonials & Video Reviews | Dr. Divya Sai Narsingam",
      description:
        "Read patient testimonials and watch video reviews for reconstructive and cosmetic plastic surgery with Dr. Divya Sai Narsingam at CARE Hospitals, Hyderabad.",
      keywords: [
        "plastic surgery testimonials Hyderabad",
        "video testimonials plastic surgeon",
        "Dr Divya Sai Narsingam testimonials",
      ],
      canonicalPath: "/reviews",
    },
    reviews: {
      title: "Patient Reviews & Testimonials | Dr. Divya Sai Narsingam",
      description:
        "Read patient reviews for reconstructive and cosmetic procedures by Dr. Divya Sai Narsingam at CARE Hospitals, Hyderabad.",
      keywords: [
        "patient reviews plastic surgeon Hyderabad",
        "cosmetic surgery reviews Hyderabad",
        "reconstructive surgery testimonials",
      ],
      canonicalPath: "/reviews",
    },
    blog: {
      title: "Plastic Surgery Blog | Dr. Divya Sai Narsingam",
      description:
        "Clinical insights, patient education, and treatment explainers by Dr. Divya Sai Narsingam.",
      keywords: [
        "plastic surgery blog Hyderabad",
        "patient education plastic surgeon",
        "Dr Divya articles",
      ],
      canonicalPath: "/blog",
    },
    services: {
      title: "Plastic Surgery Services Hyderabad | Reconstructive & Cosmetic",
      description:
        "Comprehensive plastic and reconstructive surgery services by Dr. Divya Sai Narsingam at CARE Hospitals, Gachibowli, Hyderabad. Breast reconstruction, onco reconstruction, cosmetic procedures and more.",
      keywords: [
        "plastic surgery services Hyderabad",
        "breast reconstruction Hyderabad",
        "onco reconstruction Hyderabad",
        "cosmetic surgery Gachibowli",
        "microvascular surgery Hyderabad",
        "gynecomastia reduction Hyderabad",
        "tummy tuck Hyderabad",
        "facial plastic surgery Hyderabad",
      ],
      canonicalPath: "/services",
    },
    contact: {
      title:
        "Book Appointment | Dr. Divya Sai Narsingam – AIG Hospitals Banjara Hills",
      description:
        "Book a consultation with Dr. Divya Sai Narsingam at AIG Hospitals, Banjara Hills, Hyderabad. Plastic & Reconstructive Surgeon – MCh (Plastic Surgery).",
      keywords: [
        "book appointment plastic surgeon Hyderabad",
        "contact Dr Divya Sai Narsingam",
        "AIG Hospitals Banjara Hills consultation",
      ],
      canonicalPath: "/contactus",
    },
    contactUs: {
      title: "Contact and Appointment Booking | Dr. Divya Sai Narsingam",
      description:
        "Book appointments and contact Dr. Divya Sai Narsingam for reconstructive and cosmetic surgery consultations in Hyderabad.",
      keywords: [
        "appointment booking plastic surgeon Hyderabad",
        "contact reconstructive surgeon Hyderabad",
        "cosmetic surgery consultation Hyderabad",
      ],
      canonicalPath: "/contactus",
    },
  },

  // Page content
  home: {
    hero: {
      eyebrow: "Plastic & Reconstructive Surgery · Hyderabad",
      title: "Precision Surgery.",
      emphasis: "Compassionate",
      summary:
        "Dr. Divya Sai Narsingam is a board-certified Plastic & Reconstructive Surgeon with over 14 years of clinical experience. Consultant at CARE Hospitals, Gachibowli, Hyderabad.",
      ctaPrimary: { label: "Book Consultation", href: "/contactus" },
      ctaSecondary: { label: "About the Doctor", href: "/aboutus" },
    },
    aboutPreview: {
      quote:
        "Surgery is as much about listening as it is about operating. Every patient brings a unique story, unique anatomy, and unique expectations.",
      summary:
        "Dr. Divya Sai Narsingam holds an MCh in Plastic Surgery and practices as a Consultant at CARE Hospitals, Gachibowli.",
      highlights: [
        { title: "Reconstructive Surgery", desc: "Onco, breast, trauma, head & neck" },
        { title: "Aesthetic Surgery", desc: "Face, body, breast procedures" },
        { title: "Microvascular", desc: "Free flap and perforator flaps" },
        { title: "Burns & Scars", desc: "Grafting and scar revision" },
        { title: "Trauma", desc: "Acute injury and complex wound care" },
        { title: "Craniomaxillofacial Trauma", desc: "Facial bone and soft tissue repair" },
        { title: "Complex Lower Limb Trauma Reconstruction", desc: "Limb salvage and coverage planning" },
        { title: "Hand Surgery", desc: "Tendon, nerve, and functional restoration" },
      ],
    },
    cta: {
      eyebrow: "AIG Hospitals, Banjara Hills",
      title: "Ready to discuss your concerns?",
      summary:
        "Schedule a consultation with Dr. Narsingam at AIG Hospitals, Banjara Hills.",
      appointmentLabel: "Request an Appointment",
      appointmentHref: "/contactus",
      whatsappLabel: "WhatsApp Us",
      servicesLabel: "Explore Procedures",
      hospitalLocation:
        "Room No. 20, 1st Floor, AIG Hospitals, Banjara Hills, Hyderabad – 500034",
    },
    beforeAfterGallery: {
      eyebrow: "Before & After",
      title: "Before & After Gallery",
      subtitle: "",
      images: [
        {
          src: "/images/img/about.jpeg",
          alt: "Breast reconstruction treatment gallery",
          label: "Breast reconstruction",
        },
        {
          src: "/images/img/about.jpeg",
          alt: "Breast lift treatment gallery",
          label: "Breast lift",
        },
        {
          src: "/images/img/about.jpeg",
          alt: "Rhinoplasty treatment gallery",
          label: "Rhinoplasty",
        },
        {
          src: "/images/img/about.jpeg",
          alt: "Body contouring treatment gallery",
          label: "Body contouring",
        },
      ],
    },
    awardsSummary: {
      title: "Recognition & Awards",
      subtitle: "Clinical excellence and contributions to plastic surgery",
    },
  },

  aboutPage: {
    heading: "Dr. Divya Sai Narsingam",
    qualifications: "MBBS · MS (General Surgery) · MCh (Plastic Surgery)",
    pageDescription: "Your Doctor",
  },

  experiencePage: {
    heading: "Clinical Experience & Expertise",
    summary: "14+ years of clinical practice in reconstructive and cosmetic surgery",
  },

  testimonialsPage: {
    heading: "Patient Testimonials",
    subheading: "Real feedback from patients who trust our care",
    video: {
      eyebrow: "Video Testimonial",
      title: "Patient Video Story",
      subtitle:
        "Watch a patient share their experience, treatment journey, and recovery.",
      youtubeUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
      videoTitle: "Featured Patient Experience",
      videoNote: "Shared with consent.",
    },
    written: {
      eyebrow: "Written Testimonials",
      title: "Patient Reviews",
      subtitle:
        "Experiences shared by patients following reconstructive and cosmetic procedures.",
    },
  },

  blogPage: {
    heading: "Blog and patient education",
    subheading:
      "Practical medical guidance for patients exploring reconstructive and cosmetic treatment options.",
  },

  servicesPage: {
    heading: "Services",
    subheading: "Comprehensive plastic and reconstructive surgery solutions",
    categoryCosmeticTitle: "Cosmetic Surgery",
    categoryReconstructiveTitle: "Reconstructive Surgery",
  },

  doctorTalkPage: {
    heading: "Doctor's Talk",
    subheading: "Educational video insights on procedures and patient care",
  },

  contactPage: {
    heading: "Book a Consultation",
    subheading:
      "Pick a slot directly from the calendar below, or use the form to send a consultation request. Our team will confirm your appointment and send any pre-visit instructions.",
    calendarHeading: "Choose an Available Slot",
    calendarSubheading:
      "Instantly book your consultation — select a date & time that works for you.",
    formHeading: "Consultation Request",
    locationHeading: "Location",
    locationAddress: contactInfo.fullAddress,
    formLabels: {
      fullName: "Full Name",
      phone: "Phone Number",
      email: "Email Address",
      concern: "Describe Your Concern",
      preferredTime: "Preferred Time",
      howDidYouHear: "How did you hear about us?",
      submit: "Submit Request",
    },
  },

  // Dynamic content
  about: {
    heading: "About Dr. Divya Sai Narsingam",
    summary: doctor.summary,
    meta_title: "About Dr. Divya Sai Narsingam | Plastic Surgeon Hyderabad",
    meta_description:
      "Learn about qualifications, experience, and clinical approach of Dr. Divya Sai Narsingam in Hyderabad.",
    bio: doctor.summary,
    qualifications: doctor.qualifications,
    currentPosition: doctor.title,
    experienceSummary: "14+ years clinical · 9+ years specialist",
    philosophy: doctor.philosophy,
    education,
    expertise,
    awards,
  },
  experience: { experience, publications, research, conferences, awards },
  doctorTalk: [
    {
      id: "talk-article-1",
      type: "article",
      title: "Why consultation matters",
      description: "How a careful consultation shapes safer, more natural results.",
      content:
        "Consultation is where goals, anatomy, and safety meet. A structured discussion clarifies what is achievable and how to plan recovery.\n\nDr. Narsingam reviews medical history, explains surgical options, and aligns expectations before any procedure is recommended.",
      category: "Reconstructive",
      date: "February 2026",
      readTime: "4 min read",
    },
    {
      id: "talk-video-1",
      type: "video",
      title: "Introduction to Plastic and Reconstructive Surgery",
      description: "An overview of common procedures, safety, and recovery planning.",
      youtubeUrl: "",
    },
  ],
  testimonials: [
    ...DEFAULT_REVIEWS,
  ],
  blog: DEFAULT_BLOGS.map((blog) => ({ ...blog })),
  services: DEFAULT_SERVICES.map((service) => ({ ...service })) as Service[],
  contact: {
    phone: "+91 XXXXX XXXXX",
    email: "appointments@example.com",
    address: contactInfo.fullAddress,
    hospital: contactInfo.hospital,
  },
};
