import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";

afterEach(cleanup);

describe("SHEN AO Round 1 site", () => {
  it("renders the home page without a Chinese artist name or portrait content", () => {
    render(<App initialPath="/" />);

    expect(screen.getByRole("heading", { name: "SHEN AO" })).toBeInTheDocument();
    expect(screen.getByText("COMPOSER / PRODUCER / SOUND ARTIST")).toBeInTheDocument();
    expect(screen.getByAltText("Data horizon signal field")).toBeInTheDocument();
    expect(screen.getByAltText("Data horizon signal field")).toHaveAttribute("src", "/assets/hero-signal-final.png");
    expect(screen.getByRole("heading", { name: "CYBERSPACE" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "BUG PARTY" })).toBeInTheDocument();
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
    expect(screen.queryByText(/festival/i)).not.toBeInTheDocument();
  });

  it("recognizes GitHub Pages subpath routes", () => {
    render(<App initialPath="/shen-ao-site/work/cyberspace" />);

    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "CYBERSPACE" })).toBeInTheDocument();
  });
});
