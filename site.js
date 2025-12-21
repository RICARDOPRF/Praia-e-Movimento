/* ================================
   PRAIA & MOVIMENTO — SITE.JS 
   Cérebro da Loja Integrada
================================ */

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

const formatarPreco = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* --- GESTÃO DE USUÁRIO --- */
function atualizarAreaCliente() {
    const area = document.getElementById("area-cliente");
    if (!area) return;
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario_logado"));
    
    if (usuarioLogado) {
        area.innerHTML = `
            <div class="flex items-center gap-4">
                <a href="perfil.html" class="hover:text-gold transition">Olá, ${usuarioLogado.nome.split(' ')[0]}</a>
                <a href="carrinho.html" class="material-symbols-outlined !text-xl relative">
                    shopping_bag
                    <span id="cart-count" class="absolute -top-1 -right-1 bg-gold text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
                </a>
            </div>`;
        atualizarContadorCarrinho();
    } else {
        area.innerHTML = `
            <a href="login.html" class="hover:text-gold transition">Entrar</a>
            <a href="carrinho.html" class="material-symbols-outlined !text-xl">shopping_bag</a>`;
    }
}

/* --- VITRINES (AGORA COM FILTRO DE ESGOTADO) --- */
function renderizarVitrine(containerId, filtro = "Todos") {
  const container = document.getElementById(containerId);
  if (!container) return;
  const stockDb = JSON.parse(localStorage.getItem('stock_db')) || {};
  
  const lista = filtro === "Todos" ? PRODUTOS : PRODUTOS.filter(p => p.categoria === filtro);
  
  container.innerHTML = lista.map(p => {
    const stockInfo = stockDb[p.slug] || { esgotado: false };
    const labelEsgotado = stockInfo.esgotado ? '<span class="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded font-bold z-10">ESGOTADO</span>' : '';
    
    return `
    <a href="produto.html?produto=${p.slug}" class="group relative">
      ${labelEsgotado}
      <div class="aspect-[3/4] overflow-hidden rounded-xl bg-white shadow-sm group-hover:shadow-xl transition">
        <img src="${p.slug}-view1.jpeg" class="w-full h-full object-cover group-hover:scale-105 transition duration-500 ${stockInfo.esgotado ? 'grayscale opacity-50' : ''}">
      </div>
      <div class="mt-5">
        <h3 class="font-serif text-lg">${p.nome}</h3>
        <p class="text-sm text-black/50 mt-1">${p.categoria}</p>
        <p class="mt-2 text-gold font-medium">${formatarPreco(p.preco)}</p>
      </div>
    </a>`;
  }).join('');
}

/* --- SACOLA --- */
function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho_pm")) || [];
    const badge = document.getElementById("cart-count");
    if (badge) badge.textContent = carrinho.length;
}

function exibirCarrinho() {
    const container = document.getElementById("itens-carrinho");
    const resumo = document.getElementById("resumo-carrinho");
    if (!container) return;

    const carrinho = JSON.parse(localStorage.getItem("carrinho_pm")) || [];
    
    if (carrinho.length === 0) {
        container.innerHTML = "<p class='text-center opacity-40 py-20 italic'>Sua sacola está vazia.</p>";
        resumo?.classList.add("hidden");
        return;
    }

    resumo?.classList.remove("hidden");
    let total = 0;
    
    container.innerHTML = carrinho.map((item, index) => {
        total += item.preco;
        return `
        <div class="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-sm">
            <img src="${item.slug}-view1.jpeg" class="w-20 h-24 object-cover rounded-lg">
            <div class="flex-1">
                <h4 class="font-serif text-lg">${item.nome}</h4>
                <p class="text-[10px] uppercase tracking-widest opacity-40">${item.tamanho} | ${item.cor}</p>
                <p class="text-gold font-bold mt-1">${formatarPreco(item.preco)}</p>
            </div>
            <button onclick="removerDoCarrinho(${index})" class="text-red-400 text-xs uppercase font-bold">Remover</button>
        </div>`;
    }).join('');

    document.getElementById("total-carrinho").textContent = formatarPreco(total);
}

function removerDoCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho_pm")) || [];
    carrinho.splice(index, 1);
    localStorage.setItem("carrinho_pm", JSON.stringify(carrinho));
    exibirCarrinho();
    atualizarAreaCliente();
}

function adicionarAoCarrinho() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("produto");
  const p = PRODUTOS.find(item => item.slug === slug);
  const tamanho = document.getElementById("select-tamanho")?.value || "U";
  if (!p) return;

  let carrinho = JSON.parse(localStorage.getItem("carrinho_pm")) || [];
  carrinho.push({ slug: p.slug, nome: p.nome, preco: p.preco, tamanho: tamanho, cor: p.cor });
  localStorage.setItem("carrinho_pm", JSON.stringify(carrinho));
  alert("Produto adicionado à sacola!");
  atualizarAreaCliente();
}

/* --- WHATSAPP FINAL --- */
function finalizarPedido() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho_pm")) || [];
    const usuario = JSON.parse(localStorage.getItem("usuario_logado"));

    if (carrinho.length === 0) return;

    let mensagem = "*PEDIDO — PRAIA & MOVIMENTO*\n\n";
    
    if (usuario) {
        mensagem += `*Cliente:* ${usuario.nome}\n`;
        mensagem += `*Endereço:* ${usuario.rua}, ${usuario.numero} - ${usuario.cidade}\n\n`;
    }

    mensagem += "*ITENS:*\n";
    let total = 0;
    carrinho.forEach(i => {
        mensagem += `• ${i.nome} (${i.tamanho}) - ${formatarPreco(i.preco)}\n`;
        total += i.preco;
    });

    mensagem += `\n*TOTAL: ${formatarPreco(total)}*`;
    
    window.open(`https://wa.me/555197365965?text=${encodeURIComponent(mensagem)}`, "_blank");
}

/* --- INICIALIZAÇÃO --- */
window.addEventListener('DOMContentLoaded', () => {
  atualizarAreaCliente();
  renderizarVitrine("vitrine-masculino", "Masculino");
  renderizarVitrine("vitrine-feminino", "Feminino");
  renderizarVitrine("vitrine-lingerie", "Lingerie");
  renderizarVitrine("vitrine-sexyshop", "Sexy Shop");
  renderizarVitrine("vitrine-loja", "Todos");

  // Lógica da página de produto individual com suporte ao Stock do Admin
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("produto");
  if (slug && document.getElementById("nome-produto")) {
    const p = PRODUTOS.find(item => item.slug === slug);
    const stockDb = JSON.parse(localStorage.getItem('stock_db')) || {};
    const stockInfo = stockDb[slug] || { esgotado: false, tamanhos: p.tamanhos };

    if (p) {
        document.getElementById("nome-produto").textContent = p.nome;
        document.getElementById("preco-produto").textContent = formatarPreco(p.preco);
        document.getElementById("categoria-produto").textContent = p.categoria;
        document.getElementById("cor-produto").textContent = `Cor: ${p.cor}`;
        document.getElementById("imagem-principal").src = `${p.slug}-view1.jpeg`;

        const selectTamanho = document.getElementById("select-tamanho");
        const btnAdicionar = document.querySelector("button[onclick='adicionarAoCarrinho()']");

        if (stockInfo.esgotado) {
            selectTamanho.innerHTML = `<option>ESGOTADO</option>`;
            selectTamanho.disabled = true;
            if(btnAdicionar) {
                btnAdicionar.disabled = true;
                btnAdicionar.textContent = "PRODUTO ESGOTADO";
                btnAdicionar.classList.add("opacity-50", "cursor-not-allowed");
            }
        } else {
            // Mostra apenas os tamanhos que estão ativos no Admin ou no site.js
            const tamanhosParaMostrar = stockInfo.tamanhos || p.tamanhos;
            selectTamanho.innerHTML = tamanhosParaMostrar.map(t => `<option value="${t}">${t}</option>`).join('');
        }
    }
  }
});