/* ================================
   PRAIA & MOVIMENTO — SITE.JS
   Central de Produtos
================================ */

const PRODUTOS = [
  // ===== MASCULINO =====
  {
    slug: "masculino-churrasco-pao-de-alho-preta",
    nome: "Camisa Churrasco Pão de Alho",
    categoria: "Masculino",
    preco: 145.00,
    tamanhos: ["M", "G", "GG"]
  },
  {
    slug: "masculino-saideira-nunca-e-so-uma-nude",
    nome: "A Saideira Nunca é Só Uma",
    categoria: "Masculino",
    preco: 130.00,
    tamanhos: ["M", "G", "GG"]
  },
  {
    slug: "masculino-sexta-feira-em-algum-lugar-pink",
    nome: "Sexta-feira em Algum Lugar",
    categoria: "Masculino",
    preco: 130.00,
    tamanhos: ["M", "G"]
  },

  // ===== FEMININO =====
  {
    slug: "biquini-floripa",
    nome: "Biquíni Floripa",
    categoria: "Feminino",
    preco: 85.90,
    tamanhos: ["P", "M", "G"]
  },

  // ===== LINGERIE =====
  {
    slug: "conjunto-bianca",
    nome: "Conjunto Bianca",
    categoria: "Lingerie",
    preco: 55.90,
    tamanhos: ["P", "M", "G"]
  },
  {
    slug: "conjunto-afrodite",
    nome: "Conjunto Afrodite",
    categoria: "Lingerie",
    preco: 99.90,
    tamanhos: ["P", "M"]
  },
  {
    slug: "camisola-esther",
    nome: "Camisola Esther",
    categoria: "Lingerie",
    preco: 69.90,
    tamanhos: ["P", "M", "G"]
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
   PRODUTO.HTML — CARGA DINÂMICA
================================ */

function carregarProduto() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("produto");
  if (!slug) return;

  const produto = getProduto(slug);
  if (!produto) return;

  // Textos
  document.getElementById("nome-produto").textContent = produto.nome;
  document.getElementById("categoria-produto").textContent = produto.categoria;
  document.getElementById("preco-produto").textContent = formatarPreco(produto.preco);

  // Tamanhos
  const select = document.getElementById("select-tamanho");
  select.innerHTML = "";
  produto.tamanhos.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    select.appendChild(opt);
  });

  // Galeria
  const imgPrincipal = document.getElementById("imagem-principal");
  const thumbs = document.getElementById("thumbnails");
  thumbs.innerHTML = "";

  let primeiraImagem = true;

  for (let i = 1; i <= 5; i++) {
    const img = new Image();
    img.src = `${slug}-view${i}.jpeg`;

    img.onload = () => {
      if (primeiraImagem) {
        imgPrincipal.src = img.src;
        primeiraImagem = false;
      }

      img.className =
        "w-20 h-28 object-cover rounded cursor-pointer border border-black/20";
      img.onclick = () => (imgPrincipal.src = img.src);
      thumbs.appendChild(img);
    };
  }

  // Vídeo opcional
  const video = document.getElementById("video-produto");
  const videoSrc = `${slug}-view4.mp4`;

  fetch(videoSrc, { method: "HEAD" })
    .then(res => {
      if (res.ok) {
        video.src = videoSrc;
        video.classList.remove("hidden");
      }
    });

  // WhatsApp
  const whatsapp = document.getElementById("whatsapp-link");
  whatsapp.href =
    `https://wa.me/555197365965?text=` +
    encodeURIComponent(`Olá! Tenho interesse no produto: ${produto.nome}`);
}
