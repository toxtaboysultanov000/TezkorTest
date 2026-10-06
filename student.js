const user = requireRole("student"), fullName = `${user.firstName} ${user.lastName}`;
$("#hello").textContent = "Salom, " + fullName;
let tests = [];
const myResults = () => getResults().filter(r => r.student === fullName);
function testCard(t) { return `<div class="card"><h3>${esc(t.title)}</h3><p class="muted">${esc(t.subject)} · ${t.questions.length} ta savol · ${Math.round(t.time / 60)} daqiqa</p><a class="btn" href="test.html?id=${t.id}">Boshlash →</a></div>` }
function show(v) {
    document.querySelectorAll(".side button").forEach(b => b.classList.toggle("active", b.dataset.v === v));
    document.body.classList.remove("menu-open"); const m = $("#main");
    if (v === "home") {
        const r = myResults(), avg = r.length ? Math.round(r.reduce((s, x) => s + x.percent, 0) / r.length) : 0;
        m.innerHTML = `<h2>Bosh sahifa</h2><div class="grid"><div class="card"><h3>${tests.length}</h3><p class="muted">Mavjud testlar</p></div><div class="card"><h3>${r.length}</h3><p class="muted">Topshirilgan testlar</p></div><div class="card"><h3>${avg}%</h3><p class="muted">O'rtacha natija</p></div></div>`
    }
    if (v === "subjects") m.innerHTML = `<h2>Fanlar</h2><div class="grid">` + SUBJECTS.map(s => { const n = tests.filter(t => t.subject === s).length; return `<div class="card"><h3>${s}</h3><p class="muted">${n} ta test</p><button class="btn" onclick="filterSubject('${s}')">Boshlash →</button></div>` }).join("") + `</div>`;
    if (v === "tests") m.innerHTML = `<h2>Testlar</h2><div class="grid">${tests.map(testCard).join("")}</div>`;
    if (v === "results") { m.innerHTML = `<h2>Natijalarim</h2><div id="rb"></div>`; renderResults($("#rb"), myResults()) }
    if (v === "profile") m.innerHTML = `<h2>Profil</h2><div class="card"><p><b>Ism:</b> ${esc(user.firstName)}</p><p><b>Familiya:</b> ${esc(user.lastName)}</p><p><b>Rol:</b> O'quvchi</p></div>`
}
function filterSubject(s) { const l = tests.filter(t => t.subject === s); $("#main").innerHTML = `<h2>${s} testlari</h2>` + (l.length ? `<div class="grid">${l.map(testCard).join("")}</div>` : "<p class='muted'>Bu fan uchun test hali yo'q.</p>") }
loadTests().then(t => { tests = t; show("home") }).catch(() => $("#main").innerHTML = "<p class='err msg'>JSON o'qilmadi. Live Server ishlating.</p>");
