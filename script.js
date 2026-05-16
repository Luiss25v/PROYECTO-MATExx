// ============================================================
// BOOLEANQUEST - LÓGICA MEJORADA (SIN PERSISTENCIA, PROGRESO BLOQUEADO)
// Álgebra de Boole, Circuitos, Procesadores y Optimización
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
        tema1: '<h3>📖 Fundamentos</h3><p>El Álgebra de Boole es un sistema matemático de <strong>George Boole</strong> (1854) con valores <strong>0 (falso)</strong> y <strong>1 (verdadero)</strong>. Es la base del hardware digital: los circuitos solo entienden dos estados.</p>',
        tema2: '<h3>🔢 Variables y Funciones Booleanas</h3><p>Una variable booleana (A, B, C...) toma 0 o 1. Una función combina variables con operadores (AND, OR, NOT). Ej: <code>F = A·B + Ā·C</code> describe un multiplexor.</p>',
        tema3: '<h3>🚪 Compuertas Lógicas</h3><p>AND, OR, NOT, NAND, NOR, XOR, XNOR implementan las operaciones booleanas con transistores. Son los bloques de construcción de CPUs y memorias.</p>',
        tema4: '<h3>📊 Tablas de Verdad</h3><p>Muestran todas las combinaciones de entradas y salidas. Para n variables hay 2<sup>n</sup> filas. Fundamental para diseñar y verificar circuitos.</p>',
        tema5: '<h3>✂️ Simplificación</h3><p>Reducir expresiones minimiza compuertas, ahorrando energía y espacio. Métodos: teoremas algebraicos, Mapas de Karnaugh, Quine-McCluskey.</p>',
        tema6: '<h3>💻 Del Álgebra al Hardware</h3><p>Cada función se sintetiza en un circuito con compuertas. Los diseños se describen con lenguajes como Verilog o VHDL.</p>',
        tema7: '<h3>🧠 Procesadores</h3><p>Una CPU tiene miles de millones de compuertas. La ALU usa lógica booleana (sumador con XOR y AND).</p>',
        tema8: '<h3>⚡ Optimización de Código</h3><p>Los compiladores aplican álgebra booleana para simplificar condiciones (<code>if(x>0 && x>5) → if(x>5)</code>) y reducir instrucciones.</p>'
    };

    const QUIZ_QUESTIONS = {
        tema1: [
            { q: "¿Quién desarrolló el Álgebra de Boole?", options: ["George Boole", "Alan Turing", "Claude Shannon", "John von Neumann"], answer: 0 },
            { q: "¿Cuántos valores maneja?", options: ["10", "2", "8", "Infinitos"], answer: 1 },
            { q: "¿Qué valor representa 'verdadero'?", options: ["0", "1", "2", "-1"], answer: 1 },
            { q: "Es fundamental para...", options: ["Solo matemáticas", "Hardware digital", "Solo software", "Redes sociales"], answer: 1 },
            { q: "Año de publicación de Boole", options: ["1900", "1854", "1945", "1800"], answer: 1 }
        ],
        tema2: [
            { q: "Valores de una variable booleana", options: ["0 y 1", "0 a 9", "A y B", "Solo texto"], answer: 0 },
            { q: "F = A + B, ¿cuándo F=0?", options: ["A=1,B=1", "A=0,B=0", "A=0,B=1", "Nunca"], answer: 1 },
            { q: "Negación de A", options: ["A + A", "Ā o A'", "A · 1", "A + 0"], answer: 1 },
            { q: "Una función booleana describe un...", options: ["Programa", "Circuito digital", "Base de datos", "SO"], answer: 1 },
            { q: "3 variables, combinaciones", options: ["6", "8", "9", "3"], answer: 1 }
        ],
        tema3: [
            { q: "Compuerta AND: salida 1 si...", options: ["Alguna es 1", "Todas son 1", "Son diferentes", "Ninguna"], answer: 1 },
            { q: "La compuerta NOT...", options: ["Suma", "Invierte", "Multiplica", "Duplica"], answer: 1 },
            { q: "Compuerta universal", options: ["AND", "OR", "NAND", "XOR"], answer: 2 },
            { q: "XOR es 1 cuando...", options: ["Iguales", "Diferentes", "Una es 1", "Siempre"], answer: 1 },
            { q: "Símbolo AND", options: ["+", "·", "⊕", "¬"], answer: 1 }
        ],
        tema4: [
            { q: "La tabla de verdad muestra...", options: ["Solo entradas", "Todas las combinaciones", "Solo salidas", "Circuito físico"], answer: 1 },
            { q: "2 variables, ¿cuántas filas?", options: ["2", "4", "8", "16"], answer: 1 },
            { q: "F=1 significa...", options: ["Falso", "Verdadero", "Indefinido", "Error"], answer: 1 },
            { q: "Herramienta visual para simplificar", options: ["Diagrama de flujo", "Mapa de Karnaugh", "Editor de texto", "Calculadora"], answer: 1 },
            { q: "La tabla ayuda a...", options: ["Diseñar circuitos", "Escribir novelas", "Cocinar", "Navegar"], answer: 0 }
        ],
        tema5: [
            { q: "Simplificar reduce...", options: ["Complejidad", "Compuertas", "Ambas", "Nada"], answer: 1 },
            { q: "Ley de Morgan", options: ["(A·B)' = A' + B'", "A + 0 = A", "A · 1 = A", "A + A' = 1"], answer: 0 },
            { q: "A + A·B = ?", options: ["A + B", "A", "B", "A·B"], answer: 1 },
            { q: "Método algorítmico", options: ["K-Map", "Quine-McCluskey", "Dibujar", "Probar"], answer: 1 },
            { q: "Simplificar ahorra...", options: ["Transistores", "Código", "Ambas", "Ninguna"], answer: 2 }
        ],
        tema6: [
            { q: "AND en hardware con transistores en...", options: ["Paralelo", "Serie", "Mixto", "Ninguno"], answer: 1 },
            { q: "Lenguaje de descripción de hardware", options: ["Python", "HTML", "Verilog/VHDL", "CSS"], answer: 2 },
            { q: "Sumador básico usa...", options: ["AND y OR", "XOR y AND", "NOT y OR", "Solo NAND"], answer: 1 },
            { q: "Unidad mínima lógica", options: ["CPU", "Transistor", "Compuerta lógica", "Registro"], answer: 2 },
            { q: "Base de circuitos integrados", options: ["Álgebra de Boole", "Motores", "Bombillas", "Pilas"], answer: 0 }
        ],
        tema7: [
            { q: "La ALU se construye con...", options: ["Solo software", "Compuertas lógicas", "RAM", "Baterías"], answer: 1 },
            { q: "Ejecuta operaciones booleanas", options: ["Disco duro", "ALU", "Pantalla", "Teclado"], answer: 1 },
            { q: "Registros se basan en...", options: ["Flip-flops", "Condensadores", "Resistencias", "LEDs"], answer: 0 },
            { q: "Transistores en CPU moderno", options: ["Cientos", "Millones", "Miles de millones", "Cables"], answer: 2 },
            { q: "Simplificación reduce...", options: ["Consumo", "Calor", "Espacio", "Todo"], answer: 3 }
        ],
        tema8: [
            { q: "Compilador optimiza con...", options: ["Álgebra booleana", "Eliminar comentarios", "Cambiar nombres", "Nada"], answer: 0 },
            { q: "Cortocircuito (&&) evita...", options: ["Código innecesario", "Memoria", "Escribir", "Nada"], answer: 0 },
            { q: "Operación más rápida", options: ["División", "AND bit a bit", "Raíz cuadrada", "Logaritmo"], answer: 1 },
            { q: "if(x>0 && x>5) ->", options: ["if(x>0)", "if(x>5)", "if(x==0)", "No"], answer: 1 },
            { q: "Optimizaciones mejoran...", options: ["Rendimiento", "Legibilidad", "Mantenimiento", "Todas"], answer: 3 }
        ]
    };

    const ACHIEVEMENTS = [
        { id: 'first_lesson', name: 'Primer Paso', icon: '👶', condition: s => s.completedLessons.length >= 1 },
        { id: 'half_lessons', name: 'Mitad del Camino', icon: '🚶', condition: s => s.completedLessons.length >= 4 },
        { id: 'all_lessons', name: 'Maestro Booleano', icon: '🧙', condition: s => s.completedLessons.length >= 8 },
        { id: 'first_quiz', name: 'Primer Quiz', icon: '📝', condition: s => s.quizzesPassed >= 1 },
        { id: 'quiz_master', name: 'Quiz Master', icon: '🏅', condition: s => s.quizzesPassed >= 5 },
        { id: 'challenge1', name: 'Retador', icon: '⚔️', condition: s => s.challengesCompleted >= 1 },
        { id: 'challenge_all', name: 'Leyenda', icon: '🛡️', condition: s => s.challengesCompleted >= 3 },
        { id: 'level5', name: 'Nivel 5', icon: '⬆️', condition: s => s.level >= 5 },
        { id: 'level10', name: 'Nivel 10', icon: '🔟', condition: s => s.level >= 10 },
        { id: 'coins100', name: 'Ahorrador', icon: '🪙', condition: s => s.coins >= 100 }
    ];

    // -------------------------- ESTADO FRESCO POR SESIÓN --------------------------
    let gameState = {
        xp: 0,
        level: 1,
        coins: 0,
        streak: 1,
        completedLessons: [],
        quizzesPassed: 0,
        challengesCompleted: 0,
        completedChallenges: [],
        achievements: [],
        inventory: ['default'],
        activeAvatar: 'default',
        totalStudyTime: 0,
        notifications: []
    };

    // -------------------------- UTILIDADES --------------------------
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function updateUI() {
        document.getElementById('xp-current').textContent = gameState.xp;
        document.getElementById('level-number').textContent = gameState.level;
        document.getElementById('coins-amount').textContent = gameState.coins;
        document.getElementById('streak-count').textContent = gameState.streak;
        const avatars = { default: '🧑‍💻', avatar1: '👨‍🔧', avatar2: '🤖', avatar3: '🧙' };
        document.getElementById('avatar-display').textContent = avatars[gameState.activeAvatar] || '🧑‍💻';
        document.getElementById('sidebar-rank').textContent = gameState.level >= 10 ? 'Maestro Digital' : gameState.level >= 5 ? 'Ingeniero Lógico' : 'Novato Binario';
        LESSONS.forEach((l, idx) => {
            const lockEl = document.getElementById('lock-' + l.id);
            if (lockEl) {
                const isUnlocked = idx === 0 || gameState.completedLessons.includes(LESSONS[idx-1].id);
                lockEl.textContent = isUnlocked ? '🔓' : '🔒';
            }
        });
        updateNotificationBadge();
        if (document.getElementById('section-inicio').classList.contains('active')) renderInicio();
    }

    function showToast(msg) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.style.cssText = 'background:var(--bg-card); padding:0.8rem 1.2rem; border-radius:var(--radius-md); border:1px solid var(--border-color); font-weight:600; animation: fadeIn 0.3s ease;';
        toast.textContent = msg;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity='0'; setTimeout(()=>toast.remove(),300); }, 3000);
    }

    function updateNotificationBadge() {
        const badge = document.getElementById('notification-badge');
        const unread = gameState.notifications.filter(n=>!n.read).length;
        badge.textContent = unread;
        badge.style.display = unread > 0 ? 'flex' : 'none';
    }

    function isLessonUnlocked(lessonId) {
        const idx = LESSONS.findIndex(l => l.id === lessonId);
        if (idx === 0) return true;
        return gameState.completedLessons.includes(LESSONS[idx-1].id);
    }

    // -------------------------- NAVEGACIÓN --------------------------
    function navigateTo(sectionId, tab = 'teoria') {
        if (LESSONS.some(l => l.id === sectionId) && !isLessonUnlocked(sectionId)) {
            showToast('🔒 Debes completar el tema anterior primero.');
            return;
        }
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        if (['inicio', 'desafios', 'logros', 'tienda'].includes(sectionId)) {
            let section = document.getElementById('section-' + sectionId);
            if (!section) {
                section = document.createElement('section');
                section.id = 'section-' + sectionId;
                section.className = 'content-section';
                document.getElementById('main-content').appendChild(section);
            }
            section.classList.add('active');
            if (sectionId === 'inicio') renderInicio();
            else if (sectionId === 'desafios') renderDesafios();
            else if (sectionId === 'logros') renderLogros();
            else if (sectionId === 'tienda') renderTienda();
        } else {
            let section = document.getElementById('section-' + sectionId);
            if (!section) {
                section = document.createElement('section');
                section.id = 'section-' + sectionId;
                section.className = 'content-section';
                document.getElementById('main-content').appendChild(section);
            }
            section.innerHTML = '';
            section.classList.add('active');
            const lesson = LESSONS.find(l => l.id === sectionId);
            const isCompleted = gameState.completedLessons.includes(sectionId);
            if (tab === 'teoria') {
                const nextIdx = LESSONS.findIndex(l => l.id === sectionId) + 1;
                const canGoNext = isCompleted && nextIdx < LESSONS.length;
                section.innerHTML = `
                    <h2 class="section-title">${lesson.icon} ${lesson.name}</h2>
                    <div class="mission-card">${THEORY[sectionId] || ''}</div>
                    <div style="display:flex; gap:1rem; margin-top:1rem;">
                        <button class="btn-secondary" id="btn-prev">← Anterior</button>
                        <button class="btn-primary" id="btn-go-quiz">🧪 Ir al Quiz</button>
                        <button class="btn-secondary" id="btn-next" ${canGoNext ? '' : 'disabled'}>Siguiente →</button>
                    </div>
                    ${!isCompleted ? '<p style="color:var(--accent-yellow); margin-top:0.5rem;">⚠️ Debes aprobar el quiz para completar esta lección.</p>' : '<p style="color:var(--accent-green);">✅ Lección completada.</p>'}
                `;
                section.querySelector('#btn-prev').addEventListener('click', () => {
                    const idx = LESSONS.findIndex(l => l.id === sectionId);
                    if (idx > 0) navigateTo(LESSONS[idx-1].id, 'teoria');
                });
                section.querySelector('#btn-go-quiz').addEventListener('click', () => navigateTo(sectionId, 'quiz'));
                section.querySelector('#btn-next').addEventListener('click', () => {
                    if (canGoNext) navigateTo(LESSONS[nextIdx].id, 'teoria');
                });
            } else if (tab === 'quiz') {
                section.innerHTML = `
                    <h2 class="section-title">${lesson.icon} Quiz: ${lesson.name}</h2>
                    <p style="color:var(--text-secondary); margin-bottom:1rem;">Responde correctamente al menos 3 de 5 preguntas para aprobar.</p>
                    <button class="btn-primary" id="btn-start-quiz">▶️ Iniciar Quiz</button>
                    <button class="btn-secondary" style="margin-left:1rem;" id="btn-back-teoria">← Volver a Teoría</button>
                    ${isCompleted ? '<p style="color:var(--accent-green); margin-top:1rem;">✅ Ya has aprobado este quiz.</p>' : ''}
                `;
                section.querySelector('#btn-start-quiz').addEventListener('click', () => startQuiz(sectionId));
                section.querySelector('#btn-back-teoria').addEventListener('click', () => navigateTo(sectionId, 'teoria'));
            }
        }
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
        if (activeNav) activeNav.classList.add('active');
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.add('hidden');
    }

    // -------------------------- CENTRO DE MANDO --------------------------
    function renderInicio() {
        const section = document.getElementById('section-inicio');
        if (!section) return;
        const nextLesson = LESSONS.find(l => !gameState.completedLessons.includes(l.id));
        const missionText = nextLesson ? `Misión: ${nextLesson.icon} ${nextLesson.name}` : '¡Todas las misiones completadas!';
        section.innerHTML = `
            <h2 class="section-title" style="font-size:2rem;">⚡ Centro de Mando</h2>
            <div class="mission-card">
                <h3 style="font-family:var(--font-display); color:var(--accent-purple);">${missionText}</h3>
                <p style="color:var(--text-secondary); margin:0.8rem 0;">El Álgebra de Boole es la base de todo el hardware digital. ¡Prepárate para dominarla!</p>
                ${nextLesson ? `<button class="btn-mission" id="btn-start-mission">▶ INICIAR MISIÓN</button>` : '<p style="color:var(--accent-green);">¡Felicidades, Agente! Has completado el entrenamiento.</p>'}
            </div>
            <h3 style="font-family:var(--font-display); color:var(--accent-cyan); margin-bottom:0.8rem;">🗺️ Progreso</h3>
            <div class="progress-grid" id="progress-nodes"></div>
            <div class="stats-row" style="margin-top:1.5rem;">
                <div class="stat-card"><span class="stat-icon">📚</span><div><span class="stat-value">${gameState.completedLessons.length}/8</span><span class="stat-label">Lecciones</span></div></div>
                <div class="stat-card"><span class="stat-icon">✅</span><div><span class="stat-value">${gameState.quizzesPassed}</span><span class="stat-label">Quizzes</span></div></div>
                <div class="stat-card"><span class="stat-icon">⚔️</span><div><span class="stat-value">${gameState.challengesCompleted}</span><span class="stat-label">Desafíos</span></div></div>
                <div class="stat-card"><span class="stat-icon">⏱️</span><div><span class="stat-value">${gameState.totalStudyTime}min</span><span class="stat-label">Estudio</span></div></div>
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
                if (isLessonUnlocked(l.id)) navigateTo(l.id, 'teoria');
            });
            grid.appendChild(node);
        });
        if (nextLesson) {
            document.getElementById('btn-start-mission')?.addEventListener('click', () => navigateTo(nextLesson.id, 'teoria'));
        }
    }

    function renderDesafios() {
        const section = document.getElementById('section-desafios');
        section.innerHTML = `<h2 class="section-title">⚔️ Desafíos</h2>
            <div class="mission-card"><h3>Desafío 1: Identifica la Compuerta</h3><button class="btn-primary btn-challenge" data-id="1">Enfrentar</button></div>
            <div class="mission-card"><h3>Desafío 2: Simplifica</h3><button class="btn-primary btn-challenge" data-id="2">Enfrentar</button></div>
            <div class="mission-card"><h3>Desafío 3: Diseña el Circuito</h3><button class="btn-primary btn-challenge" data-id="3">Enfrentar</button></div>`;
        section.querySelectorAll('.btn-challenge').forEach(b => b.addEventListener('click', e => startChallenge(parseInt(e.target.dataset.id))));
    }

    function renderLogros() {
        const section = document.getElementById('section-logros');
        let html = '<h2 class="section-title">🎖️ Logros</h2><div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px,1fr)); gap:1rem;">';
        ACHIEVEMENTS.forEach(a => {
            const unlocked = gameState.achievements.includes(a.id);
            html += `<div class="stat-card" style="flex-direction:column; text-align:center; opacity:${unlocked?1:0.4}"><span style="font-size:2rem;">${unlocked?a.icon:'🔒'}</span><span>${a.name}</span></div>`;
        });
        html += '</div>';
        section.innerHTML = html;
    }

    function renderTienda() {
        const section = document.getElementById('section-tienda');
        section.innerHTML = `
            <h2 class="section-title">🛒 Tienda</h2>
            <div class="mission-card">🧑‍💻 Avatar Ingeniero 🪙100 <button class="btn-shop btn-primary" data-item="avatar1">Comprar</button></div>
            <div class="mission-card">🤖 Avatar Robot 🪙200 <button class="btn-shop btn-primary" data-item="avatar2">Comprar</button></div>
            <div class="mission-card">🧙 Avatar Mago 🪙500 <button class="btn-shop btn-primary" data-item="avatar3">Comprar</button></div>`;
        section.querySelectorAll('.btn-shop').forEach(b => b.addEventListener('click', e => {
            const item = e.target.dataset.item;
            const prices = { avatar1:100, avatar2:200, avatar3:500 };
            if (gameState.coins >= prices[item] && !gameState.inventory.includes(item)) {
                gameState.coins -= prices[item];
                gameState.inventory.push(item);
                gameState.activeAvatar = item;
                updateUI();
                showToast('¡Avatar comprado!');
            } else showToast('No tienes monedas o ya lo tienes.');
        }));
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
            addXP(50); addCoins(15);
            gameState.totalStudyTime += 5;
            showToast('✅ Lección completada +50 XP');
            checkAchievements();
        }
    }
    function completeQuiz(lessonId) {
        completeLesson(lessonId);
        gameState.quizzesPassed++;
        addXP(50); addCoins(20);
        checkAchievements();
    }
    function completeChallenge(id) {
        if (!gameState.completedChallenges.includes(id)) {
            gameState.completedChallenges.push(id);
            gameState.challengesCompleted++;
            const rewards = {1:[30,15], 2:[50,25], 3:[75,40]};
            const [xp, coins] = rewards[id] || [30,15];
            addXP(xp); addCoins(coins);
            showToast('🏆 ¡Desafío completado!');
            checkAchievements();
        }
    }
    function checkAchievements() {
        ACHIEVEMENTS.forEach(a => {
            if (!gameState.achievements.includes(a.id) && a.condition(gameState)) {
                gameState.achievements.push(a.id);
                showToast('🏅 Logro: ' + a.name);
                addXP(20); addCoins(10);
            }
        });
        updateUI();
    }

    // -------------------------- QUIZ MEJORADO --------------------------
    let quizData = null, currentQuizLesson = null;
    function startQuiz(lessonId) {
        currentQuizLesson = lessonId;
        const questions = QUIZ_QUESTIONS[lessonId].map(q => ({...q}));
        quizData = {
            questions: shuffleArray(questions),
            currentIndex: 0,
            score: 0,
            answered: false
        };
        document.getElementById('quiz-title').textContent = 'Quiz: ' + (LESSONS.find(l=>l.id===lessonId)?.name || '');
        document.getElementById('modal-quiz').classList.remove('hidden');
        document.getElementById('btn-retry-quiz').classList.add('hidden');
        showQuestion();
    }
    function showQuestion() {
        if (quizData.currentIndex >= quizData.questions.length) { finishQuiz(); return; }
        const q = quizData.questions[quizData.currentIndex];
        document.getElementById('quiz-question-text').textContent = `Pregunta ${quizData.currentIndex+1}/${quizData.questions.length}: ${q.q}`;
        const opts = document.getElementById('quiz-options');
        opts.innerHTML = '';
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.addEventListener('click', () => selectAnswer(i));
            opts.appendChild(btn);
        });
        document.getElementById('quiz-result-text').classList.add('hidden');
        document.getElementById('btn-next-question').classList.add('hidden');
        document.getElementById('btn-finish-quiz').classList.add('hidden');
        quizData.answered = false;
    }
    function selectAnswer(index) {
        if (quizData.answered) return;
        quizData.answered = true;
        const q = quizData.questions[quizData.currentIndex];
        const correct = index === q.answer;
        if (correct) quizData.score++;
        const options = document.querySelectorAll('.quiz-option');
        options.forEach((btn, i) => {
            btn.classList.add('disabled');
            if (i === q.answer) btn.classList.add('correct');
            else if (i === index && !correct) btn.classList.add('incorrect');
        });
        const resultEl = document.getElementById('quiz-result-text');
        resultEl.classList.remove('hidden');
        resultEl.textContent = correct ? '✅ ¡Correcto!' : '❌ Incorrecto';
        resultEl.style.color = correct ? 'var(--accent-green)' : 'var(--accent-red)';
        if (quizData.currentIndex < quizData.questions.length - 1) {
            document.getElementById('btn-next-question').classList.remove('hidden');
        } else {
            document.getElementById('btn-finish-quiz').classList.remove('hidden');
        }
    }
    function nextQuestion() { quizData.currentIndex++; showQuestion(); }
    function finishQuiz() {
        const total = quizData.questions.length;
        const passed = quizData.score >= 3;
        document.getElementById('quiz-options').innerHTML = '';
        document.getElementById('btn-next-question').classList.add('hidden');
        document.getElementById('btn-finish-quiz').classList.add('hidden');
        const resultEl = document.getElementById('quiz-result-text');
        resultEl.classList.remove('hidden');
        if (passed) {
            resultEl.textContent = `🎉 ¡Aprobado! Puntuación: ${quizData.score}/${total}`;
            resultEl.style.color = 'var(--accent-green)';
            completeQuiz(currentQuizLesson);
            setTimeout(() => {
                document.getElementById('modal-quiz').classList.add('hidden');
                navigateTo(currentQuizLesson, 'teoria');
            }, 2000);
        } else {
            resultEl.textContent = `😞 No aprobado. Puntuación: ${quizData.score}/${total} (necesitas 3/5)`;
            resultEl.style.color = 'var(--accent-red)';
            document.getElementById('btn-retry-quiz').classList.remove('hidden');
        }
    }
    function retryQuiz() { if (currentQuizLesson) startQuiz(currentQuizLesson); }

    // -------------------------- DESAFÍOS --------------------------
    function startChallenge(id) {
        const challenges = {
            1: { title:'Identifica la Compuerta', q:'Tabla: 00→0, 01→1, 10→1, 11→1', answer:'OR', inputType:'select', options:['AND','OR','XOR','NAND'] },
            2: { title:'Simplifica', q:'Simplifica: A + A·B', answer:'A', inputType:'text' },
            3: { title:'Diseña el Circuito', q:'Circuito: (A AND B) OR (NOT A AND C). Expresión:', answer:'A·B + A\'·C', inputType:'select', options:['A·B + A\'·C','A + B·C','A·B·C','A\'·B\' + C'] }
        };
        const c = challenges[id];
        document.getElementById('challenge-modal-title').textContent = c.title;
        document.getElementById('challenge-content').innerHTML = `
            <p style="font-weight:600;">${c.q}</p>
            ${c.inputType === 'select' ? 
                `<select id="challenge-input" style="width:100%;padding:0.6rem;background:var(--bg-tertiary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius-sm);">${c.options.map(o=>`<option value="${o}">${o}</option>`).join('')}</select>` :
                `<input id="challenge-input" style="width:100%;padding:0.6rem;background:var(--bg-tertiary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius-sm);" placeholder="Tu respuesta">`
            }
        `;
        document.getElementById('challenge-feedback').classList.add('hidden');
        document.getElementById('modal-challenge').classList.remove('hidden');
        window._currentChallenge = { id, answer: c.answer };
    }
    function submitChallenge() {
        const input = document.getElementById('challenge-input');
        const answer = input.value.trim();
        const fb = document.getElementById('challenge-feedback');
        fb.classList.remove('hidden');
        if (answer.toLowerCase() === window._currentChallenge.answer.toLowerCase()) {
            fb.innerHTML = '<p style="color:var(--accent-green);">✅ Correcto!</p>';
            completeChallenge(window._currentChallenge.id);
            setTimeout(() => document.getElementById('modal-challenge').classList.add('hidden'), 1500);
        } else {
            fb.innerHTML = '<p style="color:var(--accent-red);">❌ Incorrecto. Intenta de nuevo.</p>';
        }
    }

    // -------------------------- INICIALIZACIÓN --------------------------
    window.addEventListener('DOMContentLoaded', () => {
        updateUI();
        // Splash
        setTimeout(() => {
            document.getElementById('loading-bar').style.width = '100%';
            document.getElementById('loading-text').textContent = 'Sistema listo';
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
        // Navegación
        document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                const tab = e.currentTarget.dataset.tab || 'teoria';
                navigateTo(section, tab);
            });
        });
        document.querySelectorAll('[data-toggle]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById(btn.dataset.toggle).classList.toggle('hidden');
            });
        });
        // Pantalla completa
        document.getElementById('btn-fullscreen').addEventListener('click', () => {
            document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
        });
        // Modales
        document.getElementById('btn-close-quiz').addEventListener('click', () => document.getElementById('modal-quiz').classList.add('hidden'));
        document.getElementById('btn-close-challenge').addEventListener('click', () => document.getElementById('modal-challenge').classList.add('hidden'));
        document.getElementById('btn-next-question').addEventListener('click', nextQuestion);
        document.getElementById('btn-finish-quiz').addEventListener('click', finishQuiz);
        document.getElementById('btn-retry-quiz').addEventListener('click', retryQuiz);
        document.getElementById('btn-submit-challenge').addEventListener('click', submitChallenge);
        document.getElementById('btn-notifications').addEventListener('click', () => {
            document.getElementById('notifications-list').innerHTML = gameState.notifications.length ? gameState.notifications.map(n => '<p>'+n.message+'</p>').join('') : '<p>Sin notificaciones</p>';
            document.getElementById('modal-notifications').classList.remove('hidden');
        });
        document.getElementById('btn-close-notifications').addEventListener('click', () => document.getElementById('modal-notifications').classList.add('hidden'));
        // Escape global
        window.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.modal:not(.hidden)').forEach(m => m.classList.add('hidden')); });
    });
})();
