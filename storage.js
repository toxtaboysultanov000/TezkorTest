const SUBJECTS = ["HTML", "CSS", "JavaScript", "Python", "Matematika", "Informatika", "Ingliz tili", "Tarix"];
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
async function loadJSON(f) { const r = await fetch("data/" + f); if (!r.ok) throw new Error(f); return r.json() }
async function loadTests() { const base = (await loadJSON("tests.json")).tests; return base.concat(load("customTests", [])) }
const getUser = () => load("user", null);
function requireRole(role) { const u = getUser(); if (!u || u.role !== role) { location.href = "index.html" } return u }
function logout() { localStorage.removeItem("user"); location.href = "index.html" }
function toggleMenu() { document.body.classList.toggle("menu-open") }
function getResults() { return load("results", []) }
function saveResult(r) { const a = getResults(); a.push(r); save("results", a) }
