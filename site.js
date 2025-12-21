/* ================================
   PRAIA & MOVIMENTO — SITE.JS
   Base Central de Produtos
================================ */

const PRODUTOS = [
  {
    slug: "masculino-churrasco-pao-de-alho-preta",
    nome: "Camisa Churrasco Pão de Alho",
    categoria: "Masculino",
    preco: 145.00,
    tamanhos: ["M", "G", "GG"]
  },
  {
    slug: "masculino-saideira-nunca-e-so-uma-nude",
    nome: "Camisa Saideira Nunca é Só Uma",
    categoria: "Masculino",
    preco: 130.00,
    tamanhos: ["M", "G", "GG"]
  },
  {
    slug: "masculino-sexta-feira-em-algum-lugar-pink",
    nome: "Regata Sexta-feira em Algum Lugar",
    categoria: "Masculino",
    preco: 130.00,
    tamanhos: ["M", "G"]
  }
];

/* ================================
   UTILIDADES
================================ */

function getProduto(slug) {
  return PRODUTOS.find(p => p.slug === slug);
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

/* ================================
   LOJA / LISTAGEM
================================ */

function renderLoja(containerId, filtroCategoria = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  PRODUTOS
    .filter(p => !filtroCategoria || p.categoria === filtroCategoria)
    .forEach(produto => {
      const card = document.createElement("div");
      card.className = "group";

      card.innerHTML = `
        <a href="produto.html?produto=${produto.slug}">
          <div class="aspect-[3/4] bg-gray-100 overflow-hidden rounded-xl">
            <img 
              src="${produto.slug}-view1.jpeg"
              class="w-full h-full object-cover group-hover:scale-105 transition"
              loading="lazy"
            />
          </div>
          <h3 class="font-serif text-lg mt-3">${produto.nome}</h3>
          <p class="text-sm text-gray-500">${produto.categoria}</p>
          <p class="font-semibold text-gold mt-1">${formatarPreco(produto.preco)}</p>
        </a>
      `;

      container.appendChild(card);
    });
}

/* ================================
   PRODUTO.HTML
================================ */

function carregarProduto() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("produto");
  if (!slug) return;

  const produto = getProduto(slug);
  if (!produto) return;

  document.getElementById("nome-produto").textContent = produto.nome;
  document.getElementById("categoria").textContent = produto.categoria;
  document.getElementById("preco-produto").textContent = formatarPreco(produto.preco);

  const select = document.querySelector("select");
  select.innerHTML = "";
  produto.tamanhos.forEach(t => {
    const opt = document.createElement("option");
    opt.textContent = t;
    select.appendChild(opt);
  });

  document.getElementById("whatsapp-link").href =
    `https://wa.me/555197365965?text=Tenho interesse no produto: ${produto.nome}`;
}

/* ================================
   CARRINHO
================================ */

function getCarrinho() {
  return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function addCarrinho(slug, tamanho) {
  const carrinho = getCarrinho();
  carrinho.push({ slug, tamanho, qtd: 1 });
  salvarCarrinho(carrinho);
  alert("Produto adicionado ao carrinho");
}

function gerarResumoWhatsApp() {
  const carrinho = getCarrinho();
  if (carrinho.length === 0) return "";

  let texto = "🛍️ Pedido Praia & Movimento:%0A%0A";
  let total = 0;

  carrinho.forEach(item => {
    const p = getProduto(item.slug);
    texto += `• ${p.nome} (${item.tamanho}) — ${formatarPreco(p.preco)}%0A`;
    total += p.preco;
  });

  texto += `%0A💰 Total: ${formatarPreco(total)}`;
  return texto;
}
