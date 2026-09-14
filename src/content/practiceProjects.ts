import { latestNoIdeaEvent } from "./noIdeaEvents";

export type PracticeProjectLink = {
  label: string;
  url: string;
};

export type PosterArchiveSlot = {
  id: string;
  title: string;
  label: string;
  status: "confirmed" | "placeholder";
  eventSlug?: string;
  image?: string;
};

export type RadioArchiveSlot = {
  id: string;
  title: string;
  label: string;
  status: "confirmed";
  city: "London" | "Beijing";
  date: string;
  tags: string[];
  image: string;
  url: string;
};

export type DocumentationGroup = {
  city: "BEIJING" | "LONDON";
  images: string[];
};

export type EventPosterGroup = {
  city: "BEIJING" | "LONDON";
  posters: Array<{
    image: string;
    venue: string;
  }>;
};

export type PracticeProject = {
  slug: "no-idea" | "openband-openscore";
  title: string;
  year: string;
  heading: string;
  location?: string;
  summary: string;
  detail?: string;
  previewImage?: string;
  links: PracticeProjectLink[];
  instagramHandle?: string;
  posterArchive?: PosterArchiveSlot[];
  radioArchive?: RadioArchiveSlot[];
  eventPosterGroups?: EventPosterGroup[];
  documentationGroups?: DocumentationGroup[];
  credits?: {
    hosts: string[];
    venues: string[];
  };
};

export const noIdeaProject: PracticeProject = {
  slug: "no-idea",
  title: "NO IDEA",
  year: "2024 —",
  heading: "RADIO / LIVE EVENTS",
  summary: "A radio programme and live event series run by Shen Ao, focused on ambient and experimental music. Three live events have been presented in London to date.",
  detail: "The online radio programme is hosted on Baihui and focuses on ambient and experimental music.",
  location: "London",
  previewImage: "/assets/no-idea/ppt-source/live-with-no-idea-shai-space-poster.jpeg",
  links: [
    { label: "BAIHUI RADIO ↗", url: latestNoIdeaEvent.externalLinks.noIdeaRadio },
    { label: "RESIDENT ADVISOR ↗", url: latestNoIdeaEvent.externalLinks.residentAdvisorPromoter }
  ],
  instagramHandle: "@noidearadio",
  posterArchive: [
    {
      id: "live-with-no-idea-2026-05-23",
      title: "LIVE WITH NO IDEA",
      label: "23 MAY 2026 / SHAI SPACE",
      status: "confirmed",
      eventSlug: latestNoIdeaEvent.slug,
      image: "/assets/no-idea/ppt-source/live-with-no-idea-shai-space-poster.jpeg"
    },
    {
      id: "live-with-no-idea-2026-04-09",
      title: "LIVE WITH NO IDEA",
      label: "09 APR 2026 / ETSDTS_",
      status: "confirmed",
      image: "/assets/no-idea/ppt-source/live-with-no-idea-etsdts-poster.jpeg"
    },
    {
      id: "live-with-no-idea-2026-08-29",
      title: "LIVE WITH NO IDEA",
      label: "29 AUG 2026 / HELM",
      status: "confirmed",
      image: "/assets/no-idea/ppt-source/live-with-no-idea-helm-poster.jpeg"
    }
  ],
  radioArchive: [
    {
      id: "no-idea-radio-pentu",
      title: "no idea radio w/ PENTU",
      label: "episode",
      status: "confirmed",
      city: "London",
      date: "26.05.18",
      tags: ["Field Recording", "Classical", "Experimental", "Ambient"],
      image: "/assets/no-idea/radio/no-idea-radio-pentu.jpg",
      url: "https://baihui.live/shows/no-idea-w-al-pentu-26-05-18/en/"
    },
    {
      id: "no-idea-radio-ep-09-transcribe",
      title: "no idea radio ep.09 - transcribe 转译 w/ AL",
      label: "episode",
      status: "confirmed",
      city: "Beijing",
      date: "26.04.06",
      tags: ["Ambient"],
      image: "/assets/no-idea/radio/no-idea-radio-ep-09-transcribe.jpg",
      url: "https://baihui.live/shows/no-idea-w-al-schaffer-26-04-06/en/"
    },
    {
      id: "no-idea-radio-ep-08-tracing",
      title: "no idea radio ep.08 tracing 勾勒 w/ AL",
      label: "episode",
      status: "confirmed",
      city: "Beijing",
      date: "26.01.12",
      tags: ["Ambient"],
      image: "/assets/no-idea/radio/no-idea-radio-ep-08-tracing.jpg",
      url: "https://baihui.live/shows/no-idea-w-al-schaffer-26-01-12/en/"
    },
    {
      id: "no-idea-radio-ep-07",
      title: "no idea radio ep.07 companions 陪伴 w/ AL",
      label: "episode",
      status: "confirmed",
      city: "London",
      date: "25.10.13",
      tags: ["Ambient"],
      image: "/assets/no-idea/radio/no-idea-radio-ep-07.jpg",
      url: "https://baihui.live/shows/no-idea-w-al-schaffer-25-10-13/en/"
    },
    {
      id: "no-idea-radio-ep-06-tele",
      title: "no idea radio ep.06 tele miscommunications 远程",
      label: "episode",
      status: "confirmed",
      city: "London",
      date: "25.08.09",
      tags: ["Ambient"],
      image: "/assets/no-idea/radio/no-idea-radio-ep-06-tele.jpg",
      url: "https://baihui.live/shows/no-idea-w-al-schaffer-25-08-09/en/"
    },
    {
      id: "no-idea-radio-ep-05-spineless",
      title: "no idea radio ep.05 spineless 无脊椎 w/ AL",
      label: "episode",
      status: "confirmed",
      city: "London",
      date: "25.06.23",
      tags: ["Ambient"],
      image: "/assets/no-idea/radio/no-idea-radio-ep-05-spineless.jpg",
      url: "https://baihui.live/shows/no-idea-w-al-schaffer-25-06-23/en/"
    },
    {
      id: "no-idea-radio-ep-04-consciousness",
      title: "no idea ep.04 consciousness w/ AL",
      label: "episode",
      status: "confirmed",
      city: "London",
      date: "25.04.11",
      tags: ["Ambient"],
      image: "/assets/no-idea/radio/no-idea-radio-ep-04-consciousness.jpg",
      url: "https://baihui.live/shows/no-idea-w-al-schaffer-25-04-11/en/"
    },
    {
      id: "no-idea-radio-ep-03-belief",
      title: "no idea ep.03 belief 信念感 w/ AL SCHAFFER",
      label: "episode",
      status: "confirmed",
      city: "London",
      date: "25.01.25",
      tags: ["Ambient"],
      image: "/assets/no-idea/radio/no-idea-radio-ep-03-belief.jpg",
      url: "https://baihui.live/shows/no-idea-w-al-schaffer-25-01-25/en/"
    },
    {
      id: "no-idea-radio-ep-02-vulnerability",
      title: "no idea ep.02 vulnerability 脆弱 w/ AL",
      label: "episode",
      status: "confirmed",
      city: "London",
      date: "24.09.17",
      tags: ["Ambient"],
      image: "/assets/no-idea/radio/no-idea-radio-ep-02-vulnerability.jpg",
      url: "https://baihui.live/shows/no-idea-w-al-schaffer-24-09-17/en/"
    },
    {
      id: "no-idea-radio-ep-01-abandon",
      title: "no idea ep.01 abandon 遗弃 w/ AL SCHAFFER",
      label: "episode",
      status: "confirmed",
      city: "London",
      date: "24.07.04",
      tags: ["Ambient"],
      image: "/assets/no-idea/radio/no-idea-radio-ep-01-abandon.jpg",
      url: "https://baihui.live/shows/no-idea-w-al-schaffer-24-07-04/en/"
    }
  ]
};

export const openbandProject: PracticeProject = {
  slug: "openband-openscore",
  title: "OPENBAND",
  year: "2024 —",
  heading: "IMPROVISATION WORKSHOPS",
  location: "BEIJING / LONDON",
  summary: "A Shen Ao-led improvisation workshop series developed at fRUITYSPACE in Beijing. The project creates an open setting for collective improvisation and collaborative music-making.",
  previewImage: "/assets/practice/openband/openband-monthly-posters.jpeg",
  links: [
    { label: "ACTIVITY ARCHIVE ↗", url: "https://alschaffer.blogspot.com/search/label/OPEN%20BAND" },
    { label: "LISTEN TO RECORDINGS ↗", url: "https://www.mixcloud.com/al_schaffer/playlists/open-band/" }
  ],
  eventPosterGroups: [
    {
      city: "BEIJING",
      posters: [
        { image: "/assets/openband/event-posters/beijing/openband-fruityspace-posters.jpg", venue: "fRUITYSPACE / 水果空间" },
        { image: "/assets/openband/event-posters/beijing/openband-small-group-workshop.jpg", venue: "Small Group Workshop / 小组工作坊" },
        { image: "/assets/openband/event-posters/beijing/openband-ren-zhi-yuan-liao-workspace.jpg", venue: "Ren Zhi Yuan Liao Workspace / 人之原料工作空间" }
      ]
    },
    {
      city: "LONDON",
      posters: [
        { image: "/assets/openband/event-posters/london/openband-city-university-workshop.jpg", venue: "City St George’s, University of London" },
        { image: "/assets/openband/event-posters/london/openband-hypha-hq-workshop.jpg", venue: "Hypha HQ" }
      ]
    }
  ],
  documentationGroups: [
    {
      city: "BEIJING",
      images: [
        "/assets/openband/documentation/beijing/openband-beijing-01.jpg",
        "/assets/openband/documentation/beijing/openband-beijing-02.jpg",
        "/assets/openband/documentation/beijing/openband-beijing-03.jpg",
        "/assets/openband/documentation/beijing/openband-beijing-04.jpg",
        "/assets/openband/documentation/beijing/openband-beijing-05.jpg"
      ]
    },
    {
      city: "LONDON",
      images: [
        "/assets/openband/documentation/london/openband-london-01.jpg",
        "/assets/openband/documentation/london/openband-london-02.jpg",
        "/assets/openband/documentation/london/openband-london-03.jpg",
        "/assets/openband/documentation/london/openband-london-04.jpg"
      ]
    }
  ],
  credits: {
    hosts: ["Chu Xia / 初夏", "Tong Ge / 桐歌", "Jiang Yan / 姜闫", "Shen Ao / 申奡"],
    venues: [
      "fRUITYSPACE / 水果空间",
      "Small Group Workshop / 小组工作坊",
      "Ren Zhi Yuan Liao Workspace / 人之原料工作空间",
      "City St George’s, University of London",
      "Hypha HQ / London"
    ]
  }
};

export const practiceProjects = [noIdeaProject, openbandProject];
