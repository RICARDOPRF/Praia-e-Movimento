/* ================================
   PRAIA & MOVIMENTO — SITE.JS 
   Cérebro da Loja Integrada (Versão Restaurada + Fix Firebase/Badge)
================================ */

/**
 * ✅ Firebase config (GLOBAL)
 *
 * Como funciona agora:
 * 1) Se existir um config salvo no localStorage (chave: pm_firebase_config), ele é carregado.
 * 2) Senão, usa o placeholder abaixo (você precisa preencher com os dados do seu Firebase).
 *
 * Dica importante:
 * - Firebase NÃO funciona em file:// (abrindo o html pelo computador). Teste via:
 *   - GitHub Pages (https://...) ou
 *   - um servidor local (ex: VSCode Live Server).
 *
 * Para salvar sem editar arquivo (uma vez só):
 * - Abra o site, pressione F12 (Console) e rode:
 *   pmSetFirebaseConfig({ ...seu firebaseConfig... })
 * - Recarregue a página.
 */
(function initFirebaseConfig(){
  // 1) tenta carregar do localStorage
  try {
    const saved = localStorage.getItem("pm_firebase_config");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        window.firebaseConfig = parsed;
        return;
      }
    }
  } catch {}

  // 2) fallback (preencha com o seu config real do Firebase Console)
  window.firebaseConfig = window.firebaseConfig || {
    apiKey: "AIzaSyBjKCTDBeSPGnZyXE4mOVe4_86xGGjwqVw",
  authDomain: "praia-e-movimento-d51e4.firebaseapp.com",
  databaseURL: "https://praia-e-movimento-d51e4-default-rtdb.firebaseio.com",
  projectId: "praia-e-movimento-d51e4",
  storageBucket: "praia-e-movimento-d51e4.firebasestorage.app",
  messagingSenderId: "1055056595674",
  appId: "1:1055056595674:web:83000d322ceaca3572b3e3"
};
})();

/**
 * Salva o firebaseConfig no localStorage (sem precisar editar arquivos).
 * Use no Console do navegador:
 *   pmSetFirebaseConfig({ apiKey:"...", authDomain:"...", ... })
 */
window.pmSetFirebaseConfig = function(config){
  if (!config || typeof config !== "object") {
    alert("Passe um objeto com o firebaseConfig (ex: pmSetFirebaseConfig({ apiKey:'...', authDomain:'...' }))");
    return;
  }
  localStorage.setItem("pm_firebase_config", JSON.stringify(config));
  window.firebaseConfig = config;
  alert("Firebase config salvo! Recarregue a página.");
};

/**
 * Valida se o firebaseConfig está minimamente preenchido (para cadastro/login).
 */
window.pmFirebaseReady = function(){
  const c = window.firebaseConfig || {};
  return !!(c.apiKey && c.authDomain && c.projectId);
};


const PRODUTOS = [
  // ===== MASCULINO (REGATAS E CAMISAS) =====
  { slug: "bora-tomar-uma", nome: "Regata Bora Tomar Uma", categoria: "Masculino", preco: 130.00, cor: "Preta", tamanhos: ["M"] },
  { slug: "meu-mar", nome: "Regata Meu Mar", categoria: "Masculino", preco: 130.00, cor: "Azul", tamanhos: ["M"] },
  { slug: "lisa-regata", nome: "Regata Lisa", categoria: "Masculino", preco: 130.00, cor: "Rosa, Azul", tamanhos: ["M", "G"] },
  { slug: "sexta-feira", nome: "Regata Sexta Feira", categoria: "Masculino", preco: 130.00, cor: "Pink", tamanhos: ["G"] },
  { slug: "cabra-da-peste", nome: "Regata Cabra da Peste", categoria: "Masculino", preco: 130.00, cor: "Nude", tamanhos: ["G"] },
  { slug: "caipirinha-regata", nome: "Regata Caipirinha", categoria: "Masculino", preco: 130.00, cor: "Nude", tamanhos: ["GG"] },
  { slug: "lisa-limon", nome: "Camisa Lisa Limon", categoria: "Masculino", preco: 130.00, cor: "Preta", tamanhos: ["GG"] },
  { slug: "caipirinha-pinga", nome: "Camisa Caipirinha Pinga", categoria: "Masculino", preco: 145.00, cor: "Marron", tamanhos: ["GG"] },
  { slug: "sol-cruzado", nome: "Camisa Sol Cruzado", categoria: "Masculino", preco: 130.00, cor: "Pink", tamanhos: ["GG"] },
  { slug: "bar-aberto", nome: "Camisa Bar Aberto", categoria: "Masculino", preco: 130.00, cor: "Preta", tamanhos: ["M", "GG"] },
  { slug: "saidera-nuca-so-uma", nome: "Camisa Saidera Nuca Só Uma", categoria: "Masculino", preco: 130.00, cor: "Nude", tamanhos: ["G"] },
  { slug: "caipirinha-pinha", nome: "Camisa Caipirinha Pinha", categoria: "Masculino", preco: 145.00, cor: "Marron", tamanhos: ["G"] },
  { slug: "churrasco-pao-de-alho", nome: "Camisa Churrasco Pão de Alho", categoria: "Masculino", preco: 145.00, cor: "Preta", tamanhos: ["M", "G"] },
  { slug: "copa-cerveja-churrasco", nome: "Camisa Copa Cerveja e Churrasco", categoria: "Masculino", preco: 145.00, cor: "Copa", tamanhos: ["M"] },

  // ===== FEMININO (MODA PRAIA) =====
  { slug: "biquini-marquinha", nome: "Biquini Marquinha", categoria: "Feminino", preco: 85.90, cor: "Chocolate, Verde Musgo, Laranja, Azul Bebê, Cerêja, Vinho, Preto, Rosa Pink, Fucsia, Amarelo Manteiga", tamanhos: ["P", "M", "G"] },
  { slug: "biquini-marquinha-premium", nome: "Biquini Marquinha Especial", categoria: "Feminino", preco: 89.90, cor: "Choco + Marrom, Chocolate + Off", tamanhos: ["P", "M"] },
  { slug: "mini-saia-trico", nome: "Mini Saia Tricô", categoria: "Feminino", preco: 65.90, cor: "Preto, Bege", tamanhos: ["U"] },

  // ===== LINGERIE =====
  { slug: "conjunto-bianca-bojo", nome: "Conjunto Bianca c/ Bojo", categoria: "Lingerie", preco: 55.90, cor: "Nude", tamanhos: ["P"] },
  { slug: "conjunto-afrodite", nome: "Conjunto Afrodite", categoria: "Lingerie", preco: 99.90, cor: "Preto", tamanhos: ["P"] },
  { slug: "conjunto-ilha-bela", nome: "Conjunto Ilha Bela", categoria: "Lingerie", preco: 59.90, cor: "Preto", tamanhos: ["P"] },
  { slug: "conjunto-lorena", nome: "Conjunto Lorena", categoria: "Lingerie", preco: 49.90, cor: "Verde Militar, Preto", tamanhos: ["M"] },
  { slug: "conjunto-mariana", nome: "Conjunto Mariana", categoria: "Lingerie", preco: 69.90, cor: "Vermelho", tamanhos: ["P"] },
  { slug: "conjunto-gabi", nome: "Conjunto Gabi", categoria: "Lingerie", preco: 59.90, cor: "Verde", tamanhos: ["M"] },
  { slug: "conjunto-serena", nome: "Conjunto Serena", categoria: "Lingerie", preco: 49.90, cor: "Roxo", tamanhos: ["M"] },
  { slug: "conjunto-zara", nome: "Conjunto Zara", categoria: "Lingerie", preco: 59.90, cor: "Preto", tamanhos: ["M"] },
  { slug: "conjunto-angel", nome: "Conjunto Angel", categoria: "Lingerie", preco: 69.90, cor: "Vermelho", tamanhos: ["M"] },
  { slug: "camisola-esther", nome: "Camisola Esther", categoria: "Lingerie", preco: 69.90, cor: "Pink", tamanhos: ["M"] },
  { slug: "conjunto-dulce", nome: "Conjunto Dulce", categoria: "Lingerie", preco: 79.90, cor: "Vermelho", tamanhos: ["M"] },
  { slug: "camisola-indecente", nome: "Camisola Indecente", categoria: "Lingerie", preco: 99.90, cor: "Preto", tamanhos: ["P", "G"] },
  { slug: "conjunto-ravena", nome: "Conjunto Ravena", categoria: "Lingerie", preco: 59.90, cor: "Lilas", tamanhos: ["G"] },
  { slug: "conjunto-saliente", nome: "Conjunto Saliente", categoria: "Lingerie", preco: 89.90, cor: "Branco", tamanhos: ["M"] },
  { slug: "conjunto-seducao", nome: "Conjunto Sedução", categoria: "Lingerie", preco: 79.90, cor: "Harmonia", tamanhos: ["M"] },
  { slug: "conjunto-cecilia", nome: "Conjunto Cecília", categoria: "Lingerie", preco: 79.90, cor: "Branco Floral", tamanhos: ["P", "G"] },
  { slug: "calcinhas-simples", nome: "Calcinhas Simples / Renda", categoria: "Lingerie", preco: 12.90, cor: "Azul, Branca", tamanhos: ["U"] },
  { slug: "calcinha-manu", nome: "Calcinha Manu", categoria: "Lingerie", preco: 18.90, cor: "Variadas", tamanhos: ["U"] },

  // ===== MODA FITNESS =====
  { slug: "conjunto-micro-canelado", nome: "Conjunto Micro Canelado", categoria: "Moda Fitness", preco: 59.90, cor: "Verde", tamanhos: ["P"] },
  { slug: "conjunto-canelado-marron", nome: "Conjunto Canelado", categoria: "Moda Fitness", preco: 49.90, cor: "Marron", tamanhos: ["G"] },

  // ===== SEXY SHOP =====
  { slug: "caneta-lubrificante", nome: "Caneta Lubrificante", categoria: "Sexy Shop", preco: 27.40, cor: "N/A", tamanhos: ["N/A"] },
  { slug: "gel-faisca", nome: "Gel Faisca Na Xavasca", categoria: "Sexy Shop", preco: 18.90, cor: "N/A", tamanhos: ["N/A"] },
  { slug: "gel-facilitador", nome: "Gel Facilitador de Org.", categoria: "Sexy Shop", preco: 34.00, cor: "N/A", tamanhos: ["N/A"] },
  { slug: "caldeirao-vibracao", nome: "Caldeirão da Vibração", categoria: "Sexy Shop", preco: 34.20, cor: "N/A", tamanhos: ["N/A"] },
  { slug: "gel-esquenta-gela", nome: "Gel Esquenta e Gela", categoria: "Sexy Shop", preco: 22.30, cor: "N/A", tamanhos: ["N/A"] },
  { slug: "tesao-raba", nome: "Tesão na Raba", categoria: "Sexy Shop", preco: 28.50, cor: "N/A", tamanhos: ["N/A"] },
  { slug: "bolinha-beijavel", nome: "Bolinha Beijavel", categoria: "Sexy Shop", preco: 15.00, cor: "N/A", tamanhos: ["N/A"] },
  { slug: "oleo-massagem", nome: "Óleo Massagem La Pimie", categoria: "Sexy Shop", preco: 25.00, cor: "N/A", tamanhos: ["N/A"] },
  { slug: "gel-pikasso", nome: "Gel Pikasso", categoria: "Sexy Shop", preco: 20.50, cor: "N/A", tamanhos: ["N/A"] },
  { slug: "garganta-profunda", nome: "Garganta Profunda", categoria: "Sexy Shop", preco: 38.50, cor: "N/A", tamanhos: ["N/A"] }
];

const formatarPreco = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* =========================
   CARRINHO (compatível)
========================= */
function lerCarrinhoCompat() {
  const chaves = ["carrinho_pm", "pm_cart_v1", "carrinho"];
  for (const k of chaves) {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      if (Array.isArray(v)) return { key: k, items: v };
    } catch {}
  }
  return { key: "carrinho_pm", items: [] };
}

function contarItensCarrinho(items) {
  return (items || []).reduce((acc, it) => {
    const q = Number(it?.qtd ?? it?.quantidade ?? 1);
    return acc + (Number.isFinite(q) ? q : 1);
  }, 0);
}

/* --- GESTÃO DE USUÁRIO --- */
function atualizarAreaCliente() {
  const area = document.getElementById("area-cliente");
  if (!area) return;

  const usuarioLogado = JSON.parse(localStorage.getItem("usuario_logado"));
  const { items: carrinho } = lerCarrinhoCompat();
  const count = contarItensCarrinho(carrinho);

  if (usuarioLogado) {
    const nomeExibir = usuarioLogado.nome ? usuarioLogado.nome.split(" ")[0] : "Conta";
    area.innerHTML = `
      <div class="flex items-center gap-4">
        <a href="perfil.html" class="hover:text-gold transition">Olá, ${nomeExibir}</a>
        <a href="carrinho.html" class="material-symbols-outlined !text-xl relative">
          shopping_bag
          <span id="cart-count" class="absolute -top-1 -right-1 bg-gold text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center ${count > 0 ? "" : "hidden"}">${count}</span>
        </a>
      </div>`;
  } else {
    area.innerHTML = `
      <a href="login.html" class="hover:text-gold transition">Entrar</a>
      <a href="carrinho.html" class="material-symbols-outlined !text-xl relative">
        shopping_bag
        <span id="cart-count" class="absolute -top-1 -right-1 bg-gold text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center ${count > 0 ? "" : "hidden"}">${count}</span>
      </a>`;
  }

  // Atualiza também o badge novo (data-cart-badge), se existir na página
  atualizarBadgesCarrinho();
}

/* --- BADGE DO CARRINHO (novo + antigo) --- */
function atualizarBadgesCarrinho() {
  const { items: carrinho } = lerCarrinhoCompat();
  const count = contarItensCarrinho(carrinho);

  // badge antigo (#cart-count)
  const badgeOld = document.getElementById("cart-count");
  if (badgeOld) {
    badgeOld.textContent = String(count);
    badgeOld.classList.toggle("hidden", count <= 0);
  }

  // badge novo ([data-cart-badge])
  document.querySelectorAll("[data-cart-badge]").forEach((el) => {
    el.textContent = String(count);
    el.classList.toggle("hidden", count <= 0);
  });
}

/* --- VITRINES --- */
function renderizarVitrine(containerId, filtro = "Todos") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const stockDb = JSON.parse(localStorage.getItem("stock_db")) || {};
  const lista = filtro === "Todos" ? PRODUTOS : PRODUTOS.filter((p) => p.categoria === filtro);

  container.innerHTML = lista.map((p) => {
    const stockInfo = stockDb[p.slug] || { esgotado: false };
    const labelEsgotado = stockInfo.esgotado
      ? '<span class="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded font-bold z-10">ESGOTADO</span>'
      : "";

    return `
      <a href="produto.html?produto=${p.slug}" class="group relative">
        ${labelEsgotado}
        <div class="aspect-[3/4] overflow-hidden rounded-xl bg-white shadow-sm group-hover:shadow-xl transition">
          <img src="${p.slug}-view1.jpeg"
               class="w-full h-full object-cover group-hover:scale-105 transition duration-500 ${stockInfo.esgotado ? "grayscale opacity-50" : ""}"
               alt="${p.nome}"
               onerror="this.src='hero-home.jpeg'">
        </div>
        <div class="mt-5">
          <h3 class="font-serif text-lg">${p.nome}</h3>
          <p class="text-sm text-black/50 mt-1">${p.categoria}</p>
          <p class="mt-2 text-gold font-medium">${formatarPreco(p.preco)}</p>
        </div>
      </a>`;
  }).join("");
}

/* --- SACOLA --- */
function exibirCarrinho() {
  const container = document.getElementById("itens-carrinho");
  const resumo = document.getElementById("resumo-carrinho");
  if (!container) return;

  const { key, items } = lerCarrinhoCompat();
  const carrinho = Array.isArray(items) ? items : [];

  if (carrinho.length === 0) {
    container.innerHTML = "<p class='text-center opacity-40 py-20 italic'>Sua sacola está vazia.</p>";
    resumo?.classList.add("hidden");
    atualizarBadgesCarrinho();
    return;
  }

  resumo?.classList.remove("hidden");

  let total = 0;

  container.innerHTML = carrinho.map((item, index) => {
    const qtd = Number(item?.qtd ?? item?.quantidade ?? 1) || 1;
    const preco = Number(item?.preco ?? 0) || 0;
    total += preco * qtd;

    return `
      <div class="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-sm">
        <img src="${item.slug}-view1.jpeg" class="w-20 h-24 object-cover rounded-lg" onerror="this.src='hero-home.jpeg'">
        <div class="flex-1">
          <h4 class="font-serif text-lg">${item.nome}</h4>
          <p class="text-[10px] uppercase tracking-widest opacity-40">${item.tamanho || "U"} | ${item.cor || "N/A"} ${qtd > 1 ? `| Qtd: ${qtd}` : ""}</p>
          <p class="text-gold font-bold mt-1">${formatarPreco(preco)}</p>
        </div>
        <button onclick="removerDoCarrinho(${index})" class="text-red-400 text-xs uppercase font-bold">Remover</button>
      </div>`;
  }).join("");

  const totalEl = document.getElementById("total-carrinho");
  if (totalEl) totalEl.textContent = formatarPreco(total);

  atualizarBadgesCarrinho();

  // mantém a chave oficial alinhada, se estava em key antiga
  if (key !== "carrinho_pm") localStorage.setItem("carrinho_pm", JSON.stringify(carrinho));
}

function removerDoCarrinho(index) {
  const { key, items } = lerCarrinhoCompat();
  let carrinho = Array.isArray(items) ? items : [];
  carrinho.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(carrinho));
  if (key !== "carrinho_pm") localStorage.setItem("carrinho_pm", JSON.stringify(carrinho));
  exibirCarrinho();
  atualizarAreaCliente();
}

/* (mantido para compatibilidade com páginas antigas) */
function adicionarAoCarrinho() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("produto");
  const p = PRODUTOS.find((item) => item.slug === slug);
  const tamanho = document.getElementById("select-tamanho")?.value || "U";
  if (!p) return;

  const { key, items } = lerCarrinhoCompat();
  const carrinho = Array.isArray(items) ? items : [];

  carrinho.push({ slug: p.slug, nome: p.nome, preco: p.preco, tamanho: tamanho, cor: p.cor, qtd: 1 });

  localStorage.setItem(key, JSON.stringify(carrinho));
  if (key !== "carrinho_pm") localStorage.setItem("carrinho_pm", JSON.stringify(carrinho));

  alert("Produto adicionado à sacola!");
  atualizarAreaCliente();
}

/* --- WHATSAPP FINAL --- */
function finalizarPedido() {
  const { items } = lerCarrinhoCompat();
  const carrinho = Array.isArray(items) ? items : [];
  const usuario = JSON.parse(localStorage.getItem("usuario_logado"));

  if (carrinho.length === 0) return;

  let mensagem = "*PEDIDO — PRAIA & MOVIMENTO*\n\n";

  if (usuario) {
    mensagem += `*Cliente:* ${usuario.nome || "Não identificado"}\n\n`;
  }

  mensagem += "*ITENS:*\n";
  let total = 0;

  carrinho.forEach((i) => {
    const qtd = Number(i?.qtd ?? i?.quantidade ?? 1) || 1;
    const preco = Number(i?.preco ?? 0) || 0;
    total += preco * qtd;
    mensagem += `• ${i.nome} (${i.tamanho || "U"}) x${qtd} - ${formatarPreco(preco)}\n`;
  });

  mensagem += `\n*TOTAL: ${formatarPreco(total)}*`;

  window.open(`https://wa.me/555197365965?text=${encodeURIComponent(mensagem)}`, "_blank");
}

/* --- INICIALIZAÇÃO --- */
window.addEventListener("DOMContentLoaded", () => {
  atualizarAreaCliente();

  renderizarVitrine("vitrine-masculino", "Masculino");
  renderizarVitrine("vitrine-feminino", "Feminino");
  renderizarVitrine("vitrine-lingerie", "Lingerie");
  renderizarVitrine("vitrine-sexyshop", "Sexy Shop");
  renderizarVitrine("vitrine-loja", "Todos");

  // compat: páginas antigas que usam ids de produto
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("produto");
  if (slug && document.getElementById("nome-produto")) {
    const p = PRODUTOS.find((item) => item.slug === slug);
    if (!p) return;

    const stockDb = JSON.parse(localStorage.getItem("stock_db")) || {};
    const stockInfo = stockDb[slug] || { esgotado: false, tamanhos: p.tamanhos };

    document.getElementById("nome-produto").textContent = p.nome;
    document.getElementById("preco-produto").textContent = formatarPreco(p.preco);
    document.getElementById("categoria-produto").textContent = p.categoria;
    document.getElementById("cor-produto").textContent = `Cor: ${p.cor}`;
    const img = document.getElementById("imagem-principal");
    if (img) img.src = `${p.slug}-view1.jpeg`;

    const selectTamanho = document.getElementById("select-tamanho");
    const btnAdicionar = document.getElementById("btn-add-carrinho");

    if (stockInfo.esgotado) {
      if (selectTamanho) {
        selectTamanho.innerHTML = `<option>ESGOTADO</option>`;
        selectTamanho.disabled = true;
      }
      if (btnAdicionar) {
        btnAdicionar.disabled = true;
        btnAdicionar.textContent = "PRODUTO ESGOTADO";
        btnAdicionar.classList.add("opacity-50", "cursor-not-allowed");
      }
    } else {
      const tamanhosParaMostrar = stockInfo.tamanhos || p.tamanhos;
      if (selectTamanho) {
        selectTamanho.innerHTML = (tamanhosParaMostrar || []).map((t) => `<option value="${t}">${t}</option>`).join("");
      }
    }
  }

  atualizarBadgesCarrinho();
});
