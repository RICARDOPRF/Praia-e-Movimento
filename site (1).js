/* Praia & Movimento — site.js (v2 universal)
   Suporta variações de layout (index / loja / produto):
   - Carrinho + badge (ícones: shopping_cart | shopping_bag)
   - Conta/Login (ícones: account_circle | person | texto "Login")
   - Adicionar à Sacola / Adicionar ao Carrinho (lista e produto)
   - Lista de desejos (wishlist)
   - Busca (quando existir input ou botão de buscar)
   - Newsletter (submit ou botão type=button)
   - Links href="#" não quebram (toast)
*/

(() => {
  "use strict";

  // ====== Config ======
  const KEYS = {
    cart: "pm_cart_v1",
    favs: "pm_favs_v1",
    user: "pm_user_v1",
    newsletter: "pm_newsletter_v1",
    ui: "pm_ui_v1",
  };

  // Ajuste se seus arquivos tiverem outros nomes:
  const ROUTES = {
    cart: "carrinho.html",
    login: "login.html",
    account: "minha-conta.html",
    checkout: "checkout.html",
    index: "index.html",
    contato: "contato.html",
    faq: "faq.html",
    termos: "termos.html",
    privacidade: "privacidade.html",
  };

  // ====== Helpers ======
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function safeJSONParse(s, fallback) {
    try { return JSON.parse(s); } catch { return fallback; }
  }
  function getStore(key, fallback) {
    return safeJSONParse(localStorage.getItem(key) || "", fallback);
  }
  function setStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalize(text) {
    return (text || "").toString().trim();
  }

  function normalizeLower(text) {
    return normalize(text).toLowerCase();
  }

  function toNumberBRL(text) {
    // "R$ 129,90" -> 129.90
    if (!text) return 0;
    const cleaned = text
      .replace(/\s/g, "")
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }

  // ====== Toast ======
  function ensureToastHost() {
    let host = $("#pm-toast-host");
    if (host) return host;

    host = document.createElement("div");
    host.id = "pm-toast-host";
    host.style.position = "fixed";
    host.style.right = "16px";
    host.style.bottom = "16px";
    host.style.zIndex = "99999";
    host.style.display = "flex";
    host.style.flexDirection = "column";
    host.style.gap = "10px";
    document.body.appendChild(host);
    return host;
  }

  function toast(message, type = "info", timeout = 2600) {
    const host = ensureToastHost();

    const el = document.createElement("div");
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.style.minWidth = "240px";
    el.style.maxWidth = "380px";
    el.style.padding = "12px 14px";
    el.style.borderRadius = "14px";
    el.style.boxShadow = "0 10px 30px rgba(0,0,0,.18)";
    el.style.backdropFilter = "blur(10px)";
    el.style.border = "1px solid rgba(255,255,255,.18)";
    el.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Arial";
    el.style.fontSize = "14px";
    el.style.lineHeight = "1.25";
    el.style.transform = "translateY(10px)";
    el.style.opacity = "0";
    el.style.transition = "transform .25s ease, opacity .25s ease";

    const colors = {
      info: ["rgba(10,44,85,.92)", "rgba(255,255,255,.92)"],
      success: ["rgba(39,174,96,.92)", "rgba(255,255,255,.95)"],
      warn: ["rgba(242,176,28,.92)", "rgba(16,24,39,.95)"],
      danger: ["rgba(255,77,79,.92)", "rgba(255,255,255,.95)"],
    };
    const [bg, fg] = colors[type] || colors.info;
    el.style.background = bg;
    el.style.color = fg;

    el.textContent = message;

    host.appendChild(el);

    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });

    window.setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(10px)";
      window.setTimeout(() => el.remove(), 260);
    }, timeout);

    return el;
  }

  // ====== Cart / Favorites ======
  function getCart() {
    return getStore(KEYS.cart, { items: [] });
  }
  function setCart(cart) {
    setStore(KEYS.cart, cart);
    updateCartBadges();
  }

  function getFavs() {
    return getStore(KEYS.favs, { ids: [] });
  }
  function setFavs(favs) {
    setStore(KEYS.favs, favs);
    syncFavButtons();
  }

  function cartCount(cart = getCart()) {
    return (cart.items || []).reduce((acc, it) => acc + (it.qty || 0), 0);
  }

  function findIconButtons(iconNames) {
    const set = new Set(iconNames);
    return $$("button").filter(b => {
      const icon = b.querySelector(".material-symbols-outlined");
      const t = normalize(icon?.textContent);
      return set.has(t);
    });
  }

  function updateCartBadges() {
    const count = cartCount();

    // suporta shopping_cart e shopping_bag
    const cartButtons = findIconButtons(["shopping_cart", "shopping_bag"]);
    cartButtons.forEach(btn => {
      btn.style.position = btn.style.position || "relative";

      // tenta usar um badge existente
      let badge =
        btn.querySelector("span.absolute") ||
        btn.querySelector("span[class*='absolute']");

      if (!badge) {
        badge = document.createElement("span");
        badge.className =
          "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white";
        btn.appendChild(badge);
      }

      badge.textContent = String(count);
      badge.style.display = count > 0 ? "flex" : "none";
    });
  }

  function stableIdFromParts(parts) {
    return parts.filter(Boolean).join("|").toLowerCase();
  }

  function extractImageFromCard(card) {
    // Layout 1: bg-image
    const bgDiv = card.querySelector("[style*='background-image']");
    if (bgDiv) {
      const style = bgDiv.getAttribute("style") || "";
      const m = style.match(/url\((['"]?)([^'")]+)\1\)/i);
      if (m && m[2]) return m[2];
    }
    // Layout 2: <img src="">
    const img = card.querySelector("img[src]");
    if (img) return img.getAttribute("src") || "";
    return "";
  }

  function extractProductFromListCard(card) {
    // Lista (loja)
    const title =
      normalize(card.querySelector("h3, h4")?.textContent) ||
      "Produto";

    // Preço pode estar em p normal ou com classe específica
    const priceText =
      normalize(
        card.querySelector("p.font-medium, p.font-bold, p[class*='text-primary'], p")?.textContent
      );

    const price = toNumberBRL(priceText);

    const category =
      normalize(card.querySelector("p.text-xs, p.text-sm")?.textContent);

    const image = extractImageFromCard(card);

    const id = stableIdFromParts([title, priceText, category]);

    return { id, title, price, category, image };
  }

  function extractProductFromProductPage() {
    const title =
      normalize($("h1")?.textContent) ||
      normalize($("h2")?.textContent) ||
      "Produto";

    // tenta pegar o primeiro preço em R$
    const priceEl = $$("*").find(el => /R\$\s*\d+/.test(el.textContent || ""));
    const priceText = normalize(priceEl?.textContent);
    const price = toNumberBRL(priceText);

    // imagem: pega o primeiro bloco com background-image ou img principal
    const heroBg = $("[style*='background-image']");
    let image = "";
    if (heroBg) {
      const style = heroBg.getAttribute("style") || "";
      const m = style.match(/url\((['"]?)([^'")]+)\1\)/i);
      if (m && m[2]) image = m[2];
    }
    if (!image) image = $("img[src]")?.getAttribute("src") || "";

    const id = stableIdFromParts([title, priceText]);

    return { id, title, price, category: "Produto", image };
  }

  function addToCart(product, qty = 1) {
    const cart = getCart();
    const items = cart.items || [];

    const pid = product.id || stableIdFromParts([product.title, String(product.price), product.category]);

    const existing = items.find(it => it.id === pid);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: pid,
        title: product.title,
        price: product.price,
        category: product.category || "",
        image: product.image || "",
        qty,
      });
    }

    cart.items = items;
    setCart(cart);

    toast(`✅ Adicionado: ${product.title}`, "success");
  }

  function toggleFav(productId) {
    const favs = getFavs();
    const ids = new Set(favs.ids || []);
    if (ids.has(productId)) {
      ids.delete(productId);
      toast("💔 Removido dos favoritos", "warn");
    } else {
      ids.add(productId);
      toast("❤️ Salvo nos favoritos", "success");
    }
    favs.ids = Array.from(ids);
    setFavs(favs);
  }

  function syncFavButtons() {
    const favs = new Set((getFavs().ids || []));

    // botões com ícone favorite (lista e produto)
    const favBtns = $$("button").filter(b => {
      const icon = normalize(b.querySelector(".material-symbols-outlined")?.textContent);
      return icon === "favorite";
    });

    favBtns.forEach(btn => {
      // tenta associar a card
      const card = btn.closest(".group") || btn.closest("div");
      let pid = "";

      if (card && card.querySelector("h3, h4")) {
        pid = stableIdFromParts([
          normalize(card.querySelector("h3, h4")?.textContent),
          normalize(card.querySelector("p")?.textContent),
        ]);
      } else {
        const prod = extractProductFromProductPage();
        pid = prod.id;
      }

      const active = favs.has(pid);
      btn.dataset.favActive = active ? "1" : "0";
      btn.style.outline = active ? "2px solid rgba(198,168,124,.55)" : "none";
    });
  }

  // ====== Filtering / Search (quando existir input) ======
  function getAllListCards() {
    // cards que possuem botão "Adicionar à Sacola" na loja
    return $$("button")
      .filter(b => normalizeLower(b.textContent) === "adicionar à sacola")
      .map(b => b.closest(".group"))
      .filter(Boolean);
  }

  function applyFilter({ query = "" } = {}) {
    const q = normalizeLower(query);
    const cards = getAllListCards();
    if (!cards.length) return;

    let shown = 0;
    cards.forEach(card => {
      const title = normalizeLower(card.querySelector("h3, h4")?.textContent);
      const cat = normalizeLower(card.querySelector("p.text-xs, p.text-sm")?.textContent);
      const ok = !q || title.includes(q) || cat.includes(q);
      card.style.display = ok ? "" : "none";
      if (ok) shown += 1;
    });

    if (q) toast(`🔎 ${shown} produto(s) encontrado(s)`, "info", 1600);
  }

  // ====== Hooks ======
  function hookHeaderCartAndAccount() {
    // Cart
    findIconButtons(["shopping_cart", "shopping_bag"]).forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = ROUTES.cart;
      });
    });

    // Account by icon
    findIconButtons(["account_circle", "person"]).forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const user = getStore(KEYS.user, null);
        window.location.href = user ? ROUTES.account : ROUTES.login;
      });
    });

    // Account by text "Login"
    $$("button, a").forEach(el => {
      if (normalizeLower(el.textContent) === "login") {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          const user = getStore(KEYS.user, null);
          window.location.href = user ? ROUTES.account : ROUTES.login;
        });
      }
    });
  }

  function hookAddToCartList() {
    // Loja: "Adicionar à Sacola"
    const addBtns = $$("button").filter(b => normalizeLower(b.textContent) === "adicionar à sacola");
    addBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const card = btn.closest(".group") || btn.closest("div");
        if (!card) return;
        const product = extractProductFromListCard(card);
        addToCart(product, 1);
      });
    });
  }

  function hookAddToCartProductPage() {
    // Produto: "Adicionar ao Carrinho"
    const btn = $$("button").find(b => normalizeLower(b.textContent).includes("adicionar ao carrinho"));
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const product = extractProductFromProductPage();
      addToCart(product, 1);
    });
  }

  function hookWishlist() {
    // Produto: "Adicionar à Lista de Desejos" (ou qualquer botão que contenha isso)
    const wishBtn = $$("button").find(b => normalizeLower(b.textContent).includes("lista de desejos"));
    if (!wishBtn) return;

    wishBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const product = extractProductFromProductPage();
      toggleFav(product.id);
    });
  }

  function hookFavButtonsList() {
    // Loja: botões de ícone favorite no card
    const favBtns = $$("button").filter(b => normalize(b.querySelector(".material-symbols-outlined")?.textContent) === "favorite");
    favBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const card = btn.closest(".group");
        if (!card) {
          // se for fora de card, considera produto
          const product = extractProductFromProductPage();
          toggleFav(product.id);
          return;
        }
        const product = extractProductFromListCard(card);
        toggleFav(product.id);
      });
    });
  }

  function hookSearchIfExists() {
    // Layout index: input placeholder "Buscar produtos..."
    const input = $("input[placeholder*='Buscar']");
    if (input) {
      let t = null;
      input.addEventListener("input", () => {
        clearTimeout(t);
        t = setTimeout(() => applyFilter({ query: input.value }), 120);
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          applyFilter({ query: input.value });
        }
      });
    }

    // Layout loja: botão "Buscar" no header (abre um prompt simples)
    const buscarBtn = $$("button").find(b => normalizeLower(b.textContent).includes("buscar"));
    const searchIconBtn = $$("button").find(b => normalize(b.querySelector(".material-symbols-outlined")?.textContent) === "search");
    const btn = buscarBtn || searchIconBtn;

    if (btn && !input) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const q = window.prompt("Buscar produto:");
        if (q !== null) applyFilter({ query: q });
      });
    }
  }

  function hookNewsletter() {
    // Caso 1: form com submit normal
    const forms = $$("form");
    forms.forEach(form => {
      const email = form.querySelector("input[type='email']");
      if (!email) return;

      // botão submit
      const submit = form.querySelector("button[type='submit']");
      // botão type=button (como na sua loja)
      const clickBtn = !submit ? form.querySelector("button") : null;

      const handler = (e) => {
        e.preventDefault();
        const value = normalize(email.value);
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          toast("⚠️ Digite um e-mail válido.", "warn");
          return;
        }
        const list = getStore(KEYS.newsletter, []);
        const updated = Array.from(new Set([...(Array.isArray(list) ? list : []), value]));
        setStore(KEYS.newsletter, updated);
        form.reset();
        toast("✅ Inscrição confirmada! (salvo no navegador)", "success", 3000);
      };

      form.addEventListener("submit", handler);
      if (clickBtn) clickBtn.addEventListener("click", handler);
    });
  }

  function hookDummyLinks() {
    $$("a").forEach(a => {
      const href = normalize(a.getAttribute("href"));
      if (href === "#" || href === "") {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          toast("🚧 Página em construção", "info");
        });
      }
    });
  }

  function hookLoadMore() {
    // botão "Carregar Mais"
    const btn = $$("button").find(b => normalizeLower(b.textContent) === "carregar mais");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      toast("ℹ️ Em breve: mais produtos aqui (página demo).", "info", 2200);
    });
  }

  // ====== Init ======
  function init() {
    updateCartBadges();
    syncFavButtons();

    hookHeaderCartAndAccount();
    hookAddToCartList();
    hookAddToCartProductPage();
    hookWishlist();
    hookFavButtonsList();
    hookSearchIfExists();
    hookNewsletter();
    hookDummyLinks();
    hookLoadMore();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
