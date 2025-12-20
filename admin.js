import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

const firebaseConfig = {
 apiKey: "AIzaSyBjKCTDBeSPGnZyXE4mOVe4_86xGGjwqVw",
 authDomain: "praia-e-movimento-d51e4.firebaseapp.com",
 databaseURL: "https://praia-e-movimento-d51e4-default-rtdb.firebaseio.com",
 projectId: "praia-e-movimento-d51e4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

window.login = function(){
 signInWithEmailAndPassword(auth,
  document.getElementById('email').value,
  document.getElementById('senha').value
 ).then(()=>location.href='admin-painel.html');
}

onValue(ref(db,'pedidos'), snap=>{
 const tb=document.getElementById('pedidos');
 if(!tb) return;
 tb.innerHTML='';
 snap.forEach(c=>{
  tb.innerHTML+=`<tr><td>${c.key}</td><td>${c.val().produto}</td><td>${c.val().valor}</td></tr>`;
 });
});