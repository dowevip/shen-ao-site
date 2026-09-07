import { pressItems } from "./press";

export type ProjectCategory = "Music" | "Moving Image" | "Live" | "Cross-media" | "Curation" | "Theatre" | "Exhibition" | "Broadcast";

export type ProjectLink = { label: string; url: string };
export type MusicReleaseSection = "featured" | "other";
export type WorkSection = "selected" | "scoring" | "archive";
export type MediaSlot = { label: string; variant: "portrait" | "landscape" | "cinematic" | "square" };
export type RelatedWork = { title: string; year?: string; role?: string; description?: string; media?: MediaSlot };
export type SelectedCase = { title: string; url: string; description?: string; media?: MediaSlot };

export type Project = {
  slug: string;
  title: string;
  displayTitle?: string;
  year?: string;
  category: ProjectCategory;
  subtype?: string;
  role?: string[];
  collaborators?: string[];
  label?: string;
  location?: string;
  description?: string;
  intro?: string;
  creativeApproach?: string;
  externalLinks?: ProjectLink[];
  press?: { title: string; context?: string; url?: string }[];
  relatedTitles?: string[];
  relatedWorks?: RelatedWork[];
  selectedCases?: SelectedCase[];
  detailMedia?: MediaSlot[];
  artwork?: string;
  images?: { src: string; alt: string }[];
  photographyCredit?: string;
  featured?: "home-primary" | "home-secondary" | "practice";
  selectedOrder?: number;
  scoringOrder?: number;
  archiveOrder?: number;
  workSection?: WorkSection;
  workRoleLabel?: string;
  archiveDisplay?: boolean;
  musicReleaseSection?: MusicReleaseSection;
  musicReleaseOrder?: number;
  visibleInArchive?: boolean;
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
    externalLinks: [
      { label: "Bandcamp", url: "https://shenao.bandcamp.com/" },
      { label: "NetEase Music", url: "https://music.163.com/#/album?id=368232911" }
    ],
    press: [{ title: "Spool's Out - cassette reviews", context: "THE QUIETUS" }],
    featured: "home-primary",
    selectedOrder: 1,
    workSection: "selected",
    musicReleaseSection: "featured",
    musicReleaseOrder: 1,
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
    externalLinks: [
      { label: "Bandcamp", url: "https://shenao.bandcamp.com/" },
      { label: "NetEase Music", url: "https://music.163.com/#/album?id=371692074" }
    ],
    press: [{ title: "MUITO PICKS" }],
    featured: "home-primary",
    selectedOrder: 2,
    workSection: "selected",
    musicReleaseSection: "featured",
    musicReleaseOrder: 2,
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
    intro: "Role Model follows the experience of Chinese-American Hollywood star Anna May Wong as she returned to her ancestral home in Taishan, Guangdong, after confronting racial discrimination and the sense of being caught between being “too American” and “not Chinese enough”.",
    creativeApproach: "The score centres on distorted piano to create a beautiful but unstable sense of nostalgia. Displaced spatial treatment of the instruments further blurs that sense of memory.",
    externalLinks: [
      { label: "PROJECT ↗", url: "https://www.thebluecoat.org.uk/library/event/dahong-hongxuan-wang-role-model" },
      { label: "LISTEN TO SOUNDTRACK ↗", url: "https://soundcloud.com/shen-ao/role-model-soundtrack" }
    ],
    images: [
      {
        src: "/assets/role-model/DSC0944_1600px_sRGB.jpg",
        alt: "Exhibition view showing a projected close-up from Role Model."
      },
      {
        src: "/assets/role-model/DSC0919_1600px_sRGB.jpg",
        alt: "Exhibition view showing a filming scene projected in Role Model."
      },
      {
        src: "/assets/role-model/DSC0937_1600px_sRGB.jpg",
        alt: "Exhibition view showing a black-and-white family portrait projected in Role Model."
      },
      {
        src: "/assets/role-model/DSC0946_1600px_sRGB.jpg",
        alt: "Exhibition view showing a landscape scene projected in Role Model."
      }
    ],
    photographyCredit: "Photography: Roger Sinek",
    featured: "home-secondary",
    selectedOrder: 3,
    scoringOrder: 1,
    workSection: "selected",
    workRoleLabel: "FILM / SCORE + MIX",
    verificationStatus: "confirmed",
    mediaStatus: "confirmed"
  },
  {
    slug: "fancy-a-bite",
    title: "Fancy A BITE?",
    year: "2024",
    category: "Theatre",
    subtype: "Theatre / Dance",
    role: ["Composition"],
    intro: "Fancy A BITE? is a solo dance work exploring trauma and recovery following sexual violence. The production combines live projection, installation, music and fragmented physical language.",
    creativeApproach: "The score uses glitch-derived sound and synthesiser arpeggios alongside the production’s shifting visual language, moving through fear, loss of control, struggle and reconstruction.",
    externalLinks: [
      { label: "PROJECT / PRESS ↗", url: "https://cptheatre.co.uk/whatson/Big-Bang-18-March-2024" },
      { label: "SOUNDCLOUD ↗", url: "https://soundcloud.com/fancy-a-bite/fancy-a-bite" }
    ],
    images: [
      {
        src: "/assets/portfolio-projects/fancy-a-bite-stage.jpeg",
        alt: "Stage image from Fancy A BITE? with live projection."
      }
    ],
    detailMedia: [
      { label: "HERO PHOTO", variant: "landscape" },
      { label: "SECONDARY STAGE IMAGE", variant: "landscape" },
      { label: "POSTER", variant: "portrait" }
    ],
    selectedOrder: 4,
    scoringOrder: 2,
    workSection: "selected",
    workRoleLabel: "THEATRE / COMPOSITION",
    verificationStatus: "confirmed",
    mediaStatus: "confirmed"
  },
  {
    slug: "let-me-speak",
    title: "Let Me Speak",
    displayTitle: "LET ME SPEAK / 让我说",
    year: "2024",
    category: "Music",
    subtype: "Release",
    externalLinks: [{ label: "NetEase Music", url: "https://music.163.com/#/album?id=147663057" }],
    musicReleaseSection: "other",
    musicReleaseOrder: 1,
    visibleInArchive: false,
    verificationStatus: "confirmed",
    mediaStatus: "placeholder"
  },
  {
    slug: "two-dreadful-children-unipre",
    title: "two dreadful children / unipre",
    displayTitle: "Two Dreadful Children / Unipre",
    year: "2024",
    category: "Music",
    subtype: "Release",
    label: "Self-released",
    externalLinks: [{ label: "Bandcamp", url: "https://shenao.bandcamp.com/album/two-dreadful-children-unipre" }],
    musicReleaseSection: "other",
    musicReleaseOrder: 2,
    verificationStatus: "confirmed",
    mediaStatus: "placeholder"
  },
  {
    slug: "bamboo-blend",
    title: "Bamboo Blend",
    year: "2024",
    category: "Music",
    subtype: "Release",
    externalLinks: [{ label: "SoundCloud", url: "https://soundcloud.com/shen-ao/bamboo-blend" }],
    musicReleaseSection: "other",
    musicReleaseOrder: 3,
    visibleInArchive: false,
    verificationStatus: "confirmed",
    mediaStatus: "placeholder"
  },
  {
    slug: "no-idea",
    title: "No Idea",
    category: "Curation",
    subtype: "Events / Radio",
    description: "An independent ambient / experimental event and online-radio practice focused on creating a listening-oriented space. The work includes programming, budgeting, technical production and the coordination of live events.",
    externalLinks: [
      { label: "No Idea Radio", url: "https://baihui.live/hosts/no-idea/en/" },
      { label: "Resident Advisor", url: "https://ra.co/promoters/183279" }
    ],
    artwork: "/assets/no-idea/2026-05-23/poster.webp",
    images: [
      {
        src: "/assets/no-idea/2026-05-23/hero.webp",
        alt: "Shen Ao performing at Live With No Idea at Shai Space, London."
      }
    ],
    featured: "practice",
    selectedOrder: 5,
    workSection: "selected",
    workRoleLabel: "RADIO / LIVE EVENTS",
    verificationStatus: "confirmed",
    mediaStatus: "confirmed"
  },
  {
    slug: "openband-openscore",
    title: "Openband",
    category: "Curation",
    subtype: "Community / Improvisation",
    description: "Interdisciplinary improvisation practice built around an open, non-hierarchical environment for making sound together.",
    externalLinks: [
      { label: "Archive", url: "https://alschaffer.blogspot.com/search/label/OPEN%2520BAND" },
      { label: "Mixcloud", url: "https://www.mixcloud.com/al_schaffer/playlists/open-band/" }
    ],
    featured: "practice",
    selectedOrder: 6,
    workSection: "selected",
    workRoleLabel: "IMPROVISATION WORKSHOPS",
    verificationStatus: "confirmed",
    mediaStatus: "placeholder"
  },
  {
    slug: "untitled-land",
    title: "Untitled Land",
    year: "2022",
    category: "Moving Image",
    subtype: "Experimental Film",
    role: ["Score"],
    intro: "Untitled Land is an experimental short film by independent director Yuan Ye, exploring the experience of constructing virtual worlds and the effects of that process on perception.",
    creativeApproach: "The score combines analogue synthesiser with acoustic instruments, seeking a sense of reality being constructed through virtual means and responding to the film’s continual movement between physical and virtual imagery.",
    externalLinks: [
      { label: "WATCH / PROJECT ↗", url: "https://2022art.cafa.edu.cn/pc/infoDetails/331" },
      { label: "NETEASE MUSIC ↗", url: "https://music.163.com/#/album?id=146407778" },
      { label: "SOUNDCLOUD ↗", url: "https://soundcloud.com/shen-ao/sets/untitled-land" }
    ],
    images: [
      {
        src: "/assets/portfolio-projects/untitled-land-project.jpeg",
        alt: "Untitled Land project image from the portfolio."
      }
    ],
    detailMedia: [
      { label: "HERO / PROJECT IMAGE", variant: "landscape" },
      { label: "FILM STILL", variant: "landscape" },
      { label: "FILM STILL", variant: "landscape" },
      { label: "FILM STILL", variant: "landscape" },
      { label: "FILM STILL", variant: "landscape" },
      { label: "FILM STILL", variant: "landscape" }
    ],
    scoringOrder: 3,
    workSection: "scoring",
    workRoleLabel: "EXPERIMENTAL FILM / SCORE",
    verificationStatus: "confirmed",
    mediaStatus: "confirmed"
  },
  {
    slug: "paradise-dream-2",
    title: "Paradise Dream 2",
    year: "2019",
    category: "Exhibition",
    subtype: "Cross-media",
    externalLinks: [{ label: "WATCH ↗", url: "https://youtube.com/playlist?list=PLg8zSVDXI0lFa7DHc4Lq9zd5Vu5FBtMPZ" }],
    archiveOrder: 5,
    workSection: "archive",
    verificationStatus: "confirmed",
    mediaStatus: "placeholder"
  },
  {
    slug: "clouds-from-underground",
    title: "Clouds from Underground",
    year: "2021",
    category: "Moving Image",
    subtype: "Experimental Film",
    role: ["Score"],
    intro: "Clouds from Underground is an experimental short film by independent director Shao Ze, examining the history and present condition of Anshan as a resource-based industrial city.",
    creativeApproach: "The score combines piano, violin and synthesiser drones through a minimalist approach drawing on both electronic and classical music, creating the suffocating mechanical atmosphere present in the film.",
    externalLinks: [
      { label: "NETEASE MUSIC ↗", url: "https://music.163.com/#/album?id=131037851" }
    ],
    images: [
      {
        src: "/assets/portfolio-projects/clouds-from-underground-artwork.jpeg",
        alt: "Clouds from Underground artwork from the portfolio."
      }
    ],
    relatedWorks: [
      {
        title: "YISUO / 忆所",
        year: "2021",
        role: "PERFORMANCE VIDEO / SCORE",
        description: "A related performance-documentation score created with a Mother-32 synthesiser as a continuous seven-minute ambient work.",
        media: { label: "RELATED WORK MEDIA", variant: "landscape" }
      }
    ],
    detailMedia: [
      { label: "HERO / PROJECT ARTWORK", variant: "landscape" },
      { label: "FILM STILL", variant: "landscape" },
      { label: "FILM STILL", variant: "landscape" },
      { label: "FILM STILL", variant: "landscape" },
      { label: "FILM STILL", variant: "landscape" }
    ],
    scoringOrder: 4,
    workSection: "scoring",
    workRoleLabel: "EXPERIMENTAL FILM / SCORE",
    verificationStatus: "confirmed",
    mediaStatus: "confirmed"
  },
  {
    slug: "cctv-selected-broadcast-work",
    title: "Selected Broadcast Work / CCTV-13",
    year: "2021–2022",
    category: "Broadcast",
    subtype: "Broadcast",
    role: ["Music editing", "Production"],
    intro: "From 2021 to 2022, Shen Ao worked on music editing and production for CCTV-13 promotional content, contributing to more than 50 short-form television promotional projects.",
    selectedCases: [
      {
        title: "LONG TENG HU YUE ZHONG GUO NIAN / 龙腾虎跃中国年",
        url: "https://www.bilibili.com/video/BV1pS4y1y72L",
        description: "A Chinese New Year promotional animation combining the Winter Olympics with the Year of the Tiger. The score uses Chinese traditional instruments and percussion ensemble passages for heightened dramatic tension.",
        media: { label: "SELECTED WORK THUMBNAIL", variant: "landscape" }
      },
      {
        title: "IN THE FIELD OF HOPE / 在希望的田野上",
        url: "https://www.bilibili.com/video/BV1Jt4y1s7De",
        description: "A promotional short centred on summer grain cultivation, using orchestral writing to rework the Chinese song “In the Field of Hope”.",
        media: { label: "SELECTED WORK THUMBNAIL", variant: "landscape" }
      },
      {
        title: "RUI TU CHENG XIANG ZHONG GUO NIAN / 瑞兔呈祥中国年",
        url: "https://www.bilibili.com/video/BV11d4y1V7jD",
        media: { label: "SELECTED WORK THUMBNAIL", variant: "landscape" }
      }
    ],
    relatedTitles: ["大美边疆行", "中国空间站系列", "高端访谈"],
    images: [
      {
        src: "/assets/portfolio-projects/cctv-13-space-station.jpeg",
        alt: "CCTV-13 China Space Station promotional image from the portfolio."
      }
    ],
    detailMedia: [{ label: "REPRESENTATIVE HERO", variant: "landscape" }],
    scoringOrder: 5,
    workSection: "scoring",
    workRoleLabel: "BROADCAST / MUSIC EDITING + PRODUCTION",
    verificationStatus: "archive-only",
    mediaStatus: "confirmed"
  },
  {
    slug: "douyin-cultural-promo",
    title: "Douyin Cultural Product Promo",
    year: "2021",
    category: "Moving Image",
    subtype: "Promo",
    role: ["Score"],
    archiveOrder: 6,
    workSection: "archive",
    workRoleLabel: "PROMO / SCORE",
    verificationStatus: "archive-only",
    mediaStatus: "placeholder"
  },
  {
    slug: "zhang-jian-jingdezhen",
    title: "Zhang Jian and Jingdezhen",
    year: "2021",
    category: "Moving Image",
    subtype: "Documentary",
    role: ["Score"],
    images: [
      {
        src: "/assets/portfolio-projects/zhang-jian-jingdezhen-still.jpeg",
        alt: "Zhang Jian and Jingdezhen documentary still from the portfolio."
      }
    ],
    archiveOrder: 1,
    workSection: "archive",
    workRoleLabel: "DOCUMENTARY / SCORE",
    verificationStatus: "archive-only",
    mediaStatus: "confirmed"
  },
  { slug: "nostopia-playable-nft", title: "Nostopia Playable NFT", year: "2022", category: "Cross-media", subtype: "Game music", role: ["Score"], archiveOrder: 2, workSection: "archive", workRoleLabel: "GAME MUSIC", verificationStatus: "archive-only", mediaStatus: "placeholder" },
  {
    slug: "iqiyi-vr-se",
    title: "iQIYI VR SE Promo",
    year: "2020",
    category: "Moving Image",
    subtype: "Promo",
    role: ["Score"],
    images: [
      {
        src: "/assets/portfolio-projects/iqiyi-vr-se-promo.jpeg",
        alt: "iQIYI VR SE promo image from the portfolio."
      }
    ],
    archiveOrder: 3,
    workSection: "archive",
    workRoleLabel: "PROMO / SCORE",
    verificationStatus: "archive-only",
    mediaStatus: "confirmed"
  },
  { slug: "mr-monster-resource", title: "Mr.Monster Resource", category: "Cross-media", archiveOrder: 7, workSection: "archive", verificationStatus: "archive-only", mediaStatus: "placeholder" },
  {
    slug: "the-back-door-of-stage",
    title: "the back door of stage",
    year: "2019",
    category: "Cross-media",
    subtype: "Game music",
    role: ["Score"],
    externalLinks: [{ label: "INFO ↗", url: "https://www.gcores.com/articles/115352" }],
    images: [
      {
        src: "/assets/portfolio-projects/the-back-door-of-stage-title.jpeg",
        alt: "The Back Door of Stage title image from the portfolio."
      }
    ],
    archiveOrder: 4,
    workSection: "archive",
    workRoleLabel: "GAME MUSIC",
    verificationStatus: "archive-only",
    mediaStatus: "confirmed"
  },
  { slug: "tunnel", title: "Tunnel", category: "Cross-media", subtype: "Moving Image", archiveOrder: 8, workSection: "archive", verificationStatus: "needs-review", mediaStatus: "placeholder" }
];

export const selectedWorks = projects
  .filter((project) => project.workSection === "selected" && project.selectedOrder)
  .sort((a, b) => Number(a.selectedOrder) - Number(b.selectedOrder));

export const scoringMovingImageProjects = projects
  .filter((project) => project.scoringOrder)
  .sort((a, b) => Number(a.scoringOrder) - Number(b.scoringOrder));

export const archiveProjects = projects
  .filter((project) => project.workSection === "archive" && project.archiveOrder)
  .sort((a, b) => Number(a.archiveOrder) - Number(b.archiveOrder));

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);

const musicReleaseSort = (a: Project, b: Project) => Number(a.musicReleaseOrder) - Number(b.musicReleaseOrder);

export const featuredMusicReleases = projects
  .filter((project) => project.musicReleaseSection === "featured")
  .sort(musicReleaseSort);

export const otherMusicReleases = projects
  .filter((project) => project.musicReleaseSection === "other")
  .sort(musicReleaseSort);

export const kitRecordsReleaseNote = "In 2026, Shen Ao released two EPs through Kit Records, comprising ten tracks and accompanied by a limited double-sided cassette. The releases bring together Baroque references, the tension of progressive rock and his jazz-piano background, using postmodern compositional methods to form a distinctly game-like pop language.";

const quietusReview = pressItems.find((item) => item.id === "quietus-spools-out-july");

export const kitRecordsReleaseLinks: ProjectLink[] = [
  { label: "BANDCAMP", url: "https://shenao.bandcamp.com/" },
  { label: "NETEASE MUSIC", url: "https://music.163.com/#/artist?id=46923018" },
  ...(quietusReview ? [{ label: "THE QUIETUS", url: quietusReview.url }] : [])
];

export const musicPlatformLinks: ProjectLink[] = [
  { label: "BANDCAMP", url: "https://shenao.bandcamp.com/" },
  { label: "SOUNDCLOUD", url: "https://soundcloud.com/shen-ao/" },
  { label: "NETEASE MUSIC", url: "https://music.163.com/#/artist?id=46923018" }
];
