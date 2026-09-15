import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { projects } from "../content/projects";

const originalScrollTo = window.scrollTo;

beforeEach(() => {
  window.scrollTo = vi.fn();
});

afterEach(() => {
  window.scrollTo = originalScrollTo;
  window.history.replaceState({}, "", "/");
  cleanup();
});

function expectOnlyPrimaryNavItems(labels: string[]) {
  const nav = screen.getByRole("navigation", { name: "Primary navigation" });
  expect(within(nav).getAllByRole("button").map((button) => button.textContent)).toEqual(labels);
}

describe("SHEN AO site IA", () => {
  it("renders deterministic shared page accents for public routes", () => {
    const routes = [
      "/",
      "/music",
      "/live",
      "/about",
      "/work/cyberspace-bug-party",
      "/work/role-model",
      "/work/fancy-a-bite",
      "/work/untitled-land",
      "/work/clouds-from-underground",
      "/work/no-idea",
      "/work/openband-openscore"
    ];

    const signatures = routes.map((route) => {
      const { unmount } = render(<App initialPath={route} />);
      const container = document.querySelector(".page-accents");
      const marks = Array.from(document.querySelectorAll<HTMLElement>(".page-accent-mark"));

      expect(container).toHaveAttribute("aria-hidden", "true");
      expect(marks.length).toBeGreaterThanOrEqual(3);
      expect(marks.length).toBeLessThanOrEqual(4);

      const firstSignature = marks.map((mark) => mark.getAttribute("style")).join("|");
      unmount();

      render(<App initialPath={route} />);
      expect(Array.from(document.querySelectorAll<HTMLElement>(".page-accent-mark")).map((mark) => mark.getAttribute("style")).join("|")).toBe(firstSignature);
      cleanup();

      return firstSignature;
    });

    expect(new Set(signatures).size).toBeGreaterThan(routes.length - 3);
  });

  it("keeps the primary navigation to HOME, MUSIC, LIVE, and ABOUT", () => {
    render(<App initialPath="/" />);

    expectOnlyPrimaryNavItems(["HOME", "MUSIC", "LIVE", "ABOUT"]);

    for (const hiddenItem of ["WORK", "PRACTICE", "PRESS", "EPK"]) {
      expect(within(screen.getByRole("navigation")).queryByRole("button", { name: hiddenItem })).not.toBeInTheDocument();
    }
  });

  it("renders HOME around the two Kit Records releases, related live dates, and verified release press only", () => {
    render(<App initialPath="/" />);

    expectOnlyPrimaryNavItems(["HOME", "MUSIC", "LIVE", "ABOUT"]);

    const sections = ["home-featured-music", "home-related-live", "home-press"].map((id) => screen.getByTestId(id));
    for (let index = 0; index < sections.length - 1; index += 1) {
      expect(Boolean(sections[index].compareDocumentPosition(sections[index + 1]) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true);
    }

    const music = within(screen.getByTestId("home-featured-music"));
    expect(music.getByRole("heading", { name: "CYBERSPACE" })).toBeInTheDocument();
    expect(music.getByRole("heading", { name: "BUG PARTY" })).toBeInTheDocument();
    expect(music.getByAltText("Cyberspace album artwork")).toHaveAttribute("src", "/assets/cyberspace.jpg");
    expect(music.getByAltText("Bug Party album artwork")).toHaveAttribute("src", "/assets/bugparty.jpg");
    expect(music.getAllByText("2026")).toHaveLength(2);
    expect(music.getAllByText("KIT RECORDS")).toHaveLength(2);
    expect(music.getAllByRole("link", { name: "LISTEN" })).toHaveLength(2);
    expect(music.getAllByRole("link", { name: "LISTEN" }).map((link) => link.getAttribute("href"))).toEqual([
      "https://shenao.bandcamp.com/album/cyberspace",
      "https://shenao.bandcamp.com/album/bug-party"
    ]);
    expect(music.getAllByRole("button", { name: "INFO" })).toHaveLength(2);

    const live = within(screen.getByTestId("home-related-live"));
    expect(live.getByRole("heading", { name: "RELATED LIVE" })).toBeInTheDocument();
    expect(live.getByText("17 JUN 2026")).toBeInTheDocument();
    expect(live.getByText("THE GEORGE TAVERN / LONDON")).toBeInTheDocument();
    expect(live.getByText("17 JUL 2026")).toBeInTheDocument();
    expect(live.getByText("YUANLIAO SPACE / BEIJING")).toBeInTheDocument();
    expect(live.getByText("23 JUL 2026")).toBeInTheDocument();
    expect(live.getByText("SPANNERS / LONDON")).toBeInTheDocument();
    expect(live.getByText("08 AUG 2026")).toBeInTheDocument();
    expect(live.getByText("LOOSE.FM / LONDON")).toBeInTheDocument();

    const press = within(screen.getByTestId("home-press"));
    expect(press.getByRole("heading", { name: "PRESS" })).toBeInTheDocument();
    expect(press.getByText("THE QUIETUS")).toBeInTheDocument();
    expect(press.getByRole("link", { name: "READ ↗" })).toHaveAttribute("href", "https://thequietus.com/quietus-reviews/cassettes/spools-out-cassette-reviews-for-july-by-daryl-worthington/");
    expect(press.getByText("MUITO RADIO")).toBeInTheDocument();
    expect(press.getByRole("link", { name: "VIEW ↗" })).toHaveAttribute("href", "https://muitoradio.com/buymusicclub/27");

    for (const removedHomeText of [
      "SHEN AO",
      "ROLE MODEL",
      "NO IDEA",
      "OPENBAND",
      "ABOUT / CONTACT",
      "COMPOSER / PRODUCER / SOUND ARTIST",
      "Electronic music, composition and sound practice across moving image, performance and collaborative projects.",
      "ARTIST STATEMENT"
    ]) {
      expect(within(screen.getByRole("main")).queryByText(removedHomeText)).not.toBeInTheDocument();
    }

    fireEvent.click(live.getByRole("button", { name: "ALL LIVE" }));
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "LIVE" })).toBeInTheDocument();
  });

  it("renders MUSIC with releases, selected works, and a weaker additional works group", () => {
    render(<App initialPath="/music" />);

    const main = within(screen.getByRole("main"));
    expect(main.getByRole("heading", { level: 1, name: "MUSIC" })).toBeInTheDocument();
    expect(screen.queryByText("MUSIC / INDEX")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "FEATURED" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "RELEASES" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "SELECTED WORKS" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "ADDITIONAL WORKS" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2, name: "SCORING / COMMISSIONED MUSIC" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2, name: "ADDITIONAL COMMISSIONED WORK" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2, name: "PRODUCTION / SCORING" })).not.toBeInTheDocument();

    for (const title of [
      "CYBERSPACE",
      "BUG PARTY",
      "LET ME SPEAK / 让我说",
      "TWO DREADFUL CHILDREN / UNIPRE",
      "BAMBOO BLEND",
      "ROLE MODEL",
      "FANCY A BITE?",
      "UNTITLED LAND",
      "CLOUDS FROM UNDERGROUND",
      "SELECTED BROADCAST WORK / CCTV-13",
      "ZHANG JIAN AND JINGDEZHEN",
      "IQIYI VR SE PROMO",
      "THE BACK DOOR OF STAGE",
      "NOSTOPIA PLAYABLE NFT",
      "PARADISE DREAM 2",
      "DOUYIN CULTURAL PRODUCT PROMO",
      "MR.MONSTER RESOURCE",
      "TUNNEL"
    ]) {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    }

    const primary = within(screen.getByTestId("music-scoring-commissioned"));
    const more = within(screen.getByTestId("music-more-commissioned"));
    expect(primary.getAllByRole("article")).toHaveLength(5);
    expect(more.getAllByRole("article")).toHaveLength(8);
    expect(primary.getAllByRole("img")).toHaveLength(5);
    expect(more.getAllByRole("img")).toHaveLength(4);
    expect(more.queryByText("MEDIA PLACEHOLDER")).not.toBeInTheDocument();
    expect(within(more.getByTestId("music-more-commissioned-images")).getAllByRole("article")).toHaveLength(4);
    expect(within(more.getByTestId("music-more-commissioned-text")).getAllByRole("article")).toHaveLength(4);
    expect(more.getByTestId("music-index-item-iqiyi-vr-se")).toHaveClass("music-index-item-commissioned-archive-image");
    expect(more.getByTestId("music-index-item-nostopia-playable-nft")).toHaveClass("music-index-item-commissioned-archive-text");
    expect(more.getByTestId("music-index-item-paradise-dream-2")).toHaveClass("music-index-item-commissioned-archive-image");
    expect(more.getByTestId("music-index-item-zhang-jian-jingdezhen")).toHaveClass("music-index-item-commissioned-archive-image");
    expect(more.queryByRole("link")).not.toBeInTheDocument();
    expect(more.queryByRole("button", { name: "INFO" })).not.toBeInTheDocument();

    const primaryInfoRoutes = [
      ["role-model", "/work/role-model"],
      ["fancy-a-bite", "/work/fancy-a-bite"],
      ["untitled-land", "/work/untitled-land"],
      ["clouds-from-underground", "/work/clouds-from-underground"],
      ["cctv-selected-broadcast-work", "/work/cctv-selected-broadcast-work"]
    ] as const;
    for (const [slug] of primaryInfoRoutes) {
      expect(within(primary.getByTestId(`music-index-item-${slug}`)).getByRole("button", { name: "INFO" })).toBeInTheDocument();
      expect(within(primary.getByTestId(`music-index-item-${slug}`)).queryByRole("link", { name: "INFO ↗" })).not.toBeInTheDocument();
    }
    expect(within(primary.getByTestId("music-index-item-role-model")).getByRole("link", { name: "PROJECT ↗" })).toHaveAttribute(
      "href",
      "https://www.thebluecoat.org.uk/library/event/dahong-hongxuan-wang-role-model"
    );
    expect(within(primary.getByTestId("music-index-item-fancy-a-bite")).getByRole("link", { name: "PROJECT ↗" })).toHaveAttribute(
      "href",
      "https://cptheatre.co.uk/whatson/Big-Bang-18-March-2024"
    );
    expect(within(more.getByTestId("music-index-item-zhang-jian-jingdezhen")).queryByRole("link")).not.toBeInTheDocument();
    expect(within(more.getByTestId("music-index-item-zhang-jian-jingdezhen")).queryByRole("button")).not.toBeInTheDocument();
    expect(within(more.getByTestId("music-index-item-the-back-door-of-stage")).queryByRole("link")).not.toBeInTheDocument();
    expect(within(more.getByTestId("music-index-item-nostopia-playable-nft")).queryByRole("img")).not.toBeInTheDocument();
    expect(within(more.getByTestId("music-index-item-douyin-cultural-promo")).queryByRole("img")).not.toBeInTheDocument();
    expect(within(more.getByTestId("music-index-item-mr-monster-resource")).queryByRole("img")).not.toBeInTheDocument();
    expect(within(more.getByTestId("music-index-item-tunnel")).queryByRole("img")).not.toBeInTheDocument();

    expect(screen.getByText("FILM / SCORE + MIX")).toBeInTheDocument();
    expect(screen.getAllByText("EXPERIMENTAL FILM / SCORE").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("THEATRE / COMPOSITION").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("AUDIOVISUAL COMPOSITION / MIX")).not.toBeInTheDocument();
    expect(screen.getAllByText("GAME MUSIC / SCORE").length).toBeGreaterThanOrEqual(1);
    const musicListenHrefs = screen.getAllByRole("link", { name: "LISTEN ↗" }).map((link) => link.getAttribute("href"));
    expect(musicListenHrefs).toEqual(expect.arrayContaining([
      "https://shenao.bandcamp.com/album/cyberspace",
      "https://shenao.bandcamp.com/album/bug-party",
      "https://shenao.bandcamp.com/album/two-dreadful-children-unipre",
      "https://soundcloud.com/shen-ao/bamboo-blend"
    ]));
    expect(musicListenHrefs.some((href) => href?.includes("music.163.com"))).toBe(false);
    expect(screen.getAllByRole("button", { name: "INFO" }).length).toBeGreaterThanOrEqual(5);
    expect(screen.getByAltText("Exhibition view showing a projected close-up from Role Model.")).toHaveAttribute("src", "/assets/role-model/DSC0944_1600px_sRGB.jpg");
    expect(screen.queryByText(/Role Model follows the experience/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/comprising ten tracks/i)).not.toBeInTheDocument();
  });

  it("renders the uploaded RELEASES covers and uses overseas LISTEN links", () => {
    render(<App initialPath="/music" />);

    const releases = within(screen.getByTestId("music-secondary-releases"));
    expect(releases.getByAltText("Let Me Speak album artwork")).toHaveAttribute("src", "/assets/portfolio-projects/let-me-speak-cover.jpg");
    expect(releases.getByAltText("two dreadful children / unipre album artwork")).toHaveAttribute("src", "/assets/portfolio-projects/two-dreadful-children-unipre-cover.png");
    expect(releases.getByAltText("Bamboo Blend album artwork")).toHaveAttribute("src", "/assets/portfolio-projects/bamboo-blend-cover.jpg");
    expect(releases.getAllByRole("link", { name: "LISTEN ↗" }).map((link) => link.getAttribute("href"))).toEqual([
      "https://shenao.bandcamp.com/album/rang-wo-shuo",
      "https://shenao.bandcamp.com/album/two-dreadful-children-unipre",
      "https://soundcloud.com/shen-ao/bamboo-blend"
    ]);
    expect(releases.queryByText("ALBUM ARTWORK")).not.toBeInTheDocument();
  });

  it("does not render the MUSIC page platform footer links", () => {
    render(<App initialPath="/music" />);

    const main = within(screen.getByRole("main"));
    expect(main.queryByRole("region", { name: "Music platforms" })).not.toBeInTheDocument();
    expect(main.queryByRole("link", { name: "BANDCAMP" })).not.toBeInTheDocument();
    expect(main.queryByRole("link", { name: "SOUNDCLOUD" })).not.toBeInTheDocument();
    expect(main.queryByRole("link", { name: "NETEASE MUSIC" })).not.toBeInTheDocument();
  });

  it("renders a concise footer with music platform links", () => {
    render(<App initialPath="/music" />);

    const footer = within(screen.getByRole("contentinfo"));
    expect(footer.getByText("© 2026 SHEN AO · LONDON")).toBeInTheDocument();
    expect(footer.queryByText("SHEN AO")).not.toBeInTheDocument();
    expect(footer.getByRole("link", { name: "BANDCAMP" })).toHaveAttribute("href", "https://shenao.bandcamp.com/");
    expect(footer.getByRole("link", { name: "SOUNDCLOUD" })).toHaveAttribute("href", "https://soundcloud.com/shen-ao");
    expect(footer.getByRole("link", { name: "MIXCLOUD" })).toHaveAttribute("href", "https://www.mixcloud.com/teendrum/");
    expect(footer.getByRole("link", { name: "INSTAGRAM" })).toHaveAttribute("href", "https://www.instagram.com/shenaoooooo/");
    expect(footer.getByRole("link", { name: "INSTAGRAM" })).toHaveAttribute("target", "_blank");
    expect(footer.getByRole("link", { name: "INSTAGRAM" })).toHaveAttribute("rel", "noopener noreferrer");
    expect(footer.queryByText("LONDON")).not.toBeInTheDocument();
  });

  it("shows the shared footer Instagram link across primary and project routes", () => {
    [
      "/",
      "/music",
      "/live",
      "/about",
      "/work/cyberspace-bug-party",
      "/work/role-model",
      "/work/fancy-a-bite",
      "/work/untitled-land",
      "/work/clouds-from-underground",
      "/work/cctv-selected-broadcast-work",
      "/work/no-idea",
      "/work/openband-openscore"
    ].forEach((route) => {
      cleanup();
      render(<App initialPath={route} />);
      const footer = within(screen.getByRole("contentinfo"));
      expect(footer.getByRole("link", { name: "BANDCAMP" })).toHaveAttribute("href", "https://shenao.bandcamp.com/");
      expect(footer.getByRole("link", { name: "SOUNDCLOUD" })).toHaveAttribute("href", "https://soundcloud.com/shen-ao");
      expect(footer.getByRole("link", { name: "MIXCLOUD" })).toHaveAttribute("href", "https://www.mixcloud.com/teendrum/");
      expect(footer.getByRole("link", { name: "INSTAGRAM" })).toHaveAttribute("href", "https://www.instagram.com/shenaoooooo/");
    });
  });

  it("routes each primary commissioned MUSIC INFO button to its internal detail page", () => {
    const primaryInfoRoutes = [
      ["role-model", "/work/role-model"],
      ["fancy-a-bite", "/work/fancy-a-bite"],
      ["untitled-land", "/work/untitled-land"],
      ["clouds-from-underground", "/work/clouds-from-underground"],
      ["cctv-selected-broadcast-work", "/work/cctv-selected-broadcast-work"]
    ] as const;

    for (const [slug, route] of primaryInfoRoutes) {
      cleanup();
      window.history.replaceState({}, "", "/music");
      render(<App />);
      fireEvent.click(within(screen.getByTestId(`music-index-item-${slug}`)).getByRole("button", { name: "INFO" }));
      expect(window.location.pathname).toBe(route);
    }
  });

  it("renders LIVE as four scoped performance practice sections", () => {
    window.history.replaceState({}, "", "/live");
    render(<App />);

    const main = within(screen.getByRole("main"));
    expect(main.getByRole("heading", { level: 1, name: "LIVE" })).toBeInTheDocument();
    expect(main.queryByRole("heading", { level: 2, name: "ARCHIVE" })).not.toBeInTheDocument();

    expect([...screen.getByRole("main").querySelectorAll("section.live-section > h2")].map((heading) => heading.textContent)).toEqual([
      "CURATION / COMMUNITY",
      "ORIGINAL MUSIC LIVE",
      "DJ / TEENDRUM",
      "PIANO / KEYBOARD"
    ]);

    const originalRows = screen.getAllByTestId(/original-live-row-/);
    expect(originalRows.map((row) => within(row).getByTestId("live-date").textContent)).toEqual([
      "17 JUN 2026",
      "17 JUL 2026",
      "23 JUL 2026",
      "08 AUG 2026"
    ]);
    expect(originalRows[0]).toHaveTextContent("THE GEORGE TAVERN / LONDON");
    expect(originalRows[0]).toHaveTextContent("WITH VISIT ME / BARRELEYE / GUTHLAC");
    expect(originalRows[1]).toHaveTextContent("YUANLIAO SPACE / BEIJING");
    expect(originalRows[1]).toHaveTextContent("WITH 4CHANNELCLUB / CLOUD CHOIR");
    expect(originalRows[2]).toHaveTextContent("SPANNERS / LONDON");
    expect(originalRows[2]).toHaveTextContent("WITH VIC BANG / YOTO / K MEANS");
    expect(originalRows[3]).toHaveTextContent("LOOSE.FM / LONDON");
    expect(originalRows[3]).toHaveTextContent("DUO WITH AVIN NOORBAKHSH");
    expect(screen.queryByText("23 MAY 2026")).not.toBeInTheDocument();
    expect(screen.queryByText("SHAI SPACE / LONDON")).not.toBeInTheDocument();

    const pianoSection = within(screen.getByTestId("live-piano-keyboard"));
    const soloConcertBlock = screen.getByTestId("live-solo-concert-2018");
    expect(within(soloConcertBlock).getByRole("heading", { level: 3, name: "2018 SOLO CONCERT" })).toBeInTheDocument();
    expect(within(soloConcertBlock).getByText("2018")).toBeInTheDocument();
    expect(within(soloConcertBlock).getByText("TIANJIN CONCERT HALL / RUXI ART GALLERY")).toBeInTheDocument();
    expect(within(soloConcertBlock).getByText("SOLO CONCERT")).toBeInTheDocument();
    expect(within(soloConcertBlock).getByRole("link", { name: "WATCH ↗" })).toHaveAttribute("href", "https://www.youtube.com/watch?v=T8jVsSjHzhA");
    expect(within(soloConcertBlock).getAllByTestId("piano-solo-concert-image").map((image) => image.getAttribute("src"))).toEqual([
      "/assets/live/piano-keyboard/solo-concert-2018-poster-no-black-border.jpeg",
      "/assets/live/piano-keyboard/solo-concert-2018-stage-wide-no-black-border.jpeg",
      "/assets/live/piano-keyboard/solo-concert-2018-keyboard-performance-no-black-border.jpeg"
    ]);
    expect(pianoSection.getAllByTestId("piano-solo-concert-image")).toHaveLength(3);
    expect(pianoSection.getAllByTestId("piano-archive-image")).toHaveLength(15);
    expect(pianoSection.getAllByTestId("piano-archive-image").map((image) => image.getAttribute("src"))).toEqual([
      "/assets/live/piano-keyboard/contemporary-classical-01.jpeg",
      "/assets/live/piano-keyboard/puregolds-ao-evan-nicolls.jpeg",
      "/assets/live/piano-keyboard/contemporary-classical-03.jpeg",
      "/assets/live/piano-keyboard/contemporary-classical-04.jpeg",
      "/assets/live/piano-keyboard/daylight-music-2024-poster.jpeg",
      "/assets/live/piano-keyboard/improvisation-rock-electronic-01.jpeg",
      "/assets/live/piano-keyboard/improvisation-rock-electronic-02.jpeg",
      "/assets/live/piano-keyboard/improvisation-rock-electronic-03.jpeg",
      "/assets/live/piano-keyboard/improvisation-rock-electronic-04.jpeg",
      "/assets/live/piano-keyboard/improvisation-rock-electronic-05.jpeg",
      "/assets/live/piano-keyboard/band-jazz-soul-01.jpeg",
      "/assets/live/piano-keyboard/band-jazz-soul-02.jpeg",
      "/assets/live/piano-keyboard/band-jazz-soul-03.jpeg",
      "/assets/live/piano-keyboard/honeydew-live-poster-red.jpeg",
      "/assets/live/piano-keyboard/honeydew-live-poster-blue.jpeg"
    ]);
    expect([...screen.getByTestId("live-piano-keyboard").querySelectorAll(".piano-keyboard-group > h3")].map((heading) => heading.textContent)).toEqual([
      "CONTEMPORARY CLASSICAL / CROSS-MEDIA / EXPERIMENTAL",
      "IMPROVISATION / ROCK / ELECTRONIC",
      "BAND / JAZZ / SOUL"
    ]);

    const teendrumSection = within(screen.getByTestId("live-teendrum"));
    expect(teendrumSection.getByText("TEENDRUM")).toBeInTheDocument();
    expect(teendrumSection.getByText("DJ")).toBeInTheDocument();
    expect(teendrumSection.getByText("ELECTRO / AMBIENT / IDM / BREAKS / LEFT-FIELD")).toBeInTheDocument();
    expect(teendrumSection.getByRole("link", { name: "PROFILE / RESIDENT ADVISOR ↗" })).toHaveAttribute("href", "https://ra.co/dj/teendrum");
    expect(teendrumSection.getByRole("link", { name: "LISTEN / MIXCLOUD ↗" })).toHaveAttribute("href", "https://www.mixcloud.com/teendrum/");
    expect(teendrumSection.getAllByTestId("teendrum-archive-image").map((image) => image.getAttribute("src"))).toEqual([
      "/assets/live/teendrum/teendrum-baihui-live.jpeg",
      "/assets/live/teendrum/teendrum-eerawai-ambient-series.jpeg",
      "/assets/live/teendrum/teendrum-mclab-poster.jpeg"
    ]);

    const curationSection = within(screen.getByTestId("live-curation-community"));
    expect(curationSection.getByText("NO IDEA")).toBeInTheDocument();
    expect(curationSection.getByText("RADIO / LIVE EVENTS")).toBeInTheDocument();
    expect(screen.queryByText(/MEDIA SLOT/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument();
    fireEvent.click(curationSection.getByRole("button", { name: "VIEW PROJECT → NO IDEA" }));
    expect(window.location.pathname).toBe("/work/no-idea");

    cleanup();
    window.history.replaceState({}, "", "/live");
    render(<App />);
    const refreshedCurationSection = within(screen.getByTestId("live-curation-community"));

    expect(refreshedCurationSection.getByText("NO IDEA")).toBeInTheDocument();
    expect(refreshedCurationSection.getByText("RADIO / LIVE EVENTS")).toBeInTheDocument();
    expect(refreshedCurationSection.getByText("OPENBAND")).toBeInTheDocument();
    expect(refreshedCurationSection.getByText("IMPROVISATION WORKSHOPS")).toBeInTheDocument();
    expect(refreshedCurationSection.getByText("BEIJING / LONDON")).toBeInTheDocument();
    fireEvent.click(refreshedCurationSection.getByRole("button", { name: "VIEW PROJECT → OPENBAND" }));
    expect(window.location.pathname).toBe("/work/openband-openscore");
  });

  it("renders ABOUT as an editorial profile from the portfolio biography", () => {
    render(<App initialPath="/about" />);

    const mainElement = screen.getByRole("main");
    const main = within(mainElement);
    expect(main.getByRole("heading", { level: 1, name: "ABOUT" })).toBeInTheDocument();
    expect(screen.queryByText("ABOUT / PORTFOLIO")).not.toBeInTheDocument();
    const aboutHero = within(screen.getByTestId("about-hero"));
    expect(aboutHero.getByText("MUSIC PRODUCER / COMPOSER & ARRANGER / EVENT ORGANISER")).toHaveClass("about-hero-identity");
    expect(aboutHero.getByAltText("Shen Ao performing at a microphone.")).toHaveAttribute("src", "/assets/about/shen-ao-hero.jpg");
    expect(aboutHero.getByAltText("Shen Ao performing at a microphone.")).toHaveClass("about-hero-image");
    expect(aboutHero.getByText(/Shen Ao is a music producer, composer, arranger and pianist born in Tianjin, China and based in London/i)).toBeInTheDocument();
    expect(screen.getByText(/Shen Ao is a music producer, composer, arranger and pianist born in Tianjin, China and based in London/i)).toBeInTheDocument();
    expect(screen.getByText(/His works draw on progressive rock, free jazz, Baroque, glitch pop and chiptune/i)).toBeInTheDocument();
    expect(screen.getByText(/In 2026, his work was released by Kit Records/i)).toBeInTheDocument();
    expect(screen.getByText(/Since 2020, he has produced music for more than 50 promotional packaging projects/i)).toBeInTheDocument();
    expect(screen.getByText(/In 2024, he launched no idea/i)).toBeInTheDocument();
    expect(screen.getByText(/City St George’s, University of London and Hypha HQ/i)).toBeInTheDocument();
    expect(screen.getByText(/Through these interrelated projects/i)).toBeInTheDocument();

    expect(Array.from(mainElement.querySelectorAll("section h2")).map((heading) => heading.textContent)).toEqual([
      "MUSIC",
      "SCORING / CROSS-MEDIA",
      "DJ / CURATION",
      "COMMUNITY / OPENBAND",
      "CLOSING STATEMENT",
      "CONTACT"
    ]);
    expect(main.queryByRole("heading", { name: "PROFILE" })).not.toBeInTheDocument();

    expect(mainElement.querySelectorAll("img")).toHaveLength(8);
    expect(Array.from(mainElement.querySelectorAll("img")).map((image) => image.getAttribute("src"))).toEqual([
      "/assets/about/shen-ao-hero.jpg",
      "/assets/about/cyberspace-bug-party-cassette.jpeg",
      "/assets/live/portfolio/george-tavern-2026.jpeg",
      "/assets/portfolio-projects/fancy-a-bite-stage-projection.jpeg",
      "/assets/role-model/DSC0944_1600px_sRGB.jpg",
      "/assets/live/teendrum/teendrum-baihui-live.jpeg",
      "/assets/practice/no-idea/no-idea-live-with-no-idea-poster.jpeg",
      "/assets/practice/openband/openband-monthly-posters.jpeg"
    ]);
    expect(mainElement.querySelector(".media-placeholder")).not.toBeInTheDocument();
    expect(main.queryByAltText("Childhood portrait of Shen Ao.")).not.toBeInTheDocument();
    expect(main.queryByRole("heading", { name: "EVENT PROJECTS" })).not.toBeInTheDocument();
    expect(main.queryByText("Selected Works")).not.toBeInTheDocument();
    expect(main.queryByText("Selected Projects")).not.toBeInTheDocument();
    expect(main.queryByText("Timeline")).not.toBeInTheDocument();
    expect(main.queryByText("CV")).not.toBeInTheDocument();
    expect(main.queryByText("NETEASE")).not.toBeInTheDocument();
    expect(main.queryByText("City, University of London")).not.toBeInTheDocument();
    expect(within(screen.getByLabelText("About contact")).getByRole("link", { name: "lerezero@gmail.com" })).toHaveAttribute("href", "mailto:lerezero@gmail.com");

    expect(screen.queryByRole("heading", { name: "ARTIST STATEMENT" })).not.toBeInTheDocument();
    expect(screen.queryByText(/Keyboard improvisation is central/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/experimentation is a working method/i)).not.toBeInTheDocument();
  });

  it("replaces old public routes with the current formal routes", async () => {
    const redirects = [
      ["/work", "/music", "MUSIC", ["WORK"]],
      ["/practice", "/live", "LIVE", ["PRACTICE"]],
      ["/press-radio", "/", "CYBERSPACE", ["PRESS / RADIO"]],
      ["/epk", "/about", "ABOUT", ["SHEN AO"]],
      ["/work/cyberspace", "/work/cyberspace-bug-party", "CYBERSPACE / BUG PARTY", ["CYBERSPACE"]],
      ["/work/bug-party", "/work/cyberspace-bug-party", "CYBERSPACE / BUG PARTY", ["BUG PARTY"]],
      ["/practice/no-idea/2026-05-23", "/work/no-idea", "NO IDEA", ["LIVE WITH NO IDEA"]]
    ] as const;

    for (const [from, to, expectedHeading, oldHeadings] of redirects) {
      cleanup();
      window.history.replaceState({}, "", "/before-redirect");
      window.history.pushState({}, "", from);
      render(<App />);

      expect(window.location.pathname).toBe(to);
      expect(within(screen.getByRole("main")).getByRole("heading", { name: expectedHeading })).toBeInTheDocument();
      for (const oldHeading of oldHeadings) {
        expect(within(screen.getByRole("main")).queryByRole("heading", { level: 1, name: oldHeading })).not.toBeInTheDocument();
      }

      window.history.back();
      await waitFor(() => expect(window.location.pathname).toBe("/before-redirect"));
    }
  });

  it("keeps formal detail routes reachable outside the primary navigation", () => {
    render(<App initialPath="/work/role-model" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "ROLE MODEL" })).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/work/no-idea" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "NO IDEA" })).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/work/openband-openscore" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "OPENBAND" })).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/work/cyberspace-bug-party" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "CYBERSPACE / BUG PARTY" })).toBeInTheDocument();
  });

  it("renders No Idea as a project page with radio, live events, featured event, and Openband next project", () => {
    window.history.replaceState({}, "", "/work/no-idea");
    render(<App />);

    const main = within(screen.getByRole("main"));
    expect(main.getByRole("heading", { level: 1, name: "NO IDEA" })).toBeInTheDocument();
    expect(main.getByText("PROJECT / CURATION")).toBeInTheDocument();
    expect(main.getByText("2024 —")).toBeInTheDocument();
    expect(main.getByText("RADIO / LIVE EVENTS")).toBeInTheDocument();
    expect(main.getByText("London")).toBeInTheDocument();

    expect(main.getByRole("heading", { name: "RADIO" })).toBeInTheDocument();
    expect(main.getByRole("heading", { name: "LIVE EVENTS" })).toBeInTheDocument();
    expect(main.getByRole("link", { name: "no idea radio ep.09 - transcribe 转译 w/ AL" })).toHaveAttribute("href", "https://baihui.live/shows/no-idea-w-al-schaffer-26-04-06/en/");
    expect(main.getByRole("link", { name: "no idea radio ep.08 tracing 勾勒 w/ AL" })).toHaveAttribute("href", "https://baihui.live/shows/no-idea-w-al-schaffer-26-01-12/en/");
    expect(main.getByRole("link", { name: "no idea ep.01 abandon 遗弃 w/ AL SCHAFFER" })).toHaveAttribute("href", "https://baihui.live/shows/no-idea-w-al-schaffer-24-07-04/en/");
    for (const titleLink of main.getAllByRole("link").filter((link) => link.closest(".no-idea-radio-entry"))) {
      expect(titleLink.closest("h3")).toHaveClass("no-idea-radio-title-small");
    }
    expect(main.getByText("Beijing 26.04.06")).toBeInTheDocument();
    expect(main.getByText("Beijing 26.01.12")).toBeInTheDocument();
    expect(main.getByText("London 24.07.04")).toBeInTheDocument();
    expect(main.getByAltText("no idea radio ep.09 - transcribe 转译 w/ AL artwork.")).toHaveAttribute("src", "/assets/no-idea/radio/no-idea-radio-ep-09-transcribe.jpg");
    expect(main.getByAltText("no idea ep.01 abandon 遗弃 w/ AL SCHAFFER artwork.")).toHaveAttribute("src", "/assets/no-idea/radio/no-idea-radio-ep-01-abandon.jpg");
    expect(main.getAllByRole("link", { name: "BAIHUI RADIO ↗" })[0]).toHaveAttribute("href", "https://baihui.live/hosts/no-idea/en/");
    expect(main.getAllByRole("link", { name: "RESIDENT ADVISOR ↗" })[0]).toHaveAttribute("href", "https://ra.co/promoters/183279");

    expect(main.getByRole("heading", { name: "FEATURED EVENT" })).toBeInTheDocument();
    const featuredEvent = document.querySelector(".no-idea-featured-event") as HTMLElement;
    expect(featuredEvent).toHaveClass("no-idea-featured-event-stacked");
    expect(featuredEvent.children[0]).toHaveClass("no-idea-featured-copy");
    expect(featuredEvent.children[1]).toHaveClass("no-idea-featured-gallery");
    const featuredCopy = featuredEvent.children[0] as HTMLElement;
    expect(featuredCopy.querySelector(".no-idea-featured-meta")).toBeInTheDocument();
    expect(featuredCopy.querySelectorAll(".no-idea-featured-meta-primary")).toHaveLength(2);
    expect(featuredCopy.querySelectorAll(".no-idea-featured-meta-secondary")).toHaveLength(7);
    const featuredImages = Array.from(featuredEvent.querySelectorAll(".no-idea-featured-image"));
    expect(featuredImages).toHaveLength(5);
    expect(featuredImages[0]).toHaveClass("no-idea-featured-image-large");
    for (const image of featuredImages.slice(1)) {
      expect(image).toHaveClass("no-idea-featured-image-supporting");
    }
    expect(main.getByText("23 MAY 2026")).toBeInTheDocument();
    expect(main.getAllByText("LIVE WITH NO IDEA").length).toBeGreaterThan(0);
    expect(main.getAllByText("SHAI SPACE").length).toBeGreaterThan(0);
    expect(main.getByText("STUDIO 4")).toBeInTheDocument();
    expect(main.getByText("17 LATONA RD")).toBeInTheDocument();
    expect(main.getAllByText("LONDON").length).toBeGreaterThan(0);
    expect(main.getByText("SE15 6RX")).toBeInTheDocument();
    expect(main.getByText("AMBIENT / EXPERIMENTAL")).toBeInTheDocument();
    expect(main.getByText("ORGANISER / PERFORMER")).toBeInTheDocument();
    for (const artist of ["Stella Z", "Kirk Barley", "Li Song", "James Creed", "Francis Moore", "Teendrum"]) {
      expect(main.getByText(artist)).toBeInTheDocument();
    }
    expect(main.getByRole("link", { name: "RESIDENT ADVISOR EVENT ↗" })).toHaveAttribute("href", "https://ra.co/events/2432167");
    expect(main.getByRole("link", { name: "SHAI SPACE ↗" })).toHaveAttribute("href", "https://www.instagram.com/shai.space/");
    const heroIntro = within(document.querySelector(".no-idea-project-intro") as HTMLElement);
    expect(heroIntro.getByRole("link", { name: "@noidearadio" })).toHaveAttribute("href", "https://www.instagram.com/noidea.radio/");
    expect(heroIntro.getByRole("link", { name: "@noidearadio" })).toHaveClass("no-idea-hero-social-link");
    expect(document.querySelector(".no-idea-project-links")).not.toBeInTheDocument();

    fireEvent.click(main.getByRole("button", { name: /NEXT PROJECT OPENBAND/ }));
    expect(window.location.pathname).toBe("/work/openband-openscore");

    for (const removedText of ["MEDIA SLOT", "DETAILS PENDING", "RADIO EPISODE ARTWORK", "placeholder", "北京", "伦敦"]) {
      expect(main.queryByText(removedText)).not.toBeInTheDocument();
    }
  });

  it("renders Openband with a text hero and city-grouped documentation", () => {
    window.history.replaceState({}, "", "/work/openband-openscore");
    render(<App />);

    const mainElement = screen.getByRole("main");
    const main = within(mainElement);
    expect(main.getByRole("heading", { level: 1, name: "OPENBAND" })).toBeInTheDocument();
    expect(main.getByText("PROJECT / COMMUNITY")).toBeInTheDocument();
    expect(main.getByText("2024 —")).toBeInTheDocument();
    expect(main.getByText("IMPROVISATION WORKSHOPS")).toBeInTheDocument();
    expect(within(mainElement.querySelector(".project-hero") as HTMLElement).getByText("BEIJING / LONDON")).toBeInTheDocument();
    expect(main.getByText("A Shen Ao-led improvisation workshop series developed at fRUITYSPACE in Beijing. The project creates an open setting for collective improvisation and collaborative music-making.")).toBeInTheDocument();

    const sectionHeadings = Array.from(mainElement.querySelectorAll("section h2")).map((heading) => heading.textContent);
    expect(sectionHeadings).toEqual([
      "EVENT POSTERS",
      "BEIJING / LONDON",
      "RECORDINGS / ARCHIVE",
      "CREDITS"
    ]);

    expect(mainElement.querySelector(".openband-hero-figure")).not.toBeInTheDocument();
    expect(mainElement.querySelector(".openband-monthly-section")).not.toBeInTheDocument();
    expect(mainElement.querySelector(".openband-one-year-section")).not.toBeInTheDocument();
    expect(main.queryByText("MONTHLY SESSIONS")).not.toBeInTheDocument();
    expect(main.queryByText("ONE YEAR")).not.toBeInTheDocument();
    const beijingPosters = within(mainElement.querySelector('[data-poster-city="BEIJING"]') as HTMLElement);
    const londonPosters = within(mainElement.querySelector('[data-poster-city="LONDON"]') as HTMLElement);
    expect(beijingPosters.getByRole("heading", { name: "BEIJING" })).toBeInTheDocument();
    expect(londonPosters.getByRole("heading", { name: "LONDON" })).toBeInTheDocument();
    expect(beijingPosters.getAllByRole("img").map((image) => image.getAttribute("src"))).toEqual([
      "/assets/openband/event-posters/beijing/openband-fruityspace-posters.jpg",
      "/assets/openband/event-posters/beijing/openband-small-group-workshop.jpg",
      "/assets/openband/event-posters/beijing/openband-ren-zhi-yuan-liao-workspace.jpg"
    ]);
    expect(londonPosters.getAllByRole("img").map((image) => image.getAttribute("src"))).toEqual([
      "/assets/openband/event-posters/london/openband-city-university-workshop.jpg",
      "/assets/openband/event-posters/london/openband-hypha-hq-workshop.jpg"
    ]);
    expect(mainElement.querySelectorAll(".openband-event-poster")).toHaveLength(5);
    const posterCaptions = Array.from(mainElement.querySelectorAll(".openband-event-poster-caption"));
    expect(posterCaptions).toHaveLength(5);
    [
      ["fRUITYSPACE / 水果空间", "BEIJING"],
      ["Small Group Workshop / 小组工作坊", "BEIJING"],
      ["Ren Zhi Yuan Liao Workspace / 人之原料工作空间", "BEIJING"],
      ["City St George’s, University of London", "LONDON"],
      ["Hypha HQ", "LONDON"]
    ].forEach(([venue, city], index) => {
      expect(posterCaptions[index]).toHaveTextContent(venue);
      expect(posterCaptions[index]).toHaveTextContent(city);
    });
    const beijingGroup = mainElement.querySelector('[data-documentation-city="BEIJING"]') as HTMLElement;
    const londonGroup = mainElement.querySelector('[data-documentation-city="LONDON"]') as HTMLElement;
    expect(beijingGroup).toBeInTheDocument();
    expect(londonGroup).toBeInTheDocument();
    expect(within(beijingGroup).getByRole("heading", { name: "BEIJING" })).toBeInTheDocument();
    expect(within(beijingGroup).getAllByAltText(/OPENBAND Beijing documentation/)).toHaveLength(5);
    expect(within(londonGroup).getByRole("heading", { name: "LONDON" })).toBeInTheDocument();
    expect(within(londonGroup).getAllByAltText(/OPENBAND London documentation/)).toHaveLength(4);
    expect(within(beijingGroup).getAllByRole("img").map((image) => image.getAttribute("src"))).toEqual([
      "/assets/openband/documentation/beijing/openband-beijing-01.jpg",
      "/assets/openband/documentation/beijing/openband-beijing-02.jpg",
      "/assets/openband/documentation/beijing/openband-beijing-03.jpg",
      "/assets/openband/documentation/beijing/openband-beijing-04.jpg",
      "/assets/openband/documentation/beijing/openband-beijing-05.jpg"
    ]);
    expect(within(londonGroup).getAllByRole("img").map((image) => image.getAttribute("src"))).toEqual([
      "/assets/openband/documentation/london/openband-london-01.jpg",
      "/assets/openband/documentation/london/openband-london-02.jpg",
      "/assets/openband/documentation/london/openband-london-03.jpg",
      "/assets/openband/documentation/london/openband-london-04.jpg"
    ]);

    expect(main.getByText("MIXCLOUD")).toBeInTheDocument();
    expect(main.getByText("OPENBAND ARCHIVE")).toBeInTheDocument();
    expect(main.getAllByRole("link", { name: "LISTEN TO RECORDINGS ↗" }).every((link) => link.getAttribute("href") === "https://www.mixcloud.com/al_schaffer/playlists/open-band/")).toBe(true);
    expect(main.getAllByRole("link", { name: "ACTIVITY ARCHIVE ↗" }).every((link) => link.getAttribute("href") === "https://alschaffer.blogspot.com/search/label/OPEN%20BAND")).toBe(true);

    const creditsSection = within(mainElement.querySelector(".openband-credits-section") as HTMLElement);
    for (const credit of [
      "Chu Xia / 初夏",
      "Tong Ge / 桐歌",
      "Jiang Yan / 姜闫",
      "Shen Ao / 申奡",
      "fRUITYSPACE / 水果空间",
      "Small Group Workshop / 小组工作坊",
      "Ren Zhi Yuan Liao Workspace / 人之原料工作空间",
      "City St George’s, University of London",
      "Hypha HQ / London"
    ]) {
      expect(creditsSection.getByText(credit)).toBeInTheDocument();
    }

    for (const removedText of ["MEDIA SLOT", "WORKSHOP POSTER", "DOCUMENTATION IMAGE", "DETAILS PENDING", "placeholder", "NEXT PROJECT", "FRUITYSPACE"]) {
      expect(main.queryByText(removedText)).not.toBeInTheDocument();
    }
    expect(main.queryByRole("button", { name: /NEXT PROJECT NO IDEA/ })).not.toBeInTheDocument();
    const backToLive = main.getByRole("button", { name: "BACK TO LIVE" });
    expect(backToLive.querySelector("span")).not.toBeInTheDocument();
    expect(backToLive.querySelector("strong")).toHaveTextContent("BACK TO LIVE");
    fireEvent.click(backToLive);
    expect(window.location.pathname).toBe("/live");
  });

  it("renders Cyberspace and Bug Party as one combined release detail page", () => {
    render(<App initialPath="/work/cyberspace-bug-party" />);

    const main = within(screen.getByRole("main"));
    expect(main.getByRole("heading", { level: 1, name: "CYBERSPACE / BUG PARTY" })).toBeInTheDocument();
    expect(main.getByAltText("Cyberspace album artwork")).toHaveAttribute("src", "/assets/cyberspace.jpg");
    expect(main.getByAltText("Bug Party album artwork")).toHaveAttribute("src", "/assets/bugparty.jpg");
    expect(main.getByRole("heading", { name: "Cyberspace" })).toBeInTheDocument();
    expect(main.getByRole("heading", { name: "Bug Party" })).toBeInTheDocument();
    expect(main.getAllByText("2026 / KIT RECORDS")).toHaveLength(2);
    expect(main.getByRole("link", { name: "Cyberspace LISTEN ↗" })).toHaveAttribute("href", "https://shenao.bandcamp.com/album/cyberspace");
    expect(main.getByRole("link", { name: "Bug Party LISTEN ↗" })).toHaveAttribute("href", "https://shenao.bandcamp.com/album/bug-party");
    expect(main.queryByRole("link", { name: "BANDCAMP ↗" })).not.toBeInTheDocument();
    expect(main.getByRole("heading", { name: "ABOUT THE RELEASE" })).toBeInTheDocument();
    expect(main.getByText(/In 2026, Shen Ao released two EPs through Kit Records/i)).toBeInTheDocument();
    expect(main.getByText("THE QUIETUS")).toBeInTheDocument();
    expect(main.getByText("CYBERSPACE / BUG PARTY")).toBeInTheDocument();
    expect(main.getByRole("link", { name: "READ ↗" })).toHaveAttribute("href", "https://thequietus.com/quietus-reviews/cassettes/spools-out-cassette-reviews-for-july-by-daryl-worthington/");
    expect(main.getByText("MUITO RADIO")).toBeInTheDocument();
    expect(main.getByText("CYBERSPACE")).toBeInTheDocument();
    expect(main.getByRole("link", { name: "VIEW ↗" })).toHaveAttribute("href", "https://muitoradio.com/buymusicclub/27");
    for (const venue of ["THE GEORGE TAVERN / LONDON", "YUANLIAO SPACE / BEIJING", "SPANNERS / LONDON", "LOOSE.FM / LONDON"]) {
      expect(main.getByText(venue)).toBeInTheDocument();
    }
    expect(main.getAllByRole("img").map((image) => image.getAttribute("src"))).toEqual(expect.arrayContaining([
      "/assets/live/portfolio/george-tavern-2026.jpeg",
      "/assets/live/portfolio/yuanliao-space-2026.jpeg",
      "/assets/live/portfolio/spanners-2026.jpeg",
      "/assets/live/portfolio/loose-fm-2026.jpeg"
    ]));
    expect(main.getByRole("button", { name: /NEXT PROJECT LET ME SPEAK/ })).toBeInTheDocument();
    for (const removedText of ["MEDIA PLACEHOLDER", "ADDITIONAL MEDIA", "PROJECT IMAGE"]) {
      expect(main.queryByText(removedText)).not.toBeInTheDocument();
    }
  });

  it("keeps Role Model links distinct and sends next project to Fancy a Bite", () => {
    render(<App initialPath="/work/role-model" />);

    const main = within(screen.getByRole("main"));
    expect(main.getByRole("link", { name: "PROJECT ↗" })).toHaveAttribute(
      "href",
      "https://www.thebluecoat.org.uk/library/event/dahong-hongxuan-wang-role-model"
    );
    expect(main.getByRole("link", { name: "LISTEN TO SOUNDTRACK ↗" })).toHaveAttribute(
      "href",
      "https://soundcloud.com/shen-ao/role-model-soundtrack"
    );

    fireEvent.click(main.getByRole("button", { name: /NEXT PROJECT FANCY A BITE\?/ }));
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "FANCY A BITE?" })).toBeInTheDocument();
  });

  it("uses the current MUSIC page order for release next-project navigation", () => {
    const cases = [
      ["/work/cyberspace-bug-party", /NEXT PROJECT LET ME SPEAK/, "/work/let-me-speak", "LET ME SPEAK"],
      ["/work/let-me-speak", /NEXT PROJECT TWO DREADFUL CHILDREN \/ UNIPRE/, "/work/two-dreadful-children-unipre", "TWO DREADFUL CHILDREN / UNIPRE"],
      ["/work/two-dreadful-children-unipre", /NEXT PROJECT BAMBOO BLEND/, "/work/bamboo-blend", "BAMBOO BLEND"],
      ["/work/bamboo-blend", /NEXT PROJECT ROLE MODEL/, "/work/role-model", "ROLE MODEL"]
    ] as const;

    for (const [route, buttonName, expectedPath, expectedHeading] of cases) {
      window.history.replaceState({}, "", route);
      const { unmount } = render(<App />);
      const main = within(screen.getByRole("main"));

      fireEvent.click(main.getByRole("button", { name: buttonName }));
      expect(window.location.pathname).toBe(expectedPath);
      expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: expectedHeading })).toBeInTheDocument();

      unmount();
      cleanup();
      window.history.replaceState({}, "", "/");
    }
  });

  it("renders release detail notes without media placeholders on the secondary MUSIC releases", () => {
    for (const route of ["/work/bamboo-blend", "/work/let-me-speak", "/work/two-dreadful-children-unipre"]) {
      const { unmount } = render(<App initialPath={route} />);
      const main = within(screen.getByRole("main"));

      for (const templateText of ["MEDIA PLACEHOLDER", "ADDITIONAL MEDIA", "PROJECT IMAGE", "MEDIA SLOT"]) {
        expect(main.queryByText(templateText)).not.toBeInTheDocument();
      }

      unmount();
      cleanup();
    }
  });

  it("renders the supplied secondary MUSIC release detail information", () => {
    render(<App initialPath="/work/let-me-speak" />);
    expect(screen.getByText("Released October 13, 2024")).toBeInTheDocument();
    expect(screen.getByText("Music & Lyrics by Shen Ao")).toBeInTheDocument();
    expect(screen.getByText("Vocal by Jovienne")).toBeInTheDocument();
    expect(screen.getByText("Mixing & Mastering by Gremwave")).toBeInTheDocument();
    expect(screen.getByText("Graphic Design by Haobin Wang")).toBeInTheDocument();
    cleanup();

    render(<App initialPath="/work/two-dreadful-children-unipre" />);
    let releaseFacts = screen.getByText("Tracklist:").closest(".release-detail-facts-content");
    expect(releaseFacts).not.toBeNull();
    expect(screen.getByText("Released July 6, 2022")).toBeInTheDocument();
    expect(within(releaseFacts as HTMLElement).getByText("Tracklist:")).toBeInTheDocument();
    expect(within(releaseFacts as HTMLElement).getByText("1. two dreadful children — 02:18")).toBeInTheDocument();
    expect(within(releaseFacts as HTMLElement).getByText("2. unipre — 03:05")).toBeInTheDocument();
    cleanup();

    render(<App initialPath="/work/bamboo-blend" />);
    releaseFacts = screen.getByText("Coffee Serving Process:").closest(".release-detail-facts-content");
    expect(releaseFacts).not.toBeNull();
    expect(screen.getByText("A Composition for a process of Coffee Presentation by Ru")).toBeInTheDocument();
    expect(screen.getByText("Sep 2024")).toBeInTheDocument();
    expect(within(releaseFacts as HTMLElement).getByText("Coffee Serving Process:")).toBeInTheDocument();
    expect(within(releaseFacts as HTMLElement).getByText("Milk Coffee [4mins]")).toBeInTheDocument();
    expect(within(releaseFacts as HTMLElement).getByText("Signature Coffee (Gin Tonic Mix) [4mins]")).toBeInTheDocument();
    expect(within(releaseFacts as HTMLElement).getByText("Espresso [3mins]")).toBeInTheDocument();
    expect(within(releaseFacts as HTMLElement).getByText("Q&A [4mins]")).toBeInTheDocument();
    expect(screen.getByText("Cover Art is an installation of Chun Han")).toBeInTheDocument();
    expect(screen.getByText("Mixing by Marac")).toBeInTheDocument();
    expect(screen.getByText("Release Date:")).toBeInTheDocument();
    expect(screen.getByText("23 October 2024")).toBeInTheDocument();
  });

  it("keeps every current work detail route free of template media remnants", () => {
    const routes = Array.from(new Set([
      "/work/cyberspace-bug-party",
      ...projects
        .filter((project) => project.slug !== "cyberspace" && project.slug !== "bug-party")
        .map((project) => `/work/${project.slug}`)
    ]));

    for (const route of routes) {
      const { unmount } = render(<App initialPath={route} />);
      const mainElement = screen.getByRole("main");
      const main = within(mainElement);

      expect(mainElement.querySelector(".media-placeholder")).not.toBeInTheDocument();
      for (const templateText of ["MEDIA PLACEHOLDER", "ADDITIONAL MEDIA", "PROJECT IMAGE"]) {
        expect(main.queryByText(templateText)).not.toBeInTheDocument();
      }

      unmount();
      cleanup();
    }
  });

  it("renders the confirmed Fancy A BITE? hero, stage gallery, and poster without media placeholders", () => {
    render(<App initialPath="/work/fancy-a-bite" />);

    const main = within(screen.getByRole("main"));
    expect(main.getAllByRole("img").map((image) => image.getAttribute("src"))).toEqual([
      "/assets/portfolio-projects/fancy-a-bite-stage-projection.jpeg",
      "/assets/portfolio-projects/fancy-a-bite-stage.jpeg",
      "/assets/portfolio-projects/fancy-a-bite-dark-stage.jpeg",
      "/assets/portfolio-projects/fancy-a-bite-monochrome-performance.jpeg",
      "/assets/portfolio-projects/fancy-a-bite-poster.jpeg"
    ]);
    expect(main.getByAltText("Performer in white beside blue live projection in Fancy A BITE?.")).toBeInTheDocument();
    expect(main.getByAltText("Fancy A BITE? performance poster for Camden People's Theatre.")).toBeInTheDocument();
    for (const placeholderText of ["HERO PHOTO", "SECONDARY STAGE IMAGE", "POSTER", "MEDIA SLOT"]) {
      expect(main.queryByText(placeholderText)).not.toBeInTheDocument();
    }
  });

  it("sends Fancy A BITE? to Untitled Land through the shared next-project sequence", () => {
    window.history.replaceState({}, "", "/work/fancy-a-bite");
    render(<App />);

    const main = within(screen.getByRole("main"));
    fireEvent.click(main.getByRole("button", { name: /NEXT PROJECT UNTITLED LAND/ }));
    expect(window.location.pathname).toBe("/work/untitled-land");
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "UNTITLED LAND" })).toBeInTheDocument();
  });

  it("renders every confirmed Untitled Land image without media placeholders", () => {
    render(<App initialPath="/work/untitled-land" />);

    const main = within(screen.getByRole("main"));
    expect(main.getAllByRole("img").map((image) => image.getAttribute("src"))).toEqual([
      "/assets/portfolio-projects/untitled-land-project.jpeg",
      "/assets/portfolio-projects/untitled-land-film-still-01.png",
      "/assets/portfolio-projects/untitled-land-film-still-02.png",
      "/assets/portfolio-projects/untitled-land-film-still-03.png",
      "/assets/portfolio-projects/untitled-land-film-still-04.png",
      "/assets/portfolio-projects/untitled-land-film-still-05.png"
    ]);
    for (const placeholderText of ["HERO / PROJECT IMAGE", "FILM STILL", "MEDIA PLACEHOLDER", "ADDITIONAL MEDIA", "PROJECT IMAGE"]) {
      expect(main.queryByText(placeholderText)).not.toBeInTheDocument();
    }
  });

  it("keeps the Untitled Land project and SoundCloud links while hiding NetEase from the English UI", () => {
    render(<App initialPath="/work/untitled-land" />);

    const main = within(screen.getByRole("main"));
    const watchLink = main.getByRole("link", { name: "WATCH / PROJECT ↗" });
    expect(watchLink).toHaveAttribute("href", "https://2022art.cafa.edu.cn/pc/infoDetails/331");
    expect(main.getByText("This project page may not be accessible outside mainland China.")).toBeInTheDocument();
    expect(main.getByRole("link", { name: "SOUNDCLOUD ↗" })).toHaveAttribute(
      "href",
      "https://soundcloud.com/shen-ao/sets/untitled-land"
    );
    expect(main.queryByRole("link", { name: "NETEASE MUSIC ↗" })).not.toBeInTheDocument();
  });

  it("sends Untitled Land to Clouds from Underground through the shared next-project sequence", () => {
    window.history.replaceState({}, "", "/work/untitled-land");
    render(<App />);

    const main = within(screen.getByRole("main"));
    fireEvent.click(main.getByRole("button", { name: /NEXT PROJECT CLOUDS FROM UNDERGROUND/ }));
    expect(window.location.pathname).toBe("/work/clouds-from-underground");
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "CLOUDS FROM UNDERGROUND" })).toBeInTheDocument();
  });

  it("renders Clouds from Underground media, links, related work, and next project from shared content", () => {
    window.history.replaceState({}, "", "/work/clouds-from-underground");
    render(<App />);

    const main = within(screen.getByRole("main"));
    expect(main.getAllByRole("img").map((image) => image.getAttribute("src"))).toEqual([
      "/assets/portfolio-projects/clouds-from-underground-cover.jpg",
      "/assets/portfolio-projects/clouds-from-underground-film-still-01.jpg",
      "/assets/portfolio-projects/clouds-from-underground-film-still-02.jpg",
      "/assets/portfolio-projects/clouds-from-underground-film-still-03.jpg",
      "/assets/portfolio-projects/clouds-from-underground-film-still-04.jpg",
      "/assets/portfolio-projects/clouds-from-underground-film-still-05.jpg",
      "/assets/portfolio-projects/clouds-from-underground-film-still-06.jpg",
      "/assets/portfolio-projects/yisuo-performance-video.jpg"
    ]);
    expect(main.getByRole("link", { name: "WATCH ↗" })).toHaveAttribute("href", "https://youtu.be/BbDtWCoWifU");
    expect(main.getByRole("link", { name: "NETEASE MUSIC ↗" })).toHaveAttribute("href", "https://music.163.com/#/album?id=131037851");
    expect(main.getByText("This link may not be accessible outside mainland China.")).toBeInTheDocument();
    for (const placeholderText of ["HERO / PROJECT ARTWORK", "FILM STILL", "RELATED WORK MEDIA"]) {
      expect(main.queryByText(placeholderText)).not.toBeInTheDocument();
    }

    fireEvent.click(main.getByRole("button", { name: /NEXT PROJECT CCTV \/ SELECTED BROADCAST WORK/ }));
    expect(window.location.pathname).toBe("/work/cctv-selected-broadcast-work");
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "SELECTED BROADCAST WORK / CCTV-13" })).toBeInTheDocument();
  });

  it("renders CCTV with one hero image and three selected broadcast cards", () => {
    render(<App initialPath="/work/cctv-selected-broadcast-work" />);

    const main = within(screen.getByRole("main"));
    expect(main.getAllByRole("img").map((image) => image.getAttribute("src")).slice(0, 4)).toEqual([
      "/assets/portfolio-projects/cctv-13-space-station.jpeg",
      "/assets/portfolio-projects/cctv-long-teng-hu-yue.jpeg",
      "/assets/portfolio-projects/cctv-zai-xi-wang-de-tian-ye.jpeg",
      "/assets/portfolio-projects/cctv-rui-tu-cheng-xiang.jpeg"
    ]);
    expect(main.getByRole("img", { name: "CCTV-13 China Space Station promotional image from the portfolio." })).toBeInTheDocument();
    expect(main.queryByLabelText("Selected Broadcast Work / CCTV-13 image gallery")).not.toBeInTheDocument();
    expect(main.getAllByTestId("selected-case")).toHaveLength(3);
    expect(main.getAllByText("Some links on this page may not be accessible outside mainland China.")).toHaveLength(1);
    for (const placeholderText of ["REPRESENTATIVE HERO", "SELECTED WORK THUMBNAIL", "CCTV-13", "大美边疆行", "高端访谈"]) {
      expect(main.queryByText(placeholderText)).not.toBeInTheDocument();
    }
  });

  it("sends CCTV back to MUSIC instead of the shared next-project sequence", () => {
    window.history.replaceState({}, "", "/work/cctv-selected-broadcast-work");
    render(<App />);

    const main = within(screen.getByRole("main"));
    expect(main.queryByText("NEXT PROJECT")).not.toBeInTheDocument();
    const backToMusic = main.getByRole("button", { name: "BACK TO MUSIC" });
    expect(backToMusic.querySelector("span")).not.toBeInTheDocument();
    expect(backToMusic.querySelector("strong")).toHaveTextContent("BACK TO MUSIC");
    fireEvent.click(backToMusic);
    expect(window.location.pathname).toBe("/music");
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "MUSIC" })).toBeInTheDocument();
  });

  it("keeps each selected CCTV watch link separate from the card content", () => {
    render(<App initialPath="/work/cctv-selected-broadcast-work" />);

    const main = within(screen.getByRole("main"));
    const selectedCases = main.getAllByTestId("selected-case");
    expect(within(selectedCases[0]).getByRole("link", { name: "WATCH ↗" })).toHaveAttribute("href", "https://www.bilibili.com/video/BV1pS4y1y72L");
    expect(within(selectedCases[1]).getByRole("link", { name: "WATCH ↗" })).toHaveAttribute("href", "https://www.bilibili.com/video/BV1Jt4y1s7De");
    expect(within(selectedCases[2]).getByRole("link", { name: "WATCH ↗" })).toHaveAttribute("href", "https://www.bilibili.com/video/BV11d4y1V7jD");
    expect(within(selectedCases[0]).getByRole("heading", { name: "Year of the Tiger: A Festive Chinese New Year" })).toBeInTheDocument();
    expect(within(selectedCases[1]).getByRole("heading", { name: "In the Field of Hope" })).toBeInTheDocument();
    expect(within(selectedCases[2]).getByRole("heading", { name: "Year of the Rabbit: A Festive Chinese New Year" })).toBeInTheDocument();
  });

  it("renders the CCTV archive gallery with 24 English poster titles and only confirmed links", () => {
    render(<App initialPath="/work/cctv-selected-broadcast-work" />);

    const main = within(screen.getByRole("main"));
    const archiveGallery = main.getByLabelText("CCTV archive gallery");
    expect(within(archiveGallery).getAllByRole("img")).toHaveLength(24);
    expect(within(archiveGallery).getAllByTestId("archive-gallery-item")).toHaveLength(24);
    expect(within(archiveGallery).getAllByRole("link")).toHaveLength(3);
    expect(within(archiveGallery).getByRole("link", { name: /CCTV News Channel: China Space Station Series/ })).toHaveAttribute("href", "https://www.bilibili.com/video/BV1A5DbY9EBL");
    expect(within(archiveGallery).getByRole("link", { name: /Journey Along China’s Frontiers/ })).toHaveAttribute("href", "https://www.bilibili.com/video/BV1Wt4y1H78k");
    expect(within(archiveGallery).getByRole("link", { name: /Top Talk/ })).toHaveAttribute("href", "http://www.bilibili.com/video/BV16f7BzMEJU");
    expect(main.getAllByText("Some links on this page may not be accessible outside mainland China.")).toHaveLength(1);
    expect(main.queryByRole("heading", { level: 2, name: "ARCHIVE" })).not.toBeInTheDocument();
    expect(archiveGallery.textContent).not.toMatch(/[\u3400-\u9fff]/);
    expect(archiveGallery.textContent).not.toMatch(/\b(QUAN|YUE|GOU|QI|ZHEN|CHUN|XIN|DA|FEN|LIANG|JIU|ZOU|FEI|GAO|KAO)\b/i);
  });

  it("maps the old release routes and release INFO buttons to the combined detail page", () => {
    render(<App initialPath="/work/cyberspace" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "CYBERSPACE / BUG PARTY" })).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/work/bug-party" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "CYBERSPACE / BUG PARTY" })).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/" />);
    fireEvent.click(within(screen.getByTestId("home-featured-music")).getAllByRole("button", { name: "INFO" })[0]);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "CYBERSPACE / BUG PARTY" })).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/music" />);
    fireEvent.click(within(screen.getByTestId("music-featured-releases")).getAllByRole("button", { name: "INFO" })[0]);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "CYBERSPACE / BUG PARTY" })).toBeInTheDocument();
  });

  it("navigates between the four primary pages", () => {
    render(<App initialPath="/" />);

    fireEvent.click(screen.getByRole("button", { name: "MUSIC" }));
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "MUSIC" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "LIVE" }));
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "LIVE" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "ABOUT" }));
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "ABOUT" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "HOME" }));
    expect(within(screen.getByTestId("home-featured-music")).getByRole("heading", { name: "CYBERSPACE" })).toBeInTheDocument();
  });
});
