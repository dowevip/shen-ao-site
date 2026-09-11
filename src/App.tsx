import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  archiveFilters,
  archiveProjects,
  featuredMusicReleases,
  getProject,
  moreCommissionedProjects,
  musicPlatformLinks,
  musicScoringProjects,
  otherMusicReleases,
  projects,
  type ProjectLink,
  scoringMovingImageProjects,
  selectedWorks,
  kitRecordsReleaseNote,
  type Project
} from "./content/projects";
import { getNoIdeaEvent, latestNoIdeaEvent, noIdeaEvents, type NoIdeaEvent } from "./content/noIdeaEvents";
import { earlierPerformances, livePlatformLinks, selectedLiveEvents, type DjPosterArchiveItem, type LiveEvent, type LiveEventLink, type LiveMedia } from "./content/liveEvents";
import { noIdeaProject, openbandProject, practiceProjects, type PracticeProject, type PosterArchiveSlot, type RadioArchiveSlot, type WorkshopEntry } from "./content/practiceProjects";
import { aboutPressItems, epkPressItems, homePressItems, verifiedPressItems, type PressItem } from "./content/press";
import "./styles.css";

const navItems = ["HOME", "MUSIC", "LIVE", "ABOUT"];

type AppProps = {
  initialPath?: string;
};

const basePath = import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");
const fallbackBasePaths = ["/shen-ao-site-plan-b", "/shen-ao-site"];
const toAppPath = (path: string) => {
  const fallbackBasePath = fallbackBasePaths.find((candidate) => path.startsWith(candidate));
  const normalized = basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : fallbackBasePath
      ? path.slice(fallbackBasePath.length) || "/"
      : path;
  const appPath = normalized.startsWith("/") ? normalized : `/${normalized}`;
  return appPath === "/" ? appPath : appPath.replace(/\/+$/, "");
};
const toBrowserPath = (path: string) => `${basePath}${path === "/" ? "/" : path}`;
const assetUrl = (path: string) => `${basePath}/${path.replace(/^\//, "")}`;

function usePath(initialPath?: string) {
  const [path, setPath] = useState(toAppPath(initialPath ?? window.location.pathname));

  useEffect(() => {
    if (initialPath) {
      return undefined;
    }

    const handlePopState = () => setPath(toAppPath(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [initialPath]);

  const navigate = (nextPath: string) => {
    if (!initialPath) {
      window.history.pushState({}, "", toBrowserPath(nextPath));
    }
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return { path, navigate };
}

export default function App({ initialPath }: AppProps) {
  const { path, navigate } = usePath(initialPath);

  const page = isKitRecordsReleaseRoute(path) ? (
    <MusicReleasePage navigate={navigate} />
  ) : path.startsWith("/work/role-model") ? (
    <RoleModelPage navigate={navigate} />
  ) : path.startsWith("/work/fancy-a-bite") ? (
    <FancyABitePage navigate={navigate} />
  ) : path.startsWith("/work/no-idea") ? (
    <NoIdeaPage navigate={navigate} />
  ) : path.startsWith("/work/openband-openscore") ? (
    <OpenbandPage navigate={navigate} />
  ) : path.startsWith("/practice/no-idea/") ? (
    <NoIdeaEventPage slug={path.replace(/^\/practice\/no-idea\//, "").split("/")[0]} navigate={navigate} />
  ) : path.startsWith("/work/") ? (
    <ProjectDetailPage slug={path.replace(/^\/work\//, "").split("/")[0]} navigate={navigate} />
  ) : path.startsWith("/work") ? (
    <WorkPage navigate={navigate} />
  ) : path.startsWith("/music") ? (
    <MusicPage navigate={navigate} />
  ) : path.startsWith("/live") ? (
    <LivePage />
  ) : path.startsWith("/practice") ? (
    <PracticePage navigate={navigate} />
  ) : path.startsWith("/press-radio") ? (
    <PressRadioPage />
  ) : path.startsWith("/about") ? (
    <AboutPage />
  ) : path.startsWith("/epk") ? (
    <EpkPage navigate={navigate} />
  ) : (
    <HomePage navigate={navigate} />
  );

  return (
    <div className="site-shell">
      <Header active={activeNav(path)} navigate={navigate} />
      {page}
      <Footer />
    </div>
  );
}

const navPath: Record<string, string> = {
  HOME: "/",
  MUSIC: "/music",
  LIVE: "/live",
  ABOUT: "/about"
};

function activeNav(path: string) {
  if (path === "/") {
    return "HOME";
  }
  const match = navItems.filter((item) => item !== "HOME").find((item) => path.startsWith(navPath[item]));
  return match ?? "";
}

function Header({ active, navigate }: { active: string; navigate: (path: string) => void }) {
  return (
    <header className="site-header">
      <button className="brand-link" onClick={() => navigate("/")}>SHEN AO</button>
      <nav aria-label="Primary navigation">
        {navItems.map((item) => (
          <button key={item} className={active === item ? "active" : ""} onClick={() => navigate(navPath[item])}>
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
}

function HomePage({ navigate }: { navigate: (path: string) => void }) {
  const featuredReleases = [getProject("cyberspace")!, getProject("bug-party")!];
  const releasePress = homePressItems.filter((item) => item.id === "quietus-spools-out-july" || item.id === "muito-buy-music-club-27");
  const relatedLive = [...selectedLiveEvents].sort((a, b) => String(a.date).localeCompare(String(b.date)));

  return (
    <main className="home-page">
      <section className="feature feature-music plan-b-music flow-section" data-testid="home-featured-music">
        <div className="featured-releases">
          {featuredReleases.map((release, index) => (
            <article className={`featured-release featured-release-${index + 1} plan-b-release plan-b-release-${release.slug}`} key={release.slug}>
              <div className="plan-b-release-art">
                <img src={assetUrl(release.artwork!)} alt={`${release.title} album artwork`} />
              </div>
              <div className="plan-b-release-copy">
                <h2>{release.title.toUpperCase()}</h2>
                <MetaLines lines={["2026", release.label?.toUpperCase()]} />
                <ExternalLink className="listen-link" href={homeListenLink(release)}>LISTEN</ExternalLink>
                <button className="text-arrow" onClick={() => navigate(releaseDetailPath(release))}>INFO</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-related-live-section flow-section" data-testid="home-related-live">
        <h2>RELATED LIVE</h2>
        <div className="home-live-list">
          {relatedLive.map((event) => (
            <ExternalLink className="home-live-row" href={event.externalLinks![0].url} key={event.id}>
              {getLiveArchiveMedia(event) && <img src={assetUrl(getLiveArchiveMedia(event)!.path)} alt={getLiveArchiveMedia(event)!.alt} />}
              <span>{event.displayDate}</span>
              <strong>{formatVenue(event)}</strong>
              <em>{event.externalLinks![0].label}</em>
            </ExternalLink>
          ))}
        </div>
      </section>

      <section className="press-radio-preview home-press-section" data-testid="home-press">
        <h2>PRESS</h2>
        <div className="home-press-index">
          {releasePress.map((item) => <HomePressLine item={item} key={item.id} />)}
        </div>
      </section>
    </main>
  );
}

function homeListenLink(project: Project) {
  return project.externalLinks?.find((link) => /bandcamp/i.test(`${link.label} ${link.url}`))?.url
    ?? project.externalLinks?.find((link) => isListenLink(link))?.url
    ?? "https://shenao.bandcamp.com/";
}

function isKitRecordsReleaseRoute(path: string) {
  return ["/work/cyberspace-bug-party", "/work/cyberspace", "/work/bug-party"].some((route) => path.startsWith(route));
}

function releaseDetailPath(project: Project) {
  return project.slug === "cyberspace" || project.slug === "bug-party" ? "/work/cyberspace-bug-party" : `/work/${project.slug}`;
}

function WorkPage({ navigate }: { navigate: (path: string) => void }) {
  const [filter, setFilter] = useState<(typeof archiveFilters)[number]>("ALL");
  const rows = useMemo(
    () => archiveProjects.filter((project) => project.visibleInArchive !== false && (filter === "ALL" || toFilter(project) === filter)),
    [filter]
  );

  return (
    <main className="work-page">
      <PageAccentMarks variant="work" />
      <section className="work-intro">
        <div className="section-kicker">WORK / INDEX</div>
        <h1>WORK</h1>
        <p>Selected works and professional projects across releases, moving image, theatre, broadcast and practice.</p>
      </section>
      <section className="work-selected-section">
        <div className="section-kicker">PRIMARY PROJECTS</div>
        <h2>SELECTED WORK</h2>
        <div className="selected-grid editorial-works" data-testid="selected-works">
          {selectedWorks.map((project, index) => (
            <article className={`selected-work selected-work-${index + 1} selected-work-${project.slug} ${selectedLayout(project.slug)}`} data-testid={`selected-work-${project.slug}`} key={project.slug}>
              <MediaVisual project={project} />
              <div>
                <h3>{project.title}</h3>
                <MetaLines lines={[project.year, project.workRoleLabel, project.label, project.category, project.subtype]} />
                <button className="text-arrow" onClick={() => navigate(`/work/${project.slug}`)}>VIEW PROJECT</button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="scoring-section">
        <div className="section-kicker">SCREEN / STAGE / BROADCAST</div>
        <h2>SCORING / MOVING IMAGE</h2>
        <div className="scoring-grid scoring-editorial-grid" data-testid="scoring-moving-image">
          {scoringMovingImageProjects.map((project) => (
            <article className="scoring-work" data-testid={`scoring-work-${project.slug}`} key={project.slug}>
              <MediaVisual project={project} />
              <div>
                <h3>{project.title}</h3>
                <MetaLines lines={[project.year, project.workRoleLabel]} />
                <button className="text-arrow" onClick={() => navigate(`/work/${project.slug}`)}>VIEW PROJECT</button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <ArchiveTable filter={filter} setFilter={setFilter} rows={rows} />
    </main>
  );
}

function MusicPage({ navigate }: { navigate: (path: string) => void }) {
  const moreCommissionedImageProjects = moreCommissionedProjects.filter(hasProjectMedia);
  const moreCommissionedTextProjects = moreCommissionedProjects.filter((project) => !hasProjectMedia(project));

  return (
    <main className="route-page music-page">
      <PageIntro title="MUSIC" />
      <section className="music-release-section music-featured-section" data-testid="music-featured-releases">
        <h2>FEATURED</h2>
        <div className="music-featured-grid">
          {featuredMusicReleases.map((project) => <MusicIndexItem project={project} navigate={navigate} variant="featured" key={project.slug} />)}
        </div>
      </section>
      <section className="music-release-section music-secondary-section" data-testid="music-secondary-releases">
        <h2>RELEASES</h2>
        <div className="music-secondary-grid">
          {otherMusicReleases.map((project) => <MusicIndexItem project={project} navigate={navigate} variant="secondary" key={project.slug} />)}
        </div>
      </section>
      <section className="music-release-section other-release-section" data-testid="music-scoring-commissioned">
        <h2>SCORING / COMMISSIONED MUSIC</h2>
        <div className="production-scoring-grid">
          {musicScoringProjects.map((project) => <MusicIndexItem project={project} navigate={navigate} variant="archive" key={project.slug} />)}
        </div>
      </section>
      <section className="music-release-section music-more-commissioned-section" data-testid="music-more-commissioned">
        <h2>ADDITIONAL COMMISSIONED WORK</h2>
        <div className="more-commissioned-grid" data-testid="music-more-commissioned-images">
          {moreCommissionedImageProjects.map((project) => <MusicIndexItem project={project} navigate={navigate} variant="commissioned-archive-image" key={project.slug} />)}
        </div>
        <div className="more-commissioned-text-list" data-testid="music-more-commissioned-text">
          {moreCommissionedTextProjects.map((project) => <MusicIndexItem project={project} navigate={navigate} variant="commissioned-archive-text" key={project.slug} />)}
        </div>
      </section>
    </main>
  );
}

function MusicIndexItem({ project, navigate, variant }: { project: Project; navigate: (path: string) => void; variant: "featured" | "secondary" | "archive" | "commissioned-archive-image" | "commissioned-archive-text" }) {
  const title = (project.displayTitle ?? project.title).toUpperCase();
  const watchLink = project.externalLinks?.find((link) => isWatchLink(link));
  const listenLink = project.externalLinks?.find((link) => !isWatchLink(link) && isListenLink(link));
  const projectLink = project.externalLinks?.find((link) => isProjectLink(link));
  const isArchiveOnly = variant === "commissioned-archive-image" || variant === "commissioned-archive-text";
  const showArtwork = variant !== "commissioned-archive-text";
  const usesInternalInfo = variant === "archive";
  const infoLink = usesInternalInfo
    ? undefined
    : project.externalLinks?.find((link) => !isWatchLink(link) && !isListenLink(link) && !isProjectLink(link) && !isNetEaseLink(link));
  const hasMedia = hasProjectMedia(project) || !["archive", "commissioned-archive-image", "commissioned-archive-text"].includes(variant);
  return (
    <article className={`music-index-item music-index-item-${variant} music-release-${project.slug} ${hasMedia ? "has-media" : "no-media"}`} data-testid={`music-index-item-${project.slug}`}>
      {showArtwork && <ReleaseArtwork project={project} showPlaceholder={false} />}
      <div className="music-release-copy">
        <h3>{title}</h3>
        <MetaLines lines={[project.year, project.subtype, project.workRoleLabel, project.role?.join(" / "), project.label]} />
        {!isArchiveOnly && (
          <div className="link-row">
            {watchLink && <ExternalLink href={watchLink.url}>WATCH ↗</ExternalLink>}
            {listenLink && <ExternalLink href={listenLink.url}>LISTEN ↗</ExternalLink>}
            {projectLink && <ExternalLink href={projectLink.url}>PROJECT ↗</ExternalLink>}
            {infoLink && <ExternalLink href={infoLink.url}>INFO ↗</ExternalLink>}
            {(usesInternalInfo || !infoLink) && <button className="text-arrow" onClick={() => navigate(releaseDetailPath(project))}>INFO</button>}
          </div>
        )}
      </div>
    </article>
  );
}

function hasProjectMedia(project: Project) {
  return Boolean(project.artwork || project.images?.[0]);
}

function isWatchLink(link: ProjectLink) {
  return /watch|youtube|youtu\.be|bilibili|video/i.test(`${link.label} ${link.url}`);
}

function isListenLink(link: ProjectLink) {
  return /bandcamp|soundcloud|soundtrack/i.test(`${link.label} ${link.url}`);
}

function isProjectLink(link: ProjectLink) {
  return /project|press/i.test(`${link.label} ${link.url}`);
}

function isNetEaseLink(link: ProjectLink) {
  return /netease|music\.163\.com/i.test(`${link.label} ${link.url}`);
}

function ReleaseArtwork({ project, showPlaceholder = true }: { project: Project; showPlaceholder?: boolean }) {
  const title = project.displayTitle ?? project.title;
  if (project.artwork) {
    return (
      <img className="release-cover" src={assetUrl(project.artwork)} alt={`${project.title} album artwork`} />
    );
  }

  if (project.images?.[0]) {
    return <img className="release-cover music-index-still" src={assetUrl(project.images[0].src)} alt={project.images[0].alt} />;
  }

  return showPlaceholder ? <MediaPlaceholder title={title} label="ALBUM ARTWORK" variant="square" /> : null;
}

function LivePage() {
  const rows = getLiveArchiveRows();
  return (
    <main className="route-page live-page">
      <PageIntro title="LIVE" />
      <section className="live-archive-section">
        <h2>ARCHIVE</h2>
        <div className="live-archive-list">
          {rows.map((row) => (
            <article className="live-archive-row" data-testid={`live-archive-row-${row.id}`} key={row.id}>
              {row.media && <img className="live-archive-media" src={assetUrl(row.media.path)} alt={row.media.alt} />}
              <div className="live-archive-copy">
                <span data-testid="live-date">{row.dateLabel}</span>
                <strong>{row.location}</strong>
                <span>{row.activity}</span>
                <span>{row.role}</span>
                {row.link && <ExternalLink href={row.link.url}>{row.link.label}</ExternalLink>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

type LiveArchiveRow = {
  id: string;
  sortDate: string;
  dateLabel: string;
  location: string;
  activity: string;
  role: string;
  link?: LiveEventLink;
  media?: { path: string; alt: string };
};

function getLiveArchiveRows(): LiveArchiveRow[] {
  const selectedRows = selectedLiveEvents.map((event) => ({
    id: event.id,
    sortDate: event.date ?? event.year ?? "",
    dateLabel: event.displayDate ?? event.year ?? "",
    location: formatVenue(event),
    activity: event.billing?.toUpperCase() ?? event.type.toUpperCase(),
    role: event.type.toUpperCase(),
    link: event.externalLinks?.[0],
    media: getLiveArchiveMedia(event)
  }));
  const noIdeaRow = {
    id: `no-idea-${latestNoIdeaEvent.slug}`,
    sortDate: "2026-05-23",
    dateLabel: latestNoIdeaEvent.displayDate,
    location: `${latestNoIdeaEvent.venue} / ${latestNoIdeaEvent.city}`.toUpperCase(),
    activity: latestNoIdeaEvent.edition.toUpperCase(),
    role: latestNoIdeaEvent.roles.join(" + ").toUpperCase(),
    link: { label: "INFO ↗", url: latestNoIdeaEvent.externalLinks.residentAdvisor },
    media: {
      path: latestNoIdeaEvent.heroImage,
      alt: "Shen Ao performing at Live With No Idea at Shai Space, London."
    }
  };
  const earlierRows = earlierPerformances.map((event) => ({
    id: event.id,
    sortDate: event.date ?? event.year ?? "",
    dateLabel: event.displayDate ?? event.year ?? "",
    location: formatVenue(event),
    activity: (event.title ?? event.type).toUpperCase(),
    role: event.type.toUpperCase(),
    link: event.externalLinks?.[0] ? { label: `${event.externalLinks[0].label.toUpperCase()} ↗`, url: event.externalLinks[0].url } : undefined,
    media: getLiveArchiveMedia(event)
  }));

  return [...selectedRows, noIdeaRow, ...earlierRows].sort((a, b) => b.sortDate.localeCompare(a.sortDate));
}

function getLiveArchiveMedia(event: LiveEvent) {
  const media = event.livePhoto?.path ? event.livePhoto : event.poster?.path ? event.poster : undefined;
  return media?.path ? { path: media.path, alt: `${event.displayDate ?? event.year ?? event.title ?? event.venue} ${event.type.toLowerCase()}` } : undefined;
}

function formatVenue(event: Pick<LiveEvent, "venue" | "city">) {
  return [event.venue, event.city].filter(Boolean).join(" / ").toUpperCase();
}

function SelectedLiveEvent({ event }: { event: LiveEvent }) {
  return (
    <article className="selected-live-event">
      <div className="selected-live-copy">
        <p className="live-date">{event.displayDate}</p>
        <MetaLines lines={[`${event.venue} / ${event.city}`, event.billing]} />
        {event.localVenueName && <p className="secondary-language">{event.localVenueName}</p>}
      </div>
      <div className="selected-live-media">
        <LiveMediaSlot media={event.livePhoto} label="LIVE PHOTO" title={event.displayDate ?? event.venue} kind="photo" />
        <LiveMediaSlot media={event.poster} label="EVENT POSTER" title={event.displayDate ?? event.venue} kind="poster" />
      </div>
    </article>
  );
}

function LiveMediaSlot({ media, label, title, kind }: { media?: LiveMedia; label: string; title: string; kind: "photo" | "poster" }) {
  if (media?.path) {
    return <img className={`live-media live-media-${kind}`} src={assetUrl(media.path)} alt={`${title} ${label.toLowerCase()}`} />;
  }

  return (
    <div className={`live-media-slot live-media-slot-${kind}`}>
      <MediaPlaceholder title={title} label={label} variant={kind === "photo" ? "landscape" : "portrait"} />
    </div>
  );
}

function DjPosterSlot({ poster }: { poster: DjPosterArchiveItem }) {
  return poster.path ? (
    <img className="live-media live-media-poster" src={assetUrl(poster.path)} alt={`${poster.title} poster`} />
  ) : (
    <div className="live-media-slot live-media-slot-poster">
      <MediaPlaceholder title={poster.title} label="EVENT POSTER" variant="portrait" />
    </div>
  );
}

function PracticePage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <main className="route-page practice-page">
      <PageAccentMarks variant="practice" />
      <PageIntro kicker="PRACTICE / EVENTS + COMMUNITY" title="PRACTICE">
        Music-making and event-making occupy different roles in Shen Ao's practice. One grows from accumulated learning; the other from lived experience, listening and making things together.
      </PageIntro>
      <section className="practice-editorial-list">
        {practiceProjects.map((project) => (
          <PracticeEditorialEntry project={project} onOpen={() => navigate(`/work/${project.slug}`)} key={project.slug} />
        ))}
      </section>
    </main>
  );
}

function AboutPage() {
  return (
    <main className="route-page about-page">
      <PageIntro title="ABOUT" testId="about-bio">
        MUSIC PRODUCER / COMPOSER & ARRANGER / EVENT ORGANISER
      </PageIntro>
      <section className="about-profile-layout" data-testid="about-profile">
        <div className="about-copy">
          <h2>PROFILE</h2>
          <div className="about-copy-group">
            <p>Shen Ao is a music producer, composer, arranger and pianist born in Tianjin, China and based in London. He also performs live DJ sets under the alias Teendrum.</p>
            <p>Shen Ao specialises in brightly coloured electronic music with intricate structures and a strongly postmodern style. His works draw on progressive rock, free jazz, Baroque, glitch pop and chiptune, shaping a fragmented contemporary texture that moves between fluid delicacy and rough fury. His songwriting often uses irregular metres and polyrhythms, combining retro computer timbres with strongly narrative processing to depict a restless inner otherworld.</p>
          </div>
          <div className="about-copy-group">
            <p>In 2026, his work was released by Kit Records, a representative independent avant-garde label in London, alongside a limited double-sided cassette. In July of the same year, the work was covered by The Quietus, a noted European electronic music magazine, and by Muito in Buenos Aires. With this album, he has performed alongside international musicians including Vic Bang, k means, Visit Me, Barreleye, YOTO and 4 Channels Club.</p>
            <p>He often collaborates with artists from other fields on cross-media works, including music for film and television, exhibitions, theatre, games and advertising. Since 2020, he has produced music for more than 50 promotional packaging projects for China Central Television programmes, including Long Teng Hu Yue Zhong Guo Nian, Rui Tu Cheng Xiang Zhong Guo Nian, the Convention on Biological Diversity and Da Mei Bian Jiang Xing. In 2024, he worked with London's ENF Theatre on the soundtrack for Fancy A BITE?, which was performed at Camden People's Theatre.</p>
          </div>
          <div className="about-copy-group">
            <p>Shen Ao is also a DJ and music-event curator, performing under the alias Teendrum. He has performed at music venues in China and London, including Zhao Dai, wigwam, Mo Xu You Factory and Taikang Art Museum in China, and Spanners, Shai Space, LOOSE.fm and helm in the UK. In 2024, he launched no idea, an ambient-music online radio and offline event series. The series quickly attracted attention within the field and invited musicians including Kirk Barley, Stella Z, Li Song, Pentu, Xi Chenchen, Louis Gardner and Sseq to perform.</p>
            <p>Shen Ao continues to focus on the healthy development of music communities and founded OPENBAND, an improvisational music workshop. Based at fRUITYSPACE in Beijing, the workshop aims to promote communication and shared growth among local music practitioners. It has held around 20 monthly sessions, attracting about 500 music practitioners, and has promoted its workflow and underlying logic through offline presentations at City, University of London and Hypha HQ in London.</p>
          </div>
          <div className="about-copy-group">
            <p>Through these interrelated projects, Shen Ao's work both inherits its own logic and attends to real society and community development, showing his understanding of musical structure, timbral design and shifts in a broader artistic environment.</p>
          </div>
        </div>
        <img className="artist-portrait artist-portrait-about" src={assetUrl("/assets/portrait/shen-ao-childhood.avif")} alt="Childhood portrait of Shen Ao." />
      </section>
      <section className="cv-grid about-portfolio-lists" data-testid="about-project-links">
        <div>
          <h2>MUSIC</h2>
          <p><span>2026</span>Cyberspace / Bug Party</p>
          <p><span>2024</span>Two Dreadful Children / Unipre</p>
        </div>
        <div>
          <h2>SCORING</h2>
          <p><span>2024</span>Fancy A BITE? / Theatre music</p>
          <p><span>2024</span>Role Model / Short film</p>
          <p><span>2022</span>Nostopia Playable NFT / Game music</p>
          <p><span>2021-2022</span>China Central Television programme promotional packaging / Short films</p>
          <p><span>2022</span>Untitled Land / Short film</p>
          <p><span>2021</span>Clouds from Underground / Short film</p>
          <p><span>2018</span>Paradise Dream 2 / Exhibition score</p>
        </div>
        <div>
          <h2>EVENT PROJECTS</h2>
          <p><span>2024-</span>no idea</p>
          <p><span>2024-</span>OPENBAND</p>
        </div>
      </section>
      <section className="music-platform-row about-contact-links" aria-label="About links">
        <ExternalLink href="https://shenao.bandcamp.com/" className="music-platform-link">BANDCAMP</ExternalLink>
        <ExternalLink href="https://music.163.com/#/artist?id=46923018" className="music-platform-link">NETEASE</ExternalLink>
        <ExternalLink href="https://soundcloud.com/shen-ao/" className="music-platform-link">SOUNDCLOUD</ExternalLink>
        <ExternalLink href="https://www.mixcloud.com/teendrum/" className="music-platform-link">MIXCLOUD</ExternalLink>
        <a className="music-platform-link" href="mailto:lerezero@gmail.com">lerezero@gmail.com</a>
      </section>
    </main>
  );
}

function PressRadioPage() {
  const featured = verifiedPressItems.filter((item) => item.type !== "radio");
  const radio = verifiedPressItems.filter((item) => item.type === "radio");

  return (
    <main className="route-page press-radio-page">
      <PageAccentMarks variant="press" />
      <section className="press-radio-intro">
        <div className="section-kicker">EXTERNAL RECEPTION ARCHIVE</div>
        <h1><span>PRESS /</span><span>RADIO</span></h1>
        <p>Selected reviews, features, recommendations and radio appearances around Shen Ao's music and practice.</p>
      </section>
      <section className="press-feature-list" aria-label="Reviews and recommendations">
        <div className="section-kicker">FEATURES / REVIEWS</div>
        {featured.map((item, index) => <PressFeatureRow item={item} index={index} key={item.id} />)}
      </section>
      <section className="radio-log" aria-label="Radio airplay">
        <div className="section-kicker">RADIO / AIRPLAY</div>
        <div>
          <div className="radio-row radio-head"><p>DATE</p><h2>STATION / PROGRAMME</h2><p>TRACK</p><span>LINK</span></div>
          {radio.map((item, index) => <RadioLogRow item={item} index={index} key={item.id} />)}
        </div>
      </section>
    </main>
  );
}

function EpkPage({ navigate }: { navigate: (path: string) => void }) {
  const contactLinks = [
    musicPlatformLinks.find((link) => link.label === "BANDCAMP")!,
    musicPlatformLinks.find((link) => link.label === "SOUNDCLOUD")!,
    livePlatformLinks.find((link) => link.label === "MIXCLOUD")!
  ];
  const selectedWork = [
    ["CYBERSPACE", "KIT RECORDS / RELEASE", "/work/cyberspace"],
    ["BUG PARTY", "KIT RECORDS / RELEASE", "/work/bug-party"],
    ["ROLE MODEL", "MOVING IMAGE / 2024", "/work/role-model"],
    ["FANCY A BITE?", "THEATRE / 2024", "/work/fancy-a-bite"],
    ["NO IDEA", "EVENTS / RADIO", "/work/no-idea"],
    ["OPENBAND", "INTERDISCIPLINARY IMPROVISATION", "/work/openband-openscore"]
  ];

  return (
    <main className="route-page epk-page">
      <PageAccentMarks variant="epk" />
      <section className="epk-hero" data-testid="epk-hero">
        <div>
          <h1>SHEN AO</h1>
          <p>COMPOSER / PRODUCER / SOUND ARTIST</p>
          <p>LONDON</p>
        </div>
        <img className="artist-portrait artist-portrait-epk" src={assetUrl("/assets/portrait/shen-ao-childhood.avif")} alt="Childhood portrait of Shen Ao." />
      </section>

      <section className="epk-dossier">
        <article className="epk-main-copy" data-testid="epk-short-bio">
          <h2>SHORT BIO</h2>
          <p>Shen Ao is a London-based composer, producer and sound artist working across electronic music, moving image, live performance and event-making. His practice includes independent releases, film and theatre composition, live electronics, improvisation, DJ performance and collaborative projects.</p>
          <p className="epk-statement-brief">His work uses keyboard improvisation, unconventional harmony and electronic/minimalist language as practical methods for shaping sound. In live and collaborative settings, fixed structures are allowed to become unstable and responsive to the room.</p>
        </article>

        <aside className="epk-facts" aria-label="Quick facts" data-testid="epk-quick-facts">
          <h2>QUICK FACTS</h2>
          <InfoItem label="BASED IN" value="London" />
          <InfoItem label="PRACTICE" value="Music / Moving Image / Live / Event-making" />
          <InfoItem label="WORKING ACROSS" value="Composition / Production / Improvisation / Performance" />
          <InfoItem label="CONTACT" value="lerezero@gmail.com" />
          <div className="epk-listen">
            <h2>LISTEN</h2>
            {contactLinks.map((link) => <ExternalLink key={link.url} href={link.url}>{link.label}</ExternalLink>)}
          </div>
        </aside>
      </section>

      <section className="epk-selected-work" data-testid="epk-selected-work">
        <h2>SELECTED WORK</h2>
        <div>
          {selectedWork.map(([title, meta, path]) => (
            <button className="epk-work-row" key={title} onClick={() => navigate(path)}>
              <strong>{title}</strong>
              <em>{meta}</em>
            </button>
          ))}
        </div>
      </section>

      <section className="epk-lower-grid" data-testid="epk-press-radio">
        <article className="epk-press">
          <h2>SELECTED PRESS / RADIO</h2>
          {epkPressItems.map((item) => <PressMiniLine item={item} key={item.id} />)}
        </article>
      </section>

      <section className="epk-cv-grid" data-testid="epk-education-experience">
        <div className="section-kicker">EDUCATION / PROFESSIONAL EXPERIENCE</div>
        <article>
          <h2>EDUCATION</h2>
          <p><span>2023-2025</span>Goldsmiths, University of London<br />MMus Creative Practice</p>
          <p><span>2018-2022</span>Jazz piano studies with Kong Hongwei</p>
          <p><span>2014-2018</span>Tianjin Conservatory of Music</p>
        </article>
        <article>
          <h2>PROFESSIONAL EXPERIENCE</h2>
          <p><span>2021.09-2023.04</span>China Television Media / 中视前卫影视传媒<br />Audio Editing / Music Production</p>
          <p>Participated in audio and music production for more than 50 short-form promotional projects for CCTV-13.</p>
        </article>
      </section>

      <section className="epk-contact" data-testid="epk-contact">
        <h2>CONTACT / BOOKINGS / COLLABORATION</h2>
        <a href="mailto:lerezero@gmail.com">lerezero@gmail.com</a>
        <div>
          {contactLinks.map((link) => <ExternalLink key={link.url} href={link.url}>{link.label}</ExternalLink>)}
        </div>
      </section>
    </main>
  );
}

function MusicReleasePage({ navigate }: { navigate: (path: string) => void }) {
  const releases = [getProject("cyberspace")!, getProject("bug-party")!];
  const project = releases[0];
  const releasePress = verifiedPressItems.filter((item) => item.id === "quietus-spools-out-july" || item.id === "muito-buy-music-club-27");
  const relatedLive = [...selectedLiveEvents].sort((a, b) => String(a.date).localeCompare(String(b.date)));

  return (
    <ProjectShell kicker="PROJECT / MUSIC" title="CYBERSPACE / BUG PARTY" project={project}>
      <div className="release-pair-hero">
        {releases.map((release) => <ReleaseCoverPanel release={release} key={release.slug} />)}
      </div>

      <section className="release-detail-note">
        <h2>ABOUT THE RELEASE</h2>
        <p>{kitRecordsReleaseNote}</p>
      </section>

      <section className="release-detail-press home-press-section">
        <h2>PRESS</h2>
        <div className="home-press-index">
          {releasePress.map((item) => <ReleasePressLine item={item} key={item.id} />)}
        </div>
      </section>

      <section className="release-detail-live home-related-live-section">
        <h2>RELATED LIVE</h2>
        <div className="release-live-list">
          {relatedLive.map((event) => <ReleaseLiveLine event={event} key={event.id} />)}
        </div>
      </section>

      <NextProject title="ROLE MODEL" onClick={() => navigate("/work/role-model")} />
    </ProjectShell>
  );
}

function ReleaseCoverPanel({ release }: { release: Project }) {
  const listenLink = release.externalLinks?.find((link) => /bandcamp/i.test(`${link.label} ${link.url}`));

  return (
    <article className="release-cover-panel">
      <img className="project-art album-cover" src={assetUrl(release.artwork!)} alt={`${release.title} album artwork`} />
      <div className="release-cover-meta">
        <h2>{release.title}</h2>
        <p className="release-detail-label">2026 / {release.label?.toUpperCase()}</p>
        {listenLink && <ExternalLink href={listenLink.url} ariaLabel={`${release.title} LISTEN ↗`}>LISTEN ↗</ExternalLink>}
      </div>
    </article>
  );
}

function ReleasePressLine({ item }: { item: PressItem }) {
  const source = item.outlet ?? item.station ?? "";
  const cta = item.id === "muito-buy-music-club-27" ? "VIEW" : "READ";

  return (
    <div className="home-press-line release-press-line">
      <strong>{source}</strong>
      <span>{item.title}</span>
      <em>{displayRelatedProject(item.relatedProject)?.toUpperCase()}</em>
      <ExternalLink href={item.url}>{cta} ↗</ExternalLink>
    </div>
  );
}

function ReleaseLiveLine({ event }: { event: LiveEvent }) {
  const media = getLiveArchiveMedia(event);
  const link = event.externalLinks?.[0];

  return (
    <ExternalLink className="release-live-row" href={link!.url}>
      {media && <img src={assetUrl(media.path)} alt={media.alt} />}
      <span>{event.displayDate}</span>
      <strong>{formatVenue(event)}</strong>
      <em>{link!.label}</em>
    </ExternalLink>
  );
}

function RoleModelPage({ navigate }: { navigate: (path: string) => void }) {
  const project = getProject("role-model")!;
  const [heroImage, ...galleryImages] = project.images!;
  const nextProject = nextProjectFor(project.slug);
  return (
    <ProjectShell kicker="PROJECT / MOVING IMAGE" title="ROLE MODEL" project={project}>
      <div className="project-layout project-layout-loose film-layout">
        <figure className="project-figure role-model-hero-figure">
          <img className="role-model-still role-model-still-detail" src={assetUrl(heroImage.src)} alt={heroImage.alt} />
          <figcaption>{project.photographyCredit}</figcaption>
        </figure>
        <div className="project-meta">
          <p>{project.intro}</p>
          <MetaLines lines={[project.year, "FILM", "SCORE / MIX"]} />
          <div className="mini-meta"><span>DIRECTOR</span><strong>HONGXUAN WANG</strong></div>
          <div className="link-row">
            {project.externalLinks?.map((link) => <ExternalLink key={link.url} href={link.url}>{link.label}</ExternalLink>)}
          </div>
        </div>
      </div>
      <section className="detail-band">
        <h2>CREATIVE APPROACH</h2>
        <p>{project.creativeApproach}</p>
      </section>
      <section className="role-model-gallery" aria-label="Role Model image gallery">
        {galleryImages.map((image, index) => (
          <figure className={`project-figure role-model-gallery-item role-model-gallery-item-${index + 1}`} key={image.src}>
            <img className="role-model-still" src={assetUrl(image.src)} alt={image.alt} />
          </figure>
        ))}
      </section>
      <section className="detail-band">
        <h2>CREDITS</h2>
        <p>DIRECTOR / HONGXUAN WANG</p>
      </section>
      <NextProject title={nextProject.title} onClick={() => navigate(nextProject.path)} />
    </ProjectShell>
  );
}

function FancyABitePage({ navigate }: { navigate: (path: string) => void }) {
  const project = getProject("fancy-a-bite")!;
  const [heroImage, ...galleryImages] = project.images!;
  const nextProject = nextProjectFor(project.slug);

  return (
    <ProjectShell kicker="PROJECT / THEATRE" title="FANCY A BITE?" project={project}>
      <div className="project-layout project-layout-loose structured-detail-layout">
        <figure className="project-figure fancy-a-bite-hero-figure">
          <img className="fancy-a-bite-image fancy-a-bite-hero-image" src={assetUrl(heroImage.src)} alt={heroImage.alt} />
        </figure>
        <div className="project-meta">
          <p>{project.intro}</p>
          <MetaLines lines={[project.year, project.subtype, project.role?.join(" / ")]} />
          <div className="link-row">
            {project.externalLinks?.map((link) => <ExternalLink key={link.url} href={link.url}>{link.label}</ExternalLink>)}
          </div>
        </div>
      </div>
      <section className="detail-band">
        <h2>CREATIVE APPROACH</h2>
        <p>{project.creativeApproach}</p>
      </section>
      <section className="fancy-a-bite-gallery" aria-label="Fancy A BITE? image gallery">
        {galleryImages.map((image, index) => (
          <figure className={`project-figure fancy-a-bite-gallery-item fancy-a-bite-gallery-item-${index + 1}`} key={image.src}>
            <img className="fancy-a-bite-image" src={assetUrl(image.src)} alt={image.alt} />
          </figure>
        ))}
      </section>
      <NextProject title={nextProject.title} onClick={() => navigate(nextProject.path)} />
    </ProjectShell>
  );
}

function NoIdeaPage({ navigate }: { navigate: (path: string) => void }) {
  const project = getProject("no-idea")!;
  const event = latestNoIdeaEvent;
  return (
    <ProjectShell kicker="PRACTICE / EVENTS + RADIO" title={noIdeaProject.title} project={project}>
      <section className="practice-project-intro no-idea-project-intro">
        <div>
          <MetaLines lines={[noIdeaProject.year, noIdeaProject.heading]} />
          <p>{noIdeaProject.summary}</p>
          {noIdeaProject.detail && <p className="practice-detail-copy">{noIdeaProject.detail}</p>}
          <div className="link-row">
            {noIdeaProject.links.map((link) => <ExternalLink key={link.url} href={link.url}>{link.label}</ExternalLink>)}
          </div>
          {noIdeaProject.instagramHandle && <p className="practice-social">{noIdeaProject.instagramHandle}</p>}
        </div>
        <figure className="no-idea-hero-figure">
          <img src={assetUrl(event.heroImage)} alt="Shen Ao performing at Live With No Idea at Shai Space, London." />
        </figure>
      </section>

      <section className="practice-poster-archive no-idea-events">
        <div className="section-kicker">LIVE EVENT ARCHIVE</div>
        <div className="practice-poster-grid">
          {noIdeaProject.posterArchive?.map((slot) => <NoIdeaPosterSlot slot={slot} navigate={navigate} key={slot.id} />)}
        </div>
      </section>

      <section className="practice-radio-archive">
        <div className="section-kicker">RADIO ARCHIVE</div>
        <div className="practice-radio-grid">
          {noIdeaProject.radioArchive?.map((slot) => <RadioArtworkSlot slot={slot} key={slot.id} />)}
        </div>
        <ExternalLink href={event.externalLinks.noIdeaRadio}>LISTEN ON BAIHUI ↗</ExternalLink>
      </section>

      <section className="no-idea-event-gallery" aria-label="Live With No Idea image gallery">
        {event.galleryImages.map((image, index) => (
          <figure className={`no-idea-gallery-item no-idea-gallery-item-${index + 1}`} key={image.src}>
            <img src={assetUrl(image.src)} alt={image.alt} />
          </figure>
        ))}
      </section>
      <NextProject title="OPENBAND" onClick={() => navigate("/work/openband-openscore")} />
    </ProjectShell>
  );
}

function OpenbandPage({ navigate }: { navigate: (path: string) => void }) {
  const project = getProject("openband-openscore")!;
  return (
    <ProjectShell kicker="PRACTICE / WORKSHOPS" title={openbandProject.title} project={project}>
      <section className="practice-project-intro openband-project-intro">
        <div>
          <MetaLines lines={[openbandProject.year, openbandProject.heading, openbandProject.location]} />
          <p>{openbandProject.summary}</p>
          <div className="link-row">
            {openbandProject.links.map((link) => <ExternalLink key={link.url} href={link.url}>{link.label}</ExternalLink>)}
          </div>
        </div>
        <div className="openband-lead-poster">
          <MediaPlaceholder title="OPENBAND" label="WORKSHOP POSTER" variant="portrait" />
        </div>
      </section>

      <section className="practice-poster-archive openband-poster-archive">
        <div className="section-kicker">MONTHLY WORKSHOP POSTERS</div>
        <div className="practice-poster-grid">
          {openbandProject.posterArchive?.map((slot) => <PosterPlaceholderSlot slot={slot} key={slot.id} />)}
        </div>
      </section>

      <section className="openband-workshop-list">
        <div className="section-kicker">LONDON WORKSHOP / ARCHIVE</div>
        {openbandProject.workshopEntries?.map((entry) => <WorkshopDocumentationEntry entry={entry} key={entry.venue} />)}
      </section>

      <section className="openband-gallery-grid" aria-label="Openband workshop gallery placeholders">
        {Array.from({ length: 6 }).map((_, index) => (
          <MediaPlaceholder title="OPENBAND" label="DOCUMENTATION IMAGE" variant="landscape" key={index} />
        ))}
      </section>
      <NextProject title="NO IDEA" onClick={() => navigate("/work/no-idea")} />
    </ProjectShell>
  );
}

function NoIdeaEventPage({ slug, navigate }: { slug: string; navigate: (path: string) => void }) {
  const event = getNoIdeaEvent(slug);
  if (!event) {
    return (
      <main className="project-page project-page-no-idea-event">
        <PageIntro kicker="NO IDEA / EVENT" title="EVENT NOT FOUND">The requested No Idea event route is not available.</PageIntro>
      </main>
    );
  }

  return (
    <main className="project-page no-idea-event-page">
      <PageAccentMarks variant="project" />
      <section className="project-hero no-idea-event-hero">
        <div className="section-kicker">NO IDEA / EVENT</div>
        <h1>{event.edition.toUpperCase()}</h1>
        <div className="event-hero-meta">
          <MetaLines lines={[
            event.displayDate,
            event.venue,
            event.room,
            event.address,
            `${event.city} ${event.postcode}`,
            "ROLE",
            event.roles.join(" + "),
            event.genres.join(" / ")
          ]} />
          <ExternalLink href={event.externalLinks.residentAdvisor}>VIEW ON RESIDENT ADVISOR</ExternalLink>
        </div>
      </section>

      <figure className="event-main-photo">
        <img src={assetUrl(event.heroImage)} alt="Shen Ao performing at Live With No Idea at Shai Space, London." />
      </figure>

      <section className="event-poster-section">
        <figure>
          <img src={assetUrl(event.posterImage)} alt="Live With No Idea event poster." />
        </figure>
        <div>
          <div className="section-kicker">EVENT POSTER</div>
          <div className="event-lineup">
            <h2>LINEUP</h2>
            {event.lineup.map((artist) => <p key={artist}>{artist}</p>)}
          </div>
          <MetaLines lines={[event.displayDate, `${event.venue} / ${event.room}`, event.city]} />
        </div>
      </section>

      <section className="no-idea-event-gallery" aria-label="Live With No Idea image gallery">
        {event.galleryImages.map((image, index) => (
          <figure className={`no-idea-gallery-item no-idea-gallery-item-${index + 1}`} key={image.src}>
            <img src={assetUrl(image.src)} alt={image.alt} />
          </figure>
        ))}
      </section>
      <NextProject title="BACK TO NO IDEA" onClick={() => navigate("/work/no-idea")} label={null} />
    </main>
  );
}

function ProjectShell({ kicker, title, project, children }: { kicker: string; title: ReactNode; project: Project; children: ReactNode }) {
  return (
    <main className={`project-page project-page-${project.slug}`}>
      <PageAccentMarks variant="project" />
      <section className="project-hero">
        <div className="section-kicker">{kicker}</div>
        <h1>{title}</h1>
        <p className="identity">{project.category.toUpperCase()} {project.subtype ? `/ ${project.subtype.toUpperCase()}` : ""}</p>
      </section>
      {children}
    </main>
  );
}

function PageAccentMarks({ variant }: { variant: string }) {
  return (
    <div className={`page-accent-marks page-accent-${variant}`} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

function ArchiveTable({ filter, setFilter, rows }: { filter: (typeof archiveFilters)[number]; setFilter: (filter: (typeof archiveFilters)[number]) => void; rows: Project[] }) {
  return (
    <section className="archive">
      <div className="section-kicker">WORK / ARCHIVE</div>
      <div className="filters" aria-label="Archive filters">
        {archiveFilters.map((item) => (
          <button key={item} className={filter === item ? "selected" : ""} onClick={() => setFilter(item)}>{item}</button>
        ))}
      </div>
      <div className="archive-table">
        <div className="archive-row archive-head"><span>TITLE</span><span>YEAR</span><span>CATEGORY</span><span>FORMAT</span><span>CONTEXT</span></div>
        {rows.map((project) => (
          <div className="archive-row" data-testid={`archive-row-${project.slug}`} key={project.slug}>
            <span>{project.title.toUpperCase()}</span>
            <span>{project.year ?? ""}</span>
            <span>{project.category.toUpperCase()}</span>
            <span>{project.subtype?.toUpperCase() ?? ""}</span>
            <span>{project.label?.toUpperCase() ?? ""}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutPractice({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="about-practice">
      <div className="about-block">
        <div className="section-kicker">ABOUT / PREVIEW</div>
        <h2>SOUND AS PROCESS</h2>
        <p>Keyboard improvisation is central to Shen Ao's way of processing sound. Different musical languages and surrounding environments are absorbed, tested and reorganised through playing, production and collaboration.</p>
        <button className="text-arrow" onClick={() => navigate("/about")}>ABOUT</button>
      </div>
      <div className="practice-columns">
        {[
          ["MUSIC WORK", "Composition", "Electronic music", "Production", "Improvisation", "Moving image"],
          ["EVENT WORK", "Events", "Radio", "Workshops", "Collective improvisation", "Cross-disciplinary collaboration"]
        ].map(([heading, ...items]) => (
          <div key={heading}>
            <h3>{heading}</h3>
            {items.map((item) => <p key={item}>{item}</p>)}
          </div>
        ))}
      </div>
    </section>
  );
}

function LivePreview({ navigate }: { navigate: (path: string) => void }) {
  const event = latestNoIdeaEvent;
  return (
    <section className="live-preview flow-section">
      <div>
        <div className="section-kicker">LIVE / PREVIEW</div>
        <h2>LIVE</h2>
        <p>A recording captures only one aspect of a performance. The live work is different every time.</p>
      </div>
      <MetaLines lines={["LIVE ELECTRONICS", "IMPROVISATION", "PERFORMANCE", "DJ SETS"]} />
      <article className="home-live-event">
        <img src={assetUrl(event.heroImage)} alt="Shen Ao performing at Live With No Idea at Shai Space, London." />
        <div>
          <h3>NO IDEA — SHAI SPACE</h3>
          <MetaLines lines={[event.displayDate, `${event.venue} / ${event.city}`, event.roles.join(" + ")]} />
          <button className="text-arrow" onClick={() => navigate(`/practice/no-idea/${event.slug}`)}>VIEW EVENT</button>
        </div>
      </article>
      <button className="text-arrow" onClick={() => navigate("/live")}>EXPLORE LIVE</button>
    </section>
  );
}

function PracticeProjects({ navigate }: { navigate: (path: string) => void }) {
  const practice = projects.filter((project) => project.featured === "practice");
  return (
    <section className="practice-projects">
      {practice.map((project) => (
        <article key={project.slug}>
          {project.slug === "no-idea" ? (
            <img className="practice-poster-preview" src={assetUrl(latestNoIdeaEvent.posterImage)} alt="Live With No Idea event poster." />
          ) : (
            <MediaPlaceholder title={project.title.toUpperCase()} label="WORKSHOP MATERIAL" variant="landscape" />
          )}
          <h2>{project.title.toUpperCase()}</h2>
          <p>{project.description}</p>
          {project.slug === "no-idea" && (
            <div className="latest-event-note">
              <span>LATEST DOCUMENTED EVENT</span>
              <strong>{latestNoIdeaEvent.edition.toUpperCase()} / {latestNoIdeaEvent.displayDate}</strong>
            </div>
          )}
          <div className="link-row">
            {project.externalLinks?.map((link) => <ExternalLink key={link.url} href={link.url}>{link.label}</ExternalLink>)}
            <button className="text-arrow" onClick={() => navigate(`/work/${project.slug}`)}>VIEW PROJECT</button>
          </div>
        </article>
      ))}
    </section>
  );
}

function PressRadioPreview({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="press-radio-preview">
      <div className="section-kicker">PRESS / RADIO</div>
      <h2>PRESS / RADIO</h2>
      <div className="home-press-index">
        {homePressItems.map((item) => <PressMiniLine item={item} key={item.id} />)}
      </div>
      <button className="text-arrow" onClick={() => navigate("/press-radio")}>VIEW PRESS / RADIO</button>
    </section>
  );
}

function ProjectDetailPage({ slug, navigate }: { slug: string; navigate: (path: string) => void }) {
  const project = getProject(slug);
  if (!project) {
    return (
      <main className="project-page">
        <PageIntro kicker="PROJECT / NOT FOUND" title="PROJECT NOT FOUND">The requested project route is not available.</PageIntro>
      </main>
    );
  }

  const isPractice = project.slug === "no-idea" || project.slug === "openband-openscore";
  const [heroSlot, ...gallerySlots] = project.detailMedia ?? [];
  const [heroImage, ...galleryImages] = project.showImagesOnDetail ? (project.images ?? []) : [];
  return (
    <ProjectShell kicker={`PROJECT / ${project.category.toUpperCase()}`} title={project.title.toUpperCase()} project={project}>
      <div className={`project-layout project-layout-loose ${isPractice ? "practice-detail-layout" : "structured-detail-layout"}`}>
        {project.artwork ? (
          <img className="project-art album-cover" src={assetUrl(project.artwork)} alt={`${project.title} album artwork`} />
        ) : heroImage ? (
          <img className="project-detail-image project-detail-hero-image" src={assetUrl(heroImage.src)} alt={heroImage.alt} />
        ) : (
          <MediaPlaceholder
            title={project.title.toUpperCase()}
            label={heroSlot?.label ?? (project.category === "Music" ? "ALBUM ARTWORK" : "MEDIA PLACEHOLDER")}
            variant={heroSlot?.variant ?? (project.category === "Music" ? "square" : "landscape")}
          />
        )}
        <div className="project-meta">
          {project.intro ? <p>{project.intro}</p> : project.description && <p>{project.description}</p>}
          <MetaLines lines={[project.year, project.subtype, project.role?.join(" / "), project.label, project.location]} />
          <div className="link-row">
            {project.externalLinks?.filter((link) => !link.hideFromEnglishUi).map((link) => link.englishNote ? (
              <span className="project-link-with-note" key={link.url}>
                <ExternalLink href={link.url}>{link.label}</ExternalLink>
                <small>{link.englishNote}</small>
              </span>
            ) : <ExternalLink key={link.url} href={link.url}>{link.label}</ExternalLink>)}
          </div>
        </div>
      </div>
      {project.creativeApproach && (
        <section className="detail-band">
          <h2>CREATIVE APPROACH</h2>
          <p>{project.creativeApproach}</p>
        </section>
      )}
      {isPractice && (
        <section className="detail-band">
          <h2>RELATED PRACTICE</h2>
          <p>{project.slug === "no-idea" ? "Events, radio, programming, budgeting, technical production and coordination around immersive live experiences." : "Open, non-hierarchical approaches to sound-making with musicians, artists, visual practitioners and local collaborators."}</p>
        </section>
      )}
      {galleryImages.length > 0 ? (
        <section className={`placeholder-sequence detail-media-grid detail-media-${project.slug}`} aria-label={`${project.title} image gallery`}>
          {galleryImages.map((image) => (
            <img className="project-detail-image" src={assetUrl(image.src)} alt={image.alt} key={image.src} />
          ))}
        </section>
      ) : gallerySlots.length > 0 ? (
        <section className={`placeholder-sequence detail-media-grid detail-media-${project.slug}`}>
          {gallerySlots.map((slot, index) => (
            <MediaPlaceholder key={`${slot.label}-${index}`} title={project.title.toUpperCase()} label={slot.label} variant={slot.variant} />
          ))}
        </section>
      ) : !project.showImagesOnDetail && (
        <PlaceholderSequence labels={project.category === "Music" ? ["MEDIA PLACEHOLDER", "ADDITIONAL MEDIA", "PROJECT IMAGE"] : ["MEDIA PLACEHOLDER", "ADDITIONAL MEDIA", "PROJECT IMAGE"]} />
      )}
      {project.selectedCases && <SelectedCases cases={project.selectedCases} accessNote={project.externalAccessNote} />}
      {project.archiveGallery ? (
        <ArchiveGallery items={project.archiveGallery} />
      ) : (
        <>
          {project.externalAccessNote && <p className="project-access-note">{project.externalAccessNote}</p>}
          {project.relatedTitles && <ArchiveList titles={project.relatedTitles} />}
        </>
      )}
      {project.relatedWorks && <RelatedWorks works={project.relatedWorks} />}
      {project.press && <KnownPress press={project.press} />}
      <NextProject title={nextProjectFor(project.slug).title} onClick={() => navigate(nextProjectFor(project.slug).path)} />
    </ProjectShell>
  );
}

function PageIntro({ kicker, title, children, testId }: { kicker?: string; title: string; children?: ReactNode; testId?: string }) {
  return (
    <section className="page-intro" data-testid={testId}>
      {kicker && <div className="section-kicker">{kicker}</div>}
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </section>
  );
}

function MediaPlaceholder({ title, label, variant = "landscape" }: { title: string; label: string; variant?: "portrait" | "landscape" | "cinematic" | "square" }) {
  return (
    <div className={`media-placeholder plan-b-placeholder placeholder-${variant}`}>
      <span>{title}</span>
      <strong>{label}</strong>
      <em>MEDIA SLOT</em>
    </div>
  );
}

function PracticeEditorialEntry({ project, onOpen }: { project: PracticeProject; onOpen: () => void }) {
  const isNoIdea = project.slug === "no-idea";
  return (
    <article className={`practice-editorial-entry practice-editorial-${project.slug}`}>
      <div className="practice-entry-media">
        {isNoIdea ? (
          <img className="practice-feature-poster" src={assetUrl(latestNoIdeaEvent.posterImage)} alt="Live With No Idea event poster." />
        ) : (
          <MediaPlaceholder title="OPENBAND" label="WORKSHOP POSTER" variant="portrait" />
        )}
      </div>
      <div className="practice-entry-copy">
        <MetaLines lines={[project.year]} />
        <p className="practice-entry-secondary">{project.heading}</p>
        <h2>{project.title}</h2>
        <p>{isNoIdea ? project.summary : "A Shen Ao-led improvisation workshop series developed at fRUITYSPACE in Beijing, built around collective music-making and open improvisation."}</p>
        <button className="text-arrow" onClick={onOpen}>{isNoIdea ? "VIEW NO IDEA →" : "VIEW OPENBAND →"}</button>
      </div>
    </article>
  );
}

function NoIdeaPosterSlot({ slot, navigate }: { slot: PosterArchiveSlot; navigate: (path: string) => void }) {
  if (slot.image && slot.eventSlug) {
    return (
      <article className="practice-poster-slot practice-poster-slot-confirmed">
        <img src={assetUrl(slot.image)} alt="Live With No Idea event poster." />
        <div>
          <h2>{slot.title}</h2>
          <MetaLines lines={[slot.label, latestNoIdeaEvent.roles.join(" + ")]} />
          <button className="text-arrow" onClick={() => navigate(`/practice/no-idea/${slot.eventSlug}`)}>VIEW EVENT</button>
        </div>
      </article>
    );
  }

  return <PosterPlaceholderSlot slot={slot} />;
}

function PosterPlaceholderSlot({ slot }: { slot: PosterArchiveSlot }) {
  return (
    <article className="practice-poster-slot">
      <MediaPlaceholder title={slot.title} label={slot.label} variant="portrait" />
    </article>
  );
}

function RadioArtworkSlot({ slot }: { slot: RadioArchiveSlot }) {
  return (
    <article className="practice-radio-slot">
      <MediaPlaceholder title={slot.title} label={slot.label} variant="square" />
    </article>
  );
}

function WorkshopDocumentationEntry({ entry }: { entry: WorkshopEntry }) {
  return (
    <article className="openband-workshop-entry">
      <div>
        <h2>{entry.venue}</h2>
        <MetaLines lines={[entry.label]} />
      </div>
      <MediaPlaceholder title="OPENBAND" label="DOCUMENTATION IMAGE" variant="landscape" />
    </article>
  );
}

function PracticeFeature({ project, placeholder, event, onOpen }: { project: Project; placeholder?: string; event?: NoIdeaEvent; onOpen: () => void }) {
  return (
    <article className="practice-feature">
      {event ? (
        <img className="practice-feature-poster" src={assetUrl(event.posterImage)} alt="Live With No Idea event poster." />
      ) : (
        <MediaPlaceholder title={project.title.toUpperCase()} label={placeholder ?? "MEDIA PLACEHOLDER"} variant="landscape" />
      )}
      <div>
        <h2>{project.title}</h2>
        <p>{event ? "Independent ambient / experimental events and online radio." : project.description}</p>
        {event && (
          <div className="latest-event-note">
            <span>LATEST DOCUMENTED EVENT</span>
            <strong>{event.edition.toUpperCase()} / {event.displayDate}</strong>
          </div>
        )}
        <div className="link-row">
          {project.externalLinks?.map((link) => <ExternalLink key={link.url} href={link.url}>{link.label}</ExternalLink>)}
          <button className="text-arrow" onClick={onOpen}>{event ? "VIEW NO IDEA" : "VIEW PROJECT"}</button>
        </div>
      </div>
    </article>
  );
}

function CvSections() {
  return (
    <section className="cv-grid">
      <div data-testid="about-education">
        <h2>EDUCATION</h2>
        <p><span>2023-2025</span>Goldsmiths, University of London<br />MMus Creative Practice</p>
        <p><span>2018-2022</span>Jazz piano studies with Kong Hongwei</p>
        <p><span>2014-2018</span>Tianjin Conservatory of Music</p>
      </div>
      <div data-testid="about-experience">
        <h2>PROFESSIONAL EXPERIENCE</h2>
        <p><span>2021.09-2023.04</span>China Television Media / 中视前卫影视传媒<br />Audio Editing / Music Production</p>
        <p>Participated in audio and music production for more than 50 short-form promotional projects for CCTV-13.</p>
      </div>
    </section>
  );
}

function PressSection({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="press-section" data-testid="about-press">
      <h2>SELECTED PRESS</h2>
      {aboutPressItems.map((item) => <PressMiniLine item={item} key={item.id} />)}
      <button className="text-arrow" onClick={() => navigate("/press-radio")}>MORE PRESS / RADIO</button>
    </section>
  );
}

function KnownPress({ press }: { press: NonNullable<Project["press"]> }) {
  return (
    <section className="detail-band">
      <h2>KNOWN PRESS</h2>
      <ul>{press.map((item) => <li key={item.title}>{[item.context, item.title].filter(Boolean).join(" / ")}</li>)}</ul>
    </section>
  );
}

function SelectedCases({ cases, accessNote }: { cases: NonNullable<Project["selectedCases"]>; accessNote?: string }) {
  return (
    <section className="selected-cases">
      <h2>SELECTED BROADCAST WORK</h2>
      <div className="selected-case-grid">
        {cases.map((item) => (
          <article className="selected-case" data-testid="selected-case" key={item.url}>
            {item.media?.src ? (
              <img className="selected-case-image" src={assetUrl(item.media.src)} alt={item.media.alt ?? item.title} />
            ) : item.media && (
              <MediaPlaceholder title="CCTV-13" label={item.media.label} variant={item.media.variant} />
            )}
            <div>
              <h3>{item.title}</h3>
              {item.description && <p>{item.description}</p>}
              <ExternalLink href={item.url}>WATCH ↗</ExternalLink>
            </div>
          </article>
        ))}
      </div>
      {accessNote && <p className="project-access-note selected-cases-note">{accessNote}</p>}
    </section>
  );
}

function ArchiveList({ titles }: { titles: string[] }) {
  return (
    <section className="detail-band archive-list-band">
      <h2>ARCHIVE</h2>
      <ul>{titles.map((title) => <li key={title}>{title}</li>)}</ul>
    </section>
  );
}

function ArchiveGallery({ items }: { items: NonNullable<Project["archiveGallery"]> }) {
  return (
    <section className="archive-gallery-section" aria-label="CCTV archive gallery">
      <div className="section-kicker">ARCHIVE / MORE WORK</div>
      <div className="archive-gallery-grid">
        {items.map((item) => {
          const content = (
            <>
              <img src={assetUrl(item.src)} alt={item.alt} />
              <span>{item.title}</span>
            </>
          );
          return item.url ? (
            <a className="archive-gallery-item" href={item.url} target="_blank" rel="noreferrer" data-testid="archive-gallery-item" key={item.src}>
              {content}
            </a>
          ) : (
            <figure className="archive-gallery-item" data-testid="archive-gallery-item" key={item.src}>
              {content}
            </figure>
          );
        })}
      </div>
    </section>
  );
}

function RelatedWorks({ works }: { works: NonNullable<Project["relatedWorks"]> }) {
  return (
    <section className="related-work-section">
      <div className="section-kicker">RELATED WORK</div>
      {works.map((work) => (
        <article className="related-work-entry" key={work.title}>
          {work.media?.src ? (
            <img className="related-work-image" src={assetUrl(work.media.src)} alt={work.media.alt ?? work.title} />
          ) : work.media && (
            <MediaPlaceholder title="MEDIA" label={work.media.label} variant={work.media.variant} />
          )}
          <div>
            <h2>{work.title}</h2>
            <MetaLines lines={[work.year, work.role]} />
            {work.description && <p>{work.description}</p>}
          </div>
        </article>
      ))}
    </section>
  );
}

function EpkBlock({ title, children }: { title: string; children: ReactNode }) {
  return <article><h2>{title}</h2><p>{children}</p></article>;
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-item">
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}

function PressFeatureRow({ item, index }: { item: PressItem; index: number }) {
  const outlet = item.outlet ?? item.station ?? "";
  return (
    <article className={`press-feature-row press-feature-row-${index + 1}`}>
      <div>
        <p className="press-outlet">{outlet}</p>
        <h2>{item.title}</h2>
        <MetaLines lines={[pressTypeLabel(item), displayRelatedProject(item.relatedProject), item.author, item.year]} />
        <p>{item.context}</p>
        {item.quote && <blockquote>“{item.quote}”</blockquote>}
        <ExternalLink href={item.url}>{item.cta}</ExternalLink>
      </div>
    </article>
  );
}

function RadioLogRow({ item, index }: { item: PressItem; index: number }) {
  return (
    <article className={`radio-row radio-row-${index + 1}`}>
      <p>{item.date}</p>
      <h2><span>{item.station}</span><strong>{item.programme}</strong></h2>
      <p className="radio-track">{item.track}</p>
      <ExternalLink href={item.url}>{item.cta}</ExternalLink>
    </article>
  );
}

function PressMiniLine({ item }: { item: PressItem }) {
  const source = item.type === "radio"
    ? [item.station, item.programme].filter(Boolean).join(" — ")
    : item.outlet;
  const detail = item.type === "radio" ? item.track : item.title;

  return (
    <div className="press-mini-line">
      <strong>{source}</strong>
      <span>{detail}</span>
      <ExternalLink href={item.url}>{item.cta}</ExternalLink>
    </div>
  );
}

function HomePressLine({ item }: { item: PressItem }) {
  const source = item.outlet ?? item.station ?? "";
  const cta = item.id === "muito-buy-music-club-27" ? "VIEW" : "READ";

  return (
    <div className="home-press-line">
      <strong>{source}</strong>
      <span>{item.title}</span>
      <ExternalLink href={item.url}>{cta} ↗</ExternalLink>
    </div>
  );
}

function pressTypeLabel(item: PressItem) {
  return item.type === "radio" ? "RADIO AIRPLAY" : item.type;
}

function displayRelatedProject(relatedProject?: string) {
  return relatedProject?.replace(" / ", " + ");
}

function Collaboration() {
  return (
    <section className="collaboration">
      <h2>COMMISSIONS<br />& COLLABORATION</h2>
      <div>
        <p>Available for moving image, film, theatre, performance and interdisciplinary projects.</p>
        <p>Composition, sound production and collaborative development.</p>
        <a className="text-arrow" href="mailto:lerezero@gmail.com">START A CONVERSATION</a>
        <p className="email">lerezero@gmail.com</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <span>SHEN AO</span>
      <a href="https://shenao.bandcamp.com/">BANDCAMP</a>
      <a href="https://soundcloud.com/shen-ao">SOUNDCLOUD</a>
      <a href="https://www.mixcloud.com/teendrum/">MIXCLOUD</a>
      <span>LONDON</span>
      <span>© 2026 SHEN AO</span>
    </footer>
  );
}

function SignalArtwork() {
  return <div className="signal-artwork">{Array.from({ length: 34 }).map((_, i) => <i key={i} />)}</div>;
}

function MediaVisual({ project }: { project: Project }) {
  if (project.images?.[0]) {
    return <img className="work-media work-project-image" src={assetUrl(project.images[0].src)} alt={project.images[0].alt} />;
  }

  if (project.artwork) {
    return <img className="work-media work-artwork" src={assetUrl(project.artwork)} alt={`${project.title} album artwork`} />;
  }

  return <MediaPlaceholder title={project.title.toUpperCase()} label={project.category === "Music" ? "ALBUM ARTWORK" : "MEDIA PLACEHOLDER"} variant={project.category === "Music" ? "square" : "landscape"} />;
}

function MetaLines({ lines }: { lines: Array<string | undefined> }) {
  return <div className="meta-lines">{lines.filter(Boolean).map((line) => <span key={line}>{line!.toUpperCase()}</span>)}</div>;
}

function ExternalLink({ href, children, className = "text-arrow", ariaLabel }: { href: string; children: React.ReactNode; className?: string; ariaLabel?: string }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer" aria-label={ariaLabel}>{children}</a>;
}

function LinkList({ heading, links }: { heading: string; links: { label: string; url: string }[] }) {
  return <section className="detail-band"><h2>{heading}</h2>{links.map((link) => <ExternalLink key={link.url} href={link.url}>{link.label}</ExternalLink>)}</section>;
}

function PlaceholderSequence({ labels }: { labels: string[] }) {
  return <section className="placeholder-sequence">{labels.map((label, index) => <MediaPlaceholder key={label} title="MEDIA" label={label} variant={index === 0 ? "landscape" : "square"} />)}</section>;
}

function NextProject({ title, onClick, label = "NEXT PROJECT" }: { title: string; onClick: () => void; label?: string | null }) {
  return <button className="next-project" onClick={onClick}>{label && <span>{label}</span>}<strong>{title}</strong></button>;
}

function toFilter(project: Project) {
  if (project.category === "Moving Image") return "MOVING IMAGE";
  if (project.category === "Cross-media" || project.category === "Exhibition") return "CROSS-MEDIA";
  if (project.category === "Curation") return "CURATION";
  if (project.category === "Music" || project.category === "Theatre") return "MUSIC";
  if (project.category === "Live") return "LIVE";
  return "CROSS-MEDIA";
}

function selectedLayout(slug: string) {
  const layouts: Record<string, string> = {
    "cyberspace": "layout-square-lead",
    "bug-party": "layout-bug-release",
    "role-model": "layout-wide-image",
    "fancy-a-bite": "layout-text-compact",
    "two-dreadful-children-unipre": "layout-release-offset",
    "no-idea": "layout-practice-text",
    "openband-openscore": "layout-open-title",
    "untitled-land": "layout-small-image",
    "paradise-dream-2": "layout-quiet-index"
  };
  return layouts[slug] ?? "layout-small-image";
}

function showSelectedMedia(slug: string) {
  return !["fancy-a-bite", "no-idea", "paradise-dream-2"].includes(slug);
}

function nextProjectFor(slug: string) {
  const visibleProjects = selectedWorks.filter((project) => project.verificationStatus !== "needs-review");
  const index = visibleProjects.findIndex((project) => project.slug === slug);
  const requestedNext = getProject(slug)?.nextProjectSlug;
  const next = (requestedNext && getProject(requestedNext))
    || visibleProjects[index >= 0 ? (index + 1) % visibleProjects.length : 0];
  const title = next.slug === "cctv-selected-broadcast-work"
    ? "CCTV / SELECTED BROADCAST WORK"
    : next.slug === "cyberspace" || next.slug === "bug-party"
    ? "CYBERSPACE / BUG PARTY"
    : next.title.toUpperCase();
  return { title, path: releaseDetailPath(next) };
}
