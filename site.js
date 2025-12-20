(() => {
  const ROUTES = {
    cart: "carrinho.html",
    login: "login.html",
    account: "minha-conta.html"
  };

  const LS_CART = "pm_cart_v1";
  const LS_WISHLIST = "pm_wishlist_v1";

  function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || ""); } catch { return fallback; }
  }
  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function moneyBRL(value) {
    const n = Number(value || 0);
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function getCart() {
    return readJSON(LS_CART, []);
  }
  function setCart(items) {
    writeJSON(LS_CART, items);
    updateCartBadge();
    renderCartPage();
  }

  function addToCart(item) {
    const cart = getCart();
    const existing = cart.find(x => x.sku === item.sku);
    if (existing) existing.qty += 1;
    else cart.push({ ...item, qty: 1 });
    setCart(cart);
    toast("Adicionado ao carrinho ✅");
  }

  function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((sum, it) => sum + (it.qty || 0), 0);
    document.querySelectorAll("[data-cart-badge]").forEach(el => el.textContent = String(count));
    // also handle hardcoded badge spans if present
    document.querySelectorAll("button .absolute.bg-primary.text-white").forEach(el => {
      if (el && el.textContent && /^[0-9]+$/.test(el.textContent.trim())) el.textContent = String(count);
    });
  }

  function renderCartPage() {
    const list = document.getElementById("cartItems");
    const totalEl = document.getElementById("cartTotal");
    if (!list || !totalEl) return;

    const cart = getCart();
    list.innerHTML = "";
    if (!cart.length) {
      list.innerHTML = `<div class="text-slate-600">Seu carrinho está vazio.</div>`;
      totalEl.textContent = moneyBRL(0);
      return;
    }

    let total = 0;
    cart.forEach((it, idx) => {
      const price = Number(it.price || 0);
      const qty = Number(it.qty || 1);
      total += price * qty;

      const row = document.createElement("div");
      row.className = "flex items-center justify-between border rounded p-3";
      row.innerHTML = `
        <div>
          <div class="font-semibold">${escapeHTML(it.name || it.sku)}</div>
          <div class="text-sm text-slate-600">${moneyBRL(price)} • Qtd: ${qty}</div>
        </div>
        <div class="flex items-center gap-2">
          <button data-dec="${idx}" class="px-3 py-1 border rounded">-</button>
          <button data-inc="${idx}" class="px-3 py-1 border rounded">+</button>
          <button data-del="${idx}" class="px-3 py-1 border rounded">Remover</button>
        </div>
      `;
      list.appendChild(row);
    });

    totalEl.textContent = moneyBRL(total);

    list.querySelectorAll("[data-inc]").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = Number(btn.getAttribute("data-inc"));
        const cart2 = getCart();
        cart2[i].qty += 1;
        setCart(cart2);
      });
    });
    list.querySelectorAll("[data-dec]").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = Number(btn.getAttribute("data-dec"));
        const cart2 = getCart();
        cart2[i].qty = Math.max(1, cart2[i].qty - 1);
        setCart(cart2);
      });
    });
    list.querySelectorAll("[data-del]").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = Number(btn.getAttribute("data-del"));
        const cart2 = getCart();
        cart2.splice(i, 1);
        setCart(cart2);
      });
    });
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, m => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;" }[m]));
  }

  function toast(msg) {
    const el = document.createElement("div");
    el.textContent = msg;
    el.className = "fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded-full shadow-lg z-[9999]";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  function bindGlobalClicks() {
    document.addEventListener("click", (e) => {
      const t = e.target;

      // Click on cart icon
      const cartBtn = t.closest?.("button[aria-label='Carrinho'], button:has(.material-symbols-outlined)");
      if (cartBtn) {
        const icon = cartBtn.querySelector(".material-symbols-outlined");
        if (icon && ["shopping_cart", "shopping_bag"].includes(icon.textContent.trim())) {
          window.location.href = ROUTES.cart;
          return;
        }
      }

      // Add to cart buttons (recommended)
      const addBtn = t.closest?.("[data-add-to-cart]");
      if (addBtn) {
        const sku = addBtn.getAttribute("data-sku") || ("sku-" + Date.now());
        const name = addBtn.getAttribute("data-name") || "Produto";
        const price = addBtn.getAttribute("data-price") || "0";
        addToCart({ sku, name, price });
        return;
      }

      // Fallback: match button text
      const btn = t.closest?.("button");
      if (btn) {
        const txt = (btn.textContent || "").trim().toLowerCase();
        if (txt.includes("adicionar") && (txt.includes("sacola") || txt.includes("carrinho"))) {
          addToCart({ sku: "produto-site", name: "Produto", price: "0" });
          return;
        }
      }

      // prevent dead links #
      const a = t.closest?.("a");
      if (a && a.getAttribute("href") === "#") {
        e.preventDefault();
        toast("Em construção 🌊");
      }
    });
  }

  function init() {
    updateCartBadge();
    renderCartPage();
    bindGlobalClicks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else init();
})();
