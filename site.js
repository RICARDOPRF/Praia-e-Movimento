/* ================================
   PRAIA & MOVIMENTO — SITE.JS
   Central de Inteligência e Carrinho
================================ */

const PRODUTOS = [
  // ===== MASCULINO =====
  {
    slug: "masculino-churrasco-pao-de-alho-preta",
    nome: "Camisa Churrasco Pão de Alho",
    categoria: "Masculino",
    preco: 145.00,
    cor: "Preta",
    tamanhos: ["M", "G", "GG"]
  },
  {
    slug: "masculino-saideira-nunca-e-so-uma-nude",
    nome: "A Saideira Nunca é Só Uma",
    categoria: "Masculino",
    preco: 130.00,
    cor: "Nude",
    tamanhos: ["M", "G", "GG"]
  },
  {
    slug: "masculino-sexta-feira-em-algum-lugar-pink",
    nome: "Sexta-feira em Algum Lugar",
    categoria: "Masculino",
    preco: 130.00,
    cor: "Pink",
    tamanhos: ["M", "G"]
  },

  // ===== FEMININO =====
  {
    slug: "biquini-floripa",
    nome: "Biquíni Floripa",
    categoria: "Feminino",
    preco: 85.90,
    cor: "Estampado",
    tamanhos: ["P", "M", "G"]
  },

  // ===== LINGERIE =====
  {
    slug: "conjunto-bianca",
    nome: "Conjunto Bianca",
    categoria: "Lingerie",
    preco: 55.90,
    cor: "Renda Preta",
    tamanhos: ["P", "M", "G"]
  }
];

// Utilitário para formatar moeda
const formatarPreco = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* 1. RENDERIZAR VITRINES AUTOMATICAMENTE */
function renderizarVitrine(containerId, filtro = "Todos") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const lista = filtro === "Todos" ? PRODUTOS : PRODUTOS.filter(p => p.categoria === filtro);

  container.innerHTML = lista.map(p => `
    <a href="produto.html?produto=${p.slug}" class="group bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl transition duration-300">
      <div class="aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
        <img src="${p.slug}-view1.jpeg" alt="${p.nome}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
      </div>
      <div class="mt-5">
        <span class="text-[10px] tracking-[0.2em] text-gold font-bold uppercase">${p.categoria}</span>
        <h3 class="font-serif text-lg text-ink mt-1">${p.nome}</h3>
        <p class="text-gold font-semibold mt-2">${formatarPreco(p.preco)}</p>
      </div>
    </a>
  `).join('');
}

/* 2. CARREGAR PÁGINA DE PRODUTO */
function carregarPaginaProduto() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("produto");
  const p = PRODUTOS.find(item => item.slug === slug);

  if (!p) return;

  if(document.getElementById("nome-produto")) document.getElementById("nome-produto").textContent = p.nome;
  if(document.getElementById("categoria-produto")) document.getElementById("categoria-produto").textContent = p.categoria;
  if(document.getElementById("preco-produto")) document.getElementById("preco-produto").textContent = formatarPreco(p.preco);
  if(document.getElementById("cor-produto")) document.getElementById("cor-produto").textContent = `Cor: ${p.cor}`;
  
  const select = document.getElementById("select-tamanho");
  if(select) select.innerHTML = p.tamanhos.map(t => `<option value="${t}">${t}</option>`).join('');

  const imgPrincipal = document.getElementById("imagem-principal");
  if(imgPrincipal) imgPrincipal.src = `${p.slug}-view1.jpeg`;
}

/* 3. LÓGICA DA SACOLA (CARRINHO) */
function adicionarAoCarrinho() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("produto");
  const p = PRODUTOS.find(item => item.slug === slug);
  const selectTamanho = document.getElementById("select-tamanho");
  const tamanho = selectTamanho ? selectTamanho.value : "U";

  if (!p) return;

  let carrinho = JSON.parse(localStorage.getItem("carrinho_pm")) || [];
  
  carrinho.push({
    slug: p.slug,
    nome: p.nome,
    preco: p.preco,
    tamanho: tamanho,
    cor: p.cor
  });

  localStorage.setItem("carrinho_pm", JSON.stringify(carrinho));
  alert("Adicionado à sacola!");
  window.location.href = "carrinho.html";
}

function exibirCarrinho() {
  const container = document.getElementById("itens-carrinho");
  const resumo = document.getElementById("resumo-carrinho");
  if (!container) return;

  let carrinho = JSON.parse(localStorage.getItem("carrinho_pm")) || [];

  if (carrinho.length === 0) {
    container.innerHTML = `<div class="py-20 text-center opacity-40 italic">Sua sacola está vazia.</div>`;
    if(resumo) resumo.classList.add("hidden");
    return;
  }

  if(resumo) resumo.classList.remove("hidden");
  let total = 0;

  container.innerHTML = carrinho.map((item, index) => {
    total += item.preco;
    return `
      <div class="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-black/5">
        <img src="${item.slug}-view1.jpeg" class="w-20 h-24 object-cover rounded-lg">
        <div class="flex-1">
          <h3 class="font-serif text-lg leading-tight">${item.nome}</h3>
          <p class="text-[10px] text-black/40 uppercase font-bold mt-1">TAM: ${item.tamanho} | COR: ${item.cor}</p>
          <p class="text-gold font-bold mt-1">${formatarPreco(item.preco)}</p>
        </div>
        <button onclick="removerDoCarrinho(${index})" class="p-2 text-red-400 hover:bg-red-50 rounded-full transition">
           remover
        </button>
      </div>
    `;
  }).join('');

  const totalEl = document.getElementById("total-carrinho");
  if(totalEl) totalEl.textContent = formatarPreco(total);
}

function removerDoCarrinho(index) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho_pm")) || [];
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho_pm", JSON.stringify(carrinho));
  exibirCarrinho();
}

function finalizarPedido() {
  let carrinho = JSON.parse(localStorage.getItem("carrinho_pm")) || [];
  if (carrinho.length === 0) return;

  let texto = "🌊 *Novo Pedido - Praia & Movimento*\n\n";
  let total = 0;

  carrinho.forEach((item, i) => {
    texto += `*${i+1}. ${item.nome}*\n`;
    texto += `   Tamanho: ${item.tamanho} | Cor: ${item.cor}\n`;
    texto += `   Valor: ${formatarPreco(item.preco)}\n\n`;
    total += item.preco;
  });

  texto += `──────────────\n`;
  texto += `*TOTAL DO PEDIDO: ${formatarPreco(total)}*\n\n`;
  texto += `_Aguardo o retorno para combinar o pagamento._`;
  
  const zapUrl = `https://wa.me/555197365965?text=${encodeURIComponent(texto)}`;
  window.open(zapUrl, "_blank");
}

/* 4. INICIALIZAÇÃO */
window.addEventListener('DOMContentLoaded', () => {
  renderizarVitrine("vitrine-masculino", "Masculino");
  renderizarVitrine("vitrine-feminino", "Feminino");
  renderizarVitrine("vitrine-lingerie", "Lingerie");
  renderizarVitrine("vitrine-loja", "Todos");
  carregarPaginaProduto();
  if (document.getElementById("itens-carrinho")) exibirCarrinho();
});