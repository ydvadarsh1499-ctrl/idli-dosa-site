/* ====== 1. EDIT THESE TWO LINES ====== */
const ORDER_EMAIL = "adarshyadav040109@example.com";  // orders are emailed here
const WHATSAPP_NUMBER = "8539882999";                    // optional, e.g. "919999999999". Leave empty to hide the WhatsApp button.
const CURRENCY = "₹";

/* ====== 2. EDIT YOUR MENU (img = file in the images folder) ====== */
const MENU = [
  {id:1, cat:"Idli",   name:"Plain Idli (2 pcs)",  desc:"Soft steamed rice cakes with sambar and chutneys.", price:40,  img:"images/idli.svg"},
  {id:2, cat:"Idli",   name:"Ghee Podi Idli",      desc:"Idlis tossed in gunpowder spice and ghee.",         price:70,  img:"images/ghee-podi-idli.svg"},
  {id:3, cat:"Dosa",   name:"Plain Dosa",          desc:"Thin, crisp dosa with sambar and chutneys.",        price:60,  img:"images/plain-dosa.svg"},
  {id:4, cat:"Dosa",   name:"Masala Dosa",         desc:"Crisp dosa filled with spiced potato.",             price:90,  img:"images/masala-dosa.svg"},
  {id:5, cat:"Dosa",   name:"Mysore Masala Dosa",  desc:"Red chutney spread inside, potato masala filling.", price:110, img:"images/mysore-masala-dosa.svg"},
  {id:6, cat:"Snacks", name:"Medu Vada (2 pcs)",   desc:"Crunchy outside, fluffy inside.",                   price:50,  img:"images/medu-vada.svg"},
  {id:7, cat:"Drinks", name:"Filter Coffee",       desc:"Strong South Indian decoction with hot milk.",      price:30,  img:"images/filter-coffee.svg"},
  {id:8, cat:"Drinks", name:"Masala Chai",         desc:"Ginger and cardamom tea.",                          price:25,  img:"images/masala-chai.svg"}
];

/* ====== 3. CODE (no need to change) ====== */
const cart = {};
let activeCat = "All";
const $ = id => document.getElementById(id);
const money = n => CURRENCY + n.toLocaleString("en-IN");

function renderTabs(){
  $("tabs").innerHTML = "";
  ["All", ...new Set(MENU.map(m => m.cat))].forEach(c => {
    const b = document.createElement("button");
    b.className = "tab"; b.textContent = c;
    b.setAttribute("aria-pressed", c === activeCat);
    b.onclick = () => { activeCat = c; renderTabs(); renderGrid(); };
    $("tabs").appendChild(b);
  });
}
function renderGrid(){
  $("grid").innerHTML = "";
  MENU.filter(m => activeCat === "All" || m.cat === activeCat).forEach(m => {
    const el = document.createElement("article");
    el.className = "item";
    el.innerHTML = `<img src="${m.img}" alt="${m.name}" loading="lazy"><div class="body"><h3>${m.name}</h3><p>${m.desc}</p>
      <div class="row"><span class="price">${money(m.price)}</span><button class="add" aria-label="Add ${m.name} to order">Add</button></div></div>`;
    el.querySelector(".add").onclick = () => change(m.id, 1);
    $("grid").appendChild(el);
  });
}
function change(id, d){
  cart[id] = (cart[id] || 0) + d;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}
function summary(){
  let total = 0;
  const lines = Object.keys(cart).map(id => {
    const m = MENU.find(x => x.id == id), q = cart[id];
    total += m.price * q;
    return `${q} x ${m.name} = ${money(m.price * q)}`;
  });
  return {lines, total};
}
function renderCart(){
  const ids = Object.keys(cart);
  $("cart").innerHTML = ids.length ? "" : '<p class="empty">Nothing added yet. Tap Add on any item.</p>';
  ids.forEach(id => {
    const m = MENU.find(x => x.id == id), q = cart[id];
    const row = document.createElement("div");
    row.className = "line";
    row.innerHTML = `<span>${m.name}</span><span class="qty"><button aria-label="Remove one ${m.name}">−</button><span>${q}</span><button aria-label="Add one ${m.name}">+</button></span><span>${money(m.price * q)}</span>`;
    const [minus, plus] = row.querySelectorAll("button");
    minus.onclick = () => change(m.id, -1);
    plus.onclick = () => change(m.id, 1);
    $("cart").appendChild(row);
  });
  $("total").textContent = money(summary().total);
  $("send").disabled = !ids.length;
}
function details(){
  const d = {name:$("name").value.trim(), phone:$("phone").value.trim(), addr:$("addr").value.trim(), note:$("note").value.trim()};
  if (!d.name || !d.phone || !d.addr){ show("Please fill in your name, phone number and address.", "err"); return null; }
  return d;
}
function show(t, cls){ $("msg").textContent = t; $("msg").className = "msg " + (cls || ""); }

$("send").onclick = async () => {
  const d = details(); if (!d) return;
  const {lines, total} = summary();
  $("send").disabled = true; show("Sending your order...");
  try {
    const res = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(ORDER_EMAIL), {
      method: "POST",
      headers: {"Content-Type":"application/json", "Accept":"application/json"},
      body: JSON.stringify({_subject:"New order from Idli Dosa.com", _template:"table",
        Name:d.name, Phone:d.phone, Address:d.addr, Note:d.note || "-", Order:lines.join(" | "), Total:money(total)})
    });
    const out = await res.json();
    if (!res.ok || out.success === "false") throw new Error();
    Object.keys(cart).forEach(k => delete cart[k]); renderCart();
    show("Thank you! Your order has been sent. We will call you to confirm.", "ok");
  } catch (e) {
    show("Could not send the order. Please try again or use WhatsApp.", "err");
    $("send").disabled = false;
  }
};
if (WHATSAPP_NUMBER){
  $("wa").hidden = false;
  $("wa").onclick = () => {
    const d = details(); if (!d || !Object.keys(cart).length) return;
    const {lines, total} = summary();
    const text = `New order from Idli Dosa.com\n\n${lines.join("\n")}\n\nTotal: ${money(total)}\n\nName: ${d.name}\nPhone: ${d.phone}\nAddress: ${d.addr}\nNote: ${d.note || "-"}`;
    window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text), "_blank");
  };
}
renderTabs(); renderGrid(); renderCart();
