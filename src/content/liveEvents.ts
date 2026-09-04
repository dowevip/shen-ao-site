export type LiveMediaStatus = "confirmed" | "placeholder";
export type LiveEventType = "Live performance" | "DJ" | "Solo concert";

export type LiveMedia = {
  path?: string;
  status: LiveMediaStatus;
};

export type LiveEventLink = {
  label: string;
  url: string;
};

export type LiveEvent = {
  id: string;
  date?: string;
  displayDate?: string;
  year?: string;
  title?: string;
  venue: string;
  localVenueName?: string;
  city?: string;
  billing?: string;
  collaborators?: string[];
  type: LiveEventType;
  externalLinks?: LiveEventLink[];
  livePhoto?: LiveMedia;
  poster?: LiveMedia;
  selected: boolean;
};

export type DjPosterArchiveItem = {
  id: string;
  title: string;
  status: LiveMediaStatus;
  path?: string;
};

export const selectedLiveEvents: LiveEvent[] = [
  {
    id: "loose-fm-2026-08-08",
    date: "2026-08-08",
    displayDate: "08 AUG 2026",
    venue: "Loose.fm",
    city: "London",
    billing: "Duo with Avin Noorbakhsh",
    collaborators: ["Avin Noorbakhsh"],
    type: "Live performance",
    livePhoto: { status: "placeholder" },
    poster: { status: "placeholder" },
    selected: true
  },
  {
    id: "spanners-2026-07-23",
    date: "2026-07-23",
    displayDate: "23 JUL 2026",
    venue: "Spanners",
    city: "London",
    billing: "With Vic Bang / Yoto / K Means",
    collaborators: ["Vic Bang", "Yoto", "K Means"],
    type: "Live performance",
    livePhoto: { status: "placeholder" },
    poster: { status: "placeholder" },
    selected: true
  },
  {
    id: "yuanliao-space-2026-07-17",
    date: "2026-07-17",
    displayDate: "17 JUL 2026",
    venue: "Yuanliao Space",
    localVenueName: "原料空间",
    city: "Beijing",
    billing: "With 4ChannelClub / Cloud Choir",
    collaborators: ["4ChannelClub", "Cloud Choir"],
    type: "Live performance",
    livePhoto: { status: "placeholder" },
    poster: { status: "placeholder" },
    selected: true
  },
  {
    id: "george-tavern-2026-06-17",
    date: "2026-06-17",
    displayDate: "17 JUN 2026",
    venue: "The George Tavern",
    city: "London",
    billing: "With Visit Me / Barreleye / Guthlac",
    collaborators: ["Visit Me", "Barreleye", "Guthlac"],
    type: "Live performance",
    livePhoto: { status: "placeholder" },
    poster: { status: "placeholder" },
    selected: true
  }
];

export const livePlatformLinks: LiveEventLink[] = [
  { label: "MIXCLOUD", url: "https://www.mixcloud.com/teendrum/" },
  { label: "RESIDENT ADVISOR", url: "https://ra.co/dj/teendrum" }
];

export const djPosterArchive: DjPosterArchiveItem[] = [
  { id: "teendrum-poster-1", title: "Teendrum", status: "placeholder" },
  { id: "teendrum-poster-2", title: "DJ poster", status: "placeholder" },
  { id: "teendrum-poster-3", title: "Archive poster", status: "placeholder" }
];

export const earlierPerformances: LiveEvent[] = [
  {
    id: "solo-concert-2018",
    year: "2018",
    title: "Solo Concert",
    venue: "Tianjin Concert Hall / Ruxi Art Gallery",
    localVenueName: "天津音乐厅 · 儒熙艺术馆",
    type: "Solo concert",
    externalLinks: [{ label: "Watch", url: "https://www.youtube.com/watch?v=T8jVsSjHzhA" }],
    livePhoto: { status: "placeholder" },
    selected: false
  }
];
