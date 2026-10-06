function renderResults(el, list) {
    if (!list.length) { el.innerHTML = "<p class='muted'>Hozircha natijalar yo'q.</p>"; return }
    el.innerHTML = `<div class="tbl"><table><tr><th>Fan</th><th>Test</th><th>Natija</th><th>Foiz</th><th>Sana</th></tr>` +
        list.slice().reverse().map(r => `<tr><td>${esc(r.subject)}</td><td>${esc(r.title)}</td><td>${r.score}/${r.total}</td><td>${r.percent}%</td><td>${r.date}</td></tr>`).join("") + `</table></div>`
}
if ($("#resultsBox")) {
    const u = requireRole("student"); $("#who").textContent = `${u.firstName} ${u.lastName}`;
    renderResults($("#resultsBox"), getResults().filter(r => r.student === `${u.firstName} ${u.lastName}`))
}
