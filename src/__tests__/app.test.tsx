import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";

afterEach(cleanup);

describe("SHEN AO Round 1 site", () => {
  it("renders the Plan B home hero and featured music without changing the artist facts", () => {
    render(<App initialPath="/" />);

    expect(screen.getByRole("heading", { name: "SHEN AO" })).toBeInTheDocument();
    expect(screen.getByText("COMPOSER / PRODUCER / SOUND ARTIST")).toBeInTheDocument();
    expect(screen.getByAltText("Hand-drawn Plan B character")).toHaveAttribute("src", "/assets/plan-b/monster-pink.png");
    expect(screen.getByAltText("Plan B pixel play marker")).toHaveAttribute("src", "/assets/plan-b/pixel-play.png");
    expect(screen.getByRole("heading", { name: "CYBERSPACE" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "BUG PARTY" })).toBeInTheDocument();
    expect(screen.getByAltText("Cyberspace album artwork")).toHaveAttribute("src", "/assets/cyberspace.jpg");
    expect(screen.getByAltText("Bug Party album artwork")).toHaveAttribute("src", "/assets/bugparty.jpg");
    expect(screen.getAllByText("KIT RECORDS").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("ALBUM / RELEASE")).toHaveLength(2);
    const featuredMusic = within(screen.getByTestId("plan-b-featured-music"));
    expect(featuredMusic.queryByText("MENU ITEM")).not.toBeInTheDocument();
    expect(featuredMusic.getByText("LEFT ON DESK")).toBeInTheDocument();
    expect(featuredMusic.getAllByRole("button", { name: "VIEW PROJECT" })).toHaveLength(2);
    expect(featuredMusic.getAllByRole("link", { name: "LISTEN" })).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "PRESS / RADIO" })).toBeInTheDocument();
    expect(screen.getByText("NTS RADIO — TREVOR JACKSON")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "VIEW PRESS / RADIO" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "SELECTED CONTEXTS" })).not.toBeInTheDocument();
    expect(screen.queryByText("CONTEXTS")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Data horizon signal field")).not.toBeInTheDocument();
    expect(screen.queryByText("申奡")).not.toBeInTheDocument();
    expect(screen.queryByAltText(/portrait/i)).not.toBeInTheDocument();
  });

  it("renders WORK with selected works, archive, and functional filters", () => {
    render(<App initialPath="/work" />);

    expect(screen.getByRole("heading", { name: "WORK" })).toBeInTheDocument();
    expect(screen.getByText("Selected Works")).toBeInTheDocument();
    expect(screen.getByTestId("selected-works")).toHaveClass("editorial-works");
    expect(screen.getByTestId("selected-work-cyberspace")).toHaveClass("layout-square-lead");
    expect(screen.getByTestId("selected-work-bug-party")).toHaveClass("layout-bug-release");
    expect(screen.getAllByText("KIT RECORDS")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "MOVING IMAGE" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "MOVING IMAGE" }));

    expect(screen.getAllByText("ROLE MODEL").length).toBeGreaterThan(0);
    expect(screen.queryByText("FANCY A BITE?")).not.toBeInTheDocument();
  });

  it("renders the two required project detail routes with known facts only", () => {
    render(<App initialPath="/work/cyberspace" />);

    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "CYBERSPACE" })).toBeInTheDocument();
    expect(screen.getByText("KIT RECORDS")).toBeInTheDocument();
    expect(screen.getByAltText("Cyberspace album artwork")).toHaveAttribute("src", "/assets/cyberspace.jpg");
    expect(screen.queryByText(/track/i)).not.toBeInTheDocument();

    cleanup();
    render(<App initialPath="/work/bug-party" />);
    expect(screen.getByRole("heading", { name: "BUG PARTY" })).toBeInTheDocument();
    expect(screen.getByAltText("Bug Party album artwork")).toHaveAttribute("src", "/assets/bugparty.jpg");

    cleanup();
    render(<App initialPath="/work/role-model" />);
    expect(screen.getByRole("heading", { name: "ROLE MODEL" })).toBeInTheDocument();
    expect(screen.getByText("HONGXUAN WANG")).toBeInTheDocument();
    expect(screen.getByText("Photography: Roger Sinek")).toBeInTheDocument();
    expect(screen.getByAltText("Exhibition view showing a projected close-up from Role Model.")).toHaveAttribute("src", "/assets/role-model/DSC0944_1600px_sRGB.jpg");
    expect(screen.getByAltText("Exhibition view showing a filming scene projected in Role Model.")).toHaveAttribute("src", "/assets/role-model/DSC0919_1600px_sRGB.jpg");
    expect(screen.getByAltText("Exhibition view showing a black-and-white family portrait projected in Role Model.")).toHaveAttribute("src", "/assets/role-model/DSC0937_1600px_sRGB.jpg");
    expect(screen.getByAltText("Exhibition view showing a landscape scene projected in Role Model.")).toHaveAttribute("src", "/assets/role-model/DSC0946_1600px_sRGB.jpg");
    expect(screen.getByRole("link", { name: "VIEW PROJECT" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "WATCH" })).not.toBeInTheDocument();
    expect(screen.queryByText(/festival/i)).not.toBeInTheDocument();
  });

  it("recognizes GitHub Pages Plan B subpath routes", () => {
    render(<App initialPath="/shen-ao-site-plan-b/work/cyberspace" />);

    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "CYBERSPACE" })).toBeInTheDocument();
  });

  it("renders complete top-level Plan B routes from the primary navigation", () => {
    render(<App initialPath="/music" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "MUSIC" })).toBeInTheDocument();
    expect(screen.getAllByText("two dreadful children / unipre").length).toBeGreaterThan(0);

    cleanup();
    render(<App initialPath="/live" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "LIVE" })).toBeInTheDocument();
    expect(screen.getByText("A recording captures only one aspect of a performance. The live work is different every time.")).toBeInTheDocument();
    expect(screen.queryByText(/chronology/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/verified/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/venue/i)).not.toBeInTheDocument();

    cleanup();
    render(<App initialPath="/practice" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "PRACTICE" })).toBeInTheDocument();
    expect(screen.getByText(/Music-making and event-making occupy different roles/)).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/press-radio" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "PRESS / RADIO" })).toBeInTheDocument();
    expect(screen.getByText("Spool's Out: Cassette Reviews for July")).toBeInTheDocument();
    expect(screen.getByText("DARYL WORTHINGTON")).toBeInTheDocument();
    expect(screen.getByText(/astounding statements of intent/)).toBeInTheDocument();
    expect(screen.getByText("TREVOR JACKSON")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "LISTEN / VIEW TRACKLIST" })).toHaveLength(2);
    expect(screen.queryByText(/Amazon/i)).not.toBeInTheDocument();

    cleanup();
    render(<App initialPath="/about" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "ABOUT" })).toBeInTheDocument();
    expect(screen.getByText("ARTIST STATEMENT")).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes("Goldsmiths, University of London"))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "MORE PRESS / RADIO" })).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/epk" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "SHEN AO" })).toBeInTheDocument();
    expect(screen.getByText("SHORT BIO")).toBeInTheDocument();
    expect(screen.getByText("SELECTED PRESS / RADIO")).toBeInTheDocument();
    expect(screen.getByText("MUITO RADIO")).toBeInTheDocument();
    expect(screen.queryByText(/download epk/i)).not.toBeInTheDocument();
  });

  it("renders the requested project detail routes as complete pages", () => {
    render(<App initialPath="/work/fancy-a-bite" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "FANCY A BITE?" })).toBeInTheDocument();
    expect(screen.getAllByText("MEDIA PLACEHOLDER").length).toBeGreaterThan(0);

    cleanup();
    render(<App initialPath="/work/no-idea" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "NO IDEA" })).toBeInTheDocument();
    expect(screen.getByText(/An independent ambient \/ experimental event and online-radio practice/)).toBeInTheDocument();
    expect(screen.getByText("SELECTED EVENTS")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "NO IDEA #2" })).toBeInTheDocument();
    expect(screen.getByText("ORGANISER + PERFORMER")).toBeInTheDocument();
    expect(screen.getByAltText("Shen Ao performing at No Idea #2 at Shai Space, London.")).toHaveAttribute("src", "/assets/no-idea/2026-05-23/hero.webp");
    expect(screen.getByAltText("No Idea #2 event poster.")).toHaveAttribute("src", "/assets/no-idea/2026-05-23/poster.webp");
    expect(screen.getByRole("button", { name: "VIEW EVENT" })).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/work/openband-openscore" />);
    expect(screen.getByRole("heading", { level: 1, name: "OPENBAND / OPENSCORE" })).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/work/clouds-from-underground" />);
    expect(screen.getByRole("heading", { level: 1, name: "CLOUDS FROM UNDERGROUND" })).toBeInTheDocument();
  });

  it("renders the No Idea event detail as a Practice sub-route with real media", () => {
    render(<App initialPath="/practice/no-idea/2026-05-23" />);

    expect(screen.getByRole("navigation").querySelector(".active")).toHaveTextContent("PRACTICE");
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "NO IDEA #2" })).toBeInTheDocument();
    expect(screen.getByText("NO IDEA / EVENT")).toBeInTheDocument();
    expect(screen.getByText("17 LATONA RD")).toBeInTheDocument();
    expect(screen.getByText("LONDON SE15 6RX")).toBeInTheDocument();
    expect(screen.getByText("AMBIENT / EXPERIMENTAL")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "VIEW ON RESIDENT ADVISOR" })).toHaveAttribute("href", "https://ra.co/events/2432167");
    expect(screen.getByAltText("Shen Ao performing at No Idea #2 at Shai Space, London.")).toHaveAttribute("src", "/assets/no-idea/2026-05-23/hero.webp");
    expect(screen.getByAltText("No Idea #2 event poster.")).toHaveAttribute("src", "/assets/no-idea/2026-05-23/poster.webp");
    expect(screen.getAllByAltText(/No Idea #2/)).toHaveLength(9);
    expect(screen.queryByText(/photography/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/18:30|19:00|7PM/)).not.toBeInTheDocument();
  });

  it("cross-references No Idea #2 from home, practice, and live without making it a top-level live project", () => {
    render(<App initialPath="/" />);

    expect(screen.getByText("NO IDEA #2")).toBeInTheDocument();
    expect(screen.getByText("SHAI SPACE / LONDON")).toBeInTheDocument();
    expect(screen.getByAltText("Shen Ao performing at No Idea #2 at Shai Space, London.")).toHaveAttribute("src", "/assets/no-idea/2026-05-23/hero.webp");
    expect(screen.getByAltText("No Idea #2 event poster.")).toHaveAttribute("src", "/assets/no-idea/2026-05-23/poster.webp");

    cleanup();
    render(<App initialPath="/practice" />);
    expect(screen.getByText("LATEST DOCUMENTED EVENT")).toBeInTheDocument();
    expect(screen.getByText("NO IDEA #2 / 23 MAY 2026")).toBeInTheDocument();
    expect(screen.getByAltText("No Idea #2 event poster.")).toHaveAttribute("src", "/assets/no-idea/2026-05-23/poster.webp");

    cleanup();
    render(<App initialPath="/live" />);
    expect(screen.getByText("NO IDEA #2")).toBeInTheDocument();
    expect(screen.getByText("ORGANISER + PERFORMER")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "VIEW EVENT" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1, name: "NO IDEA #2" })).not.toBeInTheDocument();
  });
});
