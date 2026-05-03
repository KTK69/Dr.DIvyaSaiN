import { doctor, education, experience, awards, publications, research, conferences, contactInfo, reconstructiveServices, cosmeticServices, expertise } from "@/lib/doctor-data";
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

export type ContactPageContent = {
  heading: string;
  subheading: string;
  calendarHeading: string;
  calendarSubheading: string;
  formHeading: string;
  locationHeading: string;
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

export type SiteContent = {
  // Navigation & Layout
  navigation: NavigationContent;
  footer: FooterContent;
  
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
  doctorTalk: Array<{ title: string; description: string; href: string }>;
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
      subtitle:
        "Placeholder images shown here. Replace with approved patient photographs through the admin panel.",
      images: [
        {
          src: "/images/img/about.jpeg",
          alt: "Before and after gallery placeholder 1",
          label: "Breast reconstruction",
        },
        {
          src: "/images/img/about.jpeg",
          alt: "Before and after gallery placeholder 2",
          label: "Breast lift",
        },
        {
          src: "/images/img/about.jpeg",
          alt: "Before and after gallery placeholder 3",
          label: "Rhinoplasty",
        },
        {
          src: "/images/img/about.jpeg",
          alt: "Before and after gallery placeholder 4",
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
  },

  blogPage: {
    heading: "Latest Articles",
    subheading: "Insights on cosmetic and reconstructive procedures",
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
      title: "Why consultation matters",
      description: "How a careful consultation shapes safer, more natural results.",
      href: "/contactus",
    },
  ],
  testimonials: [
    {
      id: "review-1",
      patient_name: "Verified patient feedback",
      procedure: "Breast reconstruction",
      quote:
        "The treatment journey was clearly explained and follow-up care was highly supportive.",
      rating: 5,
    },
    {
      id: "review-2",
      patient_name: "Verified patient feedback",
      procedure: "Gynecomastia reduction",
      quote:
        "Consultation was thoughtful and the surgical result aligned with expectations.",
      rating: 5,
    },
  ],
  blog: [],
  services: [...reconstructiveServices, ...cosmeticServices].map((item) => ({
    id: `service-${item.slug}`,
    slug: item.slug,
    name: item.name,
    summary: item.shortDesc,
    content: item.description,
    image: "/images/img/about.jpeg",
    category: reconstructiveServices.some((svc) => svc.slug === item.slug)
      ? "reconstructive"
      : "cosmetic",
    key_points: item.keyPoints,
    faq: [],
    meta_title: `${item.name} in Hyderabad | Dr. Divya Sai Narsingam`,
    meta_description: item.shortDesc,
  })) as Service[],
  contact: {
    phone: "+91 XXXXX XXXXX",
    email: "appointments@example.com",
    address: contactInfo.fullAddress,
    hospital: contactInfo.hospital,
  },
};
