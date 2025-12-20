
/* Praia & Movimento — site.js
   - Carrinho em localStorage
   - Grid de produtos
   - Página de produto via ?id=
   - Contato: opcional salvar no Firebase Realtime Database (REST)
*/
const PM = (() => {
  const STORE_KEY = "pm_cart_v1";
  const SIZE_KEY = "pm_size_v1";

  // >>> Firebase (opcional)
  // Se você NÃO quiser salvar contato no Realtime Database, deixe FIREBASE_ENABLED = false.
  const FIREBASE_ENABLED = false;
  const FIREBASE_RTD_URL = "https://praia-e-movimento-d51e4-default-rtdb.firebaseio.com"; // sem barra no fim

  // Produtos demo (você pode trocar imagens e nomes depois)
  const products = [
    { id:"f001", seg:"feminino", name:"Biquíni Tropical Pêssego", price:149.90, oldPrice:189.90, img:"https://images.unsplash.com/photo-1520975958225-62b87aee7f20?auto=format&fit=crop&w=1200&q=80", desc:"Peça premium com toque macio e design elegante. Ideal para dias de sol." },
    { id:"f002", seg:"feminino", name:"Maiô Elegance Areia", price:189.90, img:"https://images.unsplash.com/photo-1520975682038-5c5fcb6ef7b2?auto=format&fit=crop&w=1200&q=80", desc:"Maiô versátil com modelagem que valoriza a silhueta." },
    { id:"f003", seg:"feminino", name:"Saída de Praia Linen", price:229.90, img:"https://images.unsplash.com/photo-1520975752363-8f2b3d4f1c4f?auto=format&fit=crop&w=1200&q=80", desc:"Leve, fresca e sofisticada — perfeita para compor o look." },

    { id:"m001", seg:"masculino", name:"Camisa Praia Azul Marinho", price:179.90, img:"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80", desc:"Estilo praia-urbano com acabamento premium." },
    { id:"m002", seg:"masculino", name:"Regata Machão Blue", price:99.90, img:"https://images.unsplash.com/photo-1520975871714-61b4a10a7e5e?auto=format&fit=crop&w=1200&q=80", desc:"Conforto e presença. Ideal para calor e treino." },
    { id:"m003", seg:"masculino", name:"Short Surf Classic", price:139.90, img:"https://images.unsplash.com/photo-1520975722785-7f0ad7b9a2b2?auto=format&fit=crop&w=1200&q=80", desc:"Secagem rápida e corte moderno." },
  ];

  const moneyBRL = (v) => (v ?? 0).toLocaleString("pt-BR", { style:"currency", currency:"BRL" });

  const getCart = () => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); }
    catch { return []; }
  };

  const saveCart = (cart) => localStorage.setItem(STORE_KEY, JSON.stringify(cart));

  const setBadge = () => {
    const badge = document.getElementById("cartBadge");
    if (!badge) return;
    const cart = getCart();
    const totalQty = cart.reduce((s,i)=> s + (i.qty||0), 0);
    badge.textContent = String(totalQty);
  };

  const toggleMobileMenu = () => {
    const el = document.getElementById("mobileMenu");
    if (!el) return;
    el.classList.toggle("hidden");
  };

  const openSearch = () => alert("Buscar: em construção (podemos fazer depois).");
  const goLogin = () => alert("Login: em construção (podemos adicionar login por link no e-mail).");
  const openInsta = () => window.open("https://www.instagram.com/praiaemovimento", "_blank");
  const newsletter = (e) => { e.preventDefault(); alert("Newsletter: capturado (demo)."); };

  const renderGrid = () => {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    const page = (location.pathname.split("/").pop() || "").toLowerCase();
    let filter = null;
    if (page.includes("feminino")) filter = "feminino";
    if (page.includes("masculino")) filter = "masculino";

    const list = filter ? products.filter(p=>p.seg===filter) : products;

    grid.innerHTML = list.map(p => `
      <div class="group cursor-pointer" onclick="PM.goProduct('${p.id}')">
        <div class="relative aspect-[3/4] overflow-hidden mb-5 border" style="border-color: var(--border); background: var(--panel);">
          <img src="${p.img}" alt="${p.name}" class="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>

          <div class="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" onclick="event.stopPropagation()">
            <button class="w-full h-11 text-xs tracking-[0.2em] uppercase btn-outline bg-white" onclick="PM.addToCart('${p.id}', 1)">
              Adicionar ao Carrinho
            </button>
          </div>
        </div>

        <div class="text-center">
          <div class="font-[Playfair_Display] text-lg">${p.name}</div>
          <div class="text-xs tracking-[0.2em] uppercase mt-1" style="color: var(--muted);">${p.seg}</div>
          <div class="mt-2 font-semibold">${moneyBRL(p.price)}</div>
        </div>
      </div>
    `).join("");

    setBadge();
  };

  const goProduct = (id) => { window.location.href = `produto.html?id=${encodeURIComponent(id)}`; };

  const addToCart = (productId, qty=1, size=null) => {
    const p = products.find(x => x.id === productId);
    if (!p) return alert("Produto não encontrado.");
    const cart = getCart();
    const key = `${productId}__${size||""}`;
    const found = cart.find(i => i.key === key);
    if (found) found.qty += qty;
    else cart.push({ key, id: productId, qty, size: size || null });
    saveCart(cart);
    setBadge();
    alert("Adicionado ao carrinho ✅");
  };

  const pickSize = (btn, size) => {
    document.querySelectorAll("[data-size-picked]").forEach(b => {
      b.classList.remove("ring-2");
      b.removeAttribute("data-size-picked");
    });
    btn.classList.add("ring-2");
    btn.style.boxShadow = "0 0 0 2px var(--primary)";
    btn.setAttribute("data-size-picked", "1");
    localStorage.setItem(SIZE_KEY, size);
  };

  const renderProduct = () => {
    const nameEl = document.getElementById("productName");
    if (!nameEl) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "f001";
    const p = products.find(x => x.id === id) || products[0];

    // Ajusta tema masculino automaticamente
    if (p.seg === "masculino") document.body.classList.add("theme-masculino");

    document.getElementById("breadcrumbName").textContent = p.name;
    document.getElementById("productName").textContent = p.name;
    document.getElementById("productImage").src = p.img;
    document.getElementById("productPrice").textContent = moneyBRL(p.price);
    document.getElementById("productOldPrice").textContent = p.oldPrice ? moneyBRL(p.oldPrice) : "";
    document.getElementById("productDesc").textContent = p.desc;

    // guarda o produto atual
    document.getElementById("addToCartBtn").setAttribute("data-current-id", p.id);

    setBadge();
  };

  const addCurrentProduct = () => {
    const btn = document.getElementById("addToCartBtn");
    if (!btn) return;
    const id = btn.getAttribute("data-current-id");
    const size = localStorage.getItem(SIZE_KEY) || null;
    addToCart(id, 1, size);
  };

  const renderCart = () => {
    const listEl = document.getElementById("cartList");
    if (!listEl) return;

    const emptyEl = document.getElementById("emptyCart");
    const cart = getCart();

    if (!cart.length) {
      emptyEl?.classList.remove("hidden");
      listEl.innerHTML = "";
      document.getElementById("cartSubtotal").textContent = moneyBRL(0);
      document.getElementById("cartTotal").textContent = moneyBRL(0);
      document.getElementById("cartFrete").textContent = "—";
      setBadge();
      return;
    }

    emptyEl?.classList.add("hidden");

    const rows = cart.map(item => {
      const p = products.find(x => x.id === item.id);
      if (!p) return "";
      const line = p.price * (item.qty || 0);
      return `
        <div class="border p-5 flex gap-4 items-center" style="border-color: var(--border); background: #fff;">
          <img src="${p.img}" alt="${p.name}" class="w-20 h-20 object-cover" />
          <div class="flex-1">
            <div class="font-semibold">${p.name}</div>
            <div class="text-xs tracking-[0.2em] uppercase" style="color: var(--muted);">
              ${p.seg}${item.size ? " • tam " + item.size : ""}
            </div>
            <div class="mt-2 text-sm">${moneyBRL(p.price)}</div>
          </div>

          <div class="flex items-center gap-2">
            <button class="h-9 w-9 border" style="border-color: var(--border);" onclick="PM.decQty('${item.key}')">-</button>
            <div class="w-10 text-center">${item.qty}</div>
            <button class="h-9 w-9 border" style="border-color: var(--border);" onclick="PM.incQty('${item.key}')">+</button>
          </div>

          <div class="w-28 text-right font-semibold">${moneyBRL(line)}</div>

          <button class="ml-2 text-sm underline" onclick="PM.removeItem('${item.key}')">remover</button>
        </div>
      `;
    }).join("");

    listEl.innerHTML = rows;

    const subtotal = cart.reduce((s, item) => {
      const p = products.find(x => x.id === item.id);
      return s + (p ? p.price * (item.qty||0) : 0);
    }, 0);

    const frete = subtotal >= 299 ? 0 : 24.90;
    const total = subtotal + frete;

    document.getElementById("cartSubtotal").textContent = moneyBRL(subtotal);
    document.getElementById("cartFrete").textContent = subtotal >= 299 ? "Grátis" : moneyBRL(frete);
    document.getElementById("cartTotal").textContent = moneyBRL(total);

    setBadge();
  };

  const incQty = (key) => {
    const cart = getCart();
    const item = cart.find(i => i.key === key);
    if (!item) return;
    item.qty += 1;
    saveCart(cart);
    renderCart();
  };

  const decQty = (key) => {
    const cart = getCart();
    const item = cart.find(i => i.key === key);
    if (!item) return;
    item.qty -= 1;
    if (item.qty <= 0) {
      const idx = cart.findIndex(i => i.key === key);
      cart.splice(idx, 1);
    }
    saveCart(cart);
    renderCart();
  };

  const removeItem = (key) => {
    const cart = getCart().filter(i => i.key !== key);
    saveCart(cart);
    renderCart();
  };

  const checkout = () => alert("Checkout: em construção (podemos integrar Pix/WhatsApp).");
  const wishlist = () => alert("Lista de desejos: em construção.");

  const fakeFilters = () => alert("Filtros: em construção.");
  const loadMore = () => alert("Carregar mais: demo (podemos paginar).");

  // Contato -> Realtime DB (REST)
  const sendContact = async (e) => {
    e.preventDefault();
    const status = document.getElementById("contactStatus");
    const fd = new FormData(e.target);
    const payload = {
      nome: fd.get("nome"),
      email: fd.get("email"),
      msg: fd.get("msg"),
      createdAt: Date.now()
    };

    status.textContent = "Enviando...";
    try {
      if (FIREBASE_ENABLED) {
        const res = await fetch(`${FIREBASE_RTD_URL}/contatos.json`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Erro ao salvar no Firebase");
      }
      status.textContent = "Enviado ✅";
      e.target.reset();
    } catch (err) {
      console.error(err);
      status.textContent = "Falha ao enviar. (Ver console).";
    }
  };

  const init = () => {
    setBadge();
    renderGrid();
    renderProduct();
    renderCart();
  };

  return {
    init,
    toggleMobileMenu,
    openSearch,
    goLogin,
    openInsta,
    newsletter,
    renderGrid,
    goProduct,
    addToCart,
    pickSize,
    addCurrentProduct,
    renderCart,
    incQty,
    decQty,
    removeItem,
    checkout,
    wishlist,
    fakeFilters,
    loadMore,
    sendContact
  };
})();

document.addEventListener("DOMContentLoaded", PM.init);
