gsap.registerPlugin(ScrollTrigger);

// Números pseudoaleatorios con semilla fija: el sushi se ve igual en cada carga
let semilla = 7;
const azar = (min, max) => {
  semilla = (semilla * 16807) % 2147483647;
  return min + ((semilla - 1) / 2147483646) * (max - min);
};

// 1. Semillas flotando alrededor del sushi
const contenedor = document.querySelector(".semillas");
const flotantes = [];
for (let i = 0; i < 26; i++) {
  const s = document.createElement("span");
  s.className = "semilla";
  // Concentradas cerca del centro, como en la referencia
  s.style.left = `${azar(30, 70)}%`;
  s.style.top = `${azar(14, 50)}%`;
  s.style.transform = `rotate(${azar(0, 180)}deg) scale(${azar(0.7, 1.4)})`;
  contenedor.appendChild(s);
  flotantes.push(s);
}

// 2. Animación de entrada
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

tl.from(".nav", { y: -40, opacity: 0, duration: 0.8 })
  .from(".titulo", { opacity: 0, y: 60, scale: 0.92, duration: 1.2 }, "-=0.4")
  .from(".capa-arroz", { y: 140, opacity: 0, duration: 1 }, "-=0.8")
  .from(".capa-salmon", { y: -260, rotation: -12, opacity: 0, duration: 1.1, ease: "back.out(1.4)" }, "-=0.5")
  .from(".capa-cebollin", { y: -160, rotation: 25, opacity: 0, duration: 0.9, ease: "back.out(2)" }, "-=0.6")
  .from(".capa-gota", { y: -120, opacity: 0, duration: 0.8, ease: "bounce.out" }, "-=0.5")
  .from(".wasabi", { scale: 0, rotation: -40, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.6")
  .from(flotantes, { opacity: 0, scale: 0, stagger: 0.02, duration: 0.5 }, "-=0.5")
  .from(".intro > *", { x: -40, opacity: 0, stagger: 0.12, duration: 0.7 }, "-=0.6")
  .from(".lateral-der > *", { x: 40, opacity: 0, stagger: 0.12, duration: 0.7 }, "<")
  .from(".tarjeta, .chat, .riel", { y: 30, opacity: 0, stagger: 0.08, duration: 0.6 }, "-=0.4");

// 3. Flotación suave del sushi y las semillas
gsap.to(".producto", {
  y: -14, rotation: 1.5, duration: 3,
  ease: "sine.inOut", yoyo: true, repeat: -1
});
gsap.to(".wasabi", {
  y: 10, rotation: 6, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1
});
flotantes.forEach((s) => {
  gsap.to(s, {
    y: azar(-18, 18), x: azar(-10, 10),
    duration: azar(2, 4), ease: "sine.inOut",
    yoyo: true, repeat: -1, delay: azar(0, 2)
  });
});

// 4. Pulso del descuento
gsap.to(".precio .numero", {
  scale: 1.06, duration: 1.5, ease: "sine.inOut", yoyo: true, repeat: -1
});

// 5. Scroll: el sushi se desarma, el título sube y las semillas se dispersan
const desarme = gsap.timeline({
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
});
desarme
  .to(".capa-gota", { y: -260 }, 0)
  .to(".capa-cebollin", { y: -190, rotation: 20 }, 0)
  .to(".capa-salmon", { y: -110, rotation: -6 }, 0)
  .to(".capa-arroz", { y: 90, rotation: 4 }, 0)
  .to(".wasabi", { yPercent: 150, opacity: 0 }, 0)
  .to(".titulo", { y: 120, opacity: 0.25 }, 0)
  .to(".semillas", { y: -120, opacity: 0 }, 0);

// 6. Parallax con el mouse (solo escritorio)
if (window.matchMedia("(pointer: fine)").matches) {
  const hero = document.querySelector(".hero");
  hero.addEventListener("mousemove", (e) => {
    const dx = e.clientX / window.innerWidth - 0.5;
    const dy = e.clientY / window.innerHeight - 0.5;
    gsap.to(".producto", { x: dx * 30, rotationY: dx * 10, duration: 1, overwrite: "auto" });
    gsap.to(".titulo", { x: dx * -20, duration: 1.2, overwrite: "auto" });
    gsap.to(".semillas", { x: dx * 50, yPercent: dy * 4, duration: 1, overwrite: "auto" });
  });
}

// 7. Piezas: entran deslizándose desde el borde de sus palillos
gsap.utils.toArray(".pieza").forEach((pieza) => {
  const lado = pieza.classList.contains("pieza-izq") ? -1 : 1;
  gsap.from(pieza.querySelector("img"), {
    xPercent: 110 * lado, rotation: -8 * lado, ease: "power2.out",
    scrollTrigger: { trigger: pieza, start: "top 90%", end: "top 45%", scrub: 1 }
  });
  gsap.from(pieza.querySelectorAll(".pieza-texto > *"), {
    y: 30, opacity: 0, stagger: 0.08, duration: 0.6, ease: "power3.out",
    scrollTrigger: { trigger: pieza, start: "top 70%" }
  });
});

// 8. Aparición de los platos del menú
gsap.from(".plato", {
  y: 60, opacity: 0, stagger: 0.15, duration: 0.8, ease: "power3.out",
  scrollTrigger: { trigger: ".menu", start: "top 75%" }
});

// 9. Hover en botones
document.querySelectorAll(".btn, .btn-outline, .chat").forEach((btn) => {
  btn.addEventListener("mouseenter", () => gsap.to(btn, { scale: 1.05, duration: 0.2 }));
  btn.addEventListener("mouseleave", () => gsap.to(btn, { scale: 1, duration: 0.2 }));
});
