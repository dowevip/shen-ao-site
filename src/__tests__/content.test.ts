import { describe, expect, it } from "vitest";
import { archiveFilters, projects } from "../content/projects";
import { noIdeaEvents } from "../content/noIdeaEvents";

describe("structured project content", () => {
  it("keeps all factual project content in a single typed source", () => {
    expect(projects).toHaveLength(17);
    expect(projects.find((project) => project.slug === "cyberspace")).toMatchObject({
      title: "Cyberspace",
      category: "Music",
      subtype: "Release",
      label: "Kit Records",
      artwork: "/assets/cyberspace.jpg"
    });
    expect(projects.find((project) => project.slug === "bug-party")).toMatchObject({
      title: "Bug Party",
      category: "Music",
      subtype: "Release",
      label: "Kit Records",
      artwork: "/assets/bugparty.jpg"
    });
    expect(projects.find((project) => project.slug === "cyberspace-bug-party")).toBeUndefined();
    expect(projects.find((project) => project.slug === "role-model")).toMatchObject({
      title: "Role Model",
      year: "2024",
      category: "Moving Image",
      subtype: "Film",
      collaborators: ["Hongxuan Wang"],
      role: ["Audiovisual composition", "Mix"]
    });
  });

  it("exposes the exact archive filters required for Round 1", () => {
    expect(archiveFilters).toEqual(["ALL", "MUSIC", "MOVING IMAGE", "LIVE", "CROSS-MEDIA", "CURATION"]);
  });

  it("keeps No Idea event archive facts in a single source without inventing extra credits", () => {
    expect(noIdeaEvents).toHaveLength(1);
    expect(noIdeaEvents[0]).toMatchObject({
      slug: "2026-05-23",
      series: "No Idea",
      edition: "Live With No Idea",
      displayDate: "23 MAY 2026",
      day: "SATURDAY",
      venue: "Shai Space",
      room: "Studio 4",
      address: "17 Latona Rd",
      city: "London",
      postcode: "SE15 6RX",
      genres: ["Ambient", "Experimental"],
      lineup: ["Stella Z", "Kirk Barley", "Li Song", "James Creed", "Francis Moore", "Teendrum"],
      roles: ["Organiser", "Performer"],
      heroImage: "/assets/no-idea/2026-05-23/hero.webp",
      posterImage: "/assets/no-idea/2026-05-23/poster.webp",
      externalLinks: {
        residentAdvisor: "https://ra.co/events/2432167",
        noIdeaRadio: "https://baihui.live/hosts/no-idea/en/",
        residentAdvisorPromoter: "https://ra.co/promoters/183279",
        shaiSpace: "https://www.instagram.com/shai.space/"
      },
      verified: true
    });
    expect(noIdeaEvents[0]).not.toHaveProperty("photographyCredit");
  });
});
