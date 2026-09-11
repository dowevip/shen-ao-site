import { describe, expect, it } from "vitest";
import { archiveFilters, archiveProjects, featuredMusicReleases, moreCommissionedProjects, musicPlatformLinks, musicScoringProjects, otherMusicReleases, projects, scoringMovingImageProjects, selectedWorks } from "../content/projects";
import { noIdeaEvents } from "../content/noIdeaEvents";
import { djPosterArchive, earlierPerformances, livePlatformLinks, selectedLiveEvents } from "../content/liveEvents";
import { noIdeaProject, openbandProject, practiceProjects } from "../content/practiceProjects";

describe("structured project content", () => {
  it("keeps all factual project content in a single typed source", () => {
    expect(projects).toHaveLength(20);
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

  it("exposes WORK selected, scoring, and archive groupings from project data", () => {
    expect(selectedWorks.map((project) => project.slug)).toEqual([
      "cyberspace",
      "bug-party",
      "role-model",
      "fancy-a-bite",
      "no-idea",
      "openband-openscore"
    ]);

    expect(scoringMovingImageProjects.map((project) => [project.title, project.year, project.workRoleLabel])).toEqual([
      ["Role Model", "2024", "FILM / SCORE + MIX"],
      ["Fancy A BITE?", "2024", "THEATRE / COMPOSITION"],
      ["Untitled Land", "2022", "EXPERIMENTAL FILM / SCORE"],
      ["Clouds from Underground", "2021", "EXPERIMENTAL FILM / SCORE"],
      ["Selected Broadcast Work / CCTV-13", "2021–2022", "BROADCAST / MUSIC EDITING + PRODUCTION"]
    ]);

    expect(archiveProjects.map((project) => project.title)).toEqual([
      "Zhang Jian and Jingdezhen",
      "Nostopia Playable NFT",
      "iQIYI VR SE Promo",
      "the back door of stage",
      "Paradise Dream 2",
      "Douyin Cultural Product Promo",
      "Mr.Monster Resource",
      "Tunnel"
    ]);
    expect(archiveProjects.find((project) => project.slug === "paradise-dream-2")?.year).toBe("2019");
  });

  it("exposes the curated MUSIC commissioned-music groupings without changing WORK groupings", () => {
    expect(musicScoringProjects.map((project) => project.slug)).toEqual([
      "role-model",
      "fancy-a-bite",
      "untitled-land",
      "clouds-from-underground",
      "cctv-selected-broadcast-work"
    ]);
    expect(moreCommissionedProjects.map((project) => project.slug)).toEqual([
      "iqiyi-vr-se",
      "the-back-door-of-stage",
      "nostopia-playable-nft",
      "paradise-dream-2",
      "zhang-jian-jingdezhen",
      "douyin-cultural-promo",
      "mr-monster-resource",
      "tunnel"
    ]);
    expect(musicScoringProjects.filter((project) => project.images?.[0]).map((project) => project.slug)).toEqual([
      "role-model",
      "fancy-a-bite",
      "untitled-land",
      "clouds-from-underground",
      "cctv-selected-broadcast-work"
    ]);
    expect(moreCommissionedProjects.filter((project) => project.images?.[0]).map((project) => project.slug)).toEqual([
      "iqiyi-vr-se",
      "the-back-door-of-stage",
      "paradise-dream-2",
      "zhang-jian-jingdezhen"
    ]);
    expect(moreCommissionedProjects.filter((project) => !project.images?.[0] && !project.artwork).map((project) => project.slug)).toEqual([
      "nostopia-playable-nft",
      "douyin-cultural-promo",
      "mr-monster-resource",
      "tunnel"
    ]);
  });

  it("exposes complete first-stage WORK detail content without unconfirmed private material", () => {
    expect(projects.find((project) => project.slug === "role-model")).toMatchObject({
      intro: "Role Model follows the experience of Chinese-American Hollywood star Anna May Wong as she returned to her ancestral home in Taishan, Guangdong, after confronting racial discrimination and the sense of being caught between being “too American” and “not Chinese enough”.",
      creativeApproach: "The score centres on distorted piano to create a beautiful but unstable sense of nostalgia. Displaced spatial treatment of the instruments further blurs that sense of memory.",
      externalLinks: [
        { label: "PROJECT ↗", url: "https://www.thebluecoat.org.uk/library/event/dahong-hongxuan-wang-role-model" },
        { label: "LISTEN TO SOUNDTRACK ↗", url: "https://soundcloud.com/shen-ao/role-model-soundtrack" }
      ],
      workRoleLabel: "FILM / SCORE + MIX",
      photographyCredit: "Photography: Roger Sinek"
    });

    expect(projects.find((project) => project.slug === "fancy-a-bite")).toMatchObject({
      year: "2024",
      subtype: "Theatre / Dance",
      role: ["Composition"],
      intro: "Fancy A BITE? is a solo dance work exploring trauma and recovery following sexual violence. The production combines live projection, installation, music and fragmented physical language.",
      creativeApproach: "The score uses glitch-derived sound and synthesiser arpeggios alongside the production’s shifting visual language, moving through fear, loss of control, struggle and reconstruction.",
      externalLinks: [
        { label: "PROJECT / PRESS ↗", url: "https://cptheatre.co.uk/whatson/Big-Bang-18-March-2024" },
        { label: "SOUNDCLOUD ↗", url: "https://soundcloud.com/fancy-a-bite/fancy-a-bite" }
      ],
      images: [
        {
          src: "/assets/portfolio-projects/fancy-a-bite-stage-projection.jpeg",
          alt: "Performer in white beside blue live projection in Fancy A BITE?."
        },
        {
          src: "/assets/portfolio-projects/fancy-a-bite-stage.jpeg",
          alt: "Animal silhouettes in front of a projected stage image in Fancy A BITE?."
        },
        {
          src: "/assets/portfolio-projects/fancy-a-bite-dark-stage.jpeg",
          alt: "Performers gathered around a table in a dark scene from Fancy A BITE?."
        },
        {
          src: "/assets/portfolio-projects/fancy-a-bite-monochrome-performance.jpeg",
          alt: "Black-and-white performance image from Fancy A BITE?."
        },
        {
          src: "/assets/portfolio-projects/fancy-a-bite-poster.jpeg",
          alt: "Fancy A BITE? performance poster for Camden People's Theatre."
        }
      ]
    });
    expect(projects.find((project) => project.slug === "fancy-a-bite")?.detailMedia).toBeUndefined();

    expect(projects.find((project) => project.slug === "untitled-land")).toMatchObject({
      category: "Moving Image",
      subtype: "Experimental Film",
      role: ["Score"],
      nextProjectSlug: "clouds-from-underground",
      intro: "Untitled Land is an experimental short film by independent director Yuan Ye, exploring the experience of constructing virtual worlds and the effects of that process on perception.",
      creativeApproach: "The score combines analogue synthesiser with acoustic instruments, seeking a sense of reality being constructed through virtual means and responding to the film’s continual movement between physical and virtual imagery.",
      externalLinks: [
        {
          label: "WATCH / PROJECT ↗",
          url: "https://2022art.cafa.edu.cn/pc/infoDetails/331",
          englishNote: "This project page may not be accessible outside mainland China."
        },
        { label: "NETEASE MUSIC ↗", url: "https://music.163.com/#/album?id=146407778", hideFromEnglishUi: true },
        { label: "SOUNDCLOUD ↗", url: "https://soundcloud.com/shen-ao/sets/untitled-land" }
      ],
      images: [
        { src: "/assets/portfolio-projects/untitled-land-project.jpeg" },
        { src: "/assets/portfolio-projects/untitled-land-film-still-01.png" },
        { src: "/assets/portfolio-projects/untitled-land-film-still-02.png" },
        { src: "/assets/portfolio-projects/untitled-land-film-still-03.png" },
        { src: "/assets/portfolio-projects/untitled-land-film-still-04.png" },
        { src: "/assets/portfolio-projects/untitled-land-film-still-05.png" }
      ]
    });
    expect(projects.find((project) => project.slug === "untitled-land")?.detailMedia).toBeUndefined();

    const clouds = projects.find((project) => project.slug === "clouds-from-underground");
    expect(clouds).toMatchObject({
      category: "Moving Image",
      subtype: "Experimental Film",
      role: ["Score"],
      intro: "Clouds from Underground is an experimental short film by independent director Shao Ze, examining the history and present condition of Anshan as a resource-based industrial city.",
      creativeApproach: "The score combines piano, violin and synthesiser drones through a minimalist approach drawing on both electronic and classical music, creating the suffocating mechanical atmosphere present in the film.",
      nextProjectSlug: "cctv-selected-broadcast-work",
      externalLinks: [
        { label: "WATCH ↗", url: "https://youtu.be/BbDtWCoWifU" },
        {
          label: "NETEASE MUSIC ↗",
          url: "https://music.163.com/#/album?id=131037851",
          englishNote: "This link may not be accessible outside mainland China."
        }
      ],
      images: [
        { src: "/assets/portfolio-projects/clouds-from-underground-cover.jpg" },
        { src: "/assets/portfolio-projects/clouds-from-underground-film-still-01.jpg" },
        { src: "/assets/portfolio-projects/clouds-from-underground-film-still-02.jpg" },
        { src: "/assets/portfolio-projects/clouds-from-underground-film-still-03.jpg" },
        { src: "/assets/portfolio-projects/clouds-from-underground-film-still-04.jpg" },
        { src: "/assets/portfolio-projects/clouds-from-underground-film-still-05.jpg" },
        { src: "/assets/portfolio-projects/clouds-from-underground-film-still-06.jpg" }
      ],
      relatedWorks: [
        {
          title: "YISUO / 忆所",
          year: "2021",
          role: "PERFORMANCE VIDEO / SCORE",
          description: "A related performance-documentation score created with a Mother-32 synthesiser as a continuous seven-minute ambient work.",
          media: {
            src: "/assets/portfolio-projects/yisuo-performance-video.jpg"
          }
        }
      ]
    });
    expect(clouds?.detailMedia).toBeUndefined();

    expect(projects.find((project) => project.slug === "cctv-selected-broadcast-work")).toMatchObject({
      intro: "From 2021 to 2022, Shen Ao worked on music editing and production for CCTV-13 promotional content, contributing to more than 50 short-form television promotional projects.",
      selectedCases: [
        {
          title: "Year of the Tiger: A Festive Chinese New Year",
          url: "https://www.bilibili.com/video/BV1pS4y1y72L"
        },
        {
          title: "In the Field of Hope",
          url: "https://www.bilibili.com/video/BV1Jt4y1s7De"
        },
        {
          title: "Year of the Rabbit: A Festive Chinese New Year",
          url: "https://www.bilibili.com/video/BV11d4y1V7jD"
        }
      ],
      externalAccessNote: "Some links on this page may not be accessible outside mainland China.",
      archiveGallery: [
        { title: "CCTV News Channel: China Space Station Series", url: "https://www.bilibili.com/video/BV1A5DbY9EBL" },
        { title: "National Moral Role Models" },
        { title: "13th China Airshow" },
        { title: "Full Moon, Full Bloom" },
        { title: "Meeting in a Great Era" },
        { title: "Spotlight on COP15 Biodiversity Conference" },
        { title: "Together for a Shared Future" },
        { title: "Winter Olympics Countdown" },
        { title: "Disaster Prevention, Safer Lives" },
        { title: "My Family, My Country" },
        { title: "Cherish Life, Prevent Drowning" },
        { title: "Spring Festival Travel Diary" },
        { title: "Spring Festival at the Grassroots 2022" },
        { title: "Setting Sail in a New Era" },
        { title: "Journey Along China’s Frontiers" },
        { title: "China in the New Era" },
        { title: "Advancing on a New Journey" },
        { title: "The Two Sessions and Us" },
        { title: "Turning the Blade Inward" },
        { title: "Striving Fulfils Dreams" },
        { title: "County Development in Focus" },
        { title: "China Through Foreign Eyes" },
        { title: "Top Talk" },
        { title: "Archaeology of China: Tracing Civilisation Origins" }
      ]
    });
  });

  it("exposes the Music page release structure and verified links from content data", () => {
    expect(featuredMusicReleases.map((release) => release.slug)).toEqual(["cyberspace", "bug-party"]);
    expect(otherMusicReleases.map((release) => release.slug)).toEqual([
      "let-me-speak",
      "two-dreadful-children-unipre",
      "bamboo-blend"
    ]);
    expect(projects.find((project) => project.slug === "let-me-speak")).toMatchObject({
      title: "Let Me Speak",
      displayTitle: "LET ME SPEAK / 让我说",
      year: "2024",
      subtype: "Release",
      verificationStatus: "confirmed",
      mediaStatus: "confirmed",
      artwork: "/assets/portfolio-projects/let-me-speak-cover.jpg",
      externalLinks: [
        { label: "Bandcamp", url: "https://shenao.bandcamp.com/album/rang-wo-shuo" },
        { label: "NetEase Music", url: "https://music.163.com/#/album?id=147663057" }
      ]
    });
    expect(projects.find((project) => project.slug === "two-dreadful-children-unipre")).toMatchObject({
      artwork: "/assets/portfolio-projects/two-dreadful-children-unipre-cover.png",
      year: "2024",
      mediaStatus: "confirmed",
      externalLinks: [{ label: "Bandcamp", url: "https://shenao.bandcamp.com/album/two-dreadful-children-unipre" }]
    });
    expect(projects.find((project) => project.slug === "bamboo-blend")).toMatchObject({
      title: "Bamboo Blend",
      year: "2024",
      artwork: "/assets/portfolio-projects/bamboo-blend-cover.jpg",
      externalLinks: [{ label: "SoundCloud", url: "https://soundcloud.com/shen-ao/bamboo-blend" }],
      mediaStatus: "confirmed"
    });
    expect(projects.find((project) => project.slug === "cyberspace")?.externalLinks).toContainEqual({
      label: "Bandcamp",
      url: "https://shenao.bandcamp.com/album/cyberspace"
    });
    expect(projects.find((project) => project.slug === "cyberspace")?.externalLinks).toContainEqual({
      label: "NetEase Music",
      url: "https://music.163.com/#/album?id=368232911"
    });
    expect(projects.find((project) => project.slug === "bug-party")?.externalLinks).toContainEqual({
      label: "Bandcamp",
      url: "https://shenao.bandcamp.com/album/bug-party"
    });
    expect(projects.find((project) => project.slug === "bug-party")?.externalLinks).toContainEqual({
      label: "NetEase Music",
      url: "https://music.163.com/#/album?id=371692074"
    });
    expect(musicPlatformLinks).toEqual([
      { label: "BANDCAMP", url: "https://shenao.bandcamp.com/" },
      { label: "SOUNDCLOUD", url: "https://soundcloud.com/shen-ao/" },
      { label: "NETEASE MUSIC", url: "https://music.163.com/#/artist?id=46923018" }
    ]);
  });

  it("keeps the uploaded MUSIC images in the project data", () => {
    expect(projects.find((project) => project.slug === "paradise-dream-2")).toMatchObject({
      images: [{ src: "/assets/portfolio-projects/paradise-dream-2.jpg" }],
      mediaStatus: "confirmed"
    });
    expect(projects.find((project) => project.slug === "zhang-jian-jingdezhen")).toMatchObject({
      images: [{ src: "/assets/portfolio-projects/zhang-jian-jingdezhen.jpg" }],
      mediaStatus: "confirmed"
    });
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

  it("exposes selected Live performance data without requiring detail pages", () => {
    expect(selectedLiveEvents.map((event) => event.displayDate)).toEqual([
      "08 AUG 2026",
      "23 JUL 2026",
      "17 JUL 2026",
      "17 JUN 2026"
    ]);
    expect(selectedLiveEvents[0]).toMatchObject({
      venue: "Loose.fm",
      city: "London",
      billing: "Duo with Avin Noorbakhsh",
      type: "Live performance",
      selected: true,
      poster: { path: "/assets/live/portfolio/loose-fm-2026.jpeg", status: "confirmed" }
    });
    expect(selectedLiveEvents[2]).toMatchObject({
      venue: "Yuanliao Space",
      city: "Beijing",
      localVenueName: "原料空间",
      billing: "With 4ChannelClub / Cloud Choir"
    });
    expect(livePlatformLinks).toEqual([
      { label: "MIXCLOUD", url: "https://www.mixcloud.com/teendrum/" },
      { label: "RESIDENT ADVISOR", url: "https://ra.co/dj/teendrum" }
    ]);
    expect(djPosterArchive.every((poster) => poster.status === "placeholder")).toBe(true);
    expect(earlierPerformances).toEqual([
      {
        id: "solo-concert-2018",
        year: "2018",
        title: "Solo Concert",
        venue: "Tianjin Concert Hall / Ruxi Art Gallery",
        localVenueName: "天津音乐厅 · 儒熙艺术馆",
        type: "Solo concert",
        externalLinks: [{ label: "Watch", url: "https://www.youtube.com/watch?v=T8jVsSjHzhA" }],
        livePhoto: { path: "/assets/live/portfolio/solo-concert-2018.jpeg", status: "confirmed" },
        selected: false
      }
    ]);
  });

  it("exposes the Practice page and project-page structures without public Tunnel display", () => {
    expect(practiceProjects.map((project) => project.slug)).toEqual(["no-idea", "openband-openscore"]);
    expect(practiceProjects.map((project) => project.slug as string)).not.toContain("tunnel");

    expect(noIdeaProject).toMatchObject({
      title: "NO IDEA",
      year: "2024 —",
      heading: "RADIO / LIVE EVENTS",
      instagramHandle: "@noidearadio",
      summary: "A radio programme and live event series run by Shen Ao, focused on ambient and experimental music. Three live events have been presented in London to date."
    });
    expect(noIdeaProject.links).toEqual([
      { label: "BAIHUI RADIO ↗", url: "https://baihui.live/hosts/no-idea/en/" },
      { label: "RESIDENT ADVISOR ↗", url: "https://ra.co/promoters/183279" }
    ]);
    expect(noIdeaProject.posterArchive!).toHaveLength(3);
    expect(noIdeaProject.posterArchive![0]).toMatchObject({ status: "confirmed", eventSlug: "2026-05-23" });
    expect(noIdeaProject.posterArchive!.slice(1).every((slot) => slot.status === "placeholder")).toBe(true);
    expect(noIdeaProject.radioArchive!.every((slot) => slot.status === "placeholder")).toBe(true);

    expect(openbandProject).toMatchObject({
      title: "OPENBAND",
      year: "2024 —",
      heading: "IMPROVISATION WORKSHOPS",
      location: "BEIJING / LONDON",
      summary: "A Shen Ao-led improvisation workshop series developed at fRUITYSPACE in Beijing. The project creates an open setting for collective improvisation and collaborative music-making."
    });
    expect(openbandProject.workshopEntries).toEqual([
      { venue: "CITY, UNIVERSITY OF LONDON", label: "WORKSHOP", mediaStatus: "placeholder" },
      { venue: "HYPHA HQ / LONDON", label: "WORKSHOP / OPENSCORE", mediaStatus: "placeholder" }
    ]);
    expect(openbandProject.links).toEqual([
      { label: "WORKSHOP ARCHIVE ↗", url: "https://alschaffer.blogspot.com/search/label/OPEN%20BAND" },
      { label: "LISTEN TO RECORDINGS ↗", url: "https://www.mixcloud.com/al_schaffer/playlists/open-band/" }
    ]);
  });
});
