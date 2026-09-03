export type ProjectCategory = "Music" | "Moving Image" | "Live" | "Cross-media" | "Curation" | "Theatre" | "Exhibition" | "Broadcast";

export type Project = {
  slug: string;
  title: string;
  year?: string;
  category: ProjectCategory;
  subtype?: string;
  role?: string[];
  collaborators?: string[];
  label?: string;
  location?: string;
  description?: string;
  externalLinks?: { label: string; url: string }[];
  press?: { title: string; context?: string; url?: string }[];
  relatedTitles?: string[];
  artwork?: string;
  featured?: "home-primary" | "home-secondary" | "practice";
  selectedOrder?: number;
  verificationStatus: "confirmed" | "archive-only" | "later-verification" | "needs-review";
  mediaStatus?: "confirmed" | "placeholder";
};

export const archiveFilters = ["ALL", "MUSIC", "MOVING IMAGE", "LIVE", "CROSS-MEDIA", "CURATION"] as const;

export const projects: Project[] = [
  {
    slug: "cyberspace",
    title: "Cyberspace",
    category: "Music",
    subtype: "Release",
    label: "Kit Records",
    artwork: "/assets/cyberspace.jpg",
    externalLinks: [{ label: "Bandcamp", url: "https://shenao.bandcamp.com/" }],
    press: [{ title: "Spool's Out - cassette reviews", context: "THE QUIETUS" }],
    featured: "home-primary",
    selectedOrder: 1,
    verificationStatus: "confirmed",
    mediaStatus: "confirmed"
  },
  {
    slug: "bug-party",
    title: "Bug Party",
    category: "Music",
    subtype: "Release",
    label: "Kit Records",
    artwork: "/assets/bugparty.jpg",
    externalLinks: [{ label: "Bandcamp", url: "https://shenao.bandcamp.com/" }],
    press: [{ title: "MUITO PICKS" }],
    featured: "home-primary",
    selectedOrder: 2,
    verificationStatus: "confirmed",
    mediaStatus: "confirmed"
  },
  {
    slug: "role-model",
    title: "Role Model",
    year: "2024",
    category: "Moving Image",
    subtype: "Film",
    role: ["Audiovisual composition", "Mix"],
    collaborators: ["Hongxuan Wang"],
    externalLinks: [
      { label: "Project", url: "https://www.thebluecoat.org.uk/library/event/dahong-hongxuan-wang-role-model" }
    ],
    featured: "home-secondary",
    selectedOrder: 3,
    verificationStatus: "confirmed",
    mediaStatus: "placeholder"
  },
  {
    slug: "fancy-a-bite",
    title: "Fancy A BITE?",
    year: "2024",
    category: "Theatre",
    subtype: "Composition",
    externalLinks: [{ label: "SoundCloud", url: "https://soundcloud.com/fancy-a-bite/fancy-a-bite" }],
    selectedOrder: 4,
    verificationStatus: "confirmed",
    mediaStatus: "placeholder"
  },
  {
    slug: "two-dreadful-children-unipre",
    title: "two dreadful children / unipre",
    year: "2024",
    category: "Music",
    subtype: "Release",
    label: "Self-released",
    externalLinks: [{ label: "Bandcamp", url: "https://shenao.bandcamp.com/album/two-dreadful-children-unipre" }],
    selectedOrder: 5,
    verificationStatus: "confirmed",
    mediaStatus: "placeholder"
  },
  {
    slug: "no-idea",
    title: "No Idea",
    category: "Curation",
    subtype: "Events / Radio",
    description: "Independent music events and online radio.",
    externalLinks: [
      { label: "Baihui", url: "https://baihui.live/hosts/no-idea/en/" },
      { label: "Resident Advisor", url: "https://ra.co/promoters/183279" }
    ],
    featured: "practice",
    selectedOrder: 6,
    verificationStatus: "confirmed",
    mediaStatus: "placeholder"
  },
  {
    slug: "openband-openscore",
    title: "Openband / Openscore",
    category: "Curation",
    subtype: "Community / Improvisation",
    description: "Interdisciplinary improvisation practice built around an open, non-hierarchical environment for making sound together.",
    externalLinks: [
      { label: "Archive", url: "https://alschaffer.blogspot.com/search/label/OPEN%2520BAND" },
      { label: "Mixcloud", url: "https://www.mixcloud.com/al_schaffer/playlists/open-band/" }
    ],
    featured: "practice",
    selectedOrder: 7,
    verificationStatus: "confirmed",
    mediaStatus: "placeholder"
  },
  {
    slug: "untitled-land",
    title: "Untitled Land",
    year: "2022",
    category: "Moving Image",
    externalLinks: [{ label: "SoundCloud", url: "https://soundcloud.com/shen-ao/sets/untitled-land" }],
    selectedOrder: 8,
    verificationStatus: "confirmed",
    mediaStatus: "placeholder"
  },
  {
    slug: "paradise-dream-2",
    title: "Paradise Dream 2",
    year: "2019",
    category: "Exhibition",
    subtype: "Cross-media",
    externalLinks: [{ label: "YouTube", url: "http://youtu.be/DxFpkAjWu98?si=hG1fLMVpPATLvIqX" }],
    selectedOrder: 9,
    verificationStatus: "confirmed",
    mediaStatus: "placeholder"
  },
  {
    slug: "clouds-from-underground",
    title: "Clouds from Underground",
    year: "2021",
    category: "Music",
    subtype: "Release",
    externalLinks: [{ label: "Bandcamp", url: "https://shenao.bandcamp.com/album/clouds-from-underground-2" }],
    verificationStatus: "confirmed",
    mediaStatus: "placeholder"
  },
  {
    slug: "cctv-selected-broadcast-work",
    title: "Selected Broadcast Work / CCTV-13",
    category: "Broadcast",
    relatedTitles: ["龙腾虎跃中国年", "瑞兔呈祥中过年", "在希望的田野上", "大美边疆行", "CCTV 新闻频道“中国空间站”系列", "高端访谈"],
    verificationStatus: "archive-only",
    mediaStatus: "placeholder"
  },
  { slug: "douyin-cultural-promo", title: "Douyin Cultural Product Promo", category: "Moving Image", verificationStatus: "archive-only", mediaStatus: "placeholder" },
  { slug: "zhang-jian-jingdezhen", title: "Zhang Jian and Jingdezhen", category: "Moving Image", verificationStatus: "archive-only", mediaStatus: "placeholder" },
  { slug: "iqiyi-vr-se", title: "iQIYI VR SE Promo", category: "Moving Image", verificationStatus: "archive-only", mediaStatus: "placeholder" },
  { slug: "mr-monster-resource", title: "Mr.Monster Resource", category: "Cross-media", verificationStatus: "archive-only", mediaStatus: "placeholder" },
  { slug: "the-back-door-of-stage", title: "the back door of stage", category: "Cross-media", verificationStatus: "archive-only", mediaStatus: "placeholder" },
  { slug: "tunnel", title: "Tunnel", category: "Cross-media", subtype: "Moving Image", verificationStatus: "needs-review", mediaStatus: "placeholder" }
];

export const selectedWorks = projects
  .filter((project) => project.selectedOrder)
  .sort((a, b) => Number(a.selectedOrder) - Number(b.selectedOrder));

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
