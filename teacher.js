const teacher = requireRole("teacher"); let qs = [], tests = [], students = [];
function stats(name) { const r = getResults().filter(x => x.student === name); return { n: r.length, avg: r.length ? Math.round(r.reduce((s, x) => s + x.percent, 0) / r.length) : 0 } }
function show(v) {
    document.querySelectorAll(".side button").forEach(b => b.classList.toggle("active", b.dataset.v === v));
    document.body.classList.remove("menu-open"); const m = $("#main");
    if (v === "dash") m.innerHTML = `<h2>Dashboard</h2><div class="grid"><div class="card"><h3>${tests.length}</h3><p class="muted">Testlar</p></div><div class="card"><h3>${students.length}</h3><p class="muted">O'quvchilar</p></div><div class="card"><h3>${getResults().length}</h3><p class="muted">Topshirilgan testlar</p></div></div>`;
    if (v === "tests") { m.innerHTML = `<h2>Testlar</h2><div class="tbl"><table><tr><th>ID</th><th>Fan</th><th>Nomi</th><th>Savollar</th><th></th></tr>` + tests.map(t => `<tr><td>${t.id}</td><td>${esc(t.subject)}</td><td>${esc(t.title)}</td><td>${t.questions.length}</td><td>${t.id > 3 ? `<button class="btn small ghost" onclick="deleteTest(${t.id})">O'chirish</button>` : ""}</td></tr>`).join("") + `</table></div>` }
    if (v === "create") renderCreate();
    if (v === "subjects") m.innerHTML = `<h2>Fanlar</h2><div class="grid">` + SUBJECTS.map(s => `<div class="card"><h3>${s}</h3><p class="muted">${tests.filter(t => t.subject === s).length} ta test</p></div>`).join("") + `</div>`;
    if (v === "students") m.innerHTML = `<h2>O'quvchilar</h2><div class="tbl"><table><tr><th>№</th><th>Ism</th><th>Familiya</th><th>Testlar soni</th><th>O'rtacha natija</th><th>Status</th></tr>` + students.map((s, i) => { const st = stats(`${s.firstName} ${s.lastName}`); return `<tr><td>${i + 1}</td><td>${esc(s.firstName)}</td><td>${esc(s.lastName)}</td><td>${st.n}</td><td>${st.avg}%</td><td>${st.n ? "Faol" : "Nofaol"}</td></tr>` }).join("") + `</table></div>`;
    if (v === "results") { m.innerHTML = `<h2>Natijalar</h2><div id="rb"></div>`; const r = getResults(); $("#rb").innerHTML = r.length ? `<div class="tbl"><table><tr><th>O'quvchi</th><th>Fan</th><th>Test</th><th>Natija</th><th>Foiz</th><th>Sana</th></tr>` + r.slice().reverse().map(x => `<tr><td>${esc(x.student)}</td><td>${esc(x.subject)}</td><td>${esc(x.title)}</td><td>${x.score}/${x.total}</td><td>${x.percent}%</td><td>${x.date}</td></tr>`).join("") + `</table></div>` : "<p class='muted'>Natijalar yo'q.</p>" }
    if (v === "settings") m.innerHTML = `<h2>Sozlamalar</h2><div class="card"><p>Brauzerda saqlangan testlar va natijalarni tozalash.</p><button class="btn" onclick="clearData()">Ma'lumotlarni tozalash</button></div>`
}
function clearData() { if (confirm("Barcha saqlangan testlar va natijalar o'chiriladi. Davom etasizmi?")) { localStorage.removeItem("customTests"); localStorage.removeItem("results"); location.reload() } }
function deleteTest(id) { save("customTests", load("customTests", []).filter(t => t.id !== id)); init(false).then(() => show("tests")) }
function renderCreate() { $("#main").innerHTML = `<h2>Yangi test yaratish</h2><div class="card"><label>Test nomi<input id="tTitle"></label><label>Fan<select id="tSub">${SUBJECTS.map(s => `<option>${s}</option>`).join("")}</select></label><label>Test vaqti (daqiqa)<input id="tTime" type="number" min="1" value="10"></label></div><div id="qs"></div><button class="btn ghost" onclick="addQuestion()">+ Savol qo'shish</button> <button class="btn" onclick="generateJSON()">JSON yaratish</button> <button class="btn" onclick="createTest()">Testni saqlash</button><div id="cmsg" class="msg"></div><div id="jsonOut"></div>`; qs = []; addQuestion() }
function addQuestion() { syncQs(); qs.push({ question: "", options: ["", "", "", ""], answer: 0 }); renderQs() }
function removeQuestion(i) { syncQs(); qs.splice(i, 1); renderQs() }
function syncQs() { document.querySelectorAll(".qb").forEach((b, i) => { qs[i] = { question: b.querySelector(".q").value, options: [...b.querySelectorAll(".o")].map(x => x.value), answer: +b.querySelector(".a").value } }) }
function renderQs() { $("#qs").innerHTML = qs.map((q, i) => `<div class="card qb"><div class="row"><b>Savol ${i + 1}</b><button class="btn small ghost" onclick="removeQuestion(${i})">O'chirish</button></div><input class="q" placeholder="Savol matni" value="${esc(q.question)}">` + "ABCD".split("").map((L, j) => `<input class="o" placeholder="Variant ${L}" value="${esc(q.options[j])}">`).join("") + `<label>To'g'ri javob<select class="a">${"ABCD".split("").map((L, j) => `<option value="${j}" ${q.answer === j ? "selected" : ""}>${L}</option>`).join("")}</select></label></div>`).join("") }
function cmsg(t, ok) { const e = $("#cmsg"); e.textContent = t; e.className = "msg " + (ok ? "ok" : "err"); return null }
function buildTest() {
    syncQs(); const title = $("#tTitle").value.trim(), time = +$("#tTime").value;
    if (!title) return cmsg("Test nomini kiriting!"); if (!(time > 0)) return cmsg("Vaqtni to'g'ri kiriting!");
    if (!qs.length) return cmsg("Kamida bitta savol qo'shing!");
    for (const q of qs) if (!q.question.trim() || q.options.some(o => !o.trim())) return cmsg("Barcha savol va variantlarni to'ldiring!");
    const id = Math.max(0, ...tests.map(t => t.id)) + 1; cmsg("");
    return { id, subject: $("#tSub").value, title, time: time * 60, questions: qs.map(q => ({ question: q.question.trim(), options: q.options.map(o => o.trim()), answer: q.answer })) }
}
function generateJSON() {
    const t = buildTest(); if (!t) return;
    $("#jsonOut").innerHTML = `<pre><code id="jsonCode">${esc(JSON.stringify(t, null, 2))}</code></pre><button class="btn" onclick="copyJSON()">JSON nusxalash</button>`
}
function copyJSON() {
    const t = $("#jsonCode").textContent; const done = () => cmsg("JSON nusxalandi!", true);
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(done);
    else { const a = document.createElement("textarea"); a.value = t; document.body.append(a); a.select(); document.execCommand("copy"); a.remove(); done() }
}
async function createTest() {
    const t = buildTest(); if (!t) return;
    const a = load("customTests", []); a.push(t); save("customTests", a); generateJSON(); cmsg("Test saqlandi! O'quvchilar uni ko'radi.", true); tests.push(t)
}
async function init(go = true) { tests = await loadTests(); students = (await loadJSON("students.json")).students; if (go) show("dash") }
init().catch(() => $("#main").innerHTML = "<p class='msg err'>JSON o'qilmadi. Live Server ishlating.</p>");
