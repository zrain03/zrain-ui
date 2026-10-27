import { mountZrainUI } from "../src/zrain-ui.js";
mountZrainUI({
  product: "Ecosystem",
  logoSrc: "../assets/zrain-logo.webp",
  productHref: "#top",
  navigation: [
    { label: "Products", href: "#products", current: true },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" }
  ],
  footerLinks: [
    { label: "Contact", href: "mailto:zrain.dev@gmail.com" },
    { label: "GitHub", href: "https://github.com/zrain03", external: true }
  ]
});
