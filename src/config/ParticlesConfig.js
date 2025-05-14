// /src/config/ParticlesConfig.js

export const particlesOptions = {
  fullScreen: { enable: true, zIndex: -1 },
  background: {
    color: {
      value: "transparent", // Let your theme background show through
    },
  },
  particles: {
    number: {
      value: 40,
      density: {
        enable: true,
        area: 800,
      },
    },
    color: {
      value: "#0A84FF", // Accent blue
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.2,
      random: true,
    },
    size: {
      value: 4,
      random: { enable: true, minimumValue: 1 },
    },
    links: {
      enable: true,
      distance: 150,
      color: "#0A84FF",
      opacity: 0.1,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      outModes: "out",
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      onClick: { enable: true, mode: "push" },
    },
    modes: {
      repulse: { distance: 100 },
      push: { quantity: 4 },
    },
  },
  detectRetina: true,
};
export default particlesOptions;