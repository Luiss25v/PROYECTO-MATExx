// ========== UTILIDADES GENERALES ==========
function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function showToast(msg, type = "info", ms = 2600) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.className = "toast toast-" + type;
    el.textContent = msg;
    el.style.display = "block";
    el.style.opacity = "1";
    clearTimeout(el.__t);
    el.__t = setTimeout(() => { el.style.opacity = "0"; setTimeout(() => { el.style.display = "none"; }, 250); }, ms);
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

    const scroller = document.querySelector(".main-content");
    if (scroller) scroller.scrollTo({ top: 0, behavior: "smooth" });

    const pill = document.getElementById("currentSection");
    if (pill) pill.textContent = TAB_TITLES[tabName] || tabName;

    try { localStorage.setItem("mc_last_tab", tabName); } catch (e) {}

    // Cerrar drawer si está abierto
    document.body.classList.remove("sidebar-open");

    // Actualizar mini-misiones
    try { updateMiniMission(tabName); } catch (e) {}
}

// ========== BINDING DE LINKS ==========
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
            if (t && typeof openTab === "function") openTab(e, t);
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
            const label = a.dataset.label;
            const match = !q || norm(label).includes(q);
            const li = a.closest("li") || a.parentElement;
            if (li) li.style.display = match ? "" : "none";
            const target = a.querySelector(".nav-text") || a;
            if (target) target.innerHTML = q ? label.replace(new RegExp(`(${q})`, "gi"), '<span class="nav-hit">$1</span>') : label;
        });
        results.innerHTML = q ? links.filter(a => norm(a.dataset.label).includes(q)).slice(0, 7).map(a =>
            `<button class="search-result" data-tab="${a.dataset.tab}">${a.dataset.label}</button>`
        ).join("") : "";
        results.classList.toggle("show", !!q);
    };

    input.addEventListener("input", apply);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const first = results.querySelector(".search-result");
            if (first) first.click();
        }
        if (e.key === "Escape") { input.value = ""; apply(); }
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "/" && document.activeElement !== input) { e.preventDefault(); input.focus(); }
    });
    apply();
}

// ========== MODALES ==========
function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add("open", "show");
    m.setAttribute("aria-hidden", "false");
}
function closeModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove("open", "show");
    m.setAttribute("aria-hidden", "true");
}
function initGlobalModalClose() {
    document.addEventListener("click", (e) => {
        const el = e.target.closest("[data-close]");
        if (!el) return;
        e.preventDefault();
        const target = el.getAttribute("data-close").trim();
        if (target && target !== "true") closeModal(target);
        else {
            const parent = el.closest(".modal");
            if (parent && parent.id) closeModal(parent.id);
        }
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const shown = Array.from(document.querySelectorAll(".modal.open, .modal.show"));
            if (shown.length) closeModal(shown[shown.length - 1].id);
        }
    });
}

// ========== XP, NIVEL, LOGROS ==========
function loadXp() { return parseInt(localStorage.getItem("mc_xp") || "0", 10); }
function saveXp(v) {
    localStorage.setItem("mc_xp", String(v));
    document.getElementById("xpValue") && (document.getElementById("xpValue").textContent = v);
    updateLevelHud(v);
}
function updateLevelHud(xp) {
    const levelSize = 500;
    const level = Math.floor(xp / levelSize) + 1;
    const pct = Math.round((xp % levelSize) / levelSize * 100);
    document.getElementById("levelValue") && (document.getElementById("levelValue").textContent = level);
    const bar = document.getElementById("xpBar");
    if (bar) bar.style.width = pct + "%";
}

const ACHIEVEMENTS = [
    { id: "xp_300", xp: 300, title: "Aprendiz Lógico", desc: "Alcanza 300 XP" },
    { id: "xp_700", xp: 700, title: "Explorador de Hardware", desc: "Alcanza 700 XP" },
    { id: "xp_1200", xp: 1200, title: "Maestro del Silicio", desc: "Alcanza 1200 XP" }
];
function loadAch() { try { return JSON.parse(localStorage.getItem("mc_ach") || "{}"); } catch (e) { return {}; } }
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
        if (!st[a.id] && xp >= a.xp) { st[a.id] = true; changed = true; showAchievementPopup(a.title, a.desc); }
    });
    if (changed) saveAch(st);
}

function showAchievementPopup(title, desc) {
    const box = document.getElementById("achPopup");
    if (!box) return;
    const el = document.createElement("div");
    el.className = "ach-pop";
    el.innerHTML = `<div class="row"><span class="badge"><i class="fas fa-trophy"></i> Logro</span><div><div class="name">${title}</div><div class="desc">${desc}</div></div></div>`;
    box.appendChild(el);
    setTimeout(() => el.remove(), 3200);
}

// ========== RACHA DIARIA ==========
function todayStr() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function ydayStr() { const d = new Date(); d.setDate(d.getDate()-1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function loadStreak() { try { return JSON.parse(localStorage.getItem("mc_streak") || "{}"); } catch (e) { return {}; } }
function updateStreak() {
    const st = loadStreak();
    const today = todayStr();
    if (!st.last) { st.last = today; st.count = 1; }
    else if (st.last === today) { /* nada */ }
    else if (st.last === ydayStr()) { st.last = today; st.count = (st.count || 0) + 1; }
    else { st.last = today; st.count = 1; }
    localStorage.setItem("mc_streak", JSON.stringify(st));
    document.getElementById("streakValue") && (document.getElementById("streakValue").textContent = st.count);
}

// ========== MODO MISIÓN ==========
const MISSIONS = [
    { id: "variables", label: "Variables Booleanas" },
    { id: "funciones-booleanas", label: "Funciones Booleanas" },
    { id: "simplificacion", label: "Simplificación" },
    { id: "circuitos", label: "Circuitos Digitales" },
    { id: "procesadores", label: "Procesadores y ALU" },
    { id: "optimizacion", label: "Optimización de Código" },
    { id: "practica", label: "Modo Práctica" }
];
function loadMissions() { try { return JSON.parse(localStorage.getItem("mc_missions") || "{}"); } catch (e) { return {}; } }
function saveMissions(st) { localStorage.setItem("mc_missions", JSON.stringify(st || {})); }
function setMissionDone(id, done = true) {
    const st = loadMissions();
    st[id] = !!done;
    saveMissions(st);
    renderMissions();
    updateMiniMission(id);
}
function resetMissions() {
    localStorage.removeItem("mc_missions");
    renderMissions();
    MISSIONS.forEach(m => updateMiniMission(m.id));
}
function renderMissions() {
    const list = document.getElementById("missionList");
    const fill = document.getElementById("missionBarFill");
    const pctEl = document.getElementById("missionPct");
    if (!list) return;
    const st = loadMissions();
    const done = MISSIONS.filter(m => st[m.id]).length;
    const pct = Math.round((done / MISSIONS.length) * 100);
    list.innerHTML = MISSIONS.map((m, i) => `
        <li class="mission-item ${st[m.id] ? "done" : ""}">
            <div class="left"><i class="fas ${st[m.id] ? "fa-circle-check" : "fa-circle"}"></i>
            <span class="label">${m.label}</span><span class="mission-lv">LV ${i+1}</span></div>
            <span class="state">${st[m.id] ? "Completada" : "Pendiente"}</span>
            <button type="button" onclick="setMissionDone('${m.id}', ${!st[m.id]})">${st[m.id] ? "Desmarcar" : "Completar"}</button>
        </li>`).join("");
    fill && (fill.style.width = pct + "%");
    pctEl && (pctEl.textContent = pct + "%");
}

function ensureMiniMissions() {
    const st = loadMissions();
    MISSIONS.forEach(m => {
        const tab = document.getElementById(m.id);
        if (!tab || tab.querySelector(".mission-mini")) return;
        const bar = document.createElement("div");
        bar.className = "mission-mini";
        bar.dataset.mission = m.id;
        bar.innerHTML = `<div class="mini-left"><i class="fas fa-bullseye"></i><div class="mini-title">Misión: ${m.label}</div></div>
            <button type="button" class="mini-btn ${st[m.id] ? "done" : ""}">${st[m.id] ? "Completada ✓" : "Marcar completada"}</button>`;
        bar.querySelector("button").addEventListener("click", () => setMissionDone(m.id, !st[m.id]));
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

// ========== HUD (SONIDO, TEMA, FS) ==========
function initHud() {
    // Sonido
    const soundBtn = document.getElementById("soundBtn");
    const soundOn = () => localStorage.getItem("mc_sound") === "on";
    const setSound = (on) => {
        localStorage.setItem("mc_sound", on ? "on" : "off");
        soundBtn.innerHTML = on ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    };
    setSound(soundOn());
    soundBtn?.addEventListener("click", () => setSound(!soundOn()));

    // Tema
    const themeBtn = document.getElementById("themeBtn");
    const theme = () => localStorage.getItem("mc_theme") || "gold";
    document.documentElement.setAttribute("data-theme", theme());
    themeBtn?.addEventListener("click", () => {
        const next = theme() === "gold" ? "cyber" : "gold";
        localStorage.setItem("mc_theme", next);
        document.documentElement.setAttribute("data-theme", next);
        showToast("Tema: " + (next === "cyber" ? "Cyber" : "Dorado"));
    });

    // Fullscreen
    document.getElementById("fsBtn")?.addEventListener("click", () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
    });

    // Sidebar drawer
    document.getElementById("sidebarToggle")?.addEventListener("click", () => document.body.classList.toggle("sidebar-open"));
    document.getElementById("sidebarBackdrop")?.addEventListener("click", () => document.body.classList.remove("sidebar-open"));
}

// ========== MISIONES INTERACTIVAS ==========

// Misión 1: Tabla de verdad
function generateTruthTable() {
    const input = document.getElementById("varExpr").value.trim().toUpperCase();
    const out = document.getElementById("truthTableOutput");
    if (!out) return;
    const vars = [...new Set(input.match(/[A-Z]/g) || [])].sort();
    if (vars.length < 1 || vars.length > 4) { out.textContent = "Usa de 1 a 4 variables (A, B, C, D)."; return; }
    const expr = input.replace(/AND/gi, "&&").replace(/OR/gi, "||").replace(/NOT\s*/gi, "!").replace(/XOR/gi, "^");
    let html = `<table class="mini-table"><thead><tr>${vars.map(v => `<th>${v}</th>`).join("")}<th>Resultado</th></tr></thead><tbody>`;
    for (let i = 0; i < (1 << vars.length); i++) {
        const vals = {};
        vars.forEach((v, j) => vals[v] = (i >> (vars.length - 1 - j)) & 1);
        try {
            const fn = new Function(...vars, `return (${expr}) ? 1 : 0;`);
            const result = fn(...vars.map(v => vals[v]));
            html += `<tr>${vars.map(v => `<td>${vals[v]}</td>`).join("")}<td><strong>${result}</strong></td></tr>`;
        } catch (e) {
            html += `<tr><td colspan="${vars.length+1}">Error en expresión</td></tr>`; break;
        }
    }
    html += "</tbody></table>";
    out.innerHTML = html;
    awardXp(40, "Tabla de verdad", `truth|${input}`);
}

// Misión 3: Simplificación (ejemplo fijo)
function simplifyWithKMap() {
    const out = document.getElementById("simplifiedResult");
    const kmapDiv = document.getElementById("kmapContainer");
    if (!out) return;
    kmapDiv.innerHTML = `Mapa K (3 vars) para Σm(1,2,5,7):<br><pre>   BC
A  00 01 11 10
0   0  1  0  1
1   0  0  1  1</pre>`;
    out.textContent = `Expresión simplificada: A·C + B·¬C`;
    awardXp(60, "Simplificación", "kmap_demo");
}

// Misión 4: Dibujar circuito
function drawCircuit() {
    const div = document.getElementById("circuitSim");
    if (!div) return;
    div.innerHTML = `<div style="text-align:center; font-family:monospace;">
        <p>Circuito para <strong>A·B + ¬A·B</strong></p>
        <pre>  A ──┬──[AND]──┐
     │         ├──[OR]── Salida
  B ──┼──[AND]──┘
     └──[NOT]──┘</pre>
        <p>Implementado con 2 AND, 1 OR y 1 NOT.</p></div>`;
    awardXp(50, "Circuito", "circuit_demo");
}

// Misión 5: Simular ALU (sumador 4 bits)
function simulateALU() {
    const a = document.getElementById("aluA").value.trim();
    const b = document.getElementById("aluB").value.trim();
    const out = document.getElementById("aluResult");
    if (!out) return;
    const toBits = s => s.padStart(4, "0").split("").map(Number).reverse();
    const bitsA = toBits(a);
    const bitsB = toBits(b);
    let carry = 0;
    let result = "";
    let steps = "";
    for (let i = 0; i < 4; i++) {
        const sum = bitsA[i] ^ bitsB[i] ^ carry;
        const newCarry = (bitsA[i] & bitsB[i]) | (bitsA[i] & carry) | (bitsB[i] & carry);
        steps += `Bit ${i}: ${bitsA[i]}+${bitsB[i]}+Cin${carry} = Sum ${sum}, Cout ${newCarry}\n`;
        result = sum + result;
        carry = newCarry;
    }
    result = carry + result;
    const decimal = parseInt(result, 2);
    out.innerHTML = `<pre>${steps}\nResultado: ${result} (decimal ${decimal})</pre>`;
    awardXp(70, "ALU", `alu|${a}|${b}`);
}

// Misión 6: Optimizar condición
function optimizeCondition() {
    const raw = document.getElementById("rawCondition").value.trim();
    const out = document.getElementById("optimizedOutput");
    if (!out) return;
    let optimized = raw
        .replace(/\(([A-Za-z]+)\s*\|\|\s*\1\)/g, "$1")
        .replace(/\(([A-Za-z]+)\s*&&\s*\1\)/g, "$1")
        .replace(/\(([A-Za-z]+)\s*&&\s*([A-Za-z]+)\)\s*\|\|\s*\(\1\s*&&\s*([A-Za-z]+)\)/g, "$1 && ($2 || $3)");
    if (optimized === raw) optimized = "No se encontró simplificación obvia.";
    out.textContent = optimized;
    awardXp(50, "Optimización", `optim|${raw}`);
}

// ========== MODO PRÁCTICA ==========
let PRACTICE_STATE = null;

function practiceHint() {
    if (!PRACTICE_STATE) return "";
    const hints = {
        variables: "Evalúa cada combinación de variables (0 y 1).",
        "funciones-booleanas": "Usa minterms para obtener la forma canónica.",
        simplificacion: "Aplica leyes como A·¬A = 0 y A+AB = A.",
        circuitos: "Traduce la expresión a compuertas AND, OR, NOT.",
        procesadores: "Suma bit a bit con acarreo (XOR + AND).",
        optimizacion: "Factoriza: (A·B)+(A·C) = A·(B+C)."
    };
    return hints[PRACTICE_STATE.topic] || "";
}

function makePractice(topic, level) {
    const vars = ["A", "B", "C", "D"].slice(0, level + 1);
    const randBool = () => (Math.random() > 0.5 ? 1 : 0);
    if (topic === "variables") {
        const expr = `${vars[0]} AND ${vars[1] || "B"}`;
        const table = [];
        for (let i = 0; i < (1 << vars.length); i++) {
            const vals = vars.map((_, j) => (i >> (vars.length - 1 - j)) & 1);
            const result = vals[0] & vals[1];
            table.push({ inputs: vals, output: result });
        }
        const qVals = table[randInt(0, table.length - 1)];
        const prompt = `Para la expresión ${expr} con variables ${vars.join(",")}, ¿cuál es la salida para ${vars.map((v, i) => v + "=" + qVals.inputs[i]).join(", ")}? (0 o 1)`;
        return { topic, level, prompt, type: "scalar", expected: String(qVals.output), payload: { expr, vars, table, qVals } };
    }
    if (topic === "funciones-booleanas") {
        const minterms = Array.from({ length: 2 }, () => randInt(0, (1 << vars.length) - 1));
        const prompt = `Función f(${vars.join(",")}) = Σm(${minterms.join(", ")}). ¿Cuál es la forma canónica como suma de productos?`;
        const sop = minterms.map(m => vars.map((v, j) => (m >> (vars.length - 1 - j)) & 1 ? v : `¬${v}`).join("·")).join(" + ");
        return { topic, level, prompt, type: "text", expected: sop, payload: { vars, minterms } };
    }
    if (topic === "simplificacion") {
        const a = randBool(), b = randBool(), c = randBool();
        const expr = `(A·B)+(A·¬B)`;
        const simplified = "A";
        const prompt = `Simplifica: ${expr}. (Usa solo letras, ej: A)`;
        return { topic, level, prompt, type: "text", expected: simplified, payload: { vars: ["A", "B"] } };
    }
    if (topic === "circuitos") {
        const prompt = `¿Cuántas compuertas NAND se necesitan para implementar A·B + ¬A·B? (responde un número)`;
        return { topic, level, prompt, type: "scalar", expected: "4", payload: {} };
    }
    if (topic === "procesadores") {
        const a = randInt(0, 7), b = randInt(0, 7);
        const prompt = `Suma en binario: ${a.toString(2).padStart(4,"0")} + ${b.toString(2).padStart(4,"0")}. ¿Resultado en decimal?`;
        return { topic, level, prompt, type: "scalar", expected: String(a + b), payload: { a, b } };
    }
    if (topic === "optimizacion") {
        const prompt = `Optimiza: if (x && y) || (x && z) → if (x && ( ??? )). Completa el ???`;
        return { topic, level, prompt, type: "text", expected: "y||z", payload: {} };
    }
    return makePractice("variables", 1);
}

function renderPractice() {
    const promptBox = document.getElementById("practicePrompt");
    const feedback = document.getElementById("practiceFeedback");
    const ans = document.getElementById("practiceAnswer");
    const codeEl = document.getElementById("practiceMatlab");
    if (!promptBox) return;
    if (!PRACTICE_STATE) {
        promptBox.innerHTML = '<div class="video-placeholder"><div class="ph-title">Aún no hay reto</div><div class="ph-sub">Genera un reto para empezar.</div></div>';
        codeEl.textContent = "% Genera un reto para ver el código.";
        if (feedback) feedback.innerHTML = "";
        if (ans) ans.value = "";
        return;
    }
    promptBox.innerHTML = `<pre class="practice-pre">${PRACTICE_STATE.prompt}</pre>`;
    if (feedback) feedback.innerHTML = "";
    if (ans) ans.value = "";
    codeEl.textContent = `% Reto de ${PRACTICE_STATE.topic}`;
    ans.focus();
}

function checkPractice() {
    const feedback = document.getElementById("practiceFeedback");
    const ansRaw = (document.getElementById("practiceAnswer")?.value || "").trim();
    if (!PRACTICE_STATE || !ansRaw) { if (feedback) feedback.textContent = "Escribe una respuesta."; return; }
    const norm = s => s.toLowerCase().replace(/\s+/g, "");
    const ok = norm(ansRaw) === norm(String(PRACTICE_STATE.expected));
    if (feedback) {
        feedback.classList.remove("ok", "bad");
        if (ok) {
            feedback.classList.add("ok");
            const gained = 60;
            const key = `prac|${PRACTICE_STATE.topic}|${PRACTICE_STATE.level}|${PRACTICE_STATE.prompt}`;
            const awarded = awardXp(gained, "Práctica", key);
            feedback.innerHTML = awarded ? `✅ Correcto. +${gained} XP` : "✅ Correcto. (ya completado)";
        } else {
            feedback.classList.add("bad");
            feedback.innerHTML = `❌ Incorrecto. Pista: ${practiceHint()}`;
        }
    }
}

function revealPractice() {
    const feedback = document.getElementById("practiceFeedback");
    if (!PRACTICE_STATE || !feedback) return;
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
    document.getElementById("practiceAnswer")?.addEventListener("keydown", (e) => { if (e.key === "Enter") checkPractice(); });
    renderPractice();
}

// ========== VIDEO Y RESEÑAS ==========
function initVideoSection() {
    const DEFAULT = "https://youtu.be/9juarsU2hQo";
    const input = document.getElementById("videoInput");
    const load = () => {
        const url = (input.value || DEFAULT).trim();
        const embed = url.includes("embed") ? url : url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/");
        const wrap = document.getElementById("videoPreviewWrap");
        const ph = document.getElementById("videoPlaceholder");
        wrap.querySelectorAll("iframe").forEach(f => f.remove());
        const iframe = document.createElement("iframe");
        iframe.className = "video-iframe";
        iframe.src = embed;
        iframe.allowFullscreen = true;
        wrap.appendChild(iframe);
        if (ph) ph.style.display = "none";
    };
    document.getElementById("videoLoadBtn")?.addEventListener("click", load);
    document.getElementById("videoClearBtn")?.addEventListener("click", () => {
        input.value = "";
        document.getElementById("videoPreviewWrap").querySelectorAll("iframe").forEach(f => f.remove());
        document.getElementById("videoPlaceholder").style.display = "flex";
    });
    input.value = DEFAULT;
    load();
}

function renderReviews() {
    const list = document.getElementById("reviewsList");
    const arr = JSON.parse(localStorage.getItem("mc_reviews") || "[]");
    list.innerHTML = arr.length ? arr.map(r =>
        `<div class="review-card"><div class="review-name">${r.name || "Anónimo"}</div>
        <div class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}</div>
        <div>${escapeHtml(r.text)}</div></div>`
    ).join("") : "No hay reseñas aún.";
}
function addReview() {
    const name = document.getElementById("revName").value.trim();
    const text = document.getElementById("revText").value.trim();
    const rating = parseInt(document.getElementById("revRating").value);
    if (!text) return;
    const arr = JSON.parse(localStorage.getItem("mc_reviews") || "[]");
    arr.push({ name, rating, text, date: new Date().toLocaleString() });
    localStorage.setItem("mc_reviews", JSON.stringify(arr));
    document.getElementById("revText").value = "";
    renderReviews();
    showToast("Reseña publicada");
}
function clearReviews() {
    localStorage.removeItem("mc_reviews");
    renderReviews();
}

// ========== PARTÍCULAS ==========
(function initParticles() {
    const canvas = document.getElementById("particlesCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;
    const particles = [];
    const count = 60;
    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    for (let i = 0; i < count; i++) particles.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, r: Math.random() * 2 + 1 });
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
    resize();
    window.addEventListener("resize", resize);
    draw();
})();

// ========== INICIALIZACIÓN GLOBAL ==========
document.addEventListener("DOMContentLoaded", () => {
    // Cargar última pestaña o inicio
    const lastTab = localStorage.getItem("mc_last_tab") || "inicio";
    if (document.getElementById(lastTab)) openTab(null, lastTab);
    else openTab(null, "inicio");

    bindTabLinksHard();
    initSidebarSearch();
    initGlobalModalClose();
    initHud();
    initPracticeMode();
    initVideoSection();
    renderReviews();
    renderMissions();
    ensureMiniMissions();
    updateStreak();
    saveXp(loadXp());         // refrescar XP en HUD
    updateLevelHud(loadXp());
    renderAchievements();

    // XP badge click -> perfil
    document.getElementById("xpBadge")?.addEventListener("click", () => openModal("profileModal"));
    document.getElementById("trophyBtn")?.addEventListener("click", () => { renderAchievements(); openModal("achModal"); });
    document.getElementById("resetProgressBtn")?.addEventListener("click", () => {
        if (confirm("¿Reiniciar todo el progreso?")) {
            ["mc_xp","mc_level","mc_done","mc_streak","mc_ach","mc_xp_keys","mc_missions","mc_reviews"].forEach(k => localStorage.removeItem(k));
            location.reload();
        }
    });

    // Scroll progress y botón subir
    window.addEventListener("scroll", () => {
        const scrolled = document.documentElement.scrollTop / (document.documentElement.scrollHeight - window.innerHeight) * 100;
        document.getElementById("scrollProgress").style.width = scrolled + "%";
        document.getElementById("toTopBtn").style.display = window.scrollY > 400 ? "flex" : "none";
    });
    document.getElementById("toTopBtn")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
});
