// ============================================================
// ÁLGEBRA DE BOOLE & HARDWARE - APLICACIÓN WEB
// ============================================================

// ========== UTILIDADES GENERALES ==========
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function showToast(msg, type = "info", ms = 2600) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.className = "toast toast-" + type + " show";
    el.textContent = msg;
    clearTimeout(el.__t);
    el.__t = setTimeout(() => el.classList.remove("show"), ms);
}

function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ========== SISTEMA DE PESTAÑAS ==========
const sectionColors = {
    inicio: '#FFD700',
    variables: '#00FF00',
    'funciones-booleanas': '#00FFFF',
    simplificacion: '#BC13FE',
    circuitos: '#FF00FF',
    procesadores: '#ff8400',
    optimizacion: '#00FF9C',
    practica: '#00FFC8',
    video: '#ff8400',
    resenas: '#00FF9C'
};

const TAB_TITLES = {
    inicio: "Inicio",
    variables: "Variables Booleanas",
    "funciones-booleanas": "Funciones Booleanas",
    simplificacion: "Simplificación",
    circuitos: "Circuitos Digitales",
    procesadores: "Procesadores y ALU",
    optimizacion: "Optimización de Código",
    practica: "Modo Práctica",
    video: "Video Explicativo",
    resenas: "Reseñas"
};

function openTab(evt, tabName) {
    if (evt && evt.preventDefault) evt.preventDefault();
    const newColor = sectionColors[tabName] || '#FFD700';

    document.querySelectorAll(".tab-content").forEach(tc => {
        tc.style.display = "none";
        tc.classList.remove("active");
    });
    document.querySelectorAll(".tab-link").forEach(link => {
        link.classList.remove("active");
        link.style.borderColor = "transparent";
        link.style.color = "#e0e0e0";
    });

    const currentTab = document.getElementById(tabName);
    if (currentTab) {
        currentTab.style.display = "block";
        requestAnimationFrame(() => currentTab.classList.add("active"));
        document.documentElement.style.setProperty('--gold-primary', newColor);
    }

    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add("active");
        evt.currentTarget.style.borderColor = newColor;
        evt.currentTarget.style.color = newColor;
    }

    // ✅ FIX 2: scroll dentro de .main-content, no de window
    const scroller = document.querySelector(".main-content");
    if (scroller) scroller.scrollTo({ top: 0, behavior: "smooth" });

    const pill = document.getElementById("currentSection");
    if (pill) pill.textContent = TAB_TITLES[tabName] || tabName;

    // Cerrar sidebar en móvil al cambiar de tab
    closeSidebar();

    try { localStorage.setItem("mc_last_tab", tabName); } catch (e) {}
    try { updateMiniMission(tabName); } catch (e) {}
}

// ========== SIDEBAR HELPERS ==========
// ✅ FIX 3: función centralizada que usa .sidebar.open (consistente con CSS)
function openSidebar() {
    document.querySelector(".sidebar")?.classList.add("open");
    document.getElementById("sidebarBackdrop")?.classList.add("active");
}
function closeSidebar() {
    document.querySelector(".sidebar")?.classList.remove("open");
    document.getElementById("sidebarBackdrop")?.classList.remove("active");
}
function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar?.classList.contains("open")) closeSidebar();
    else openSidebar();
}

// ========== BINDING DE LINKS DEL SIDEBAR ==========
function bindTabLinksHard() {
    document.querySelectorAll(".sidebar a.tab-link").forEach(a => {
        let tab = a.getAttribute("data-tab");
        if (!tab) {
            const oc = a.getAttribute("onclick") || "";
            const m = oc.match(/openTab\(\s*event\s*,\s*'([^']+)'\s*\)/);
            if (m) tab = m[1];
        }
        if (tab) a.setAttribute("data-tab", tab);

        a.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const t = a.getAttribute("data-tab");
            if (t) openTab(e, t);
        }, { capture: true });
    });
}

// ========== SIDEBAR SEARCH ==========
function initSidebarSearch() {
    const input = document.getElementById("sidebarSearch");
    const results = document.getElementById("sidebarSearchResults");
    if (!input) return;

    const links = Array.from(document.querySelectorAll(".sidebar .tab-link"));
    links.forEach(a => {
        const txt = (a.querySelector(".nav-text") || a).textContent.trim();
        if (!a.dataset.label) a.dataset.label = txt;
    });

    const norm = s => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const apply = () => {
        const q = norm(input.value.trim());
        links.forEach(a => {
            const label = a.dataset.label || "";
            const match = !q || norm(label).includes(q);
            const li = a.closest("li") || a.parentElement;
            if (li) li.style.display = match ? "" : "none";
            const target = a.querySelector(".nav-text") || a;
            if (target) {
                target.innerHTML = q
                    ? label.replace(new RegExp(`(${q})`, "gi"), '<span class="nav-hit">$1</span>')
                    : label;
            }
        });
        if (results) {
            results.innerHTML = q
                ? links.filter(a => norm(a.dataset.label || "").includes(q)).slice(0, 7).map(a =>
                    `<a class="search-result" href="#" data-tab="${a.dataset.tab}">${a.dataset.label}</a>`
                  ).join("")
                : "";
            results.classList.toggle("visible", !!q);
            results.querySelectorAll(".search-result").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    const t = btn.dataset.tab;
                    if (t) openTab(e, t);
                    input.value = ""; apply();
                });
            });
        }
    };

    input.addEventListener("input", apply);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const first = results?.querySelector(".search-result");
            if (first) first.click();
        }
        if (e.key === "Escape") { input.value = ""; apply(); input.blur(); }
    });

    document.getElementById("sidebarSearchBtn")?.addEventListener("click", () => {
        const first = results?.querySelector(".search-result");
        if (first) first.click();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "/" && document.activeElement !== input && !e.ctrlKey) {
            e.preventDefault(); input.focus();
        }
        // ✅ FIX 4: Ctrl+K abre búsqueda rápida
        if (e.ctrlKey && e.key === "k") {
            e.preventDefault(); openModal("quickSearchModal");
            setTimeout(() => document.getElementById("qsInput")?.focus(), 50);
        }
    });

    // Quick search modal input
    const qsInput = document.getElementById("qsInput");
    const qsResults = document.getElementById("qsResults");
    if (qsInput && qsResults) {
        qsInput.addEventListener("input", () => {
            const q = norm(qsInput.value.trim());
            qsResults.innerHTML = q
                ? links.filter(a => norm(a.dataset.label || "").includes(q)).slice(0, 8).map(a =>
                    `<div class="qs-result" data-tab="${a.dataset.tab}">
                        <i class="fas fa-chevron-right"></i> ${a.dataset.label}
                    </div>`
                  ).join("")
                : "";
            qsResults.querySelectorAll(".qs-result").forEach(r => {
                r.addEventListener("click", () => {
                    const t = r.dataset.tab;
                    if (t) { openTab(null, t); closeModal("quickSearchModal"); qsInput.value = ""; qsResults.innerHTML = ""; }
                });
            });
        });
    }

    apply();
}

// ========== MODALES ==========
function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add("open");
    m.setAttribute("aria-hidden", "false");
    if (id === "profileModal") updateProfileModal();
    if (id === "achModal") renderAchievements();
}
function closeModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove("open");
    m.setAttribute("aria-hidden", "true");
}
function initGlobalModalClose() {
    document.addEventListener("click", (e) => {
        const el = e.target.closest("[data-close]");
        if (!el) return;
        e.preventDefault();
        const target = (el.getAttribute("data-close") || "").trim();
        if (target && target !== "true") closeModal(target);
        else {
            const parent = el.closest(".modal");
            if (parent?.id) closeModal(parent.id);
        }
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const shown = Array.from(document.querySelectorAll(".modal.open"));
            if (shown.length) closeModal(shown[shown.length - 1].id);
        }
    });
}

// ========== XP, LOGROS, NIVELES ==========
function loadXp() { return parseInt(localStorage.getItem("mc_xp") || "0", 10); }
function saveXp(v) {
    localStorage.setItem("mc_xp", String(v));
    const xpEl = document.getElementById("xpValue");
    if (xpEl) xpEl.textContent = v;
    updateLevelHud(v);
}
function updateLevelHud(xp) {
    const levelSize = 500;
    const level = Math.floor(xp / levelSize) + 1;
    const pct = Math.round((xp % levelSize) / levelSize * 100);
    const lvEl = document.getElementById("levelValue");
    if (lvEl) lvEl.textContent = level;
    const bar = document.getElementById("xpBar");
    if (bar) bar.style.width = pct + "%";
}

const ACHIEVEMENTS = [
    { id: "xp_300",  xp: 300,  title: "Aprendiz Lógico",      desc: "Alcanza 300 XP" },
    { id: "xp_700",  xp: 700,  title: "Explorador de Hardware",desc: "Alcanza 700 XP" },
    { id: "xp_1200", xp: 1200, title: "Maestro del Silicio",   desc: "Alcanza 1200 XP" }
];
function loadAch() { try { return JSON.parse(localStorage.getItem("mc_ach") || "{}"); } catch { return {}; } }
function saveAch(st) { localStorage.setItem("mc_ach", JSON.stringify(st || {})); }

function awardXp(amount, reason, key) {
    amount = Number(amount);
    if (!amount || amount <= 0) return false;
    if (key) {
        const keys = JSON.parse(localStorage.getItem("mc_xp_keys") || "{}");
        if (keys[key]) { showToast(`✔ ${reason} · 0 XP (ya obtenido)`, "info"); return false; }
        keys[key] = Date.now();
        localStorage.setItem("mc_xp_keys", JSON.stringify(keys));
    }
    const newXp = loadXp() + amount;
    saveXp(newXp);
    showToast(`+${amount} XP · ${reason}`);
    checkAchievements(newXp);
    updateStreak();
    return true;
}

function checkAchievements(xp) {
    const st = loadAch();
    let changed = false;
    ACHIEVEMENTS.forEach(a => {
        if (!st[a.id] && xp >= a.xp) {
            st[a.id] = true; changed = true;
            showAchievementPopup(a.title, a.desc);
        }
    });
    if (changed) saveAch(st);
}

function showAchievementPopup(title, desc) {
    const box = document.getElementById("achPopup");
    if (!box) return;
    box.innerHTML = `🏆 <strong>${escapeHtml(title)}</strong> — ${escapeHtml(desc)}`;
    box.style.display = "block";
    clearTimeout(box.__t);
    box.__t = setTimeout(() => { box.style.display = "none"; }, 3200);
}

function renderAchievements() {
    const grid = document.getElementById("achGrid");
    if (!grid) return;
    const st = loadAch();
    const xp = loadXp();
    grid.innerHTML = ACHIEVEMENTS.map(a => {
        const unlocked = !!st[a.id] || xp >= a.xp;
        return `<div class="ach-item ${unlocked ? "unlocked" : "locked"}">
            <div class="ach-icon"><i class="fas ${unlocked ? "fa-trophy" : "fa-lock"}"></i></div>
            <div class="ach-name">${a.title}</div>
            <div style="font-size:0.7rem;color:#666;margin-top:4px">${a.desc}</div>
        </div>`;
    }).join("");
}

// ✅ FIX 5: actualizar datos del panel de jugador al abrir
function updateProfileModal() {
    const xp = loadXp();
    const levelSize = 500;
    const level = Math.floor(xp / levelSize) + 1;
    const st = loadStreak();
    const missions = loadMissions();
    const done = MISSIONS.filter(m => missions[m.id]).length;
    document.getElementById("profLevel") && (document.getElementById("profLevel").textContent = level);
    document.getElementById("profXp")    && (document.getElementById("profXp").textContent = xp);
    document.getElementById("profStreak")&& (document.getElementById("profStreak").textContent = st.count || 1);
    document.getElementById("profDone")  && (document.getElementById("profDone").textContent = done);
}

// ========== RACHA DIARIA ==========
function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function ydayStr() {
    const d = new Date(); d.setDate(d.getDate()-1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function loadStreak() { try { return JSON.parse(localStorage.getItem("mc_streak") || "{}"); } catch { return {}; } }
function updateStreak() {
    const st = loadStreak();
    const today = todayStr();
    if (!st.last)                { st.last = today; st.count = 1; }
    else if (st.last === today)  { /* ya contado hoy */ }
    else if (st.last === ydayStr()) { st.last = today; st.count = (st.count || 0) + 1; }
    else                         { st.last = today; st.count = 1; }
    localStorage.setItem("mc_streak", JSON.stringify(st));
    const el = document.getElementById("streakValue");
    if (el) el.textContent = st.count;
}

// ========== MODO MISIÓN ==========
const MISSIONS = [
    { id: "variables",          label: "Variables Booleanas" },
    { id: "funciones-booleanas",label: "Funciones Booleanas" },
    { id: "simplificacion",     label: "Simplificación" },
    { id: "circuitos",          label: "Circuitos Digitales" },
    { id: "procesadores",       label: "Procesadores y ALU" },
    { id: "optimizacion",       label: "Optimización de Código" },
    { id: "practica",           label: "Modo Práctica" }
];
function loadMissions() { try { return JSON.parse(localStorage.getItem("mc_missions") || "{}"); } catch { return {}; } }
function saveMissions(st) { localStorage.setItem("mc_missions", JSON.stringify(st || {})); }
function setMissionDone(id, done = true) {
    const st = loadMissions();
    st[id] = !!done;
    saveMissions(st);
    renderMissions();
    updateMiniMission(id);
    if (done) awardXp(100, `Misión: ${id}`, `mission|${id}`);
}
function resetMissions() {
    localStorage.removeItem("mc_missions");
    renderMissions();
    MISSIONS.forEach(m => updateMiniMission(m.id));
}
function renderMissions() {
    const list   = document.getElementById("missionList");
    const fill   = document.getElementById("missionBarFill");
    const pctEl  = document.getElementById("missionPct");
    if (!list) return;
    const st   = loadMissions();
    const done = MISSIONS.filter(m => st[m.id]).length;
    const pct  = Math.round((done / MISSIONS.length) * 100);
    list.innerHTML = MISSIONS.map((m, i) => `
        <li class="mission-item ${st[m.id] ? "done" : ""}">
            <i class="fas ${st[m.id] ? "fa-circle-check" : "fa-circle"}"></i>
            <span style="flex:1">${m.label}</span>
            <span style="font-size:.7rem;color:#666">LV ${i+1}</span>
            <button type="button" onclick="setMissionDone('${m.id}', ${!st[m.id]})">
                ${st[m.id] ? "Desmarcar" : "Completar"}
            </button>
        </li>`).join("");
    if (fill) fill.style.width = pct + "%";
    if (pctEl) pctEl.textContent = pct + "%";
}
function ensureMiniMissions() {
    const st = loadMissions();
    MISSIONS.forEach(m => {
        const tab = document.getElementById(m.id);
        if (!tab || tab.querySelector(".mission-mini")) return;
        const bar = document.createElement("div");
        bar.className = "mission-mini";
        bar.dataset.mission = m.id;
        bar.innerHTML = `
            <div class="mini-left"><i class="fas fa-bullseye"></i>
            <span>Misión: ${m.label}</span></div>
            <button type="button" class="mini-btn ${st[m.id] ? "done" : ""}">
                ${st[m.id] ? "Completada ✓" : "Marcar completada"}
            </button>`;
        bar.querySelector("button").addEventListener("click", () => setMissionDone(m.id, !loadMissions()[m.id]));
        tab.insertBefore(bar, tab.firstChild);
    });
}
function updateMiniMission(id) {
    const tab = document.getElementById(id);
    if (!tab) return;
    const mini = tab.querySelector(".mission-mini");
    if (!mini) return;
    const btn = mini.querySelector("button");
    if (!btn) return;
    const done = !!loadMissions()[id];
    btn.classList.toggle("done", done);
    btn.textContent = done ? "Completada ✓" : "Marcar completada";
}

// ========== MODO PRÁCTICA ==========
let PRACTICE_STATE = null;
let PRACTICE_HISTORY = [];

function practiceHint() {
    if (!PRACTICE_STATE) return "";
    const hints = {
        variables:           "Evalúa cada combinación de variables (0 y 1).",
        "funciones-booleanas":"Usa minterms para obtener la forma canónica.",
        simplificacion:      "Aplica leyes como A·¬A = 0 y A+A·B = A.",
        circuitos:           "Traduce la expresión a compuertas AND, OR, NOT.",
        procesadores:        "Suma bit a bit con acarreo (XOR + AND).",
        optimizacion:        "Factoriza: (A·B)+(A·C) = A·(B+C)."
    };
    return hints[PRACTICE_STATE.topic] || "";
}

function makePractice(topic, level) {
    const vars = ["A", "B", "C", "D"].slice(0, level + 1);
    if (topic === "variables") {
        const expr = `${vars[0]} AND ${vars[1] || "B"}`;
        const table = [];
        for (let i = 0; i < (1 << vars.length); i++) {
            const vals = vars.map((_, j) => (i >> (vars.length - 1 - j)) & 1);
            table.push({ inputs: vals, output: vals[0] & vals[1] });
        }
        const qVals = table[randInt(0, table.length - 1)];
        return {
            topic, level,
            prompt: `Para ${expr} con ${vars.map((v, i) => v + "=" + qVals.inputs[i]).join(", ")}, ¿cuál es la salida? (0 o 1)`,
            type: "scalar", expected: String(qVals.output)
        };
    }
    if (topic === "funciones-booleanas") {
        const minterms = [randInt(0, (1 << vars.length) - 1), randInt(0, (1 << vars.length) - 1)];
        const sop = minterms.map(m => vars.map((v, j) => ((m >> (vars.length - 1 - j)) & 1) ? v : `¬${v}`).join("·")).join(" + ");
        return {
            topic, level,
            prompt: `Función f(${vars.join(",")}) = Σm(${minterms.join(", ")}). ¿Cuál es la SOP?`,
            type: "text", expected: sop
        };
    }
    if (topic === "simplificacion") {
        return { topic, level, prompt: "Simplifica: (A·B)+(A·¬B). (Resultado: una letra)", type: "text", expected: "a" };
    }
    if (topic === "circuitos") {
        return { topic, level, prompt: "¿Cuántas compuertas NAND implementan A·B + ¬A·B? (número)", type: "scalar", expected: "4" };
    }
    if (topic === "procesadores") {
        const a = randInt(0, 7), b = randInt(0, 7);
        return { topic, level, prompt: `Suma binaria: ${a.toString(2).padStart(4,"0")} + ${b.toString(2).padStart(4,"0")} = ? (decimal)`, type: "scalar", expected: String(a + b) };
    }
    if (topic === "optimizacion") {
        return { topic, level, prompt: 'Optimiza: if (x && y) || (x && z) → if (x && ( ??? )). Completa ???', type: "text", expected: "y||z" };
    }
    return makePractice("variables", 1);
}

function renderPractice() {
    const promptBox = document.getElementById("practicePrompt");
    const feedback  = document.getElementById("practiceFeedback");
    const ans       = document.getElementById("practiceAnswer");
    const codeEl    = document.getElementById("practiceMatlab");
    if (!promptBox) return;
    if (!PRACTICE_STATE) {
        promptBox.innerHTML = '<div class="video-placeholder"><div class="ph-title">Aún no hay reto</div><div class="ph-sub">Genera un reto para empezar.</div></div>';
        if (codeEl) codeEl.textContent = "% Genera un reto para ver el código.";
        if (feedback) feedback.innerHTML = "";
        if (ans) ans.value = "";
        return;
    }
    promptBox.innerHTML = `<pre class="practice-pre" style="white-space:pre-wrap;font-family:inherit;font-size:1.1rem;">${escapeHtml(PRACTICE_STATE.prompt)}</pre>`;
    if (feedback) { feedback.innerHTML = ""; feedback.className = "practice-feedback"; }
    if (ans) { ans.value = ""; ans.focus(); }
    if (codeEl) codeEl.textContent = `% Reto: ${PRACTICE_STATE.topic}\n% ${PRACTICE_STATE.prompt}\n% Respuesta esperada: ${PRACTICE_STATE.expected}`;
}

function checkPractice() {
    const feedback = document.getElementById("practiceFeedback");
    const ansRaw = (document.getElementById("practiceAnswer")?.value || "").trim();
    if (!PRACTICE_STATE) return;
    if (!ansRaw) { if (feedback) feedback.textContent = "Escribe una respuesta."; return; }
    const norm = s => s.toLowerCase().replace(/\s+/g, "").replace(/[·]/g, "");
    const ok = norm(ansRaw) === norm(String(PRACTICE_STATE.expected));
    if (feedback) {
        feedback.className = "practice-feedback " + (ok ? "correct" : "wrong");
        if (ok) {
            const gained = 60;
            const key = `prac|${PRACTICE_STATE.topic}|${PRACTICE_STATE.prompt}`;
            const awarded = awardXp(gained, "Práctica correcta", key);
            feedback.innerHTML = awarded ? `✅ Correcto. +${gained} XP` : "✅ Correcto. (ya contabilizado)";
        } else {
            feedback.innerHTML = `❌ Incorrecto. Pista: ${practiceHint()}`;
        }
    }
    // Guardar en historial
    PRACTICE_HISTORY.unshift({ topic: PRACTICE_STATE.topic, correct: ok, date: new Date().toLocaleTimeString() });
    if (PRACTICE_HISTORY.length > 20) PRACTICE_HISTORY.pop();
    renderPracticeHistory();
}

function renderPracticeHistory() {
    const el = document.getElementById("practiceHistory");
    if (!el) return;
    if (!PRACTICE_HISTORY.length) { el.innerHTML = "<p class='muted'>Sin historial aún.</p>"; return; }
    el.innerHTML = PRACTICE_HISTORY.map(h =>
        `<div class="history-item ${h.correct ? "correct" : "wrong"}">
            <span>${TAB_TITLES[h.topic] || h.topic}</span>
            <span>${h.correct ? "✅ Correcto" : "❌ Incorrecto"}</span>
            <span style="color:#666;font-size:.75rem">${h.date}</span>
        </div>`
    ).join("");
}

function revealPractice() {
    const feedback = document.getElementById("practiceFeedback");
    if (!PRACTICE_STATE || !feedback) return;
    feedback.className = "practice-feedback";
    feedback.textContent = `Solución: ${PRACTICE_STATE.expected}`;
}

function initPracticeMode() {
    document.getElementById("practiceNew")?.addEventListener("click", () => {
        const topic = document.getElementById("practiceTopic").value;
        const level = parseInt(document.getElementById("practiceLevel").value);
        PRACTICE_STATE = makePractice(topic, level);
        renderPractice();
    });
    document.getElementById("practiceCheck")?.addEventListener("click", checkPractice);
    document.getElementById("practiceReveal")?.addEventListener("click", revealPractice);
    document.getElementById("practiceReset")?.addEventListener("click", () => { PRACTICE_STATE = null; renderPractice(); });
    document.getElementById("practiceAnswer")?.addEventListener("keydown", e => { if (e.key === "Enter") checkPractice(); });

    // ✅ FIX 4: botones que antes no tenían listener
    document.getElementById("practiceHintBtn")?.addEventListener("click", () => {
        const fb = document.getElementById("practiceFeedback");
        if (fb && PRACTICE_STATE) { fb.className = "practice-feedback"; fb.textContent = "💡 Pista: " + practiceHint(); }
    });
    document.getElementById("practiceCopy")?.addEventListener("click", () => {
        const code = document.getElementById("practiceMatlab")?.textContent || "";
        navigator.clipboard.writeText(code).then(() => showToast("Código copiado"));
    });
    document.getElementById("practiceDownload")?.addEventListener("click", () => {
        const code = document.getElementById("practiceMatlab")?.textContent || "";
        const blob = new Blob([code], { type: "text/plain" });
        const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "reto.m" });
        a.click(); URL.revokeObjectURL(a.href);
    });
    document.getElementById("practiceLoad")?.addEventListener("click", () => {
        if (PRACTICE_STATE) { openTab(null, PRACTICE_STATE.topic); showToast("Sección cargada"); }
        else showToast("Genera un reto primero", "info");
    });
    document.getElementById("practiceExportCSV")?.addEventListener("click", () => {
        const csv = "Tema,Correcto,Hora\n" + PRACTICE_HISTORY.map(h => `${h.topic},${h.correct},${h.date}`).join("\n");
        const a = Object.assign(document.createElement("a"), { href: "data:text/csv;charset=utf-8," + encodeURIComponent(csv), download: "historial.csv" });
        a.click();
    });
    document.getElementById("practiceExportJSON")?.addEventListener("click", () => {
        const a = Object.assign(document.createElement("a"), { href: "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(PRACTICE_HISTORY, null, 2)), download: "historial.json" });
        a.click();
    });
    document.getElementById("practiceClearHistory")?.addEventListener("click", () => {
        PRACTICE_HISTORY = []; renderPracticeHistory(); showToast("Historial borrado");
    });

    renderPractice();
    renderPracticeHistory();
}

// ========== FUNCIONES DE SECCIONES ==========

// Misión 1: Tabla de verdad
function generateTruthTable() {
    const input = document.getElementById("varExpr").value.trim().toUpperCase();
    const out   = document.getElementById("truthTableOutput");
    if (!out) return;
    const vars = [...new Set(input.match(/[A-Z]/g) || [])].sort();
    if (vars.length < 1 || vars.length > 4) { out.textContent = "Usa de 1 a 4 variables (A, B, C, D)."; return; }
    const expr = input
        .replace(/AND/g, "&&").replace(/OR/g, "||")
        .replace(/NOT\s*/g, "!").replace(/XOR/g, "^");
    let html = `<table class="mini-table"><thead><tr>${vars.map(v => `<th>${v}</th>`).join("")}<th>Resultado</th></tr></thead><tbody>`;
    for (let i = 0; i < (1 << vars.length); i++) {
        const vals = {};
        vars.forEach((v, j) => vals[v] = (i >> (vars.length - 1 - j)) & 1);
        try {
            const fn = new Function(...vars, `return (${expr}) ? 1 : 0;`);
            const result = fn(...vars.map(v => vals[v]));
            html += `<tr>${vars.map(v => `<td>${vals[v]}</td>`).join("")}<td><strong>${result}</strong></td></tr>`;
        } catch {
            html += `<tr><td colspan="${vars.length+1}" style="color:#f55">Error en expresión</td></tr>`; break;
        }
    }
    html += "</tbody></table>";
    out.innerHTML = html;
    awardXp(40, "Tabla de verdad", `truth|${input}`);
}

// Misión 2: Formas canónicas (demo)
function renderCanonicalDemo() {
    const el = document.getElementById("canonicalDemo");
    if (!el) return;
    el.innerHTML = `<strong>Ejemplo:</strong> f(A,B,C) = Σm(1,3,5,7)<br><br>
        <strong>SOP (Suma de Productos):</strong><br>
        m1: ¬A·¬B·C &nbsp;&nbsp; m3: ¬A·B·C &nbsp;&nbsp; m5: A·¬B·C &nbsp;&nbsp; m7: A·B·C<br>
        → f = C &nbsp;&nbsp; <em>(después de simplificar)</em><br><br>
        <strong>POS (Producto de Sumas):</strong><br>
        Complemento: Σm(0,2,4,6) → f' = ¬C → f = C ✓`;
}

// Misión 3: Mapa K
function simplifyWithKMap() {
    const out     = document.getElementById("simplifiedResult");
    const kmapDiv = document.getElementById("kmapContainer");
    if (!out) return;
    kmapDiv.innerHTML = `<div style="text-align:left;font-family:monospace;line-height:1.8">
Mapa K (3 vars) para Σm(1,2,5,7):<br>
<pre>     BC
A  00 01 11 10
0   0  1  0  1
1   0  0  1  1</pre>
Grupos: {1,5}→¬A·C, {2}→¬A·B, {5,7}→A·C</div>`;
    out.textContent = "Expresión simplificada: A·C + B·¬C";
    awardXp(60, "Mapa de Karnaugh", "kmap_demo");
}

// Misión 4: Circuito
function drawCircuit() {
    const div = document.getElementById("circuitSim");
    if (!div) return;
    div.innerHTML = `<div style="text-align:center;font-family:monospace;line-height:2">
        <p>Circuito para <strong>f = A·B + ¬A·B</strong></p>
        <pre>  A ──┬──[AND]──┐
     │         ├──[OR]── f
  B ──┼──[AND]──┘
     └──[NOT]──┘
  (se simplifica a B)</pre>
        <p style="color:#aaa;font-size:.9rem">2 AND + 1 NOT + 1 OR · Todo implementable con 4 NANDs</p>
    </div>`;
    awardXp(50, "Circuito visualizado", "circuit_demo");
}

// Misión 5: ALU
function simulateALU() {
    const aRaw = document.getElementById("aluA").value.trim();
    const bRaw = document.getElementById("aluB").value.trim();
    const out   = document.getElementById("aluResult");
    if (!out) return;
    if (!/^[01]{1,4}$/.test(aRaw) || !/^[01]{1,4}$/.test(bRaw)) {
        out.textContent = "Ingresa valores binarios válidos de hasta 4 bits (ej: 1010).";
        return;
    }
    const toBits = s => s.padStart(4, "0").split("").map(Number).reverse();
    const bitsA = toBits(aRaw), bitsB = toBits(bRaw);
    let carry = 0, resultBits = [], steps = "";
    for (let i = 0; i < 4; i++) {
        const sum      = bitsA[i] ^ bitsB[i] ^ carry;
        const newCarry = (bitsA[i] & bitsB[i]) | (bitsA[i] & carry) | (bitsB[i] & carry);
        steps += `Bit ${i}: A=${bitsA[i]} B=${bitsB[i]} Cin=${carry} → Sum=${sum} Cout=${newCarry}\n`;
        resultBits.unshift(sum);
        carry = newCarry;
    }
    if (carry) resultBits.unshift(carry);
    const binResult = resultBits.join("");
    out.innerHTML = `<pre>${steps}\nResultado: ${binResult} (decimal: ${parseInt(binResult, 2)})</pre>`;
    awardXp(70, "Simulación ALU", `alu|${aRaw}|${bRaw}`);
}

// Misión 6: Optimizar condición
function optimizeCondition() {
    const raw = document.getElementById("rawCondition").value.trim();
    const out  = document.getElementById("optimizedOutput");
    if (!out || !raw) return;
    let optimized = raw
        .replace(/\(([A-Za-z_$][\w$]*)\s*\|\|\s*\1\)/g, "$1")
        .replace(/\(([A-Za-z_$][\w$]*)\s*&&\s*\1\)/g, "$1")
        .replace(/\(([A-Za-z_$][\w$]*)\s*&&\s*([A-Za-z_$][\w$]*)\)\s*\|\|\s*\(\1\s*&&\s*([A-Za-z_$][\w$]*)\)/g, "$1 && ($2 || $3)");
    out.textContent = optimized !== raw ? optimized : "No se encontró simplificación automática. Revisa manualmente la expresión.";
    awardXp(50, "Optimización", `optim|${raw}`);
}

// ========== VIDEO ==========
function initVideoSection() {
    const DEFAULT = "https://youtu.be/9juarsU2hQo";
    const input = document.getElementById("videoInput");
    if (!input) return;

    const toEmbed = url => {
        if (!url) return "";
        if (url.includes("embed/")) return url;
        return url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/");
    };

    const load = () => {
        const url   = (input.value || DEFAULT).trim();
        const embed = toEmbed(url);
        const wrap  = document.getElementById("videoPreviewWrap");
        const ph    = document.getElementById("videoPlaceholder");
        if (!wrap) return;
        wrap.querySelectorAll("iframe").forEach(f => f.remove());
        const iframe = document.createElement("iframe");
        iframe.src            = embed;
        iframe.allowFullscreen = true;
        iframe.allow          = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.style.width    = "100%";
        iframe.style.aspectRatio = "16/9";
        iframe.style.border   = "none";
        iframe.style.display  = "block";
        wrap.appendChild(iframe);
        if (ph) ph.style.display = "none";
    };

    document.getElementById("videoLoadBtn")?.addEventListener("click", load);
    document.getElementById("videoClearBtn")?.addEventListener("click", () => {
        input.value = "";
        document.getElementById("videoPreviewWrap")?.querySelectorAll("iframe").forEach(f => f.remove());
        const ph = document.getElementById("videoPlaceholder");
        if (ph) ph.style.display = "flex";
    });
    input.value = DEFAULT;
    load();
}

// ========== RESEÑAS ==========
function updateAvgRating() {
    const arr = JSON.parse(localStorage.getItem("mc_reviews") || "[]");
    const avgEl = document.getElementById("avgRating");
    if (!avgEl) return;
    if (!arr.length) { avgEl.textContent = "—"; return; }
    const avg = arr.reduce((s, r) => s + r.rating, 0) / arr.length;
    avgEl.textContent = avg.toFixed(1);
}

function renderReviews() {
    const list = document.getElementById("reviewsList");
    if (!list) return;
    const arr = JSON.parse(localStorage.getItem("mc_reviews") || "[]");
    list.innerHTML = arr.length
        ? arr.slice().reverse().map(r =>
            `<div class="review-item">
                <div class="rev-header">
                    <span class="rev-name">${escapeHtml(r.name || "Anónimo")}</span>
                    <span class="rev-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span>
                </div>
                <div class="rev-text">${escapeHtml(r.text)}</div>
                <div class="rev-date">${r.date || ""}</div>
            </div>`
          ).join("")
        : "<p class='muted'>No hay reseñas aún.</p>";
    updateAvgRating();
}

// ✅ FIX 6: star picker enlazado correctamente
function initStarPicker() {
    const picker = document.getElementById("starPicker");
    const select = document.getElementById("revRating");
    if (!picker || !select) return;
    let selected = 5;
    picker.querySelectorAll(".star").forEach(btn => {
        btn.addEventListener("click", () => {
            selected = parseInt(btn.dataset.v);
            select.value = String(selected);
            picker.querySelectorAll(".star").forEach(s =>
                s.classList.toggle("active", parseInt(s.dataset.v) <= selected)
            );
        });
        btn.addEventListener("mouseenter", () => {
            const v = parseInt(btn.dataset.v);
            picker.querySelectorAll(".star").forEach(s =>
                s.classList.toggle("active", parseInt(s.dataset.v) <= v)
            );
        });
        btn.addEventListener("mouseleave", () => {
            picker.querySelectorAll(".star").forEach(s =>
                s.classList.toggle("active", parseInt(s.dataset.v) <= selected)
            );
        });
    });
    // Estado inicial
    picker.querySelectorAll(".star").forEach(s =>
        s.classList.toggle("active", parseInt(s.dataset.v) <= selected)
    );
}

function addReview() {
    const name   = document.getElementById("revName")?.value.trim() || "";
    const text   = document.getElementById("revText")?.value.trim() || "";
    const rating = parseInt(document.getElementById("revRating")?.value || "5");
    const msg    = document.getElementById("revMsg");
    if (!text) { if (msg) msg.textContent = "Escribe tu reseña antes de publicar."; return; }
    const arr = JSON.parse(localStorage.getItem("mc_reviews") || "[]");
    arr.push({ name, rating, text, date: new Date().toLocaleString() });
    localStorage.setItem("mc_reviews", JSON.stringify(arr));
    if (document.getElementById("revText")) document.getElementById("revText").value = "";
    if (msg) { msg.textContent = "¡Reseña publicada!"; setTimeout(() => msg.textContent = "", 2000); }
    renderReviews();
    awardXp(30, "Reseña publicada", `review|${Date.now()}`);
}
function clearReviews() {
    if (!confirm("¿Borrar todas las reseñas?")) return;
    localStorage.removeItem("mc_reviews");
    renderReviews();
}

// ========== HUD ==========
function initHud() {
    // Sonido
    const soundBtn = document.getElementById("soundBtn");
    const soundOn  = () => localStorage.getItem("mc_sound") === "on";
    const setSound = on => {
        localStorage.setItem("mc_sound", on ? "on" : "off");
        if (soundBtn) soundBtn.innerHTML = on ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    };
    setSound(soundOn());
    soundBtn?.addEventListener("click", () => setSound(!soundOn()));

    // Tema
    const themeBtn = document.getElementById("themeBtn");
    const theme    = () => localStorage.getItem("mc_theme") || "gold";
    document.documentElement.setAttribute("data-theme", theme());
    themeBtn?.addEventListener("click", () => {
        const next = theme() === "gold" ? "cyber" : "gold";
        localStorage.setItem("mc_theme", next);
        document.documentElement.setAttribute("data-theme", next);
        showToast(`Tema: ${next}`);
    });

    // Pantalla completa
    document.getElementById("fsBtn")?.addEventListener("click", () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
        else document.exitFullscreen();
    });

    // ✅ FIX 3: sidebar usa toggleSidebar()
    document.getElementById("sidebarToggle")?.addEventListener("click", toggleSidebar);
    document.getElementById("sidebarBackdrop")?.addEventListener("click", closeSidebar);

    // ✅ FIX 4: mission close button
    document.getElementById("missionClose")?.addEventListener("click", () => {
        document.getElementById("missionPanel")?.style.setProperty("display", "none");
    });

    // Panel de jugador
    document.getElementById("panelBtn")?.addEventListener("click", () => openModal("profileModal"));
    document.getElementById("xpBadge")?.addEventListener("click", () => openModal("profileModal"));
    document.getElementById("trophyBtn")?.addEventListener("click", () => { renderAchievements(); openModal("achModal"); });
    document.getElementById("resetProgressBtn")?.addEventListener("click", () => {
        if (!confirm("¿Reiniciar progreso?")) return;
        ["mc_xp","mc_streak","mc_ach","mc_xp_keys","mc_missions"].forEach(k => localStorage.removeItem(k));
        location.reload();
    });
}

// ========== INICIALIZACIÓN ==========
document.addEventListener("DOMContentLoaded", () => {
    const lastTab = localStorage.getItem("mc_last_tab") || "inicio";
    openTab(null, document.getElementById(lastTab) ? lastTab : "inicio");

    bindTabLinksHard();
    initSidebarSearch();
    initGlobalModalClose();
    initHud();
    initPracticeMode();
    initVideoSection();
    initStarPicker();
    renderReviews();
    renderMissions();
    ensureMiniMissions();
    renderCanonicalDemo();
    updateStreak();
    saveXp(loadXp());
    updateLevelHud(loadXp());
    renderAchievements();

    // ✅ FIX 2: scroll progress dentro de .main-content
    const scroller = document.querySelector(".main-content");
    if (scroller) {
        scroller.addEventListener("scroll", () => {
            const pct = scroller.scrollTop / (scroller.scrollHeight - scroller.clientHeight) * 100;
            const bar = document.getElementById("scrollProgress");
            if (bar) bar.style.width = (pct || 0) + "%";
            const toTop = document.getElementById("toTopBtn");
            if (toTop) toTop.classList.toggle("visible", scroller.scrollTop > 400);
        });
        document.getElementById("toTopBtn")?.addEventListener("click", () =>
            scroller.scrollTo({ top: 0, behavior: "smooth" })
        );
    }
});

// ========== PARTÍCULAS ==========
(function () {
    const canvas = document.getElementById("particlesCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;

    // ✅ FIX 1: resize PRIMERO, luego crear partículas con w y h definidos
    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);

    const count = 60;
    const particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1
    }));

    function draw() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,215,0,0.2)";
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
})();
