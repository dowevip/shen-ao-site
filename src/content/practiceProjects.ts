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
  status: "placeholder";
};

export type WorkshopEntry = {
  venue: string;
  label: string;
  mediaStatus: "placeholder";
};

export type PracticeProject = {
  slug: "no-idea" | "openband-openscore";
  title: string;
  year: string;
  heading: string;
  location?: string;
  summary: string;
  detail?: string;
  links: PracticeProjectLink[];
  instagramHandle?: string;
  posterArchive?: PosterArchiveSlot[];
  radioArchive?: RadioArchiveSlot[];
  workshopEntries?: WorkshopEntry[];
};

export const noIdeaProject: PracticeProject = {
  slug: "no-idea",
  title: "NO IDEA",
  year: "2024 —",
  heading: "RADIO / LIVE EVENTS",
  summary: "A radio programme and live event series run by Shen Ao, focused on ambient and experimental music. Three live events have been presented in London to date.",
  detail: "The project extends from online radio into live programming, budgeting, technical production and event coordination around listening-oriented spaces.",
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
      image: latestNoIdeaEvent.posterImage
    },
    {
      id: "london-event-archive-1",
      title: "LONDON EVENT ARCHIVE",
      label: "MEDIA / DETAILS PENDING",
      status: "placeholder"
    },
    {
      id: "london-event-archive-2",
      title: "LONDON EVENT ARCHIVE",
      label: "MEDIA / DETAILS PENDING",
      status: "placeholder"
    }
  ],
  radioArchive: [
    { id: "baihui-episode-1", title: "NO IDEA", label: "RADIO EPISODE ARTWORK", status: "placeholder" },
    { id: "baihui-episode-2", title: "NO IDEA", label: "RADIO EPISODE ARTWORK", status: "placeholder" },
    { id: "baihui-episode-3", title: "NO IDEA", label: "RADIO EPISODE ARTWORK", status: "placeholder" },
    { id: "baihui-episode-4", title: "NO IDEA", label: "RADIO EPISODE ARTWORK", status: "placeholder" }
  ]
};

export const openbandProject: PracticeProject = {
  slug: "openband-openscore",
  title: "OPENBAND",
  year: "2024 —",
  heading: "IMPROVISATION WORKSHOPS",
  location: "BEIJING / LONDON",
  summary: "A Shen Ao-led improvisation workshop series developed at fRUITYSPACE in Beijing. The project creates an open setting for collective improvisation and collaborative music-making.",
  links: [
    { label: "WORKSHOP ARCHIVE ↗", url: "https://alschaffer.blogspot.com/search/label/OPEN%20BAND" },
    { label: "LISTEN TO RECORDINGS ↗", url: "https://www.mixcloud.com/al_schaffer/playlists/open-band/" }
  ],
  posterArchive: [
    { id: "openband-monthly-poster-1", title: "OPENBAND", label: "WORKSHOP POSTER", status: "placeholder" },
    { id: "openband-monthly-poster-2", title: "OPENBAND", label: "WORKSHOP POSTER", status: "placeholder" },
    { id: "openband-monthly-poster-3", title: "OPENBAND", label: "WORKSHOP POSTER", status: "placeholder" }
  ],
  workshopEntries: [
    { venue: "CITY, UNIVERSITY OF LONDON", label: "WORKSHOP", mediaStatus: "placeholder" },
    { venue: "HYPHA HQ / LONDON", label: "WORKSHOP / OPENSCORE", mediaStatus: "placeholder" }
  ]
};

export const practiceProjects = [noIdeaProject, openbandProject];
