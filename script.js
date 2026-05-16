// ============================================================
// BOOLE ARCADE - LÓGICA COMPLETA (JUEGOS INTERACTIVOS)
// Álgebra de Boole: Aventura Lógica
// ============================================================

(function() {
    'use strict';

    // -------------------------- DATOS --------------------------
    const LESSONS = [
        { id: 'tema1', name: 'Fundamentos', icon: '📖' },
        { id: 'tema2', name: 'Variables Booleanas', icon: '🔢' },
        { id: 'tema3', name: 'Compuertas Lógicas', icon: '🚪' },
        { id: 'tema4', name: 'Tablas de Verdad', icon: '📊' },
        { id: 'tema5', name: 'Simplificación', icon: '✂️' },
        { id: 'tema6', name: 'Hardware y Circuitos', icon: '💻' },
        { id: 'tema7', name: 'Procesadores', icon: '🧠' },
        { id: 'tema8', name: 'Optimización de Código', icon: '⚡' }
    ];

    const THEORY = {
        tema1: 'El Álgebra de Boole usa solo dos valores: <b>0 (falso)</b> y <b>1 (verdadero)</b>. Es la base de la electrónica digital.',
        tema2: 'Una <b>variable booleana</b> representa una entrada (0 o 1). Las funciones combinan variables con operadores lógicos.',
        tema3: 'Las <b>compuertas lógicas</b> (AND, OR, NOT) son circuitos electrónicos que implementan operaciones booleanas.',
        tema4: 'Una <b>tabla de verdad</b> lista todas las combinaciones de entrada y la salida de una función lógica.',
        tema5: '<b>Simplificar</b> una expresión booleana reduce el número de compuertas necesarias en un circuito.',
        tema6: 'Los circuitos digitales se construyen interconectando compuertas lógicas. Se diseñan con lenguajes como Verilog.',
        tema7: 'La <b>ALU</b> (Unidad Aritmético Lógica) de un procesador realiza operaciones usando compuertas booleanas.',
        tema8: 'Los compiladores <b>optimizan</b> código aplicando reglas booleanas para reducir instrucciones y acelerar la ejecución.'
    };

    const ACHIEVEMENTS = [
        { id: 'first_lesson', name: 'Primer Paso', icon: '👶', condition: s => s.completedLessons.length >= 1 },
        { id: 'half_lessons', name: 'Mitad del Camino', icon: '🚶', condition: s => s.completedLessons.length >= 4 },
        { id: 'all_lessons', name: 'Maestro Booleano', icon: '🧙', condition: s => s.completedLessons.length >= 8 },
        { id: 'level5', name: 'Nivel 5', icon: '⬆️', condition: s => s.level >= 5 },
        { id: 'level10', name: 'Nivel 10', icon: '🔟', condition: s => s.level >= 10 },
        { id: 'coins100', name: 'Ahorrador', icon: '🪙', condition: s => s.coins >= 100 }
    ];

    // -------------------------- ESTADO DEL JUEGO --------------------------
    let gameState = {
        xp: 0,
        level: 1,
        coins: 0,
        streak: 1,
        completedLessons: [],
        achievements: [],
        inventory: ['default'],
        activeAvatar: 'default',
        totalStudyTime: 0
    };

    // -------------------------- UTILIDADES --------------------------
    function updateUI() {
        document.getElementById('xp-current').textContent = gameState.xp;
        document.getElementById('level-number').textContent = gameState.level;
        document.getElementById('coins-amount').textContent = gameState.coins;
        document.getElementById('streak-count').textContent = gameState.streak;
        const avatars = { default: '🧑‍💻', avatar1: '👨‍🔧', avatar2: '🤖', avatar3: '🧙' };
        document.getElementById('avatar-display').textContent = avatars[gameState.activeAvatar] || '🧑‍💻';
        document.getElementById('sidebar-rank').textContent = gameState.level >= 10 ? 'Maestro Digital' : gameState.level >= 5 ? 'Ingeniero Lógico' : 'Novato Binario';

        // Actualizar candados del menú
        LESSONS.forEach((l, idx) => {
            const lockEl = document.getElementById('lock-' + l.id);
            if (lockEl) {
                const isUnlocked = idx === 0 || gameState.completedLessons.includes(LESSONS[idx-1].id);
                lockEl.textContent = isUnlocked ? '🔓' : '🔒';
            }
        });

        if (document.getElementById('section-inicio').classList.contains('active')) {
            renderInicio();
        }
    }

    function showToast(msg) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = msg;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function isLessonUnlocked(lessonId) {
        const idx = LESSONS.findIndex(l => l.id === lessonId);
        if (idx === 0) return true;
        return gameState.completedLessons.includes(LESSONS[idx-1].id);
    }

    // -------------------------- NAVEGACIÓN --------------------------
    function navigateTo(sectionId, tab = 'game') {
        if (LESSONS.some(l => l.id === sectionId) && !isLessonUnlocked(sectionId)) {
            showToast('🔒 Debes completar la misión anterior.');
            return;
        }

        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));

        if (['inicio', 'logros', 'tienda'].includes(sectionId)) {
            let sec = document.getElementById('section-' + sectionId);
            if (!sec) {
                sec = document.createElement('section');
                sec.id = 'section-' + sectionId;
                sec.className = 'content-section';
                document.getElementById('main-content').appendChild(sec);
            }
            sec.classList.add('active');
            if (sectionId === 'inicio') renderInicio();
            else if (sectionId === 'logros') renderLogros();
            else if (sectionId === 'tienda') renderTienda();
        } else {
            // Es un tema: cargar su juego
            let sec = document.getElementById('section-' + sectionId);
            if (!sec) {
                sec = document.createElement('section');
                sec.id = 'section-' + sectionId;
                sec.className = 'content-section';
                document.getElementById('main-content').appendChild(sec);
            }
            sec.classList.add('active');
            renderLessonGame(sectionId, sec);
        }

        // Actualizar clase activa en el menú
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
        if (activeNav) activeNav.classList.add('active');

        // Cerrar sidebar en móvil
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.add('hidden');
    }

    // -------------------------- CENTRO DE MANDO --------------------------
    function renderInicio() {
        const section = document.getElementById('section-inicio');
        if (!section) return;

        const nextLesson = LESSONS.find(l => !gameState.completedLessons.includes(l.id));
        const missionText = nextLesson
            ? `Misión: ${nextLesson.icon} ${nextLesson.name}`
            : '¡Todas las misiones completadas!';

        section.innerHTML = `
            <h2 class="section-title" style="font-size:2rem;">⚡ Centro de Mando</h2>
            <div class="mission-card">
                <h3 style="font-family:var(--font-display); color:var(--accent-purple);">${missionText}</h3>
                <p style="color:var(--text-secondary); margin:0.8rem 0;">
                    Supera los minijuegos para desbloquear nuevos temas y ganar recompensas.
                </p>
                ${nextLesson
                    ? '<button class="btn-mission" id="btn-start-mission">▶ INICIAR MISIÓN</button>'
                    : '<p style="color:var(--accent-green);">¡Felicidades! Has completado el entrenamiento.</p>'}
            </div>
            <h3 style="font-family:var(--font-display); color:var(--accent-cyan); margin-bottom:0.8rem;">🗺️ Progreso</h3>
            <div class="progress-grid" id="progress-nodes"></div>
            <div class="stats-row" style="margin-top:1.5rem;">
                <div class="stat-card">
                    <span style="font-size:2rem;">📚</span>
                    <div>
                        <span style="font-size:1.8rem; font-weight:700; color:var(--accent-cyan);">${gameState.completedLessons.length}/8</span>
                        <span style="font-size:0.85rem; color:var(--text-muted);">Lecciones</span>
                    </div>
                </div>
                <div class="stat-card">
                    <span style="font-size:2rem;">⚡</span>
                    <div>
                        <span style="font-size:1.8rem; font-weight:700; color:var(--accent-cyan);">${gameState.xp}</span>
                        <span style="font-size:0.85rem; color:var(--text-muted);">XP Total</span>
                    </div>
                </div>
                <div class="stat-card">
                    <span style="font-size:2rem;">🪙</span>
                    <div>
                        <span style="font-size:1.8rem; font-weight:700; color:var(--accent-cyan);">${gameState.coins}</span>
                        <span style="font-size:0.85rem; color:var(--text-muted);">Monedas</span>
                    </div>
                </div>
            </div>
        `;

        const grid = document.getElementById('progress-nodes');
        LESSONS.forEach(l => {
            const node = document.createElement('div');
            node.className = 'progress-node';
            if (gameState.completedLessons.includes(l.id)) node.classList.add('completed');
            if (nextLesson && l.id === nextLesson.id) node.classList.add('current');
            if (!isLessonUnlocked(l.id)) node.classList.add('locked');
            node.innerHTML = `<span style="font-size:1.8rem; display:block;">${l.icon}</span><span style="font-size:0.8rem;">${l.name}</span>`;
            node.addEventListener('click', () => {
                if (isLessonUnlocked(l.id)) navigateTo(l.id);
            });
            grid.appendChild(node);
        });

        if (nextLesson) {
            document.getElementById('btn-start-mission')?.addEventListener('click', () => navigateTo(nextLesson.id));
        }
    }

    function renderLogros() {
        const sec = document.getElementById('section-logros');
        let html = '<h2 class="section-title">🎖️ Logros</h2><div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px,1fr)); gap:1rem;">';
        ACHIEVEMENTS.forEach(a => {
            const unlocked = gameState.achievements.includes(a.id);
            html += `<div class="stat-card" style="flex-direction:column; text-align:center; opacity:${unlocked ? 1 : 0.4}">
                <span style="font-size:2rem;">${unlocked ? a.icon : '🔒'}</span>
                <span>${a.name}</span>
            </div>`;
        });
        html += '</div>';
        sec.innerHTML = html;
    }

    function renderTienda() {
        const sec = document.getElementById('section-tienda');
        sec.innerHTML = `
            <h2 class="section-title">🛒 Tienda</h2>
            <div class="mission-card">🧑‍💻 Avatar Ingeniero 🪙100 <button class="btn-shop btn-primary" data-item="avatar1">Comprar</button></div>
            <div class="mission-card">🤖 Avatar Robot 🪙200 <button class="btn-shop btn-primary" data-item="avatar2">Comprar</button></div>
            <div class="mission-card">🧙 Avatar Mago 🪙500 <button class="btn-shop btn-primary" data-item="avatar3">Comprar</button></div>
        `;
        sec.querySelectorAll('.btn-shop').forEach(b => {
            b.addEventListener('click', e => {
                const item = e.target.dataset.item;
                const prices = { avatar1: 100, avatar2: 200, avatar3: 500 };
                if (gameState.coins >= prices[item] && !gameState.inventory.includes(item)) {
                    gameState.coins -= prices[item];
                    gameState.inventory.push(item);
                    gameState.activeAvatar = item;
                    updateUI();
                    showToast('¡Avatar comprado!');
                } else {
                    showToast('No tienes monedas o ya lo tienes.');
                }
            });
        });
    }

    // -------------------------- SISTEMA DE PROGRESO --------------------------
    function addXP(amount) { gameState.xp += amount; checkLevelUp(); updateUI(); }
    function addCoins(amount) { gameState.coins += amount; updateUI(); }

    function checkLevelUp() {
        while (gameState.xp >= gameState.level * 100 && gameState.level < 50) {
            gameState.xp -= gameState.level * 100;
            gameState.level++;
            showToast('🎉 ¡Subiste al nivel ' + gameState.level + '!');
        }
    }

    function completeLesson(lessonId) {
        if (!gameState.completedLessons.includes(lessonId)) {
            gameState.completedLessons.push(lessonId);
            addXP(50);
            addCoins(15);
            gameState.totalStudyTime += 5;
            showToast('✅ Misión completada +50 XP');
            checkAchievements();
        }
    }

    function checkAchievements() {
        ACHIEVEMENTS.forEach(a => {
            if (!gameState.achievements.includes(a.id) && a.condition(gameState)) {
                gameState.achievements.push(a.id);
                showToast('🏅 Logro: ' + a.name);
                addXP(20);
                addCoins(10);
            }
        });
        updateUI();
    }

    // -------------------------- CARGA DE JUEGOS --------------------------
    function renderLessonGame(lessonId, container) {
        const lesson = LESSONS.find(l => l.id === lessonId);
        const completed = gameState.completedLessons.includes(lessonId);
        const areaId = 'game-area-' + lessonId;

        container.innerHTML = `
            <h2 class="section-title">${lesson.icon} ${lesson.name}</h2>
            <div class="mission-card">
                <p style="font-weight:600;">📘 ${THEORY[lessonId]}</p>
                ${completed ? '<p style="color:var(--accent-green); margin-top:0.5rem;">✅ Misión completada.</p>' : ''}
            </div>
            <div class="game-container" id="${areaId}">
                <p style="text-align:center; color:var(--text-secondary);">Cargando juego...</p>
            </div>
        `;

        if (!completed) {
            // Limpiar posibles variables globales residuales
            window.toggleCell = undefined;
            window._selectedQ = undefined;

            switch (lessonId) {
                case 'tema1': initFundamentosGame(areaId); break;
                case 'tema2': initVariablesGame(areaId); break;
                case 'tema3': initCompuertasGame(areaId); break;
                case 'tema4': initTablasGame(areaId); break;
                case 'tema5': initSimplificacionGame(areaId); break;
                case 'tema6': initHardwareGame(areaId); break;
                case 'tema7': initProcesadoresGame(areaId); break;
                case 'tema8': initOptimizacionGame(areaId); break;
            }
        }
    }

    // -------------------------- JUEGOS --------------------------

    // Juego 1: Fundamentos - Clasificar afirmaciones
    function initFundamentosGame(areaId) {
        const area = document.getElementById(areaId);
        const afirmaciones = [
            { texto: 'El Álgebra de Boole usa los valores 0 y 1.', correcto: 1 },
            { texto: 'George Boole publicó su obra en 1854.', correcto: 1 },
            { texto: 'El Álgebra de Boole solo sirve para matemáticas puras.', correcto: 0 },
            { texto: 'Los circuitos digitales se basan en dos estados (0 y 1).', correcto: 1 },
            { texto: 'El valor 0 representa "verdadero".', correcto: 0 }
        ];

        area.innerHTML = `<p style="margin-bottom:1rem;">Arrastra cada afirmación a <b>1 (Verdadero)</b> o <b>0 (Falso)</b>:</p>
        <div style="display:flex; gap:2rem; flex-wrap:wrap;">
            <div style="flex:1; min-width:200px;">
                <h4 style="color:var(--accent-green);">✅ 1 (Verdadero)</h4>
                <div id="drop-1-${areaId}" class="game-container" style="min-height:100px; border:2px dashed var(--accent-green);"></div>
            </div>
            <div style="flex:1; min-width:200px;">
                <h4 style="color:var(--accent-red);">❌ 0 (Falso)</h4>
                <div id="drop-0-${areaId}" class="game-container" style="min-height:100px; border:2px dashed var(--accent-red);"></div>
            </div>
        </div>
        <div id="options-pool-${areaId}" style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:1rem;"></div>
        <button id="btn-check-${areaId}" class="btn-primary" style="margin-top:1rem;">Verificar</button>
        <p id="feedback-${areaId}" style="margin-top:0.5rem; font-weight:600;"></p>`;

        const pool = document.getElementById('options-pool-' + areaId);
        afirmaciones.forEach((a, i) => {
            const opt = document.createElement('span');
            opt.className = 'game-option';
            opt.textContent = a.texto;
            opt.draggable = true;
            opt.dataset.index = i;
            opt.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', i));
            pool.appendChild(opt);
        });

        const drop1 = document.getElementById('drop-1-' + areaId);
        const drop0 = document.getElementById('drop-0-' + areaId);
        [drop1, drop0].forEach(drop => {
            drop.addEventListener('dragover', e => e.preventDefault());
            drop.addEventListener('drop', e => {
                e.preventDefault();
                const idx = e.dataTransfer.getData('text/plain');
                const el = document.querySelector(`.game-option[data-index="${idx}"]`);
                if (el) drop.appendChild(el);
            });
        });

        document.getElementById('btn-check-' + areaId).addEventListener('click', () => {
            const correctas = afirmaciones.filter((a, i) => {
                const el = document.querySelector(`.game-option[data-index="${i}"]`);
                const parent = el?.parentElement.id;
                return (parent === 'drop-1-' + areaId && a.correcto === 1) ||
                       (parent === 'drop-0-' + areaId && a.correcto === 0);
            }).length;
            const fb = document.getElementById('feedback-' + areaId);
            if (correctas === afirmaciones.length) {
                fb.textContent = '¡Correcto! Has clasificado todas las afirmaciones.';
                fb.style.color = 'var(--accent-green)';
                completeLesson('tema1');
                setTimeout(() => navigateTo('inicio'), 1500);
            } else {
                fb.textContent = `Tienes ${correctas} de ${afirmaciones.length} correctas. ¡Sigue intentando!`;
                fb.style.color = 'var(--accent-red)';
            }
        });
    }

    // Juego 2: Variables - Valores para F=1
    function initVariablesGame(areaId) {
        const area = document.getElementById(areaId);
        const funciones = [
            { expr: 'F = A + B', values: {A:1, B:1}, desc: 'OR: F=1 si A o B son 1' },
            { expr: 'F = A · B', values: {A:1, B:1}, desc: 'AND: F=1 solo si ambas son 1' },
            { expr: 'F = A ⊕ B', values: {A:1, B:0}, desc: 'XOR: F=1 si A y B son diferentes' }
        ];
        let current = 0, aciertos = 0;

        function mostrar() {
            if (current >= funciones.length) {
                area.innerHTML = `<p style="color:var(--accent-green);">¡Juego completado! Aciertos: ${aciertos}/${funciones.length}</p>`;
                completeLesson('tema2');
                setTimeout(() => navigateTo('inicio'), 1500);
                return;
            }
            const f = funciones[current];
            area.innerHTML = `<p>Para <b>${f.expr}</b> (${f.desc}), ¿qué valores hacen F=1?</p>
            <div style="display:flex; gap:1rem; margin:1rem 0;">
                <label>A: <input type="number" id="input-a-${areaId}" min="0" max="1" value="0" style="width:60px; padding:0.4rem; background:var(--bg-tertiary); color:var(--text-primary); border:1px solid var(--border-color);"></label>
                <label>B: <input type="number" id="input-b-${areaId}" min="0" max="1" value="0" style="width:60px; padding:0.4rem; background:var(--bg-tertiary); color:var(--text-primary); border:1px solid var(--border-color);"></label>
            </div>
            <button id="btn-verify-${areaId}" class="btn-primary">Verificar</button>
            <p id="var-feedback-${areaId}" style="margin-top:0.5rem;"></p>`;

            document.getElementById('btn-verify-' + areaId).addEventListener('click', () => {
                const a = parseInt(document.getElementById('input-a-' + areaId).value);
                const b = parseInt(document.getElementById('input-b-' + areaId).value);
                const fb = document.getElementById('var-feedback-' + areaId);
                if (a === f.values.A && b === f.values.B) {
                    aciertos++;
                    fb.textContent = '¡Correcto!';
                    fb.style.color = 'var(--accent-green)';
                    current++;
                    setTimeout(mostrar, 800);
                } else {
                    fb.textContent = 'Incorrecto, intenta de nuevo.';
                    fb.style.color = 'var(--accent-red)';
                }
            });
        }
        mostrar();
    }

    // Juego 3: Compuertas - Elegir la correcta
    function initCompuertasGame(areaId) {
        const area = document.getElementById(areaId);
        const gates = [
            { tabla: '00→0, 01→1, 10→1, 11→1', nombre: 'OR' },
            { tabla: '00→0, 01→0, 10→0, 11→1', nombre: 'AND' },
            { tabla: '00→0, 01→1, 10→1, 11→0', nombre: 'XOR' }
        ];
        let idx = 0, aciertos = 0;

        function mostrar() {
            if (idx >= gates.length) {
                area.innerHTML = `<p style="color:var(--accent-green);">¡Juego completado! Aciertos: ${aciertos}/${gates.length}</p>`;
                completeLesson('tema3');
                setTimeout(() => navigateTo('inicio'), 1500);
                return;
            }
            const g = gates[idx];
            area.innerHTML = `<p>Tabla de verdad: <b>${g.tabla}</b></p><p>Selecciona la compuerta correcta:</p>
            <div id="gate-options-${areaId}" style="display:flex; gap:0.5rem; flex-wrap:wrap;"></div>
            <p id="gate-feedback-${areaId}" style="margin-top:0.5rem;"></p>`;

            const div = document.getElementById('gate-options-' + areaId);
            ['AND', 'OR', 'NOT', 'XOR', 'NAND'].forEach(o => {
                const btn = document.createElement('button');
                btn.className = 'game-option';
                btn.textContent = o;
                btn.addEventListener('click', () => {
                    const fb = document.getElementById('gate-feedback-' + areaId);
                    if (o === g.nombre) {
                        aciertos++;
                        fb.textContent = '¡Correcto!';
                        fb.style.color = 'var(--accent-green)';
                        idx++;
                        setTimeout(mostrar, 800);
                    } else {
                        fb.textContent = 'Incorrecto, intenta de nuevo.';
                        fb.style.color = 'var(--accent-red)';
                    }
                });
                div.appendChild(btn);
            });
        }
        mostrar();
    }

    // Juego 4: Tablas de Verdad - Completar celdas
    function initTablasGame(areaId) {
        const area = document.getElementById(areaId);
        const tabla = [
            { A:0, B:0, F:0 }, { A:0, B:1, F:1 }, { A:1, B:0, F:1 }, { A:1, B:1, F:0 }
        ];
        let respuestas = new Array(4).fill(null);

        function mostrar() {
            area.innerHTML = `<p>Completa la tabla de verdad para <b>A XOR B</b> (haz clic en 0 o 1):</p>
            <table style="width:100%; text-align:center; border-collapse:collapse;">
                <tr style="background:var(--bg-tertiary);"><th>A</th><th>B</th><th>F</th></tr>
                ${tabla.map((t,i) => `<tr>
                    <td>${t.A}</td><td>${t.B}</td>
                    <td id="cell-${i}-${areaId}" style="cursor:pointer; background:${respuestas[i]!==null ? (respuestas[i]===t.F?'#1a3a2a':'#3a1a1a') : 'var(--bg-secondary)'};">
                        ${respuestas[i]!==null ? respuestas[i] : '?'}
                    </td>
                </tr>`).join('')}
            </table>
            <button id="btn-check-tabla-${areaId}" class="btn-primary" style="margin-top:1rem;">Verificar</button>
            <p id="tabla-feedback-${areaId}" style="margin-top:0.5rem;"></p>`;

            tabla.forEach((t, i) => {
                const cell = document.getElementById(`cell-${i}-${areaId}`);
                if (cell) {
                    cell.addEventListener('click', () => {
                        respuestas[i] = respuestas[i] === 0 ? 1 : 0;
                        mostrar();
                    });
                }
            });

            document.getElementById('btn-check-tabla-' + areaId).addEventListener('click', () => {
                const ok = tabla.every((t,i) => respuestas[i] === t.F);
                const fb = document.getElementById('tabla-feedback-' + areaId);
                if (ok) {
                    fb.textContent = '¡Tabla correcta!';
                    fb.style.color = 'var(--accent-green)';
                    completeLesson('tema4');
                    setTimeout(() => navigateTo('inicio'), 1500);
                } else {
                    fb.textContent = 'Aún no es correcta. Revisa las combinaciones.';
                    fb.style.color = 'var(--accent-red)';
                }
            });
        }
        mostrar();
    }

    // Juego 5: Simplificación - Elegir resultado
    function initSimplificacionGame(areaId) {
        const area = document.getElementById(areaId);
        const pasos = [
            { expr: "F = A·B + A·B'", solucion: 'A' },
            { expr: 'F = A + A·B', solucion: 'A' }
        ];
        let current = 0, aciertos = 0;

        function mostrar() {
            if (current >= pasos.length) {
                area.innerHTML = `<p style="color:var(--accent-green);">¡Juego completado! Aciertos: ${aciertos}/${pasos.length}</p>`;
                completeLesson('tema5');
                setTimeout(() => navigateTo('inicio'), 1500);
                return;
            }
            const p = pasos[current];
            area.innerHTML = `<p>Simplifica: <b>${p.expr}</b></p>
            <p>Elige el resultado simplificado:</p>
            <div id="simp-options-${areaId}" style="display:flex; gap:0.5rem; flex-wrap:wrap;"></div>
            <p id="simp-feedback-${areaId}" style="margin-top:0.5rem;"></p>`;

            const div = document.getElementById('simp-options-' + areaId);
            ['A', 'B', 'A·B', 'A+B'].forEach(o => {
                const btn = document.createElement('button');
                btn.className = 'game-option';
                btn.textContent = o;
                btn.addEventListener('click', () => {
                    const fb = document.getElementById('simp-feedback-' + areaId);
                    if (o === p.solucion) {
                        aciertos++;
                        fb.textContent = '¡Correcto!';
                        fb.style.color = 'var(--accent-green)';
                        current++;
                        setTimeout(mostrar, 800);
                    } else {
                        fb.textContent = 'Incorrecto. Intenta de nuevo.';
                        fb.style.color = 'var(--accent-red)';
                    }
                });
                div.appendChild(btn);
            });
        }
        mostrar();
    }

    // Juego 6: Hardware - Relacionar compuertas con transistores
    function initHardwareGame(areaId) {
        const area = document.getElementById(areaId);
        area.innerHTML = `<p>Relaciona cada compuerta con su implementación en transistores:</p>
        <div style="display:flex; gap:2rem;">
            <div id="hw-questions-${areaId}" style="flex:1;"></div>
            <div id="hw-answers-${areaId}" style="flex:1;"></div>
        </div>
        <button id="btn-check-hw-${areaId}" class="btn-primary" style="margin-top:1rem;">Verificar</button>
        <p id="hw-feedback-${areaId}" style="margin-top:1rem;"></p>`;

        const pares = [
            { q: 'AND', a: 'Transistores en serie' },
            { q: 'OR', a: 'Transistores en paralelo' },
            { q: 'NOT', a: 'Un solo transistor inversor' }
        ];
        let seleccion = {};
        window._selectedQ = undefined;

        const qDiv = document.getElementById('hw-questions-' + areaId);
        const aDiv = document.getElementById('hw-answers-' + areaId);

        pares.forEach(p => {
            const qEl = document.createElement('div');
            qEl.className = 'game-option';
            qEl.textContent = p.q;
            qEl.addEventListener('click', () => {
                qDiv.querySelectorAll('.game-option').forEach(e => e.classList.remove('selected'));
                qEl.classList.add('selected');
                window._selectedQ = p.q;
            });
            qDiv.appendChild(qEl);
        });

        ['Transistores en serie', 'Transistores en paralelo', 'Un solo transistor inversor'].forEach(a => {
            const aEl = document.createElement('div');
            aEl.className = 'game-option';
            aEl.textContent = a;
            aEl.addEventListener('click', () => {
                if (window._selectedQ) {
                    seleccion[window._selectedQ] = a;
                    document.getElementById('hw-feedback-' + areaId).textContent = `Asignado: ${window._selectedQ} → ${a}`;
                    window._selectedQ = undefined;
                    qDiv.querySelectorAll('.game-option').forEach(e => e.classList.remove('selected'));
                }
            });
            aDiv.appendChild(aEl);
        });

        document.getElementById('btn-check-hw-' + areaId).addEventListener('click', () => {
            const correct = pares.every(p => seleccion[p.q] === p.a);
            const fb = document.getElementById('hw-feedback-' + areaId);
            if (correct) {
                fb.textContent = '¡Correcto! Has conectado el hardware.';
                fb.style.color = 'var(--accent-green)';
                completeLesson('tema6');
                setTimeout(() => navigateTo('inicio'), 1500);
            } else {
                fb.textContent = 'Alguna conexión es incorrecta. Revisa.';
                fb.style.color = 'var(--accent-red)';
            }
        });
    }

    // Juego 7: Procesadores - Ordenar pasos de la ALU
    function initProcesadoresGame(areaId) {
        const area = document.getElementById(areaId);
        const pasos = ['Obtener instrucción', 'Decodificar', 'Ejecutar en ALU', 'Escribir resultado'];

        area.innerHTML = `<p>Ordena los pasos de ejecución de una instrucción en la CPU:</p>
        <div id="sortable-list-${areaId}" style="display:flex; flex-direction:column; gap:0.5rem; margin:1rem 0;"></div>
        <button id="btn-check-cpu-${areaId}" class="btn-primary">Verificar</button>
        <p id="cpu-feedback-${areaId}" style="margin-top:0.5rem;"></p>`;

        const list = document.getElementById('sortable-list-' + areaId);
        const shuffled = [...pasos].sort(() => Math.random() - 0.5);
        shuffled.forEach(p => {
            const item = document.createElement('div');
            item.className = 'game-option';
            item.textContent = p;
            item.draggable = true;
            item.dataset.paso = p;
            item.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', p));
            list.appendChild(item);
        });

        list.addEventListener('dragover', e => e.preventDefault());
        list.addEventListener('drop', e => {
            e.preventDefault();
            const draggedPaso = e.dataTransfer.getData('text/plain');
            const target = e.target.closest('.game-option');
            if (target && target.dataset.paso !== draggedPaso) {
                const children = [...list.children];
                const draggedEl = children.find(c => c.dataset.paso === draggedPaso);
                const targetIdx = children.indexOf(target);
                const draggedIdx = children.indexOf(draggedEl);
                if (draggedIdx < targetIdx) {
                    list.insertBefore(draggedEl, target.nextSibling);
                } else {
                    list.insertBefore(draggedEl, target);
                }
            }
        });

        document.getElementById('btn-check-cpu-' + areaId).addEventListener('click', () => {
            const currentOrder = [...list.children].map(c => c.dataset.paso);
            const correct = JSON.stringify(currentOrder) === JSON.stringify(pasos);
            const fb = document.getElementById('cpu-feedback-' + areaId);
            if (correct) {
                fb.textContent = '¡Orden correcto! La ALU ejecuta las operaciones.';
                fb.style.color = 'var(--accent-green)';
                completeLesson('tema7');
                setTimeout(() => navigateTo('inicio'), 1500);
            } else {
                fb.textContent = 'El orden no es el correcto. Revisa el ciclo de instrucción.';
                fb.style.color = 'var(--accent-red)';
            }
        });
    }

    // Juego 8: Optimización de Código - Elegir código más eficiente
    function initOptimizacionGame(areaId) {
        const area = document.getElementById(areaId);
        const casos = [
            { a: 'if (x > 0 && x > 5)', b: 'if (x > 5)', correcto: 'b' },
            { a: 'if (a == true)', b: 'if (a)', correcto: 'b' }
        ];
        let current = 0, aciertos = 0;

        function mostrar() {
            if (current >= casos.length) {
                area.innerHTML = `<p style="color:var(--accent-green);">¡Juego completado! Aciertos: ${aciertos}/${casos.length}</p>`;
                completeLesson('tema8');
                setTimeout(() => navigateTo('inicio'), 1500);
                return;
            }
            const c = casos[current];
            area.innerHTML = `<p>¿Cuál es la versión más optimizada?</p>
            <div style="display:flex; gap:1rem; flex-wrap:wrap;">
                <div class="game-option" id="opt-a-${areaId}" style="cursor:pointer;">${c.a}</div>
                <div class="game-option" id="opt-b-${areaId}" style="cursor:pointer;">${c.b}</div>
            </div>
            <p id="opt-feedback-${areaId}" style="margin-top:0.5rem;"></p>`;

            document.getElementById('opt-a-' + areaId).addEventListener('click', () => verificar('a'));
            document.getElementById('opt-b-' + areaId).addEventListener('click', () => verificar('b'));

            function verificar(elegido) {
                const fb = document.getElementById('opt-feedback-' + areaId);
                if (elegido === c.correcto) {
                    aciertos++;
                    fb.textContent = '¡Correcto! Es más eficiente.';
                    fb.style.color = 'var(--accent-green)';
                    current++;
                    setTimeout(mostrar, 800);
                } else {
                    fb.textContent = 'Incorrecto. Esa no es la versión más rápida.';
                    fb.style.color = 'var(--accent-red)';
                }
            }
        }
        mostrar();
    }

    // -------------------------- INICIALIZACIÓN --------------------------
    window.addEventListener('DOMContentLoaded', () => {
        updateUI();

        // Splash
        setTimeout(() => {
            document.getElementById('loading-bar').style.width = '100%';
            document.getElementById('loading-text').textContent = '¡Listo!';
        }, 300);
        setTimeout(() => document.getElementById('btn-enter').classList.remove('hidden'), 2500);

        document.getElementById('btn-enter').addEventListener('click', () => {
            document.getElementById('splash-screen').classList.add('hidden');
            document.getElementById('app-container').classList.remove('hidden');
            navigateTo('inicio');
        });

        // Sidebar
        document.getElementById('btn-toggle-sidebar').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
            document.getElementById('sidebar-overlay').classList.toggle('hidden');
        });
        document.getElementById('sidebar-overlay').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('sidebar-overlay').classList.add('hidden');
        });

        // Navegación principal
        document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                const tab = e.currentTarget.dataset.tab || 'game';
                navigateTo(section, tab);
            });
        });

        // Toggle submenús
        document.querySelectorAll('[data-toggle]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const target = document.getElementById(btn.dataset.toggle);
                if (target) target.classList.toggle('hidden');
            });
        });

        // Pantalla completa
        document.getElementById('btn-fullscreen').addEventListener('click', () => {
            document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
        });

        // Tecla Escape para cerrar modales (si quedara alguno)
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal:not(.hidden)').forEach(m => m.classList.add('hidden'));
            }
        });
    });
})();
