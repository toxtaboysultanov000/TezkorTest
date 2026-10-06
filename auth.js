function showForm(type) { $("#choice").hidden = true; $("#studentForm").hidden = type !== "student"; $("#teacherForm").hidden = type !== "teacher" }
function back() { $("#choice").hidden = false; $("#studentForm").hidden = true; $("#teacherForm").hidden = true }
function msg(id, t, ok) { const e = $(id); e.textContent = t; e.className = "msg " + (ok ? "ok" : "err") }
async function loginStudent(e) {
    e.preventDefault();
    const f = $("#sFirst").value.trim(), l = $("#sLast").value.trim(), p = $("#sPass").value.trim();
    if (!f || !l || !p) return msg("#sMsg", "Barcha maydonlarni to'ldiring!");
    try {
        const list = (await loadJSON("students.json")).students;
        const s = list.find(x => x.firstName.toLowerCase() === f.toLowerCase() && x.lastName.toLowerCase() === l.toLowerCase() && x.password === p);
        if (!s) return msg("#sMsg", "Ism, familiya yoki parol noto'g'ri!");
        save("user", { role: "student", firstName: s.firstName, lastName: s.lastName });
        msg("#sMsg", `Xush kelibsiz, ${s.firstName} ${s.lastName}!`, true);
        setTimeout(() => location.href = "student.html", 900)
    } catch { msg("#sMsg", "JSON o'qilmadi. Live Server ishlating.") }
}
async function loginTeacher(e) {
    e.preventDefault();
    const u = $("#tUser").value.trim(), p = $("#tPass").value.trim();
    if (!u || !p) return msg("#tMsg", "Login va parolni kiriting!");
    try {
        const t = (await loadJSON("teachers.json")).teachers.find(x => x.username === u && x.password === p);
        if (!t) return msg("#tMsg", "Login yoki parol noto'g'ri!");
        save("user", { role: "teacher", name: t.name }); msg("#tMsg", "Xush kelibsiz!", true);
        setTimeout(() => location.href = "teacher.html", 700)
    } catch { msg("#tMsg", "JSON o'qilmadi. Live Server ishlating.") }
}
