import { useEffect, useMemo, useState, type ReactNode } from "react";
import { archiveFilters, getProject, projects, selectedWorks, type Project } from "./content/projects";
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

  return (
    <main className="home-page">
      <PageAccentMarks variant="home" />
      <section className="hero plan-b-hero flow-section">
        <div className="section-kicker">HOME / HERO</div>
        <div className="hero-copy">
          <h1 className="plan-b-title" data-title="SHEN AO">SHEN AO</h1>
          <p className="identity">COMPOSER / PRODUCER / SOUND ARTIST</p>
          <p className="short-copy">Electronic music, composition and sound practice across moving image, performance and collaboration.</p>
          <p className="mono-place">LONDON</p>
        </div>
        <div className="plan-b-hero-marks">
          <img className="hero-monster hero-monster-primary" src={assetUrl("/assets/plan-b/monster-pink.png")} alt="Hand-drawn Plan B character" />
          <img className="hero-pixel-play" src={assetUrl("/assets/plan-b/pixel-play.png")} alt="Plan B pixel play marker" />
          <img className="hero-doodle-ring" src={assetUrl("/assets/plan-b/doodle-blue-ring.png")} alt="" />
          <span className="hero-bit hero-bit-b">PLAY?</span>
        </div>
      </section>

      <section className="feature feature-music plan-b-music flow-section" data-testid="plan-b-featured-music">
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
                <MetaLines lines={[release.label, "ALBUM / RELEASE"]} />
                <ExternalLink className="listen-link" href="https://shenao.bandcamp.com/">LISTEN</ExternalLink>
                <button className="text-arrow" onClick={() => navigate(`/work/${release.slug}`)}>VIEW PROJECT</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="feature feature-film flow-section">
        <div className="section-kicker">FEATURED WORK / MOVING IMAGE</div>
        <div className="feature-text">
          <h2>ROLE MODEL</h2>
          <MetaLines lines={[roleModel.year, "FILM", "AUDIOVISUAL COMPOSITION / MIX"]} />
          <div className="mini-meta"><span>DIRECTOR</span><strong>HONGXUAN WANG</strong></div>
          <p className="photo-credit">{roleModel.photographyCredit}</p>
          <button className="text-arrow" onClick={() => navigate("/work/role-model")}>VIEW PROJECT</button>
        </div>
        <img className="role-model-still role-model-still-home" src={assetUrl(roleModel.images![0].src)} alt={roleModel.images![0].alt} />
      </section>

      <LivePreview navigate={navigate} />
      <PracticeProjects navigate={navigate} />
      <AboutPractice navigate={navigate} />
      <PressRadioPreview navigate={navigate} />
      <Collaboration />
    </main>
  );
}

function WorkPage({ navigate }: { navigate: (path: string) => void }) {
  const [filter, setFilter] = useState<(typeof archiveFilters)[number]>("ALL");
  const rows = useMemo(() => projects.filter((project) => filter === "ALL" || toFilter(project) === filter), [filter]);

  return (
    <main className="work-page">
      <PageAccentMarks variant="work" />
      <section className="work-intro">
        <div className="section-kicker">WORK / SELECTED</div>
        <h1>WORK</h1>
        <p>Selected Works</p>
      </section>
      <section className="selected-grid editorial-works" data-testid="selected-works">
        {selectedWorks.map((project, index) => (
          <article className={`selected-work selected-work-${index + 1} ${selectedLayout(project.slug)}`} data-testid={`selected-work-${project.slug}`} key={project.slug}>
            {showSelectedMedia(project.slug) && <MediaVisual project={project} />}
            <div>
              <h2>{project.title}</h2>
              <MetaLines lines={[project.year, project.category, project.subtype]} />
              {(project.slug === "cyberspace" || project.slug === "bug-party" || project.slug === "role-model") && (
                <button className="text-arrow" onClick={() => navigate(`/work/${project.slug}`)}>VIEW PROJECT</button>
              )}
              {project.externalLinks?.[0] && project.slug !== "cyberspace" && project.slug !== "bug-party" && project.slug !== "role-model" && (
                <ExternalLink href={project.externalLinks[0].url}>OPEN</ExternalLink>
              )}
            </div>
          </article>
        ))}
      </section>
      <ArchiveTable filter={filter} setFilter={setFilter} rows={rows} />
    </main>
  );
}

function MusicPage({ navigate }: { navigate: (path: string) => void }) {
  const musicProjects = projects.filter((project) => project.category === "Music");
  return (
    <main className="route-page music-page">
      <PageAccentMarks variant="music" />
      <PageIntro kicker="MUSIC / RELEASES" title="MUSIC">
        Electronic music, composition and production shaped through improvisation, unconventional harmony and the environments around him.
      </PageIntro>
      <section className="release-list">
        {musicProjects.map((project) => (
          <article className={`release-row release-row-${project.slug}`} key={project.slug}>
            {project.artwork ? <img className="release-cover" src={assetUrl(project.artwork)} alt={`${project.title} album artwork`} /> : <MediaPlaceholder title={project.title} label="ALBUM ARTWORK" variant="square" />}
            <div>
              <h2>{project.title}</h2>
              <MetaLines lines={[project.year, project.label, project.subtype]} />
              <div className="link-row">
                {project.externalLinks?.[0] && <ExternalLink href={project.externalLinks[0].url}>LISTEN</ExternalLink>}
                <button className="text-arrow" onClick={() => navigate(`/work/${project.slug}`)}>VIEW PROJECT</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function LivePage() {
  return (
    <main className="route-page live-page">
      <PageAccentMarks variant="live" />
      <PageIntro kicker="LIVE / PERFORMANCE" title="LIVE">
        A recording captures only one aspect of a performance. The live work is different every time.
      </PageIntro>
      <MetaLines lines={["LIVE ELECTRONICS", "IMPROVISATION", "DJ SETS", "COLLABORATIVE PERFORMANCE"]} />
      <section className="live-gallery">
        <MediaPlaceholder title="LIVE" label="ADDITIONAL MEDIA" variant="landscape" />
        <MediaPlaceholder title="LIVE" label="PROJECT IMAGE" variant="portrait" />
        <MediaPlaceholder title="LIVE" label="ADDITIONAL MEDIA" variant="square" />
        <MediaPlaceholder title="LIVE" label="MEDIA PLACEHOLDER" variant="cinematic" />
      </section>
    </main>
  );
}

function PracticePage({ navigate }: { navigate: (path: string) => void }) {
  const noIdea = getProject("no-idea")!;
  const openband = getProject("openband-openscore")!;
  return (
    <main className="route-page practice-page">
      <PageAccentMarks variant="practice" />
      <PageIntro kicker="PRACTICE / EVENTS + RADIO" title="PRACTICE">
        Music-making and event-making occupy different roles in Shen Ao's practice. One grows from accumulated learning; the other from lived experience, listening and making things together.
      </PageIntro>
      <section className="practice-feature-grid">
        <PracticeFeature project={noIdea} placeholder="NO IDEA / EVENT OR RADIO MATERIAL" onOpen={() => navigate("/work/no-idea")} />
        <PracticeFeature project={openband} placeholder="OPENBAND / WORKSHOP MATERIAL" onOpen={() => navigate("/work/openband-openscore")} />
      </section>
      <section className="note-band low-key">
        <h2>TUNNEL</h2>
        <p>Techno label / club practice involving artist coordination, technical requirements, editorial copy and resident / guest DJ activity.</p>
      </section>
    </main>
  );
}

function AboutPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <main className="route-page about-page">
      <PageAccentMarks variant="about" />
      <PageIntro kicker="ABOUT / BIO" title="ABOUT">
        Shen Ao is a London-based composer, producer and sound artist working across electronic music, moving image, live performance and event-making. His practice includes independent releases, film and theatre composition, live electronics, improvisation, DJ performance and collaborative projects.
      </PageIntro>
      <section className="about-layout">
        <div className="about-copy">
          <p>His recent work includes releases with Kit Records and projects spanning moving image, theatre, broadcast and interdisciplinary performance. Alongside his music-making, he has developed independent event, radio and improvisation practices through projects including No Idea and Openband / Openscore.</p>
          <h2>ARTIST STATEMENT</h2>
          <p>Keyboard improvisation is central to Shen Ao's way of processing sound. It is a tool through which different musical languages and the environments around him are absorbed, tested and reorganised. Unconventional harmonic movement remains a recurring part of this process.</p>
          <p>His music is shaped by the environments he moves through. Electronic and minimalist music sit alongside the sound of the city, becoming material that can be processed through improvisation and production rather than treated as separate influences.</p>
          <p>For Shen, experimentation is a working method rather than a genre. A work often begins with an imagined structure or expectation. During the process, that structure is gradually allowed to loosen, opening the work toward accident, instability and a degree of loss of control.</p>
          <p>This is also why live performance matters. A recording preserves only one aspect of an event; each performance remains contingent on the room, the performers and the moment.</p>
          <p>His event practice operates differently from his music-making. Shen describes music production as the accumulation of learning, while organising events grows from lived experience and from the simple pleasure of completing something with other people.</p>
        </div>
        <MediaPlaceholder title="ABOUT" label="PROJECT IMAGE" variant="portrait" />
      </section>
      <section className="statement-notes">
        {[
          ["KEYBOARD IMPROVISATION", "A way of absorbing and processing different sounds."],
          ["EXPERIMENT", "A working method, not a genre."],
          ["STRUCTURE -> LOSS OF CONTROL", "Begin with an expectation; gradually allow the work to move away from it."],
          ["LIVE", "A recording is only one perspective on an event."]
        ].map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}
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
  const selectedWork = [
    ["CYBERSPACE", "KIT RECORDS / RELEASE", "/work/cyberspace"],
    ["BUG PARTY", "KIT RECORDS / RELEASE", "/work/bug-party"],
    ["ROLE MODEL", "MOVING IMAGE / 2024", "/work/role-model"],
    ["FANCY A BITE?", "THEATRE / 2024", "/work/fancy-a-bite"],
    ["NO IDEA", "EVENTS / RADIO", "/work/no-idea"],
    ["OPENBAND / OPENSCORE", "INTERDISCIPLINARY IMPROVISATION", "/work/openband-openscore"]
  ];

  return (
    <main className="route-page epk-page">
      <PageAccentMarks variant="epk" />
      <section className="epk-hero">
        <div>
          <h1>SHEN AO</h1>
          <p>COMPOSER / PRODUCER / SOUND ARTIST</p>
          <p>LONDON</p>
        </div>
        <MediaPlaceholder title="EPK" label="PORTRAIT / ARTIST IMAGE" variant="portrait" />
      </section>

      <section className="epk-dossier">
        <article className="epk-main-copy">
          <h2>SHORT BIO</h2>
          <p>Shen Ao is a London-based composer, producer and sound artist working across electronic music, moving image, live performance and event-making. His practice includes independent releases, film and theatre composition, live electronics, improvisation, DJ performance and collaborative projects.</p>

          <h2>ARTIST STATEMENT</h2>
          <p>Keyboard improvisation is central to Shen Ao's way of processing sound. It is a tool through which different musical languages and the environments around him are absorbed, tested and reorganised. Unconventional harmonic movement remains a recurring part of this process.</p>
          <p>His music is shaped by the environments he moves through. Electronic and minimalist music sit alongside the sound of the city, becoming material that can be processed through improvisation and production rather than treated as separate influences.</p>
          <p>For Shen, experimentation is a working method rather than a genre. A work often begins with an imagined structure or expectation. During the process, that structure is gradually allowed to loosen, opening the work toward accident, instability and a degree of loss of control.</p>
          <p>This is also why live performance matters. A recording preserves only one aspect of an event; each performance remains contingent on the room, the performers and the moment.</p>
          <p>His event practice operates differently from his music-making. Shen describes music production as the accumulation of learning, while organising events grows from lived experience and from the simple pleasure of completing something with other people.</p>
        </article>

        <aside className="epk-facts" aria-label="Quick facts">
          <InfoItem label="BASED IN" value="London" />
          <InfoItem label="PRACTICE" value="Music / Moving Image / Live / Event-making" />
          <InfoItem label="WORKING ACROSS" value="Composition / Production / Improvisation / Performance" />
          <InfoItem label="CONTACT" value="lerezero@gmail.com" />
          <div className="epk-listen">
            <h2>LISTEN</h2>
            <ExternalLink href="https://shenao.bandcamp.com/">BANDCAMP</ExternalLink>
            <ExternalLink href="https://soundcloud.com/shen-ao">SOUNDCLOUD</ExternalLink>
            <ExternalLink href="https://www.mixcloud.com/teendrum/">MIXCLOUD</ExternalLink>
          </div>
        </aside>
      </section>

      <section className="epk-selected-work">
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

      <section className="epk-lower-grid">
        <article className="epk-press">
          <h2>SELECTED PRESS / RADIO</h2>
          {epkPressItems.map((item) => <PressMiniLine item={item} key={item.id} />)}
        </article>
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

      <section className="epk-contact">
        <h2>CONTACT / BOOKINGS / COLLABORATION</h2>
        <p>lerezero@gmail.com</p>
        <div>
          <ExternalLink href="https://shenao.bandcamp.com/">BANDCAMP</ExternalLink>
          <ExternalLink href="https://soundcloud.com/shen-ao">SOUNDCLOUD</ExternalLink>
          <ExternalLink href="https://www.mixcloud.com/teendrum/">MIXCLOUD</ExternalLink>
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
          <MetaLines lines={[project.year, "FILM", "DIRECTOR", "HONGXUAN WANG"]} />
          <ExternalLink href={project.externalLinks![0].url}>VIEW PROJECT</ExternalLink>
        </div>
      </div>
      <section className="detail-band">
        <h2>SHEN AO'S ROLE</h2>
        <ul>{project.role?.map((role) => <li key={role}>{role}</li>)}</ul>
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
          <div className="archive-row" key={project.slug}>
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
  return (
    <section className="live-preview flow-section">
      <div>
        <div className="section-kicker">LIVE / PREVIEW</div>
        <h2>LIVE</h2>
        <p>A recording captures only one aspect of a performance. The live work is different every time.</p>
      </div>
      <MetaLines lines={["LIVE ELECTRONICS", "IMPROVISATION", "PERFORMANCE", "DJ SETS"]} />
      <MediaPlaceholder title="LIVE" label="ADDITIONAL MEDIA" variant="cinematic" />
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
          <MediaPlaceholder title={project.title.toUpperCase()} label={project.slug === "no-idea" ? "EVENT OR RADIO MATERIAL" : "WORKSHOP MATERIAL"} variant="landscape" />
          <h2>{project.title.toUpperCase()}</h2>
          <p>{project.description}</p>
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
  return (
    <ProjectShell kicker={`PROJECT / ${project.category.toUpperCase()}`} title={project.title.toUpperCase()} project={project}>
      <div className={`project-layout project-layout-loose ${isPractice ? "practice-detail-layout" : ""}`}>
        {project.artwork ? <img className="project-art album-cover" src={assetUrl(project.artwork)} alt={`${project.title} album artwork`} /> : <MediaPlaceholder title={project.title.toUpperCase()} label={project.category === "Music" ? "ALBUM ARTWORK" : "MEDIA PLACEHOLDER"} variant={project.category === "Music" ? "square" : "landscape"} />}
        <div className="project-meta">
          {project.description && <p>{project.description}</p>}
          <MetaLines lines={[project.year, project.label, project.subtype, project.location]} />
          {project.externalLinks?.map((link) => <ExternalLink key={link.url} href={link.url}>{link.label}</ExternalLink>)}
        </div>
      </div>
      {isPractice && (
        <section className="detail-band">
          <h2>RELATED PRACTICE</h2>
          <p>{project.slug === "no-idea" ? "Events, radio, programming, budgeting, technical production and coordination around immersive live experiences." : "Open, non-hierarchical approaches to sound-making with musicians, artists, visual practitioners and local collaborators."}</p>
        </section>
      )}
      <PlaceholderSequence labels={project.category === "Music" ? ["MEDIA PLACEHOLDER", "ADDITIONAL MEDIA", "PROJECT IMAGE"] : ["MEDIA PLACEHOLDER", "ADDITIONAL MEDIA", "PROJECT IMAGE"]} />
      {project.press && <KnownPress press={project.press} />}
      <NextProject title={nextProjectFor(project.slug).title} onClick={() => navigate(nextProjectFor(project.slug).path)} />
    </ProjectShell>
  );
}

function PageIntro({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
  return (
    <section className="page-intro">
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

function PracticeFeature({ project, placeholder, onOpen }: { project: Project; placeholder: string; onOpen: () => void }) {
  return (
    <article className="practice-feature">
      <MediaPlaceholder title={project.title.toUpperCase()} label={placeholder} variant="landscape" />
      <div>
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        <div className="link-row">
          {project.externalLinks?.map((link) => <ExternalLink key={link.url} href={link.url}>{link.label}</ExternalLink>)}
          <button className="text-arrow" onClick={onOpen}>VIEW PROJECT</button>
        </div>
      </div>
    </article>
  );
}

function CvSections() {
  return (
    <section className="cv-grid">
      <div>
        <h2>EDUCATION</h2>
        <p><span>2023-2025</span>Goldsmiths, University of London<br />MMus Creative Practice</p>
        <p><span>2018-2022</span>Jazz piano studies with Kong Hongwei</p>
        <p><span>2014-2018</span>Tianjin Conservatory of Music</p>
      </div>
      <div>
        <h2>PROFESSIONAL WORK</h2>
        <p><span>2021.09-2023.04</span>China Television Media / 中视前卫影视传媒<br />Audio Editing / Music Production</p>
        <p>Participated in audio and music production for more than 50 short-form promotional projects for CCTV-13.</p>
      </div>
    </section>
  );
}

function PressSection({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="press-section">
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

function NextProject({ title, onClick }: { title: string; onClick: () => void }) {
  return <button className="next-project" onClick={onClick}><span>NEXT PROJECT</span><strong>{title}</strong></button>;
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
