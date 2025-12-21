/* ================================
   PRAIA & MOVIMENTO — SITE.JS
================================ */

const PRODUTOS = [
  // MASCULINO
  {
    slug: "masculino-churrasco-pao-de-alho-preta",
    nome: "Camisa Churrasco Pão de Alho",
    categoria: "Masculino",
    preco: 145.00,
    tamanhos: ["M", "G", "GG"],
    cor: "Preta",
    imagemPrincipal: "masculino-churrasco-pao-de-alho-preta-view1.jpeg"
  },
  {
    slug: "masculino-saideira-nunca-e-so-uma-nude",
    nome: "A Saideira Nunca é Só Uma",
    categoria: "Masculino",
    preco: 130.00,
    tamanhos: ["M", "G", "GG"],
    cor: "Nude",
    imagemPrincipal: "masculino-saideira-nunca-e-so-uma-nude-view1.jpeg"
  },
  // FEMININO
  {
    slug: "biquini-floripa",
    nome: "Biquíni Floripa",
    categoria: "Feminino",
    preco: 85.90,
    tamanhos: ["P", "M", "G"],
    cor: "Vermelho/Verde/Rosa",
    imagemPrincipal: "biquini-floripa-vermelho-view1.jpeg"
  },
  // LINGERIE
  {
    slug: "conjunto-bianca",
    nome: "Conjunto Bianca",
    categoria: "Lingerie",
    preco: 55.90,
    tamanhos: ["P", "M", "G"],
    cor: "Nude",
    imagemPrincipal: "lingerie-renda-preta-view1.jpeg"
  }
];

// Formatação de Preço
const formatarPreco = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* GERA A VITRINE AUTOMATICAMENTE */
function renderizarVitrine(containerId, filtro = "Todos") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const lista = filtro === "Todos" ? PRODUTOS : PRODUTOS.filter(p => p.categoria === filtro);

  container.innerHTML = lista.map(p => `
    <a href="produto.html?produto=${p.slug}" class="group bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition">
      <div class="aspect-[3/4] overflow-hidden rounded-xl">
        <img src="${p.imagemPrincipal}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
      </div>
      <div class="mt-4">
        <p class="text-[10px] uppercase tracking-widest text-gold font-bold">${p.categoria}</p>
        <h3 class="font-serif text-lg text-ink">${p.nome}</h3>
        <p class="text-gold font-semibold mt-1">${formatarPreco(p.preco)}</p>
      </div>
    </a>
  `).join('');
}

/* PREENCHE A PÁGINA DE PRODUTO */
function carregarProduto() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("produto");
  const p = PRODUTOS.find(item => item.slug === slug);

  if (!p) return;

  document.getElementById("nome-produto").textContent = p.nome;
  document.getElementById("categoria-produto").textContent = p.categoria;
  document.getElementById("preco-produto").textContent = formatarPreco(p.preco);
  document.getElementById("cor-produto").textContent = `Cor: ${p.cor}`;
  
  const select = document.getElementById("select-tamanho");
  select.innerHTML = p.tamanhos.map(t => `<option value="${t}">${t}</option>`).join('');

  const imgPrincipal = document.getElementById("imagem-principal");
  imgPrincipal.src = p.imagemPrincipal;

  const zap = document.getElementById("whatsapp-link");
  zap.href = `https://wa.me/555197365965?text=Olá! Gostaria de comprar o produto: ${p.nome}`;
}

window.onload = () => {
  renderizarVitrine("vitrine-masculino", "Masculino");
  renderizarVitrine("vitrine-feminino", "Feminino");
  renderizarVitrine("vitrine-lingerie", "Lingerie");
  renderizarVitrine("vitrine-loja", "Todos");
  carregarProduto();
};