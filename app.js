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
    adaptive: false,          // true when adaptive mode is active
    adaptivePool: [],         // remaining unserved questions
    adaptiveTotal: 0,         // target total question count
    catTheta: 0.30,           // ability estimate 0.00–1.00 (starts just below medium)
    catHistory: []            // [{correct, hard}] — last answered questions
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

    $("btn-prev").addEventListener("click", () => { resumeTimer(); goDelta(-1); });
    $("btn-next").addEventListener("click", () => {
      resumeTimer();
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
      resumeTimer(); // clear any pause before finalising
      finishExam(false);
    });

    $("btn-submit").addEventListener("click", () => {
      const unanswered = state.answers.some((a) => a === null || a === undefined);
      if (unanswered && !confirm("Some questions are unanswered. Submit anyway?")) return;
      resumeTimer();
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
