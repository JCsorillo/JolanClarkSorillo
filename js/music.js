export function initMusic() {
  const playlist = document.querySelector("[data-local-playlist]");
  if (!playlist) return;

  const player = playlist.querySelector("[data-music-player]");
  const nowPlaying = playlist.querySelector("[data-now-playing]");
  const tracks = [...playlist.querySelectorAll("[data-src]")];

  const selectTrack = (track, autoplay = true) => {
    tracks.forEach((item) => item.classList.remove("is-playing"));
    track.classList.add("is-playing");
    nowPlaying.textContent = track.querySelector(".music-track-name")?.textContent.trim() || "Unknown track";
    playlist.querySelectorAll(".music-track-action").forEach((label) => { label.textContent = "Play"; });
    track.querySelector(".music-track-action").textContent = "Playing";
    player.dataset.activeTrack = track.dataset.track;
    player.src = track.dataset.src;
    player.load();
    if (autoplay) player.play().catch(() => {});
  };

  tracks.forEach((track) => {
    track.addEventListener("click", () => {
      if (player.dataset.activeTrack === track.dataset.track) {
        if (player.paused) player.play().catch(() => {});
        else player.pause();
        return;
      }
      selectTrack(track);
    });
  });

  player.addEventListener("pause", () => {
    const active = playlist.querySelector(`[data-track="${player.dataset.activeTrack || ""}"]`);
    if (active) active.querySelector(".music-track-action").textContent = "Play";
  });
  player.addEventListener("play", () => {
    const active = playlist.querySelector(`[data-track="${player.dataset.activeTrack || ""}"]`);
    if (active) active.querySelector(".music-track-action").textContent = "Playing";
  });
  player.addEventListener("ended", () => {
    const index = tracks.findIndex((track) => track.dataset.track === player.dataset.activeTrack);
    if (index >= 0 && tracks[index + 1]) selectTrack(tracks[index + 1]);
  });

  const section = document.querySelector("#music");
  if (section && "IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting && !player.paused) player.pause();
    }, { threshold: 0 }).observe(section);
  }
}

initMusic();
