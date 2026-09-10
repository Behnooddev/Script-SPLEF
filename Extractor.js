(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  console.clear();
  console.log("🚀 Spotify full playlist extractor started...");

  const findScroller = () => {
    return [...document.querySelectorAll("div")]
      .filter(el => {
        const s = getComputedStyle(el);
        return (
          el.scrollHeight > el.clientHeight + 300 &&
          (s.overflowY === "auto" || s.overflowY === "scroll")
        );
      })
      .sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
  };

  const scroller = findScroller();

  if (!scroller) {
    console.error("❌ Could not find playlist scroller.");
    return;
  }

  console.log("✅ Scroller found.");

  const tracks = new Map();

  const collectVisibleTracks = () => {
    const rows = [
      ...document.querySelectorAll('[data-testid="tracklist-row"]')
    ];

    for (const row of rows) {
      const links = [...row.querySelectorAll("a")];

      const trackLink = links.find(a =>
        a.href.includes("/track/")
      );

      if (!trackLink) continue;

      const title = trackLink.textContent.trim();

      if (!title) continue;

      // Use Spotify track URL as the unique ID
      const trackId = trackLink.href.split("?")[0];

      const artists = links
        .filter(a => a.href.includes("/artist/"))
        .map(a => a.textContent.trim())
        .filter(Boolean);

      tracks.set(trackId, {
        title,
        artists: [...new Set(artists)]
      });
    }
  };

  // Start from the top
  scroller.scrollTop = 0;
  await sleep(1500);

  collectVisibleTracks();

  let lastPosition = -1;
  let unchanged = 0;

  for (let i = 0; i < 1000; i++) {

    collectVisibleTracks();

    const before = tracks.size;

    // Scroll by one viewport
    scroller.scrollTop += Math.max(
      400,
      Math.floor(scroller.clientHeight * 0.7)
    );

    await sleep(600);

    collectVisibleTracks();

    const after = tracks.size;
    const position = scroller.scrollTop;

    console.log(
      `📜 ${i + 1} | Tracks collected: ${after} | Scroll: ${Math.round(position)} / ${Math.round(scroller.scrollHeight)}`
    );

    // Detect bottom
    const atBottom =
      scroller.scrollTop + scroller.clientHeight >=
      scroller.scrollHeight - 50;

    if (position === lastPosition && after === before) {
      unchanged++;
    } else {
      unchanged = 0;
    }

    lastPosition = position;

    if (atBottom && unchanged >= 5) {
      break;
    }

    // Safety limit
    if (i >= 999) {
      console.warn("⚠️ Safety limit reached.");
      break;
    }
  }

  // Final collection
  collectVisibleTracks();

  const result = [...tracks.values()]
    .map((track, index) =>
      `${index + 1}. ${track.title} — ${track.artists.join(", ")}`
    )
    .join("\n");

  console.log("");
  console.log("======================================");
  console.log(`🎵 TOTAL TRACKS FOUND: ${tracks.size}`);
  console.log("======================================");
  console.log(result);

  // Put the result into a global variable
  window.spotifyPlaylistResult = result;

  console.log("");
  console.log("📦 Result saved as:");
  console.log("spotifyPlaylistResult");
  console.log("");
  console.log("💡 To copy it manually, run:");
  console.log("navigator.clipboard.writeText(spotifyPlaylistResult)");
})();
