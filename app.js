const ADMIN_PASSWORD = "01838524566";
const initialProducts = [
 {id:1,name:"Uro Gas Premium Glass Body Stove",category:"Gas Stove",price:3500,oldPrice:4200,warranty:"১ বছর ওয়ারেন্টি",description:"প্রিমিয়াম গ্লাস বডি গ্যাস চুলা। রান্নাঘরের জন্য আধুনিক ডিজাইন।",image:"",icon:"🔥"},
 {id:2,name:"Urogas Digital Gas Stove",category:"Gas Stove",price:3350,oldPrice:3800,warranty:"১ বছর ওয়ারেন্টি",description:"ডিজিটাল কন্ট্রোলসহ আধুনিক গ্যাস চুলা।",image:"",icon:"♨️"},
 {id:3,name:"IGT Gas Safety Device",category:"Gas Safety",price:1650,oldPrice:1950,warranty:"৫ বছর ওয়ারেন্টি",description:"গ্যাস ব্যবহারে বাড়তি নিরাপত্তার জন্য IGT Gas Safety Device কম্বো অফার।",image:"",icon:"🛡️"},
 {id:4,name:"Premium Gas Pipe 5 Feet",category:"Gas Accessories",price:350,oldPrice:450,description:"গ্যাস চুলার জন্য প্রিমিয়াম পাইপ।",image:"",icon:"〰️"},
 {id:5,name:"Gas Saving Net — 2 Pieces",category:"Kitchen Accessories",price:180,oldPrice:250,description:"রান্নার কাজে ব্যবহারযোগ্য গ্যাস সেভিং নেটের সেট।",image:"",icon:"♨️"},
 {id:6,name:"Gas Saving Cover — 2 Pieces",category:"Kitchen Accessories",price:150,oldPrice:220,description:"চুলার জন্য গ্যাস সেভিং কভার সেট।",image:"",icon:"🍳"},
 {id:7,name:"Taiwan Metal Gas Clamps — 2 Pieces",category:"Gas Accessories",price:120,oldPrice:180,description:"গ্যাস পাইপ সংযোগের জন্য মেটাল ক্ল্যাম্পের সেট।",image:"",icon:"🔩"},
 {id:8,name:"Non-stick Frying Pan",category:"Cookware",price:850,oldPrice:1050,description:"প্রতিদিনের রান্নার জন্য নন-স্টিক ফ্রাইং প্যান।",image:"",icon:"🍳"}
];
let products = read("ns_products", initialProducts), cart = read("ns_cart", []), orders = read("ns_orders", []), wishlist = read("ns_wishlist", []);
let categoryFilter = "All", adminTab = "products";
function read(k, fallback){try{let x=localStorage.getItem(k);return x?JSON.parse(x):fallback}catch(e){return fallback}}
function save(){localStorage.setItem("ns_products",JSON.stringify(products));localStorage.setItem("ns_cart",JSON.stringify(cart));localStorage.setItem("ns_orders",JSON.stringify(orders));localStorage.setItem("ns_wishlist",JSON.stringify(wishlist))}
function money(n){return "৳"+Number(n||0).toLocaleString("en-BD")}
function safe(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function imageMarkup(p,cls=""){if(p.image)return `<img class="${cls}" src="${safe(p.image)}" alt="${safe(p.name)}" onerror="this.style.display='none'">`;return `<span class="placeholder">${safe(p.icon||"✦")}</span>`}
function renderProducts(){
 const q=(document.getElementById("searchInput")?.value||"").toLowerCase();
 const filtered=products.filter(p=>(categoryFilter==="All"||p.category===categoryFilter)&&(`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q)));
 document.getElementById("productGrid").innerHTML=filtered.map(card).join("")||'<div class="notice">কোনো পণ্য পাওয়া যায়নি।</div>';
 document.getElementById("recommendedGrid").innerHTML=products.slice().reverse().slice(0,4).map(card).join("");
}
function card(p){let discount=p.oldPrice>p.price?Math.round((p.oldPrice-p.price)/p.oldPrice*100):0;return `<article class="product-card"><a class="product-open" href="product.html?id=${p.id}" aria-label="${safe(p.name)} বিস্তারিত দেখুন"><div class="product-image">${imageMarkup(p)}${discount?`<span class="discount">-${discount}%</span>`:""}</div></a><h3><a class="product-title-link" href="product.html?id=${p.id}">${safe(p.name)}</a></h3><div class="meta">${safe(p.category)} ${p.warranty?"· "+safe(p.warranty):""}</div><div class="price">${money(p.price)} ${p.oldPrice>p.price?`<span class="old">${money(p.oldPrice)}</span>`:""}</div><div class="card-actions"><button class="add" onclick="toggleWish(${p.id})">${wishlist.includes(p.id)?"♥":"♡"}</button><button class="add" onclick="addCart(${p.id})">কার্টে যোগ</button><a class="buy detail-buy" href="product.html?id=${p.id}">বিস্তারিত / কিনুন</a></div></article>`}
function filterCategory(c){categoryFilter=c;renderProducts();document.getElementById("products").scrollIntoView({behavior:"smooth"})}
function scrollToProducts(){document.getElementById("products").scrollIntoView({behavior:"smooth"})}
function toggleWish(id){wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];save();renderProducts()}
function showWishlist(){let list=products.filter(p=>wishlist.includes(p.id));showModal(`<h2>♡ Wishlist</h2>${list.length?list.map(p=>`<div class="admin-product"><span>${safe(p.name)} — ${money(p.price)}</span><button onclick="addCart(${p.id})">Add</button></div>`).join(""):'<p>Your wishlist is empty.</p>'}<div class="btnrow"><button class="primary" onclick="closeModal()">Close</button></div>`)}
function addCart(id){let item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});save();renderCart();openCart()}
function buyNow(id){addCart(id);openCheckout()}
function changeQty(id,d){let x=cart.find(a=>a.id===id);if(x)x.qty+=d;cart=cart.filter(a=>a.qty>0);save();renderCart()}
function renderCart(){
 let count=cart.reduce((s,x)=>s+x.qty,0),sum=cart.reduce((s,x)=>s+(products.find(p=>p.id===x.id)?.price||0)*x.qty,0);
 document.getElementById("cartCount").textContent=count;document.getElementById("cartCount2").textContent=count;document.getElementById("subtotal").textContent=money(sum);document.getElementById("total").textContent=money(sum);
 document.getElementById("cartItems").innerHTML=cart.length?cart.map(x=>{let p=products.find(a=>a.id===x.id);if(!p)return "";return `<div class="cart-item"><div class="cart-thumb">${p.image?`<img src="${safe(p.image)}">`:safe(p.icon||"✦")}</div><div><h4>${safe(p.name)}</h4><strong>${money(p.price)}</strong><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${p.id},1)">+</button><button onclick="changeQty(${p.id},-${x.qty})" title="Remove">×</button></div></div></div>`}).join(""):'<div class="empty">Your cart is empty.<br>পছন্দের পণ্য কার্টে যোগ করুন।</div>';
}
function openCart(){document.getElementById("cartPanel").classList.add("open")}
function closeCart(){document.getElementById("cartPanel").classList.remove("open")}
function showModal(html){document.getElementById("modal").innerHTML=html;document.getElementById("modalBackdrop").classList.add("show")}
function closeModal(){document.getElementById("modalBackdrop").classList.remove("show")}
function backdropClose(e){if(e.target.id==="modalBackdrop")closeModal()}
function openCheckout(){
 if(!cart.length){openCart();return}
 const total=cart.reduce((s,x)=>s+(products.find(p=>p.id===x.id)?.price||0)*x.qty,0);
 showModal(`<h2>অর্ডার সম্পন্ন করুন</h2><p>নিচের তথ্যগুলো পূরণ করে অর্ডার নিশ্চিত করুন।</p><div class="notice">অর্ডার মোট: <b>${money(total)}</b> · পেমেন্ট: পণ্য হাতে পেয়ে মূল্য পরিশোধ</div><form id="checkoutForm" onsubmit="submitOrder(event)"><label>আপনার নাম *</label><input name="name" required placeholder="নাম লিখুন"><label>মোবাইল নম্বর *</label><input name="phone" required type="tel" inputmode="tel" autocomplete="tel" placeholder="01XXXXXXXXX"><label>সম্পূর্ণ ডেলিভারি ঠিকানা *</label><textarea name="address" required autocomplete="street-address" placeholder="বাসা/রোড, এলাকা, থানা ও জেলা"></textarea><label>অতিরিক্ত তথ্য (ঐচ্ছিক)</label><textarea name="note" placeholder="পছন্দের রং বা অন্য নির্দেশনা"></textarea><div class="btnrow"><button class="primary" type="submit">অর্ডার কনফার্ম করুন</button><button type="button" class="secondary" onclick="closeModal()">বাতিল</button></div></form>`)
}
function submitOrder(e){e.preventDefault();let f=new FormData(e.target),items=cart.map(x=>({name:products.find(p=>p.id===x.id)?.name||"Product",price:products.find(p=>p.id===x.id)?.price||0,qty:x.qty}));let total=items.reduce((s,x)=>s+x.price*x.qty,0);let order={id:"NS"+Date.now().toString().slice(-8),date:new Date().toLocaleString(),name:f.get("name"),phone:f.get("phone"),address:f.get("address"),note:f.get("note"),items,total,status:"Pending"};orders.unshift(order);cart=[];save();renderCart();closeCart();showModal(`<div style="text-align:center;padding:12px"><div style="font-size:48px;color:#7554d5">✓</div><h2>অর্ডার সফলভাবে জমা হয়েছে!</h2><p>আপনার অর্ডার নম্বর: <b>${order.id}</b></p><p>অর্ডারটি গ্রহণ করা হয়েছে। দোকানের পক্ষ থেকে যোগাযোগ করা হবে।</p><div class="notice">মোট: <b>${money(total)}</b> · Cash on Delivery</div><button class="primary" onclick="closeModal()">ঠিক আছে</button></div>`)}

function showMyOrders(prefillId=""){
 const previous=orders.length?`<p>অর্ডারের আপডেট দেখতে অর্ডার নম্বর ও অর্ডারের সময় দেওয়া মোবাইল নম্বর লিখুন।</p>`:`<p>এখনও এই ব্রাউজারে কোনো অর্ডার নেই। পণ্য অর্ডার করার পর অর্ডার নম্বর দিয়ে এখানে আপডেট দেখতে পারবেন।</p>`;
 showModal(`<div class="tracking-wrap"><h2>📦 আমার অর্ডার / Order Tracking</h2>${previous}
 <form onsubmit="trackCustomerOrder(event)">
 <label>অর্ডার নম্বর</label><input name="orderId" required value="${safe(prefillId)}" placeholder="যেমন NS12345678">
 <label>অর্ডারের সময় দেওয়া মোবাইল নম্বর</label><input name="phone" required type="tel" placeholder="01XXXXXXXXX">
 <div class="btnrow"><button class="primary" type="submit">অর্ডার আপডেট দেখুন</button><button class="secondary" type="button" onclick="closeModal()">বন্ধ করুন</button></div>
 </form><div id="trackingResult"></div></div>`);
}
function trackCustomerOrder(e){
 e.preventDefault();const f=new FormData(e.target),id=String(f.get("orderId")||"").trim(),phone=String(f.get("phone")||"").replace(/\s/g,"");
 const o=orders.find(x=>String(x.id).toLowerCase()===id.toLowerCase()&&String(x.phone||"").replace(/\s/g,"")===phone);
 const result=document.getElementById("trackingResult");if(!result)return;
 if(!o){result.innerHTML='<div class="notice">অর্ডার পাওয়া যায়নি। অর্ডার নম্বর ও মোবাইল নম্বর মিলিয়ে আবার চেষ্টা করুন।</div>';return}
 const steps=["Pending","Confirmed","Processing","Shipped","Delivered"];
 const labels={Pending:"অর্ডার গ্রহণ করা হয়েছে",Confirmed:"অর্ডার কনফার্ম হয়েছে",Processing:"পণ্য প্রস্তুত করা হচ্ছে",Shipped:"ডেলিভারির জন্য পাঠানো হয়েছে",Delivered:"ডেলিভারি সম্পন্ন",Cancelled:"অর্ডার বাতিল"};
 const idx=steps.indexOf(o.status);
 result.innerHTML=`<div class="tracking-result"><h3>অর্ডার ${safe(o.id)}</h3><p><b>বর্তমান আপডেট:</b> ${safe(labels[o.status]||o.status)}</p><p><b>অর্ডারের তারিখ:</b> ${safe(o.date||"")}</p><p><b>মোট:</b> ${money(o.total)} · <b>পেমেন্ট:</b> Cash on Delivery</p><div class="tracking-steps">${steps.map((s,i)=>`<div class="tracking-step ${o.status==="Cancelled"?"":(idx>=i?"done":"")}"><span>${idx>=i&&o.status!=="Cancelled"?"✓":i+1}</span><small>${labels[s]}</small></div>`).join("")}</div>${o.status==="Cancelled"?'<div class="notice">এই অর্ডারটি বাতিল করা হয়েছে।</div>':""}<h4>পণ্যের তালিকা</h4><ul>${(o.items||[]).map(i=>`<li>${safe(i.name)} × ${i.qty} — ${money(i.price*i.qty)}</li>`).join("")}</ul><button class="secondary" onclick="showMyOrders('${safe(o.id)}')">অন্য অর্ডার দেখুন</button></div>`;
}
function adminLogin(e){
 e.preventDefault();
 if(new FormData(e.target).get("password")!==ADMIN_PASSWORD){alert("Password সঠিক নয়");return}
 renderAdmin("dashboard")
}
function renderAdmin(tab){
 adminTab=tab;
 const pending=orders.filter(o=>o.status==="Pending").length;
 const processing=orders.filter(o=>["Confirmed","Processing","Shipped"].includes(o.status)).length;
 const delivered=orders.filter(o=>o.status==="Delivered").length;
 const revenue=orders.filter(o=>o.status!=="Cancelled").reduce((s,o)=>s+Number(o.total||0),0);
 const tabs=`<div class="admin-tabs">
 <button class="${tab==="dashboard"?"active":""}" onclick="renderAdmin('dashboard')">🏠 Dashboard</button>
 <button class="${tab==="orders"?"active":""}" onclick="renderAdmin('orders')">📦 Orders (${orders.length})</button>
 <button class="${tab==="products"?"active":""}" onclick="renderAdmin('products')">🛍 Products (${products.length})</button>
 <button class="${tab==="settings"?"active":""}" onclick="renderAdmin('settings')">⚙️ Website Edit</button>
 <button class="${tab==="backup"?"active":""}" onclick="renderAdmin('backup')">💾 Backup</button></div>`;
 let body=tabs;
 if(tab==="dashboard"){
  body+=`<div class="admin-stats">
  <div class="admin-stat"><small>মোট অর্ডার</small><strong>${orders.length}</strong></div>
  <div class="admin-stat"><small>নতুন অর্ডার</small><strong>${pending}</strong></div>
  <div class="admin-stat"><small>প্রসেসিং</small><strong>${processing}</strong></div>
  <div class="admin-stat"><small>ডেলিভারি সম্পন্ন</small><strong>${delivered}</strong></div>
  <div class="admin-stat wide"><small>মোট অর্ডারের মূল্য (Cancelled বাদে)</small><strong>${money(revenue)}</strong></div></div>
  <div class="admin-dashboard-actions"><button class="primary" onclick="renderAdmin('orders')">সব অর্ডার দেখুন</button><button class="secondary" onclick="renderAdmin('products')">পণ্য যোগ / এডিট করুন</button><button class="secondary" onclick="renderAdmin('settings')">ওয়েবসাইট এডিট করুন</button></div>
  <h3>সাম্প্রতিক অর্ডার</h3>${orders.length?orders.slice(0,5).map(o=>orderCard(o,true)).join(""):'<p class="notice">এখনও কোনো অর্ডার আসেনি।</p>'}`;
 }
 if(tab==="orders"){
  body+=`<div class="admin-toolbar"><input id="orderSearch" placeholder="অর্ডার নম্বর, নাম বা ফোন দিয়ে খুঁজুন" oninput="filterAdminOrders()"><button class="secondary" onclick="exportOrders()">অর্ডার CSV ডাউনলোড</button></div>
  <div id="adminOrderList">${orders.length?orders.map(o=>orderCard(o,false)).join(""):'<p class="notice">এখনও কোনো অর্ডার নেই।</p>'}</div>`;
 }
 if(tab==="products"){
  body+=`<div class="admin-toolbar"><button class="primary" onclick="productForm()">＋ নতুন পণ্য যোগ করুন</button><input id="productSearchAdmin" placeholder="পণ্যের নাম দিয়ে খুঁজুন" oninput="filterAdminProducts()"></div>
  <div id="adminProductList">${products.length?products.map(adminProductCard).join(""):'<p>কোনো পণ্য নেই। নতুন পণ্য যোগ করুন।</p>'}</div>`;
 }
 if(tab==="settings"){
  const val=(key,def)=>safe(localStorage.getItem("ns_"+key)||def);
  body+=`<h3>ওয়েবসাইটের লেখা ও দোকানের তথ্য</h3>
  <form onsubmit="saveAllSettings(event)" class="admin-settings-form">
  <label>দোকানের নাম</label><input name="storeName" value="${val("storeName","SmartCookBD")}" required>
  <label>হোমপেজের বড় শিরোনাম</label><input name="heroTitle" value="${val("heroTitle","Cook Smart, Live Safe ✦")}" required>
  <label>হোমপেজের বর্ণনা</label><textarea name="heroText">${val("heroText","আপনার পছন্দের পণ্য, এখন এক জায়গায়।")}</textarea>
  <label>ফোন নম্বর</label><input name="phone" value="${val("phone","")}" placeholder="01XXXXXXXXX">
  <label>Facebook Page লিংক</label><input name="facebook" value="${val("facebook","")}" placeholder="https://facebook.com/...">
  <label>ডেলিভারি চার্জ (৳)</label><input name="deliveryCharge" type="number" min="0" value="${val("deliveryCharge","0")}">
  <label>প্রোমো / অফার ব্যানারের লেখা</label><input name="promoText" value="${val("promoText","")}" placeholder="যেমন: সারা বাংলাদেশে ডেলিভারি">
  <label>Footer-এর লেখা</label><textarea name="footerText">${val("footerText","SmartCookBD — Kitchen & Cooking Products")}</textarea>
  <div class="btnrow"><button class="primary" type="submit">সব সেটিংস সেভ করুন</button></div></form>
  <p class="notice">এখান থেকে সেভ করা তথ্য এই ব্রাউজারের ওয়েবসাইটে থাকবে। HTML-এ আলাদা করে লেখা অন্য অংশগুলো এই সেটিংস দিয়ে বদলাবে না।</p>`;
 }
 if(tab==="backup"){
  body+=`<h3>স্টোর ডেটা ব্যাকআপ</h3><p>পণ্য, অর্ডার ও সেটিংসের ব্যাকআপ ডাউনলোড করে নিরাপদে রাখো। নতুন ব্রাউজারে নিতে JSON ব্যাকআপ ইমপোর্ট করো।</p>
  <div class="admin-dashboard-actions"><button class="primary" onclick="exportData()">💾 সম্পূর্ণ ব্যাকআপ ডাউনলোড</button><button class="secondary" onclick="exportOrders()">📄 অর্ডার CSV ডাউনলোড</button></div>
  <h3>ব্যাকআপ ইমপোর্ট</h3><input type="file" accept=".json,application/json" id="importFile"><button class="primary" onclick="importData()">ব্যাকআপ ইমপোর্ট করুন</button>
  <h3>ডেটা ম্যানেজমেন্ট</h3><p>সতর্কতা: নিচের কাজটি এই ব্রাউজারে থাকা সব অর্ডার মুছে দেবে।</p><button class="danger" onclick="clearOrders()">সব অর্ডার মুছে ফেলুন</button>`;
 }
 showModal(`<div class="admin-shell"><div class="admin-head"><div><h2>SmartCookBD Admin</h2><p>দোকান, পণ্য ও অর্ডার পরিচালনা</p></div><span class="admin-lock">🔐 Admin</span></div>${body}<div class="btnrow"><button class="secondary" onclick="closeModal()">ড্যাশবোর্ড বন্ধ করুন</button></div></div>`);
}
function adminProductCard(p){return `<div class="admin-product admin-product-full"><div class="admin-product-thumb">${p.image?`<img src="${safe(p.image)}" alt="">`:safe(p.icon||"🍳")}</div><div class="admin-product-info"><b>${safe(p.name)}</b><small>${safe(p.category)} · ${safe(p.warranty||"ওয়ারেন্টি উল্লেখ নেই")}</small><strong>${money(p.price)} ${p.oldPrice>p.price?`<del>${money(p.oldPrice)}</del>`:""}</strong></div><div class="admin-product-buttons"><button onclick="productForm(${p.id})">এডিট</button><button class="danger" onclick="deleteProduct(${p.id})">ডিলিট</button></div></div>`}
function orderCard(o,compact){return `<div class="order-line admin-order-card"><div class="order-card-head"><strong>${safe(o.id)} · ${money(o.total)}</strong><span class="status-pill status-${safe(o.status).toLowerCase()}">${safe(o.status)}</span></div><div class="order-customer"><b>${safe(o.name)}</b> · ${safe(o.phone)}</div><div>📍 ${safe(o.address)}</div><div class="order-items">${(o.items||[]).map(i=>safe(i.name)+" × "+i.qty+" ("+money(i.price*i.qty)+")").join(", ")}</div><small>${safe(o.date||"")}${o.note?" · নোট: "+safe(o.note):""}</small>${compact?"":`<div class="order-admin-controls"><label>অর্ডার স্ট্যাটাস</label><select onchange="updateOrder('${safe(o.id)}',this.value)">${["Pending","Confirmed","Processing","Shipped","Delivered","Cancelled"].map(s=>`<option value="${s}" ${o.status===s?"selected":""}>${s}</option>`).join("")}</select><button class="secondary" onclick="printOrder('${safe(o.id)}')">প্রিন্ট</button><button class="danger" onclick="deleteOrder('${safe(o.id)}')">ডিলিট</button></div>`}</div>`}
function filterAdminOrders(){const q=(document.getElementById("orderSearch")?.value||"").toLowerCase();const el=document.getElementById("adminOrderList");if(el)el.innerHTML=orders.filter(o=>[o.id,o.name,o.phone,o.address].join(" ").toLowerCase().includes(q)).map(o=>orderCard(o,false)).join("")||'<p>কোনো অর্ডার মেলেনি।</p>'}
function filterAdminProducts(){const q=(document.getElementById("productSearchAdmin")?.value||"").toLowerCase();const el=document.getElementById("adminProductList");if(el)el.innerHTML=products.filter(p=>[p.name,p.category].join(" ").toLowerCase().includes(q)).map(adminProductCard).join("")||'<p>কোনো পণ্য মেলেনি।</p>'}
function saveAllSettings(e){e.preventDefault();const f=new FormData(e.target);for(const k of ["storeName","heroTitle","heroText","phone","facebook","deliveryCharge","promoText","footerText"])localStorage.setItem("ns_"+k,f.get(k)||"");applySettings();renderAdmin("settings");alert("সেটিংস সেভ হয়েছে।")}
function exportOrders(){const rows=[["Order ID","Date","Name","Phone","Address","Items","Total","Status","Note"],...orders.map(o=>[o.id,o.date,o.name,o.phone,o.address,(o.items||[]).map(i=>`${i.name} x${i.qty}`).join("; "),o.total,o.status,o.note||""])];const csv=rows.map(r=>r.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\r\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}));a.download="SmartCookBD-orders.csv";a.click();URL.revokeObjectURL(a.href)}
function printOrder(id){const o=orders.find(x=>x.id===id);if(!o)return;const w=window.open("","_blank");if(!w){alert("প্রিন্টের জন্য browser popup allow করুন");return}w.document.write(`<html><head><title>Order ${safe(o.id)}</title><style>body{font:16px Arial;padding:28px}h1{color:#216b4b}table{width:100%;border-collapse:collapse}td,th{padding:8px;border:1px solid #ddd;text-align:left}</style></head><body><h1>SmartCookBD</h1><h2>Order ${safe(o.id)}</h2><p>${safe(o.date)}</p><p>Customer: ${safe(o.name)}<br>Phone: ${safe(o.phone)}<br>Address: ${safe(o.address)}</p><table><tr><th>Product</th><th>Qty</th><th>Price</th></tr>${(o.items||[]).map(i=>`<tr><td>${safe(i.name)}</td><td>${i.qty}</td><td>${money(i.price*i.qty)}</td></tr>`).join("")}</table><h3>Total: ${money(o.total)}</h3><p>Status: ${safe(o.status)}</p><script>window.onload=()=>window.print()</script></body></html>`);w.document.close()}
function clearOrders(){if(confirm("নিশ্চিত? এই ব্রাউজারের সব অর্ডার মুছে যাবে।")){orders=[];save();renderAdmin("dashboard")}}
function productForm(id){
 let p=id?products.find(x=>x.id===id):{name:"",category:"Cookware",price:"",oldPrice:"",warranty:"",description:"",image:"",icon:"✦"};
 showModal(`<h2>${id?"Edit Product":"Add New Product"}</h2><form onsubmit="saveProduct(event,${id||"null"})"><label>Product name *</label><input name="name" required value="${safe(p.name)}"><div class="row2"><div><label>Price *</label><input name="price" type="number" min="0" required value="${safe(p.price)}"></div><div><label>Old price</label><input name="oldPrice" type="number" min="0" value="${safe(p.oldPrice)}"></div></div><div class="row2"><div><label>Category</label><select name="category">${["Gas Stove","Gas Safety","Gas Accessories","Kitchen Accessories","Cookware","Electric Stove","Other"].map(s=>`<option ${p.category===s?"selected":""}>${s}</option>`).join("")}</select></div><div><label>Warranty</label><input name="warranty" value="${safe(p.warranty)}" placeholder="e.g. 1 year"></div></div><label>Description</label><textarea name="description">${safe(p.description)}</textarea><label>Image URL (or choose image below)</label><input name="image" value="${safe(p.image)}" placeholder="https://..."><label>Upload product image/video</label><input type="file" id="productMedia" accept="image/*,video/*"><p>Upload files are stored in this browser for this demo. For a permanent public shop, use cloud storage.</p><div class="btnrow"><button class="primary" type="submit">Save Product</button><button class="secondary" type="button" onclick="renderAdmin('products')">Cancel</button></div></form>`);
}
function saveProduct(e,id){e.preventDefault();let f=new FormData(e.target),old=id?products.find(p=>p.id===id):null;let file=document.getElementById("productMedia").files[0];const finish=(media)=>{let p={id:id||Date.now(),name:f.get("name"),price:Number(f.get("price")),oldPrice:Number(f.get("oldPrice")||0),category:f.get("category"),warranty:f.get("warranty"),description:f.get("description"),image:media||f.get("image")||"",icon:old?.icon||"✦"};if(id)products=products.map(x=>x.id===id?p:x);else products.unshift(p);save();renderProducts();renderAdmin("products")};if(file){if(file.size>2*1024*1024){alert("Demo-তে 2MB-এর ছোট image/video ব্যবহার করুন। বড় media URL দিয়ে দিন।");return}let r=new FileReader();r.onload=()=>finish(r.result);r.readAsDataURL(file)}else finish(null)}
function deleteProduct(id){if(confirm("এই product delete করবেন?")){products=products.filter(p=>p.id!==id);cart=cart.filter(x=>x.id!==id);save();renderProducts();renderCart();renderAdmin("products")}}
function updateOrder(id,status){orders=orders.map(o=>o.id===id?{...o,status}:o);save()}
function deleteOrder(id){if(confirm("এই order delete করবেন?")){orders=orders.filter(o=>o.id!==id);save();renderAdmin("orders")}}
function saveSettings(e){e.preventDefault();let f=new FormData(e.target);localStorage.setItem("ns_storeName",f.get("storeName"));localStorage.setItem("ns_heroTitle",f.get("heroTitle"));localStorage.setItem("ns_heroText",f.get("heroText"));applySettings();renderAdmin("settings")}
function applySettings(){document.getElementById("storeName").textContent=localStorage.getItem("ns_storeName")||"SmartCookBD";document.getElementById("heroTitle").textContent=localStorage.getItem("ns_heroTitle")||"Cook Smart, Live Safe ✦";document.getElementById("heroText").textContent=localStorage.getItem("ns_heroText")||"আপনার পছন্দের পণ্য, এখন এক জায়গায়।"}
function exportData(){let data={products,orders,settings:Object.fromEntries(["storeName","heroTitle","heroText","phone","facebook","deliveryCharge","promoText","footerText"].map(k=>[k,localStorage.getItem("ns_"+k)]))};let a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));a.download="novashop-backup.json";a.click();URL.revokeObjectURL(a.href)}
function importData(){let file=document.getElementById("importFile").files[0];if(!file){alert("আগে JSON backup file নির্বাচন করুন");return}let r=new FileReader();r.onload=()=>{try{let d=JSON.parse(r.result);if(d.products)products=d.products;if(d.orders)orders=d.orders;if(d.settings){for(let k of ["storeName","heroTitle","heroText","phone","facebook","deliveryCharge","promoText","footerText"])if(d.settings[k]!==undefined&&d.settings[k]!==null)localStorage.setItem("ns_"+k,d.settings[k])}save();applySettings();renderProducts();renderCart();const startupParams=new URLSearchParams(location.search);
if(startupParams.get("buyNow")==="1"){openCheckout();}
else if(startupParams.get("openCart")==="1"){openCart();}renderAdmin("products")}catch(e){alert("JSON file ঠিক নেই")}};r.readAsText(file)}
function openAdmin(){showModal(`<h2>Admin Login</h2><p>Store management panel-এ ঢুকতে password দিন।</p><form onsubmit="adminLogin(event)"><label>Admin Password</label><input name="password" type="password" required placeholder="Password"><div class="btnrow"><button class="primary" type="submit">Login</button><button class="secondary" type="button" onclick="closeModal()">Cancel</button></div></form><p style="font-size:10px">নোট: এটি demo static site। Public store-এর জন্য server-side password security দরকার।</p>`)}
applySettings();renderProducts();renderCart();const startupParams=new URLSearchParams(location.search);
if(startupParams.get("buyNow")==="1"){openCheckout();}
else if(startupParams.get("openCart")==="1"){openCart();}
