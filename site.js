const PRODUCTS = {
  /* =========================
     🔵 MASCULINO
  ========================= */
  "regata-bora-tomar-uma-preta": {
    segmento: "masculino",
    nome: "Regata Bora Tomar Uma",
    cor: "Preta",
    preco: 130.00,
    tamanhos: ["M", "G"],
    imagens: [
      "regata-bora-tomar-uma-preta-1.jpg",
      "regata-bora-tomar-uma-preta-2.jpg",
      "regata-bora-tomar-uma-preta-3.jpg"
    ]
  },

  "regata-meu-mar-azul": {
    segmento: "masculino",
    nome: "Regata Meu Mar",
    cor: "Azul",
    preco: 130.00,
    tamanhos: ["M", "G"],
    imagens: [
      "regata-meu-mar-azul-1.jpg",
      "regata-meu-mar-azul-2.jpg",
      "regata-meu-mar-azul-3.jpg"
    ]
  },

  "camisa-churrasco-pao-de-alho-preta": {
    segmento: "masculino",
    nome: "Camisa Churrasco Pão de Alho",
    cor: "Preta",
    preco: 145.00,
    tamanhos: ["M", "G", "GG"],
    imagens: [
      "camisa-churrasco-pao-de-alho-preta-1.jpg",
      "camisa-churrasco-pao-de-alho-preta-2.jpg",
      "camisa-churrasco-pao-de-alho-preta-3.jpg"
    ]
  },

  /* =========================
     🍑 FEMININO – MODA PRAIA
  ========================= */
  "biquini-marquinha-chocolate": {
    segmento: "feminino",
    nome: "Biquíni Marquinha",
    cor: "Chocolate",
    preco: 85.90,
    tamanhos: ["P", "M", "G"],
    imagens: [
      "biquini-marquinha-chocolate-1.jpg",
      "biquini-marquinha-chocolate-2.jpg",
      "biquini-marquinha-chocolate-3.jpg"
    ]
  },

  "biquini-marquinha-preto": {
    segmento: "feminino",
    nome: "Biquíni Marquinha",
    cor: "Preto",
    preco: 85.90,
    tamanhos: ["P", "M", "G"],
    imagens: [
      "biquini-marquinha-preto-1.jpg",
      "biquini-marquinha-preto-2.jpg",
      "biquini-marquinha-preto-3.jpg"
    ]
  },

  "mini-saia-trico-preto": {
    segmento: "feminino",
    nome: "Mini Saia Tricô",
    cor: "Preto",
    preco: 65.90,
    tamanhos: ["U"],
    imagens: [
      "mini-saia-trico-preto-1.jpg",
      "mini-saia-trico-preto-2.jpg",
      "mini-saia-trico-preto-3.jpg"
    ]
  },

  /* =========================
     🍑 FEMININO – LINGERIE
  ========================= */
  "conjunto-afrodite-preto": {
    segmento: "feminino",
    nome: "Conjunto Afrodite",
    cor: "Preto",
    preco: 99.90,
    tamanhos: ["P", "M", "G"],
    imagens: [
      "conjunto-afrodite-preto-1.jpg",
      "conjunto-afrodite-preto-2.jpg",
      "conjunto-afrodite-preto-3.jpg"
    ]
  },

  /* =========================
     🍑 FEMININO – SEXY SHOP
  ========================= */
  "gel-esquenta-gela": {
    segmento: "feminino",
    nome: "Gel Esquenta e Gela",
    cor: "—",
    preco: 22.30,
    tamanhos: ["Único"],
    imagens: [
      "gel-esquenta-gela-1.jpg",
      "gel-esquenta-gela-2.jpg",
      "gel-esquenta-gela-3.jpg"
    ]
  }
};

//* Praia & Movimento — site.js (multi-page, cart + theme) */
(function () {
  const CART_KEY = "pm_cart_v1";

  const products = [
    {
      id: "bikini-asa-delta",
      name: "Biquíni Asa Delta Tropical",
      price: 149.9,
      category: "feminino",
      tag: "Novo",
      img: "https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "maio-classic",
      name: "Maiô Classic White",
      price: 199.9,
      category: "feminino",
      tag: "Best-seller",
      img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "saida-linho",
      name: "Saída de Praia Linho",
      price: 229.9,
      category: "feminino",
      tag: "Essencial",
      img: "https://images.unsplash.com/photo-1520975958225-4a8bfbf7d6c3?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "short-linho",
      name: "Short Linho Azul Marinho",
      price: 139.9,
      category: "masculino",
      tag: "Novo",
      img: "https://images.unsplash.com/photo-1520975682071-a3d3a7f8d75b?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "camisa-resort",
      name: "Camisa Resort Premium",
      price: 189.9,
      category: "masculino",
      tag: "Premium",
      img: "https://images.unsplash.com/photo-1520975869018-3f3d5a9f1a0f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "regata-praiana",
      name: "Regata Praiana Essential",
      price: 99.9,
      category: "masculino",
      tag: "Essencial",
      img: "https://images.unsplash.com/photo-1520975751311-20c7b8b0d0e2?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  function money(v) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }

  function setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
  }

  function addToCart(productId, qty = 1) {
    const cart = getCart();
    const idx = cart.findIndex((x) => x.id === productId);
    if (idx >= 0) cart[idx].qty += qty;
    else cart.push({ id: productId, qty });
    setCart(cart);
  }

  function removeFromCart(productId) {
    const cart = getCart().filter((x) => x.id !== productId);
    setCart(cart);
  }

  function clearCart() {
    setCart([]);
  }

  function cartCount() {
    return getCart().reduce((sum, i) => sum + (i.qty || 0), 0);
  }

  function updateCartBadge() {
    const el = document.querySelector("[data-cart-badge]");
    if (!el) return;
    const c = cartCount();
    el.textContent = String(c);
    el.classList.toggle("hidden", c === 0);
  }

  function getProduct(productId) {
    return products.find((p) => p.id === productId);
  }

  function setAccentFromPage() {
    const page = document.documentElement.getAttribute("data-segment") || "feminino";
    // feminino = pêssego | masculino = azul
    const root = document.documentElement;
    if (page === "masculino") {
      root.style.setProperty("--accent", "#1d4ed8");
      root.style.setProperty("--accentSoft", "rgba(29,78,216,.12)");
    } else {
      root.style.setProperty("--accent", "#f08a6b");
      root.style.setProperty("--accentSoft", "rgba(240,138,107,.14)");
    }
  }

  function wireCommonUI() {
    // Logo click -> home
    document.querySelectorAll("[data-go-home]").forEach((btn) => {
      btn.addEventListener("click", () => (window.location.href = "index.html"));
    });

    // Sacola
    document.querySelectorAll("[data-go-cart]").forEach((btn) => {
      btn.addEventListener("click", () => (window.location.href = "carrinho.html"));
    });

    // Link de produto: salva id e abre produto.html
    document.querySelectorAll("[data-open-product]").forEach((card) => {
      card.addEventListener("click", (e) => {
        // evitar clique em botões internos
        const t = e.target;
        if (t && (t.closest("button") || t.closest("a"))) return;
        const pid = card.getAttribute("data-open-product");
        if (!pid) return;
        localStorage.setItem("pm_selected_product", pid);
        window.location.href = "produto.html";
      });
    });

    // Add to cart buttons
    document.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pid = btn.getAttribute("data-add-to-cart");
        if (!pid) return;
        addToCart(pid, 1);

        // feedback rápido
        btn.classList.add("opacity-80");
        btn.textContent = "Adicionado ✓";
        setTimeout(() => {
          btn.classList.remove("opacity-80");
          btn.textContent = "Adicionar à Sacola";
        }, 900);
      });
    });

    // Filtro por segmento (se existir)
    document.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const seg = btn.getAttribute("data-filter");
        if (!seg) return;
        document.querySelectorAll("[data-product]").forEach((card) => {
          const cat = card.getAttribute("data-category");
          card.classList.toggle("hidden", seg !== "todos" && cat !== seg);
        });
      });
    });

    updateCartBadge();
  }

  function renderLojaGrid() {
    const grid = document.querySelector("[data-products-grid]");
    if (!grid) return;

    const segment = document.documentElement.getAttribute("data-segment"); // feminino/masculino/todos/undefined
    const list =
      segment && segment !== "todos"
        ? products.filter((p) => p.category === segment)
        : products.slice();

    grid.innerHTML = list
      .map(
        (p) => `
      <div class="group cursor-pointer" data-product data-category="${p.category}" data-open-product="${p.id}">
        <div class="relative aspect-[3/4] overflow-hidden bg-white/10 rounded-2xl border border-white/10">
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10"></div>
          <div class="absolute top-4 left-4 z-20 px-3 py-1 text-[10px] uppercase tracking-widest font-semibold rounded-full"
               style="background: var(--accentSoft); color: var(--accent); border: 1px solid rgba(255,255,255,.08)">
            ${p.tag}
          </div>
          <img src="${p.img}" alt="${p.name}" class="h-full w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700" />
          <div class="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button data-add-to-cart="${p.id}" class="w-full py-3 px-4 text-xs uppercase tracking-widest rounded-xl border border-white/15 bg-black/60 backdrop-blur text-white hover:opacity-95">
              Adicionar à Sacola
            </button>
          </div>
        </div>
        <div class="text-center mt-5">
          <h3 class="font-serif text-lg text-white/95 group-hover:opacity-95 transition">${p.name}</h3>
          <p class="text-[11px] text-white/55 uppercase tracking-[0.25em] mt-1">${p.category === "feminino" ? "Feminino" : "Masculino"}</p>
          <p class="mt-2 font-medium text-white">${money(p.price)}</p>
        </div>
      </div>
    `
      )
      .join("");
  }

  function renderProduto() {
    const root = document.querySelector("[data-product-page]");
    if (!root) return;

    const pid =
      new URLSearchParams(window.location.search).get("id") ||
      localStorage.getItem("pm_selected_product") ||
      "bikini-asa-delta";

    const p = getProduct(pid) || products[0];

    const imgMain = document.querySelector("[data-prod-img]");
    const title = document.querySelector("[data-prod-title]");
    const price = document.querySelector("[data-prod-price]");
    const cat = document.querySelector("[data-prod-cat]");
    const addBtn = document.querySelector("[data-prod-add]");

    if (imgMain) imgMain.style.backgroundImage = `url("${p.img}")`;
    if (title) title.textContent = p.name;
    if (price) price.textContent = money(p.price);
    if (cat) cat.textContent = p.category === "feminino" ? "Feminino" : "Masculino";

    if (addBtn) {
      addBtn.addEventListener("click", () => {
        addToCart(p.id, 1);
        addBtn.textContent = "Adicionado ✓";
        setTimeout(() => (addBtn.textContent = "Adicionar ao Carrinho"), 900);
      });
    }

    // “Você também pode amar”
    const rec = document.querySelector("[data-recs]");
    if (rec) {
      const recs = products.filter((x) => x.id !== p.id).slice(0, 4);
      rec.innerHTML = recs
        .map(
          (r) => `
        <div class="group cursor-pointer" data-open-product="${r.id}">
          <div class="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10">
            <img src="${r.img}" alt="${r.name}" class="h-full w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div class="text-center mt-4">
            <div class="font-serif text-white">${r.name}</div>
            <div class="text-white/70 text-sm mt-1">${money(r.price)}</div>
          </div>
        </div>
      `
        )
        .join("");
    }
  }

  function renderCarrinho() {
    const wrap = document.querySelector("[data-cart-page]");
    if (!wrap) return;

    const listEl = document.querySelector("[data-cart-list]");
    const totalEl = document.querySelector("[data-cart-total]");
    const clearBtn = document.querySelector("[data-cart-clear]");

    function draw() {
      const cart = getCart();
      if (!listEl) return;

      if (cart.length === 0) {
        listEl.innerHTML = `
          <div class="rounded-2xl border border-white/10 p-6 text-white/80">
            Sua sacola está vazia. <a href="loja.html" class="underline" style="color: var(--accent)">Ir para a loja</a>
          </div>`;
        if (totalEl) totalEl.textContent = money(0);
        updateCartBadge();
        return;
      }

      let total = 0;
      listEl.innerHTML = cart
        .map((i) => {
          const p = getProduct(i.id);
          if (!p) return "";
          const sub = p.price * (i.qty || 0);
          total += sub;
          return `
            <div class="flex items-center gap-4 rounded-2xl border border-white/10 p-4">
              <div class="w-20 h-20 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                <img src="${p.img}" class="w-full h-full object-cover" alt="${p.name}">
              </div>
              <div class="flex-1">
                <div class="font-serif text-white">${p.name}</div>
                <div class="text-white/60 text-sm mt-1">${money(p.price)} • Qtd: ${i.qty}</div>
              </div>
              <div class="text-right">
                <div class="text-white font-medium">${money(sub)}</div>
                <button class="mt-2 text-xs uppercase tracking-widest underline text-white/70 hover:text-white" data-cart-remove="${p.id}">Remover</button>
              </div>
            </div>
          `;
        })
        .join("");

      if (totalEl) totalEl.textContent = money(total);

      document.querySelectorAll("[data-cart-remove]").forEach((b) => {
        b.addEventListener("click", () => {
          removeFromCart(b.getAttribute("data-cart-remove"));
          draw();
        });
      });

      updateCartBadge();
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        clearCart();
        draw();
      });
    }

    draw();
  }

  // init
  document.addEventListener("DOMContentLoaded", () => {
    setAccentFromPage();
    renderLojaGrid();
    renderProduto();
    renderCarrinho();
    wireCommonUI();
  });
})();
