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
    expect(screen.getByText("Selected works and professional projects across releases, moving image, theatre, broadcast and practice.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "SELECTED WORK" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "SCORING / MOVING IMAGE" })).toBeInTheDocument();
    expect(screen.getByTestId("selected-works")).toHaveClass("editorial-works");
    expect(screen.getByTestId("selected-work-cyberspace")).toHaveClass("layout-square-lead");
    expect(screen.getByTestId("selected-work-bug-party")).toHaveClass("layout-bug-release");
    expect(screen.getAllByText("KIT RECORDS")).toHaveLength(2);
    expect(screen.getByTestId("selected-work-no-idea")).toBeInTheDocument();
    expect(screen.getByTestId("selected-work-openband-openscore")).toBeInTheDocument();
    expect(screen.queryByTestId("selected-work-two-dreadful-children-unipre")).not.toBeInTheDocument();
    expect(screen.queryByTestId("selected-work-untitled-land")).not.toBeInTheDocument();
    expect(screen.queryByTestId("selected-work-paradise-dream-2")).not.toBeInTheDocument();
    expect(screen.getByTestId("scoring-moving-image")).toBeInTheDocument();
    expect(screen.getByTestId("scoring-moving-image")).toHaveClass("scoring-editorial-grid");
    expect(screen.getByTestId("scoring-work-role-model")).toHaveTextContent("FILM / SCORE + MIX");
    expect(screen.getByTestId("scoring-work-fancy-a-bite")).toHaveTextContent("THEATRE / COMPOSITION");
    expect(screen.getByTestId("scoring-work-untitled-land")).toHaveTextContent("EXPERIMENTAL FILM / SCORE");
    expect(screen.getByTestId("scoring-work-clouds-from-underground")).toHaveTextContent("EXPERIMENTAL FILM / SCORE");
    expect(screen.getByTestId("scoring-work-cctv-selected-broadcast-work")).toHaveTextContent("BROADCAST / MUSIC EDITING + PRODUCTION");
    expect(screen.getByTestId("archive-row-zhang-jian-jingdezhen")).toBeInTheDocument();
    expect(screen.getByTestId("archive-row-nostopia-playable-nft")).toBeInTheDocument();
    expect(screen.getByTestId("archive-row-iqiyi-vr-se")).toBeInTheDocument();
    expect(screen.getByTestId("archive-row-the-back-door-of-stage")).toBeInTheDocument();
    expect(screen.getByTestId("archive-row-paradise-dream-2")).toHaveTextContent("2019");
    expect(screen.getByRole("button", { name: "MOVING IMAGE" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "MOVING IMAGE" }));

    expect(screen.getByTestId("archive-row-zhang-jian-jingdezhen")).toBeInTheDocument();
    expect(screen.getByTestId("archive-row-iqiyi-vr-se")).toBeInTheDocument();
    expect(screen.queryByTestId("archive-row-paradise-dream-2")).not.toBeInTheDocument();
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
    expect(screen.getByRole("link", { name: "PROJECT ↗" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LISTEN TO SOUNDTRACK ↗" })).toHaveAttribute("href", "https://soundcloud.com/shen-ao/role-model-soundtrack");
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
    expect(screen.getByRole("heading", { level: 2, name: "FEATURED RELEASES" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "OTHER RELEASES" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "CYBERSPACE" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "BUG PARTY" })).toBeInTheDocument();
    expect(screen.getByText("2026 / KIT RECORDS")).toBeInTheDocument();
    expect(screen.getByText(/comprising ten tracks and accompanied by a limited double-sided cassette/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "BANDCAMP ↗" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "THE QUIETUS ↗" })).toHaveAttribute("href", "https://thequietus.com/quietus-reviews/cassettes/spools-out-cassette-reviews-for-july-by-daryl-worthington/");
    expect(screen.getAllByText(/LET ME SPEAK \/ 让我说/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Two Dreadful Children / Unipre").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bamboo Blend").length).toBeGreaterThan(0);
    expect(screen.getAllByText("ALBUM ARTWORK").length).toBeGreaterThanOrEqual(3);
    const musicPlatforms = within(screen.getByLabelText("Music platforms"));
    expect(musicPlatforms.getByRole("link", { name: "SOUNDCLOUD" })).toHaveAttribute("href", "https://soundcloud.com/shen-ao/");
    expect(musicPlatforms.getByRole("link", { name: "NETEASE MUSIC" })).toHaveAttribute("href", "https://music.163.com/#/artist?id=46923018");

    cleanup();
    render(<App initialPath="/live" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "LIVE" })).toBeInTheDocument();
    expect(screen.getByText("A recording captures only one aspect of a performance. The live work is different every time.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "SELECTED PERFORMANCES / 2026" })).toBeInTheDocument();
    expect(screen.getAllByText("08 AUG 2026").length).toBeGreaterThan(0);
    expect(screen.getByText("LOOSE.FM / LONDON")).toBeInTheDocument();
    expect(screen.getByText("DUO WITH AVIN NOORBAKHSH")).toBeInTheDocument();
    expect(screen.getAllByText("23 JUL 2026").length).toBeGreaterThan(0);
    expect(screen.getByText("SPANNERS / LONDON")).toBeInTheDocument();
    expect(screen.getByText("WITH VIC BANG / YOTO / K MEANS")).toBeInTheDocument();
    expect(screen.getAllByText("17 JUL 2026").length).toBeGreaterThan(0);
    expect(screen.getByText("YUANLIAO SPACE / BEIJING")).toBeInTheDocument();
    expect(screen.getByText("原料空间")).toBeInTheDocument();
    expect(screen.getByText("WITH 4CHANNELCLUB / CLOUD CHOIR")).toBeInTheDocument();
    expect(screen.getAllByText("17 JUN 2026").length).toBeGreaterThan(0);
    expect(screen.getByText("THE GEORGE TAVERN / LONDON")).toBeInTheDocument();
    expect(screen.getByText("WITH VISIT ME / BARRELEYE / GUTHLAC")).toBeInTheDocument();
    expect(screen.getAllByText("LIVE PHOTO")).toHaveLength(5);
    expect(screen.getAllByText("EVENT POSTER")).toHaveLength(7);
    expect(screen.getByRole("heading", { level: 2, name: "DJ / TEENDRUM" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "MIXCLOUD ↗" })).toHaveAttribute("href", "https://www.mixcloud.com/teendrum/");
    expect(screen.getByRole("link", { name: "RESIDENT ADVISOR ↗" })).toHaveAttribute("href", "https://ra.co/dj/teendrum");
    expect(screen.getByRole("heading", { level: 3, name: "DJ POSTER ARCHIVE" })).toBeInTheDocument();
    expect(screen.getByText("RELATED PRACTICE")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "LIVE WITH NO IDEA" })).toBeInTheDocument();
    expect(screen.getByText("23 MAY 2026 · SHAI SPACE · LONDON")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "VIEW EVENT →" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "EARLIER PERFORMANCE" })).toBeInTheDocument();
    expect(screen.getByText("SOLO CONCERT")).toBeInTheDocument();
    expect(screen.getByText("TIANJIN CONCERT HALL / RUXI ART GALLERY")).toBeInTheDocument();
    expect(screen.getByText("天津音乐厅 · 儒熙艺术馆")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "WATCH →" })).toHaveAttribute("href", "https://www.youtube.com/watch?v=T8jVsSjHzhA");
    expect(screen.queryByText(/chronology/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/verified/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "NO IDEA — SHAI SPACE" })).not.toBeInTheDocument();

    cleanup();
    render(<App initialPath="/practice" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "PRACTICE" })).toBeInTheDocument();
    expect(screen.getByText(/Music-making and event-making occupy different roles/)).toBeInTheDocument();
    expect(screen.getByText("PRACTICE / EVENTS + COMMUNITY")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "NO IDEA" })).toBeInTheDocument();
    expect(screen.getByText("RADIO / LIVE EVENTS")).toBeInTheDocument();
    expect(screen.getByText("A radio programme and live event series run by Shen Ao, focused on ambient and experimental music. Three live events have been presented in London to date.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "VIEW NO IDEA →" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "OPENBAND" })).toBeInTheDocument();
    expect(screen.getByText("IMPROVISATION WORKSHOPS")).toBeInTheDocument();
    expect(screen.getByText("A Shen Ao-led improvisation workshop series developed at fRUITYSPACE in Beijing, built around collective music-making and open improvisation.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "VIEW OPENBAND →" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "TUNNEL" })).not.toBeInTheDocument();

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
    expect(screen.getByAltText("Childhood portrait of Shen Ao.")).toHaveAttribute("src", "/assets/portrait/shen-ao-childhood.avif");
    expect(screen.getByText((content) => content.includes("Goldsmiths, University of London"))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "MORE PRESS / RADIO" })).toBeInTheDocument();
    expect(screen.queryByText("KEYBOARD IMPROVISATION")).not.toBeInTheDocument();
    expect(screen.queryByText("STRUCTURE -> LOSS OF CONTROL")).not.toBeInTheDocument();

    cleanup();
    render(<App initialPath="/epk" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "SHEN AO" })).toBeInTheDocument();
    expect(screen.getByAltText("Childhood portrait of Shen Ao.")).toHaveAttribute("src", "/assets/portrait/shen-ao-childhood.avif");
    expect(screen.getByText("SHORT BIO")).toBeInTheDocument();
    expect(screen.getByText("SELECTED PRESS / RADIO")).toBeInTheDocument();
    expect(screen.getByText("MUITO RADIO")).toBeInTheDocument();
    expect(screen.queryByText(/download epk/i)).not.toBeInTheDocument();
  });

  it("renders the requested project detail routes as complete pages", () => {
    render(<App initialPath="/work/fancy-a-bite" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "FANCY A BITE?" })).toBeInTheDocument();
    expect(screen.getByText(/solo dance work exploring trauma and recovery following sexual violence/i)).toBeInTheDocument();
    expect(screen.getByText(/glitch-derived sound and synthesiser arpeggios/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "PROJECT / PRESS ↗" })).toHaveAttribute("href", "https://cptheatre.co.uk/whatson/Big-Bang-18-March-2024");
    expect(screen.getByRole("link", { name: "SOUNDCLOUD ↗" })).toHaveAttribute("href", "https://soundcloud.com/fancy-a-bite/fancy-a-bite");
    expect(screen.getAllByText("HERO PHOTO")).toHaveLength(1);
    expect(screen.getAllByText("SECONDARY STAGE IMAGE")).toHaveLength(1);
    expect(screen.getAllByText("POSTER")).toHaveLength(1);
    expect(screen.queryByText(/untitled-land.*fancy/i)).not.toBeInTheDocument();

    cleanup();
    render(<App initialPath="/work/untitled-land" />);
    expect(screen.getByRole("heading", { level: 1, name: "UNTITLED LAND" })).toBeInTheDocument();
    expect(screen.getByText(/experimental short film by independent director Yuan Ye/i)).toBeInTheDocument();
    expect(screen.getByText(/analogue synthesiser with acoustic instruments/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "WATCH / PROJECT ↗" })).toHaveAttribute("href", "https://2022art.cafa.edu.cn/pc/infoDetails/331");
    expect(screen.getByRole("link", { name: "NETEASE MUSIC ↗" })).toHaveAttribute("href", "https://music.163.com/#/album?id=146407778");
    expect(screen.getByRole("link", { name: "SOUNDCLOUD ↗" })).toHaveAttribute("href", "https://soundcloud.com/shen-ao/sets/untitled-land");
    expect(screen.getAllByText("FILM STILL")).toHaveLength(5);

    cleanup();
    render(<App initialPath="/work/no-idea" />);
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "NO IDEA" })).toBeInTheDocument();
    expect(screen.getByText("RADIO / LIVE EVENTS")).toBeInTheDocument();
    expect(screen.getByText("A radio programme and live event series run by Shen Ao, focused on ambient and experimental music. Three live events have been presented in London to date.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "BAIHUI RADIO ↗" })).toHaveAttribute("href", "https://baihui.live/hosts/no-idea/en/");
    expect(screen.getByRole("link", { name: "RESIDENT ADVISOR ↗" })).toHaveAttribute("href", "https://ra.co/promoters/183279");
    expect(screen.getByText("@noidearadio")).toBeInTheDocument();
    expect(screen.getByText("LIVE EVENT ARCHIVE")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "LIVE WITH NO IDEA" })).toBeInTheDocument();
    expect(screen.getByText("ORGANISER + PERFORMER")).toBeInTheDocument();
    expect(screen.getAllByText("LONDON EVENT ARCHIVE")).toHaveLength(2);
    expect(screen.getAllByText("MEDIA / DETAILS PENDING")).toHaveLength(2);
    expect(screen.getByText("RADIO ARCHIVE")).toBeInTheDocument();
    expect(screen.getAllByText("RADIO EPISODE ARTWORK").length).toBeGreaterThanOrEqual(4);
    expect(screen.getByRole("link", { name: "LISTEN ON BAIHUI ↗" })).toHaveAttribute("href", "https://baihui.live/hosts/no-idea/en/");
    expect(screen.getByAltText("Shen Ao performing at Live With No Idea at Shai Space, London.")).toHaveAttribute("src", "/assets/no-idea/2026-05-23/hero.webp");
    expect(screen.getByAltText("Live With No Idea event poster.")).toHaveAttribute("src", "/assets/no-idea/2026-05-23/poster.webp");
    expect(screen.getByRole("button", { name: "VIEW EVENT" })).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/work/openband-openscore" />);
    expect(screen.getByRole("heading", { level: 1, name: "OPENBAND" })).toBeInTheDocument();
    expect(screen.getByText("2024 —")).toBeInTheDocument();
    expect(screen.getByText("IMPROVISATION WORKSHOPS")).toBeInTheDocument();
    expect(screen.getByText("BEIJING / LONDON")).toBeInTheDocument();
    expect(screen.getByText("A Shen Ao-led improvisation workshop series developed at fRUITYSPACE in Beijing. The project creates an open setting for collective improvisation and collaborative music-making.")).toBeInTheDocument();
    expect(screen.getByText("CITY, UNIVERSITY OF LONDON")).toBeInTheDocument();
    expect(screen.getByText("HYPHA HQ / LONDON")).toBeInTheDocument();
    expect(screen.getByText("WORKSHOP / OPENSCORE")).toBeInTheDocument();
    expect(screen.getAllByText("WORKSHOP POSTER").length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText("DOCUMENTATION IMAGE").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole("link", { name: "WORKSHOP ARCHIVE ↗" })).toHaveAttribute("href", "https://alschaffer.blogspot.com/search/label/OPEN%20BAND");
    expect(screen.getByRole("link", { name: "LISTEN TO RECORDINGS ↗" })).toHaveAttribute("href", "https://www.mixcloud.com/al_schaffer/playlists/open-band/");
    expect(screen.queryByRole("heading", { name: "OPENBAND / OPENSCORE" })).not.toBeInTheDocument();

    cleanup();
    render(<App initialPath="/work/clouds-from-underground" />);
    expect(screen.getByRole("heading", { level: 1, name: "CLOUDS FROM UNDERGROUND" })).toBeInTheDocument();
    expect(screen.getByText(/resource-based industrial city/i)).toBeInTheDocument();
    expect(screen.getByText(/piano, violin and synthesiser drones/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "NETEASE MUSIC ↗" })).toHaveAttribute("href", "https://music.163.com/#/album?id=131037851");
    expect(screen.queryByRole("link", { name: /youtube/i })).not.toBeInTheDocument();
    expect(screen.getByText("RELATED WORK")).toBeInTheDocument();
    expect(screen.getByText("YISUO / 忆所")).toBeInTheDocument();
    expect(screen.getByText(/Mother-32 synthesiser/i)).toBeInTheDocument();

    cleanup();
    render(<App initialPath="/work/cctv-selected-broadcast-work" />);
    expect(screen.getByRole("heading", { level: 1, name: "SELECTED BROADCAST WORK / CCTV-13" })).toBeInTheDocument();
    expect(screen.getByText(/more than 50 short-form television promotional projects/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "SELECTED BROADCAST WORK" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LONG TENG HU YUE ZHONG GUO NIAN / 龙腾虎跃中国年 ↗" })).toHaveAttribute("href", "https://www.bilibili.com/video/BV1pS4y1y72L");
    expect(screen.getByText(/Chinese traditional instruments and percussion ensemble passages/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "IN THE FIELD OF HOPE / 在希望的田野上 ↗" })).toHaveAttribute("href", "https://www.bilibili.com/video/BV1Jt4y1s7De");
    expect(screen.getByText(/summer grain cultivation/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "RUI TU CHENG XIANG ZHONG GUO NIAN / 瑞兔呈祥中国年 ↗" })).toHaveAttribute("href", "https://www.bilibili.com/video/BV11d4y1V7jD");
    expect(screen.queryByText("瑞兔呈祥中过年")).not.toBeInTheDocument();
  });

  it("renders the No Idea event detail as a Practice sub-route with real media", () => {
    render(<App initialPath="/practice/no-idea/2026-05-23" />);

    expect(screen.getByRole("navigation").querySelector(".active")).toHaveTextContent("PRACTICE");
    expect(within(screen.getByRole("main")).getByRole("heading", { level: 1, name: "LIVE WITH NO IDEA" })).toBeInTheDocument();
    expect(screen.getByText("NO IDEA / EVENT")).toBeInTheDocument();
    expect(screen.getByText("17 LATONA RD")).toBeInTheDocument();
    expect(screen.getByText("LONDON SE15 6RX")).toBeInTheDocument();
    expect(screen.getByText("AMBIENT / EXPERIMENTAL")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "VIEW ON RESIDENT ADVISOR" })).toHaveAttribute("href", "https://ra.co/events/2432167");
    expect(screen.getByAltText("Shen Ao performing at Live With No Idea at Shai Space, London.")).toHaveAttribute("src", "/assets/no-idea/2026-05-23/hero.webp");
    expect(screen.getByAltText("Live With No Idea event poster.")).toHaveAttribute("src", "/assets/no-idea/2026-05-23/poster.webp");
    expect(screen.getAllByAltText(/Live With No Idea/)).toHaveLength(9);
    expect(screen.getByRole("button", { name: "BACK TO NO IDEA" })).toBeInTheDocument();
    expect(screen.queryByText(/photography/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/18:30|19:00|7PM/)).not.toBeInTheDocument();
  });

  it("cross-references No Idea from home, practice, and live without making it a top-level live project", () => {
    render(<App initialPath="/" />);

    expect(screen.getByText("NO IDEA — SHAI SPACE")).toBeInTheDocument();
    expect(screen.getByText("SHAI SPACE / LONDON")).toBeInTheDocument();
    expect(screen.getByAltText("Shen Ao performing at Live With No Idea at Shai Space, London.")).toHaveAttribute("src", "/assets/no-idea/2026-05-23/hero.webp");
    expect(screen.getByAltText("Live With No Idea event poster.")).toHaveAttribute("src", "/assets/no-idea/2026-05-23/poster.webp");

    cleanup();
    render(<App initialPath="/practice" />);
    expect(screen.getByAltText("Live With No Idea event poster.")).toHaveAttribute("src", "/assets/no-idea/2026-05-23/poster.webp");
    expect(screen.getByRole("heading", { level: 2, name: "NO IDEA" })).toBeInTheDocument();
    expect(screen.getByText("RADIO / LIVE EVENTS")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "VIEW NO IDEA →" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "OPENBAND" })).toBeInTheDocument();
    expect(screen.getByText("IMPROVISATION WORKSHOPS")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "VIEW OPENBAND →" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "TUNNEL" })).not.toBeInTheDocument();

    cleanup();
    render(<App initialPath="/live" />);
    expect(screen.getByText("RELATED PRACTICE")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "LIVE WITH NO IDEA" })).toBeInTheDocument();
    expect(screen.getByText("ORGANISER + PERFORMER")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "VIEW EVENT →" })).toBeInTheDocument();
    expect(screen.queryByText("NO IDEA — SHAI SPACE")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Shen Ao performing at Live With No Idea at Shai Space, London.")).not.toBeInTheDocument();
  });
});
