/* ================================
   PRAIA & MOVIMENTO — SITE.JS
   Base Central de Produtos
================================ */

const PRODUTOS = [
  // MASCULINO
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
  },
  // FEMININO
  {
    slug: "biquini-floripa",
    nome: "Biquíni Floripa",
    categoria: "Feminino",
    preco: 85.90,
    tamanhos: ["P", "M", "G"]
  },
  // LINGERIE
  {
    slug: "lingerie-renda-preta",
    nome: "Lingerie Renda Preta",
    categoria: "Lingerie",
    preco: 179.90,
    tamanhos: ["P", "M"]
  },
  {
    slug: "lingerie-sensual-vermelha",
    nome: "Lingerie Vermelha Sensual",
    categoria: "Lingerie",
    preco: 189.90,
    tamanhos: ["P", "M", "G"]
  },
  {
    slug: "lingerie-cetim-nude",
    nome: "Lingerie Cetim Nude",
    categoria: "Lingerie",
    preco: 169.90,
    tamanhos: ["P", "M"]
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

  // Filtra por categoria (se houver filtro) e renderiza os cards
  PRODUTOS
    .filter(p => !filtroCategoria || p.categoria === filtroCategoria)
    .forEach(produto => {
      const card = document.createElement("div");
      card.className = "group";

      card.innerHTML = `
        <a href="produto.html?produto=${produto.slug}">
          <div class="aspect-[3/4] bg-white overflow-hidden rounded-xl shadow-sm border border-black/5">
            <img 
              src="${produto.slug}-view1.jpeg" 
              class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              onerror="this.src='https://placehold.co/400x600?text=Produto+Sem+Foto'"
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
  if (!produto) {
      console.error("Produto não encontrado");
      return;
  }

  // Atualiza os textos da página
  const elNome = document.getElementById("nome-produto");
  const elCat = document.getElementById("categoria");
  const elPreco = document.getElementById("preco-produto");
  const imgPrincipal = document.getElementById("imagem-principal");

  if(elNome) elNome.textContent = produto.nome;
  if(elCat) elCat.textContent = produto.categoria;
  if(elPreco) elPreco.textContent = formatarPreco(produto.preco);
  if(imgPrincipal) imgPrincipal.src = `${produto.slug}-view1.jpeg`;

  // Preenche o seletor de tamanhos
  const select = document.querySelector("select");
  if (select) {
      select.innerHTML = "";
      produto.tamanhos.forEach(t => {
        const opt = document.createElement("option");
        opt.textContent = t;
        select.appendChild(opt);
      });
  }

  // Link do WhatsApp
  const btnWhats = document.getElementById("whatsapp-link");
  if (btnWhats) {
      btnWhats.href = `https://wa.me/555197365965?text=Olá! Tenho interesse no produto: ${produto.nome} (Tamanho: a definir)`;
  }
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
  alert("Produto adicionado ao carrinho!");
}