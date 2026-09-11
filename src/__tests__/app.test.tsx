import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";

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
    expect(footer.queryByText("LONDON")).not.toBeInTheDocument();
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

  it("renders LIVE as one reverse-chronological archive", () => {
    render(<App initialPath="/live" />);

    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "LIVE" })).toBeInTheDocument();
    expect(screen.queryByText("LIVE / ARCHIVE")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "ARCHIVE" })).toBeInTheDocument();
    expect(screen.queryByText("LOCATION / VENUE")).not.toBeInTheDocument();
    expect(screen.queryByText("EVENT / ACTIVITY")).not.toBeInTheDocument();

    const rows = screen.getAllByTestId(/live-archive-row-/);
    expect(rows.map((row) => within(row).getByTestId("live-date").textContent)).toEqual([
      "08 AUG 2026",
      "23 JUL 2026",
      "17 JUL 2026",
      "17 JUN 2026",
      "23 MAY 2026",
      "2018"
    ]);
    expect(rows[0]).toHaveTextContent("LOOSE.FM / LONDON");
    expect(rows[0]).toHaveTextContent("DUO WITH AVIN NOORBAKHSH");
    expect(rows[0]).toHaveTextContent("LIVE PERFORMANCE");
    expect(rows[4]).toHaveTextContent("SHAI SPACE / LONDON");
    expect(rows[4]).toHaveTextContent("LIVE WITH NO IDEA");
    expect(rows[4]).toHaveTextContent("ORGANISER + PERFORMER");
    expect(rows[5]).toHaveTextContent("TIANJIN CONCERT HALL / RUXI ART GALLERY");
    expect(rows[5]).toHaveTextContent("SOLO CONCERT");
    expect(within(rows[0]).getByRole("img")).toHaveAttribute("src", "/assets/live/portfolio/loose-fm-2026.jpeg");
    expect(within(rows[1]).getByRole("img")).toHaveAttribute("src", "/assets/live/portfolio/spanners-2026.jpeg");
    expect(within(rows[2]).getByRole("img")).toHaveAttribute("src", "/assets/live/portfolio/yuanliao-space-2026.jpeg");
    expect(within(rows[3]).getByRole("img")).toHaveAttribute("src", "/assets/live/portfolio/george-tavern-2026.jpeg");
    expect(within(rows[4]).getByRole("img")).toHaveAttribute("src", "/assets/no-idea/2026-05-23/hero.webp");
    expect(within(rows[5]).getByRole("img")).toHaveAttribute("src", "/assets/live/portfolio/solo-concert-2018.jpeg");

    expect(screen.queryByRole("heading", { name: "SELECTED PERFORMANCES / 2026" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "DJ / TEENDRUM" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "EARLIER PERFORMANCE" })).not.toBeInTheDocument();
  });

  it("renders ABOUT from Portfolio pages 1-3 without the previous artist statement", () => {
    render(<App initialPath="/about" />);

    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "ABOUT" })).toBeInTheDocument();
    expect(screen.queryByText("ABOUT / PORTFOLIO")).not.toBeInTheDocument();
    expect(screen.getByText("MUSIC PRODUCER / COMPOSER & ARRANGER / EVENT ORGANISER")).toBeInTheDocument();
    expect(screen.getByText(/Shen Ao is a music producer, composer, arranger and pianist born in Tianjin, China and based in London/i)).toBeInTheDocument();
    expect(screen.getByText(/His works draw on progressive rock, free jazz, Baroque, glitch pop and chiptune/i)).toBeInTheDocument();
    expect(screen.getByText(/In 2026, his work was released by Kit Records/i)).toBeInTheDocument();
    expect(screen.getByText(/Since 2020, he has produced music for more than 50 promotional packaging projects/i)).toBeInTheDocument();
    expect(screen.getByText(/In 2024, he launched no idea/i)).toBeInTheDocument();
    expect(screen.getAllByText(/OPENBAND/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("heading", { name: "MUSIC" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "SCORING" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "EVENT PROJECTS" })).toBeInTheDocument();
    const aboutLinks = within(screen.getByLabelText("About links"));
    expect(aboutLinks.getByRole("link", { name: "BANDCAMP" })).toHaveAttribute("href", "https://shenao.bandcamp.com/");
    expect(aboutLinks.getByRole("link", { name: "NETEASE" })).toHaveAttribute("href", "https://music.163.com/#/artist?id=46923018");
    expect(aboutLinks.getByRole("link", { name: "SOUNDCLOUD" })).toHaveAttribute("href", "https://soundcloud.com/shen-ao/");
    expect(aboutLinks.getByRole("link", { name: "MIXCLOUD" })).toHaveAttribute("href", "https://www.mixcloud.com/teendrum/");
    expect(aboutLinks.getByRole("link", { name: "lerezero@gmail.com" })).toHaveAttribute("href", "mailto:lerezero@gmail.com");

    expect(screen.queryByRole("heading", { name: "ARTIST STATEMENT" })).not.toBeInTheDocument();
    expect(screen.queryByText(/Keyboard improvisation is central/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/experimentation is a working method/i)).not.toBeInTheDocument();
  });

  it("keeps old routes and detail pages reachable outside the primary navigation", () => {
    render(<App initialPath="/work" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "WORK" })).toBeInTheDocument();
    expectOnlyPrimaryNavItems(["HOME", "MUSIC", "LIVE", "ABOUT"]);

    cleanup();
    render(<App initialPath="/practice" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "PRACTICE" })).toBeInTheDocument();
    expectOnlyPrimaryNavItems(["HOME", "MUSIC", "LIVE", "ABOUT"]);

    cleanup();
    render(<App initialPath="/press-radio" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "PRESS / RADIO" })).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/epk" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "SHEN AO" })).toBeInTheDocument();
  });

  it("keeps legacy detail routes reachable after removing them from the primary IA", () => {
    render(<App initialPath="/work/role-model" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "ROLE MODEL" })).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/work/no-idea" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "NO IDEA" })).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/work/openband-openscore" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "OPENBAND" })).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/practice/no-idea/2026-05-23" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "LIVE WITH NO IDEA" })).toBeInTheDocument();
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
    expect(main.getByRole("button", { name: /NEXT PROJECT ROLE MODEL/ })).toBeInTheDocument();
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
