import { mountZrainUI } from "../src/zrain-ui.js";
mountZrainUI({
  product: "Monitor",
  logoSrc: "../assets/zrain-logo.webp",
  productHref: "#top",
  navigation: [
    { label: "Overview", href: "#overview", current: true },
    { label: "Dashboard", href: "#dashboard" },
    { label: "Documentation", href: "#documentation" }
  ],
  footerLinks: [
    { label: "Contact", href: "mailto:zrain.dev@gmail.com" },
    { label: "GitHub", href: "https://github.com/zrain03", external: true }
  ]
});
