let test, cur = 0, ans = [], left = 0, timer, user;
async function init() {
    user = requireRole("student");
    const id = +new URLSearchParams(location.search).get("id");
    try { test = (await loadTests()).find(t => t.id === id) } catch { }
    if (!test) { $("#app").innerHTML = "<p class='msg err'>Test topilmadi.</p><a class='btn' href='student.html'>Orqaga</a>"; return }
    startTest()
}
function fmt(s) { return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0") }
function startTest() {
    cur = 0; left = test.time; ans = Array(test.questions.length).fill(null);
    $("#app").innerHTML = `<div class="thead"><h2>${esc(test.title)}</h2><span id="cnt"></span><span class="timer" id="timer">${fmt(left)}</span></div><div id="qbox"></div><div class="nav"><button class="btn ghost" id="prev" onclick="previousQuestion()">← Oldingi</button><button class="btn" id="next" onclick="nextQuestion()">Keyingi →</button></div>`;
    clearInterval(timer); timer = setInterval(() => { left--; $("#timer").textContent = fmt(left); if (left <= 0) finishTest() }, 1000); showQuestion()
}
function showQuestion() {
    const q = test.questions[cur], L = "ABCD";
    $("#cnt").textContent = `Savol: ${cur + 1} / ${test.questions.length}`;
    $("#qbox").innerHTML = `<div class="card"><h3>${esc(q.question)}</h3>` + q.options.map((o, i) => `<label class="opt ${ans[cur] === i ? "sel" : ""}"><input type="radio" name="o" ${ans[cur] === i ? "checked" : ""} onchange="ans[cur]=${i};showQuestion()"> ${L[i]}) ${esc(o)}</label>`).join("") + `</div>`;
    $("#prev").disabled = cur === 0; const last = cur === test.questions.length - 1;
    $("#next").textContent = last ? "Testni yakunlash" : "Keyingi →"
}
function nextQuestion() { if (cur === test.questions.length - 1) finishTest(); else { cur++; showQuestion() } }
function previousQuestion() { if (cur > 0) { cur--; showQuestion() } }
function calculateResult() {
    const total = test.questions.length, score = test.questions.filter((q, i) => ans[i] === q.answer).length;
    return { score, total, percent: Math.round(score / total * 100) }
}
function finishTest() {
    clearInterval(timer); const r = calculateResult();
    saveResult({ student: `${user.firstName} ${user.lastName}`, subject: test.subject, title: test.title, ...r, date: new Date().toLocaleDateString("ru-RU") });
    $("#app").innerHTML = `<div class="card center"><h2>🎉 Test yakunlandi!</h2><h1>${r.score} / ${r.total}</h1><h3>${r.percent}%</h3><p>To'g'ri javoblar: ${r.score}</p><p>Noto'g'ri javoblar: ${r.total - r.score}</p><button class="btn" onclick="startTest()">Qayta ishlash</button> <a class="btn ghost" href="student.html">Testlarga qaytish</a></div>`
}
init();
