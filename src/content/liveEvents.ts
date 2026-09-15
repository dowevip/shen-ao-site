export type LiveMediaStatus = "confirmed" | "placeholder";
export type LiveEventType = "Live performance" | "DJ" | "Solo concert";

export type LiveMedia = {
  path?: string;
  alt?: string;
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

export type LiveImage = {
  id: string;
  path: string;
  alt: string;
};

export type PianoKeyboardGroup = {
  id: string;
  title: string;
  images: LiveImage[];
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
    externalLinks: [{ label: "INFO ↗", url: "https://www.threads.com/%40kitrecs/post/DbxwVOGDahQ/the-kitrecs-radio-show-is-back-on-loose-fm-this-evening-at-pm-uk-summer-time/" }],
    poster: { path: "/assets/live/portfolio/loose-fm-2026.jpeg", alt: "Loose.fm poster for Shen Ao and Avin Noorbakhsh.", status: "confirmed" },
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
    externalLinks: [{ label: "INFO ↗", url: "https://gel.now/events/566" }],
    poster: { path: "/assets/live/portfolio/spanners-2026.jpeg", alt: "Spanners event poster for Shen Ao with Vic Bang, Yoto and K Means.", status: "confirmed" },
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
    externalLinks: [{ label: "INFO ↗", url: "https://www.instagram.com/p/DacdwQTlH1O/?img_index=2" }],
    poster: { path: "/assets/live/portfolio/yuanliao-space-2026.jpeg", alt: "Yuanliao Space poster for Shen Ao with 4ChannelClub and Cloud Choir.", status: "confirmed" },
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
    externalLinks: [{ label: "INFO ↗", url: "https://ma.to/event/kit-records-album-launch-17-jun-2026" }],
    livePhoto: { path: "/assets/live/portfolio/george-tavern-2026.jpeg", alt: "Shen Ao performing live at The George Tavern, London.", status: "confirmed" },
    selected: true
  }
];

export const livePlatformLinks: LiveEventLink[] = [
  { label: "PROFILE / RESIDENT ADVISOR", url: "https://ra.co/dj/teendrum" },
  { label: "LISTEN / MIXCLOUD", url: "https://www.mixcloud.com/teendrum/" }
];

const pianoArchiveImage = (id: string, filename: string, alt: string): LiveImage => ({
  id,
  path: `/assets/live/piano-keyboard/${filename}`,
  alt
});

export const pianoKeyboardGroups: PianoKeyboardGroup[] = [
  {
    id: "contemporary-classical-cross-media-experimental",
    title: "CONTEMPORARY CLASSICAL / CROSS-MEDIA / EXPERIMENTAL",
    images: [
      pianoArchiveImage("contemporary-classical-01", "contemporary-classical-01.jpeg", "External Series poster for an experimental contemporary music concert."),
      pianoArchiveImage("puregolds-ao-evan-nicolls", "puregolds-ao-evan-nicolls.jpeg", "PureGold poster for Ao Shen and Ensemble Not Found."),
      pianoArchiveImage("contemporary-classical-03", "contemporary-classical-03.jpeg", "PureGold poster for an evening of music by Terry Riley."),
      pianoArchiveImage("contemporary-classical-04", "contemporary-classical-04.jpeg", "PureGold masterclass poster with a rehearsal-room photo."),
      pianoArchiveImage("daylight-music-2024-poster", "daylight-music-2024-poster.jpeg", "Daylight Music poster featuring a black-and-white ensemble photo.")
    ]
  },
  {
    id: "improvisation-rock-electronic",
    title: "IMPROVISATION / ROCK / ELECTRONIC",
    images: [
      pianoArchiveImage("improvisation-rock-electronic-01", "improvisation-rock-electronic-01.jpeg", "Summer Bay poster listing Shen Ao, Vic Bang, Yoto and K Means."),
      pianoArchiveImage("improvisation-rock-electronic-02", "improvisation-rock-electronic-02.jpeg", "Visit Me show poster from The George Tavern with Shen Ao on the bill."),
      pianoArchiveImage("improvisation-rock-electronic-03", "improvisation-rock-electronic-03.jpeg", "Yuanliao Space poster listing Shen Ao, 4ChannelClub and Cloud Choir."),
      pianoArchiveImage("improvisation-rock-electronic-04", "improvisation-rock-electronic-04.jpeg", "Cavern Bar event poster with red lettering over an arched interior."),
      pianoArchiveImage("improvisation-rock-electronic-05", "improvisation-rock-electronic-05.jpeg", "Colourful Tachyon poster for a London electronic music event.")
    ]
  },
  {
    id: "band-jazz-soul",
    title: "BAND / JAZZ / SOUL",
    images: [
      pianoArchiveImage("band-jazz-soul-01", "band-jazz-soul-01.jpeg", "Honeydew poster with portraits of the band members."),
      pianoArchiveImage("band-jazz-soul-02", "band-jazz-soul-02.jpeg", "Heydey NeoSoul Band poster with a vinyl-record design."),
      pianoArchiveImage("band-jazz-soul-03", "band-jazz-soul-03.jpeg", "BRICKS duet poster for Lilith Liu and Liu Xiaoxuan."),
      pianoArchiveImage("honeydew-live-poster-red", "honeydew-live-poster-red.jpeg", "Red Honeydew live music poster with portraits of the performers."),
      pianoArchiveImage("honeydew-live-poster-blue", "honeydew-live-poster-blue.jpeg", "Black Honeydew live music poster with portraits of the performers.")
    ]
  }
];

export const teendrumImages: LiveImage[] = [
  {
    id: "teendrum-baihui-live",
    path: "/assets/live/teendrum/teendrum-baihui-live.jpeg",
    alt: "Baihui.live poster for a London event with DJ Teendrum."
  },
  {
    id: "teendrum-eerawai-ambient-series",
    path: "/assets/live/teendrum/teendrum-eerawai-ambient-series.jpeg",
    alt: "Eerawai Ambient Series poster with Teendrum on Baihui.live."
  },
  {
    id: "teendrum-mclab-poster",
    path: "/assets/live/teendrum/teendrum-mclab-poster.jpeg",
    alt: "MCLAB poster for Teendrum with Amezeng, Dub and Kai F."
  }
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
    livePhoto: { path: "/assets/live/portfolio/solo-concert-2018.jpeg", alt: "Shen Ao performing during the 2018 Solo Concert.", status: "confirmed" },
    selected: false
  }
];
