import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  featuredMusicReleases,
  getProject,
  moreCommissionedProjects,
  musicScoringProjects,
  otherMusicReleases,
  type ProjectLink,
  kitRecordsReleaseNote,
  type Project
} from "./content/projects";
import { latestNoIdeaEvent } from "./content/noIdeaEvents";
import { earlierPerformances, livePlatformLinks, pianoKeyboardGroups, selectedLiveEvents, teendrumImages, type LiveEvent } from "./content/liveEvents";
import { noIdeaProject, openbandProject, type DocumentationGroup, type EventPosterGroup, type PracticeProject } from "./content/practiceProjects";
import { homePressItems, verifiedPressItems, type PressItem } from "./content/press";
import "./styles.css";

const navItems = ["HOME", "MUSIC", "LIVE", "ABOUT"];
const accentColors = ["var(--pink)", "var(--green)", "var(--blue)", "var(--yellow)"] as const;
const accentTopBands = [13, 24, 38, 53, 68, 82, 91];
const mobileAccentTopBands = [12, 28, 49, 69, 88];

type PageAccent = {
  color: (typeof accentColors)[number];
  width: number;
  height: number;
  top: string;
  left: string;
  right: string;
  rotation: number;
  mobileTop: string;
  mobileLeft: string;
  mobileRight: string;
};

type AccentStyle = CSSProperties & Record<`--accent-${string}`, string>;

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

const legacyRedirects = [
  { from: "/work", to: "/music", exact: true },
  { from: "/practice", to: "/live", exact: true },
  { from: "/press-radio", to: "/", exact: true },
  { from: "/epk", to: "/about", exact: true },
  { from: "/work/cyberspace", to: "/work/cyberspace-bug-party", exact: true },
  { from: "/work/bug-party", to: "/work/cyberspace-bug-party", exact: true },
  { from: "/practice/no-idea", to: "/work/no-idea", exact: false }
] as const;

function redirectFor(path: string) {
  return legacyRedirects.find((redirect) => redirect.exact ? path === redirect.from : path === redirect.from || path.startsWith(`${redirect.from}/`))?.to;
}

function usePath(initialPath?: string) {
  const initialAppPath = toAppPath(initialPath ?? window.location.pathname);
  const initialRedirect = redirectFor(initialAppPath);
  if (!initialPath && initialRedirect && window.location.pathname !== toBrowserPath(initialRedirect)) {
    window.history.replaceState({}, "", toBrowserPath(initialRedirect));
  }
  const [path, setPath] = useState(initialRedirect ?? initialAppPath);

  useEffect(() => {
    if (initialPath) {
      return undefined;
    }

    const handlePopState = () => setPath(toAppPath(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [initialPath]);

  const navigate = (nextPath: string) => {
    const redirectedPath = redirectFor(toAppPath(nextPath));
    const targetPath = redirectedPath ?? nextPath;
    if (!initialPath) {
      window.history[redirectedPath ? "replaceState" : "pushState"]({}, "", toBrowserPath(targetPath));
    }
    setPath(targetPath);
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
  ) : path.startsWith("/work/") ? (
    <ProjectDetailPage slug={path.replace(/^\/work\//, "").split("/")[0]} navigate={navigate} />
  ) : path.startsWith("/music") ? (
    <MusicPage navigate={navigate} />
  ) : path.startsWith("/live") ? (
    <LivePage navigate={navigate} />
  ) : path.startsWith("/about") ? (
    <AboutPage />
  ) : (
    <HomePage navigate={navigate} />
  );

  return (
    <div className="site-shell">
      <Header active={activeNav(path)} navigate={navigate} />
      <PageAccents pathname={path} />
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

function PageAccents({ pathname }: { pathname: string }) {
  const accents = useMemo(() => makePageAccents(pathname), [pathname]);

  return (
    <div className="page-accents" aria-hidden="true">
      {accents.map((accent, index) => (
        <span
          className="page-accent-mark"
          key={`${pathname}-${index}`}
          style={{
            "--accent-color": accent.color,
            "--accent-width": `${accent.width}px`,
            "--accent-height": `${accent.height}px`,
            "--accent-top": accent.top,
            "--accent-left": accent.left,
            "--accent-right": accent.right,
            "--accent-rotation": `${accent.rotation}deg`,
            "--accent-mobile-top": accent.mobileTop,
            "--accent-mobile-left": accent.mobileLeft,
            "--accent-mobile-right": accent.mobileRight
          } as AccentStyle}
        />
      ))}
    </div>
  );
}

function makePageAccents(pathname: string): PageAccent[] {
  const seed = hashString(pathname || "/");
  const count = 3 + (seed % 2);

  return Array.from({ length: count }, (_, index) => {
    const value = hashString(`${pathname}:${index}`);
    const side = (value + index) % 2 === 0 ? "left" : "right";
    const mobileSide = (value + index + 1) % 2 === 0 ? "left" : "right";
    const width = index === 1 && value % 3 === 0 ? 12 + (value % 5) : 24 + (value % 39);
    const heightOptions = width < 20 ? [10, 12, 14] : [3, 5, 7, 8];
    const height = heightOptions[(value >> 3) % heightOptions.length];
    const edge = `${1 + ((value >> 6) % 6)}%`;
    const mobileEdge = `${1 + ((value >> 8) % 5)}%`;

    return {
      color: accentColors[(value + index) % accentColors.length],
      width,
      height,
      top: `${accentTopBands[(value + index * 2) % accentTopBands.length]}%`,
      left: side === "left" ? edge : "auto",
      right: side === "right" ? edge : "auto",
      rotation: ((value >> 10) % 15) - 7,
      mobileTop: `${mobileAccentTopBands[(value + index * 2) % mobileAccentTopBands.length]}%`,
      mobileLeft: mobileSide === "left" ? mobileEdge : "auto",
      mobileRight: mobileSide === "right" ? mobileEdge : "auto"
    };
  });
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
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
                <ProjectImageLink path={releaseDetailPath(release)} label={`View ${release.title} project details`} navigate={navigate}>
                  <img src={assetUrl(release.artwork!)} alt={`${release.title} album artwork`} />
                </ProjectImageLink>
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
        <SectionHeadingRow title="RELATED LIVE" actionLabel="ALL LIVE" onAction={() => navigate("/live")} />
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
        <SectionHeadingRow title="PRESS" />
        <div className="home-press-index">
          {releasePress.map((item) => <HomePressLine item={item} key={item.id} />)}
        </div>
      </section>
    </main>
  );
}

function SectionHeadingRow({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="section-heading-row">
      <h2>{title}</h2>
      {actionLabel && <button className="text-arrow" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}

function homeListenLink(project: Project) {
  return project.externalLinks?.find((link) => /bandcamp/i.test(`${link.label} ${link.url}`))?.url
    ?? project.externalLinks?.find((link) => isListenLink(link))?.url
    ?? "https://shenao.bandcamp.com/";
}

function isKitRecordsReleaseRoute(path: string) {
  return path.startsWith("/work/cyberspace-bug-party");
}

function releaseDetailPath(project: Project) {
  return project.slug === "cyberspace" || project.slug === "bug-party" ? "/work/cyberspace-bug-party" : `/work/${project.slug}`;
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
        <h2>SELECTED WORKS</h2>
        <div className="production-scoring-grid">
          {musicScoringProjects.map((project) => <MusicIndexItem project={project} navigate={navigate} variant="archive" key={project.slug} />)}
        </div>
      </section>
      <section className="music-release-section music-more-commissioned-section" data-testid="music-more-commissioned">
        <h2>ADDITIONAL WORKS</h2>
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
  const candidateDetailPath = releaseDetailPath(project);
  const detailPath = musicDetailProjectEntries().some((entry) => entry.path === candidateDetailPath)
    ? candidateDetailPath
    : undefined;
  return (
    <article className={`music-index-item music-index-item-${variant} music-release-${project.slug} ${hasMedia ? "has-media" : "no-media"}`} data-testid={`music-index-item-${project.slug}`}>
      {showArtwork && <ReleaseArtwork project={project} showPlaceholder={false} detailPath={detailPath} navigate={navigate} />}
      <div className="music-release-copy">
        <h3>{title}</h3>
        <MetaLines lines={musicIndexMetaLines(project, variant)} />
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

function musicIndexMetaLines(project: Project, variant: "featured" | "secondary" | "archive" | "commissioned-archive-image" | "commissioned-archive-text") {
  if (variant === "secondary") {
    return [project.year, project.subtype];
  }

  if (variant === "archive" || variant === "commissioned-archive-image" || variant === "commissioned-archive-text") {
    return [project.year, project.workRoleLabel ?? project.subtype ?? project.category];
  }

  return [project.year, project.subtype, project.workRoleLabel, project.role?.join(" / "), project.label];
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

function ReleaseArtwork({ project, showPlaceholder = true, detailPath, navigate }: { project: Project; showPlaceholder?: boolean; detailPath?: string; navigate?: (path: string) => void }) {
  const title = project.displayTitle ?? project.title;
  let artwork: ReactNode = null;

  if (project.artwork) {
    artwork = <img className="release-cover" src={assetUrl(project.artwork)} alt={`${project.title} album artwork`} />;
  } else if (project.images?.[0]) {
    artwork = <img className="release-cover music-index-still" src={assetUrl(project.images[0].src)} alt={project.images[0].alt} />;
  }

  if (!artwork) {
    return showPlaceholder ? <MediaPlaceholder title={title} label="ALBUM ARTWORK" variant="square" /> : null;
  }

  return detailPath && navigate ? (
    <ProjectImageLink path={detailPath} label={`View ${project.title} project details`} navigate={navigate}>
      {artwork}
    </ProjectImageLink>
  ) : artwork;
}

function ProjectImageLink({ path, label, navigate, children }: { path: string; label: string; navigate: (path: string) => void; children: ReactNode }) {
  return (
    <a
      className="project-image-link"
      href={toBrowserPath(path)}
      aria-label={label}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        event.preventDefault();
        navigate(path);
      }}
    >
      {children}
    </a>
  );
}

function LivePage({ navigate }: { navigate: (path: string) => void }) {
  const originalMusicEvents = [...selectedLiveEvents].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const soloConcert = earlierPerformances.find((event) => event.id === "solo-concert-2018");

  return (
    <main className="route-page live-page">
      <PageIntro title="LIVE" />

      <section className="live-section curation-community-section" data-testid="live-curation-community">
        <h2>CURATION / COMMUNITY</h2>
        <div className="curation-project-list">
          {[noIdeaProject, openbandProject].map((project) => (
            <LivePracticeProjectEntry project={project} navigate={navigate} key={project.slug} />
          ))}
        </div>
      </section>

      <section className="live-section original-live-section" data-testid="live-original-music">
        <h2>ORIGINAL MUSIC LIVE</h2>
        <div className="original-live-list">
          {originalMusicEvents.map((event) => (
            <OriginalLiveRow event={event} key={event.id} />
          ))}
        </div>
      </section>

      <section className="live-section teendrum-live-section" data-testid="live-teendrum">
        <h2>DJ / TEENDRUM</h2>
        <div className="teendrum-live-layout">
          <div className="teendrum-live-copy">
            <strong>TEENDRUM</strong>
            <span>DJ</span>
            <span>ELECTRO / AMBIENT / IDM / BREAKS / LEFT-FIELD</span>
            <div className="link-row">
              {livePlatformLinks.map((link) => <ExternalLink className="text-arrow text-arrow-explicit" key={link.url} href={link.url}>{link.label} ↗</ExternalLink>)}
            </div>
          </div>
          <div className="teendrum-visual-archive">
            {teendrumImages.map((image) => (
              <img src={assetUrl(image.path)} alt={image.alt} data-testid="teendrum-archive-image" key={image.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="live-section piano-keyboard-section" data-testid="live-piano-keyboard">
        <h2>PIANO / KEYBOARD</h2>
        <div className="piano-keyboard-layout">
          {soloConcert && (
            <article className="piano-history-entry" data-testid="live-solo-concert-2018">
              <h3>2018 SOLO CONCERT</h3>
              <div className="piano-solo-gallery">
                <img src={assetUrl("/assets/live/piano-keyboard/solo-concert-2018-poster-no-black-border.jpeg")} alt="2018 Solo Concert poster." data-testid="piano-solo-concert-image" />
                <img src={assetUrl("/assets/live/piano-keyboard/solo-concert-2018-stage-wide-no-black-border.jpeg")} alt="2018 Solo Concert live performance." data-testid="piano-solo-concert-image" />
                <img src={assetUrl("/assets/live/piano-keyboard/solo-concert-2018-keyboard-performance-no-black-border.jpeg")} alt="2018 Solo Concert live performance." data-testid="piano-solo-concert-image" />
              </div>
              <div className="piano-history-meta">
                <span>{soloConcert.year}</span>
                <strong>{soloConcert.venue.toUpperCase()}</strong>
                <span>{(soloConcert.title ?? soloConcert.type).toUpperCase()}</span>
                {soloConcert.externalLinks?.[0] && <ExternalLink className="text-arrow text-arrow-explicit" href={soloConcert.externalLinks[0].url}>WATCH ↗</ExternalLink>}
              </div>
            </article>
          )}
          <div className="piano-keyboard-groups">
            {pianoKeyboardGroups.map((group) => (
              <section className="piano-keyboard-group" data-testid={`piano-group-${group.id}`} key={group.id}>
                <h3>{group.title}</h3>
                <div className="piano-keyboard-gallery">
                  {group.images.map((image) => (
                    <img src={assetUrl(image.path)} alt={image.alt} data-testid="piano-archive-image" key={image.id} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function OriginalLiveRow({ event }: { event: LiveEvent }) {
  const media = getLiveArchiveMedia(event);
  const link = event.externalLinks?.[0];

  return (
    <article className="original-live-row" data-testid={`original-live-row-${event.id}`}>
      {media && <img className="original-live-media" src={assetUrl(media.path)} alt={media.alt} />}
      <span data-testid="live-date">{event.displayDate}</span>
      <strong>{formatVenue(event)}</strong>
      <span>{event.billing?.toUpperCase()}</span>
      {link && <ExternalLink className="text-arrow text-arrow-explicit" href={link.url}>{link.label}</ExternalLink>}
    </article>
  );
}

function LivePracticeProjectEntry({ project, navigate }: { project: PracticeProject; navigate: (path: string) => void }) {
  const detailPath = liveDetailProjectEntries().find((entry) => entry.slug === project.slug)?.path;
  const previewImage = project.previewImage
    ? <img src={assetUrl(project.previewImage)} alt={`${project.title} project preview.`} />
    : null;

  return (
    <article className={`live-practice-project live-practice-project-${project.slug}`} data-testid={`live-practice-project-${project.slug}`}>
      {previewImage && detailPath
        ? <ProjectImageLink path={detailPath} label={`View ${project.title} project details`} navigate={navigate}>{previewImage}</ProjectImageLink>
        : previewImage}
      <div>
        <h3>{project.title}</h3>
        <MetaLines lines={[project.year, project.heading, project.location]} uppercase={false} />
        <p>{project.summary}</p>
        <button className="text-arrow" aria-label={`VIEW PROJECT → ${project.title}`} onClick={() => navigate(`/work/${project.slug}`)}>VIEW PROJECT</button>
      </div>
    </article>
  );
}

function getLiveArchiveMedia(event: LiveEvent) {
  const media = event.livePhoto?.path ? event.livePhoto : event.poster?.path ? event.poster : undefined;
  return media?.path ? { path: media.path, alt: `${event.displayDate ?? event.year ?? event.title ?? event.venue} ${event.type.toLowerCase()}` } : undefined;
}

function formatVenue(event: Pick<LiveEvent, "venue" | "city">) {
  return [event.venue, event.city].filter(Boolean).join(" / ").toUpperCase();
}

function AboutPage() {
  return (
    <main className="route-page about-page">
      <PageIntro title="ABOUT" testId="about-bio" />
      <section className="about-hero" data-testid="about-hero">
        <span className="about-hero-identity">MUSIC PRODUCER / COMPOSER & ARRANGER / EVENT ORGANISER</span>
        <img className="about-hero-image" src={assetUrl("/assets/about/shen-ao-hero.jpg")} alt="Shen Ao performing at a microphone." />
        <p>Shen Ao is a music producer, composer, arranger and pianist born in Tianjin, China and based in London. He also performs live DJ sets under the alias Teendrum.</p>
      </section>

      <section className="about-section about-profile-section" data-testid="about-profile">
        <p>Shen Ao specialises in brightly coloured electronic music with intricate structures and a strongly postmodern style. His works draw on progressive rock, free jazz, Baroque, glitch pop and chiptune, shaping a fragmented contemporary texture that moves between fluid delicacy and rough fury. His songwriting often uses irregular metres and polyrhythms, combining retro computer timbres with strongly narrative processing to depict a restless inner otherworld.</p>
      </section>

      <section className="about-section about-music-section" data-testid="about-music">
        <div className="about-section-copy">
          <h2>MUSIC</h2>
          <p>In 2026, his work was released by Kit Records, a representative independent avant-garde label in London, alongside a limited double-sided cassette. In July of the same year, the work was covered by The Quietus, a noted European electronic music magazine, and by Muito in Buenos Aires. With this album, he has performed alongside international musicians including Vic Bang, k means, Visit Me, Barreleye, YOTO and 4 Channels Club.</p>
        </div>
        <div className="about-image-pair about-music-images">
          <img className="about-image about-image-cassette" src={assetUrl("/assets/about/cyberspace-bug-party-cassette.jpeg")} alt="Cyberspace / Bug Party double-sided cassette photograph." />
          <img className="about-image about-image-live" src={assetUrl("/assets/live/portfolio/george-tavern-2026.jpeg")} alt="Shen Ao live performance at The George Tavern, London." />
        </div>
      </section>

      <section className="about-section about-scoring-section" data-testid="about-scoring">
        <img className="about-image about-image-fancy" src={assetUrl("/assets/portfolio-projects/fancy-a-bite-stage-projection.jpeg")} alt="Fancy A BITE? stage performance with blue projection." />
        <div className="about-section-copy">
          <h2>SCORING / CROSS-MEDIA</h2>
          <p>He often collaborates with artists from other fields on cross-media works, including music for film and television, exhibitions, theatre, games and advertising. Since 2020, he has produced music for more than 50 promotional packaging projects for China Central Television programmes, including Long Teng Hu Yue Zhong Guo Nian, Rui Tu Cheng Xiang Zhong Guo Nian, the Convention on Biological Diversity and Da Mei Bian Jiang Xing. In 2024, he worked with London's ENF Theatre on the soundtrack for Fancy A BITE?, which was performed at Camden People's Theatre.</p>
        </div>
        <img className="about-image about-image-role-model" src={assetUrl("/assets/role-model/DSC0944_1600px_sRGB.jpg")} alt="Role Model moving-image projection in a dark exhibition room." />
      </section>

      <section className="about-section about-dj-section" data-testid="about-dj-curation">
        <div className="about-section-copy">
          <h2>DJ / CURATION</h2>
          <p>Shen Ao is also a DJ and music-event curator, performing under the alias Teendrum. He has performed at music venues in China and London, including Zhao Dai, wigwam, Mo Xu You Factory and Taikang Art Museum in China, and Spanners, Shai Space, LOOSE.fm and helm in the UK. In 2024, he launched no idea, an ambient-music online radio and offline event series. The series quickly attracted attention within the field and invited musicians including Kirk Barley, Stella Z, Li Song, Pentu, Xi Chenchen, Louis Gardner and Sseq to perform.</p>
        </div>
        <div className="about-image-pair about-dj-images">
          <img className="about-image about-image-teendrum" src={assetUrl("/assets/live/teendrum/teendrum-baihui-live.jpeg")} alt="Baihui poster for DJ Teendrum." />
          <img className="about-image about-image-no-idea" src={assetUrl("/assets/practice/no-idea/no-idea-live-with-no-idea-poster.jpeg")} alt="Live With No Idea grey and white poster." />
        </div>
      </section>

      <section className="about-section about-community-section" data-testid="about-community-openband">
        <div className="about-section-copy">
          <h2>COMMUNITY / OPENBAND</h2>
          <p>Shen Ao continues to focus on the healthy development of music communities and founded OPENBAND, an improvisational music workshop. Based at fRUITYSPACE in Beijing, the workshop aims to promote communication and shared growth among local music practitioners. It has held around 20 monthly sessions, attracting about 500 music practitioners, and has promoted its workflow and underlying logic through offline presentations at City St George’s, University of London and Hypha HQ in London.</p>
        </div>
        <img className="about-image about-image-openband" src={assetUrl("/assets/practice/openband/openband-monthly-posters.jpeg")} alt="OPENBAND monthly offline activity poster grid." />
      </section>

      <section className="about-section about-closing-section" data-testid="about-closing">
        <h2>CLOSING STATEMENT</h2>
        <p>Through these interrelated projects, Shen Ao's work both inherits its own logic and attends to real society and community development, showing his understanding of musical structure, timbral design and shifts in a broader artistic environment.</p>
      </section>

      <section className="about-section about-contact-section" aria-label="About contact" data-testid="about-contact">
        <h2>CONTACT</h2>
        <a className="music-platform-link" href="mailto:lerezero@gmail.com">lerezero@gmail.com</a>
      </section>
    </main>
  );
}

function MusicReleasePage({ navigate }: { navigate: (path: string) => void }) {
  const releases = [getProject("cyberspace")!, getProject("bug-party")!];
  const project = releases[0];
  const releasePress = verifiedPressItems.filter((item) => item.id === "quietus-spools-out-july" || item.id === "muito-buy-music-club-27");
  const relatedLive = [...selectedLiveEvents].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const nextProject = nextMusicProjectFor("bug-party");

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

      {nextProject && <NextProject title={nextProject.title} onClick={() => navigate(nextProject.path)} />}
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
    <ExternalLink className="home-press-line release-press-line" href={item.url} ariaLabel={`${cta} ↗`}>
      <strong>{source}</strong>
      <span>{item.title}</span>
      <em>{displayRelatedProject(item.relatedProject)?.toUpperCase()}</em>
      <span className="release-press-cta">{cta} ↗</span>
    </ExternalLink>
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
  const nextProject = nextMusicProjectFor(project.slug);
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
      {nextProject && <NextProject title={nextProject.title} onClick={() => navigate(nextProject.path)} />}
    </ProjectShell>
  );
}

function FancyABitePage({ navigate }: { navigate: (path: string) => void }) {
  const project = getProject("fancy-a-bite")!;
  const [heroImage, ...galleryImages] = project.images!;
  const nextProject = nextMusicProjectFor(project.slug);

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
      {nextProject && <NextProject title={nextProject.title} onClick={() => navigate(nextProject.path)} />}
    </ProjectShell>
  );
}

function NoIdeaPage({ navigate }: { navigate: (path: string) => void }) {
  const project = getProject("no-idea")!;
  const event = latestNoIdeaEvent;
  const nextProject = nextLiveProjectFor(project.slug);
  const featuredImages = [event.heroImage, ...event.galleryImages.filter((_, index) => [0, 1, 3, 6].includes(index)).map((image) => image.src)];
  return (
    <ProjectShell kicker="PROJECT / CURATION" title={noIdeaProject.title} project={project}>
      <section className="no-idea-project-intro">
        <figure className="no-idea-hero-figure">
          <img src={assetUrl(noIdeaProject.previewImage!)} alt="Live With No Idea project poster." />
        </figure>
        <div className="no-idea-hero-copy">
          <MetaLines lines={[noIdeaProject.year, noIdeaProject.heading, noIdeaProject.location]} uppercase={false} />
          <p>{noIdeaProject.summary}</p>
          <div className="link-row">
            {noIdeaProject.links.map((link) => <ExternalLink key={link.url} href={link.url}>{link.label}</ExternalLink>)}
          </div>
          {noIdeaProject.instagramHandle && (
            <p className="practice-social">
              <a className="text-arrow no-idea-hero-social-link" href="https://www.instagram.com/noidea.radio/" target="_blank" rel="noreferrer">{noIdeaProject.instagramHandle}</a>
            </p>
          )}
        </div>
      </section>

      <section className="no-idea-radio-section">
        <h2>RADIO</h2>
        <p>{noIdeaProject.detail}</p>
        <div className="no-idea-radio-archive">
          {noIdeaProject.radioArchive?.map((slot) => (
            <article className="no-idea-radio-entry" key={slot.id}>
              <img src={assetUrl(slot.image)} alt={`${slot.title} artwork.`} />
              <h3 className="no-idea-radio-title-small">
                <a href={slot.url} target="_blank" rel="noreferrer">{slot.title}</a>
              </h3>
              <p>{slot.city} {slot.date}</p>
              <div>
                {slot.tags.map((tag) => <span key={tag}>[{tag}]</span>)}
              </div>
            </article>
          ))}
        </div>
        <ExternalLink href={event.externalLinks.noIdeaRadio}>BAIHUI RADIO ↗</ExternalLink>
      </section>

      <section className="no-idea-live-events">
        <h2>LIVE EVENTS</h2>
        <div className="no-idea-live-event-grid">
          {noIdeaProject.posterArchive?.filter((slot) => slot.image).map((slot) => (
            <article className="no-idea-live-event" key={slot.id}>
              <img src={assetUrl(slot.image!)} alt={`${slot.title} poster.`} />
              <div>
                <h3>{slot.title}</h3>
                <p>{slot.label}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="no-idea-featured-event no-idea-featured-event-stacked">
        <div className="no-idea-featured-copy">
          <h2>FEATURED EVENT</h2>
          <div className="no-idea-featured-meta">
            {[event.displayDate, event.edition.toUpperCase()].map((line) => (
              <span className="no-idea-featured-meta-primary" key={line}>{line}</span>
            ))}
            {[
              event.venue.toUpperCase(),
              event.room.toUpperCase(),
              event.address.toUpperCase(),
              event.city.toUpperCase(),
              event.postcode.toUpperCase(),
              event.genres.map((genre) => genre.toUpperCase()).join(" / "),
              event.roles.map((role) => role.toUpperCase()).join(" / ")
            ].map((line) => (
              <span className="no-idea-featured-meta-secondary" key={line}>{line}</span>
            ))}
          </div>
          <div className="event-lineup">
            <h3>LINEUP</h3>
            {event.lineup.map((artist) => <p key={artist}>{artist}</p>)}
          </div>
          <div className="link-row">
            <ExternalLink href={event.externalLinks.residentAdvisor}>RESIDENT ADVISOR EVENT ↗</ExternalLink>
            <ExternalLink href={event.externalLinks.shaiSpace}>SHAI SPACE ↗</ExternalLink>
          </div>
        </div>
        <div className="no-idea-featured-gallery" aria-label="Live With No Idea image gallery">
          {featuredImages.map((src, index) => (
            <figure className={`no-idea-featured-image ${index === 0 ? "no-idea-featured-image-large" : "no-idea-featured-image-supporting"} no-idea-featured-image-${index + 1}`} key={src}>
              <img src={assetUrl(src)} alt={index === 0 ? "Shen Ao performing at Live With No Idea at Shai Space, London." : event.galleryImages.find((image) => image.src === src)?.alt ?? "Live With No Idea event documentation."} />
            </figure>
          ))}
        </div>
      </section>

      {nextProject && <NextProject title={nextProject.title} onClick={() => navigate(nextProject.path)} />}
    </ProjectShell>
  );
}

function OpenbandPage({ navigate }: { navigate: (path: string) => void }) {
  const project = getProject("openband-openscore")!;
  return (
    <ProjectShell
      kicker="PROJECT / COMMUNITY"
      title={openbandProject.title}
      project={project}
      heroAside={(
        <div className="openband-hero-copy">
          <MetaLines lines={[openbandProject.year, openbandProject.heading, openbandProject.location]} uppercase={false} />
          <p>{openbandProject.summary}</p>
          <div className="link-row">
            {openbandProject.links.map((link) => <ExternalLink className="text-arrow-explicit" key={link.url} href={link.url}>{link.label}</ExternalLink>)}
          </div>
        </div>
      )}
    >

      <section className="openband-section openband-event-posters-section">
        <h2>EVENT POSTERS</h2>
        <div className="openband-event-poster-groups">
          {openbandProject.eventPosterGroups?.map((group) => <OpenbandPosterGroup group={group} key={group.city} />)}
        </div>
      </section>

      <section className="openband-section openband-documentation-section">
        <h2>BEIJING / LONDON</h2>
        <div className="openband-documentation-list">
          {openbandProject.documentationGroups?.map((group) => <OpenbandDocumentationGroup group={group} key={group.city} />)}
        </div>
      </section>

      <section className="openband-section openband-resource-section">
        <h2>RECORDINGS / ARCHIVE</h2>
        <div className="openband-resource-grid">
          <div className="openband-resource-item">
            <span>MIXCLOUD</span>
            <ExternalLink className="text-arrow-explicit" href={openbandProject.links[1].url}>{openbandProject.links[1].label}</ExternalLink>
          </div>
          <div className="openband-resource-item">
            <span>OPENBAND ARCHIVE</span>
            <ExternalLink className="text-arrow-explicit" href={openbandProject.links[0].url}>{openbandProject.links[0].label}</ExternalLink>
          </div>
        </div>
      </section>

      <section className="openband-section openband-credits-section">
        <h2>CREDITS</h2>
        <div className="openband-credits-list">
          <div className="openband-credit-group">
            <span className="openband-credit-label">HOSTS</span>
            {openbandProject.credits?.hosts.map((host) => <p className="openband-credit-value" key={host}>{host}</p>)}
          </div>
          <div className="openband-credit-group">
            <span className="openband-credit-label">VENUE</span>
            {openbandProject.credits?.venues.map((venue) => <p className="openband-credit-value" key={venue}>{venue}</p>)}
          </div>
        </div>
      </section>

      <NextProject title="BACK TO LIVE" onClick={() => navigate("/live")} label={null} />
    </ProjectShell>
  );
}

function ProjectShell({ kicker, title, project, heroAside, children }: { kicker: string; title: ReactNode; project: Project; heroAside?: ReactNode; children: ReactNode }) {
  return (
    <main className={`project-page project-page-${project.slug}`}>
      <section className="project-hero">
        <div className="openband-hero-title">
          <div className="section-kicker">{kicker}</div>
          <h1>{title}</h1>
          <p className="identity">{project.category.toUpperCase()} {project.subtype ? `/ ${project.subtype.toUpperCase()}` : ""}</p>
        </div>
        {heroAside}
      </section>
      {children}
    </main>
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
  const realDetailMedia = (project.detailMedia ?? []).filter((slot) => slot.src);
  const [heroSlot, ...gallerySlots] = realDetailMedia;
  const [heroImage, ...galleryImages] = project.showImagesOnDetail ? (project.images ?? []) : [];
  const nextProject = nextMusicProjectFor(project.slug);
  return (
    <ProjectShell kicker={`PROJECT / ${project.category.toUpperCase()}`} title={project.title.toUpperCase()} project={project}>
      <div className={`project-layout project-layout-loose ${isPractice ? "practice-detail-layout" : "structured-detail-layout"}`}>
        {project.artwork ? (
          <img className="project-art album-cover" src={assetUrl(project.artwork)} alt={`${project.title} album artwork`} />
        ) : heroImage ? (
          <img className="project-detail-image project-detail-hero-image" src={assetUrl(heroImage.src)} alt={heroImage.alt} />
        ) : heroSlot ? (
          <img className="project-detail-image project-detail-hero-image" src={assetUrl(heroSlot.src!)} alt={heroSlot.alt ?? project.title} />
        ) : null}
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
      {project.releaseDetails && (
        <section className="detail-band release-detail-facts">
          <h2>RELEASE DETAILS</h2>
          <div className="release-detail-facts-content">
            {project.releaseDetails.map((line) => <p key={line}>{line}</p>)}
          </div>
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
            <img className="project-detail-image" src={assetUrl(slot.src!)} alt={slot.alt ?? `${project.title} media ${index + 1}`} key={`${slot.src}-${index}`} />
          ))}
        </section>
      ) : null}
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
      {project.slug === "cctv-selected-broadcast-work" ? (
        <NextProject title="BACK TO MUSIC" onClick={() => navigate("/music")} label={null} />
      ) : nextProject && (
        <NextProject title={nextProject.title} onClick={() => navigate(nextProject.path)} />
      )}
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

function OpenbandDocumentationGroup({ group }: { group: DocumentationGroup }) {
  return (
    <article className="openband-documentation-group" data-documentation-city={group.city}>
      <h3>{group.city}</h3>
      <div className="openband-documentation-grid">
        {group.images.map((image, index) => (
          <img className="openband-documentation-image openband-image-contain" src={assetUrl(image)} alt={`OPENBAND ${group.city === "BEIJING" ? "Beijing" : "London"} documentation ${index + 1}.`} key={image} />
        ))}
      </div>
    </article>
  );
}

function OpenbandPosterGroup({ group }: { group: EventPosterGroup }) {
  return (
    <article className="openband-event-poster-group" data-poster-city={group.city}>
      <h3>{group.city}</h3>
      <div className="openband-event-poster-list">
        {group.posters.map((poster, index) => (
          <figure className="openband-event-poster-item" key={poster.image}>
            <img className="openband-event-poster openband-image-contain" src={assetUrl(poster.image)} alt={`OPENBAND ${group.city === "BEIJING" ? "Beijing" : "London"} event poster ${index + 1}.`} />
            <figcaption className="openband-event-poster-caption">
              <span>{poster.venue}</span>
              <span>{group.city}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </article>
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

function displayRelatedProject(relatedProject?: string) {
  return relatedProject?.replace(" / ", " + ");
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-platforms" aria-label="Music platforms">
        <a href="https://shenao.bandcamp.com/">BANDCAMP</a>
        <a href="https://soundcloud.com/shen-ao">SOUNDCLOUD</a>
        <a href="https://www.mixcloud.com/teendrum/">MIXCLOUD</a>
        <a href="https://www.instagram.com/shenaoooooo/" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
      </div>
      <span className="footer-credit">© 2026 SHEN AO · LONDON</span>
    </footer>
  );
}

function MetaLines({ lines, uppercase = true }: { lines: Array<string | undefined>; uppercase?: boolean }) {
  return <div className="meta-lines">{lines.filter(Boolean).map((line) => <span key={line}>{uppercase ? line!.toUpperCase() : line}</span>)}</div>;
}

function ExternalLink({ href, children, className = "text-arrow", ariaLabel }: { href: string; children: React.ReactNode; className?: string; ariaLabel?: string }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer" aria-label={ariaLabel}>{children}</a>;
}

function NextProject({ title, onClick, label = "NEXT PROJECT" }: { title: string; onClick: () => void; label?: string | null }) {
  return <button className="next-project" onClick={onClick}>{label && <span>{label}</span>}<strong>{title}</strong></button>;
}

type NextProjectEntry = {
  slug: string;
  title: string;
  path: string;
};

function nextMusicProjectFor(slug: string) {
  return nextProjectFromEntries(slug, musicDetailProjectEntries());
}

function nextLiveProjectFor(slug: string) {
  return nextProjectFromEntries(slug, liveDetailProjectEntries());
}

function musicDetailProjectEntries() {
  return detailEntriesForProjects([
    ...featuredMusicReleases,
    ...otherMusicReleases,
    ...musicScoringProjects
  ]);
}

function liveDetailProjectEntries(): NextProjectEntry[] {
  return [noIdeaProject, openbandProject]
    .filter((project) => Boolean(project.slug))
    .map((project) => ({
      slug: project.slug,
      title: project.title.toUpperCase(),
      path: `/work/${project.slug}`
    }));
}

function detailEntriesForProjects(projectsForPage: Project[]) {
  const entries = projectsForPage
    .filter((project) => project.slug && project.verificationStatus !== "needs-review")
    .map((project) => ({
      slug: project.slug,
      title: nextProjectTitle(project),
      path: releaseDetailPath(project)
    }));

  return entries.filter((entry, index) => entries.findIndex((candidate) => candidate.path === entry.path) === index);
}

function nextProjectFromEntries(slug: string, entries: NextProjectEntry[]) {
  const currentProject = getProject(slug);
  const currentPath = currentProject ? releaseDetailPath(currentProject) : `/work/${slug}`;
  const index = entries.findIndex((entry) => entry.slug === slug || entry.path === currentPath);
  return index >= 0 ? entries[index + 1] ?? null : null;
}

function nextProjectTitle(project: Project) {
  return project.slug === "cctv-selected-broadcast-work"
    ? "CCTV / SELECTED BROADCAST WORK"
    : project.slug === "cyberspace" || project.slug === "bug-party"
    ? "CYBERSPACE / BUG PARTY"
    : project.title.toUpperCase();
}
