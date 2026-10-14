const fmtMoney=n=>"৳"+Number(n||0).toLocaleString("en-BD");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const seed = [
 {id:1,name:"Uro Gas Premium Glass Body Stove",category:"Gas Stove",price:3500,oldPrice:4200,warranty:"১ বছর ওয়ারেন্টি",description:"প্রিমিয়াম গ্লাস বডি গ্যাস চুলা। রান্নাঘরের জন্য আধুনিক ডিজাইন।",image:"",icon:"🔥"},
 {id:2,name:"Urogas Digital Gas Stove",category:"Gas Stove",price:3350,oldPrice:3800,warranty:"১ বছর ওয়ারেন্টি",description:"ডিজিটাল কন্ট্রোলসহ আধুনিক গ্যাস চুলা।",image:"",icon:"♨️"},
 {id:3,name:"IGT Gas Safety Device",category:"Gas Safety",price:1650,oldPrice:1950,warranty:"৫ বছর ওয়ারেন্টি",description:"গ্যাস ব্যবহারে বাড়তি নিরাপত্তার জন্য IGT Gas Safety Device কম্বো অফার।",image:"",icon:"🛡️"},
 {id:4,name:"Premium Gas Pipe 5 Feet",category:"Gas Accessories",price:350,oldPrice:450,description:"গ্যাস চুলার জন্য প্রিমিয়াম পাইপ।",image:"",icon:"〰️"},
 {id:5,name:"Gas Saving Net — 2 Pieces",category:"Kitchen Accessories",price:180,oldPrice:250,description:"রান্নার কাজে ব্যবহারযোগ্য গ্যাস সেভিং নেটের সেট।",image:"",icon:"♨️"},
 {id:6,name:"Gas Saving Cover — 2 Pieces",category:"Kitchen Accessories",price:150,oldPrice:220,description:"চুলার জন্য গ্যাস সেভিং কভার সেট।",image:"",icon:"🍳"},
 {id:7,name:"Taiwan Metal Gas Clamps — 2 Pieces",category:"Gas Accessories",price:120,oldPrice:180,description:"গ্যাস পাইপ সংযোগের জন্য মেটাল ক্ল্যাম্পের সেট।",image:"",icon:"🔩"},
 {id:8,name:"Non-stick Frying Pan",category:"Cookware",price:850,oldPrice:1050,description:"প্রতিদিনের রান্নার জন্য নন-স্টিক ফ্রাইং প্যান।",image:"",icon:"🍳"}
]
let products;try{products=JSON.parse(localStorage.getItem("ns_products"))||seed}catch(e){products=seed}
const id=new URLSearchParams(location.search).get("id");const p=products.find(x=>String(x.id)===String(id));const root=document.getElementById("productDetail");
function media(p){if(!p.image)return `<div class="detail-placeholder">${esc(p.icon||"✦")}</div>`;if(/^data:video\//i.test(p.image)||/\.(mp4|webm|ogg)(\?|$)/i.test(p.image))return `<video class="detail-media" src="${esc(p.image)}" controls playsinline></video>`;return `<img class="detail-media" src="${esc(p.image)}" alt="${esc(p.name)}" onerror="this.outerHTML='<div class=&quot;detail-placeholder&quot;>✦</div>'">`}
if(!p){root.innerHTML=`<section class="detail-not-found"><h1>পণ্যটি পাওয়া যায়নি</h1><p>হয়তো পণ্যটি মুছে ফেলা হয়েছে।</p><a class="primary detail-button" href="index.html">সব পণ্য দেখুন</a></section>`}
else{let discount=p.oldPrice>p.price?Math.round((p.oldPrice-p.price)/p.oldPrice*100):0;document.title=p.name+" — SmartCookBD";root.innerHTML=`<div class="detail-card"><div class="detail-media-box">${media(p)}</div><section class="detail-info"><span class="detail-category">${esc(p.category||"Product")}</span><h1>${esc(p.name)}</h1><div class="detail-prices"><strong>${fmtMoney(p.price)}</strong>${p.oldPrice>p.price?`<del>${fmtMoney(p.oldPrice)}</del><span class="detail-discount">${discount}% ছাড়</span>`:""}</div>${p.warranty?`<p class="detail-warranty">🛡️ ওয়ারেন্টি: <b>${esc(p.warranty)}</b></p>`:""}<p class="detail-description">${esc(p.description||"এই পণ্য সম্পর্কে বিস্তারিত জানতে আমাদের সাথে যোগাযোগ করুন।")}</p><div class="detail-buttons"><button class="primary" data-action="add-cart" data-product-id="${esc(String(p.id))}">🛒 কার্টে যোগ করুন</button><button class="buy" data-action="buy-now" data-product-id="${esc(String(p.id))}">এখনই অর্ডার করুন →</button></div><div class="detail-trust"><span>✓ নিরাপদ অর্ডার</span><span>✓ কাস্টমার সাপোর্ট</span><span>✓ Cash on Delivery* </span></div><small class="detail-note">*ডেলিভারি ও পেমেন্টের শর্ত দোকানের সেটিংস অনুযায়ী প্রযোজ্য।</small></section></div><section class="detail-more"><h2>পণ্যের বিবরণ</h2><p>${esc(p.description||"বিস্তারিত তথ্য শীঘ্রই যোগ করা হবে।")}</p><a href="index.html#products">← আরও পণ্য দেখুন</a></section>`}
function addToCart(pid,buy){
 const actual=products.find(x=>String(x.id)===String(pid)); if(!actual)return;
 const root=document.getElementById("productDetail");
 let checkout=document.getElementById("directCheckout");
 if(checkout){checkout.scrollIntoView({behavior:"smooth",block:"start"});return;}
 checkout=document.createElement("section");checkout.id="directCheckout";checkout.className="detail-more";
 checkout.innerHTML=`<h2>অর্ডার কনফার্ম করুন</h2><p>পণ্য: <b>${esc(actual.name)}</b> · মূল্য: <b>${fmtMoney(actual.price)}</b></p><form id="directOrderForm"><label>আপনার নাম *</label><input name="name" required placeholder="আপনার নাম"><label>মোবাইল নম্বর *</label><input name="phone" required type="tel" inputmode="tel" placeholder="01XXXXXXXXX"><label>সম্পূর্ণ ঠিকানা *</label><textarea name="address" required placeholder="বাসা/রোড, এলাকা, থানা ও জেলা"></textarea><label>অতিরিক্ত তথ্য (ঐচ্ছিক)</label><textarea name="note" placeholder="অন্য কোনো নির্দেশনা"></textarea><button class="primary detail-button" type="submit">অর্ডার কনফার্ম করুন</button></form><div id="orderResult" aria-live="polite"></div>`;
 root.appendChild(checkout);checkout.scrollIntoView({behavior:"smooth",block:"start"});
 document.getElementById("directOrderForm").addEventListener("submit",function(e){e.preventDefault();const f=new FormData(e.target);let orders;try{orders=JSON.parse(localStorage.getItem("ns_orders"))||[]}catch(err){orders=[]}const order={id:"SC"+Date.now().toString().slice(-8),date:new Date().toLocaleString(),name:f.get("name"),phone:f.get("phone"),address:f.get("address"),note:f.get("note"),items:[{name:actual.name,price:Number(actual.price),qty:1}],total:Number(actual.price),status:"Pending"};orders.unshift(order);localStorage.setItem("ns_orders",JSON.stringify(orders));document.getElementById("orderResult").innerHTML=`<div class="notice"><h3>✅ অর্ডার সফলভাবে জমা হয়েছে!</h3><p>আপনার অর্ডার নম্বর: <b>${esc(order.id)}</b></p><p>আমরা আপনার দেওয়া মোবাইল নম্বরে যোগাযোগ করব।</p><p>মোট: <b>${fmtMoney(order.total)}</b> · Cash on Delivery</p></div>`;e.target.reset();});
}

// Bind buttons explicitly so product-view ordering works on mobile browsers too.
document.addEventListener("click", function(event){
 const button = event.target.closest("[data-action]");
 if(!button) return;
 event.preventDefault();
 const pid = button.getAttribute("data-product-id");
 if(button.getAttribute("data-action") === "buy-now") addToCart(pid,true);
 else if(button.getAttribute("data-action") === "add-cart") addToCart(pid,false);
});
window.addToCart = addToCart;
