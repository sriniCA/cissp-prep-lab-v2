(function () {
  "use strict";

  const LS_MARKED = "cissp_marked_hard_v1";

  const DOMAIN_SLUGS = [
    "security_and_risk_management",
    "asset_security",
    "security_architecture_engineering",
    "communication_network_security",
    "identity_access_management",
    "security_assessment_testing",
    "security_operations",
    "software_development_security"
  ];

  function getBank() {
    const b = window.CISSP_BANK;
    if (!Array.isArray(b) || b.length === 0) {
      alert("No questions loaded. Check data/questions.js");
      return [];
    }
    return b.filter(validQuestion);
  }

  function validQuestion(q) {
    return (
      q &&
      typeof q.id === "string" &&
      typeof q.text === "string" &&
      Array.isArray(q.choices) &&
      q.choices.length === 4 &&
      typeof q.correctIndex === "number" &&
      q.correctIndex >= 0 &&
      q.correctIndex <= 3
    );
  }

  function getMarkedHard() {
    try {
      const raw = localStorage.getItem(LS_MARKED);
      const a = raw ? JSON.parse(raw) : [];
      return Array.isArray(a) ? new Set(a) : new Set();
    } catch {
      return new Set();
    }
  }

  function saveMarkedHard(set) {
    localStorage.setItem(LS_MARKED, JSON.stringify([...set]));
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function isHardQuestion(q, marked) {
    return q.hard === true || marked.has(q.id);
  }

  function filterPool(bank, opts) {
    const marked = getMarkedHard();
    let pool = bank.slice();
    if (opts.domains && opts.domains.length) {
      const dset = new Set(opts.domains);
      pool = pool.filter((q) => dset.has(q.domain));
    }
    if (opts.hardOnly) {
      pool = pool.filter((q) => isHardQuestion(q, marked));
    }
    return pool;
  }

  /** Pick n questions, optionally balanced across DOMAIN_SLUGS */
  function pickQuestions(pool, n, balanced) {
    if (pool.length === 0) return [];
    if (!balanced || n <= 0) return shuffle(pool).slice(0, Math.min(n, pool.length));

    const byDomain = {};
    DOMAIN_SLUGS.forEach((d) => {
      byDomain[d] = shuffle(pool.filter((q) => q.domain === d));
    });

    const out = [];
    let round = 0;
    while (out.length < n && pool.length) {
      let added = false;
      const order = shuffle(DOMAIN_SLUGS.slice());
      for (const d of order) {
        if (out.length >= n) break;
        const list = byDomain[d];
        if (list.length > round) {
          out.push(list[round]);
          added = true;
        }
      }
      if (!added) break;
      round++;
    }
    if (out.length < n) {
      const ids = new Set(out.map((q) => q.id));
      const rest = shuffle(pool.filter((q) => !ids.has(q.id)));
      for (const q of rest) {
        if (out.length >= n) break;
        out.push(q);
      }
    }
    return shuffle(out).slice(0, Math.min(n, out.length));
  }

  function pickStudyOrdered(pool, n, orderMode) {
    const take = Math.min(n, pool.length);
    if (orderMode === "domain") {
      const sorted = pool.slice().sort((a, b) => {
        const ia = DOMAIN_SLUGS.indexOf(a.domain);
        const ib = DOMAIN_SLUGS.indexOf(b.domain);
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.id.localeCompare(b.id);
      });
      return sorted.slice(0, take);
    }
    return shuffle(pool).slice(0, take);
  }

  const state = {
    mode: null,
    questions: [],
    answers: [],
    revealed: new Set(),   // indices where user clicked "Show Answer"
    index: 0,
    strict: false,
    showExplanation: true,
    timerEnd: null,
    timerId: null,
    totalSeconds: 0
  };

  function $(id) {
    return document.getElementById(id);
  }

  function showView(name) {
    ["view-home", "view-mock-setup", "view-study-setup", "view-help", "view-run", "view-results", "view-concepts", "view-resources"].forEach(
      (id) => {
        const el = $(id);
        if (el) el.classList.toggle("hidden", id !== name);
      }
    );
    window.scrollTo(0, 0);
  }

  function clearTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
    state.timerEnd = null;
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function startTimer(seconds) {
    clearTimer();
    state.totalSeconds = seconds;
    const end = Date.now() + seconds * 1000;
    state.timerEnd = end;
    const wrap = $("run-timer-wrap");
    const text = $("run-timer-text");
    const bar = $("run-timer-bar");
    const fill = $("run-timer-fill");
    wrap.classList.remove("hidden");

    function tick() {
      const left = Math.max(0, Math.ceil((state.timerEnd - Date.now()) / 1000));
      text.textContent = formatTime(left);
      const pct = state.totalSeconds > 0 ? (left / state.totalSeconds) * 100 : 0;
      fill.style.width = `${pct}%`;
      bar.classList.toggle("warn", pct < 25 && pct >= 10);
      bar.classList.toggle("crit", pct < 10);
      if (left <= 0) {
        clearTimer();
        finishExam(true);
      }
    }
    tick();
    state.timerId = setInterval(tick, 500);
  }

  function renderDomainChecks() {
    const host = $("domain-checks");
    host.innerHTML = "";
    const bank = getBank();
    const labels = {};
    bank.forEach((q) => {
      if (q.domain) labels[q.domain] = q.domainLabel || q.domain;
    });
    DOMAIN_SLUGS.forEach((slug) => {
      const row = document.createElement("label");
      row.className = "check-row";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = true;
      cb.dataset.domain = slug;
      const span = document.createElement("span");
      span.textContent = labels[slug] || slug;
      row.appendChild(cb);
      row.appendChild(span);
      host.appendChild(row);
    });
  }

  function selectedDomains() {
    const host = $("domain-checks");
    if (!host) return DOMAIN_SLUGS.slice();
    const boxes = host.querySelectorAll('input[type="checkbox"][data-domain]');
    const out = [];
    boxes.forEach((b) => {
      if (b.checked) out.push(b.dataset.domain);
    });
    return out.length ? out : DOMAIN_SLUGS.slice();
  }

  function updateLiveScore() {
    const bar = $("run-live-score");
    if (!bar || !state.questions.length) return;

    let correct = 0, wrong = 0, unanswered = 0;
    state.questions.forEach((q, i) => {
      const a = state.answers[i];
      if (a === null || a === undefined) unanswered++;
      else if (a === q.correctIndex) correct++;
      else wrong++;
    });

    const answered = correct + wrong;
    const pct = answered > 0 ? Math.round((correct / answered) * 100) : null;
    const pctClass = pct === null ? "" : pct >= 70 ? "lscore-pass" : pct >= 50 ? "lscore-warn" : "lscore-fail";

    bar.classList.remove("hidden");
    bar.innerHTML =
      `<span class="lscore-item lscore-correct">✓ ${correct} correct</span>` +
      `<span class="lscore-sep">·</span>` +
      `<span class="lscore-item lscore-wrong">✗ ${wrong} wrong</span>` +
      `<span class="lscore-sep">·</span>` +
      `<span class="lscore-item lscore-skip">— ${unanswered} left</span>` +
      (pct !== null
        ? `<span class="lscore-sep">·</span><span class="lscore-pct ${pctClass}">${pct}%</span>`
        : "");
  }

  function renderQuestion() {
    const q = state.questions[state.index];
    const block = $("run-question-block");
    const progress = $("run-progress");
    const marked = getMarkedHard();
    const hardNow = isHardQuestion(q, marked);
    const isRevealed = state.revealed.has(state.index);

    progress.textContent = `Question ${state.index + 1} of ${state.questions.length}`;

    // ── Meta tags ──────────────────────────────────────────────────
    const meta = document.createElement("div");
    meta.className = "q-meta";

    const t1 = document.createElement("span");
    t1.className = "tag";
    t1.textContent = q.domainLabel || q.domain || "General";
    meta.appendChild(t1);

    if (hardNow) {
      const th = document.createElement("span");
      th.className = "tag hard";
      th.textContent = marked.has(q.id) ? "Your hard list" : "Hard";
      meta.appendChild(th);
    }

    if (isRevealed) {
      const tp = document.createElement("span");
      tp.className = "tag peeked";
      tp.textContent = "Answer revealed";
      meta.appendChild(tp);
    }

    // ── Question stem ──────────────────────────────────────────────
    const stem = document.createElement("p");
    stem.className = "q-text";
    stem.textContent = q.text;

    // ── Choices ────────────────────────────────────────────────────
    const choices = document.createElement("div");
    choices.className = "choices";

    const letters = ["A", "B", "C", "D"];
    const sel = state.answers[state.index];
    const correct = q.correctIndex;

    // Show result colours when:
    //  • study mode + explanation enabled + user answered, OR
    //  • user clicked "Show Answer" (any mode)
    const autoReveal =
      state.mode === "study" &&
      state.showExplanation &&
      sel !== null &&
      sel !== undefined;
    const showResult = autoReveal || isRevealed;

    q.choices.forEach((choiceText, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      if (sel === i) btn.classList.add("selected");
      if (showResult) {
        btn.disabled = true;
        if (i === correct) btn.classList.add("correct");
        else if (sel === i && i !== correct) btn.classList.add("wrong");
      }
      const key = document.createElement("span");
      key.className = "choice-key";
      key.textContent = letters[i];
      const body = document.createElement("span");
      body.textContent = choiceText;
      btn.appendChild(key);
      btn.appendChild(body);
      if (!showResult) {
        btn.addEventListener("click", () => {
          state.answers[state.index] = i;
          renderQuestion();
        });
      }
      choices.appendChild(btn);
    });

    // ── Explanation ────────────────────────────────────────────────
    block.innerHTML = "";
    block.appendChild(meta);
    block.appendChild(stem);
    block.appendChild(choices);

    const shouldShowExplanation =
      (state.mode === "study" && state.showExplanation && sel !== null && sel !== undefined) ||
      isRevealed;

    if (shouldShowExplanation) {
      const expWrap = document.createElement("div");
      expWrap.className = "explanation";

      const correctLabel = document.createElement("div");
      correctLabel.className = "exp-correct-label";
      correctLabel.innerHTML = `<strong>Correct answer:</strong> ${letters[correct]}. ${q.choices[correct]}`;
      expWrap.appendChild(correctLabel);

      if (q.explanation) {
        const expText = document.createElement("div");
        expText.className = "exp-text";
        expText.textContent = q.explanation;
        expWrap.appendChild(expText);
      }

      block.appendChild(expWrap);
    }

    // ── Nav buttons ────────────────────────────────────────────────
    const btnPrev = $("btn-prev");
    const btnNext = $("btn-next");
    const btnSubmit = $("btn-submit");
    const btnFinishStudy = $("btn-finish-study");
    const btnReveal = $("btn-reveal");
    const isLast = state.index >= state.questions.length - 1;

    btnPrev.classList.toggle("hidden", state.index === 0 || state.strict);
    btnNext.classList.toggle("hidden", isLast);
    btnSubmit.classList.toggle("hidden", state.mode !== "mock" || !isLast);
    btnFinishStudy.classList.toggle("hidden", state.mode !== "study" || !isLast);

    if (state.strict && state.mode === "mock") {
      btnPrev.classList.add("hidden");
    }

    if (btnReveal) {
      if (isRevealed) {
        btnReveal.textContent = "Hide Answer";
        btnReveal.classList.add("reveal-active");
      } else {
        btnReveal.textContent = "Show Answer & Explanation";
        btnReveal.classList.remove("reveal-active");
      }
    }

    const markBtn = $("btn-mark-hard");
    if (markBtn && q) {
      markBtn.textContent = marked.has(q.id) ? "Remove from my hard list" : "Mark as hard for me";
    }

    updateLiveScore();
  }

  function goDelta(d) {
    const next = state.index + d;
    if (next < 0 || next >= state.questions.length) return;
    state.index = next;
    renderQuestion();
  }

  // ── Score history (localStorage) ────────────────────────────────
  const LS_HISTORY = "cissp_score_history_v1";

  function loadHistory() {
    try {
      const raw = localStorage.getItem(LS_HISTORY);
      const a = raw ? JSON.parse(raw) : [];
      return Array.isArray(a) ? a : [];
    } catch { return []; }
  }

  function saveHistory(entry) {
    const hist = loadHistory();
    hist.unshift(entry);
    localStorage.setItem(LS_HISTORY, JSON.stringify(hist.slice(0, 20)));
  }

  // ── finishExam ───────────────────────────────────────────────────
  function finishExam(timeUp) {
    clearTimer();
    $("run-timer-wrap").classList.add("hidden");

    const letters = ["A", "B", "C", "D"];
    const PASS_PCT = 70;

    // ── Tally ─────────────────────────────────────────────────────
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    const byDomain = {};

    state.questions.forEach((q, i) => {
      const a = state.answers[i];
      const d = q.domain || "unknown";
      if (!byDomain[d]) byDomain[d] = { correct: 0, wrong: 0, skipped: 0, total: 0, label: q.domainLabel || d };
      byDomain[d].total++;

      if (a === null || a === undefined) {
        skippedCount++;
        byDomain[d].skipped++;
      } else if (a === q.correctIndex) {
        correctCount++;
        byDomain[d].correct++;
      } else {
        wrongCount++;
        byDomain[d].wrong++;
      }
    });

    const total = state.questions.length;
    const pct = total ? Math.round((correctCount / total) * 100) : 0;
    const passed = pct >= PASS_PCT;
    const revealedCount = state.revealed.size;

    // ── Elapsed time ──────────────────────────────────────────────
    let elapsedStr = "";
    if (state.mode === "mock" && state.totalSeconds > 0) {
      const usedSec = timeUp
        ? state.totalSeconds
        : state.totalSeconds - Math.max(0, Math.ceil((state.timerEnd - Date.now()) / 1000));
      const em = Math.floor(usedSec / 60);
      const es = usedSec % 60;
      elapsedStr = `${em}m ${es}s`;
    }

    // ── Save to history ───────────────────────────────────────────
    saveHistory({
      date: new Date().toLocaleString(),
      mode: state.mode,
      correct: correctCount,
      total,
      pct,
      passed: state.mode === "mock" ? passed : null,
      timeUp,
      elapsed: elapsedStr
    });

    // ── Score card ────────────────────────────────────────────────
    const card = $("results-scorecard");
    card.innerHTML = "";

    const cardTitle = document.createElement("div");
    cardTitle.className = "row spread mb";
    cardTitle.innerHTML = `<h2 style="margin:0">${state.mode === "mock" ? "Mock Exam Results" : "Study Session Results"}</h2>`;
    if (timeUp) {
      const timeTag = document.createElement("span");
      timeTag.className = "tag";
      timeTag.style.background = "#5c2a2a";
      timeTag.style.color = "#ffc9c9";
      timeTag.textContent = "Time expired";
      cardTitle.appendChild(timeTag);
    }
    card.appendChild(cardTitle);

    // Stat tiles row
    const tiles = document.createElement("div");
    tiles.className = "score-tiles";

    function makeTile(label, value, cls) {
      const t = document.createElement("div");
      t.className = "score-tile " + (cls || "");
      t.innerHTML = `<div class="score-tile-val">${value}</div><div class="score-tile-label">${label}</div>`;
      return t;
    }

    tiles.appendChild(makeTile("Correct", correctCount, "tile-correct"));
    tiles.appendChild(makeTile("Wrong", wrongCount, "tile-wrong"));
    tiles.appendChild(makeTile("Skipped", skippedCount, skippedCount > 0 ? "tile-warn" : ""));
    tiles.appendChild(makeTile("Revealed", revealedCount, revealedCount > 0 ? "tile-peeked" : ""));
    tiles.appendChild(makeTile("Total", total, ""));
    card.appendChild(tiles);

    // Main score bar
    const scoreBarWrap = document.createElement("div");
    scoreBarWrap.className = "main-score-wrap";

    const scoreCircle = document.createElement("div");
    scoreCircle.className = "score-circle " + (pct >= PASS_PCT ? "score-pass" : pct >= 50 ? "score-warn" : "score-fail");
    scoreCircle.innerHTML = `<div class="score-circle-pct">${pct}%</div><div class="score-circle-label">${correctCount}/${total}</div>`;
    scoreBarWrap.appendChild(scoreCircle);

    const scoreRight = document.createElement("div");
    scoreRight.className = "score-right";

    if (state.mode === "mock") {
      const verdict = document.createElement("div");
      verdict.className = "verdict " + (passed ? "verdict-pass" : "verdict-fail");
      verdict.innerHTML = passed
        ? `<span class="verdict-icon">✓</span> PASS (≥${PASS_PCT}%)`
        : `<span class="verdict-icon">✗</span> NOT PASSED (<${PASS_PCT}%)`;
      scoreRight.appendChild(verdict);
    }

    const meta = document.createElement("div");
    meta.className = "score-meta";
    const metaLines = [];
    if (elapsedStr) metaLines.push(`Time used: ${elapsedStr}`);
    if (revealedCount) metaLines.push(`Answers revealed: ${revealedCount}`);
    metaLines.push(`Pass threshold: ${PASS_PCT}%`);
    meta.innerHTML = metaLines.map(l => `<div>${l}</div>`).join("");
    scoreRight.appendChild(meta);

    scoreBarWrap.appendChild(scoreRight);
    card.appendChild(scoreBarWrap);

    // ── Domain performance ────────────────────────────────────────
    const domHost = $("results-by-domain");
    domHost.innerHTML = "";
    domHost.classList.remove("hidden");

    const domTitle = document.createElement("h2");
    domTitle.textContent = "Performance by Domain";
    domHost.appendChild(domTitle);

    const domGrid = document.createElement("div");
    domGrid.className = "domain-bars";

    DOMAIN_SLUGS.forEach((slug) => {
      const stat = byDomain[slug];
      if (!stat || stat.total === 0) return;
      const pc = Math.round((stat.correct / stat.total) * 100);
      const tier = pc >= PASS_PCT ? "bar-pass" : pc >= 50 ? "bar-warn" : "bar-fail";

      const row = document.createElement("div");
      row.className = "domain-bar-row";

      const nameEl = document.createElement("div");
      nameEl.className = "domain-bar-name";
      nameEl.textContent = stat.label;

      const track = document.createElement("div");
      track.className = "domain-bar-track";
      const fill = document.createElement("div");
      fill.className = "domain-bar-fill " + tier;
      fill.style.width = "0%";
      fill.dataset.targetWidth = pc + "%";
      track.appendChild(fill);

      const numEl = document.createElement("div");
      numEl.className = "domain-bar-num";
      numEl.innerHTML = `<strong>${stat.correct}/${stat.total}</strong> <span class="domain-bar-pct ${tier}-text">${pc}%</span>`;

      row.appendChild(nameEl);
      row.appendChild(track);
      row.appendChild(numEl);
      domGrid.appendChild(row);
    });

    domHost.appendChild(domGrid);

    // Animate bars after paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        domGrid.querySelectorAll(".domain-bar-fill").forEach(el => {
          el.style.width = el.dataset.targetWidth;
        });
      });
    });

    // ── Session history ───────────────────────────────────────────
    const histHost = $("results-history");
    histHost.innerHTML = "";
    const history = loadHistory();
    if (history.length > 1) {
      histHost.classList.remove("hidden");
      const histTitle = document.createElement("h2");
      histTitle.textContent = "Recent Sessions";
      histHost.appendChild(histTitle);

      const histGrid = document.createElement("div");
      histGrid.className = "hist-grid";

      history.slice(0, 10).forEach((entry, idx) => {
        const item = document.createElement("div");
        item.className = "hist-item";
        const verdictClass =
          entry.passed === true ? "hist-pass" :
          entry.passed === false ? "hist-fail" : "hist-study";
        const verdictText =
          entry.passed === true ? "PASS" :
          entry.passed === false ? "FAIL" :
          entry.mode === "study" ? "Study" : "—";

        item.innerHTML =
          `<div class="hist-badge ${verdictClass}">${verdictText}</div>` +
          `<div class="hist-score">${entry.correct}/${entry.total} <span class="hist-pct">${entry.pct}%</span></div>` +
          `<div class="hist-date">${entry.date}</div>` +
          (entry.elapsed ? `<div class="hist-time">${entry.elapsed}</div>` : "");
        histGrid.appendChild(item);
      });

      histHost.appendChild(histGrid);
    } else {
      histHost.classList.add("hidden");
    }

    // ── Review section ────────────────────────────────────────────
    const rev = $("results-review");
    rev.innerHTML = "";

    const revHint = document.createElement("p");
    revHint.style.cssText = "font-size:0.8rem;color:var(--muted);margin:0 0 0.75rem";
    revHint.textContent = "Click any row to expand the full question, choices, and explanation.";
    rev.appendChild(revHint);

    const reviewItems = [];

    state.questions.forEach((q, i) => {
      const a = state.answers[i];
      const ok = a === q.correctIndex;
      const skipped = a === null || a === undefined;
      const peeked = state.revealed.has(i);

      const div = document.createElement("div");
      div.className = "review-item " + (skipped ? "skipped" : ok ? "ok" : "bad");
      div.dataset.filter = skipped ? "skipped" : ok ? "correct" : "wrong";
      div.style.cursor = "pointer";

      const your = skipped ? "(skipped)" : letters[a];
      const right = letters[q.correctIndex];
      const icon = skipped ? "—" : ok ? "✓" : "✗";

      const summary = document.createElement("div");
      summary.className = "review-summary";
      summary.innerHTML =
        `<span class="rev-num">${i + 1}.</span> ` +
        `<span class="rev-icon">${icon}</span> ` +
        `<span class="rev-label">Your: <strong>${your}</strong> | Correct: <strong>${right}</strong></span>` +
        (peeked ? ` <span class="tag peeked" style="vertical-align:middle;font-size:0.7rem">Revealed</span>` : "") +
        `<span class="rev-expand-hint"> ▸</span>`;

      const stemSnip = document.createElement("span");
      stemSnip.className = "rev-stem";
      stemSnip.textContent = " " + q.text.slice(0, 90) + (q.text.length > 90 ? "…" : "");
      summary.appendChild(stemSnip);
      div.appendChild(summary);

      // Collapsible detail
      const detail = document.createElement("div");
      detail.className = "review-detail hidden";

      const fullQ = document.createElement("p");
      fullQ.style.cssText = "margin:0.5rem 0 0.6rem;font-weight:600;font-size:0.95rem";
      fullQ.textContent = q.text;
      detail.appendChild(fullQ);

      q.choices.forEach((choiceText, ci) => {
        const cRow = document.createElement("div");
        cRow.className = "review-choice";
        if (ci === q.correctIndex) cRow.classList.add("correct");
        else if (ci === a && !ok) cRow.classList.add("wrong");
        cRow.innerHTML = `<strong>${letters[ci]}.</strong> ${choiceText}`;
        detail.appendChild(cRow);
      });

      if (q.explanation) {
        const expBox = document.createElement("div");
        expBox.className = "explanation";
        expBox.style.marginTop = "0.6rem";
        expBox.innerHTML = `<strong>Explanation:</strong> ${q.explanation}`;
        detail.appendChild(expBox);
      }

      div.appendChild(detail);
      div.addEventListener("click", () => {
        const isOpen = !detail.classList.contains("hidden");
        detail.classList.toggle("hidden", isOpen);
        summary.querySelector(".rev-expand-hint").textContent = isOpen ? " ▸" : " ▾";
      });

      rev.appendChild(div);
      reviewItems.push(div);
    });

    // Wire filter buttons
    document.querySelectorAll(".rev-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".rev-filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const f = btn.dataset.filter;
        reviewItems.forEach(item => {
          const show = f === "all" || item.dataset.filter === f;
          item.classList.toggle("hidden", !show);
        });
      });
    });

    // Reset filters to "All" on each new results render
    document.querySelectorAll(".rev-filter-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.filter === "all");
    });

    showView("view-results");
  }

  function bind() {
    $("btn-mock").addEventListener("click", () => {
      showView("view-mock-setup");
    });
    $("btn-study").addEventListener("click", () => {
      renderDomainChecks();
      showView("view-study-setup");
    });
    $("btn-help").addEventListener("click", () => showView("view-help"));
    $("help-close").addEventListener("click", () => showView("view-home"));

    $("btn-concepts").addEventListener("click", () => {
      showView("view-concepts");
      showConceptsDomainList();
    });
    $("concepts-back").addEventListener("click", () => showView("view-home"));

    $("btn-materials").addEventListener("click", () => {
      showView("view-resources");
      renderResourcesView();
    });
    $("resources-back").addEventListener("click", () => showView("view-home"));

    $("res-path-save").addEventListener("click", () => {
      const val = $("res-base-path").value.trim();
      if (val) {
        localStorage.setItem(LS_RES_BASE, val);
        renderResourcesView();
        const btn = $("res-path-save");
        const orig = btn.textContent;
        btn.textContent = "Saved ✓";
        setTimeout(() => { btn.textContent = orig; }, 1200);
      }
    });

    $("mock-cancel").addEventListener("click", () => showView("view-home"));
    $("study-cancel").addEventListener("click", () => showView("view-home"));

    $("domain-select-all").addEventListener("click", () => {
      document.querySelectorAll('#domain-checks input[type="checkbox"]')
        .forEach((cb) => { cb.checked = true; });
    });

    $("domain-deselect-all").addEventListener("click", () => {
      document.querySelectorAll('#domain-checks input[type="checkbox"]')
        .forEach((cb) => { cb.checked = false; });
    });

    $("mock-start").addEventListener("click", () => {
      const bank = getBank();
      const n = parseInt($("mock-count").value, 10) || 125;
      const minutes = parseInt($("mock-minutes").value, 10) || 240;
      const balanced = $("mock-balanced").checked;
      const strict = $("mock-strict").checked;
      const hardOnly = $("mock-hardonly").checked;

      const pool = filterPool(bank, { hardOnly });
      if (pool.length < Math.min(5, n)) {
        alert("Not enough questions in the filtered pool. Add items to questions.js or widen filters.");
        return;
      }
      const picked = pickQuestions(pool, n, balanced);
      state.mode = "mock";
      state.questions = picked;
      state.answers = picked.map(() => null);
      state.revealed = new Set();
      state.index = 0;
      state.strict = strict;
      state.showExplanation = false;
      $("run-title").textContent = "Mock exam";
      showView("view-run");
      startTimer(minutes * 60);
      $("btn-mark-hard").classList.remove("hidden");
      renderQuestion();
    });

    $("study-start").addEventListener("click", () => {
      const bank = getBank();
      const domains = selectedDomains();
      const n = parseInt($("study-count").value, 10) || 20;
      const order = $("study-order").value;
      const hardOnly = $("study-hard-bank").checked;
      const showExp = $("study-show-exp").checked;

      const pool = filterPool(bank, { domains, hardOnly });
      if (pool.length === 0) {
        alert("No questions match filters.");
        return;
      }
      const picked = pickStudyOrdered(pool, n, order);
      state.mode = "study";
      state.questions = picked;
      state.answers = picked.map(() => null);
      state.revealed = new Set();
      state.index = 0;
      state.strict = false;
      state.showExplanation = showExp;
      $("run-title").textContent = "Study mode";
      clearTimer();
      $("run-timer-wrap").classList.add("hidden");
      $("btn-submit").classList.add("hidden");
      $("btn-mark-hard").classList.remove("hidden");
      showView("view-run");
      renderQuestion();
    });

    $("btn-prev").addEventListener("click", () => goDelta(-1));
    $("btn-next").addEventListener("click", () => goDelta(1));

    $("btn-reveal").addEventListener("click", () => {
      if (state.revealed.has(state.index)) {
        state.revealed.delete(state.index);
      } else {
        state.revealed.add(state.index);
      }
      renderQuestion();
    });

    $("btn-finish-study").addEventListener("click", () => {
      finishExam(false);
    });

    $("btn-submit").addEventListener("click", () => {
      const unanswered = state.answers.some((a) => a === null || a === undefined);
      if (unanswered && !confirm("Some questions are unanswered. Submit anyway?")) return;
      finishExam(false);
    });

    $("btn-abort").addEventListener("click", () => {
      if (confirm("Leave this session?")) {
        clearTimer();
        showView("view-home");
      }
    });

    $("btn-mark-hard").addEventListener("click", () => {
      const q = state.questions[state.index];
      if (!q) return;
      const set = getMarkedHard();
      if (set.has(q.id)) {
        set.delete(q.id);
        saveMarkedHard(set);
      } else {
        set.add(q.id);
        saveMarkedHard(set);
      }
      renderQuestion();
    });

    $("results-home").addEventListener("click", () => showView("view-home"));
  }

  // ── Study Materials / PDF Resources ─────────────────────────────
  const LS_RES_BASE  = "cissp_res_base_v1";
  const LS_RES_DRIVE = "cissp_res_drive_v1";

  // When running online (GitHub Pages etc.) local file:// links won't work.
  // Users can update this path in the Materials view and it's saved to localStorage.
  const DEFAULT_BASE = window.location.protocol === "file:"
    ? "file:///Users/sm664732/Downloads/CISSP/"
    : "file:///Users/YourName/Downloads/CISSP/";

  const RESOURCES = [
    {
      id: "aio8", cat: "Reference Book",
      title: "CISSP All-in-One Exam Guide, 8th Edition",
      author: "Shon Harris & Fernando Maymí",
      desc: "Comprehensive exam guide covering all 8 CBK domains in depth.",
      file: "CISSP All-in-One Exam Guide, 8th Edition - Shon Harris.pdf"
    },
    {
      id: "official10", cat: "Reference Book",
      title: "CISSP Official Study Guide, 10th Edition",
      author: "Mike Chapple, James Stewart, Darril Gibson",
      desc: "Official (ISC)² endorsed study guide — the definitive reference.",
      file: "CISSP\u00ae Official 10th Edition .pdf"
    },
    {
      id: "pe5", cat: "Practice Exams",
      title: "CISSP Practice Exams, 5th Edition",
      author: "Shon Harris & Jonathan Ham",
      desc: "1,300+ practice questions with detailed answer explanations.",
      file: "CISSP Practice Exams, Fifth Edition.pdf"
    },
    {
      id: "opt3", cat: "Practice Exams",
      title: "CISSP Official Practice Tests, 3rd Edition",
      author: "Mike Chapple & David Seidl",
      desc: "Official (ISC)² practice tests — domain chapters + 2 full exams.",
      file: "Cissp official practice test 3e.pdf"
    },
    {
      id: "d1", cat: "Domain D1",
      title: "Security and Risk Management",
      author: "Domain 1 Guide",
      desc: "Risk management, governance, compliance, BCP/DRP, ethics.",
      file: "CISSP_D1.pdf"
    },
    {
      id: "d2", cat: "Domain D2",
      title: "Asset Security",
      author: "Domain 2 Guide",
      desc: "Data classification, ownership, lifecycle, privacy, destruction.",
      file: "CISSP_D2.pdf"
    },
    {
      id: "d3", cat: "Domain D3",
      title: "Security Architecture and Engineering",
      author: "Domain 3 Guide",
      desc: "Security models, cryptography, PKI, physical security, cloud.",
      file: "CISSP_D3.pdf"
    },
    {
      id: "d4", cat: "Domain D4",
      title: "Communication and Network Security",
      author: "Domain 4 Guide",
      desc: "OSI model, protocols, wireless, VPN, network attacks.",
      file: "CISSP_D4.pdf"
    },
    {
      id: "d5", cat: "Domain D5",
      title: "Identity and Access Management",
      author: "Domain 5 Guide",
      desc: "Authentication, biometrics, access control models, federation.",
      file: "CISSP_D5.pdf"
    },
    {
      id: "d6", cat: "Domain D6",
      title: "Security Assessment and Testing",
      author: "Domain 6 Guide",
      desc: "Pen testing, vulnerability assessment, audit standards, metrics.",
      file: "CISSP_D6.pdf"
    },
    {
      id: "d7", cat: "Domain D7",
      title: "Security Operations",
      author: "Domain 7 Guide",
      desc: "Incident response, forensics, backup/DR, monitoring, SOC.",
      file: "CISSP_D7.pdf"
    },
    {
      id: "d8", cat: "Domain D8",
      title: "Software Development Security",
      author: "Domain 8 Guide",
      desc: "SDLC, secure coding, OWASP vulnerabilities, CMM, DevSecOps.",
      file: "CISSP_D8.pdf"
    }
  ];

  function getResBasePath() {
    return (localStorage.getItem(LS_RES_BASE) || DEFAULT_BASE).replace(/\/?$/, "/");
  }

  function getDriveLinks() {
    try {
      const raw = localStorage.getItem(LS_RES_DRIVE);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  function saveDriveLink(id, url) {
    const links = getDriveLinks();
    if (url.trim()) {
      links[id] = url.trim();
    } else {
      delete links[id];
    }
    localStorage.setItem(LS_RES_DRIVE, JSON.stringify(links));
  }

  function renderResourcesView() {
    // Populate base path input
    const pathInput = $("res-base-path");
    if (pathInput) pathInput.value = localStorage.getItem(LS_RES_BASE) || DEFAULT_BASE;

    const list = $("resources-list");
    if (!list) return;
    list.innerHTML = "";

    const basePath  = getResBasePath();
    const driveLinks = getDriveLinks();

    // Category order for grouping
    const catOrder = ["Reference Book", "Practice Exams",
                      "Domain D1","Domain D2","Domain D3","Domain D4",
                      "Domain D5","Domain D6","Domain D7","Domain D8"];
    const catMap = {};
    RESOURCES.forEach((r) => {
      if (!catMap[r.cat]) catMap[r.cat] = [];
      catMap[r.cat].push(r);
    });

    catOrder.forEach((cat) => {
      const items = catMap[cat];
      if (!items) return;

      const group = document.createElement("div");
      group.className = "res-group";

      const groupLabel = document.createElement("div");
      groupLabel.className = "res-group-label";
      groupLabel.textContent = cat;
      group.appendChild(groupLabel);

      items.forEach((res) => {
        const card = document.createElement("div");
        card.className = "res-card";

        const localUrl = basePath + encodeURIComponent(res.file);
        const driveUrl = driveLinks[res.id] || "";

        card.innerHTML =
          `<div class="res-card-top">` +
            `<div class="res-info">` +
              `<div class="res-title">${res.title}</div>` +
              `<div class="res-author">${res.author}</div>` +
              `<div class="res-desc">${res.desc}</div>` +
            `</div>` +
            `<div class="res-actions">` +
              `<a class="res-btn res-btn-local" href="${localUrl}" target="_blank" rel="noopener" title="Open local PDF">` +
                `<span class="res-btn-icon">📂</span> Open Local` +
              `</a>` +
              `<button type="button" class="res-btn res-btn-drive ${driveUrl ? "" : "res-btn-dim"}" ` +
                `data-id="${res.id}" data-drive="${driveUrl}" title="Open Google Drive link">` +
                `<span class="res-btn-icon">🔗</span> Open Drive` +
              `</button>` +
            `</div>` +
          `</div>` +
          `<div class="res-drive-row">` +
            `<input type="url" class="res-drive-input" data-id="${res.id}" ` +
              `value="${driveUrl}" placeholder="Paste Google Drive or any URL here…" spellcheck="false" />` +
            `<button type="button" class="res-drive-save secondary" data-id="${res.id}">Save</button>` +
          `</div>`;

        // Wire Drive open button
        card.querySelector(".res-btn-drive").addEventListener("click", function () {
          const url = this.dataset.drive;
          if (url) {
            window.open(url, "_blank", "noopener");
          } else {
            const input = card.querySelector(".res-drive-input");
            input.focus();
            input.classList.add("res-input-flash");
            setTimeout(() => input.classList.remove("res-input-flash"), 600);
          }
        });

        // Wire Drive save button
        card.querySelector(".res-drive-save").addEventListener("click", function () {
          const id  = this.dataset.id;
          const inp = card.querySelector(".res-drive-input");
          const url = inp.value.trim();
          saveDriveLink(id, url);
          const driveBtn = card.querySelector(".res-btn-drive");
          driveBtn.dataset.drive = url;
          driveBtn.classList.toggle("res-btn-dim", !url);
          driveBtn.title = url ? "Open Google Drive link" : "No Drive link saved — paste one below";
          // Brief confirmation
          const orig = this.textContent;
          this.textContent = "Saved ✓";
          setTimeout(() => { this.textContent = orig; }, 1200);
        });

        group.appendChild(card);
      });

      list.appendChild(group);
    });
  }

  // ── Key Concepts viewer ──────────────────────────────────────────
  function getConcepts() {
    return Array.isArray(window.CISSP_CONCEPTS) ? window.CISSP_CONCEPTS : [];
  }

  function showConceptsDomainList() {
    const content = $("concepts-content");
    const crumb   = $("concepts-breadcrumb");
    if (!content) return;

    crumb.textContent = "All Domains";

    const concepts = getConcepts();
    content.innerHTML = "";

    const intro = document.createElement("p");
    intro.className = "concepts-intro";
    intro.textContent = "Select a domain to read its key concepts and exam-critical facts.";
    content.appendChild(intro);

    const grid = document.createElement("div");
    grid.className = "domain-quick-grid";

    concepts.forEach(({ domain, num, label, topics }) => {
      const topicCount = topics ? topics.length : 0;
      const pointCount = topics ? topics.reduce((s, t) => s + t.points.length, 0) : 0;

      const card = document.createElement("button");
      card.type = "button";
      card.className = "domain-card";
      card.innerHTML =
        `<span class="dcard-num">${num}</span>` +
        `<span class="dcard-label">${label}</span>` +
        `<span class="dcard-meta">` +
          `<span class="dcard-count">${topicCount} topics · ${pointCount} facts</span>` +
        `</span>`;

      card.addEventListener("click", () => showConceptsDomain(domain));
      grid.appendChild(card);
    });

    content.appendChild(grid);
  }

  function showConceptsDomain(slug) {
    const concepts = getConcepts();
    const entry = concepts.find((c) => c.domain === slug);
    if (!entry) return;

    const content  = $("concepts-content");
    const crumb    = $("concepts-breadcrumb");
    crumb.innerHTML =
      `<span class="crumb-link" id="crumb-domains">All Domains</span>` +
      ` › <span>${entry.num} – ${entry.label}</span>`;

    document.getElementById("crumb-domains").addEventListener("click", showConceptsDomainList);

    content.innerHTML = "";

    const heading = document.createElement("div");
    heading.className = "concepts-domain-heading";
    heading.innerHTML =
      `<span class="dcard-num">${entry.num}</span>` +
      `<h2 class="concepts-domain-title">${entry.label}</h2>`;
    content.appendChild(heading);

    entry.topics.forEach((topic, ti) => {
      const section = document.createElement("div");
      section.className = "concept-section";

      const header = document.createElement("button");
      header.type = "button";
      header.className = "concept-header";
      header.setAttribute("aria-expanded", ti === 0 ? "true" : "false");
      header.innerHTML =
        `<span class="concept-title">${topic.title}</span>` +
        `<span class="concept-chevron">${ti === 0 ? "▾" : "▸"}</span>`;

      const body = document.createElement("div");
      body.className = "concept-body";
      if (ti !== 0) body.classList.add("hidden");

      const ul = document.createElement("ul");
      ul.className = "concept-list";
      topic.points.forEach((pt) => {
        const li = document.createElement("li");
        li.className = "concept-point";
        // Bold text before a dash separator for key terms
        li.innerHTML = pt.replace(/^([^—–\-]+?)\s*[—–]\s*/, "<strong>$1</strong> — ");
        ul.appendChild(li);
      });
      body.appendChild(ul);

      header.addEventListener("click", () => {
        const open = header.getAttribute("aria-expanded") === "true";
        header.setAttribute("aria-expanded", String(!open));
        header.querySelector(".concept-chevron").textContent = open ? "▸" : "▾";
        body.classList.toggle("hidden", open);
      });

      section.appendChild(header);
      section.appendChild(body);
      content.appendChild(section);
    });

    // Quick-test button for this domain
    const qBtn = document.createElement("button");
    qBtn.type = "button";
    qBtn.className = "concepts-test-btn";
    qBtn.textContent = `Practice ${entry.num} questions →`;
    qBtn.addEventListener("click", () => startDomainSession(entry.domain, entry.label));
    content.appendChild(qBtn);
  }

  // ── Domain quick-test cards ──────────────────────────────────────
  const DOMAIN_META = [
    { slug: "security_and_risk_management",     num: "D1", label: "Security and Risk Management" },
    { slug: "asset_security",                   num: "D2", label: "Asset Security" },
    { slug: "security_architecture_engineering",num: "D3", label: "Security Architecture & Engineering" },
    { slug: "communication_network_security",   num: "D4", label: "Communication & Network Security" },
    { slug: "identity_access_management",       num: "D5", label: "Identity and Access Management" },
    { slug: "security_assessment_testing",      num: "D6", label: "Security Assessment and Testing" },
    { slug: "security_operations",              num: "D7", label: "Security Operations" },
    { slug: "software_development_security",    num: "D8", label: "Software Development Security" }
  ];

  function renderDomainCards() {
    const grid = $("domain-quick-grid");
    if (!grid) return;
    const bank = getBank();
    grid.innerHTML = "";

    DOMAIN_META.forEach(({ slug, num, label }) => {
      const count = bank.filter((q) => q.domain === slug).length;
      const hardCount = bank.filter((q) => q.domain === slug && (q.hard === true)).length;

      const card = document.createElement("button");
      card.type = "button";
      card.className = "domain-card";
      card.innerHTML =
        `<span class="dcard-num">${num}</span>` +
        `<span class="dcard-label">${label}</span>` +
        `<span class="dcard-meta">` +
          `<span class="dcard-count">${count} questions</span>` +
          (hardCount ? `<span class="dcard-hard">${hardCount} hard</span>` : "") +
        `</span>`;

      card.addEventListener("click", () => startDomainSession(slug, label));
      grid.appendChild(card);
    });
  }

  function startDomainSession(slug, label) {
    const bank = getBank();
    const pool = bank.filter((q) => q.domain === slug);
    if (pool.length === 0) {
      alert("No questions found for this domain.");
      return;
    }
    const picked = shuffle(pool);
    state.mode = "study";
    state.questions = picked;
    state.answers = picked.map(() => null);
    state.revealed = new Set();
    state.index = 0;
    state.strict = false;
    state.showExplanation = true;
    $("run-title").textContent = label;
    clearTimer();
    $("run-timer-wrap").classList.add("hidden");
    $("btn-submit").classList.add("hidden");
    $("btn-mark-hard").classList.remove("hidden");
    showView("view-run");
    renderQuestion();
  }

  bind();
  renderDomainCards();
})();
