/* ================================
   PRAIA & MOVIMENTO — SITE.JS 
   Versão Final: Cliente, Loja e Carrinho
================================ */

const PRODUTOS = [
  { slug: "masculino-churrasco-pao-de-alho-preta", nome: "Camisa Churrasco Pão de Alho", categoria: "Masculino", preco: 145.00, cor: "Preta", tamanhos: ["M", "G", "GG"] },
  { slug: "masculino-saideira-nunca-e-so-uma-nude", nome: "A Saideira Nunca é Só Uma", categoria: "Masculino", preco: 130.00, cor: "Nude", tamanhos: ["M", "G", "GG"] },
  { slug: "masculino-sexta-feira-em-algum-lugar-pink", nome: "Sexta-feira em Algum Lugar", categoria: "Masculino", preco: 130.00, cor: "Pink", tamanhos: ["M", "G"] },
  { slug: "biquini-floripa", nome: "Biquíni Floripa", categoria: "Feminino", preco: 85.90, cor: "Estampado", tamanhos: ["P", "M", "G"] },
  { slug: "conjunto-bianca", nome: "Conjunto Bianca", categoria: "Lingerie", preco: 55.90, cor: "Renda Preta", tamanhos: ["P", "M", "G"] }
];

const formatarPreco = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/* --- SISTEMA DE LOGIN/CADASTRO DO CLIENTE --- */

function registrarCliente(nome, email, senha) {
  const usuario = { nome, email, senha };
  localStorage.setItem(`user_${email}`, JSON.stringify(usuario));
  alert("Cadastro realizado com sucesso!");
  window.location.href = "login.html";
}

function loginCliente(email, senha) {
  const dados = localStorage.getItem(`user_${email}`);
  if (dados) {
    const usuario = JSON.parse(dados);
    if (usuario.senha === senha) {
      localStorage.setItem("cliente_nome", usuario.nome);
      localStorage.setItem("cliente_logado", "true");
      window.location.href = "index.html";
    } else {
      alert("Senha incorreta!");
    }
  } else {
    alert("E-mail não encontrado!");
  }
}

function verificarCliente() {
  const nome = localStorage.getItem("cliente_nome");
  const logado = localStorage.getItem("cliente_logado");
  const areaCliente = document.getElementById("area-cliente");

  if (logado === "true" && areaCliente) {
    areaCliente.innerHTML = `
      <div class="flex items-center gap-4">
        <a href="minha-conta.html" class="text-[10px] font-bold uppercase tracking-widest text-gold italic hover:underline">
          Olá, ${nome.split(' ')[0]}!
        </a>
        <button onclick="logoutCliente()" class="text-[10px] text-ink/40 hover:text-red-500 font-bold uppercase transition">Sair</button>
      </div>
    `;
  }
}

function logoutCliente() {
  localStorage.removeItem("cliente_nome");
  localStorage.removeItem("cliente_logado");
  window.location.href = "index.html";
}

/* --- RENDERIZAÇÃO DA LOJA --- */

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

/* --- SACOLA (CARRINHO) --- */

function adicionarAoCarrinho() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("produto");
  const p = PRODUTOS.find(item => item.slug === slug);
  const selectTamanho = document.getElementById("select-tamanho");
  const tamanho = selectTamanho ? selectTamanho.value : "U";

  if (!p) return;

  let carrinho = JSON.parse(localStorage.getItem("carrinho_pm")) || [];
  carrinho.push({ slug: p.slug, nome: p.nome, preco: p.preco, tamanho: tamanho, cor: p.cor });
  localStorage.setItem("carrinho_pm", JSON.stringify(carrinho));
  
  window.location.href = "carrinho.html";
}

function exibirCarrinho() {
  const container = document.getElementById("itens-carrinho");
  if (!container) return;

  let carrinho = JSON.parse(localStorage.getItem("carrinho_pm")) || [];
  let total = 0;

  if (carrinho.length === 0) {
    container.innerHTML = `<div class="py-20 text-center opacity-40 italic">Sua sacola está vazia.</div>`;
    if(document.getElementById("resumo-carrinho")) document.getElementById("resumo-carrinho").classList.add("hidden");
    return;
  }

  container.innerHTML = carrinho.map((item, index) => {
    total += item.preco;
    return `
      <div class="flex items-center gap-4 bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
        <img src="${item.slug}-view1.jpeg" class="w-16 h-20 object-cover rounded-lg">
        <div class="flex-1">
          <h3 class="font-serif text-md leading-tight">${item.nome}</h3>
          <p class="text-[9px] text-black/40 uppercase font-bold">${item.tamanho} | ${item.cor}</p>
          <p class="text-gold font-bold">${formatarPreco(item.preco)}</p>
        </div>
        <button onclick="removerDoCarrinho(${index})" class="text-red-400 text-[10px] font-bold uppercase">Remover</button>
      </div>
    `;
  }).join('');

  if(document.getElementById("total-carrinho")) document.getElementById("total-carrinho").textContent = formatarPreco(total);
}

function removerDoCarrinho(index) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho_pm")) || [];
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho_pm", JSON.stringify(carrinho));
  exibirCarrinho();
}

function finalizarPedido() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho_pm")) || [];
  const nomeCliente = localStorage.getItem("cliente_nome") || "Cliente não identificado";
  
  if (carrinho.length === 0) return alert("Sua sacola está vazia!");

  let texto = `🌊 *PEDIDO: PRAIA & MOVIMENTO*\n`;
  texto += `👤 *Cliente:* ${nomeCliente}\n`;
  texto += `────────────────────\n\n`;

  let total = 0;
  carrinho.forEach((item, i) => {
    texto += `*${i+1}. ${item.nome}*\n   Tam: ${item.tamanho} | ${formatarPreco(item.preco)}\n\n`;
    total += item.preco;
  });

  texto += `────────────────────\n`;
  texto += `*TOTAL:* ${formatarPreco(total)}\n\n`;
  texto += `_Olá! Gostaria de confirmar estes itens._`;

  window.open(`https://wa.me/555197365965?text=${encodeURIComponent(texto)}`, "_blank");
}

/* --- INICIALIZAÇÃO AO CARREGAR --- */

window.addEventListener('DOMContentLoaded', () => {
  verificarCliente();
  renderizarVitrine("vitrine-masculino", "Masculino");
  renderizarVitrine("vitrine-feminino", "Feminino");
  renderizarVitrine("vitrine-lingerie", "Lingerie");
  renderizarVitrine("vitrine-loja", "Todos");
  
  // Se estiver na página de produto, carregar detalhes
  if (document.getElementById("nome-produto")) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("produto");
    const p = PRODUTOS.find(item => item.slug === slug);
    if (p) {
      document.getElementById("nome-produto").textContent = p.nome;
      document.getElementById("preco-produto").textContent = formatarPreco(p.preco);
      document.getElementById("cor-produto").textContent = `Cor: ${p.cor}`;
      document.getElementById("imagem-principal").src = `${p.slug}-view1.jpeg`;
      document.getElementById("select-tamanho").innerHTML = p.tamanhos.map(t => `<option value="${t}">${t}</option>`).join('');
    }
  }

  // Se estiver na página de carrinho
  if (document.getElementById("itens-carrinho")) exibirCarrinho();
});