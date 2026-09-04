import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  archiveFilters,
  archiveProjects,
  featuredMusicReleases,
  getProject,
  kitRecordsReleaseLinks,
  kitRecordsReleaseNote,
  musicPlatformLinks,
  otherMusicReleases,
  projects,
  scoringMovingImageProjects,
  selectedWorks,
  type Project
} from "./content/projects";
import { getNoIdeaEvent, latestNoIdeaEvent, noIdeaEvents, type NoIdeaEvent } from "./content/noIdeaEvents";
import { djPosterArchive, earlierPerformances, livePlatformLinks, selectedLiveEvents, type DjPosterArchiveItem, type LiveEvent, type LiveMedia } from "./content/liveEvents";
import { noIdeaProject, openbandProject, practiceProjects, type PracticeProject, type PosterArchiveSlot, type RadioArchiveSlot, type WorkshopEntry } from "./content/practiceProjects";
import { aboutPressItems, epkPressItems, homePressItems, verifiedPressItems, type PressItem } from "./content/press";
import "./styles.css";

const navItems = ["WORK", "MUSIC", "LIVE", "PRACTICE", "PRESS", "ABOUT", "EPK"];

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

  const page = path.startsWith("/work/cyberspace-bug-party") || path.startsWith("/work/cyberspace") ? (
    <MusicReleasePage slug="cyberspace" navigate={navigate} />
  ) : path.startsWith("/work/bug-party") ? (
    <MusicReleasePage slug="bug-party" navigate={navigate} />
  ) : path.startsWith("/work/role-model") ? (
    <RoleModelPage navigate={navigate} />
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
    <LivePage navigate={navigate} />
  ) : path.startsWith("/practice") ? (
    <PracticePage navigate={navigate} />
  ) : path.startsWith("/press-radio") ? (
    <PressRadioPage />
  ) : path.startsWith("/about") ? (
    <AboutPage navigate={navigate} />
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
  WORK: "/work",
  MUSIC: "/music",
  LIVE: "/live",
  PRACTICE: "/practice",
  PRESS: "/press-radio",
  ABOUT: "/about",
  EPK: "/epk"
};

function activeNav(path: string) {
  const match = navItems.find((item) => path.startsWith(navPath[item]));
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
        {active && (
          <button className="home-nav-link" onClick={() => navigate("/")}>
            HOME
          </button>
        )}
      </nav>
    </header>
  );
}

function HomePage({ navigate }: { navigate: (path: string) => void }) {
  const featuredReleases = [getProject("cyberspace")!, getProject("bug-party")!];
  const roleModel = getProject("role-model")!;
  const latestLiveEvent = selectedLiveEvents[0];
  const quietusPress = homePressItems.find((item) => item.id === "quietus-spools-out-july")!;
  const contactLinks = [
    musicPlatformLinks.find((link) => link.label === "BANDCAMP")!,
    musicPlatformLinks.find((link) => link.label === "SOUNDCLOUD")!,
    livePlatformLinks.find((link) => link.label === "MIXCLOUD")!
  ];

  return (
    <main className="home-page">
      <PageAccentMarks variant="home" />
      <section className="hero plan-b-hero flow-section" data-testid="home-hero">
        <div className="section-kicker">HOME / HERO</div>
        <div className="hero-copy">
          <h1 className="plan-b-title" data-title="SHEN AO">SHEN AO</h1>
          <p className="identity">COMPOSER / PRODUCER / SOUND ARTIST</p>
          <p className="short-copy">Electronic music, composition and sound practice across moving image, performance and collaborative projects.</p>
          <p className="mono-place">LONDON</p>
        </div>
        <div className="plan-b-hero-marks">
          <img className="hero-monster hero-monster-primary" src={assetUrl("/assets/plan-b/monster-pink.png")} alt="Hand-drawn pink character illustration" />
          <img className="hero-pixel-play" src={assetUrl("/assets/plan-b/pixel-play.png")} alt="Pixel play marker illustration" />
          <img className="hero-doodle-ring" src={assetUrl("/assets/plan-b/doodle-blue-ring.png")} alt="" />
          <span className="hero-bit hero-bit-b">PLAY?</span>
        </div>
      </section>

      <section className="feature feature-music plan-b-music flow-section" data-testid="home-featured-music">
        <div className="section-kicker">FEATURED WORK / MUSIC</div>
        <div className="featured-releases">
          {featuredReleases.map((release, index) => (
            <article className={`featured-release featured-release-${index + 1} plan-b-release plan-b-release-${release.slug}`} key={release.slug}>
              <div className="plan-b-release-art">
                <img src={assetUrl(release.artwork!)} alt={`${release.title} album artwork`} />
                {release.slug === "cyberspace" && <img className="release-pixel-progress" src={assetUrl("/assets/plan-b/pixel-progress.png")} alt="" />}
                {release.slug === "bug-party" && <img className="release-blue-arrow" src={assetUrl("/assets/plan-b/tape-blue-arrow.png")} alt="" />}
              </div>
              <div className="plan-b-release-copy">
                {release.slug === "bug-party" && <span className="release-badge">LEFT ON DESK</span>}
                <h2>{release.title.toUpperCase()}</h2>
                <MetaLines lines={[release.label, "2026"]} />
                <ExternalLink className="listen-link" href={homeListenLink(release)}>LISTEN</ExternalLink>
                <button className="text-arrow" onClick={() => navigate(`/work/${release.slug}`)}>VIEW PROJECT</button>
              </div>
            </article>
          ))}
        </div>
        <button className="home-route-link home-more-music" onClick={() => navigate("/music")}>MORE MUSIC →</button>
      </section>

      <section className="feature feature-film home-role-model flow-section" data-testid="home-role-model">
        <div className="section-kicker">SELECTED WORK / MOVING IMAGE</div>
        <div className="feature-text">
          <h2>ROLE MODEL</h2>
          <MetaLines lines={[roleModel.year, "FILM", "SCORE / MIX"]} />
          <p>A moving-image work with Hongxuan Wang, shaped by a distorted-piano score and an unstable sense of memory.</p>
          <div className="mini-meta"><span>PHOTO</span><strong>{roleModel.photographyCredit}</strong></div>
          <button className="text-arrow" onClick={() => navigate("/work/role-model")}>VIEW PROJECT</button>
          <button className="home-route-link" onClick={() => navigate("/work")}>MORE WORK →</button>
        </div>
        <img className="role-model-still role-model-still-home" src={assetUrl(roleModel.images![0].src)} alt={roleModel.images![0].alt} />
      </section>

      <section className="live-preview home-live-section flow-section" data-testid="home-live">
        <div>
          <div className="section-kicker">LIVE</div>
          <h2>LIVE</h2>
        </div>
        <article className="home-live-event">
          <MediaPlaceholder title="LIVE" label="LIVE PHOTO" variant="landscape" />
          <div>
            <h3>{latestLiveEvent.displayDate}</h3>
            <MetaLines lines={[`${latestLiveEvent.venue} / ${latestLiveEvent.city}`, latestLiveEvent.billing]} />
            <button className="home-route-link" onClick={() => navigate("/live")}>ALL LIVE →</button>
          </div>
        </article>
      </section>

      <section className="practice-projects home-practice-section" data-testid="home-practice">
        <article>
          <img className="practice-poster-preview" src={assetUrl(noIdeaProject.posterArchive![0].image!)} alt="Live With No Idea event poster." />
          <h2>{noIdeaProject.title}</h2>
          <MetaLines lines={[noIdeaProject.heading]} />
        </article>
        <article>
          <MediaPlaceholder title={openbandProject.title} label="WORKSHOP MATERIAL" variant="landscape" />
          <h2>{openbandProject.title}</h2>
          <MetaLines lines={[openbandProject.heading]} />
        </article>
        <button className="home-route-link" onClick={() => navigate("/practice")}>VIEW PRACTICE →</button>
      </section>

      <section className="press-radio-preview home-press-section" data-testid="home-press">
        <div className="section-kicker">PRESS</div>
        <h2>THE QUIETUS / {quietusPress.year}</h2>
        {quietusPress.quote && <blockquote>“{quietusPress.quote}”</blockquote>}
        <button className="home-route-link" onClick={() => navigate("/press-radio")}>PRESS / RADIO →</button>
      </section>

      <section className="collaboration home-about-contact" data-testid="home-about-contact">
        <h2>ABOUT / CONTACT</h2>
        <div>
          <p>London-based composer, producer and sound artist working across electronic music, moving image, live performance and collaborative projects.</p>
          <div className="home-contact-actions">
            <button className="home-route-link" onClick={() => navigate("/about")}>ABOUT →</button>
            <button className="home-route-link" onClick={() => navigate("/epk")}>EPK →</button>
          </div>
          <a className="home-email-link" href="mailto:lerezero@gmail.com">lerezero@gmail.com</a>
          <div className="home-platform-links">
            {contactLinks.map((link) => <ExternalLink key={link.url} href={link.url} className="music-platform-link">{link.label}</ExternalLink>)}
          </div>
        </div>
      </section>
    </main>
  );
}

function homeListenLink(project: Project) {
  return project.externalLinks?.find((link) => link.label === "NetEase Music")?.url ?? project.externalLinks?.[0]?.url ?? "https://shenao.bandcamp.com/";
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
  return (
    <main className="route-page music-page">
      <PageAccentMarks variant="music" />
      <PageIntro kicker="MUSIC / RELEASES" title="MUSIC">
        Electronic music, composition and production shaped through improvisation, unconventional harmony and the environments around him.
      </PageIntro>
      <section className="music-release-section music-featured-section">
        <div className="section-kicker">MUSIC / RELEASES</div>
        <h2>FEATURED RELEASES</h2>
        <div className="music-featured-grid">
          {featuredMusicReleases.map((project) => (
            <article className={`music-featured-release music-release-${project.slug}`} key={project.slug}>
              <ReleaseArtwork project={project} />
              <div className="music-release-copy">
                <h3>{(project.displayTitle ?? project.title).toUpperCase()}</h3>
                <MetaLines lines={[project.year, project.label, project.subtype]} />
                <div className="link-row">
                  {project.externalLinks?.map((link) => (
                    <ExternalLink key={link.url} href={link.url}>{`${link.label.toUpperCase()} ↗`}</ExternalLink>
                  ))}
                  <button className="text-arrow" onClick={() => navigate(`/work/${project.slug}`)}>VIEW PROJECT</button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <article className="kit-records-note">
          <div className="section-kicker">2026 / KIT RECORDS</div>
          <p>{kitRecordsReleaseNote}</p>
          <div className="music-note-links">
            {kitRecordsReleaseLinks.map((link) => (
              <ExternalLink key={link.url} href={link.url}>{`${link.label} ↗`}</ExternalLink>
            ))}
          </div>
        </article>
      </section>
      <section className="music-release-section other-release-section">
        <div className="section-kicker">MUSIC / ARCHIVE</div>
        <h2>OTHER RELEASES</h2>
        <div className="other-release-grid">
          {otherMusicReleases.map((project) => (
            <article className={`other-release-card music-release-${project.slug}`} key={project.slug}>
              <ReleaseArtwork project={project} />
              <div className="music-release-copy">
                <h3>{project.displayTitle ?? project.title}</h3>
                <MetaLines lines={[project.year, project.label, project.subtype]} />
                <div className="link-row">
                  {project.externalLinks?.map((link) => (
                    <ExternalLink key={link.url} href={link.url}>{`${link.label.toUpperCase()} ↗`}</ExternalLink>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="music-platform-row" aria-label="Music platforms">
        {musicPlatformLinks.map((link) => (
          <ExternalLink key={link.url} href={link.url} className="music-platform-link">{link.label}</ExternalLink>
        ))}
      </section>
    </main>
  );
}

function ReleaseArtwork({ project }: { project: Project }) {
  const title = project.displayTitle ?? project.title;
  return project.artwork ? (
    <img className="release-cover" src={assetUrl(project.artwork)} alt={`${project.title} album artwork`} />
  ) : (
    <MediaPlaceholder title={title} label="ALBUM ARTWORK" variant="square" />
  );
}

function LivePage({ navigate }: { navigate: (path: string) => void }) {
  const event = latestNoIdeaEvent;
  const earlierPerformance = earlierPerformances[0];
  return (
    <main className="route-page live-page">
      <PageAccentMarks variant="live" />
      <PageIntro kicker="LIVE / PERFORMANCE" title="LIVE">
        A recording captures only one aspect of a performance. The live work is different every time.
      </PageIntro>
      <MetaLines lines={["LIVE ELECTRONICS", "IMPROVISATION", "DJ SETS", "COLLABORATIVE PERFORMANCE"]} />
      <section className="selected-live-section">
        <div className="section-kicker">LIVE / 2026</div>
        <h2>SELECTED PERFORMANCES / 2026</h2>
        <div className="selected-live-list">
          {selectedLiveEvents.map((liveEvent) => <SelectedLiveEvent event={liveEvent} key={liveEvent.id} />)}
        </div>
      </section>
      <section className="dj-teendrum-section">
        <div className="section-kicker">LIVE / DJ</div>
        <h2>DJ / TEENDRUM</h2>
        <div className="dj-teendrum-copy">
          <MetaLines lines={["DJ", "TEENDRUM", "ARCHIVE"]} />
          <div className="link-row">
            {livePlatformLinks.map((link) => <ExternalLink key={link.url} href={link.url}>{`${link.label} ↗`}</ExternalLink>)}
          </div>
        </div>
        <section className="dj-poster-archive">
          <h3>DJ POSTER ARCHIVE</h3>
          <div>
            {djPosterArchive.map((poster) => <DjPosterSlot poster={poster} key={poster.id} />)}
          </div>
        </section>
      </section>
      <section className="related-practice-reference">
        <div className="section-kicker">RELATED PRACTICE</div>
        <h2>LIVE WITH NO IDEA</h2>
        <MetaLines lines={[`${event.displayDate} · ${event.venue} · ${event.city}`, event.roles.join(" + ")]} />
        <button className="text-arrow" onClick={() => navigate(`/practice/no-idea/${event.slug}`)}>VIEW EVENT →</button>
      </section>
      <section className="earlier-performance-section">
        <div className="section-kicker">LIVE / ARCHIVE</div>
        <h2>EARLIER PERFORMANCE</h2>
        <article className="earlier-performance">
          <LiveMediaSlot media={earlierPerformance.livePhoto} label="LIVE PHOTO" title={earlierPerformance.title ?? "Earlier performance"} kind="photo" />
          <div>
            <MetaLines lines={[earlierPerformance.year]} />
            <h3>{earlierPerformance.title?.toUpperCase()}</h3>
            <p>{earlierPerformance.venue.toUpperCase()}</p>
            {earlierPerformance.localVenueName && <p className="secondary-language">{earlierPerformance.localVenueName}</p>}
            {earlierPerformance.externalLinks?.map((link) => <ExternalLink key={link.url} href={link.url}>{`${link.label.toUpperCase()} →`}</ExternalLink>)}
          </div>
        </article>
      </section>
    </main>
  );
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

function AboutPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <main className="route-page about-page">
      <PageAccentMarks variant="about" />
      <PageIntro kicker="ABOUT / BIO" title="ABOUT" testId="about-bio">
        Shen Ao is a London-based composer, producer and sound artist working across electronic music, moving image, live performance and event-making. His practice includes independent releases, film and theatre composition, live electronics, improvisation, DJ performance and collaborative projects.
      </PageIntro>
      <section className="about-layout" data-testid="about-portrait">
        <div className="about-copy about-short-bio">
          <p className="identity">COMPOSER / PRODUCER / SOUND ARTIST</p>
          <p>His recent work includes releases with Kit Records and projects spanning moving image, theatre, broadcast and interdisciplinary performance. Alongside his music-making, he has developed independent event, radio and improvisation practices through projects including No Idea and Openband / Openscore.</p>
        </div>
        <img className="artist-portrait artist-portrait-about" src={assetUrl("/assets/portrait/shen-ao-childhood.avif")} alt="Childhood portrait of Shen Ao." />
      </section>
      <section className="about-statement" data-testid="about-statement">
        <div className="about-copy">
          <h2>ARTIST STATEMENT</h2>
          <p className="statement-lead">Keyboard improvisation is central to Shen Ao's working method. It is where different musical languages, passing environments and unconventional harmonic movement are absorbed, tested and reorganised.</p>
          <p>Electronic and minimalist music meet the city in his work as material for improvisation and production, rather than as separate references to be explained.</p>
          <p>For Shen, experimentation is a working method, not a genre. A piece may begin with a clear imagined structure; over time, control loosens into instability, accident and a degree of loss of control.</p>
          <p>Live performance keeps that instability open. A recording preserves one aspect of an event; each performance is changed by the room, the performers and the moment.</p>
          <p>Event-making and music-making remain parallel practices: different in origin and function, but connected by listening, collaboration and the pleasure of completing something with other people.</p>
        </div>
      </section>
      <CvSections />
      <PressSection navigate={navigate} />
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

function MusicReleasePage({ slug, navigate }: { slug: "cyberspace" | "bug-party"; navigate: (path: string) => void }) {
  const project = getProject(slug)!;
  const nextProject = slug === "cyberspace" ? { title: "BUG PARTY", path: "/work/bug-party" } : { title: "ROLE MODEL", path: "/work/role-model" };
  return (
    <ProjectShell kicker="PROJECT / MUSIC" title={project.title.toUpperCase()} project={project}>
      <div className="project-layout project-layout-loose">
        <img className="project-art album-cover" src={assetUrl(project.artwork!)} alt={`${project.title} album artwork`} />
        <div className="project-meta">
          <MetaLines lines={[project.label, "ALBUM / RELEASE"]} />
          <ExternalLink href="https://shenao.bandcamp.com/">LISTEN</ExternalLink>
        </div>
      </div>
      <PlaceholderSequence labels={["MEDIA PLACEHOLDER", "ADDITIONAL MEDIA", "PROJECT IMAGE"]} />
      <NextProject title={nextProject.title} onClick={() => navigate(nextProject.path)} />
    </ProjectShell>
  );
}

function RoleModelPage({ navigate }: { navigate: (path: string) => void }) {
  const project = getProject("role-model")!;
  const [heroImage, ...galleryImages] = project.images!;
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
      <NextProject title="CYBERSPACE" onClick={() => navigate("/work/cyberspace")} />
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
  return (
    <ProjectShell kicker={`PROJECT / ${project.category.toUpperCase()}`} title={project.title.toUpperCase()} project={project}>
      <div className={`project-layout project-layout-loose ${isPractice ? "practice-detail-layout" : "structured-detail-layout"}`}>
        {project.artwork ? (
          <img className="project-art album-cover" src={assetUrl(project.artwork)} alt={`${project.title} album artwork`} />
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
            {project.externalLinks?.map((link) => <ExternalLink key={link.url} href={link.url}>{link.label}</ExternalLink>)}
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
      {gallerySlots.length > 0 ? (
        <section className={`placeholder-sequence detail-media-grid detail-media-${project.slug}`}>
          {gallerySlots.map((slot, index) => (
            <MediaPlaceholder key={`${slot.label}-${index}`} title={project.title.toUpperCase()} label={slot.label} variant={slot.variant} />
          ))}
        </section>
      ) : (
        <PlaceholderSequence labels={project.category === "Music" ? ["MEDIA PLACEHOLDER", "ADDITIONAL MEDIA", "PROJECT IMAGE"] : ["MEDIA PLACEHOLDER", "ADDITIONAL MEDIA", "PROJECT IMAGE"]} />
      )}
      {project.selectedCases && <SelectedCases cases={project.selectedCases} />}
      {project.relatedTitles && <ArchiveList titles={project.relatedTitles} />}
      {project.relatedWorks && <RelatedWorks works={project.relatedWorks} />}
      {project.press && <KnownPress press={project.press} />}
      <NextProject title={nextProjectFor(project.slug).title} onClick={() => navigate(nextProjectFor(project.slug).path)} />
    </ProjectShell>
  );
}

function PageIntro({ kicker, title, children, testId }: { kicker: string; title: string; children: ReactNode; testId?: string }) {
  return (
    <section className="page-intro" data-testid={testId}>
      <div className="section-kicker">{kicker}</div>
      <h1>{title}</h1>
      <p>{children}</p>
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

function SelectedCases({ cases }: { cases: NonNullable<Project["selectedCases"]> }) {
  return (
    <section className="selected-cases">
      <h2>SELECTED BROADCAST WORK</h2>
      <div className="selected-case-grid">
        {cases.map((item) => (
          <article className="selected-case" key={item.url}>
            {item.media && <MediaPlaceholder title="CCTV-13" label={item.media.label} variant={item.media.variant} />}
            <div>
              <ExternalLink href={item.url}>{item.title} ↗</ExternalLink>
              {item.description && <p>{item.description}</p>}
            </div>
          </article>
        ))}
      </div>
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

function RelatedWorks({ works }: { works: NonNullable<Project["relatedWorks"]> }) {
  return (
    <section className="related-work-section">
      <div className="section-kicker">RELATED WORK</div>
      {works.map((work) => (
        <article className="related-work-entry" key={work.title}>
          {work.media && <MediaPlaceholder title="MEDIA" label={work.media.label} variant={work.media.variant} />}
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

function ExternalLink({ href, children, className = "text-arrow" }: { href: string; children: React.ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a>;
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
  const next = visibleProjects[index >= 0 ? (index + 1) % visibleProjects.length : 0];
  return { title: next.title.toUpperCase(), path: `/work/${next.slug}` };
}
