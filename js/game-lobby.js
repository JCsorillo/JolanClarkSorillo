const carousel = document.querySelector("[data-game-carousel]");
if (carousel) {
  const canvas = carousel.querySelector("[data-game-preview-canvas]");
  const context = canvas.getContext("2d");
  const title = carousel.querySelector("[data-game-preview-title]");
  const description = carousel.querySelector("[data-game-preview-description]");
  const instructions = carousel.querySelector("[data-game-preview-instructions]");
  const number = carousel.querySelector("[data-game-preview-number]");
  const play = carousel.querySelector("[data-game-preview-play]");
  const dots = carousel.querySelector("[data-game-preview-dots]");
  const games = [
    { key: "bughop", name: "Bug Hop", description: "Jump over pixel bugs. See how long you can last.", instructions: "Press Space, ↑, or W to jump.", scene: "bughop" },
    { key: "math", name: "Quick Math", description: "A fast little arithmetic round against the clock.", instructions: "Choose an answer or type it and press Enter.", scene: "math" },
    { key: "riddle", name: "Riddle Me This", description: "One clue at a time. Can you think your way through?", instructions: "Read the clue and enter your answer.", scene: "riddle" },
    { key: "typing", name: "Typing Speed", description: "Find your pace and accuracy in a quick typing test.", instructions: "Type the sample exactly as it appears.", scene: "typing" },
    { key: "hangman", name: "Hangman", description: "Guess the hidden word one letter at a time.", instructions: "Pick letters before the drawing is complete.", scene: "hangman" },
    { key: "spelling", name: "Spelling Bee", description: "Put the mixed-up letters back in the right order.", instructions: "Unscramble the letters and submit the word.", scene: "spelling" },
    { key: "words", name: "Word Builder", description: "Make words from a small set of letters before time runs out.", instructions: "Use each available letter no more than once per word.", scene: "words" }
  ];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;
  let raf = 0;
  let visible = false;
  let lastTime = 0;
  let width = 720;
  let height = 320;

  const colors = () => {
    const style = getComputedStyle(document.body);
    return {
      ink: style.getPropertyValue("--home-text").trim() || "#111",
      paper: style.getPropertyValue("--home-bg").trim() || "#f8f8f8",
      muted: style.getPropertyValue("--home-muted").trim() || "#777",
      line: style.getPropertyValue("--home-line").trim() || "#ddd",
      accent: style.getPropertyValue("--color-accent").trim() || "#6f63e8"
    };
  };

  const roundedRect = (x, y, w, h, radius, fill) => {
    context.fillStyle = fill;
    context.beginPath();
    context.roundRect(x, y, w, h, radius);
    context.fill();
  };

  const text = (value, x, y, size, color, weight = 600, align = "left") => {
    context.fillStyle = color;
    context.font = `${weight} ${size}px Inter, system-ui, sans-serif`;
    context.textAlign = align;
    context.fillText(value, x, y);
  };

  const drawScene = (time = 0) => {
    const { ink, paper, muted, line, accent } = colors();
    const game = games[index];
    context.clearRect(0, 0, width, height);
    context.fillStyle = paper;
    context.fillRect(0, 0, width, height);

    context.fillStyle = line;
    context.globalAlpha = 0.38;
    for (let x = 30; x < width; x += 38) {
      for (let y = 28; y < height; y += 38) {
        context.fillRect(x, y, 1, 1);
      }
    }
    context.globalAlpha = 1;
    text("JOLAN'S MINI ARCADE", 42, 48, 11, muted, 700);
    roundedRect(width - 147, 28, 104, 30, 15, line);
    text(`${String(index + 1).padStart(2, "0")} / 07`, width - 95, 48, 11, ink, 700, "center");

    if (game.scene === "bughop") {
      context.fillStyle = line;
      context.fillRect(0, 248, width, 2);
      context.fillStyle = muted;
      for (let x = -26 + (time * 0.05) % 26; x < width; x += 26) context.fillRect(x, 270, 12, 3);
      roundedRect(128, 190 - Math.abs(Math.sin(time * 0.003)) * 20, 34, 34, 3, ink);
      context.fillStyle = paper;
      context.fillRect(136, 198, 18, 12);
      context.fillStyle = ink;
      context.fillRect(140, 202, 3, 3);
      context.fillRect(148, 202, 3, 3);
      roundedRect(460 - (time * 0.09) % 300, 218, 26, 30, 3, accent);
      roundedRect(565 - (time * 0.09) % 300, 204, 44, 44, 3, ink);
      text("404", 587 - (time * 0.09) % 300, 231, 12, paper, 700, "center");
      text("SPACE", 550, 108, 12, muted, 700, "center");
      text("TO JUMP", 550, 126, 11, muted, 500, "center");
    } else if (game.scene === "math") {
      roundedRect(124, 84, 472, 164, 20, line);
      roundedRect(130, 90, 460, 152, 16, paper);
      text("12 × 4  =  ?", 360, 152, 35, ink, 700, "center");
      [40, 48, 38, 42].forEach((w, i) => {
        roundedRect(169 + i * 102, 182, 74, 42, 12, i === 2 ? accent : line);
        text(["36", "48", "42", "52"][i], 206 + i * 102, 209, 15, i === 2 ? "#fff" : ink, 700, "center");
      });
      text("00:24", 360, 278, 12, muted, 700, "center");
      roundedRect(255, 290, 210, 4, line);
      roundedRect(255, 290, 132, 4, accent);
    } else if (game.scene === "riddle") {
      roundedRect(125, 85, 470, 160, 20, line);
      roundedRect(131, 91, 458, 148, 16, paper);
      text("RIDDLE  03", 360, 126, 11, accent, 700, "center");
      text("What has keys but", 360, 165, 22, ink, 700, "center");
      text("opens no locks?", 360, 194, 22, ink, 700, "center");
      roundedRect(240, 211, 240, 2, line);
    } else if (game.scene === "typing") {
      roundedRect(105, 78, 510, 176, 18, line);
      roundedRect(111, 84, 498, 164, 14, paper);
      text("TYPE THE LINE", 142, 117, 11, muted, 700);
      text("Pixel blocks move quickly", 142, 158, 21, ink, 600);
      text("across a quiet screen.", 142, 188, 21, muted, 600);
      context.fillStyle = accent;
      context.fillRect(142, 201, 2, 24);
      roundedRect(142, 224, 445, 1, line);
      text("42 WPM", 360, 285, 13, ink, 700, "center");
    } else if (game.scene === "hangman") {
      context.strokeStyle = ink;
      context.lineWidth = 5;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(276, 240); context.lineTo(420, 240);
      context.moveTo(310, 240); context.lineTo(310, 92);
      context.lineTo(394, 92); context.lineTo(394, 116);
      context.stroke();
      context.beginPath();
      context.arc(394, 137, 21, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.moveTo(394, 158); context.lineTo(394, 208);
      context.moveTo(394, 172); context.lineTo(366, 192);
      context.moveTo(394, 172); context.lineTo(422, 192);
      context.moveTo(394, 208); context.lineTo(371, 232);
      context.moveTo(394, 208); context.lineTo(417, 232);
      context.stroke();
      text("_  _  _  _  _", 510, 187, 20, accent, 700, "center");
    } else if (game.scene === "spelling") {
      text("UNSCRAMBLE THIS WORD", 360, 108, 11, muted, 700, "center");
      ["L", "P", "A", "N", "E", "T"].forEach((letter, i) => {
        const x = 212 + i * 55;
        roundedRect(x, 132, 42, 48, 10, i === 3 ? accent : line);
        text(letter, x + 21, 163, 21, i === 3 ? "#fff" : ink, 700, "center");
      });
      roundedRect(229, 203, 262, 2, line);
      text("PLANET", 360, 236, 13, ink, 700, "center");
    } else {
      text("BUILD WORDS BEFORE TIME RUNS OUT", 360, 103, 11, muted, 700, "center");
      ["P", "L", "A", "N", "E", "T"].forEach((letter, i) => {
        const x = 198 + i * 57;
        roundedRect(x, 126, 44, 50, 11, i === 0 ? accent : line);
        text(letter, x + 22, 158, 21, i === 0 ? "#fff" : ink, 700, "center");
      });
      text("PLAN · LATE · LEAP", 360, 225, 15, ink, 700, "center");
      text("00:42", 360, 264, 12, muted, 700, "center");
    }
  };

  const paint = (time) => {
    if (!visible || document.hidden || reducedMotion.matches) {
      raf = 0;
      drawScene();
      return;
    }
    raf = requestAnimationFrame(paint);
    drawScene(time);
  };

  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  const start = () => {
    stop();
    if (visible && !document.hidden && !reducedMotion.matches) raf = requestAnimationFrame(paint);
    else drawScene();
  };

  const select = (next) => {
    index = (next + games.length) % games.length;
    const game = games[index];
    title.textContent = game.name;
    description.textContent = game.description;
    instructions.textContent = game.instructions;
    number.textContent = `${String(index + 1).padStart(2, "0")} / ${String(games.length).padStart(2, "0")}`;
    play.href = `game.html?game=${game.key}`;
    play.setAttribute("aria-label", `Play ${game.name}`);
    dots.querySelectorAll("button").forEach((dot, dotIndex) => {
      dot.setAttribute("aria-current", String(dotIndex === index));
      dot.setAttribute("aria-label", `Show ${games[dotIndex].name} preview`);
    });
    drawScene();
  };

  games.forEach((game, dotIndex) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show ${game.name} preview`);
    dot.setAttribute("aria-current", String(dotIndex === index));
    dot.addEventListener("click", () => select(dotIndex));
    dots.append(dot);
  });
  carousel.querySelector("[data-game-preview-prev]").addEventListener("click", () => select(index - 1));
  carousel.querySelector("[data-game-preview-next]").addEventListener("click", () => select(index + 1));
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") select(index - 1);
    if (event.key === "ArrowRight") select(index + 1);
  });

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    drawScene();
  };

  const observer = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) start();
    else stop();
  }, { threshold: 0.15 });
  observer.observe(carousel);
  document.addEventListener("visibilitychange", start);
  reducedMotion.addEventListener?.("change", start);
  window.addEventListener("resize", resize);
  select(0);
  resize();
}
