const DURACION_DEFAULT = 24 * 3600;

const GROSERAS = [
    "¡GROSERA!",
    "¡FEA!",
    "¡SIGUELE!",
    "¡ME CAES MAL!",
    "¡BAÑESE COCHINA!",
    "¡MEJOR NADOTA!",
    "¡OJALA TE JALEN LAS PATAS CUANDO DUERMAS!",
    "¡ÑIÑIÑIÑIÑIÑIÑI!",
];

const MENSAJES_LINDOS = [
    "A VECES CAES BIEN",
    "POQUIIIITO MENOS GROSERA",
    "YA TE EMPEZASTE A BAÑAR",
    "TE PERDONO",
    "YA MEJOR RESPONDEME",
    "YA NO ME CAES TAN MAL",
];

const COLORS = ['#ff6eb4', '#ff9ed2', '#ffd6f0', '#ffb3da', '#ff82c3', '#e040a0', '#f7a8d8'];

let rol = '';
let horasAgregadas = 0;
let yaVibrado = false;

// iniciar timer si no existe
if (!localStorage.getItem("finTiempo")) {
    localStorage.setItem("finTiempo", Date.now() + DURACION_DEFAULT * 1000);
}

/* ───────────── CRONÓMETRO ───────────── */

function renderCronometro() {
    let fin = Number(localStorage.getItem("finTiempo"));
    let restante = Math.max(0, Math.floor((fin - Date.now()) / 1000));

    const h = String(Math.floor(restante / 3600)).padStart(2, '0');
    const m = String(Math.floor((restante % 3600) / 60)).padStart(2, '0');
    const s = String(restante % 60).padStart(2, '0');

    document.getElementById('cronometro').textContent = `${h}:${m}:${s}`;

    return restante;
}

function resetTemporizador() {
    localStorage.setItem(
        "finTiempo",
        Date.now() + DURACION_DEFAULT * 1000
    );

    horasAgregadas = 0;
    yaVibrado = false;

    actualizarBadge();

    document.getElementById("mensajeFinal").textContent = "";

    renderCronometro();
}
/* ───────────── PETALOS ───────────── */

function crearPetalos() {
    const container = document.getElementById('petals');

    for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'petal';

        p.style.left = `${Math.random() * 100}%`;
        p.style.animationDuration = `${6 + Math.random() * 10}s`;
        p.style.animationDelay = `${Math.random() * 8}s`;
        p.style.transform = `rotate(${Math.random() * 360}deg)`;
        p.style.opacity = `${0.1 + Math.random() * 0.2}`;
        p.style.width = `${4 + Math.random() * 6}px`;
        p.style.height = `${6 + Math.random() * 8}px`;

        container.appendChild(p);
    }
}

/* ───────────── UI ───────────── */

function entrar(quien) {
    rol = quien;

    document.getElementById('screen-inicio').classList.add('hidden');
    document.getElementById('screen-panel').classList.remove('hidden');

    if (quien === 'fernanda') {
        document.getElementById('titulo').textContent =
            'Le tienes que contestar a Kevin en:';
        document.getElementById('controles').classList.remove('hidden');
    } else {
        document.getElementById('titulo').textContent =
            'Fernanda te va a contestar en:';
        document.getElementById('controles').classList.add('hidden');
    }
}

function volver() {
    document.getElementById('screen-panel').classList.add('hidden');
    document.getElementById('screen-inicio').classList.remove('hidden');
}

/* ───────────── BADGE ───────────── */

function actualizarBadge() {
    const badge = document.getElementById('horitas-badge');

    if (horasAgregadas > 0) {
        const plural = horasAgregadas !== 1;
        badge.textContent = `+${horasAgregadas} hora${plural ? 's' : ''} agregada${plural ? 's' : ''}`;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

/* ───────────── EFECTOS ───────────── */

function lanzarGroseras() {
    const container = document.getElementById('groserias-container');

    const cantidad = Math.min(Math.pow(2, horasAgregadas - 1), 32);

    for (let i = 0; i < cantidad; i++) {
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'groseria';

            const msg = GROSERAS[Math.floor(Math.random() * GROSERAS.length)];
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            const size = 14 + Math.random() * 14;

            el.textContent = msg;
            el.style.left = `${5 + Math.random() * 75}%`;
            el.style.top = `${20 + Math.random() * 55}%`;
            el.style.color = color;
            el.style.fontSize = `${size}px`;
            el.style.textShadow = `0 0 20px ${color}88`;
            el.style.animationDelay = `${Math.random() * 0.4}s`;

            container.appendChild(el);

            setTimeout(() => el.remove(), 3200);
        }, i * 120);
    }
}

function mostrarMensajesLindos() {
    const container = document.getElementById('groserias-container');

    const el = document.createElement('div');
    el.className = 'groseria';

    const msg = MENSAJES_LINDOS[Math.floor(Math.random() * MENSAJES_LINDOS.length)];

    el.textContent = msg;
    el.style.left = `${20 + Math.random() * 60}%`;
    el.style.top = `${30 + Math.random() * 40}%`;
    el.style.color = "#ff7ac6";
    el.style.fontSize = "18px";
    el.style.textShadow = "0 0 15px #ff7ac6aa";

    container.appendChild(el);

    setTimeout(() => el.remove(), 3000);
}

/* ───────────── TIMER CONTROL ───────────── */

function agregarHora() {
    let fin = Number(localStorage.getItem("finTiempo"));
    fin += 3600 * 1000;

    localStorage.setItem("finTiempo", fin);

    horasAgregadas++;
    actualizarBadge();
    lanzarGroseras();

    renderCronometro();
}

function quitarHora() {
    let fin = Number(localStorage.getItem("finTiempo"));

    fin -= 3600 * 1000;

    if (fin < Date.now()) fin = Date.now();

    localStorage.setItem("finTiempo", fin);

    horasAgregadas = Math.max(0, horasAgregadas - 1);

    actualizarBadge();
    renderCronometro();

    mostrarMensajesLindos();
}

/* ───────────── RESET ───────────── */

function resetTemporizador() {
    localStorage.setItem(
        "finTiempo",
        Date.now() + DURACION_DEFAULT * 1000
    );

    horasAgregadas = 0;
    yaVibrado = false;

    actualizarBadge();
    document.getElementById("mensajeFinal").textContent = "";

    renderCronometro();
}

/* ───────────── LOOP PRINCIPAL ───────────── */

setInterval(() => {
    let restante = renderCronometro();

    const btnReset = document.getElementById("btnReset");

    if (restante <= 0) {
        document.getElementById("mensajeFinal").textContent =
            "⏳ El tiempo ha terminado";

        // congelar en 0
        localStorage.setItem("finTiempo", Date.now());

        // mostrar botón reset
        btnReset.classList.remove("hidden");

        // vibración (solo una vez)
        if (!yaVibrado && navigator.vibrate) {
            navigator.vibrate([300, 200, 300, 200, 600]);
            yaVibrado = true;
        }

    } else {
        document.getElementById("mensajeFinal").textContent = "";
        btnReset.classList.add("hidden");
    }

}, 1000);

/* ───────────── INIT ───────────── */

crearPetalos();
renderCronometro();