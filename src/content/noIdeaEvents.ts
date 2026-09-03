export type NoIdeaEvent = {
  slug: string;
  series: string;
  edition: string;
  date: string;
  displayDate: string;
  day: string;
  venue: string;
  room: string;
  address: string;
  city: string;
  postcode: string;
  genres: string[];
  lineup: string[];
  roles: string[];
  description: string;
  heroImage: string;
  posterImage: string;
  galleryImages: { src: string; alt: string }[];
  externalLinks: {
    residentAdvisor: string;
    noIdeaRadio: string;
    residentAdvisorPromoter: string;
    shaiSpace: string;
  };
  verified: boolean;
};

export const noIdeaEvents: NoIdeaEvent[] = [
  {
    slug: "2026-05-23",
    series: "No Idea",
    edition: "No Idea #2",
    date: "2026-05-23",
    displayDate: "23 MAY 2026",
    day: "SATURDAY",
    venue: "Shai Space",
    room: "Studio 4",
    address: "17 Latona Rd",
    city: "London",
    postcode: "SE15 6RX",
    genres: ["Ambient", "Experimental"],
    lineup: ["Stella Z", "Kirk Barley", "Li Song", "James Creed", "Francis Moore", "Teendrum"],
    roles: ["Organiser", "Performer"],
    description: "An ambient / experimental event series developed from No Idea's online-radio practice and centred on listening.",
    heroImage: "/assets/no-idea/2026-05-23/hero.webp",
    posterImage: "/assets/no-idea/2026-05-23/poster.webp",
    galleryImages: [
      { src: "/assets/no-idea/2026-05-23/gallery-01.webp", alt: "Performer at No Idea #2, Shai Space, London." },
      { src: "/assets/no-idea/2026-05-23/gallery-02.webp", alt: "Live performance at No Idea #2." },
      { src: "/assets/no-idea/2026-05-23/gallery-03.webp", alt: "Audience at No Idea #2, Shai Space, London." },
      { src: "/assets/no-idea/2026-05-23/gallery-04.webp", alt: "Electronic performance at No Idea #2." },
      { src: "/assets/no-idea/2026-05-23/gallery-05.webp", alt: "Live performance at No Idea #2." },
      { src: "/assets/no-idea/2026-05-23/gallery-06.webp", alt: "Electronic performance at No Idea #2." },
      { src: "/assets/no-idea/2026-05-23/gallery-07.webp", alt: "Audience at No Idea #2, Shai Space, London." }
    ],
    externalLinks: {
      residentAdvisor: "https://ra.co/events/2432167",
      noIdeaRadio: "https://baihui.live/hosts/no-idea/en/",
      residentAdvisorPromoter: "https://ra.co/promoters/183279",
      shaiSpace: "https://www.instagram.com/shai.space/"
    },
    verified: true
  }
];

export const latestNoIdeaEvent = noIdeaEvents[0];

export const getNoIdeaEvent = (slug: string) => noIdeaEvents.find((event) => event.slug === slug);
