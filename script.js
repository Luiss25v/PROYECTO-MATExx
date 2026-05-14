// ============================================================
// BOOLEANQUEST - LÓGICA COMPLETA DEL VIDEOJUEGO EDUCATIVO
// Álgebra de Boole, Circuitos, Procesadores y Optimización
// ============================================================

(function() {
    'use strict';

    // -------------------------- CONSTANTES --------------------------
    const STORAGE_KEY = 'booleanquest_save_v1';
    const XP_PER_LESSON = 50;
    const XP_PER_QUIZ = 50;
    const XP_PER_CHALLENGE = { 1: 30, 2: 50, 3: 75 };
    const COINS_PER_QUIZ = 20;
    const COINS_PER_CHALLENGE = { 1: 15, 2: 25, 3: 40 };
    const MAX_LEVEL = 50;
    
    // Datos de lecciones (temas)
    const LESSONS = [
        { id: 'tema1', name: 'Fundamentos', icon: '📖', mapPos: 0 },
        { id: 'tema2', name: 'Variables Booleanas', icon: '🔢', mapPos: 1 },
        { id: 'tema3', name: 'Compuertas Lógicas', icon: '🚪', mapPos: 2 },
        { id: 'tema4', name: 'Tablas de Verdad', icon: '📊', mapPos: 3 },
        { id: 'tema5', name: 'Simplificación', icon: '✂️', mapPos: 4 },
        { id: 'tema6', name: 'Hardware & Circuitos', icon: '💻', mapPos: 5 },
        { id: 'tema7', name: 'Procesadores', icon: '🧠', mapPos: 6 },
        { id: 'tema8', name: 'Optimización de Código', icon: '⚡', mapPos: 7 }
    ];

    // Preguntas de quiz por tema
    const QUIZ_QUESTIONS = {
        tema1: [
            { q: "¿Quién desarrolló el Álgebra de Boole?", options: ["George Boole", "Alan Turing", "Claude Shannon", "John von Neumann"], answer: 0 },
            { q: "¿Cuántos valores maneja el Álgebra de Boole?", options: ["10", "2", "8", "Infinitos"], answer: 1 },
            { q: "¿Qué valor representa 'verdadero' en lógica binaria?", options: ["0", "1", "2", "-1"], answer: 1 },
            { q: "El Álgebra de Boole es fundamental para...", options: ["Solo matemáticas", "Hardware digital", "Solo software", "Redes sociales"], answer: 1 },
            { q: "¿En qué año George Boole publicó su obra principal?", options: ["1900", "1854", "1945", "1800"], answer: 1 }
        ],
        tema2: [
            { q: "¿Qué valores puede tomar una variable booleana?", options: ["0 y 1", "0 a 9", "A y B", "True y False (solo texto)"], answer: 0 },
            { q: "En la función F = A + B, ¿cuándo F=0?", options: ["A=1, B=1", "A=0, B=0", "A=0, B=1", "Nunca"], answer: 1 },
            { q: "¿Cómo se representa la negación de A?", options: ["A + A", "Ā o A'", "A · 1", "A + 0"], answer: 1 },
            { q: "Una función booleana describe...", options: ["Un programa", "Un circuito digital", "Una base de datos", "Un sistema operativo"], answer: 1 },
            { q: "Si tienes 3 variables booleanas, ¿cuántas combinaciones posibles hay?", options: ["6", "8", "9", "3"], answer: 1 }
        ],
        tema3: [
            { q: "¿Qué compuerta tiene salida 1 solo si todas las entradas son 1?", options: ["OR", "AND", "XOR", "NOT"], answer: 1 },
            { q: "La compuerta NOT...", options: ["Suma", "Invierte", "Multiplica", "Duplica"], answer: 1 },
            { q: "¿Qué compuerta es considerada universal (junto con NOR)?", options: ["AND", "OR", "NAND", "XOR"], answer: 2 },
            { q: "La salida de XOR es 1 cuando...", options: ["Entradas iguales", "Entradas diferentes", "Una entrada es 1", "Siempre"], answer: 1 },
            { q: "¿Cuál es el símbolo de la operación AND?", options: ["+", "·", "⊕", "¬"], answer: 1 }
        ],
        tema4: [
            { q: "Una tabla de verdad muestra...", options: ["Solo entradas", "Solo salidas", "Todas las combinaciones", "El circuito físico"], answer: 2 },
            { q: "Para 2 variables, ¿cuántas filas tiene la tabla de verdad?", options: ["2", "4", "8", "16"], answer: 1 },
            { q: "En una tabla de verdad, ¿qué significa F=1?", options: ["Falso", "Verdadero", "Indefinido", "Error"], answer: 1 },
            { q: "¿Qué herramienta se usa para simplificar visualmente?", options: ["Diagrama de flujo", "Mapa de Karnaugh", "Editor de texto", "Calculadora"], answer: 1 },
            { q: "La tabla de verdad ayuda a...", options: ["Diseñar circuitos", "Escribir novelas", "Cocinar", "Navegar"], answer: 0 }
        ],
        tema5: [
            { q: "Simplificar una función booleana sirve para...", options: ["Hacerla más compleja", "Reducir compuertas", "Aumentar costos", "No sirve"], answer: 1 },
            { q: "¿Cuál es una ley de Morgan?", options: ["(A·B)' = A' + B'", "A + 0 = A", "A · 1 = A", "A + A' = 1"], answer: 0 },
            { q: "A + A · B se simplifica a...", options: ["A + B", "A", "B", "A · B"], answer: 1 },
            { q: "¿Qué método es algorítmico para simplificar?", options: ["K-Map", "Quine-McCluskey", "Dibujar", "Probar"], answer: 1 },
            { q: "Simplificar reduce...", options: ["Transistores", "Líneas de código", "Ambas", "Ninguna"], answer: 2 }
        ],
        tema6: [
            { q: "Una compuerta AND se implementa con transistores en...", options: ["Paralelo", "Serie", "Mixto", "Ninguno"], answer: 1 },
            { q: "¿Qué lenguaje describe circuitos digitales?", options: ["Python", "HTML", "Verilog / VHDL", "CSS"], answer: 2 },
            { q: "Un sumador básico usa compuertas...", options: ["AND y OR", "XOR y AND", "NOT y OR", "Solo NAND"], answer: 1 },
            { q: "¿Cuál es la unidad mínima de hardware lógico?", options: ["CPU", "Transistor", "Compuerta lógica", "Registro"], answer: 2 },
            { q: "El Álgebra de Boole es la base de...", options: ["Circuitos integrados", "Motores", "Bombillas", "Pilas"], answer: 0 }
        ],
        tema7: [
            { q: "La ALU de un procesador está construida con...", options: ["Solo software", "Compuertas lógicas", "Memoria RAM", "Baterías"], answer: 1 },
            { q: "¿Qué componente ejecuta operaciones booleanas?", options: ["Disco duro", "ALU", "Pantalla", "Teclado"], answer: 1 },
            { q: "Los registros de la CPU se basan en...", options: ["Flip-flops (biestables)", "Condensadores", "Resistencias", "LEDs"], answer: 0 },
            { q: "Un procesador moderno tiene...", options: ["Cientos de transistores", "Millones de transistores", "Miles de millones", "Solo cables"], answer: 2 },
            { q: "La simplificación booleana en CPUs reduce...", options: ["Consumo energético", "Calor", "Espacio en chip", "Todo lo anterior"], answer: 3 }
        ],
        tema8: [
            { q: "Un compilador optimiza código usando...", options: ["Álgebra booleana", "Solo elimina comentarios", "Cambia nombres", "No optimiza"], answer: 0 },
            { q: "La evaluación de cortocircuito (&&) evita...", options: ["Ejecutar código innecesario", "Ahorrar memoria", "Escribir más líneas", "Nada"], answer: 0 },
            { q: "¿Qué operación es más rápida en CPU?", options: ["División", "AND bit a bit", "Raíz cuadrada", "Logaritmo"], answer: 1 },
            { q: "Simplificar if(x > 0 && x > 5) resulta en...", options: ["if(x > 0)", "if(x > 5)", "if(x == 0)", "No se puede"], answer: 1 },
            { q: "Las optimizaciones booleanas mejoran...", options: ["Rendimiento", "Legibilidad", "Mantenimiento", "Todas"], answer: 3 }
        ]
    };

    // Desafíos (estructura de datos)
    const CHALLENGES = {
        1: {
            id: 1,
            title: "Identifica la Compuerta",
            description: "Observa la tabla de verdad y selecciona la compuerta correcta.",
            generate: function() {
                const gates = [
                    { name: 'AND', table: '00→0, 01→0, 10→0, 11→1' },
                    { name: 'OR', table: '00→0, 01→1, 10→1, 11→1' },
                    { name: 'XOR', table: '00→0, 01→1, 10→1, 11→0' },
                    { name: 'NAND', table: '00→1, 01→1, 10→1, 11→0' },
                    { name: 'NOR', table: '00→1, 01→0, 10→0, 11→0' }
                ];
                const selected = gates[Math.floor(Math.random() * gates.length)];
                return {
                    question: `Tabla: ${selected.table}`,
                    answer: selected.name,
                    inputType: 'select',
                    options: gates.map(g => g.name)
                };
            }
        },
        2: {
            id: 2,
            title: "Simplifica la Expresión",
            description: "Simplifica la siguiente expresión booleana al máximo.",
            generate: function() {
                const pairs = [
                    { expr: "A + A·B", answer: "A" },
                    { expr: "A·(A + B)", answer: "A" },
                    { expr: "(A + B)·(A + B')", answer: "A" },
                    { expr: "A·B + A·B'", answer: "A" },
                    { expr: "A + A'·B", answer: "A + B" }
                ];
                const selected = pairs[Math.floor(Math.random() * pairs.length)];
                return {
                    question: `Simplifica: ${selected.expr}`,
                    answer: selected.answer,
                    inputType: 'text'
                };
            }
        },
        3: {
            id: 3,
            title: "Diseña el Circuito",
            description: "Elige la expresión booleana que corresponde a este circuito: (A AND B) OR (NOT A AND C).",
            generate: function() {
                return {
                    question: "Circuito: (A AND B) OR (NOT A AND C). ¿Expresión equivalente?",
                    answer: "A·B + A'·C",
                    inputType: 'select',
                    options: ["A·B + A'·C", "A + B·C", "A·B·C", "A'·B' + C"]
                };
            }
        }
    };

    // Definición de logros
    const ACHIEVEMENTS = [
        { id: 'first_lesson', name: 'Primer Paso', desc: 'Completa tu primera lección.', icon: '👶', condition: (s) => s.completedLessons.length >= 1 },
        { id: 'half_lessons', name: 'Mitad del Camino', desc: 'Completa 4 lecciones.', icon: '🚶', condition: (s) => s.completedLessons.length >= 4 },
        { id: 'all_lessons', name: 'Maestro Booleano', desc: 'Completa todas las lecciones.', icon: '🧙', condition: (s) => s.completedLessons.length >= 8 },
        { id: 'first_quiz', name: 'Primer Quiz', desc: 'Aprueba tu primer quiz.', icon: '📝', condition: (s) => s.quizzesPassed >= 1 },
        { id: 'quiz_master', name: 'Quiz Master', desc: 'Aprueba 5 quizzes.', icon: '🏅', condition: (s) => s.quizzesPassed >= 5 },
        { id: 'challenge1', name: 'Retador', desc: 'Completa 1 desafío.', icon: '⚔️', condition: (s) => s.challengesCompleted >= 1 },
        { id: 'challenge_all', name: 'Leyenda de Desafíos', desc: 'Completa los 3 desafíos.', icon: '🛡️', condition: (s) => s.challengesCompleted >= 3 },
        { id: 'level5', name: 'Nivel 5', desc: 'Alcanza el nivel 5.', icon: '⬆️', condition: (s) => s.level >= 5 },
        { id: 'level10', name: 'Nivel 10', desc: 'Alcanza el nivel 10.', icon: '🔟', condition: (s) => s.level >= 10 },
        { id: 'coins100', name: 'Ahorrador', desc: 'Acumula 100 monedas.', icon: '🪙', condition: (s) => s.coins >= 100 },
        { id: 'streak3', name: 'Constante', desc: 'Logra una racha de 3 días.', icon: '🔥', condition: (s) => s.streak >= 3 },
        { id: 'simplifier', name: 'Simplificador', desc: 'Usa el simplificador interactivo.', icon: '✂️', condition: (s) => s.usedSimplifier }
    ];

    // -------------------------- ESTADO DEL JUEGO --------------------------
    const defaultState = {
        xp: 0,
        level: 1,
        coins: 0,
        streak: 0,
        lastLoginDate: null,
        completedLessons: [],       // IDs de lecciones completadas
        quizzesPassed: 0,
        challengesCompleted: 0,
        completedChallenges: [],    // IDs de desafíos completados
        achievements: [],           // IDs de logros desbloqueados
        inventory: ['default'],     // Avatares comprados
        activeAvatar: 'default',
        usedSimplifier: false,
        totalStudyTime: 0,          // minutos
        notifications: []
    };

    let gameState = JSON.parse(JSON.stringify(defaultState));

    // -------------------------- UTILIDADES --------------------------
    function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2); }

    function formatTime(minutes) {
        if (minutes < 60) return `${minutes}min`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m > 0 ? m + 'm' : ''}`;
    }

    // -------------------------- PERSISTENCIA --------------------------
    function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }

    function loadState() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Fusionar con default para asegurar nuevas propiedades
                gameState = { ...defaultState, ...parsed };
                // Asegurar arrays y objetos anidados
                gameState.completedLessons = gameState.completedLessons || [];
                gameState.completedChallenges = gameState.completedChallenges || [];
                gameState.achievements = gameState.achievements || [];
                gameState.inventory = gameState.inventory || ['default'];
                gameState.notifications = gameState.notifications || [];
            } catch (e) {
                console.warn('Error al cargar partida, reiniciando.');
                gameState = JSON.parse(JSON.stringify(defaultState));
            }
        }
    }

    // -------------------------- UI HELPERS --------------------------
    function updateAllUI() {
        // Header
        document.getElementById('xp-current').textContent = gameState.xp;
        document.getElementById('level-number').textContent = gameState.level;
        document.getElementById('coins-amount').textContent = gameState.coins;
        document.getElementById('streak-count').textContent = gameState.streak;
        // Barra de progreso global
        const totalLessons = LESSONS.length;
        const completedCount = gameState.completedLessons.length;
        const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
        document.getElementById('global-progress-fill').style.width = `${progressPercent}%`;
        document.getElementById('global-progress-text').textContent = `${Math.round(progressPercent)}% completado`;
        // Sidebar checks
        LESSONS.forEach(lesson => {
            const checkEl = document.getElementById(`check-${lesson.id}`);
            if (checkEl) {
                if (gameState.completedLessons.includes(lesson.id)) {
                    checkEl.classList.add('completed');
                } else {
                    checkEl.classList.remove('completed');
                }
            }
        });
        // Desafíos pendientes
        const pendingChallenges = 3 - gameState.completedChallenges.length;
        document.getElementById('desafios-pendientes').textContent = pendingChallenges > 0 ? pendingChallenges : '✓';
        // Logros desbloqueados
        document.getElementById('logros-desbloqueados').textContent = `${gameState.achievements.length}/12`;
        // Avatar en sidebar
        updateAvatarDisplay();
        // Racha y nivel en sidebar
        document.getElementById('sidebar-username').textContent = gameState.activeAvatar === 'default' ? 'Aprendiz Digital' : 'Ingeniero Booleano';
        document.getElementById('sidebar-rank').textContent = getRankName(gameState.level);
        // Dashboard stats
        document.getElementById('stat-lecciones').textContent = `${gameState.completedLessons.length}/${totalLessons}`;
        document.getElementById('stat-quizzes').textContent = gameState.quizzesPassed;
        document.getElementById('stat-desafios').textContent = gameState.challengesCompleted;
        document.getElementById('stat-tiempo').textContent = formatTime(gameState.totalStudyTime);
        // Mapa de conocimiento
        renderMapNodes();
        // Misión diaria
        updateDailyMission();
        // Logros
        renderAchievements();
    }

    function getRankName(level) {
        if (level >= 20) return 'Arquitecto Digital';
        if (level >= 15) return 'Maestro del Silicio';
        if (level >= 10) return 'Ingeniero Lógico';
        if (level >= 5) return 'Técnico Binario';
        return 'Novato Binario';
    }

    function updateAvatarDisplay() {
        const avatars = { default: '🧑‍💻', avatar1: '👨‍🔧', avatar2: '🤖', avatar3: '🧙' };
        document.getElementById('avatar-display').textContent = avatars[gameState.activeAvatar] || '🧑‍💻';
    }

    function renderMapNodes() {
        const container = document.getElementById('map-nodes-container');
        if (!container) return;
        container.innerHTML = '';
        LESSONS.forEach(lesson => {
            const node = document.createElement('div');
            node.className = 'map-node';
            if (gameState.completedLessons.includes(lesson.id)) node.classList.add('completed');
            if (getCurrentActiveLesson() === lesson.id) node.classList.add('active-node');
            node.innerHTML = `<span class="node-icon">${lesson.icon}</span><span class="node-label">${lesson.name}</span>`;
            node.addEventListener('click', () => navigateTo(lesson.id));
            container.appendChild(node);
        });
    }

    function getCurrentActiveLesson() {
        const idx = gameState.completedLessons.length;
        return idx < LESSONS.length ? LESSONS[idx].id : null;
    }

    function updateDailyMission() {
        const missionDesc = document.getElementById('mission-description');
        const missionStatus = document.getElementById('mission-status');
        const missionBar = document.getElementById('mission-bar');
        if (!missionDesc || !missionStatus || !missionBar) return;
        const completedToday = gameState.completedLessons.length; // Simplificación: misión = completar 1 lección
        missionDesc.textContent = "Completa una lección para ganar XP extra.";
        if (completedToday > 0) {
            missionStatus.textContent = "1/1 completado";
            missionBar.style.width = '100%';
        } else {
            missionStatus.textContent = "0/1 completado";
            missionBar.style.width = '0%';
        }
    }

    function renderAchievements() {
        const grid = document.getElementById('achievements-grid');
        if (!grid) return;
        grid.innerHTML = '';
        ACHIEVEMENTS.forEach(ach => {
            const unlocked = gameState.achievements.includes(ach.id);
            const div = document.createElement('div');
            div.className = `achievement-card ${unlocked ? 'unlocked' : 'locked'}`;
            div.innerHTML = `
                <span class="achievement-icon">${unlocked ? ach.icon : '🔒'}</span>
                <span class="achievement-name">${ach.name}</span>
                <span class="achievement-desc">${ach.desc}</span>
            `;
            grid.appendChild(div);
        });
    }

    // -------------------------- NAVEGACIÓN --------------------------
    function navigateTo(sectionId) {
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
        // Activar sección
        const target = document.getElementById(`section-${sectionId}`);
        if (target) target.classList.add('active');
        // Actualizar breadcrumb
        const lesson = LESSONS.find(l => l.id === sectionId);
        document.getElementById('breadcrumb-text').textContent = lesson ? lesson.name : sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
        // Actualizar sidebar activo
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
        if (activeNav) activeNav.classList.add('active');
        // Cerrar sidebar en móvil
        closeSidebar();
    }

    function openSidebar() {
        document.getElementById('sidebar').classList.add('open');
        document.getElementById('sidebar-overlay').classList.remove('hidden');
    }

    function closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.add('hidden');
    }

    // -------------------------- SISTEMA DE XP Y NIVEL --------------------------
    function addXP(amount) {
        gameState.xp += amount;
        checkLevelUp();
        saveState();
        updateAllUI();
    }

    function addCoins(amount) {
        gameState.coins += amount;
        saveState();
        updateAllUI();
    }

    function checkLevelUp() {
        const xpForNextLevel = gameState.level * 100;
        while (gameState.xp >= xpForNextLevel && gameState.level < MAX_LEVEL) {
            gameState.xp -= xpForNextLevel;
            gameState.level++;
            showToast(`¡Subiste al nivel ${gameState.level}! 🎉`, 'success');
            if (gameState.level % 5 === 0) {
                addCoins(25);
                showToast('¡Bonus por nivel: +25 monedas!', 'info');
            }
        }
    }

    function completeLesson(lessonId) {
        if (!gameState.completedLessons.includes(lessonId)) {
            gameState.completedLessons.push(lessonId);
            addXP(XP_PER_LESSON);
            addCoins(15);
            gameState.totalStudyTime += 5; // 5 min estimados
            showToast(`¡Lección completada! +${XP_PER_LESSON} XP`, 'success');
            saveState();
            updateAllUI();
            checkAchievements();
            // Verificar misión diaria
            updateDailyMission();
        }
    }

    function completeQuiz(lessonId) {
        if (!gameState.completedLessons.includes(lessonId)) {
            completeLesson(lessonId); // Completar lección automáticamente al pasar quiz
        }
        gameState.quizzesPassed++;
        addXP(XP_PER_QUIZ);
        addCoins(COINS_PER_QUIZ);
        saveState();
        updateAllUI();
        checkAchievements();
    }

    function completeChallenge(challengeId) {
        if (!gameState.completedChallenges.includes(challengeId)) {
            gameState.completedChallenges.push(challengeId);
            gameState.challengesCompleted++;
            const xp = XP_PER_CHALLENGE[challengeId] || 30;
            const coins = COINS_PER_CHALLENGE[challengeId] || 15;
            addXP(xp);
            addCoins(coins);
            showToast(`¡Desafío completado! +${xp} XP`, 'success');
            saveState();
            updateAllUI();
            checkAchievements();
        }
    }

    // -------------------------- LOGROS --------------------------
    function checkAchievements() {
        ACHIEVEMENTS.forEach(ach => {
            if (!gameState.achievements.includes(ach.id) && ach.condition(gameState)) {
                gameState.achievements.push(ach.id);
                showToast(`🏆 Logro desbloqueado: ${ach.name}`, 'success');
                addNotification(`Logro: ${ach.name} - ${ach.desc}`);
                // Pequeña recompensa
                addXP(20);
                addCoins(10);
            }
        });
        saveState();
        updateAllUI();
    }

    // -------------------------- NOTIFICACIONES --------------------------
    function addNotification(message) {
        gameState.notifications.unshift({ id: generateId(), message, read: false, timestamp: Date.now() });
        if (gameState.notifications.length > 20) gameState.notifications.pop();
        updateNotificationBadge();
        saveState();
    }

    function updateNotificationBadge() {
        const unread = gameState.notifications.filter(n => !n.read).length;
        const badge = document.getElementById('notification-badge');
        if (badge) {
            badge.textContent = unread;
            badge.classList.toggle('hidden', unread === 0);
        }
    }

    function openNotificationsModal() {
        const list = document.getElementById('notifications-list');
        if (!list) return;
        list.innerHTML = '';
        if (gameState.notifications.length === 0) {
            list.innerHTML = '<p class="no-notifications">No hay notificaciones nuevas.</p>';
        } else {
            gameState.notifications.forEach(n => {
                n.read = true;
                const div = document.createElement('div');
                div.className = 'notification-item';
                div.style.padding = '0.5rem 0';
                div.style.borderBottom = '1px solid var(--border-color)';
                div.textContent = n.message;
                list.appendChild(div);
            });
        }
        updateNotificationBadge();
        saveState();
        document.getElementById('modal-notifications').classList.remove('hidden');
    }

    // -------------------------- TOAST --------------------------
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // -------------------------- MODALES GENÉRICOS --------------------------
    function openModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    }
    function closeModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }

    // -------------------------- SISTEMA DE QUIZ --------------------------
    let quizData = null;
    let currentQuizLesson = null;

    function startQuiz(lessonId) {
        const questions = QUIZ_QUESTIONS[lessonId];
        if (!questions) return;
        currentQuizLesson = lessonId;
        quizData = {
            questions: [...questions],
            currentIndex: 0,
            score: 0,
            timer: 60,
            timerInterval: null,
            answered: false
        };
        document.getElementById('quiz-title').textContent = `Quiz: ${LESSONS.find(l=>l.id===lessonId)?.name || lessonId}`;
        showQuizQuestion();
        openModal('modal-quiz');
        startTimer();
    }

    function showQuizQuestion() {
        if (!quizData || quizData.currentIndex >= quizData.questions.length) {
            finishQuiz();
            return;
        }
        const q = quizData.questions[quizData.currentIndex];
        document.getElementById('quiz-question-text').textContent = q.q;
        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = '';
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.addEventListener('click', () => selectQuizOption(idx, btn));
            optionsContainer.appendChild(btn);
        });
        document.getElementById('quiz-result').classList.add('hidden');
        document.getElementById('btn-next-question').classList.add('hidden');
        document.getElementById('btn-finish-quiz').classList.add('hidden');
        quizData.answered = false;
        updateQuizProgress();
    }

    function selectQuizOption(selectedIndex, btnElement) {
        if (quizData.answered) return;
        quizData.answered = true;
        const q = quizData.questions[quizData.currentIndex];
        const correct = selectedIndex === q.answer;
        if (correct) quizData.score++;
        // Marcar visualmente
        const allOptions = document.querySelectorAll('#quiz-options .quiz-option');
        allOptions.forEach((opt, idx) => {
            opt.classList.add(idx === q.answer ? 'correct' : (idx === selectedIndex ? 'incorrect' : ''));
            opt.disabled = true;
        });
        document.getElementById('quiz-result').classList.remove('hidden');
        document.getElementById('quiz-result').textContent = correct ? '✅ ¡Correcto!' : '❌ Incorrecto';
        if (quizData.currentIndex < quizData.questions.length - 1) {
            document.getElementById('btn-next-question').classList.remove('hidden');
        } else {
            document.getElementById('btn-finish-quiz').classList.remove('hidden');
        }
    }

    function nextQuestion() {
        if (!quizData) return;
        quizData.currentIndex++;
        showQuizQuestion();
    }

    function finishQuiz() {
        clearInterval(quizData.timerInterval);
        const total = quizData.questions.length;
        const score = quizData.score;
        const passed = score >= Math.ceil(total * 0.6); // 60% para aprobar
        document.getElementById('quiz-question-text').textContent = passed ? '🎉 ¡Quiz Aprobado!' : '😞 Inténtalo de nuevo';
        document.getElementById('quiz-options').innerHTML = '';
        document.getElementById('quiz-result').classList.remove('hidden');
        document.getElementById('quiz-result').textContent = `Puntuación: ${score}/${total}`;
        document.getElementById('btn-next-question').classList.add('hidden');
        document.getElementById('btn-finish-quiz').classList.add('hidden');
        if (passed) {
            completeQuiz(currentQuizLesson);
            showRewardModal(`Quiz Completado`, '🧪', XP_PER_QUIZ, COINS_PER_QUIZ);
        }
        setTimeout(() => closeModal('modal-quiz'), 2000);
    }

    function startTimer() {
        if (quizData.timerInterval) clearInterval(quizData.timerInterval);
        quizData.timer = 60;
        document.getElementById('timer-seconds').textContent = quizData.timer;
        quizData.timerInterval = setInterval(() => {
            quizData.timer--;
            document.getElementById('timer-seconds').textContent = quizData.timer;
            if (quizData.timer <= 0) {
                clearInterval(quizData.timerInterval);
                if (!quizData.answered) {
                    // Forzar respuesta incorrecta
                    quizData.answered = true;
                    document.getElementById('quiz-result').classList.remove('hidden');
                    document.getElementById('quiz-result').textContent = '⏰ Tiempo agotado';
                    document.getElementById('btn-finish-quiz').classList.remove('hidden');
                }
            }
        }, 1000);
    }

    function updateQuizProgress() {
        if (!quizData) return;
        const progress = ((quizData.currentIndex + 1) / quizData.questions.length) * 100;
        document.getElementById('quiz-progress-fill').style.width = `${progress}%`;
        document.getElementById('quiz-progress-text').textContent = `Pregunta ${quizData.currentIndex + 1}/${quizData.questions.length}`;
    }

    // -------------------------- RECOMPENSA MODAL --------------------------
    function showRewardModal(title, icon, xp, coins) {
        document.getElementById('reward-title').textContent = title;
        document.getElementById('reward-icon').textContent = icon;
        document.getElementById('reward-message').textContent = `Has ganado:`;
        document.getElementById('reward-xp').textContent = `+${xp} XP  +${coins} 🪙`;
        openModal('modal-reward');
    }

    // -------------------------- SIMULADORES --------------------------
    // Tabla de verdad
    function updateTruthTable() {
        const select = document.getElementById('truth-function-select');
        if (!select) return;
        const func = select.value;
        const tbody = document.getElementById('truth-table-body');
        const colCHeader = document.getElementById('col-c-header');
        if (!tbody) return;
        let combinations = [];
        if (func === 'complex') {
            colCHeader.classList.remove('hidden');
            for (let a = 0; a <= 1; a++)
                for (let b = 0; b <= 1; b++)
                    for (let c = 0; c <= 1; c++)
                        combinations.push([a, b, c]);
        } else {
            colCHeader.classList.add('hidden');
            for (let a = 0; a <= 1; a++)
                for (let b = 0; b <= 1; b++)
                    combinations.push([a, b]);
        }
        tbody.innerHTML = '';
        combinations.forEach(vals => {
            const tr = document.createElement('tr');
            vals.forEach(v => { const td = document.createElement('td'); td.textContent = v; tr.appendChild(td); });
            if (func === 'complex') {
                const c = vals[2];
                const result = (vals[0] && vals[1]) || (!vals[0] && c) ? 1 : 0;
                const td = document.createElement('td'); td.textContent = result; tr.appendChild(td);
            } else {
                let result;
                switch (func) {
                    case 'and': result = vals[0] && vals[1] ? 1 : 0; break;
                    case 'or': result = vals[0] || vals[1] ? 1 : 0; break;
                    case 'xor': result = vals[0] ^ vals[1] ? 1 : 0; break;
                    case 'nand': result = !(vals[0] && vals[1]) ? 1 : 0; break;
                    default: result = 0;
                }
                const td = document.createElement('td'); td.textContent = result; tr.appendChild(td);
            }
            tbody.appendChild(tr);
        });
    }

    // Simplificador interactivo
    function setupSimplifier() {
        const btn = document.getElementById('btn-simplify-step');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const stepsDiv = document.getElementById('simplify-steps');
            stepsDiv.innerHTML = `
                <p>1. Expresión original: <strong>F = A·B + A·B̄</strong></p>
                <p>2. Factor común A: <strong>F = A·(B + B̄)</strong></p>
                <p>3. Teorema: B + B̄ = 1 → <strong>F = A·1</strong></p>
                <p>4. Resultado: <strong>F = A</strong> ✅</p>
            `;
            document.getElementById('simplify-result').textContent = 'F = A';
            if (!gameState.usedSimplifier) {
                gameState.usedSimplifier = true;
                saveState();
                checkAchievements();
            }
        });
    }

    // Simulador de circuito
    function setupCircuitSimulator() {
        const switchA = document.getElementById('switch-a');
        const switchB = document.getElementById('switch-b');
        const gateSelect = document.getElementById('gate-select');
        if (!switchA || !switchB || !gateSelect) return;

        function updateCircuit() {
            const a = switchA.getAttribute('data-state') === '1' ? 1 : 0;
            const b = switchB.getAttribute('data-state') === '1' ? 1 : 0;
            const gate = gateSelect.value;
            let out = 0;
            switch (gate) {
                case 'and': out = a && b ? 1 : 0; break;
                case 'or': out = a || b ? 1 : 0; break;
                case 'xor': out = a ^ b ? 1 : 0; break;
                case 'nand': out = !(a && b) ? 1 : 0; break;
                case 'nor': out = !(a || b) ? 1 : 0; break;
            }
            document.getElementById('wire-a').textContent = `A=${a}`;
            document.getElementById('wire-b').textContent = `B=${b}`;
            document.getElementById('wire-out').textContent = `F=${out}`;
            document.getElementById('gate-display').textContent = gate.toUpperCase();
            // Clases low/high
            ['wire-a', 'wire-b', 'wire-out'].forEach(id => {
                const el = document.getElementById(id);
                const val = parseInt(el.textContent.split('=')[1]);
                el.classList.toggle('low', val === 0);
                el.classList.toggle('high', val === 1);
            });
            switchA.textContent = a ? 'ON' : 'OFF';
            switchB.textContent = b ? 'ON' : 'OFF';
        }

        switchA.addEventListener('click', () => {
            const newState = switchA.getAttribute('data-state') === '1' ? '0' : '1';
            switchA.setAttribute('data-state', newState);
            updateCircuit();
        });
        switchB.addEventListener('click', () => {
            const newState = switchB.getAttribute('data-state') === '1' ? '0' : '1';
            switchB.setAttribute('data-state', newState);
            updateCircuit();
        });
        gateSelect.addEventListener('change', updateCircuit);
        updateCircuit();
    }

    // -------------------------- DESAFÍOS --------------------------
    let currentChallengeId = null;
    let currentChallengeAnswer = null;

    function startChallenge(challengeId) {
        const challenge = CHALLENGES[challengeId];
        if (!challenge) return;
        currentChallengeId = challengeId;
        const data = challenge.generate();
        currentChallengeAnswer = data.answer;
        document.getElementById('challenge-modal-title').textContent = challenge.title;
        const content = document.getElementById('challenge-content');
        content.innerHTML = `
            <p><strong>${data.question}</strong></p>
            ${data.inputType === 'select' ? 
                `<select id="challenge-input" class="quiz-option" style="width:100%; padding:0.7rem; background:var(--bg-tertiary); color:var(--text-primary); border:1px solid var(--border-color); border-radius:8px;">
                    ${data.options.map(o => `<option value="${o}">${o}</option>`).join('')}
                </select>` :
                `<input type="text" id="challenge-input" class="quiz-option" style="width:100%; padding:0.7rem; background:var(--bg-tertiary); color:var(--text-primary); border:1px solid var(--border-color); border-radius:8px;" placeholder="Tu respuesta...">`
            }
        `;
        document.getElementById('challenge-feedback').classList.add('hidden');
        openModal('modal-challenge');
    }

    function submitChallenge() {
        const inputEl = document.getElementById('challenge-input');
        if (!inputEl) return;
        let userAnswer = inputEl.value.trim();
        if (inputEl.tagName === 'SELECT') {
            userAnswer = inputEl.value;
        }
        const feedback = document.getElementById('challenge-feedback');
        feedback.classList.remove('hidden');
        if (userAnswer.toLowerCase() === currentChallengeAnswer.toLowerCase()) {
            feedback.innerHTML = '<p style="color:var(--accent-green)">✅ ¡Correcto! Desafío superado.</p>';
            completeChallenge(currentChallengeId);
            setTimeout(() => closeModal('modal-challenge'), 2000);
        } else {
            feedback.innerHTML = `<p style="color:var(--accent-red)">❌ Incorrecto. La respuesta era: ${currentChallengeAnswer}</p>`;
        }
    }

    // -------------------------- TIENDA --------------------------
    function purchaseItem(itemId) {
        const prices = { avatar1: 100, avatar2: 200, avatar3: 500 };
        const cost = prices[itemId];
        if (!cost) return;
        if (gameState.coins < cost) {
            showToast('No tienes suficientes monedas.', 'error');
            return;
        }
        if (gameState.inventory.includes(itemId)) {
            showToast('Ya posees este avatar.', 'warning');
            return;
        }
        gameState.coins -= cost;
        gameState.inventory.push(itemId);
        gameState.activeAvatar = itemId;
        saveState();
        updateAllUI();
        showToast(`¡Avatar comprado!`, 'success');
    }

    // -------------------------- RACHA DIARIA --------------------------
    function updateStreak() {
        const today = new Date().toDateString();
        const last = gameState.lastLoginDate;
        if (!last) {
            gameState.streak = 1;
        } else {
            const lastDate = new Date(last);
            const diff = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
            if (diff === 1) {
                gameState.streak += 1;
            } else if (diff > 1) {
                gameState.streak = 1;
            }
        }
        gameState.lastLoginDate = today;
        if (gameState.streak >= 3) checkAchievements();
        saveState();
    }

    // -------------------------- INICIALIZACIÓN --------------------------
    function initApp() {
        loadState();
        updateStreak();
        updateAllUI();
        
        // Event Listeners de navegación
        document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                navigateTo(section);
            });
        });

        document.getElementById('btn-toggle-sidebar').addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
        });
        document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

        // Botones de lecciones y quizzes
        LESSONS.forEach(lesson => {
            const quizBtn = document.getElementById(`btn-quiz-${lesson.id}`);
            if (quizBtn) {
                quizBtn.addEventListener('click', () => startQuiz(lesson.id));
            }
        });

        // Desafíos
        document.querySelectorAll('.btn-challenge').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const challengeId = parseInt(e.currentTarget.getAttribute('data-challenge'));
                startChallenge(challengeId);
            });
        });

        // Tienda
        document.querySelectorAll('.btn-shop').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.currentTarget.getAttribute('data-item');
                purchaseItem(item);
            });
        });

        // Modal cerrar
        document.getElementById('btn-close-quiz')?.addEventListener('click', () => closeModal('modal-quiz'));
        document.getElementById('btn-close-notifications')?.addEventListener('click', () => closeModal('modal-notifications'));
        document.getElementById('btn-close-challenge')?.addEventListener('click', () => closeModal('modal-challenge'));
        document.getElementById('btn-claim-reward')?.addEventListener('click', () => closeModal('modal-reward'));
        document.getElementById('btn-next-question')?.addEventListener('click', nextQuestion);
        document.getElementById('btn-finish-quiz')?.addEventListener('click', finishQuiz);
        document.getElementById('btn-submit-challenge')?.addEventListener('click', submitChallenge);
        document.getElementById('btn-notifications')?.addEventListener('click', openNotificationsModal);

        // Simuladores
        const truthSelect = document.getElementById('truth-function-select');
        if (truthSelect) {
            truthSelect.addEventListener('change', updateTruthTable);
            updateTruthTable(); // inicial
        }
        setupSimplifier();
        setupCircuitSimulator();

        // Splash screen
        const loadingBar = document.getElementById('loading-bar');
        const loadingText = document.getElementById('loading-text');
        const enterBtn = document.getElementById('btn-enter');
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                loadingText.textContent = '¡Listo!';
                enterBtn.classList.remove('hidden');
            }
            loadingBar.style.width = `${progress}%`;
            loadingText.textContent = `Cargando módulos... ${Math.floor(progress)}%`;
        }, 200);

        enterBtn.addEventListener('click', () => {
            document.getElementById('splash-screen').classList.add('hidden');
            document.getElementById('app-container').classList.remove('hidden');
            navigateTo('inicio');
            checkAchievements();
        });

        // Manejo de teclas para cerrar modales
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal:not(.hidden)').forEach(m => m.classList.add('hidden'));
            }
        });
    }

    // Arrancar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', initApp);
})();