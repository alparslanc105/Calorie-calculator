// ====== BURAYI DEĞİŞTİR ======
const KILO = 87.0;  // kg
const BOY  = 185;   // cm  (kendi boyunu yaz)
const YAS  = 20;    // yıl (kendi yaşını yaz)
// =============================

const BMR = (10 * KILO) + (6.25 * BOY) - (5 * YAS) + 5;
const BMR_DAKIKA = BMR / 1440;

// Dakika girilen aktiviteler
// bmrDusme: false -> BMR düşülmez, brüt direkt eklenir
const AKTIVITELER = [
  { id: "bisiklet",  ad: "Bisiklet",  brut: d => 0.11375 * KILO * d },
  { id: "yuruyus",   ad: "Yürüyüş",   brut: d => 0.04725 * KILO * d },
  { id: "basket",    ad: "Basketbol", brut: d => KILO * 0.14 * d },
  { id: "isHafif",   ad: "Hafif iş",  brut: d => 1.25 * d, bmrDusme: false }, // 300 dk = 375 kcal
  { id: "isNormal",  ad: "Normal iş", brut: d => (500 / 300) * d, bmrDusme: false }, // 300 dk = 500 kcal
];

// Gym: dakika yok, seçenek var (kilo değişince otomatik güncellenir)
const GYM = {
  yok:    0,
  hafif:  (KILO / 85.5) * 150,
  normal: (KILO / 85.5) * 250,
};

const fmt = n => Math.round(n).toLocaleString("tr-TR");
const $ = id => document.getElementById(id);

$("bilgi").textContent =
  `Kilo: ${KILO} kg · Boy: ${BOY} cm · Yaş: ${YAS} · Net aktivite sistemi`;

const kutu = $("aktiviteler");

// Gym satırı (seçmeli)
const gymRow = document.createElement("div");
gymRow.className = "row";
gymRow.innerHTML = `
  <label for="gym">Gym</label>
  <select id="gym">
    <option value="yok">Yok</option>
    <option value="hafif">Hafif</option>
    <option value="normal">Normal</option>
  </select>
  <span class="kcal" id="k_gym">0 kcal</span>`;
kutu.appendChild(gymRow);
gymRow.querySelector("select").addEventListener("change", hesapla);

// Dakika girilen satırlar
AKTIVITELER.forEach(a => {
  const r = document.createElement("div");
  r.className = "row";
  r.innerHTML = `
    <label for="${a.id}">${a.ad}</label>
    <input type="number" id="${a.id}" min="0" step="1" placeholder="dk">
    <span class="kcal" id="k_${a.id}">0 kcal</span>`;
  kutu.appendChild(r);
  r.querySelector("input").addEventListener("input", hesapla);
});

function hesapla() {
  let brutToplam = 0, netToplam = 0;

  // Gym
  const gymKcal = GYM[$("gym").value];
  brutToplam += gymKcal;
  netToplam += gymKcal;
  $("k_gym").textContent = fmt(gymKcal) + " kcal";

  // Diğer aktiviteler
  AKTIVITELER.forEach(a => {
    const dk = Math.max(0, parseFloat($(a.id).value) || 0);
    const brut = a.brut(dk);
    const net = a.bmrDusme === false ? brut : brut - (BMR_DAKIKA * dk);
    brutToplam += brut;
    netToplam += net;
    $("k_" + a.id).textContent = fmt(net) + " kcal";
  });

  const baz = BMR * 1.2;
  const maint = baz + netToplam;

  $("bmr").textContent = fmt(BMR);
  $("baz").textContent = fmt(baz);
  $("brut").textContent = fmt(brutToplam);
  $("net").textContent = fmt(netToplam);
  $("maint").textContent = fmt(maint);

  $("cutOrta").textContent = fmt(maint - 700);
  $("cutAralik").textContent = `${fmt(maint - 800)} – ${fmt(maint - 600)} kcal`;
  $("bulkOrta").textContent = fmt(maint + 250);
  $("bulkAralik").textContent = `${fmt(maint + 200)} – ${fmt(maint + 300)} kcal · önerilen +250`;
}
hesapla();