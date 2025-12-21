/* Praia & Movimento — site.js (Versão PRO) */
const PM = (() => {
  const STORE_KEY = "pm_cart_v1";
  const WHATSAPP_NUMBER = "55XXXXXXXXXXX"; // COLOQUE SEU NUMERO AQUI
  const FIREBASE_RTD_URL = "https://praia-e-movimento-d51e4-default-rtdb.firebaseio.com";

  const products = [
    { id:"f001", seg:"feminino", name:"Biquíni Tropical Pêssego", price:149.90, img:"https://images.unsplash.com/photo-1520975958225-62b87aee7f20?auto=format&fit=crop&w=1200&q=80", desc:"Peça premium com toque macio e design elegante." },
    { id:"m001", seg:"masculino", name:"Bermuda Classic Mar", price:129.90, img:"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80", desc:"Conforto e secagem rápida com corte alfaiataria." },
    // ... Adicione os outros produtos aqui mantendo este padrão
  ];

  const getCart = () => JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  
  const addToCart = (id) => {
    const cart = getCart();
    const product = products.find(p => p.id === id);
    cart.push({ ...product, cartId: Date.now() });
    localStorage.setItem(STORE_KEY, JSON.stringify(cart));
    updateBadge();
    alert("Adicionado com sucesso!");
  };

  const updateBadge = () => {
    const count = getCart().length;
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
  };

  const finalizePurchase = () => {
    const cart = getCart();
    if (cart.length === 0) return alert("Carrinho vazio");

    let message = "*Novo Pedido - Praia & Movimento*\n\n";
    let total = 0;
    cart.forEach(item => {
      message += `• ${item.name} - R$ ${item.price.toFixed(2)}\n`;
      total += item.price;
    });
    message += `\n*Total: R$ ${total.toFixed(2)}*`;
    message += `\n\n*Pagamento preferencial: PIX*`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  return { init: () => { updateBadge(); }, addToCart, finalizePurchase };
})();

document.addEventListener("DOMContentLoaded", PM.init);