export type PressType = "review" | "feature" | "recommendation" | "radio" | "interview" | "playlist";

export type PressItem = {
  id: string;
  type: PressType;
  outlet?: string;
  station?: string;
  programme?: string;
  title?: string;
  author?: string;
  date?: string;
  year?: string;
  track?: string;
  relatedProject?: string;
  location?: string;
  context?: string;
  quote?: string;
  url: string;
  cta: string;
  featured?: "primary" | "home" | "epk" | "about";
  verified: boolean;
};

export const pressItems: PressItem[] = [
  {
    id: "quietus-spools-out-july",
    type: "review",
    outlet: "THE QUIETUS",
    title: "Spool's Out: Cassette Reviews for July",
    author: "Daryl Worthington",
    year: "2026",
    relatedProject: "Cyberspace / Bug Party",
    context: "A review of the Cyberspace / Bug Party cassette in The Quietus' Spool's Out column.",
    quote: "astounding statements of intent",
    url: "https://thequietus.com/quietus-reviews/cassettes/spools-out-cassette-reviews-for-july-by-daryl-worthington/",
    cta: "READ",
    featured: "primary",
    verified: true
  },
  {
    id: "muito-buy-music-club-27",
    type: "recommendation",
    outlet: "MUITO RADIO",
    title: "Buy Music Club #27",
    year: "2026",
    relatedProject: "Cyberspace",
    context: "Cyberspace was selected for Muito Radio's monthly Bandcamp recommendations.",
    url: "https://muitoradio.com/buymusicclub/27",
    cta: "VIEW SELECTION",
    featured: "home",
    verified: true
  },
  {
    id: "nts-kit-records-bug-party",
    type: "radio",
    station: "NTS RADIO",
    programme: "KIT RECORDS",
    date: "14 MAR 2026",
    location: "LONDON",
    track: "BUG PARTY",
    context: "Bug Party featured in the Kit Records programme on NTS Radio.",
    url: "https://www.nts.live/shows/kitrecords/episodes/kitrecords-14th-march-2026",
    cta: "LISTEN / VIEW TRACKLIST",
    verified: true
  },
  {
    id: "nts-trevor-jackson-my-time",
    type: "radio",
    station: "NTS RADIO",
    programme: "TREVOR JACKSON",
    date: "05 MAY 2026",
    location: "LONDON",
    track: "MY TIME",
    context: "My Time was selected for Trevor Jackson's monthly NTS programme.",
    url: "https://www.nts.live/shows/trevorjackson/episodes/trevorjackson-5th-may-2026",
    cta: "LISTEN / VIEW TRACKLIST",
    featured: "home",
    verified: true
  }
];

export const verifiedPressItems = pressItems.filter((item) => item.verified);

export const homePressItems = [
  pressItems.find((item) => item.id === "quietus-spools-out-july"),
  pressItems.find((item) => item.id === "nts-trevor-jackson-my-time"),
  pressItems.find((item) => item.id === "muito-buy-music-club-27")
].filter((item): item is PressItem => Boolean(item));

export const aboutPressItems = [
  pressItems.find((item) => item.id === "quietus-spools-out-july"),
  pressItems.find((item) => item.id === "muito-buy-music-club-27")
].filter((item): item is PressItem => Boolean(item));

export const epkPressItems = homePressItems;
