import { describe, expect, it } from "vitest";
import { archiveFilters, projects } from "../content/projects";

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
});
