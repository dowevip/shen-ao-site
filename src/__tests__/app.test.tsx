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
    render(<App initialPath="/about" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "ABOUT" })).toBeInTheDocument();
    expect(screen.getByText("ARTIST STATEMENT")).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes("Goldsmiths, University of London"))).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/epk" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "SHEN AO" })).toBeInTheDocument();
    expect(screen.getByText("SHORT BIO")).toBeInTheDocument();
    expect(screen.queryByText(/download epk/i)).not.toBeInTheDocument();
  });

  it("renders the requested project detail routes as complete pages", () => {
    render(<App initialPath="/work/fancy-a-bite" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "FANCY A BITE?" })).toBeInTheDocument();
    expect(screen.getAllByText("MEDIA PLACEHOLDER").length).toBeGreaterThan(0);

    cleanup();
    render(<App initialPath="/work/no-idea" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "NO IDEA" })).toBeInTheDocument();
    expect(screen.getByText("Independent music events and online radio.")).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/work/openband-openscore" />);
    expect(screen.getByRole("heading", { level: 1, name: "OPENBAND / OPENSCORE" })).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/work/clouds-from-underground" />);
    expect(screen.getByRole("heading", { level: 1, name: "CLOUDS FROM UNDERGROUND" })).toBeInTheDocument();
  });
});
