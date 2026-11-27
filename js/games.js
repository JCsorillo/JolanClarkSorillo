export function initEntertainmentGames() {
  const memoryBest = {};
  const getBest = (key, fallback = 0) => {
    try {
      const value = Number(localStorage.getItem(key));
      return Number.isFinite(value) ? value : fallback;
    } catch {
      return Number.isFinite(memoryBest[key]) ? memoryBest[key] : fallback;
    }
  };
  const setBest = (key, value) => {
    memoryBest[key] = value;
    try { localStorage.setItem(key, String(value)); } catch {}
  };

  const panels = [...document.querySelectorAll("[data-game-panel]")];
  const gameInfo = {
    bughop: ["Bug Hop", "Jump the bugs, dodge the 404s, and keep your run alive."],
    math: ["Quick Math", "Answer as many arithmetic questions as you can in 30 seconds."],
    riddle: ["Riddle Me This", "Solve a short collection of classic riddles."],
    typing: ["Typing Speed", "Type the sample exactly and track your pace and accuracy."],
    hangman: ["Hangman", "Guess the hidden word before the drawing is complete."],
    spelling: ["Spelling Bee", "Unscramble each set of letters to find the word."],
    words: ["Word Builder", "Build as many different words as you can before time runs out."],
    memory: ["Memory Match", "Find all six matching pairs in as few moves as you can."]
  };
  const rawParam = new URLSearchParams(window.location.search).get("game") || "";
  const requestedGame = rawParam.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  const gameAlias = {
    bughop: "bughop", bug: "bughop", hop: "bughop",
    math: "math", quickmath: "math",
    riddle: "riddle",
    typing: "typing", typetest: "typing",
    hangman: "hangman",
    spelling: "spelling", spellingbee: "spelling",
    words: "words", wordbuilder: "words",
    memory: "memory", memorymatch: "memory"
  };
  const activeGame = gameAlias[requestedGame] || "bughop";
  const activePanel = panels.find((panel) => panel.dataset.gamePanel === activeGame);
  panels.forEach((panel) => { panel.hidden = panel !== activePanel; });
  document.querySelector("[data-game-title]").textContent = gameInfo[activeGame][0];
  document.querySelector("[data-game-description]").textContent = gameInfo[activeGame][1];
  document.title = `${gameInfo[activeGame][0]} | Entertainment | Jolan Clark A. Sorillo`;

  if (activeGame === "bughop") initBugHop();
  if (activeGame === "math") initQuickMath();
  if (activeGame === "riddle") initRiddle();
  if (activeGame === "typing") initTyping();
  if (activeGame === "hangman") initHangman();
  if (activeGame === "spelling") initSpelling();
  if (activeGame === "words") initWordBuilder();
  if (activeGame === "memory") initMemoryMatch();

  const startScreen = activePanel.querySelector("[data-play-screen]");
  const gameContent = activePanel.querySelector("[data-game-content]");
  const gameStart = activePanel.querySelector("[data-game-start]");
  gameStart.addEventListener("click", () => {
    startScreen.hidden = true;
    gameContent.inert = false;
    const starter = {
      bughop: "[data-bug-jump]",
      math: "[data-math-start]",
      typing: "[data-typing-start]",
      hangman: "[data-hangman-reset]",
      words: "[data-words-start]",
      memory: "[data-memory-reset]"
    }[activeGame];
    if (starter) activePanel.querySelector(starter).click();
    else activePanel.querySelector("input")?.focus();
  });

  function initBugHop() {
    const canvas = document.querySelector("[data-bughop-canvas]");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const jumpButton = document.querySelector("[data-bug-jump]");
    const scoreLabel = document.querySelector("[data-bug-score]");
    const bestLabel = document.querySelector("[data-bug-best]");
    const live = document.querySelector("[data-bug-live]");
    const shell = document.querySelector('[data-game-panel="bughop"]');
    const gameContent = shell.querySelector("[data-game-content]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ink = "#0a0a0b";
    let paper = "#fcfbfc";
    let muted = "#77777c";
    let raf = 0;
    let lastTime = 0;
    let accumulator = 0;
    let state = "idle";
    let elapsed = 0;
    let score = 0;
    let best = getBest("jcs_best_bughop");
    let lockUntil = 0;
    let visible = true;
    let obstacleDistance = 520;
    let groundOffset = 0;
    let clouds = [
      { x: 120, y: 42, speed: 12 },
      { x: 430, y: 30, speed: 8 }
    ];
    let obstacles = [];
    let player = { x: 72, y: 150, w: 28, h: 28, vy: 0, onGround: true };
    bestLabel.textContent = String(best);

    const readColors = () => {
      const style = getComputedStyle(canvas);
      ink = style.getPropertyValue("--ink").trim() || "#0a0a0b";
      paper = style.getPropertyValue("--paper").trim() || "#fcfbfc";
      muted = style.getPropertyValue("--muted").trim() || "#77777c";
    };
    readColors();
    new MutationObserver(readColors).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round((rect.width * 220 / 720) * dpr);
      ctx.setTransform(canvas.width / 720, 0, 0, canvas.height / 220, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const reset = () => {
      state = "running";
      elapsed = 0;
      score = 0;
      obstacleDistance = 520;
      obstacles = [];
      player = { x: 72, y: 150, w: 28, h: 28, vy: 0, onGround: true };
      scoreLabel.textContent = "0";
      live.textContent = "Running.";
    };

    const jump = () => {
      if (performance.now() < lockUntil) return;
      if (state === "idle" || state === "gameover") {
        reset();
        startLoop();
        return;
      }
      if (player.onGround) {
        player.vy = -680;
        player.onGround = false;
      }
      startLoop();
    };

    const makeObstacle = () => {
      const kind = Math.floor(Math.random() * 3);
      const sizes = [{ w: 22, h: 26 }, { w: 34, h: 18 }, { w: 46, h: 32 }];
      const size = sizes[kind];
      obstacles.push({ x: 760, y: 178 - size.h, w: size.w, h: size.h, kind });
      if (Math.random() < 0.22) {
        obstacles.push({ x: 760 + size.w + 10, y: 178 - 22, w: 22, h: 22, kind: 0 });
      }
    };

    const update = (dt) => {
      if (state !== "running") return;
      elapsed += dt;
      const speed = 320 + Math.min(440, elapsed / 90 * 440);
      const jumpDuration = 2 * 680 / 1700;
      const jumpDistance = jumpDuration * speed;
      const minGap = jumpDistance * 1.3;
      player.vy += 1700 * dt;
      player.y += player.vy * dt;
      if (player.y >= 150) {
        player.y = 150;
        player.vy = 0;
        player.onGround = true;
      }

      groundOffset = (groundOffset + speed * dt) % 24;
      if (!reducedMotion) {
        clouds.forEach((cloud) => {
          cloud.x -= cloud.speed * dt;
          if (cloud.x < -60) cloud.x = 760;
        });
      }

      obstacleDistance -= speed * dt;
      if (obstacleDistance <= 0) {
        makeObstacle();
        obstacleDistance = Math.max(minGap, 500) + Math.random() * 220;
      }
      obstacles.forEach((obstacle) => { obstacle.x -= speed * dt; });
      obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.w > -10);

      score += dt * (10 + Math.min(20, elapsed / 90 * 20));
      const displayScore = Math.floor(score);
      scoreLabel.textContent = String(displayScore);

      const pad = 4;
      for (const obstacle of obstacles) {
        if (player.x + player.w - pad > obstacle.x &&
            player.x + pad < obstacle.x + obstacle.w &&
            player.y + player.h - pad > obstacle.y &&
            player.y + pad < obstacle.y + obstacle.h) {
          state = "gameover";
          lockUntil = performance.now() + 600;
          const finalScore = Math.floor(score);
          if (finalScore > best) {
            best = finalScore;
            setBest("jcs_best_bughop", best);
          }
          bestLabel.textContent = String(best);
          live.textContent = `Game over. Score ${finalScore}. Best ${best}. Press Space or tap to retry.`;
          break;
        }
      }
    };

    const drawPixelText = (text, x, y, align = "left") => {
      ctx.save();
      ctx.fillStyle = muted;
      ctx.font = "bold 12px monospace";
      ctx.textAlign = align;
      ctx.fillText(text, x, y);
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, 720, 220);
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, 720, 220);
      ctx.fillStyle = muted;
      if (!reducedMotion) {
        clouds.forEach((cloud) => {
          ctx.fillRect(cloud.x, cloud.y, 38, 5);
          ctx.fillRect(cloud.x + 8, cloud.y - 5, 18, 5);
        });
      }
      ctx.fillStyle = ink;
      ctx.fillRect(0, 178, 720, 3);
      ctx.fillStyle = muted;
      for (let x = -24 + groundOffset * -1; x < 720; x += 24) ctx.fillRect(x, 192, 12, 3);

      ctx.fillStyle = ink;
      ctx.fillRect(player.x, player.y, player.w, player.h);
      ctx.fillStyle = paper;
      ctx.fillRect(player.x + 5, player.y + 6, 18, 12);
      ctx.fillStyle = ink;
      ctx.fillRect(player.x + 8, player.y + 9, 3, 3);
      ctx.fillRect(player.x + 17, player.y + 9, 3, 3);
      ctx.fillRect(player.x + 10, player.y + 18, 8, 2);

      obstacles.forEach((obstacle) => {
        ctx.fillStyle = ink;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
        ctx.fillStyle = paper;
        if (obstacle.kind === 2) {
          ctx.fillRect(obstacle.x + 6, obstacle.y + 7, 34, 7);
          ctx.fillStyle = ink;
          ctx.font = "bold 12px monospace";
          ctx.fillText("404", obstacle.x + 8, obstacle.y + 18);
        } else {
          ctx.fillRect(obstacle.x + 5, obstacle.y + 5, 5, 5);
          ctx.fillRect(obstacle.x + obstacle.w - 10, obstacle.y + 5, 5, 5);
        }
      });

      if (state === "idle") drawPixelText("PRESS SPACE OR TAP TO START", 360, 112, "center");
      if (state === "gameover") drawPixelText("PRESS SPACE OR TAP TO RETRY", 360, 112, "center");
    };

    const loop = (time) => {
      if (!visible || document.hidden || shell.hidden) {
        raf = 0;
        lastTime = 0;
        accumulator = 0;
        return;
      }
      if (!lastTime) lastTime = time;
      accumulator += Math.min(100, time - lastTime);
      lastTime = time;
      const fixed = 1 / 120;
      while (accumulator >= fixed * 1000) {
        update(fixed);
        accumulator -= fixed * 1000;
      }
      draw();
      if (state !== "running") {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (state !== "running") {
        draw();
        return;
      }
      if (!raf) {
        lastTime = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    const stopLoop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      lastTime = 0;
      accumulator = 0;
    };

    jumpButton.addEventListener("click", jump);
    canvas.addEventListener("pointerdown", (event) => { event.preventDefault(); jump(); });
    window.addEventListener("keydown", (event) => {
      if (![" ", "ArrowUp", "w", "W"].includes(event.key)) return;
      if (shell.hidden || gameContent.inert) return;
      event.preventDefault();
      jump();
    });
    window.addEventListener("blur", stopLoop);
    window.addEventListener("focus", () => { if (visible && !document.hidden) startLoop(); });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopLoop();
      else if (visible && !shell.hidden) startLoop();
    });

    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible && !document.hidden && !shell.hidden) startLoop();
      else stopLoop();
    }, { threshold: 0.15 });
    observer.observe(shell);
    draw();
  }

  function initQuickMath() {
    const panel = document.querySelector('[data-game-panel="math"]');
    if (!panel) return;
    const question = panel.querySelector("[data-math-question]");
    const choices = panel.querySelector("[data-math-choices]");
    const input = panel.querySelector("[data-math-input]");
    const form = panel.querySelector("[data-math-form]");
    const submit = form.querySelector("button");
    const startButton = panel.querySelector("[data-math-start]");
    const scoreLabel = panel.querySelector("[data-math-score]");
    const bestLabel = panel.querySelector("[data-math-best]");
    const timeLabel = panel.querySelector("[data-math-time]");
    const bar = panel.querySelector("[data-math-bar]");
    const live = panel.querySelector("[data-math-live]");
    let timer = 0;
    let remainingMs = 30000;
    let lastTimerAt = 0;
    let score = 0;
    let streak = 0;
    let correct = 0;
    let attempts = 0;
    let answer = 0;
    let active = false;
    let best = getBest("jcs_best_math");
    let visible = true;
    bestLabel.textContent = String(best);

    const stopTimer = () => {
      if (timer) {
        remainingMs = Math.max(0, remainingMs - (performance.now() - lastTimerAt));
        clearInterval(timer);
      }
      timer = 0;
      lastTimerAt = 0;
    };
    const startTimer = () => {
      if (active && visible && !document.hidden && !timer) {
        lastTimerAt = performance.now();
        timer = setInterval(tick, 100);
      }
    };
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopTimer();
      else startTimer();
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible) startTimer();
        else stopTimer();
      }, { threshold: 0.15 }).observe(panel);
    }

    const makeQuestion = () => {
      const elapsed = active ? 30 - remainingMs / 1000 : 0;
      const max = elapsed > 20 ? 20 : elapsed > 10 ? 12 : 9;
      const ops = elapsed > 15 ? ["+", "-", "x"] : ["+", "-", "x"];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let a = Math.floor(Math.random() * max) + 1;
      let b = Math.floor(Math.random() * max) + 1;
      if (op === "-") { if (b > a) [a, b] = [b, a]; answer = a - b; }
      else if (op === "x") { a = Math.floor(Math.random() * Math.min(12, max)) + 1; b = Math.floor(Math.random() * 12) + 1; answer = a * b; }
      else answer = a + b;
      question.textContent = `${a} ${op} ${b} = ?`;
      const values = new Set([answer]);
      while (values.size < 4) {
        const offset = Math.floor(Math.random() * 9) - 4;
        const value = answer + (offset === 0 ? 5 : offset);
        if (value >= 0) values.add(value);
      }
      choices.replaceChildren(...[...values].sort(() => Math.random() - 0.5).map((value) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = String(value);
        button.addEventListener("click", () => submitAnswer(value));
        return button;
      }));
      input.value = "";
      input.focus();
    };

    const submitAnswer = (value) => {
      if (!active) return;
      attempts++;
      if (value === answer) {
        streak++;
        const bonus = Math.min(10, streak * 2);
        score += 10 + bonus;
        correct++;
        live.textContent = `Correct. +${10 + bonus} points.`;
      } else {
        streak = 0;
        live.textContent = `Incorrect. The answer was ${answer}.`;
      }
      scoreLabel.textContent = String(score);
      makeQuestion();
    };

    const finish = () => {
      active = false;
      clearInterval(timer);
      timer = 0;
      lastTimerAt = 0;
      remainingMs = 0;
      timeLabel.textContent = "0";
      bar.style.transform = "scaleX(0)";
      input.disabled = true;
      submit.disabled = true;
      [...choices.querySelectorAll("button")].forEach((button) => { button.disabled = true; });
      if (score > best) { best = score; setBest("jcs_best_math", best); }
      bestLabel.textContent = String(best);
      const accuracy = attempts ? Math.round(correct / attempts * 100) : 0;
      question.textContent = `Score ${score} · Accuracy ${accuracy}%`;
      live.textContent = `Round over. Score ${score}. Best ${best}. Accuracy ${accuracy} percent.`;
      startButton.hidden = false;
      startButton.textContent = "Play again";
    };

    const tick = () => {
      if (!active) return;
      if (!panel.closest("[data-game-panel]").hidden && !document.hidden) {
        const now = performance.now();
        remainingMs = Math.max(0, remainingMs - (now - lastTimerAt));
        lastTimerAt = now;
        const remaining = remainingMs;
        const seconds = Math.ceil(remaining / 1000);
        timeLabel.textContent = String(seconds);
        bar.style.transform = `scaleX(${remaining / 30000})`;
        if (remaining <= 0) finish();
      }
    };

    startButton.addEventListener("click", () => {
      score = 0;
      streak = 0;
      correct = 0;
      attempts = 0;
      active = true;
      remainingMs = 30000;
      scoreLabel.textContent = "0";
      timeLabel.textContent = "30";
      bar.style.transform = "scaleX(1)";
      input.disabled = false;
      submit.disabled = false;
      startButton.hidden = true;
      live.textContent = "Round started.";
      makeQuestion();
      startTimer();
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (input.value !== "") submitAnswer(Number(input.value));
    });
  }

  function initRiddle() {
    const panel = document.querySelector('[data-game-panel="riddle"]');
    if (!panel) return;
    const riddles = [
      ["What has keys but opens no locks?", ["piano"]],
      ["What gets wetter as it dries?", ["towel"]],
      ["What has many teeth but cannot bite?", ["comb"]],
      ["I have a face and two hands but no arms or legs. What am I?", ["clock", "watch"]],
      ["What goes up but never comes down?", ["age"]]
    ];
    let index = 0;
    const question = panel.querySelector("[data-riddle-question]");
    const form = panel.querySelector("[data-riddle-form]");
    const input = panel.querySelector("[data-riddle-input]");
    const live = panel.querySelector("[data-riddle-live]");
    const show = () => { question.textContent = riddles[index][0]; live.textContent = ""; input.value = ""; input.focus(); };
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = input.value.trim().toLowerCase();
      if (riddles[index][1].includes(value)) {
        index = (index + 1) % riddles.length;
        show();
        live.textContent = "Correct! Here is the next one.";
      } else live.textContent = "Try again.";
    });
    show();
  }

  function initTyping() {
    const panel = document.querySelector('[data-game-panel="typing"]');
    if (!panel) return;
    const prompt = "Pixel blocks move quickly across a quiet screen.";
    const promptEl = panel.querySelector("[data-typing-prompt]");
    const input = panel.querySelector("[data-typing-input]");
    const start = panel.querySelector("[data-typing-start]");
    const wpm = panel.querySelector("[data-typing-wpm]");
    const accuracy = panel.querySelector("[data-typing-accuracy]");
    const live = panel.querySelector("[data-typing-live]");
    let activeTimeMs = 0;
    let lastTimerAt = 0;
    let timer = 0;
    let typingActive = false;
    let typingVisible = true;
    const stopTimer = () => {
      if (timer) {
        activeTimeMs += performance.now() - lastTimerAt;
        clearInterval(timer);
      }
      timer = 0;
      lastTimerAt = 0;
    };
    const updateTyping = () => {
      if (!typingActive || panel.hidden) return;
      const now = performance.now();
      activeTimeMs += now - lastTimerAt;
      lastTimerAt = now;
      const elapsed = activeTimeMs / 60000;
      const words = input.value.trim().split(/\s+/).filter(Boolean).length;
      wpm.textContent = elapsed > 0 ? String(Math.round(words / elapsed)) : "0";
      let matches = 0;
      [...input.value].forEach((char, index) => { if (char === prompt[index]) matches++; });
      accuracy.textContent = `${input.value.length ? Math.round(matches / input.value.length * 100) : 0}%`;
      if (input.value === prompt) {
        typingActive = false;
        stopTimer();
        input.disabled = true;
        live.textContent = `Complete. ${wpm.textContent} words per minute with ${accuracy.textContent} accuracy.`;
        start.textContent = "Try again";
      }
    };
    const startTimer = () => {
      if (typingActive && typingVisible && !document.hidden && !timer) {
        lastTimerAt = performance.now();
        timer = setInterval(updateTyping, 100);
      }
    };
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopTimer();
      else startTimer();
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        typingVisible = entries[0].isIntersecting;
        if (typingVisible) startTimer();
        else stopTimer();
      }, { threshold: 0.15 }).observe(panel);
    }
    promptEl.textContent = prompt;
    start.addEventListener("click", () => {
      typingActive = true;
      input.disabled = false;
      input.value = "";
      activeTimeMs = 0;
      wpm.textContent = "0";
      accuracy.textContent = "0%";
      live.textContent = "Typing test started.";
      input.focus();
      stopTimer();
      startTimer();
    });
  }

  function initHangman() {
    const panel = document.querySelector('[data-game-panel="hangman"]');
    if (!panel) return;
    const words = ["pixel", "laptop", "network", "keyboard", "javascript", "screen", "music", "coffee"];
    const wordEl = panel.querySelector("[data-hangman-word]");
    const lettersEl = panel.querySelector("[data-hangman-letters]");
    const drawing = panel.querySelector("[data-hangman-drawing]");
    const live = panel.querySelector("[data-hangman-live]");
    const reset = panel.querySelector("[data-hangman-reset]");
    let word = "";
    let guesses = [];
    let wrong = 0;
    const render = () => {
      wordEl.textContent = [...word].map((char) => guesses.includes(char) ? char : "_").join(" ");
      drawing.textContent = ["___", "__|_", "_|_|", "_/|_", "_/|\\_", "_/|\\_ /", "_/|\\_ / \\"][Math.min(wrong, 6)];
      [...lettersEl.querySelectorAll("button")].forEach((button) => { button.disabled = guesses.includes(button.textContent.toLowerCase()); });
      if ([...word].every((char) => guesses.includes(char))) live.textContent = `You got it: ${word}.`;
      else if (wrong >= 6) live.textContent = `The word was ${word}. Start a new word.`;
    };
    const newWord = () => {
      word = words[Math.floor(Math.random() * words.length)];
      guesses = [];
      wrong = 0;
      live.textContent = "Guess the word.";
      lettersEl.replaceChildren(..."abcdefghijklmnopqrstuvwxyz".split("").map((letter) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = letter.toUpperCase();
        button.addEventListener("click", () => {
          const char = letter;
          if (guesses.includes(char) || wrong >= 6) return;
          guesses.push(char);
          if (!word.includes(char)) wrong++;
          render();
        });
        return button;
      }));
      render();
    };
    reset.addEventListener("click", newWord);
    newWord();
  }

  function initSpelling() {
    const panel = document.querySelector('[data-game-panel="spelling"]');
    if (!panel) return;
    const words = ["garden", "planet", "rhythm", "castle", "camera", "silver", "puzzle", "orange"];
    let word = "";
    const letters = panel.querySelector("[data-spelling-letters]");
    const form = panel.querySelector("[data-spelling-form]");
    const input = panel.querySelector("[data-spelling-input]");
    const live = panel.querySelector("[data-spelling-live]");
    const next = () => {
      word = words[Math.floor(Math.random() * words.length)];
      letters.textContent = [...word].sort(() => Math.random() - 0.5).join(" ");
      input.value = "";
      live.textContent = "Unscramble the letters.";
      input.focus();
    };
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (input.value.trim().toLowerCase() === word) {
        next();
        live.textContent = "Correct! Here is the next scramble.";
      }
      else live.textContent = "Not quite. Try again.";
    });
    next();
  }

  function initWordBuilder() {
    const panel = document.querySelector('[data-game-panel="words"]');
    if (!panel) return;
    const lettersEl = panel.querySelector("[data-words-letters]");
    const form = panel.querySelector("[data-words-form]");
    const input = panel.querySelector("[data-words-input]");
    const start = panel.querySelector("[data-words-start]");
    const timeLabel = panel.querySelector("[data-words-time]");
    const countLabel = panel.querySelector("[data-words-count]");
    const live = panel.querySelector("[data-words-live]");
    const wordSets = {
      planet: ["planet", "plane", "plant", "panel", "plate", "petal", "leapt", "pleat", "ant", "tan", "pan", "nap", "tap", "pat", "pen", "net", "ten", "pet", "let", "tea", "eat", "ate", "pal", "lap", "pale", "leap", "lane", "lean", "teal", "tale", "late", "peat"],
      garden: ["garden", "danger", "ranged", "range", "anger", "grade", "grand", "aged", "dare", "dear", "read", "earn", "near", "gear", "rage", "rang", "den", "end", "red", "ran", "rag", "age", "ear", "are", "and", "nag", "drag", "darn"],
      castle: ["castle", "cleats", "least", "stale", "steal", "slate", "scale", "tales", "cleat", "case", "sale", "seal", "east", "seat", "last", "late", "tale", "teal", "cat", "act", "tea", "eat", "sat", "set", "let", "ale"],
      orange: ["orange", "groan", "organ", "range", "anger", "gear", "earn", "near", "gone", "one", "ore", "age", "rag", "ran", "nag", "are", "era", "ear", "roe", "nor", "go"],
      stream: ["stream", "master", "tamers", "teams", "steam", "tears", "rates", "stare", "smear", "smart", "mates", "meat", "team", "tear", "rate", "seat", "same", "tame", "mast", "star", "art", "ram", "sea", "eat", "tea"]
    };
    let letters = "";
    let used = new Set();
    let active = false;
    let remainingMs = 60000;
    let lastTimerAt = 0;
    let timer = 0;
    let visible = true;
    const stopTimer = () => {
      if (timer) {
        remainingMs = Math.max(0, remainingMs - (performance.now() - lastTimerAt));
        clearInterval(timer);
      }
      timer = 0;
      lastTimerAt = 0;
    };
    const startTimer = () => {
      if (active && visible && !document.hidden && !timer) {
        lastTimerAt = performance.now();
        timer = setInterval(updateTime, 100);
      }
    };
    const updateTime = () => {
      if (!active) return;
      const now = performance.now();
      remainingMs = Math.max(0, remainingMs - (now - lastTimerAt));
      lastTimerAt = now;
      const remaining = remainingMs;
      timeLabel.textContent = String(Math.max(0, Math.ceil(remaining / 1000)));
      if (remaining <= 0) {
        active = false;
        stopTimer();
        input.disabled = true;
        start.hidden = false;
        start.textContent = "Play again";
        live.textContent = `Time. You built ${used.size} words.`;
      }
    };
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopTimer();
      else startTimer();
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible) startTimer();
        else stopTimer();
      }, { threshold: 0.15 }).observe(panel);
    }
    const startRound = () => {
      const set = Object.keys(wordSets)[Math.floor(Math.random() * Object.keys(wordSets).length)];
      letters = set;
      lettersEl.textContent = `Letters: ${letters.toUpperCase().split("").join(" ")}`;
      used = new Set();
      active = true;
      remainingMs = 60000;
      timeLabel.textContent = "60";
      countLabel.textContent = "0";
      input.disabled = false;
      input.value = "";
      start.hidden = true;
      live.textContent = "Round started.";
      input.focus();
      stopTimer();
      startTimer();
    };
    start.addEventListener("click", startRound);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!active) return;
      const word = input.value.trim().toLowerCase();
      const valid = word.length >= 3 && wordSets[letters].includes(word) && !used.has(word);
      if (valid) {
        used.add(word);
        countLabel.textContent = String(used.size);
        live.textContent = "Valid word.";
      } else live.textContent = "Use at least 3 letters, each available letter once, without repeats.";
      input.value = "";
    });
  }

  function initMemoryMatch() {
    const panel = document.querySelector('[data-game-panel="memory"]');
    if (!panel) return;
    const board = panel.querySelector("[data-memory-board]");
    const pairsLabel = panel.querySelector("[data-memory-pairs]");
    const movesLabel = panel.querySelector("[data-memory-moves]");
    const live = panel.querySelector("[data-memory-live]");
    const reset = panel.querySelector("[data-memory-reset]");
    const symbols = ["◆", "●", "▲", "★", "■", "✦"];
    let cards = [];
    let flipped = [];
    let matched = new Set();
    let moves = 0;
    let locked = false;
    let round = 0;
    let mismatchTimer = 0;

    const startRound = () => {
      round += 1;
      if (mismatchTimer) window.clearTimeout(mismatchTimer);
      mismatchTimer = 0;
      cards = [...symbols, ...symbols];
      for (let i = cards.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }
      flipped = [];
      matched = new Set();
      moves = 0;
      locked = false;
      pairsLabel.textContent = "0 / 6";
      movesLabel.textContent = "0";
      live.textContent = "Choose two cards to find a matching pair.";
      board.replaceChildren(...cards.map((_, index) => {
        const card = document.createElement("button");
        card.className = "memory-card";
        card.type = "button";
        card.dataset.memoryIndex = String(index);
        card.textContent = "?";
        card.setAttribute("aria-label", `Card ${index + 1}, hidden`);
        card.setAttribute("aria-pressed", "false");
        return card;
      }));
    };

    board.addEventListener("click", (event) => {
      const card = event.target.closest("button[data-memory-index]");
      if (!card || locked || card.disabled) return;
      const index = Number(card.dataset.memoryIndex);
      if (flipped.includes(index)) return;
      card.textContent = cards[index];
      card.setAttribute("aria-label", `Card ${index + 1}: ${cards[index]}`);
      card.setAttribute("aria-pressed", "true");
      flipped.push(index);
      if (flipped.length < 2) return;

      moves += 1;
      movesLabel.textContent = String(moves);
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        [first, second].forEach((matchedIndex) => {
          matched.add(matchedIndex);
          const matchedCard = board.querySelector(`[data-memory-index="${matchedIndex}"]`);
          matchedCard.disabled = true;
          matchedCard.classList.add("is-matched");
          matchedCard.setAttribute("aria-label", `Card ${matchedIndex + 1}: ${cards[matchedIndex]}, matched`);
        });
        pairsLabel.textContent = `${matched.size / 2} / 6`;
        flipped = [];
        if (matched.size === cards.length) live.textContent = `All pairs found in ${moves} moves. Play again or try to beat your score.`;
        else live.textContent = `Match found. ${matched.size / 2} of 6 pairs found.`;
        return;
      }

      locked = true;
      live.textContent = "No match. The cards will turn back over.";
      const currentRound = round;
      mismatchTimer = window.setTimeout(() => {
        if (currentRound !== round) return;
        [first, second].forEach((mismatchIndex) => {
          const mismatchCard = board.querySelector(`[data-memory-index="${mismatchIndex}"]`);
          mismatchCard.textContent = "?";
          mismatchCard.setAttribute("aria-label", `Card ${mismatchIndex + 1}, hidden`);
          mismatchCard.setAttribute("aria-pressed", "false");
        });
        flipped = [];
        locked = false;
        mismatchTimer = 0;
        live.textContent = "Choose two cards to find a matching pair.";
      }, 750);
    });

    reset.addEventListener("click", startRound);
    startRound();
  }
}

initEntertainmentGames();
