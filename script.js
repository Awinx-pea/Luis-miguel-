
const audio = document.getElementById("audio");
const botonPlay = document.getElementById("reproducir");
const botonAnterior = document.getElementById("anterior");
const botonSiguiente = document.getElementById("siguiente");
const barra = document.getElementById("progreso");

const titulo = document.getElementById("titulo");
const estado = document.getElementById("estado");
const actual = document.getElementById("actual");
const duracion = document.getElementById("duracion");
const mensaje = document.getElementById("mensaje");
const canciones = document.querySelectorAll(".cancion");

const lista = [
    {
        nombre: "La incondicional",
        archivo: "musica/Luis%20Miguel%20-%20La%20Incondicional%20(Letra).mp3"
    },
    {
        nombre: "Ahora te puedes marchar",
        archivo: "musica/Luis%20Miguel%20-%20Ahora%20Te%20Puedes%20Marchar%20(Video%20Con%20Letra).mp3"
    },
    {
        nombre: "Hasta que me olvides",
        archivo: "musica/Luis%20Miguel%20-%20Hasta%20Que%20Me%20Olvides.mp3"
    }
];

let indice = 0;

function cargarCancion(numero) {
    indice = (numero + lista.length) % lista.length;

    audio.pause();
    audio.src = lista[indice].archivo;
    audio.load();

    titulo.textContent = lista[indice].nombre;
    estado.textContent = "Luis Miguel";
    botonPlay.textContent = "▶";
    botonPlay.setAttribute("aria-label", "Reproducir");

    barra.value = 0;
    actual.textContent = "0:00";
    duracion.textContent = "0:00";

    canciones.forEach((boton, i) => {
        boton.classList.toggle("activa", i === indice);
    });

    mensaje.textContent = "Canción seleccionada.";
}

async function reproducir() {
    try {
        if (audio.paused) {
            await audio.play();
        } else {
            audio.pause();
        }
    } catch (error) {
        mensaje.textContent =
            "No se pudo reproducir. Revisa el archivo de audio.";
    }
}

botonPlay.addEventListener("click", reproducir);

audio.addEventListener("play", () => {
    botonPlay.textContent = "⏸";
    botonPlay.setAttribute("aria-label", "Pausar");
    mensaje.textContent = "Reproduciendo música...";
});

audio.addEventListener("pause", () => {
    botonPlay.textContent = "▶";
    botonPlay.setAttribute("aria-label", "Reproducir");
});

botonAnterior.addEventListener("click", () => {
    cargarCancion(indice - 1);
    reproducir();
});

botonSiguiente.addEventListener("click", () => {
    cargarCancion(indice + 1);
    reproducir();
});

canciones.forEach((boton) => {
    boton.addEventListener("click", () => {
        cargarCancion(Number(boton.dataset.indice));
        reproducir();
    });
});

function formatoTiempo(segundos) {
    if (!Number.isFinite(segundos)) return "0:00";

    const minutos = Math.floor(segundos / 60);
    const resto = Math.floor(segundos % 60);

    return `${minutos}:${String(resto).padStart(2, "0")}`;
}

audio.addEventListener("loadedmetadata", () => {
    duracion.textContent = formatoTiempo(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    actual.textContent = formatoTiempo(audio.currentTime);

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        barra.value = (audio.currentTime / audio.duration) * 100;
    }
});

barra.addEventListener("input", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = (Number(barra.value) / 100) * audio.duration;
    }
});

audio.addEventListener("ended", () => {
    cargarCancion(indice + 1);
    reproducir();
});

audio.addEventListener("error", () => {
    mensaje.textContent =
        "No se encuentra el audio. Comprueba el nombre del archivo.";
});

// Música de bienvenida
audio.src = "musica/Luis%20Miguel%20-%20Hoy%20El%20Aire%20Huele%20a%20Ti%20(Instrumental).mp3";
audio.loop = true;
audio.load();

audio.play().catch(() => {
  mensaje.textContent = "Pulsa ▶ para escuchar la música.";
});

