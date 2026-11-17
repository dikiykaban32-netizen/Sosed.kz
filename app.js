const CATS=[
 ["Все услуги","✦"],["Сантехники","🚰"],["Электрики","💡"],["Сварщики","⚒️"],["Ремонт квартир","🏠"],["Грузчики и перевозки","🚚"],["Уборка","🧹"],["Автомастера","🚗"],["Красота","✂️"],["Другое","🛠️"]
];
const seed=[
 {id:1,title:"Услуги сантехника",category:"Сантехники",name:"Александр",phone:"+77010000001",district:"Юго-Восток",price:"От 5 000 ₸",description:"Установка смесителей, устранение протечек, замена труб."},
 {id:2,title:"Электрик на дом",category:"Электрики",name:"Руслан",phone:"+77010000002",district:"Михайловка",price:"Договорная",description:"Розетки, освещение, проводка и мелкий ремонт."},
 {id:3,title:"Сварочные работы",category:"Сварщики",name:"Сергей",phone:"+77010000003",district:"Пришахтинск",price:"От 7 000 ₸",description:"Сварка ворот, заборов, навесов и металлических конструкций."}
];
const $=s=>document.querySelector(s);
let items=JSON.parse(localStorage.getItem("sk_items")||"null")||seed;
let favs=JSON.parse(localStorage.getItem("sk_favs")||"[]");
let activeCat="Все услуги",tab="home";
const save=()=>{localStorage.setItem("sk_items",JSON.stringify(items));localStorage.setItem("sk_favs",JSON.stringify(favs));};
function toast(t){let el=$("#toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
function renderCats(){
 $("#categories").innerHTML=CATS.slice(1).map(([n,i])=>`<button class="cat ${activeCat===n?"selected":""}" data-cat="${n}"><span class="ico">${i}</span>${n}</button>`).join("");
 $("#categories").querySelectorAll("button").forEach(b=>b.onclick=()=>{activeCat=activeCat===b.dataset.cat?"Все услуги":b.dataset.cat;tab="home";render()});
}
function render(){
 renderCats();
 let q=$("#search").value.trim().toLowerCase();
 let shown=items.filter(x=>(activeCat==="Все услуги"||x.category===activeCat)&&(!q||[x.title,x.category,x.name,x.district,x.description].join(" ").toLowerCase().includes(q))&&(tab!=="favorites"||favs.includes(x.id)));
 $("#listTitle").textContent=tab==="favorites"?"Избранное":activeCat==="Все услуги"?"Объявления":activeCat;
 $("#allBtn").style.display=tab==="favorites"?"none":"inline";
 $("#listings").innerHTML=shown.length?shown.map(x=>`<article class="listing"><div class="listing-top"><div><h3>${esc(x.title)}</h3><div class="meta">${esc(x.category)} · ${esc(x.district||"Караганда")}</div></div><div class="price">${esc(x.price||"Цена договорная")}</div></div><div class="meta">Мастер: ${esc(x.name)}</div><p class="desc">${esc(x.description||"Свяжитесь с мастером, чтобы уточнить детали.")}</p><div class="actions"><button class="wa" data-phone="${esc(x.phone)}" data-name="${esc(x.name)}">Написать в WhatsApp</button><button class="fav" data-fav="${x.id}">${favs.includes(x.id)?"♥":"♡"}</button></div></article>`).join(""):`<div class="empty">${tab==="favorites"?"В избранном пока пусто. Нажми ♡ у понравившегося объявления.":"Пока нет подходящих объявлений. Попробуй изменить поиск или добавь первое объявление."}</div>`;
 $("#listings").querySelectorAll("[data-fav]").forEach(b=>b.onclick=()=>{let id=Number(b.dataset.fav);favs=favs.includes(id)?favs.filter(v=>v!==id):[...favs,id];save();render()});
 $("#listings").querySelectorAll("[data-phone]").forEach(b=>b.onclick=()=>{let p=b.dataset.phone.replace(/\D/g,"");if(p.length<10){toast("Проверь номер телефона в объявлении");return}let msg=encodeURIComponent("Здравствуйте! Нашёл ваше объявление в приложении Сосед KZ.");location.href=`https://wa.me/${p}?text=${msg}`});
}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function openForm(){$("#modal").classList.remove("hidden")}
function closeForm(){$("#modal").classList.add("hidden")}
function init(){
 $("#categorySelect").innerHTML=CATS.slice(1).map(([n])=>`<option>${n}</option>`).join("");
 $("#search").addEventListener("input",render);
 $("#addTop").onclick=$("#addBottom").onclick=openForm;
 $("#closeModal").onclick=closeForm;
 $("#modal").onclick=e=>{if(e.target.id==="modal")closeForm()};
 $("#listingForm").onsubmit=e=>{e.preventDefault();let f=new FormData(e.target);let phone=String(f.get("phone")).trim();if(phone.replace(/\D/g,"").length<10){toast("Укажи корректный номер телефона");return}
 items.unshift({id:Date.now(),title:f.get("title").trim(),category:f.get("category"),name:f.get("name").trim(),phone,district:f.get("district").trim()||"Караганда",price:f.get("price").trim()||"Цена договорная",description:f.get("description").trim()});save();e.target.reset();activeCat="Все услуги";tab="home";closeForm();render();toast("Объявление добавлено на этом телефоне")};
 document.querySelectorAll(".navitem").forEach(b=>b.onclick=()=>{tab=b.dataset.tab;activeCat="Все услуги";if(tab==="about"){alert("Сосед KZ — сервис поиска местных услуг в Караганде. Первая тестовая версия. Объявления пока хранятся только на этом устройстве.");tab="home";return}document.querySelectorAll(".navitem").forEach(x=>x.classList.toggle("active",x===b));render()});
 $("#allBtn").onclick=()=>{activeCat="Все услуги";render()};
 render();
 if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
}
init();