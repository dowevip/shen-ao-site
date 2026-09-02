import { useEffect, useMemo, useState } from "react";
import { archiveFilters, getProject, projects, selectedWorks, type Project } from "./content/projects";
import "./styles.css";

const navItems = ["WORK", "MUSIC", "LIVE", "PRACTICE", "ABOUT", "EPK"];

type AppProps = {
  initialPath?: string;
};

const basePath = import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");
const fallbackBasePath = "/shen-ao-site";
const toAppPath = (path: string) => {
  const normalized = basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path.startsWith(fallbackBasePath)
      ? path.slice(fallbackBasePath.length) || "/"
      : path;
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
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
  ) : path.startsWith("/work") ? (
    <WorkPage navigate={navigate} />
  ) : (
    <HomePage navigate={navigate} />
  );

  return (
    <div className="site-shell">
      <Header active={path.startsWith("/work") ? "WORK" : ""} navigate={navigate} />
      {page}
      <Footer />
    </div>
  );
}

function Header({ active, navigate }: { active: string; navigate: (path: string) => void }) {
  return (
    <header className="site-header">
      <button className="brand-link" onClick={() => navigate("/")}>SHEN AO</button>
      <nav aria-label="Primary navigation">
        {navItems.map((item) => (
          <button key={item} className={active === item ? "active" : ""} onClick={() => navigate(item === "WORK" ? "/work" : "/")}>
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
}

function HomePage({ navigate }: { navigate: (path: string) => void }) {
  const featuredReleases = [getProject("cyberspace")!, getProject("bug-party")!];
  const roleModel = getProject("role-model")!;

  return (
    <main className="home-page">
      <section className="hero flow-section">
        <div className="section-kicker">01&nbsp;&nbsp; HOME / HERO</div>
        <div className="hero-copy">
          <h1>SHEN AO</h1>
          <p className="identity">COMPOSER / PRODUCER / SOUND ARTIST</p>
          <p className="short-copy">Electronic music, composition and sound practice across moving image, performance and collaboration.</p>
          <p className="mono-place">LONDON</p>
        </div>
        <figure className="hero-signal">
          <img src={assetUrl("/assets/hero-signal-final.png")} alt="Data horizon signal field" />
        </figure>
      </section>

      <section className="feature feature-music flow-section">
        <div className="section-kicker">02&nbsp;&nbsp; FEATURED WORK / MUSIC</div>
        <div className="featured-releases">
          {featuredReleases.map((release, index) => (
            <article className={`featured-release featured-release-${index + 1}`} key={release.slug}>
              <img src={assetUrl(release.artwork!)} alt={`${release.title} album artwork`} />
              <div>
                <h2>{release.title.toUpperCase()}</h2>
                <MetaLines lines={[release.label, "ALBUM / RELEASE"]} />
                <ExternalLink href="https://shenao.bandcamp.com/">LISTEN</ExternalLink>
                <button className="text-arrow" onClick={() => navigate(`/work/${release.slug}`)}>VIEW PROJECT</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="feature feature-film flow-section">
        <div className="section-kicker">03&nbsp;&nbsp; FEATURED WORK / MOVING IMAGE</div>
        <div className="feature-text">
          <h2>ROLE MODEL</h2>
          <MetaLines lines={[roleModel.year, "FILM", "AUDIOVISUAL COMPOSITION / MIX"]} />
          <div className="mini-meta"><span>DIRECTOR</span><strong>HONGXUAN WANG</strong></div>
          <button className="text-arrow" onClick={() => navigate("/work/role-model")}>VIEW PROJECT</button>
        </div>
        <div className="wide-media mist-media" aria-label="Film still placeholder" />
      </section>

      <AboutPractice />
      <LivePreview />
      <PracticeProjects />
      <SelectedContexts />
      <Collaboration />
    </main>
  );
}

function WorkPage({ navigate }: { navigate: (path: string) => void }) {
  const [filter, setFilter] = useState<(typeof archiveFilters)[number]>("ALL");
  const rows = useMemo(() => projects.filter((project) => filter === "ALL" || toFilter(project) === filter), [filter]);

  return (
    <main className="work-page">
      <section className="work-intro">
        <div className="section-kicker">01&nbsp;&nbsp; WORK / SELECTED</div>
        <h1>WORK</h1>
        <p>Selected Works</p>
      </section>
      <section className="selected-grid editorial-works" data-testid="selected-works">
        {selectedWorks.map((project, index) => (
          <article className={`selected-work selected-work-${index + 1} ${selectedLayout(project.slug)}`} data-testid={`selected-work-${project.slug}`} key={project.slug}>
            {showSelectedMedia(project.slug) && <MediaVisual project={project} />}
            <div>
              <span className="index">{String(index + 1).padStart(2, "0")}</span>
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

function MusicReleasePage({ slug, navigate }: { slug: "cyberspace" | "bug-party"; navigate: (path: string) => void }) {
  const project = getProject(slug)!;
  const nextProject = slug === "cyberspace" ? { title: "BUG PARTY", path: "/work/bug-party" } : { title: "ROLE MODEL", path: "/work/role-model" };
  return (
    <ProjectShell kicker="01  PROJECT / MUSIC" title={project.title.toUpperCase()} project={project}>
      <div className="project-layout project-layout-loose">
        <img className="project-art album-cover" src={assetUrl(project.artwork!)} alt={`${project.title} album artwork`} />
        <div className="project-meta">
          <MetaLines lines={[project.label, "ALBUM / RELEASE"]} />
          <ExternalLink href="https://shenao.bandcamp.com/">LISTEN</ExternalLink>
        </div>
      </div>
      <PlaceholderSequence labels={["MEDIA PLACEHOLDER", "LIVE / IMAGE PLACEHOLDER", "PROJECT IMAGE PLACEHOLDER"]} />
      <NextProject title={nextProject.title} onClick={() => navigate(nextProject.path)} />
    </ProjectShell>
  );
}

function RoleModelPage({ navigate }: { navigate: (path: string) => void }) {
  const project = getProject("role-model")!;
  return (
    <ProjectShell kicker="01  PROJECT / MOVING IMAGE" title="ROLE MODEL" project={project}>
      <div className="project-layout project-layout-loose film-layout">
        <div className="project-art mist-media" aria-label="Film still placeholder" />
        <div className="project-meta">
          <MetaLines lines={[project.year, "FILM", "DIRECTOR", "HONGXUAN WANG"]} />
          <ExternalLink href={project.externalLinks![0].url}>WATCH</ExternalLink>
        </div>
      </div>
      <section className="detail-band">
        <h2>SHEN AO'S ROLE</h2>
        <ul>{project.role?.map((role) => <li key={role}>{role}</li>)}</ul>
      </section>
      <PlaceholderSequence labels={["SELECTED SCENE PLACEHOLDER", "MOVING IMAGE PLACEHOLDER"]} />
      <section className="detail-band">
        <h2>CREDITS</h2>
        <p>DIRECTOR / HONGXUAN WANG</p>
      </section>
      <NextProject title="CYBERSPACE" onClick={() => navigate("/work/cyberspace")} />
    </ProjectShell>
  );
}

function ProjectShell({ kicker, title, project, children }: { kicker: string; title: React.ReactNode; project: Project; children: React.ReactNode }) {
  return (
    <main className="project-page">
      <section className="project-hero">
        <div className="section-kicker">{kicker}</div>
        <h1>{title}</h1>
        <p className="identity">{project.category.toUpperCase()} {project.subtype ? `/ ${project.subtype.toUpperCase()}` : ""}</p>
      </section>
      {children}
    </main>
  );
}

function ArchiveTable({ filter, setFilter, rows }: { filter: (typeof archiveFilters)[number]; setFilter: (filter: (typeof archiveFilters)[number]) => void; rows: Project[] }) {
  return (
    <section className="archive">
      <div className="section-kicker">02&nbsp;&nbsp; WORK / ARCHIVE</div>
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

function AboutPractice() {
  return (
    <section className="about-practice">
      <div className="about-block">
        <div className="section-kicker">04&nbsp;&nbsp; ABOUT / PREVIEW</div>
        <p>Shen Ao is a London-based composer, producer and sound artist working across electronic music, moving image, live performance and collaborative sound practice.</p>
        <p>His work moves between studio production, composition, improvisation and event-making, spanning independent releases, film and theatre, live electronics and cross-disciplinary projects.</p>
        <span className="text-arrow">ABOUT</span>
      </div>
      <div className="practice-columns">
        {[
          ["01 MUSIC", "Electronic music", "Composition", "Production", "Releases"],
          ["02 MOVING IMAGE", "Film", "Documentary", "Theatre", "Commissions"],
          ["03 LIVE", "Live electronics", "Improvisation", "Performance", "DJ sets"],
          ["04 CURATION + COMMUNITY", "Events", "Workshops", "Collective practice", "Cross-disciplinary collaboration"]
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

function LivePreview() {
  return (
    <section className="live-preview flow-section">
      <div>
        <div className="section-kicker">05&nbsp;&nbsp; LIVE / PREVIEW</div>
        <h2>LIVE</h2>
      </div>
      <MetaLines lines={["PERFORMANCE", "IMPROVISATION", "ELECTRONICS"]} />
      <div className="stage-media" aria-label="Performance media placeholder" />
      <span className="text-arrow">EXPLORE LIVE</span>
    </section>
  );
}

function PracticeProjects() {
  const practice = projects.filter((project) => project.featured === "practice");
  return (
    <section className="practice-projects">
      {practice.map((project, index) => (
        <article key={project.slug}>
          <span className="index">0{index + 1}</span>
          <h2>{project.title.toUpperCase()}</h2>
          <p>{project.description}</p>
          <div className="link-row">
            {project.externalLinks?.map((link) => <ExternalLink key={link.url} href={link.url}>{link.label}</ExternalLink>)}
          </div>
        </article>
      ))}
    </section>
  );
}

function SelectedContexts() {
  return (
    <section className="contexts">
      <div className="section-kicker">06&nbsp;&nbsp; CONTEXTS</div>
      <h2>SELECTED CONTEXTS</h2>
      <p>KIT RECORDS</p><p>GOLDSMITHS</p><p>CCTV-13</p><p>THE QUIETUS</p><p>LONDON</p>
    </section>
  );
}

function Collaboration() {
  return (
    <section className="collaboration">
      <h2>COMMISSIONS<br />& COLLABORATION</h2>
      <div>
        <p>For moving image, film, performance, installation and interdisciplinary projects.</p>
        <p>Composition, sound, production and collaborative development.</p>
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
  if (project.artwork) {
    return <img className="work-media work-artwork" src={assetUrl(project.artwork)} alt={`${project.title} album artwork`} />;
  }

  return <div className="work-media" aria-hidden="true" />;
}

function MetaLines({ lines }: { lines: Array<string | undefined> }) {
  return <div className="meta-lines">{lines.filter(Boolean).map((line) => <span key={line}>{line!.toUpperCase()}</span>)}</div>;
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className="text-arrow" href={href} target="_blank" rel="noreferrer">{children}</a>;
}

function LinkList({ heading, links }: { heading: string; links: { label: string; url: string }[] }) {
  return <section className="detail-band"><h2>{heading}</h2>{links.map((link) => <ExternalLink key={link.url} href={link.url}>{link.label}</ExternalLink>)}</section>;
}

function PlaceholderSequence({ labels }: { labels: string[] }) {
  return <section className="placeholder-sequence">{labels.map((label) => <div key={label} className="media-placeholder">{label}</div>)}</section>;
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
