(function () {
  "use strict";

  // ── Auth gate (token + optional Firebase / Google) ───────────────
  const ACCESS_TOKEN = "55555";
  const SESSION_KEY  = "cissp_auth_v1";
  const ADMIN_EMAIL  = ((window.CISSP_ADMIN_EMAIL) || "").toLowerCase();

  // Firebase handles (null when Firebase not configured)
  let _db = null, _auth = null, _gProvider = null, _fbUser = null;

  function isAuthenticated() {
    return sessionStorage.getItem(SESSION_KEY) === "ok";
  }

  function showApp() {
    document.getElementById("login-gate").classList.add("hidden");
    document.getElementById("view-admin").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
  }

  function fbReady() { return _db !== null; }

  function initFirebase() {
    const cfg = window.FIREBASE_CONFIG;
    if (!cfg || !cfg.apiKey || cfg.apiKey.startsWith("YOUR_")) return false;
    if (typeof firebase === "undefined") return false;
    try {
      if (!firebase.apps.length) firebase.initializeApp(cfg);
      _auth      = firebase.auth();
      _db        = firebase.firestore();
      _gProvider = new firebase.auth.GoogleAuthProvider();
      return true;
    } catch (e) { console.warn("Firebase init:", e); return false; }
  }

  function generateToken() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let t = "";
    for (let i = 0; i < 8; i++) t += chars[Math.floor(Math.random() * chars.length)];
    return t;
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g,"&amp;").replace(/</g,"&lt;")
      .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  function fmtDate(iso) {
    try { return new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" }); }
    catch { return iso || "—"; }
  }

  // ── Login gate render functions ───────────────────────────────────

  function renderLoginMain() {
    const lc = document.getElementById("lc");
    lc.innerHTML =
      `<div class="login-logo">🔐</div>` +
      `<h1 class="login-title">CISSP Prep Lab</h1>` +
      `<p class="login-sub">Enter your access token</p>` +
      `<input type="password" id="login-token" class="login-input" placeholder="Access token" maxlength="32" autocomplete="off" />` +
      `<p id="login-error" class="login-error hidden">Incorrect token — please try again.</p>` +
      `<button type="button" id="login-submit" class="login-btn">Unlock →</button>` +
      (fbReady()
        ? `<div class="login-divider"><span>or</span></div>` +
          `<button type="button" id="login-google" class="login-google-btn">` +
            `<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="login-google-icon" alt="" />` +
            `Continue with Google` +
          `</button>` +
          `<p class="login-hint">Register or check your access status</p>`
        : "");

    const inp = lc.querySelector("#login-token");
    const err = lc.querySelector("#login-error");

    function attempt() {
      if (inp.value.trim() === ACCESS_TOKEN) {
        sessionStorage.setItem(SESSION_KEY, "ok");
        window.location.reload();
      } else {
        inp.value = "";
        err.classList.remove("hidden");
        inp.classList.add("login-shake");
        setTimeout(() => inp.classList.remove("login-shake"), 500);
        inp.focus();
      }
    }

    lc.querySelector("#login-submit").addEventListener("click", attempt);
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") attempt(); });
    inp.focus();

    if (fbReady()) {
      lc.querySelector("#login-google").addEventListener("click", handleGoogleSignIn);
    }
  }

  async function handleGoogleSignIn() {
    const lc = document.getElementById("lc");
    lc.innerHTML = `<div class="login-spinner"><div class="login-spin-ring"></div><p>Signing in…</p></div>`;
    try {
      const result = await _auth.signInWithPopup(_gProvider);
      _fbUser = result.user;
      const email = _fbUser.email.toLowerCase();

      if (email === ADMIN_EMAIL) {
        await openAdminPanel();
        return;
      }

      const snap = await _db.collection("users").doc(email).get();
      if (!snap.exists) {
        renderNewUser(lc);
      } else {
        const d = snap.data();
        if (d.status === "approved") renderApproved(lc, d);
        else if (d.status === "pending") renderPending(lc);
        else renderRevoked(lc);
      }
    } catch (e) {
      const lc2 = document.getElementById("lc");
      lc2.innerHTML =
        `<div class="login-status-icon">⚠️</div>` +
        `<p class="login-error" style="display:block;margin-bottom:1rem">Sign-in error: ${esc(e.message)}</p>` +
        `<button type="button" class="login-btn" id="lr">Try Again</button>`;
      lc2.querySelector("#lr").addEventListener("click", renderLoginMain);
    }
  }

  function renderNewUser(lc) {
    const name  = esc(_fbUser.displayName || _fbUser.email);
    const email = esc(_fbUser.email);
    lc.innerHTML =
      `<div class="login-status-icon">${_fbUser.photoURL ? `<img src="${esc(_fbUser.photoURL)}" class="login-avatar" />` : "👤"}</div>` +
      `<p class="login-user-name">${name}</p>` +
      `<p class="login-hint" style="margin-bottom:0.9rem">${email}</p>` +
      `<p style="font-size:0.85rem;color:var(--muted);margin:0 0 1rem">No access found. Submit a request — the admin will review it and generate your token.</p>` +
      `<button type="button" id="req-btn" class="login-btn">Request Access</button>` +
      `<button type="button" id="back-btn" class="login-btn-ghost">← Back</button>`;
    lc.querySelector("#req-btn").addEventListener("click", () => submitAccessRequest(lc));
    lc.querySelector("#back-btn").addEventListener("click", renderLoginMain);
  }

  async function submitAccessRequest(lc) {
    lc.innerHTML = `<div class="login-spinner"><div class="login-spin-ring"></div><p>Submitting…</p></div>`;
    try {
      await _db.collection("users").doc(_fbUser.email.toLowerCase()).set({
        email: _fbUser.email.toLowerCase(),
        displayName: _fbUser.displayName || "",
        photoURL: _fbUser.photoURL || "",
        status: "pending",
        token: "",
        requestedAt: new Date().toISOString()
      });
      lc.innerHTML =
        `<div class="login-status-icon">⏳</div>` +
        `<h2 class="login-title" style="font-size:1.1rem">Request Submitted!</h2>` +
        `<p style="font-size:0.85rem;color:var(--muted);margin:0.5rem 0 1.1rem">The admin will review your request. Come back and sign in with Google again to check your status and receive your token.</p>` +
        `<button type="button" id="back-btn" class="login-btn-ghost">← Back to Login</button>`;
      lc.querySelector("#back-btn").addEventListener("click", renderLoginMain);
    } catch (e) {
      lc.innerHTML =
        `<p class="login-error" style="display:block;margin-bottom:1rem">Error: ${esc(e.message)}</p>` +
        `<button type="button" class="login-btn" id="retry-btn">Retry</button>`;
      lc.querySelector("#retry-btn").addEventListener("click", () => submitAccessRequest(lc));
    }
  }

  function renderPending(lc) {
    lc.innerHTML =
      `<div class="login-status-icon">⏳</div>` +
      `<h2 class="login-title" style="font-size:1.1rem">Pending Approval</h2>` +
      `<p style="font-size:0.85rem;color:var(--muted);margin:0.5rem 0 1.1rem">Your request is under review. Sign in again later to check if it has been approved.</p>` +
      `<button type="button" id="back-btn" class="login-btn-ghost">← Back</button>`;
    lc.querySelector("#back-btn").addEventListener("click", renderLoginMain);
  }

  function renderApproved(lc, data) {
    lc.innerHTML =
      `<div class="login-status-icon">✅</div>` +
      `<h2 class="login-title" style="font-size:1.1rem">Access Approved!</h2>` +
      `<p style="font-size:0.85rem;color:var(--muted);margin:0.5rem 0 0.5rem">Your personal access token — save this to use on any device:</p>` +
      `<div class="login-token-display">${esc(data.token)}</div>` +
      `<p style="font-size:0.75rem;color:var(--muted);margin:0.4rem 0 1rem">Paste this in the "Access token" field on the login screen.</p>` +
      `<button type="button" id="enter-btn" class="login-btn">Enter App Now →</button>`;
    lc.querySelector("#enter-btn").addEventListener("click", () => {
      sessionStorage.setItem(SESSION_KEY, "ok");
      window.location.reload();
    });
  }

  function renderRevoked(lc) {
    lc.innerHTML =
      `<div class="login-status-icon">🚫</div>` +
      `<h2 class="login-title" style="font-size:1.1rem">Access Revoked</h2>` +
      `<p style="font-size:0.85rem;color:var(--muted);margin:0.5rem 0 1.1rem">Your access has been revoked. Contact the admin to request reinstatement.</p>` +
      `<button type="button" id="back-btn" class="login-btn-ghost">← Back</button>`;
    lc.querySelector("#back-btn").addEventListener("click", renderLoginMain);
  }

  // ── Admin Panel ───────────────────────────────────────────────────

  async function openAdminPanel() {
    document.getElementById("login-gate").classList.add("hidden");
    const panel = document.getElementById("view-admin");
    panel.classList.remove("hidden");

    // Wire top-bar buttons
    document.getElementById("admin-refresh").addEventListener("click", () => {
      const active = document.querySelector(".admin-tab.active");
      if (active) loadAdminTab(active.dataset.tab);
    });
    document.getElementById("admin-open-app").addEventListener("click", () => {
      sessionStorage.setItem(SESSION_KEY, "ok");
      window.location.reload();
    });
    document.getElementById("admin-signout").addEventListener("click", async () => {
      await _auth.signOut();
      window.location.reload();
    });

    // Wire tab buttons
    document.querySelectorAll(".admin-tab").forEach(btn => {
      btn.addEventListener("click", () => loadAdminTab(btn.dataset.tab));
    });

    await loadAdminTab("pending");
  }

  async function loadAdminTab(tab) {
    document.querySelectorAll(".admin-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
    const content = document.getElementById("admin-content");
    content.innerHTML = `<div class="admin-loading">Loading…</div>`;
    try {
      let q = _db.collection("users");
      if (tab !== "all") q = q.where("status", "==", tab);
      const snap = await q.get();
      const users = [];
      snap.forEach(d => users.push(Object.assign({ _id: d.id }, d.data())));
      users.sort((a, b) => (b.requestedAt || "").localeCompare(a.requestedAt || ""));

      if (!users.length) {
        content.innerHTML = `<p class="admin-empty">No ${tab} users yet.</p>`;
        return;
      }

      content.innerHTML = "";
      users.forEach(u => {
        const row = document.createElement("div");
        row.className = "admin-user-row";
        const isPending  = u.status === "pending";
        const isApproved = u.status === "approved";
        const isRevoked  = u.status === "revoked";

        row.innerHTML =
          `<div class="admin-user-info">` +
            (u.photoURL
              ? `<img src="${esc(u.photoURL)}" class="admin-avatar" />`
              : `<div class="admin-avatar-ph">👤</div>`) +
            `<div>` +
              `<div class="admin-user-name">${esc(u.displayName || u.email)}</div>` +
              `<div class="admin-user-email">${esc(u.email)}</div>` +
              `<div class="admin-user-meta">` +
                (isPending  ? `Requested: ${fmtDate(u.requestedAt)}` : "") +
                (isApproved ? `Approved: ${fmtDate(u.approvedAt)} &nbsp;·&nbsp; Token: <code class="admin-token">${esc(u.token)}</code>` : "") +
                (isRevoked  ? `Revoked` : "") +
              `</div>` +
            `</div>` +
          `</div>` +
          `<div class="admin-user-actions">` +
            (isPending || isRevoked ? `<button class="admin-btn admin-approve" data-email="${esc(u.email)}">✓ Approve</button>` : "") +
            (isApproved ? `<button class="admin-btn admin-revoke" data-email="${esc(u.email)}">✗ Revoke</button>` : "") +
            `<button class="admin-btn admin-delete" data-email="${esc(u.email)}" title="Delete record">🗑</button>` +
          `</div>`;

        const approveBtn = row.querySelector(".admin-approve");
        if (approveBtn) {
          approveBtn.addEventListener("click", async () => {
            approveBtn.disabled = true; approveBtn.textContent = "…";
            const token = generateToken();
            await _db.collection("users").doc(u.email).update({
              status: "approved", token, approvedAt: new Date().toISOString()
            });
            loadAdminTab(tab);
          });
        }

        const revokeBtn = row.querySelector(".admin-revoke");
        if (revokeBtn) {
          revokeBtn.addEventListener("click", async () => {
            if (!confirm(`Revoke access for ${u.email}?`)) return;
            revokeBtn.disabled = true; revokeBtn.textContent = "…";
            await _db.collection("users").doc(u.email).update({ status: "revoked" });
            loadAdminTab(tab);
          });
        }

        row.querySelector(".admin-delete").addEventListener("click", async () => {
          if (!confirm(`Permanently delete ${u.email}?`)) return;
          await _db.collection("users").doc(u.email).delete();
          loadAdminTab(tab);
        });

        content.appendChild(row);
      });
    } catch (e) {
      content.innerHTML = `<p class="login-error" style="display:block">Error: ${esc(e.message)}</p>`;
    }
  }

  // ── Boot ──────────────────────────────────────────────────────────
  initFirebase();

  if (isAuthenticated()) {
    showApp();
  } else {
    renderLoginMain();
    return; // don't boot the app until authenticated
  }
  // ── Auth passed — boot the full app ─────────────────────────────

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
    revealed: new Set(),
    index: 0,
    strict: false,
    showExplanation: true,
    timerEnd: null,
    timerId: null,
    totalSeconds: 0,
    timerTick: null,
    timerPauseStart: null,
    timerPausedMs: 0,
    lastByDomain: {},
    // ── CAT (adaptive mode) ───────────────────────────────────────
    adaptive: false,
    adaptivePool: [],
    adaptiveTotal: 0,
    catTheta: 0.30,
    catHistory: [],
    // ── Voice mode ────────────────────────────────────────────────
    voiceMode: false,         // voice panel visible
    voiceSpeaking: false,     // TTS active
    voiceListening: false,    // STT active
    voiceRecog: null          // current SpeechRecognition instance
  };

  function $(id) {
    return document.getElementById(id);
  }

  function showView(name) {
    ["view-home", "view-mock-setup", "view-study-setup", "view-help", "view-run", "view-results", "view-concepts", "view-resources", "view-jobs", "view-resume", "view-acronyms"].forEach(
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
    state.timerTick = null;
    state.timerPauseStart = null;
    state.timerPausedMs = 0;
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function startTimer(seconds) {
    clearTimer();
    state.totalSeconds = seconds;
    state.timerPausedMs = 0;
    state.timerPauseStart = null;
    state.timerEnd = Date.now() + seconds * 1000;
    const wrap = $("run-timer-wrap");
    const text = $("run-timer-text");
    const bar = $("run-timer-bar");
    const fill = $("run-timer-fill");
    wrap.classList.remove("hidden");

    function tick() {
      const left = Math.max(0, Math.ceil((state.timerEnd - Date.now()) / 1000));
      const pauseBadge = document.getElementById("timer-pause-badge");
      text.textContent = formatTime(left) + (pauseBadge ? "" : "");
      const pct = state.totalSeconds > 0 ? (left / state.totalSeconds) * 100 : 0;
      fill.style.width = `${pct}%`;
      bar.classList.toggle("warn", pct < 25 && pct >= 10);
      bar.classList.toggle("crit", pct < 10);
      if (left <= 0) {
        clearTimer();
        finishExam(true);
      }
    }
    state.timerTick = tick;
    tick();
    state.timerId = setInterval(tick, 500);
  }

  function pauseTimer() {
    if (state.mode !== "mock") return;
    if (!state.timerId || state.timerPauseStart !== null) return; // already paused or no timer
    clearInterval(state.timerId);
    state.timerId = null;
    state.timerPauseStart = Date.now();
    // visual paused badge
    const wrap = $("run-timer-wrap");
    if (wrap && !document.getElementById("timer-pause-badge")) {
      const badge = document.createElement("div");
      badge.id = "timer-pause-badge";
      badge.className = "timer-pause-badge";
      badge.textContent = "⏸ PAUSED";
      wrap.appendChild(badge);
    }
  }

  function resumeTimer() {
    if (state.mode !== "mock") return;
    if (state.timerPauseStart === null) return; // not paused
    const pausedMs = Date.now() - state.timerPauseStart;
    state.timerPausedMs += pausedMs;
    state.timerEnd += pausedMs; // shift end forward so paused time doesn't count down
    state.timerPauseStart = null;
    // remove badge
    const badge = document.getElementById("timer-pause-badge");
    if (badge) badge.remove();
    // restart interval
    if (state.timerTick) {
      state.timerTick();
      state.timerId = setInterval(state.timerTick, 500);
    }
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
    const atLast = state.index >= state.questions.length - 1;
    // In adaptive mode more questions will be loaded when Next is clicked,
    // so "last" means: at last AND no more can be served
    const canServeMore = state.adaptive &&
      state.questions.length < state.adaptiveTotal &&
      state.adaptivePool.length > 0;
    const isLast = atLast && !canServeMore;

    // Prev: hidden in adaptive mode (CAT doesn't allow going back) or at start or strict
    const hidePrev = state.index === 0 || state.strict || state.adaptive;
    btnPrev.classList.toggle("hidden", hidePrev);
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
    renderCatIndicator();
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
    let pausedStr = "";
    if (state.mode === "mock" && state.totalSeconds > 0) {
      const usedSec = timeUp
        ? state.totalSeconds
        : state.totalSeconds - Math.max(0, Math.ceil((state.timerEnd - Date.now()) / 1000));
      const em = Math.floor(usedSec / 60);
      const es = usedSec % 60;
      elapsedStr = `${em}m ${es}s`;
      if (state.timerPausedMs > 0) {
        const ps = Math.round(state.timerPausedMs / 1000);
        pausedStr = `${Math.floor(ps / 60)}m ${ps % 60}s`;
      }
    }

    // ── Store byDomain for gap analysis access ────────────────────
    state.lastByDomain = byDomain;

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
    if (pausedStr) metaLines.push(`⏸ Timer paused: ${pausedStr} (reviewing answers)`);
    if (revealedCount) metaLines.push(`Answers revealed: ${revealedCount}`);
    if (state.adaptive) {
      const { label } = catLevel();
      metaLines.push(`📈 CAT mode — final level: <strong>${label}</strong> (θ = ${Math.round(state.catTheta * 100)}%)`);
    }
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

    // Hide and clear the gap analysis so a fresh click always re-renders
    const gapPanel = $("results-gap");
    gapPanel.classList.add("hidden");
    gapPanel.innerHTML = "";

    showView("view-results");
  }

  // ── Gap Analysis ─────────────────────────────────────────────────
  function renderGapAnalysis() {
    const panel = $("results-gap");
    panel.classList.remove("hidden");
    panel.innerHTML = "";

    const byDomain = state.lastByDomain || {};
    const PASS_PCT = 70;
    const REVIEW_PCT = 85;

    // Enrich each domain with pct + wrong question texts
    const domainStats = DOMAIN_SLUGS.map((slug) => {
      const stat = byDomain[slug] || { correct: 0, wrong: 0, skipped: 0, total: 0, label: slug };
      const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : null;
      // gather wrong question indices for this domain
      const wrongQs = state.questions.reduce((acc, q, i) => {
        if (q.domain === slug && state.answers[i] !== null && state.answers[i] !== q.correctIndex) {
          acc.push(q);
        }
        return acc;
      }, []);
      // get concept topics for this domain from CISSP_CONCEPTS
      const conceptEntry = (window.CISSP_CONCEPTS || []).find(c => c.domain === slug);
      const topics = conceptEntry ? conceptEntry.topics.map(t => t.title) : [];
      return { slug, label: stat.label, stat, pct, wrongQs, topics };
    }).filter(d => d.stat.total > 0); // only domains that appeared in this session

    if (domainStats.length === 0) {
      panel.innerHTML = `<p style="color:var(--muted);text-align:center;padding:1.5rem 0">No domain data available for this session.</p>`;
      return;
    }

    const priority1 = domainStats.filter(d => d.pct !== null && d.pct < PASS_PCT).sort((a, b) => a.pct - b.pct);
    const priority2 = domainStats.filter(d => d.pct !== null && d.pct >= PASS_PCT && d.pct < REVIEW_PCT);
    const strong    = domainStats.filter(d => d.pct !== null && d.pct >= REVIEW_PCT);

    const overallPct = (() => {
      let c = 0, t = 0;
      domainStats.forEach(d => { c += d.stat.correct; t += d.stat.total; });
      return t ? Math.round((c / t) * 100) : 0;
    })();

    const header = document.createElement("div");
    header.className = "gap-header";
    const statusCls = overallPct >= PASS_PCT ? "gap-status-pass" : "gap-status-fail";
    header.innerHTML =
      `<div class="gap-title">📊 Gap Analysis — Study Priority Plan</div>` +
      `<div class="gap-overall ${statusCls}">Overall: ${overallPct}% — ${overallPct >= PASS_PCT ? "Passing range" : "Needs improvement"}</div>`;
    panel.appendChild(header);

    function renderSection(title, badge, items, badgeCls) {
      if (items.length === 0) return;
      const sec = document.createElement("div");
      sec.className = "gap-section";

      const secHead = document.createElement("div");
      secHead.className = "gap-section-head";
      secHead.innerHTML = `<span class="gap-badge ${badgeCls}">${badge}</span><span class="gap-section-title">${title}</span>`;
      sec.appendChild(secHead);

      items.forEach(d => {
        const card = document.createElement("div");
        card.className = "gap-card " + badgeCls;

        const pctLabel = d.pct !== null ? `${d.pct}%` : "–";
        const domNum = DOMAIN_SLUGS.indexOf(d.slug) + 1;

        const cardTop = document.createElement("div");
        cardTop.className = "gap-card-top";
        cardTop.innerHTML =
          `<span class="gap-domain-label">D${domNum}: ${d.label}</span>` +
          `<span class="gap-pct-badge ${badgeCls}">${pctLabel}</span>`;
        card.appendChild(cardTop);

        if (d.stat.wrong > 0 || d.stat.skipped > 0) {
          const statsRow = document.createElement("div");
          statsRow.className = "gap-stats-row";
          statsRow.innerHTML =
            `<span class="gap-stat-wrong">✗ ${d.stat.wrong} wrong</span>` +
            (d.stat.skipped > 0 ? `<span class="gap-stat-skip">⊘ ${d.stat.skipped} skipped</span>` : "") +
            `<span class="gap-stat-ok">✓ ${d.stat.correct} correct</span>`;
          card.appendChild(statsRow);
        }

        if (d.topics.length > 0 && badgeCls !== "gap-strong") {
          const topicHead = document.createElement("div");
          topicHead.className = "gap-topic-head";
          topicHead.textContent = "📚 Topics to study:";
          card.appendChild(topicHead);

          const topicList = document.createElement("ul");
          topicList.className = "gap-topic-list";
          d.topics.forEach(t => {
            const li = document.createElement("li");
            li.textContent = t;
            topicList.appendChild(li);
          });
          card.appendChild(topicList);
        }

        if (d.wrongQs.length > 0 && badgeCls !== "gap-strong") {
          const wqHead = document.createElement("div");
          wqHead.className = "gap-topic-head";
          wqHead.textContent = "❌ Questions you got wrong:";
          card.appendChild(wqHead);

          const wqList = document.createElement("div");
          wqList.className = "gap-wq-list";
          d.wrongQs.slice(0, 5).forEach(q => {
            const wq = document.createElement("div");
            wq.className = "gap-wq-item";
            wq.textContent = q.text.length > 110 ? q.text.slice(0, 107) + "…" : q.text;
            wqList.appendChild(wq);
          });
          if (d.wrongQs.length > 5) {
            const more = document.createElement("div");
            more.className = "gap-wq-more";
            more.textContent = `+ ${d.wrongQs.length - 5} more wrong answers (see Question Review above)`;
            wqList.appendChild(more);
          }
          card.appendChild(wqList);
        }

        const practiceBtn = document.createElement("button");
        practiceBtn.type = "button";
        practiceBtn.className = "gap-practice-btn";
        practiceBtn.textContent = `▶ Practice ${d.label.split(" ").slice(0, 3).join(" ")} questions`;
        practiceBtn.addEventListener("click", () => {
          startDomainSession(d.slug, d.label);
        });
        card.appendChild(practiceBtn);

        sec.appendChild(card);
      });

      panel.appendChild(sec);
    }

    renderSection(
      "Domains Needing Work — Focus Here First",
      "⚠ Priority 1",
      priority1,
      "gap-critical"
    );
    renderSection(
      "Domains to Review — Solidify Your Knowledge",
      "↑ Priority 2",
      priority2,
      "gap-review"
    );
    renderSection(
      "Strong Domains — Maintain Your Edge",
      "✓ Strong",
      strong,
      "gap-strong"
    );

    if (priority1.length === 0 && priority2.length === 0) {
      const congrats = document.createElement("div");
      congrats.className = "gap-congrats";
      congrats.innerHTML = `<div style="font-size:2rem">🎉</div><div>Outstanding performance across all domains! Keep practising to maintain your edge.</div>`;
      panel.appendChild(congrats);
    }
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

    $("btn-jobs").addEventListener("click", () => {
      showView("view-jobs");
      renderJobsView();
    });

    $("btn-resume").addEventListener("click", () => {
      showView("view-resume");
      renderResumeView();
    });

    $("btn-acronyms").addEventListener("click", () => {
      _acrSearch = ""; _acrDomain = "all"; _acrMode = "ref";
      showView("view-acronyms");
      renderAcronymsView();
      const inp = $("acr-search");
      if (inp) inp.value = "";
    });
    $("acr-back").addEventListener("click", () => showView("view-home"));
    $("btn-acr-ref").addEventListener("click", () => {
      _acrMode = "ref";
      renderAcronymsView();
    });
    $("btn-acr-flash").addEventListener("click", () => {
      _acrMode = "flash";
      renderAcronymsView();
    });
    $("acr-search").addEventListener("input", e => {
      _acrSearch = e.target.value.trim();
      renderAcronymsView();
    });
    $("btn-flash-know").addEventListener("click", () => {
      _acrKnown++;
      _acrPos++;
      renderAcrFlashCard();
    });
    $("btn-flash-review").addEventListener("click", () => {
      _acrReview.push(_acrDeck[_acrPos]);
      _acrPos++;
      renderAcrFlashCard();
    });
    $("btn-flash-restart").addEventListener("click", () => {
      renderAcrFlashStart();
    });
    $("btn-flash-retry").addEventListener("click", () => {
      _acrDeck   = [..._acrReview].sort(() => Math.random() - 0.5);
      _acrPos    = 0;
      _acrKnown  = 0;
      _acrReview = [];
      renderAcrFlashCard();
    });

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
      const adaptive = $("mock-adaptive") ? $("mock-adaptive").checked : false;

      const pool = filterPool(bank, { hardOnly });
      if (pool.length < Math.min(5, n)) {
        alert("Not enough questions in the filtered pool. Add items to questions.js or widen filters.");
        return;
      }

      state.mode = "mock";
      state.revealed = new Set();
      state.index = 0;
      state.strict = strict;
      state.showExplanation = false;
      state.adaptive = adaptive;
      state.catTheta = 0.30;
      state.catHistory = [];

      if (adaptive) {
        // CAT: give the engine the full shuffled pool; serve questions one-by-one
        state.adaptivePool = shuffle(pool.slice());
        state.adaptiveTotal = Math.min(n, state.adaptivePool.length);
        // Serve the first question
        const first = selectAdaptiveQuestion();
        state.questions = first ? [first] : [];
        state.answers = first ? [null] : [];
      } else {
        const picked = pickQuestions(pool, n, balanced);
        state.questions = picked;
        state.answers = picked.map(() => null);
        state.adaptivePool = [];
        state.adaptiveTotal = 0;
      }

      $("run-title").textContent = adaptive ? "Mock exam — Adaptive (CAT)" : "Mock exam";
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

    $("btn-prev").addEventListener("click", () => { stopVoice(); resumeTimer(); goDelta(-1); });
    $("btn-next").addEventListener("click", () => {
      stopVoice(); resumeTimer();
      // In adaptive mode, update theta from the current answer before loading the next question
      if (state.adaptive && state.index === state.questions.length - 1) {
        const ans = state.answers[state.index];
        if (ans !== null && ans !== undefined) {
          const q = state.questions[state.index];
          updateCatTheta(ans === q.correctIndex, q.hard);
        }
        // Load the next adaptive question if target count not yet reached
        if (state.questions.length < state.adaptiveTotal && state.adaptivePool.length > 0) {
          const next = selectAdaptiveQuestion();
          if (next) {
            state.questions.push(next);
            state.answers.push(null);
          }
        }
      }
      goDelta(1);
    });

    $("btn-reveal").addEventListener("click", () => {
      if (state.revealed.has(state.index)) {
        state.revealed.delete(state.index);
        resumeTimer(); // timer resumes when hiding the answer
      } else {
        state.revealed.add(state.index);
        pauseTimer(); // timer pauses when revealing the answer
      }
      renderQuestion();
    });

    $("btn-finish-study").addEventListener("click", () => {
      stopVoice(); resumeTimer();
      finishExam(false);
    });

    $("btn-submit").addEventListener("click", () => {
      const unanswered = state.answers.some((a) => a === null || a === undefined);
      if (unanswered && !confirm("Some questions are unanswered. Submit anyway?")) return;
      stopVoice(); resumeTimer();
      // Commit theta for the final adaptive question before scoring
      if (state.adaptive) {
        const ans = state.answers[state.index];
        if (ans !== null && ans !== undefined) {
          const q = state.questions[state.index];
          updateCatTheta(ans === q.correctIndex, q.hard);
        }
      }
      finishExam(false);
    });

    $("btn-abort").addEventListener("click", () => {
      if (confirm("Leave this session?")) {
        stopVoice();
        clearTimer();
        showView("view-home");
      }
    });

    // ── Voice buttons ────────────────────────────────────────────────
    $("btn-toggle-voice").addEventListener("click", toggleVoiceMode);
    $("btn-voice-rl").addEventListener("click",    doVoiceSession);
    $("btn-voice-read").addEventListener("click",  doVoiceRead);
    $("btn-voice-listen").addEventListener("click",doVoiceListen);
    $("btn-voice-stop").addEventListener("click",  stopVoice);

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

    $("btn-gap-analysis").addEventListener("click", () => {
      renderGapAnalysis();
      $("results-gap").scrollIntoView({ behavior: "smooth" });
    });
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

  // ── Acronym Reference & Flashcard view ───────────────────────────

  const CISSP_ACRONYMS = [
    // Security & Risk Management
    {a:"AAA",       f:"Authentication, Authorization, and Accounting",                   d:"identity_access_management"},
    {a:"ALE",       f:"Annualized Loss Expectancy",                                      d:"security_and_risk_management"},
    {a:"ARO",       f:"Annualized Rate of Occurrence",                                   d:"security_and_risk_management"},
    {a:"BCP",       f:"Business Continuity Plan",                                        d:"security_and_risk_management"},
    {a:"BIA",       f:"Business Impact Analysis",                                        d:"security_and_risk_management"},
    {a:"CIA",       f:"Confidentiality, Integrity, Availability",                        d:"security_and_risk_management"},
    {a:"CISO",      f:"Chief Information Security Officer",                              d:"security_and_risk_management"},
    {a:"CSO",       f:"Chief Security Officer",                                          d:"security_and_risk_management"},
    {a:"DRP",       f:"Disaster Recovery Plan",                                          d:"security_and_risk_management"},
    {a:"EF",        f:"Exposure Factor",                                                 d:"security_and_risk_management"},
    {a:"FERPA",     f:"Family Educational Rights and Privacy Act",                       d:"security_and_risk_management"},
    {a:"FIPS",      f:"Federal Information Processing Standard",                         d:"security_and_risk_management"},
    {a:"GLBA",      f:"Gramm-Leach-Bliley Act",                                          d:"security_and_risk_management"},
    {a:"HIPAA",     f:"Health Insurance Portability and Accountability Act",             d:"security_and_risk_management"},
    {a:"ISO",       f:"International Organization for Standardization",                  d:"security_and_risk_management"},
    {a:"ITAR",      f:"International Traffic in Arms Regulations",                       d:"security_and_risk_management"},
    {a:"MTD",       f:"Maximum Tolerable Downtime",                                      d:"security_and_risk_management"},
    {a:"NIST",      f:"National Institute of Standards and Technology",                  d:"security_and_risk_management"},
    {a:"PCI DSS",   f:"Payment Card Industry Data Security Standard",                   d:"security_and_risk_management"},
    {a:"PII",       f:"Personally Identifiable Information",                             d:"security_and_risk_management"},
    {a:"RMF",       f:"Risk Management Framework",                                       d:"security_and_risk_management"},
    {a:"RPO",       f:"Recovery Point Objective",                                        d:"security_and_risk_management"},
    {a:"RTO",       f:"Recovery Time Objective",                                         d:"security_and_risk_management"},
    {a:"SLA",       f:"Service Level Agreement",                                         d:"security_and_risk_management"},
    {a:"SLE",       f:"Single Loss Expectancy",                                          d:"security_and_risk_management"},
    {a:"SOX",       f:"Sarbanes-Oxley Act",                                              d:"security_and_risk_management"},
    // Asset Security
    {a:"CDM",       f:"Continuous Diagnostics and Mitigation",                           d:"asset_security"},
    {a:"DLP",       f:"Data Loss Prevention",                                            d:"asset_security"},
    {a:"DRM",       f:"Digital Rights Management",                                       d:"asset_security"},
    {a:"FDE",       f:"Full Disk Encryption",                                            d:"asset_security"},
    {a:"GDPR",      f:"General Data Protection Regulation",                              d:"asset_security"},
    {a:"MDM",       f:"Mobile Device Management",                                        d:"asset_security"},
    {a:"PHI",       f:"Protected Health Information",                                    d:"asset_security"},
    {a:"SaaS",      f:"Software as a Service",                                           d:"asset_security"},
    {a:"IaaS",      f:"Infrastructure as a Service",                                     d:"asset_security"},
    {a:"PaaS",      f:"Platform as a Service",                                           d:"asset_security"},
    // Security Architecture & Engineering
    {a:"3DES",      f:"Triple Data Encryption Standard",                                 d:"security_architecture_engineering"},
    {a:"AES",       f:"Advanced Encryption Standard",                                    d:"security_architecture_engineering"},
    {a:"CA",        f:"Certificate Authority",                                            d:"security_architecture_engineering"},
    {a:"CBC",       f:"Cipher Block Chaining",                                           d:"security_architecture_engineering"},
    {a:"CRL",       f:"Certificate Revocation List",                                     d:"security_architecture_engineering"},
    {a:"CTR",       f:"Counter Mode (encryption mode)",                                  d:"security_architecture_engineering"},
    {a:"DAC",       f:"Discretionary Access Control",                                    d:"security_architecture_engineering"},
    {a:"DES",       f:"Data Encryption Standard",                                        d:"security_architecture_engineering"},
    {a:"DEP",       f:"Data Execution Prevention",                                       d:"security_architecture_engineering"},
    {a:"DMZ",       f:"Demilitarized Zone",                                              d:"security_architecture_engineering"},
    {a:"ECC",       f:"Elliptic Curve Cryptography",                                     d:"security_architecture_engineering"},
    {a:"ECDSA",     f:"Elliptic Curve Digital Signature Algorithm",                      d:"security_architecture_engineering"},
    {a:"EMI",       f:"Electromagnetic Interference",                                    d:"security_architecture_engineering"},
    {a:"GCM",       f:"Galois/Counter Mode",                                             d:"security_architecture_engineering"},
    {a:"HMAC",      f:"Hash-based Message Authentication Code",                          d:"security_architecture_engineering"},
    {a:"HSM",       f:"Hardware Security Module",                                        d:"security_architecture_engineering"},
    {a:"IDEA",      f:"International Data Encryption Algorithm",                         d:"security_architecture_engineering"},
    {a:"IV",        f:"Initialization Vector",                                           d:"security_architecture_engineering"},
    {a:"MAC",       f:"Mandatory Access Control / Message Authentication Code",          d:"security_architecture_engineering"},
    {a:"MD5",       f:"Message Digest 5",                                                d:"security_architecture_engineering"},
    {a:"OCSP",      f:"Online Certificate Status Protocol",                              d:"security_architecture_engineering"},
    {a:"OFB",       f:"Output Feedback (encryption mode)",                               d:"security_architecture_engineering"},
    {a:"PGP",       f:"Pretty Good Privacy",                                             d:"security_architecture_engineering"},
    {a:"PKCS",      f:"Public Key Cryptography Standards",                               d:"security_architecture_engineering"},
    {a:"PKI",       f:"Public Key Infrastructure",                                       d:"security_architecture_engineering"},
    {a:"RC4",       f:"Rivest Cipher 4",                                                 d:"security_architecture_engineering"},
    {a:"RBAC",      f:"Role-Based Access Control",                                       d:"security_architecture_engineering"},
    {a:"RSA",       f:"Rivest-Shamir-Adleman (asymmetric algorithm)",                    d:"security_architecture_engineering"},
    {a:"SHA",       f:"Secure Hash Algorithm",                                           d:"security_architecture_engineering"},
    {a:"SHA-256",   f:"Secure Hash Algorithm – 256-bit",                                 d:"security_architecture_engineering"},
    {a:"S/MIME",    f:"Secure / Multipurpose Internet Mail Extensions",                  d:"security_architecture_engineering"},
    {a:"TCB",       f:"Trusted Computing Base",                                          d:"security_architecture_engineering"},
    {a:"TCSEC",     f:"Trusted Computer System Evaluation Criteria",                     d:"security_architecture_engineering"},
    {a:"TPM",       f:"Trusted Platform Module",                                         d:"security_architecture_engineering"},
    {a:"VMM",       f:"Virtual Machine Monitor (Hypervisor)",                            d:"security_architecture_engineering"},
    // Communication & Network Security
    {a:"ARP",       f:"Address Resolution Protocol",                                     d:"communication_network_security"},
    {a:"BGP",       f:"Border Gateway Protocol",                                         d:"communication_network_security"},
    {a:"BYOD",      f:"Bring Your Own Device",                                           d:"communication_network_security"},
    {a:"CHAP",      f:"Challenge Handshake Authentication Protocol",                     d:"communication_network_security"},
    {a:"CSRF",      f:"Cross-Site Request Forgery",                                      d:"communication_network_security"},
    {a:"DDoS",      f:"Distributed Denial of Service",                                   d:"communication_network_security"},
    {a:"DHCP",      f:"Dynamic Host Configuration Protocol",                             d:"communication_network_security"},
    {a:"DNS",       f:"Domain Name System",                                              d:"communication_network_security"},
    {a:"DNSSEC",    f:"Domain Name System Security Extensions",                          d:"communication_network_security"},
    {a:"DoS",       f:"Denial of Service",                                               d:"communication_network_security"},
    {a:"EAP",       f:"Extensible Authentication Protocol",                              d:"communication_network_security"},
    {a:"FTP",       f:"File Transfer Protocol",                                          d:"communication_network_security"},
    {a:"HTTP",      f:"Hypertext Transfer Protocol",                                     d:"communication_network_security"},
    {a:"HTTPS",     f:"Hypertext Transfer Protocol Secure",                              d:"communication_network_security"},
    {a:"ICMP",      f:"Internet Control Message Protocol",                               d:"communication_network_security"},
    {a:"IDS",       f:"Intrusion Detection System",                                      d:"communication_network_security"},
    {a:"IKE",       f:"Internet Key Exchange",                                           d:"communication_network_security"},
    {a:"IMAP",      f:"Internet Message Access Protocol",                                d:"communication_network_security"},
    {a:"IPSec",     f:"Internet Protocol Security",                                      d:"communication_network_security"},
    {a:"IPS",       f:"Intrusion Prevention System",                                     d:"communication_network_security"},
    {a:"L2TP",      f:"Layer 2 Tunneling Protocol",                                      d:"communication_network_security"},
    {a:"LDAP",      f:"Lightweight Directory Access Protocol",                           d:"communication_network_security"},
    {a:"MPLS",      f:"Multiprotocol Label Switching",                                   d:"communication_network_security"},
    {a:"NAC",       f:"Network Access Control",                                          d:"communication_network_security"},
    {a:"NAT",       f:"Network Address Translation",                                     d:"communication_network_security"},
    {a:"NIDS",      f:"Network-based Intrusion Detection System",                        d:"communication_network_security"},
    {a:"OSI",       f:"Open Systems Interconnection (7-layer model)",                    d:"communication_network_security"},
    {a:"OSPF",      f:"Open Shortest Path First",                                        d:"communication_network_security"},
    {a:"PAP",       f:"Password Authentication Protocol",                                d:"communication_network_security"},
    {a:"POP3",      f:"Post Office Protocol version 3",                                  d:"communication_network_security"},
    {a:"PPTP",      f:"Point-to-Point Tunneling Protocol",                               d:"communication_network_security"},
    {a:"RADIUS",    f:"Remote Authentication Dial-In User Service",                      d:"communication_network_security"},
    {a:"RIP",       f:"Routing Information Protocol",                                    d:"communication_network_security"},
    {a:"SFTP",      f:"Secure File Transfer Protocol",                                   d:"communication_network_security"},
    {a:"SIP",       f:"Session Initiation Protocol",                                     d:"communication_network_security"},
    {a:"SMTP",      f:"Simple Mail Transfer Protocol",                                   d:"communication_network_security"},
    {a:"SNMP",      f:"Simple Network Management Protocol",                              d:"communication_network_security"},
    {a:"SSH",       f:"Secure Shell",                                                    d:"communication_network_security"},
    {a:"SSL",       f:"Secure Sockets Layer",                                            d:"communication_network_security"},
    {a:"SSTP",      f:"Secure Socket Tunneling Protocol",                                d:"communication_network_security"},
    {a:"TCP",       f:"Transmission Control Protocol",                                   d:"communication_network_security"},
    {a:"TLS",       f:"Transport Layer Security",                                        d:"communication_network_security"},
    {a:"UDP",       f:"User Datagram Protocol",                                          d:"communication_network_security"},
    {a:"VLAN",      f:"Virtual Local Area Network",                                      d:"communication_network_security"},
    {a:"VoIP",      f:"Voice over Internet Protocol",                                    d:"communication_network_security"},
    {a:"VPN",       f:"Virtual Private Network",                                         d:"communication_network_security"},
    {a:"WAF",       f:"Web Application Firewall",                                        d:"communication_network_security"},
    {a:"WEP",       f:"Wired Equivalent Privacy",                                        d:"communication_network_security"},
    {a:"WPA",       f:"Wi-Fi Protected Access",                                          d:"communication_network_security"},
    {a:"WPA2",      f:"Wi-Fi Protected Access 2 (802.11i)",                              d:"communication_network_security"},
    {a:"WPA3",      f:"Wi-Fi Protected Access 3",                                        d:"communication_network_security"},
    {a:"XSS",       f:"Cross-Site Scripting",                                            d:"communication_network_security"},
    // Identity & Access Management
    {a:"2FA",       f:"Two-Factor Authentication",                                       d:"identity_access_management"},
    {a:"ABAC",      f:"Attribute-Based Access Control",                                  d:"identity_access_management"},
    {a:"AD",        f:"Active Directory",                                                d:"identity_access_management"},
    {a:"CER",       f:"Crossover Error Rate",                                            d:"identity_access_management"},
    {a:"FAR",       f:"False Acceptance Rate",                                           d:"identity_access_management"},
    {a:"FIDO",      f:"Fast Identity Online",                                            d:"identity_access_management"},
    {a:"FRR",       f:"False Rejection Rate",                                            d:"identity_access_management"},
    {a:"IAM",       f:"Identity and Access Management",                                  d:"identity_access_management"},
    {a:"IdP",       f:"Identity Provider",                                               d:"identity_access_management"},
    {a:"MFA",       f:"Multi-Factor Authentication",                                     d:"identity_access_management"},
    {a:"OAuth",     f:"Open Authorization (delegated access standard)",                  d:"identity_access_management"},
    {a:"OIDC",      f:"OpenID Connect",                                                  d:"identity_access_management"},
    {a:"OTP",       f:"One-Time Password",                                               d:"identity_access_management"},
    {a:"PAM",       f:"Privileged Access Management",                                    d:"identity_access_management"},
    {a:"POLP",      f:"Principle of Least Privilege",                                    d:"identity_access_management"},
    {a:"SAML",      f:"Security Assertion Markup Language",                              d:"identity_access_management"},
    {a:"SCIM",      f:"System for Cross-domain Identity Management",                     d:"identity_access_management"},
    {a:"SSO",       f:"Single Sign-On",                                                  d:"identity_access_management"},
    {a:"TACACS+",   f:"Terminal Access Controller Access-Control System Plus",           d:"identity_access_management"},
    {a:"TOTP",      f:"Time-based One-Time Password",                                    d:"identity_access_management"},
    // Security Assessment & Testing
    {a:"CVE",       f:"Common Vulnerabilities and Exposures",                            d:"security_assessment_testing"},
    {a:"CVSS",      f:"Common Vulnerability Scoring System",                             d:"security_assessment_testing"},
    {a:"CWE",       f:"Common Weakness Enumeration",                                     d:"security_assessment_testing"},
    {a:"DAST",      f:"Dynamic Application Security Testing",                            d:"security_assessment_testing"},
    {a:"IAST",      f:"Interactive Application Security Testing",                        d:"security_assessment_testing"},
    {a:"NVD",       f:"National Vulnerability Database",                                 d:"security_assessment_testing"},
    {a:"OVAL",      f:"Open Vulnerability and Assessment Language",                      d:"security_assessment_testing"},
    {a:"OWASP",     f:"Open Web Application Security Project",                          d:"security_assessment_testing"},
    {a:"RASP",      f:"Runtime Application Self-Protection",                             d:"security_assessment_testing"},
    {a:"SAST",      f:"Static Application Security Testing",                             d:"security_assessment_testing"},
    {a:"SCAP",      f:"Security Content Automation Protocol",                            d:"security_assessment_testing"},
    {a:"SOC",       f:"System and Organization Controls / Security Operations Center",   d:"security_assessment_testing"},
    {a:"VA",        f:"Vulnerability Assessment",                                        d:"security_assessment_testing"},
    {a:"VAPT",      f:"Vulnerability Assessment and Penetration Testing",                d:"security_assessment_testing"},
    // Security Operations
    {a:"APT",       f:"Advanced Persistent Threat",                                      d:"security_operations"},
    {a:"CIRT",      f:"Computer Incident Response Team",                                 d:"security_operations"},
    {a:"CSIRT",     f:"Computer Security Incident Response Team",                        d:"security_operations"},
    {a:"EDR",       f:"Endpoint Detection and Response",                                 d:"security_operations"},
    {a:"FIM",       f:"File Integrity Monitoring",                                       d:"security_operations"},
    {a:"IOC",       f:"Indicator of Compromise",                                         d:"security_operations"},
    {a:"IR",        f:"Incident Response",                                               d:"security_operations"},
    {a:"IRP",       f:"Incident Response Plan",                                          d:"security_operations"},
    {a:"MDR",       f:"Managed Detection and Response",                                  d:"security_operations"},
    {a:"MSSP",      f:"Managed Security Service Provider",                               d:"security_operations"},
    {a:"NOC",       f:"Network Operations Center",                                       d:"security_operations"},
    {a:"OSINT",     f:"Open Source Intelligence",                                        d:"security_operations"},
    {a:"SIEM",      f:"Security Information and Event Management",                       d:"security_operations"},
    {a:"SOAR",      f:"Security Orchestration, Automation, and Response",                d:"security_operations"},
    {a:"SOP",       f:"Standard Operating Procedure",                                    d:"security_operations"},
    {a:"STIX",      f:"Structured Threat Information eXpression",                        d:"security_operations"},
    {a:"TAXII",     f:"Trusted Automated eXchange of Intelligence Information",          d:"security_operations"},
    {a:"TTP",       f:"Tactics, Techniques, and Procedures",                             d:"security_operations"},
    {a:"UEBA",      f:"User and Entity Behavior Analytics",                              d:"security_operations"},
    {a:"XDR",       f:"Extended Detection and Response",                                 d:"security_operations"},
    // Software Development Security
    {a:"ASVS",      f:"Application Security Verification Standard",                     d:"software_development_security"},
    {a:"CI/CD",     f:"Continuous Integration / Continuous Deployment",                  d:"software_development_security"},
    {a:"DevSecOps", f:"Development, Security, and Operations",                           d:"software_development_security"},
    {a:"REST",      f:"Representational State Transfer",                                 d:"software_development_security"},
    {a:"SDLC",      f:"Software Development Life Cycle",                                 d:"software_development_security"},
    {a:"SOA",       f:"Service-Oriented Architecture",                                   d:"software_development_security"},
    {a:"SQL",       f:"Structured Query Language",                                       d:"software_development_security"},
    {a:"SQLi",      f:"SQL Injection",                                                   d:"software_development_security"},
    {a:"XXE",       f:"XML External Entity (injection attack)",                          d:"software_development_security"},
    {a:"SAST",      f:"Static Application Security Testing",                             d:"software_development_security"},
    {a:"DAST",      f:"Dynamic Application Security Testing",                            d:"software_development_security"},
  ].sort((x,y) => x.a.localeCompare(y.a, undefined, {sensitivity:"base"}));

  // domain short-labels and hue map for acronym badges
  const ACR_DOMAIN_META = {
    security_and_risk_management:      {short:"Risk Mgmt",   hue:220},
    asset_security:                    {short:"Asset Sec",   hue:175},
    security_architecture_engineering: {short:"Arch & Eng",  hue:260},
    communication_network_security:    {short:"Network",     hue:200},
    identity_access_management:        {short:"IAM",         hue:280},
    security_assessment_testing:       {short:"Assessment",  hue:40},
    security_operations:               {short:"Ops",         hue:15},
    software_development_security:     {short:"Dev Sec",     hue:140},
  };

  // Acronym view module state (outside main state object — ephemeral UI)
  let _acrSearch  = "";
  let _acrDomain  = "all";
  let _acrMode    = "ref";        // "ref" | "flash"
  let _acrDeck    = [];           // current flashcard deck
  let _acrPos     = 0;
  let _acrKnown   = 0;
  let _acrReview  = [];           // items marked "review later"
  let _acrFlipped = false;

  function _acrFiltered() {
    const q = _acrSearch.toLowerCase();
    return CISSP_ACRONYMS.filter(item =>
      (_acrDomain === "all" || item.d === _acrDomain) &&
      (!q || item.a.toLowerCase().includes(q) || item.f.toLowerCase().includes(q))
    );
  }

  function _acrDomainBadge(d) {
    const m = ACR_DOMAIN_META[d] || {short:d, hue:200};
    return `<span class="acr-domain-badge" style="--hue:${m.hue}">${m.short}</span>`;
  }

  function renderAcronymsView() {
    // ── domain filter chips ──────────────────────────────────
    const domainRow = $("acr-domain-row");
    if (domainRow) {
      const chips = [["all","All Domains"]]
        .concat(Object.entries(ACR_DOMAIN_META).map(([k,v])=>[k,v.short]))
        .map(([k,label]) => {
          const cnt = k === "all"
            ? CISSP_ACRONYMS.length
            : CISSP_ACRONYMS.filter(x=>x.d===k).length;
          const active = _acrDomain === k ? " acr-chip-active" : "";
          return `<button class="acr-chip${active}" data-dom="${k}">${label} <sup>${cnt}</sup></button>`;
        }).join("");
      domainRow.innerHTML = chips;
      domainRow.querySelectorAll(".acr-chip").forEach(btn =>
        btn.addEventListener("click", () => {
          _acrDomain = btn.dataset.dom;
          _acrSearch = "";
          const inp = $("acr-search");
          if (inp) inp.value = "";
          renderAcronymsView();
        })
      );
    }
    // ── mode toggle active state ─────────────────────────────
    [$("btn-acr-ref"), $("btn-acr-flash")].forEach(b => b && b.classList.remove("acr-mode-active"));
    const activeBtn = $(_acrMode === "ref" ? "btn-acr-ref" : "btn-acr-flash");
    if (activeBtn) activeBtn.classList.add("acr-mode-active");

    if (_acrMode === "ref") {
      renderAcrRefGrid();
    } else {
      renderAcrFlashStart();
    }
  }

  function renderAcrRefGrid() {
    const grid  = $("acr-grid");
    const alpha = $("acr-alpha-bar");
    const wrap  = $("acr-flash-wrap");
    if (grid)  grid.classList.remove("hidden");
    if (wrap)  wrap.classList.add("hidden");
    if (alpha) alpha.classList.remove("hidden");

    const list = _acrFiltered();
    const countEl = $("acr-count");
    if (countEl) countEl.textContent = `${list.length} / ${CISSP_ACRONYMS.length}`;

    if (!list.length) {
      if (grid)  grid.innerHTML = `<div class="acr-empty">No acronyms match your search.</div>`;
      if (alpha) alpha.innerHTML = "";
      return;
    }

    // Group by first letter
    const groups = {};
    list.forEach(item => {
      const letter = item.a[0].toUpperCase();
      (groups[letter] = groups[letter] || []).push(item);
    });
    const letters = Object.keys(groups).sort();

    // Alphabet bar
    const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    if (alpha) {
      alpha.innerHTML = allLetters.map(l =>
        letters.includes(l)
          ? `<a class="acr-alpha-link" href="#acr-grp-${l}">${l}</a>`
          : `<span class="acr-alpha-dim">${l}</span>`
      ).join("");
    }

    // Cards grid
    if (grid) {
      grid.innerHTML = letters.map(letter => {
        const cards = groups[letter].map(item => {
          const m = ACR_DOMAIN_META[item.d] || {hue:200};
          return `<div class="acr-card" style="--hue:${m.hue}">
            <div class="acr-card-top">
              <span class="acr-card-acronym">${item.a}</span>
              ${_acrDomainBadge(item.d)}
            </div>
            <div class="acr-card-full">${item.f}</div>
          </div>`;
        }).join("");
        return `<div class="acr-letter-group" id="acr-grp-${letter}">
          <div class="acr-letter-head">${letter}</div>
          <div class="acr-card-row">${cards}</div>
        </div>`;
      }).join("");
    }
  }

  function renderAcrFlashStart() {
    const grid  = $("acr-grid");
    const alpha = $("acr-alpha-bar");
    const wrap  = $("acr-flash-wrap");
    const sumEl = $("acr-flash-summary");
    if (grid)  grid.classList.add("hidden");
    if (alpha) alpha.classList.add("hidden");
    if (wrap)  wrap.classList.remove("hidden");
    if (sumEl) sumEl.classList.add("hidden");

    // Build fresh deck from filtered list (shuffle)
    _acrDeck = [..._acrFiltered()].sort(() => Math.random() - 0.5);
    _acrPos   = 0;
    _acrKnown = 0;
    _acrReview = [];
    _acrFlipped = false;

    const countEl = $("acr-count");
    if (countEl) countEl.textContent = `${_acrDeck.length} cards`;

    renderAcrFlashCard();
  }

  function renderAcrFlashCard() {
    const sumEl   = $("acr-flash-summary");
    const cardEl  = $("acr-flash-card");
    const actEl   = document.querySelector(".acr-flash-actions");

    if (_acrPos >= _acrDeck.length) {
      // Session complete
      if (cardEl) cardEl.classList.add("hidden");
      if (actEl)  actEl.classList.add("hidden");
      if (sumEl) {
        sumEl.classList.remove("hidden");
        const txt = $("acr-flash-summary-text");
        if (txt) txt.innerHTML =
          `<p>✅ <strong>${_acrKnown}</strong> known &nbsp;|&nbsp; 🔁 <strong>${_acrReview.length}</strong> to review</p>` +
          (_acrReview.length ? `<p style="font-size:.85rem;color:var(--muted)">Review cards: ${_acrReview.map(x=>`<strong>${x.a}</strong>`).join(", ")}</p>` : "");
      }
      return;
    }

    if (cardEl) cardEl.classList.remove("hidden");
    if (actEl)  actEl.classList.remove("hidden");
    if (sumEl)  sumEl.classList.add("hidden");
    _acrFlipped = false;

    const item   = _acrDeck[_acrPos];
    const inner  = $("acr-flash-inner");
    if (inner) inner.classList.remove("flipped");

    const acr  = $("acr-flash-acronym");
    const full = $("acr-flash-full");
    const dom  = $("acr-flash-domain");
    if (acr)  acr.textContent  = item.a;
    if (full) full.textContent = item.f;
    if (dom)  dom.innerHTML    = _acrDomainBadge(item.d);

    // Progress bar
    const pos  = $("acr-flash-pos");
    const fill = $("acr-flash-fill");
    if (pos)  pos.textContent = `Card ${_acrPos + 1} of ${_acrDeck.length}`;
    if (fill) fill.style.width = `${((_acrPos) / _acrDeck.length) * 100}%`;
  }

  function flipAcrCard() {
    _acrFlipped = !_acrFlipped;
    const inner = $("acr-flash-inner");
    if (inner) inner.classList.toggle("flipped", _acrFlipped);
  }
  window.flipAcrCard = flipAcrCard; // expose for inline onclick

  // ── Jobs view ────────────────────────────────────────────────────

  const JOB_PORTALS = [
    { id:"linkedin",   name:"LinkedIn",     abbr:"in", color:"#0077b5", desc:"Largest CISSP job pool worldwide",
      url:(t,loc,tp)=>`https://www.linkedin.com/jobs/search/?keywords=${enc(t)}&location=${enc(loc)}${tp==="remote"?"&f_WT=2":tp==="full_time"?"&f_WT=1":""}` },
    { id:"dice",       name:"Dice",         abbr:"D",  color:"#e3571e", desc:"Tech & cybersecurity specialist board",
      url:(t,loc)=>`https://www.dice.com/jobs?q=${enc(t)}&location=${enc(loc)}` },
    { id:"indeed",     name:"Indeed",       abbr:"In", color:"#2164f3", desc:"Largest general job board worldwide",
      url:(t,loc)=>`https://www.indeed.com/jobs?q=${enc(t)}&l=${enc(loc)}` },
    { id:"usajobs",    name:"USAJobs",      abbr:"USA",color:"#004c97", desc:"U.S. federal government positions",
      url:(t,loc)=>`https://www.usajobs.gov/Search/Results?k=${enc(t)}&l=${enc(loc)}` },
    { id:"clearance",  name:"ClearanceJobs",abbr:"CJ", color:"#0055a5", desc:"Cleared & security-clearance roles",
      url:(t,loc)=>`https://www.clearancejobs.com/jobs?q=${enc(t)}&location=${enc(loc)}` },
    { id:"glassdoor",  name:"Glassdoor",    abbr:"G",  color:"#0caa41", desc:"Jobs with salary & company reviews",
      url:(t,loc)=>`https://www.glassdoor.com/Job/${enc(t.replace(/ /g,"-"))}-jobs-SRCH_KO0,${t.length}.htm` },
    { id:"monster",    name:"Monster",      abbr:"M",  color:"#6e45e1", desc:"Broad reach across industries",
      url:(t,loc)=>`https://www.monster.com/jobs/search?q=${enc(t)}&where=${enc(loc)}` },
    { id:"ziprecruiter",name:"ZipRecruiter",abbr:"Z",  color:"#4a90d9", desc:"AI-matched opportunities",
      url:(t,loc)=>`https://www.ziprecruiter.com/candidate/search?search=${enc(t)}&location=${enc(loc)}` },
    { id:"cyberseek",  name:"CyberSeek",    abbr:"CS", color:"#00b4d8", desc:"Cybersecurity career heat map",
      url:()=>`https://www.cyberseek.org/heatmap.html` },
    { id:"infosecjobs",name:"InfoSec Jobs", abbr:"IS", color:"#c0392b", desc:"Dedicated InfoSec board",
      url:(t,loc)=>`https://www.infosec-jobs.com/?q=${enc(t)}&location=${enc(loc)}` },
  ];

  const QUICK_SEARCHES = [
    "CISSP Security Architect","SOC Analyst CISSP","GRC Compliance Analyst CISSP",
    "Cloud Security Engineer CISSP","Penetration Tester CISSP","CISSP Security Manager",
    "DevSecOps Engineer CISSP","CISO Chief Information Security Officer",
    "IAM Engineer CISSP","Incident Response CISSP",
  ];

  function enc(s){ return encodeURIComponent(s||""); }

  const LS_SAVED_JOBS = "cissp_saved_jobs_v1";
  function loadSavedJobs(){ try{ const r=localStorage.getItem(LS_SAVED_JOBS); return r?JSON.parse(r):[]; }catch{ return []; } }
  function persistSavedJobs(list){ localStorage.setItem(LS_SAVED_JOBS,JSON.stringify(list)); }

  const JOB_STATUS_META = {
    bookmarked:{ label:"Bookmarked", cls:"jstatus-book" },
    applied:   { label:"Applied",    cls:"jstatus-applied" },
    screening: { label:"Screening",  cls:"jstatus-screen" },
    interview: { label:"Interview",  cls:"jstatus-interview" },
    offer:     { label:"Offer \uD83C\uDF89", cls:"jstatus-offer" },
    rejected:  { label:"Rejected",   cls:"jstatus-rejected" },
  };

  // ── Live job fetching from free public APIs ───────────────────────
  const SEC_KW = ["security","cyber","cissp","infosec","soc","iam","grc","pentest",
                  "vulnerability","compliance","risk","devsecops","forensic","cryptograph"];

  function isSecRole(title, tags){
    const txt = (title+" "+(Array.isArray(tags)?tags.join(" "):tags||"")).toLowerCase();
    return SEC_KW.some(k=>txt.includes(k));
  }

  async function fetchCISSPJobs(keyword, jobType){
    const allJobs=[], errors=[];
    keyword = (keyword||"CISSP").trim();

    const sources = [
      {
        name:"Remotive", color:"#5f27cd",
        url:`https://remotive.com/api/remote-jobs?search=${enc(keyword)}&limit=30`,
        map(data){
          return (data.jobs||[]).map(j=>({
            id:`rem-${j.id}`, title:j.title, company:j.company_name||"",
            location:j.candidate_required_location||"Remote", url:j.url,
            source:"Remotive", sourceColor:"#5f27cd",
            date:(j.publication_date||"").split("T")[0],
            salary:j.salary||"", type:j.job_type||"",
            tags:(j.tags||"").split(",").map(t=>t.trim()).filter(Boolean).slice(0,5),
          }));
        }
      },
      {
        name:"Jobicy", color:"#0096c7",
        url:`https://jobicy.com/api/v2/remote-jobs?count=30&tag=cybersecurity`,
        map(data){
          return (data.jobs||[]).map(j=>({
            id:`jcy-${j.id}`, title:j.jobTitle, company:j.companyName||"",
            location:j.jobGeo||"Remote", url:j.url,
            source:"Jobicy", sourceColor:"#0096c7",
            date:(j.pubDate||"").split(" ")[0],
            salary:j.annualSalaryMin?`$${Number(j.annualSalaryMin).toLocaleString()}\u2013$${Number(j.annualSalaryMax).toLocaleString()}`:"",
            type:j.jobType||"",
            tags:[j.jobIndustry,j.jobCategory].filter(Boolean).slice(0,3),
          }));
        }
      },
      {
        name:"Arbeitnow", color:"#f77f00",
        url:`https://arbeitnow.com/api/job-board-api`,
        map(data){
          return (data.data||[])
            .filter(j=>isSecRole(j.title,j.tags))
            .slice(0,25)
            .map(j=>({
              id:`abn-${j.slug}`, title:j.title, company:j.company_name||"",
              location:j.location||"Remote", url:j.url,
              source:"Arbeitnow", sourceColor:"#f77f00",
              date:j.created_at?new Date(j.created_at*1000).toISOString().split("T")[0]:"",
              salary:"", type:(j.job_types||[]).join(", "),
              tags:(j.tags||[]).slice(0,4),
            }));
        }
      },
    ];

    await Promise.allSettled(sources.map(async src=>{
      try{
        const r=await fetch(src.url);
        if(!r.ok) throw new Error("HTTP "+r.status);
        const data=await r.json();
        allJobs.push(...src.map(data));
      }catch(e){ errors.push(src.name); }
    }));

    // Filter by keyword (client-side refinement)
    let results=allJobs;
    const kw=keyword.toLowerCase();
    const kwFiltered=allJobs.filter(j=>
      j.title.toLowerCase().includes(kw)||
      j.company.toLowerCase().includes(kw)||
      (j.tags||[]).some(t=>t.toLowerCase().includes(kw))
    );
    if(kwFiltered.length>0) results=kwFiltered;

    // Filter by job type
    if(jobType){
      const ft=jobType.toLowerCase();
      const typed=results.filter(j=>
        (j.type||"").toLowerCase().includes(ft)||
        (ft==="remote"&&(j.location||"").toLowerCase().includes("remote"))
      );
      if(typed.length>0) results=typed;
    }

    // Deduplicate by title+company
    const seen=new Set();
    results=results.filter(j=>{
      const key=(j.title+"|"+j.company).toLowerCase();
      if(seen.has(key)) return false;
      seen.add(key); return true;
    });

    // Sort newest first
    results.sort((a,b)=>(b.date||"").localeCompare(a.date||""));
    return {jobs:results, errors};
  }

  function timeAgo(dateStr){
    if(!dateStr) return "";
    const diff=Math.floor((Date.now()-new Date(dateStr))/(1000*60*60*24));
    if(diff===0) return "Today";
    if(diff===1) return "Yesterday";
    if(diff<7)   return diff+"d ago";
    if(diff<31)  return Math.floor(diff/7)+"w ago";
    return Math.floor(diff/30)+"mo ago";
  }

  function renderJobCards(jobs, errors){
    const area=$("jobs-results-area");
    area.innerHTML="";

    if(errors.length>0 && jobs.length===0){
      area.innerHTML=
        `<div class="jobs-error-banner">Could not reach job APIs (${errors.join(", ")}). `+
        `Use the portal links below to search on LinkedIn, Dice, and Indeed directly.</div>`;
      return;
    }

    const badge=$("jobs-live-badge");
    if(badge) badge.classList.remove("hidden");

    // Source summary strip
    const sources=[...new Set(jobs.map(j=>j.source))];
    const strip=document.createElement("div");
    strip.className="jobs-source-strip";
    strip.innerHTML=
      `<span class="jss-count"><strong>${jobs.length}</strong> CISSP-related jobs</span>`+
      sources.map(s=>`<span class="jss-src">${s}</span>`).join("")+
      (errors.length?`<span class="jss-err">${errors.join(", ")} unavailable</span>`:"")+
      `<span class="jss-note">Remote &amp; global listings — add location filter to portals below for on-site roles</span>`;
    area.appendChild(strip);

    if(jobs.length===0){
      const empty=document.createElement("div");
      empty.className="jobs-empty";
      empty.innerHTML="No matching jobs found. Try a broader keyword or use the portal links below.";
      area.appendChild(empty);
      return;
    }

    const grid=document.createElement("div");
    grid.className="jobs-card-grid";

    jobs.forEach(job=>{
      const card=document.createElement("div");
      card.className="job-card";
      const age=timeAgo(job.date);
      const salaryHtml=job.salary?`<span class="jc-salary">${job.salary}</span>`:"";
      const typeHtml=job.type?`<span class="jc-type">${job.type}</span>`:"";
      const tagsHtml=(job.tags||[]).length
        ?`<div class="jc-tags">${job.tags.slice(0,4).map(t=>`<span class="jc-tag">${t}</span>`).join("")}</div>`:"";

      card.innerHTML=
        `<div class="jc-header">`+
          `<div class="jc-title">${job.title}</div>`+
          `<a href="${job.url}" target="_blank" rel="noopener" class="jc-apply-btn">View Job \u2197</a>`+
        `</div>`+
        `<div class="jc-meta">`+
          `<span class="jc-company">${job.company||"\u2014"}</span>`+
          `<span class="jc-dot">\u00B7</span>`+
          `<span class="jc-location">\uD83D\uDCCD ${job.location}</span>`+
        `</div>`+
        `<div class="jc-details">`+
          salaryHtml+typeHtml+
          (age?`<span class="jc-age">${age}</span>`:"")+
          `<span class="jc-source-badge" style="background:${job.sourceColor}20;color:${job.sourceColor};border:1px solid ${job.sourceColor}40">${job.source}</span>`+
          `<button type="button" class="jc-track-btn" title="Track this job">+ Track</button>`+
        `</div>`+
        tagsHtml;

      // Wire Track button
      card.querySelector(".jc-track-btn").addEventListener("click",()=>{
        const list=loadSavedJobs();
        if(list.some(j=>j.url===job.url)){ alert("Already in your tracker."); return; }
        list.unshift({
          id:Date.now().toString(), title:job.title, company:job.company,
          source:job.source, status:"bookmarked", url:job.url,
          notes:"", added:new Date().toLocaleDateString(),
        });
        persistSavedJobs(list);
        card.querySelector(".jc-track-btn").textContent="\u2713 Tracked";
        card.querySelector(".jc-track-btn").disabled=true;
        renderSavedJobsList();
      });

      grid.appendChild(card);
    });
    area.appendChild(grid);
  }

  function renderJobsView(){
    // Wire Back button
    const back=$("jobs-back");
    if(back&&!back.dataset.wired){
      back.dataset.wired="1";
      back.addEventListener("click",()=>showView("view-home"));
    }

    // Wire Search button
    const searchBtn=$("btn-search-jobs");
    if(searchBtn&&!searchBtn.dataset.wired){
      searchBtn.dataset.wired="1";
      searchBtn.addEventListener("click",()=>doJobSearch());
      $("job-keyword").addEventListener("keydown",e=>{ if(e.key==="Enter") doJobSearch(); });
    }

    // Portal grid (inside the <details>)
    const grid=$("jobs-portal-grid");
    if(grid&&!grid.dataset.rendered){
      grid.dataset.rendered="1";
      JOB_PORTALS.forEach(p=>{
        const card=document.createElement("div");
        card.className="jobs-portal-card";
        card.innerHTML=
          `<div class="jpc-icon" style="background:${p.color}">${p.abbr}</div>`+
          `<div class="jpc-info"><div class="jpc-name">${p.name}</div><div class="jpc-desc">${p.desc}</div></div>`+
          `<button type="button" class="jpc-btn">Search \u2192</button>`;
        card.querySelector(".jpc-btn").addEventListener("click",()=>{
          const title=($("job-role")||{value:"CISSP"}).value||"CISSP";
          const loc  =($("job-location")||{value:""}).value.trim();
          const type =($("job-type")||{value:""}).value;
          window.open(p.url(title,loc,type),"_blank","noopener");
        });
        grid.appendChild(card);
      });

      const qrow=$("jobs-quick-row");
      if(qrow){
        QUICK_SEARCHES.forEach(qs=>{
          const btn=document.createElement("button");
          btn.type="button"; btn.className="jobs-quick-btn"; btn.textContent=qs;
          btn.addEventListener("click",()=>{
            const loc=($("job-location")||{value:""}).value.trim();
            const tp =($("job-type")||{value:""}).value;
            [JOB_PORTALS[0],JOB_PORTALS[1],JOB_PORTALS[2]].forEach(p=>
              window.open(p.url(qs,loc,tp),"_blank","noopener")
            );
          });
          qrow.appendChild(btn);
        });
      }
    }

    // Job tracker
    const addBtn=$("btn-add-saved-job");
    const form=$("add-job-form");
    if(addBtn&&!addBtn.dataset.wired){
      addBtn.dataset.wired="1";
      addBtn.addEventListener("click",()=>form.classList.toggle("hidden"));
      $("aj-cancel").addEventListener("click",()=>form.classList.add("hidden"));
      $("aj-save").addEventListener("click",()=>{
        const title=$("aj-title").value.trim();
        if(!title){ alert("Please enter a job title."); return; }
        const list=loadSavedJobs();
        list.unshift({
          id:Date.now().toString(), title,
          company:$("aj-company").value.trim(), source:$("aj-source").value.trim(),
          status:$("aj-status").value, url:$("aj-url").value.trim(),
          notes:$("aj-notes").value.trim(), added:new Date().toLocaleDateString(),
        });
        persistSavedJobs(list);
        ["aj-title","aj-company","aj-source","aj-url","aj-notes"].forEach(id=>{$(id).value="";});
        form.classList.add("hidden");
        renderSavedJobsList();
      });
    }
    renderSavedJobsList();

    // Auto-fetch on first open
    if(!$("jobs-results-area").dataset.fetched){
      doJobSearch();
    }
  }

  async function doJobSearch(){
    const keyword=($("job-keyword")||{value:"CISSP"}).value||"CISSP";
    const jobType=($("job-type")||{value:""}).value;
    const area=$("jobs-results-area");
    area.dataset.fetched="1";
    area.innerHTML=
      `<div class="jobs-loading">`+
        `<div class="jobs-spinner"></div>`+
        `<p>Fetching live CISSP jobs from Remotive, Jobicy &amp; Arbeitnow\u2026</p>`+
      `</div>`;
    const badge=$("jobs-live-badge");
    if(badge) badge.classList.add("hidden");
    const {jobs,errors}=await fetchCISSPJobs(keyword,jobType);
    renderJobCards(jobs,errors);
  }

  function renderSavedJobsList(){
    const host=$("saved-jobs-list");
    if(!host) return;
    const list=loadSavedJobs();
    if(list.length===0){
      host.innerHTML=`<p style="color:var(--muted);font-size:0.85rem;padding:0.75rem 0">No jobs tracked yet. Click \u201c+ Track a job\u201d or the \u201c+ Track\u201d button on any listing.</p>`;
      return;
    }
    host.innerHTML="";
    list.forEach(job=>{
      const sm=JOB_STATUS_META[job.status]||JOB_STATUS_META.bookmarked;
      const row=document.createElement("div");
      row.className="saved-job-row";
      row.innerHTML=
        `<div class="sjr-main">`+
          `<span class="sjr-title">${job.title}</span>`+
          (job.company?`<span class="sjr-company">${job.company}</span>`:"")+
          (job.source?`<span class="sjr-source">${job.source}</span>`:"")+
          `<span class="sjr-status ${sm.cls}">${sm.label}</span>`+
          `<span class="sjr-date">${job.added||""}</span>`+
        `</div>`+
        (job.notes?`<div class="sjr-notes">${job.notes}</div>`:"")+
        `<div class="sjr-actions">`+
          (job.url?`<a href="${job.url}" target="_blank" rel="noopener" class="sjr-link">Open posting \u2197</a>`:"")+
          `<select class="sjr-status-sel" data-id="${job.id}">`+
            Object.entries(JOB_STATUS_META).map(([v,m])=>
              `<option value="${v}"${job.status===v?" selected":""}>${m.label}</option>`
            ).join("")+
          `</select>`+
          `<button type="button" class="sjr-del" data-id="${job.id}">Delete</button>`+
        `</div>`;
      row.querySelector(".sjr-status-sel").addEventListener("change",e=>{
        const jobs=loadSavedJobs();
        const j=jobs.find(x=>x.id===e.target.dataset.id);
        if(j){ j.status=e.target.value; persistSavedJobs(jobs); renderSavedJobsList(); }
      });
      row.querySelector(".sjr-del").addEventListener("click",e=>{
        if(!confirm("Remove this job from your tracker?")) return;
        persistSavedJobs(loadSavedJobs().filter(x=>x.id!==e.target.dataset.id));
        renderSavedJobsList();
      });
      host.appendChild(row);
    });
  }

    // ── Resume view ───────────────────────────────────────────────────

  // ── PDF.js worker (loaded from CDN via index.html) ──────────────
  (function initPDFWorker() {
    if (typeof pdfjsLib !== "undefined") {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }
  })();

  // Safely escape HTML for injection into print windows
  function _escHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Convert raw PDF text lines into semantic HTML for the resume editor
  function _linesToEditorHTML(lines) {
    const SECTION_RE = /^(SUMMARY|PROFESSIONAL SUMMARY|CAREER SUMMARY|EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT HISTORY|EDUCATION|ACADEMIC|SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|KEY SKILLS|CERTIFICATIONS|CERTIFICATES|ACHIEVEMENTS|PROJECTS|PUBLICATIONS|AWARDS|VOLUNTEER|REFERENCES|OBJECTIVE|PROFILE|CONTACT|LANGUAGES|INTERESTS)(\s+\S.*)?$/i;
    const parts = [];
    let inList = false;

    lines.forEach((raw, idx) => {
      const line = raw.trim();
      if (!line) {
        if (inList) { parts.push("</ul>"); inList = false; }
        return;
      }
      // First non-empty line treated as name (H1)
      const isFirstContent = idx === 0 || !lines.slice(0, idx).some(l => l.trim());
      if (isFirstContent && line.length < 70 && !/[@:]/.test(line)) {
        parts.push(`<h1>${_escHTML(line)}</h1>`);
        return;
      }
      // Section headers: all-caps or known section names
      const isAllCaps = line === line.toUpperCase() && line.length > 1 && line.length < 55 && /[A-Z]/.test(line);
      if (isAllCaps || SECTION_RE.test(line)) {
        if (inList) { parts.push("</ul>"); inList = false; }
        parts.push(`<h2>${_escHTML(line)}</h2>`);
        return;
      }
      // Bullet points
      if (/^[•\-·*–]\s*/.test(line)) {
        if (!inList) { parts.push("<ul>"); inList = true; }
        parts.push(`<li>${_escHTML(line.replace(/^[•\-·*–]\s*/, ""))}</li>`);
        return;
      }
      // Contact / meta info (short lines with @, |, phone patterns)
      if (line.length < 120 && /[@|,]|linkedin|github|\d{3}[-.\s]\d{3}/i.test(line)) {
        if (inList) { parts.push("</ul>"); inList = false; }
        parts.push(`<p><em>${_escHTML(line)}</em></p>`);
        return;
      }
      // Default paragraph
      if (inList) { parts.push("</ul>"); inList = false; }
      parts.push(`<p>${_escHTML(line)}</p>`);
    });
    if (inList) parts.push("</ul>");
    return parts.join("\n");
  }

  // Extract text lines from a PDF File using PDF.js
  async function _extractPDFLines(file, onProgress) {
    if (typeof pdfjsLib === "undefined") throw new Error("PDF.js not available");
    const buf  = await file.arrayBuffer();
    const pdf  = await pdfjsLib.getDocument({ data: buf }).promise;
    const total = pdf.numPages;
    const allLines = [];

    for (let p = 1; p <= total; p++) {
      if (onProgress) onProgress(p, total);
      const page    = await pdf.getPage(p);
      const content = await page.getTextContent();

      // Reconstruct text lines by grouping items with the same Y coordinate
      const yMap = new Map();
      content.items.forEach(item => {
        if (!item.str) return;
        const y = Math.round(item.transform[5]);
        if (!yMap.has(y)) yMap.set(y, []);
        yMap.get(y).push({ x: item.transform[4], str: item.str });
      });

      // Sort rows top-to-bottom (larger Y = higher on page in PDF coord space)
      [...yMap.keys()]
        .sort((a, b) => b - a)
        .forEach(y => {
          const rowStr = yMap.get(y)
            .sort((a, b) => a.x - b.x)
            .map(r => r.str)
            .join(" ")
            .replace(/\s{2,}/g, " ")
            .trim();
          if (rowStr) allLines.push(rowStr);
        });

      if (p < total) allLines.push(""); // blank line between pages
    }
    return allLines;
  }

  // ── Keyword tracking (populated by analyzeJobMatch) ──────────────
  let _lastMissingKws = [];
  let _lastFoundKws   = [];

  const CISSP_KEYWORDS = [
    // D1 — Security & Risk Management
    "Risk Management","Risk Assessment","Risk Mitigation","Risk Register","NIST",
    "ISO 27001","ISO 27002","SOC 2","HIPAA","PCI DSS","GDPR","FedRAMP","FISMA",
    "COBIT","Security Policy","Security Governance","GRC","Compliance","BCP",
    "Disaster Recovery","Business Continuity","DRP","Third Party Risk","Vendor Risk",
    // D2 — Asset Security
    "Data Classification","Data Governance","Information Lifecycle","Data Retention",
    "DLP","Data Loss Prevention","Asset Management","Data Handling",
    // D3 — Security Architecture & Engineering
    "Security Architecture","Zero Trust","Defense in Depth","Security by Design",
    "Threat Modeling","SABSA","Cloud Architecture","Cryptography","PKI",
    "Certificate Management","Encryption","AES","RSA","TLS","SSL","HSM",
    // D4 — Communication & Network Security
    "Network Security","Firewall","IDS","IPS","VPN","DMZ","WAF","SASE","SD-WAN",
    "Network Segmentation","Microsegmentation","Zero Trust Network","TCP/IP","DNS Security",
    // D5 — Identity & Access Management
    "Identity and Access Management","IAM","Privileged Access Management","PAM",
    "MFA","Multi-Factor Authentication","SSO","Single Sign-On","RBAC","ABAC",
    "OAuth","SAML","Active Directory","LDAP","CyberArk","Okta","Azure AD",
    // D6 — Security Assessment & Testing
    "Penetration Testing","Vulnerability Assessment","Vulnerability Management",
    "DAST","SAST","Security Testing","Red Team","Blue Team","Purple Team",
    "MITRE ATT&CK","Kill Chain","Threat Hunting","Attack Surface",
    "Bug Bounty","Nessus","Qualys","Rapid7",
    // D7 — Security Operations
    "Security Operations","SOC","SIEM","Splunk","QRadar","ArcSight",
    "Incident Response","Digital Forensics","DFIR","Malware Analysis",
    "Threat Intelligence","Security Monitoring","Log Analysis","EDR","XDR",
    "SOAR","Palo Alto","CrowdStrike",
    // D8 — Software Development Security
    "SDLC","Secure SDLC","DevSecOps","Secure Coding","Code Review",
    "OWASP","Application Security","API Security","CI/CD","GitHub Actions",
    "Container Security","Kubernetes","Docker Security",
    // Certifications
    "CISSP","CISM","CEH","CCSP","CISA","Security+","OSCP","AWS Security",
    "Azure Security","GCP Security","CCNA Security",
    // Leadership / cross-cutting
    "Security Awareness","Security Program","Security Strategy",
    "Supply Chain Security","Zero Trust Architecture","Cloud Security Posture",
    "CASB","CSPM","Security Engineering",
  ];

  const LS_RESUME_DRAFT = "cissp_resume_draft_v1";

  function saveResumeDraft() {
    const html = $("resume-editor") ? $("resume-editor").innerHTML : "";
    localStorage.setItem(LS_RESUME_DRAFT, html);
  }

  function loadResumeDraft() {
    return localStorage.getItem(LS_RESUME_DRAFT) || "";
  }

  function updateWordCount() {
    const wc = $("resume-word-count");
    const editor = $("resume-editor");
    if (!wc || !editor) return;
    const words = (editor.innerText || "").trim().split(/\s+/).filter(Boolean).length;
    wc.textContent = `${words} word${words !== 1 ? "s" : ""}`;
  }

  function downloadResumeTxt() {
    const editor = $("resume-editor");
    if (!editor) return;
    const text = editor.innerText || "";
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "cissp_resume.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function printResumeAsPDF() {
    const editor = $("resume-editor");
    if (!editor) return;
    const html = editor.innerHTML;
    const w = window.open("", "_blank");
    if (!w) { alert("Please allow pop-ups to save as PDF."); return; }
    w.document.write(
      `<!DOCTYPE html><html><head><title>CISSP Resume</title><style>` +
      `*{box-sizing:border-box}` +
      `body{font-family:'Georgia',serif;max-width:780px;margin:40px auto;color:#111;font-size:11pt;line-height:1.55;padding:0 24px}` +
      `h1{font-size:20pt;margin:0 0 4px}h2{font-size:13pt;border-bottom:1px solid #333;padding-bottom:3px;margin:18px 0 6px}` +
      `h3{font-size:11pt;margin:10px 0 4px}p{margin:3px 0}ul,ol{margin:4px 0 4px 18px}li{margin:2px 0}` +
      `@media print{body{margin:0;padding:12px}@page{margin:1.5cm}}` +
      `</style></head><body>${html}</body></html>`
    );
    w.document.close();
    w.setTimeout(() => w.print(), 400);
  }

  function analyzeJobMatch() {
    const desc    = ($("resume-job-desc").value || "").toLowerCase();
    const resume  = ($("resume-editor").innerText || "").toLowerCase();
    const results = $("job-analysis-results");
    const akPanel = $("add-keywords-panel");
    const akList  = $("akp-list");

    if (!desc.trim()) { alert("Please paste a job description first."); return; }
    if (!resume.trim()) { alert("Please add your resume text first."); return; }

    const found   = [];
    const missing = [];

    CISSP_KEYWORDS.forEach(kw => {
      if (desc.includes(kw.toLowerCase())) {
        (resume.includes(kw.toLowerCase()) ? found : missing).push(kw);
      }
    });

    const total  = found.length + missing.length;
    const score  = total > 0 ? Math.round((found.length / total) * 100) : 0;
    const sClass = score >= 75 ? "match-great" : score >= 50 ? "match-good" : "match-poor";

    results.classList.remove("hidden");
    results.innerHTML =
      `<div class="match-score-row">` +
        `<div class="match-score-circle ${sClass}">${score}%</div>` +
        `<div class="match-score-info">` +
          `<div class="match-score-label">${score >= 75 ? "Strong Match" : score >= 50 ? "Partial Match" : "Needs Work"}</div>` +
          `<div class="match-score-sub">${found.length} of ${total} required keywords found in your resume</div>` +
        `</div>` +
      `</div>` +
      (found.length > 0
        ? `<div class="match-section-head match-found-head">&#x2705; Present in your resume (${found.length})</div>` +
          `<div class="match-kw-list">${found.map(k => `<span class="mkw mkw-ok">${k}</span>`).join("")}</div>`
        : "") +
      (missing.length > 0
        ? `<div class="match-section-head match-missing-head">&#x26A0; Missing from your resume (${missing.length})</div>` +
          `<div class="match-kw-list">${missing.map(k => `<span class="mkw mkw-miss">${k}</span>`).join("")}</div>`
        : "");

    // Store for optimised-resume generator
    _lastMissingKws = missing;
    _lastFoundKws   = found;

    // Show/hide the generate-optimised button
    const genBtn = $("btn-generate-optimized");
    if (genBtn) {
      if (total > 0) {
        genBtn.classList.remove("hidden");
        genBtn.textContent = `🚀 Generate Optimized Resume PDF  (${missing.length} keywords added)`;
      } else {
        genBtn.classList.add("hidden");
      }
    }

    // Suggestions panel
    if (missing.length > 0) {
      akPanel.classList.remove("hidden");
      akList.innerHTML = missing.map(kw =>
        `<label class="akp-item"><input type="checkbox" class="akp-cb" value="${kw}" checked /> ${kw}</label>`
      ).join("");
    } else {
      akPanel.classList.add("hidden");
    }
  }

  function applyKeywordsToResume() {
    const checked = Array.from(document.querySelectorAll(".akp-cb:checked")).map(cb => cb.value);
    if (checked.length === 0) { alert("No keywords selected."); return; }
    const editor = $("resume-editor");
    // Append a "Key Skills" section if not already ending with one
    const existing = editor.innerHTML;
    const addSection =
      `<h2>Additional CISSP Skills</h2>` +
      `<p>${checked.join(" &bull; ")}</p>`;
    editor.innerHTML = existing + "\n" + addSection;
    updateWordCount();
    saveResumeDraft();
    $("add-keywords-panel").classList.add("hidden");
    editor.scrollTop = editor.scrollHeight;
  }

  function generateOptimizedResumePDF() {
    const editor  = $("resume-editor");
    const jobDesc = ($("resume-job-desc") ? $("resume-job-desc").value : "") || "";

    if (!editor || !editor.innerText.trim()) {
      alert("Please add your resume content first."); return;
    }
    if (!jobDesc.trim()) {
      alert("Please paste a job description and click 'Analyze Match' first."); return;
    }

    const resumeText = editor.innerText.toLowerCase();
    const missing    = _lastMissingKws.filter(kw => !resumeText.includes(kw.toLowerCase()));
    const found      = _lastFoundKws;
    const total      = found.length + missing.length;
    const score      = total > 0 ? Math.round((found.length / total) * 100) : 0;

    // Derive job title from first non-empty line of job description
    const jobTitle = jobDesc.split("\n").map(l => l.trim()).find(Boolean) || "CISSP Security Position";

    let resumeHTML = editor.innerHTML;

    // ── Smart additions ─────────────────────────────────────────────
    let additions = "";

    // 1. Professional Summary — inject if not present
    if (!resumeText.match(/\b(summary|profile|objective|about me)\b/i) && missing.length > 0) {
      const summaryKws = missing.slice(0, 5).join(", ");
      additions +=
        `<h2>Professional Summary</h2>` +
        `<p>Results-driven cybersecurity professional with expertise in ${summaryKws}. ` +
        `Demonstrated ability to design and manage security programs aligned with business objectives, ` +
        `regulatory requirements, and the CISSP Common Body of Knowledge.</p>`;
    }

    // 2. Core Competencies — add missing keywords in two-column list
    if (missing.length > 0) {
      const hasSkills = resumeText.match(/\b(skills|competencies|capabilities|proficiencies)\b/i);
      const sectionTitle = hasSkills ? "Additional Security Competencies (Job-Matched)" : "Core Security Competencies";
      additions +=
        `<h2>${sectionTitle}</h2>` +
        `<ul class="comp-grid">${missing.map(kw => `<li>${_escHTML(kw)}</li>`).join("")}</ul>`;
    }

    // ── Print window styling ─────────────────────────────────────────
    const scoreColor = score >= 75 ? "#1a7a3c" : score >= 50 ? "#b86800" : "#c0392b";
    const scoreBg    = score >= 75 ? "#e6f9ec" : score >= 50 ? "#fff8e6" : "#fff0f0";
    const scoreBorder= score >= 75 ? "#a3d9b1" : score >= 50 ? "#f0c060" : "#f0a0a0";

    const w = window.open("", "_blank");
    if (!w) { alert("Allow pop-ups in your browser to generate the PDF."); return; }

    w.document.write(`<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<title>Optimized Resume — CISSP Prep Lab</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Georgia','Times New Roman',serif;max-width:820px;margin:0 auto;
       color:#1a1a1a;font-size:10.5pt;line-height:1.65;padding:36px 44px}
  h1{font-size:22pt;color:#0f1b35;font-family:'Arial','Helvetica',sans-serif;
     margin:0 0 4px;letter-spacing:-0.3px}
  h2{font-size:9.5pt;text-transform:uppercase;letter-spacing:1.8px;
     color:#1a56a0;border-bottom:1.5px solid #1a56a0;padding-bottom:3px;
     margin:20px 0 8px;font-family:'Arial','Helvetica',sans-serif;font-weight:700}
  h3{font-size:10.5pt;font-weight:700;margin:10px 0 2px;color:#222}
  p{margin:3px 0;color:#333}
  em{color:#555;font-style:normal}
  ul{margin:4px 0 4px 18px}
  li{margin:2px 0;color:#333}
  ul.comp-grid{columns:2;column-gap:1.5rem;list-style:disc;margin-left:18px}
  ul.comp-grid li{break-inside:avoid}
  .opt-banner{background:${scoreBg};border:1px solid ${scoreBorder};border-radius:6px;
    padding:9px 14px;margin-bottom:20px;font-family:'Arial',sans-serif;font-size:8.5pt;color:#1a56a0}
  .opt-banner strong{color:#0f3a8a}
  .score-badge{display:inline-block;background:${scoreBg};color:${scoreColor};
    border:1px solid ${scoreBorder};padding:1px 10px;border-radius:20px;
    font-weight:700;font-size:9pt;margin-left:6px}
  .footer-note{margin-top:28px;font-size:7.5pt;color:#aaa;
    font-family:'Arial',sans-serif;border-top:1px solid #eee;padding-top:8px}
  @media print{
    .opt-banner,.footer-note{display:none}
    body{padding:0;margin:0 auto}
    @page{margin:1.8cm;size:letter}
  }
</style>
</head>
<body>
<div class="opt-banner">
  <strong>🚀 CISSP Prep Lab — Optimized Resume</strong>
  <span class="score-badge">${score}% match</span>
  &nbsp;·&nbsp; Tailored for: <em>${_escHTML(jobTitle.slice(0, 80))}</em>
  &nbsp;·&nbsp; ${missing.length} missing keyword${missing.length !== 1 ? "s" : ""} added
  &nbsp;·&nbsp; <em>Use Ctrl+P / Cmd+P to save as PDF</em>
</div>
${resumeHTML}
${additions}
<p class="footer-note">Generated by CISSP Prep Lab · Resume Optimizer · ${new Date().toLocaleDateString()}</p>
</body></html>`);
    w.document.close();
    w.setTimeout(() => w.print(), 600);
  }

  function renderResumeView() {
    const editor = $("resume-editor");
    const back   = $("resume-back");

    // Load saved draft once
    if (editor && !editor.dataset.loaded) {
      editor.dataset.loaded = "1";
      const draft = loadResumeDraft();
      if (draft) editor.innerHTML = draft;
      editor.addEventListener("input", () => { updateWordCount(); saveResumeDraft(); });
      updateWordCount();
    }

    if (back && !back.dataset.wired) {
      back.dataset.wired = "1";
      back.addEventListener("click", () => { saveResumeDraft(); showView("view-home"); });
    }

    // Toolbar buttons
    document.querySelectorAll(".rtb[data-cmd]").forEach(btn => {
      if (btn.dataset.wired) return;
      btn.dataset.wired = "1";
      btn.addEventListener("click", () => {
        const val = btn.dataset.val || null;
        document.execCommand(btn.dataset.cmd, false, val);
        $("resume-editor").focus();
      });
    });

    // Upload — supports both PDF and plain-text files
    const uploadInput = $("resume-file-input");
    const uploadBtn   = $("btn-resume-upload");
    if (uploadBtn && !uploadBtn.dataset.wired) {
      uploadBtn.dataset.wired = "1";
      uploadBtn.addEventListener("click", () => uploadInput.click());

      uploadInput.addEventListener("change", async e => {
        const file = e.target.files[0];
        uploadInput.value = "";
        if (!file) return;

        if (file.name.match(/\.pdf$/i)) {
          // ── PDF path ───────────────────────────────────────────────
          const statusEl = $("pdf-parse-status");
          const fillEl   = $("pdf-parse-fill");
          const msgEl    = $("pdf-parse-msg");

          if (statusEl) { statusEl.classList.remove("hidden"); }
          if (msgEl)    { msgEl.textContent = "Reading PDF…"; }
          if (fillEl)   { fillEl.style.width = "0%"; }

          if (typeof pdfjsLib === "undefined") {
            if (msgEl) msgEl.textContent = "⚠ PDF.js library failed to load. Please refresh the page and try again.";
            return;
          }

          try {
            const lines = await _extractPDFLines(file, (p, total) => {
              const pct = Math.round((p / total) * 100);
              if (fillEl) fillEl.style.width = pct + "%";
              if (msgEl)  msgEl.textContent  = `Parsing page ${p} of ${total}…`;
            });

            editor.innerHTML = _linesToEditorHTML(lines);
            updateWordCount();
            saveResumeDraft();

            if (msgEl) msgEl.textContent = `✓ PDF loaded — ${lines.filter(Boolean).length} lines extracted`;
            if (fillEl) fillEl.style.width = "100%";
            setTimeout(() => {
              if (statusEl) statusEl.classList.add("hidden");
            }, 3000);
          } catch (err) {
            console.error("PDF parse error:", err);
            if (msgEl) msgEl.textContent = "⚠ Could not read this PDF. Try copying its text and pasting into the editor.";
            if (fillEl) fillEl.style.background = "var(--danger, #e74c3c)";
          }

        } else if (file.name.match(/\.(txt|text|md)$/i)) {
          // ── Plain-text path ────────────────────────────────────────
          const reader = new FileReader();
          reader.onload = ev => {
            editor.innerText = ev.target.result;
            updateWordCount();
            saveResumeDraft();
          };
          reader.readAsText(file);

        } else {
          alert("Please upload a PDF or .txt / .md file.");
        }
      });
    }

    // Action buttons
    const wireOnce = (id, fn) => {
      const el = $(id);
      if (el && !el.dataset.wired) { el.dataset.wired = "1"; el.addEventListener("click", fn); }
    };
    wireOnce("btn-resume-save",         () => { saveResumeDraft(); const b = $("btn-resume-save"); b.textContent = "✓ Saved"; setTimeout(() => { b.textContent = "💾 Save Draft"; }, 1500); });
    wireOnce("btn-resume-dl-txt",       downloadResumeTxt);
    wireOnce("btn-resume-print",        printResumeAsPDF);
    wireOnce("btn-analyze-job",         analyzeJobMatch);
    wireOnce("btn-apply-keywords",      applyKeywordsToResume);
    wireOnce("btn-generate-optimized",  generateOptimizedResumePDF);
  }

  // ── Voice Mode ───────────────────────────────────────────────────

  const VS = {            // voice status type → icon + bar class
    idle:      { icon: "🎙", cls: "vs-idle" },
    reading:   { icon: "🔊", cls: "vs-reading" },
    listening: { icon: "🎤", cls: "vs-listening" },
    thinking:  { icon: "💭", cls: "vs-thinking" },
    correct:   { icon: "✅", cls: "vs-correct" },
    wrong:     { icon: "❌", cls: "vs-wrong" },
    error:     { icon: "⚠️", cls: "vs-error" },
  };

  function setVoiceStatus(type, text, transcript) {
    const bar  = $("voice-status-bar");
    const ico  = $("vs-icon");
    const txt  = $("vs-text");
    const trs  = $("vs-transcript");
    const ring = $("vs-ring");
    if (!bar) return;
    const s = VS[type] || VS.idle;
    bar.className = "voice-status-bar " + s.cls;
    if (ico) ico.textContent = s.icon;
    if (txt) txt.textContent = text || "";
    if (trs) trs.textContent = transcript ? `"${transcript}"` : "";
    if (ring) ring.className = "vs-ring" + (["reading","listening"].includes(type) ? " vs-ring-pulse" : "");
    // Update toggle button appearance
    const btn = $("btn-toggle-voice");
    if (btn) btn.classList.toggle("voice-active", state.voiceMode);
  }

  /** Speak text using TTS, call onEnd when done. */
  function speak(text, onEnd) {
    const synth = window.speechSynthesis;
    if (!synth) { if (onEnd) onEnd(); return; }
    synth.cancel();
    state.voiceSpeaking = true;
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang   = "en-US";
    utt.rate   = 0.88;
    utt.pitch  = 1.0;
    utt.volume = 1.0;
    utt.onend  = () => { state.voiceSpeaking = false; if (onEnd) onEnd(); };
    utt.onerror = () => { state.voiceSpeaking = false; if (onEnd) onEnd(); };
    // Chrome bug: speech pauses after ~15 s — keep it awake
    const keepAlive = setInterval(() => {
      if (!state.voiceSpeaking) { clearInterval(keepAlive); return; }
      synth.pause(); synth.resume();
    }, 10000);
    utt.onend = () => { clearInterval(keepAlive); state.voiceSpeaking = false; if (onEnd) onEnd(); };
    synth.speak(utt);
  }

  /** Stop any TTS or STT in progress. */
  function stopVoice() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (state.voiceRecog) {
      try { state.voiceRecog.abort(); } catch (e) {}
      state.voiceRecog = null;
    }
    state.voiceSpeaking = false;
    state.voiceListening = false;
    setVoiceStatus("idle", "Stopped.");
  }

  /** Parse spoken transcript → 0-3 answer index, or -1 if unrecognised. */
  function parseVoiceAnswer(t) {
    t = t.toLowerCase().trim();
    const patterns = [
      [0, /^a$|\ba\b|option a|answer a|choice a|letter a|first/],
      [1, /^b$|\bb\b|option b|answer b|choice b|letter b|second/],
      [2, /^c$|\bc\b|option c|answer c|choice c|letter c|third/],
      [3, /^d$|\bd\b|option d|answer d|choice d|letter d|fourth/],
    ];
    for (const [idx, rx] of patterns) {
      if (rx.test(t)) return idx;
    }
    const m = t.match(/\b([abcd])\b/);
    return m ? "abcd".indexOf(m[1]) : -1;
  }

  /** Build the full question + options speech string. */
  function buildQuestionSpeech(q, idx) {
    const letters = ["A", "B", "C", "D"];
    return `Question ${idx + 1}. ${q.text}. ` +
      `Option A: ${q.choices[0]}. ` +
      `Option B: ${q.choices[1]}. ` +
      `Option C: ${q.choices[2]}. ` +
      `Option D: ${q.choices[3]}. ` +
      `Please say A, B, C, or D.`;
  }

  /** Process a recognised answer index from voice or manual trigger. */
  function handleVoiceAnswer(ansIdx) {
    const q = state.questions[state.index];
    if (!q) return;
    const letters = ["A","B","C","D"];
    // Record answer in state
    state.answers[state.index] = ansIdx;
    renderQuestion(); // refresh choice highlights

    const correct = (ansIdx === q.correctIndex);
    const chosen  = letters[ansIdx];
    const right   = letters[q.correctIndex];

    if (correct) {
      setVoiceStatus("correct", `Correct! "${chosen}" is right.`);
      speak(
        `Correct! ${chosen} is the right answer. ${q.explanation || "Well done."}`,
        () => setVoiceStatus("correct", `✅ Correct! "${chosen}" — click Next to continue.`)
      );
    } else {
      setVoiceStatus("wrong", `Incorrect. You said ${chosen}. Answer is ${right}.`);
      const explain =
        `Incorrect. You chose ${chosen}: "${q.choices[ansIdx]}". ` +
        `The correct answer is ${right}: "${q.choices[q.correctIndex]}". ` +
        (q.explanation ? `Here is why: ${q.explanation}` : "");
      speak(
        explain,
        () => setVoiceStatus("wrong",
          `❌ Wrong — correct answer is ${right}. Click Next to continue.`)
      );
    }
  }

  /** Start listening for a spoken answer. */
  function doVoiceListen() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setVoiceStatus("error", "Speech recognition needs Chrome, Edge, or Safari.");
      return;
    }
    if (state.voiceListening) return;
    state.voiceListening = true;
    setVoiceStatus("listening", "Listening… say A, B, C, or D");

    const recog = new SR();
    state.voiceRecog = recog;
    recog.lang = "en-US";
    recog.continuous = false;
    recog.interimResults = false;
    recog.maxAlternatives = 5;

    recog.onresult = e => {
      state.voiceListening = false;
      state.voiceRecog = null;
      let ansIdx = -1, heard = "";
      for (let i = 0; i < e.results[0].length; i++) {
        heard   = e.results[0][i].transcript;
        ansIdx  = parseVoiceAnswer(heard);
        if (ansIdx !== -1) break;
      }
      if (ansIdx === -1) {
        setVoiceStatus("error", `Heard "${heard}" — couldn't match A/B/C/D. Try again.`, heard);
        speak(`I heard "${heard}". Please say A, B, C, or D.`);
        return;
      }
      setVoiceStatus("thinking", `Heard "${heard}" → ${["A","B","C","D"][ansIdx]}`);
      handleVoiceAnswer(ansIdx);
    };

    recog.onerror = e => {
      state.voiceListening = false;
      state.voiceRecog = null;
      const msg = e.error === "no-speech" ? "No speech detected." : `Mic error: ${e.error}`;
      setVoiceStatus("error", msg);
    };

    recog.onend = () => {
      if (state.voiceListening) { // aborted without result
        state.voiceListening = false;
        setVoiceStatus("idle", "Listening stopped.");
      }
    };

    recog.start();
  }

  /** Read question aloud (TTS only, no STT). */
  function doVoiceRead() {
    const q = state.questions[state.index];
    if (!q) return;
    stopVoice();
    setVoiceStatus("reading", "Reading question…");
    speak(buildQuestionSpeech(q, state.index),
      () => setVoiceStatus("idle", "Done reading. Click Listen to answer."));
  }

  /** Full session: read question then auto-listen for answer. */
  function doVoiceSession() {
    const q = state.questions[state.index];
    if (!q) return;
    stopVoice();
    setVoiceStatus("reading", "Reading question…");
    speak(buildQuestionSpeech(q, state.index), () => {
      if (!state.voiceMode) return; // user turned off voice mid-read
      doVoiceListen();
    });
  }

  /** Toggle voice panel on/off. */
  function toggleVoiceMode() {
    state.voiceMode = !state.voiceMode;
    const panel = $("voice-panel");
    if (panel) panel.classList.toggle("hidden", !state.voiceMode);
    if (!state.voiceMode) {
      stopVoice();
    } else {
      setVoiceStatus("idle", "Ready — click a button to start");
    }
    const btn = $("btn-toggle-voice");
    if (btn) {
      btn.classList.toggle("voice-active", state.voiceMode);
      btn.title = state.voiceMode ? "Voice mode ON — click to turn off" : "Toggle voice mode";
    }
  }

  // ── CAT (Computerised Adaptive Testing) engine ───────────────────

  /**
   * Pick the next question from the adaptive pool based on current theta.
   * theta > 0.5  → prefer hard questions
   * theta ≤ 0.5  → prefer non-hard questions
   * Falls back to the other tier when the preferred tier is empty.
   */
  function selectAdaptiveQuestion() {
    if (state.adaptivePool.length === 0) return null;
    const wantHard = state.catTheta > 0.50;
    const preferred = state.adaptivePool.filter(q => wantHard ? q.hard : !q.hard);
    const source = preferred.length > 0 ? preferred : state.adaptivePool;
    // Pick randomly within preferred tier (avoid pure top-of-list bias)
    const q = source[Math.floor(Math.random() * source.length)];
    state.adaptivePool = state.adaptivePool.filter(x => x.id !== q.id);
    return q;
  }

  /**
   * Update ability estimate after an answer.
   * Correct on hard question  → big gain   (+0.13)
   * Correct on easy question  → small gain  (+0.07)
   * Wrong on easy question    → bigger loss (−0.11)
   * Wrong on hard question    → small loss  (−0.05)
   */
  function updateCatTheta(correct, isHard) {
    if (correct) {
      state.catTheta = Math.min(1.0, state.catTheta + (isHard ? 0.13 : 0.07));
    } else {
      state.catTheta = Math.max(0.0, state.catTheta - (isHard ? 0.05 : 0.11));
    }
    state.catHistory.push({ correct, hard: !!isHard });
  }

  /** Returns {label, cls} for the current theta level. */
  function catLevel() {
    const t = state.catTheta;
    if (t < 0.25) return { label: "Foundational", cls: "cat-lvl-1" };
    if (t < 0.50) return { label: "Standard",     cls: "cat-lvl-2" };
    if (t < 0.75) return { label: "Advanced",     cls: "cat-lvl-3" };
    return              { label: "Expert",         cls: "cat-lvl-4" };
  }

  /** Render the CAT difficulty indicator bar in #cat-indicator. */
  function renderCatIndicator() {
    const ind = $("cat-indicator");
    if (!ind) return;
    if (!state.adaptive) { ind.classList.add("hidden"); return; }
    ind.classList.remove("hidden");

    const { label, cls } = catLevel();
    const pct = Math.round(state.catTheta * 100);
    const served = state.questions.length;
    const total  = state.adaptiveTotal;

    // Sparkline: last 10 history items (filled from right)
    const recentHistory = state.catHistory.slice(-10);
    const dots = recentHistory.map(h => {
      const outcome = h.correct ? "cat-dot-ok" : "cat-dot-bad";
      const size    = h.hard    ? "cat-dot-lg" : "cat-dot-sm";
      const tip     = (h.hard ? "Hard" : "Std") + " — " + (h.correct ? "✓" : "✗");
      return `<span class="cat-dot ${outcome} ${size}" title="${tip}"></span>`;
    }).join("");

    ind.innerHTML =
      `<div class="cat-row">` +
        `<span class="cat-label">Adaptive Level</span>` +
        `<span class="cat-badge ${cls}">${label}</span>` +
        `<div class="cat-bar-wrap" title="Ability estimate: ${pct}%">` +
          `<div class="cat-bar-fill ${cls}" style="width:${pct}%"></div>` +
        `</div>` +
        `<span class="cat-count">${served}/${total}</span>` +
        (recentHistory.length > 0
          ? `<span class="cat-spark">${dots}</span>`
          : "") +
      `</div>`;
  }

  bind();
  renderDomainCards();
})();
