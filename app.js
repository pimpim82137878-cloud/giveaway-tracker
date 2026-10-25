// ตั้งค่า URL และ anon/publishable key จาก Supabase ในไฟล์นี้ก่อนเผยแพร่
const SUPABASE_URL = "https://nszozmaqkupejplyqaus.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_pSqpW9NPCYfoG0UlNJyy-w_Jj4W4Bnn";
const configured = SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("YOUR_") && !SUPABASE_ANON_KEY.includes("YOUR_");
const $ = (id) => document.getElementById(id);
let db = null, currentUser = null, nickname = "", allItems = [];

if (configured && window.supabase) {
  db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  $("setupNotice").classList.remove("hidden");
}

function msg(text) { $("statusMessage").textContent = text || ""; }
function safeUrl(value) {
  try { const u = new URL(value); return ["https:", "http:"].includes(u.protocol) && (u.hostname === "x.com" || u.hostname === "www.x.com" || u.hostname === "twitter.com" || u.hostname === "www.twitter.com") ? u.href : null; }
  catch { return null; }
}

async function getXImageUrl(postUrl) {
  try {
    const match = postUrl.match(/\/status\/(\d+)/);
    if (!match) return null;

    const postId = match[1];

    const response = await fetch(
      `https://api.vxtwitter.com/Twitter/status/${postId}`
    );

    if (!response.ok) return null;

    const data = await response.json();

    const media = Array.isArray(data.media_extended)
      ? data.media_extended
      : [];

    const image = media.find(item =>
      item.type === "image" &&
      typeof item.url === "string" &&
      item.url.startsWith("https://")
    );

    if (image) return image.url;

    if (Array.isArray(data.mediaURLs)) {
      const fallback = data.mediaURLs.find(url =>
        typeof url === "string" &&
        url.startsWith("https://pbs.twimg.com/media/")
      );

      if (fallback) return fallback;
    }

    return null;
  } catch (error) {
    console.error("ดึงรูปไม่สำเร็จ:", error);
    return null;
  }
}
function showTracker(name) {
  nickname = name;
  $("userHeading").textContent = name + " 💗";
  $("loginPanel").classList.add("hidden");
  $("tracker").classList.remove("hidden");
}
async function init() {
  if (!db) return;
  try {
    const { data: { session }, error } = await db.auth.getSession();
    if (error) throw error;
    if (session) {
      currentUser = session.user;
      const savedName = localStorage.getItem("giveaway_nickname") || "เพื่อน";
      showTracker(savedName); await loadItems();
    }
  } catch (e) { msg("เชื่อมต่อไม่ได้: " + e.message); }
}
$("startBtn").addEventListener("click", async () => {
  const name = $("nickname").value.trim();
  if (name.length < 2) return alert("กรุณาใส่ชื่อเล่นอย่างน้อย 2 ตัวอักษร");
  if (!db) return alert("ยังไม่ได้ตั้งค่า Supabase ดูขั้นตอนใน README.md ก่อนนะ");
  $("startBtn").disabled = true; $("startBtn").textContent = "กำลังเข้าใช้งาน…";
  try {
    const { data, error } = await db.auth.signInAnonymously();
    if (error) throw error;
    currentUser = data.user;
    localStorage.setItem("giveaway_nickname", name);
    showTracker(name); await loadItems();
  } catch (e) { alert("เข้าใช้งานไม่สำเร็จ: " + e.message + "\nตรวจว่าเปิด Anonymous Sign-ins ใน Supabase แล้ว"); }
  finally { $("startBtn").disabled = false; $("startBtn").textContent = "เริ่มใช้งานของฉัน"; }
});
$("logoutBtn").addEventListener("click", async () => {
  if (!confirm("ออกจากพื้นที่นี้บนอุปกรณ์นี้ใช่ไหม? ถ้าเป็นบัญชี anonymous อาจกลับเข้าบัญชีเดิมไม่ได้หากออกจากระบบ")) return;
  // To protect anonymous account data, keep the session on device; just hide the tracker.
  $("tracker").classList.add("hidden"); $("loginPanel").classList.remove("hidden");
  $("nickname").value = ""; currentUser = null; allItems = [];
});
async function loadItems() {
  if (!db || !currentUser) return;
  msg("กำลังโหลดรายการ…");
  const { data, error } = await db.from("giveaway_items").select("*").order("created_at", {ascending:false});
  if (error) { msg("โหลดรายการไม่ได้: " + error.message); return; }
  allItems = data || []; render(); msg("");
}
function render() {
  const done = allItems.filter(x => x.is_done).length;
  $("totalCount").textContent = allItems.length;
  $("doneCount").textContent = done;
  $("todoCount").textContent = allItems.length - done;
  const filter = $("filter").value;
  const rows = allItems.filter(x => filter === "all" || (filter === "done" ? x.is_done : !x.is_done));
  $("items").innerHTML = "";
  $("emptyState").classList.toggle("hidden", rows.length !== 0);
  rows.forEach(item => {
    const article = document.createElement("article");
    article.className = "item" + (item.is_done ? " done" : "");

if (item.image_url) {
  const image = document.createElement("img");

  image.src = item.image_url;
  image.alt = item.title || "รูปของรางวัล";
  image.loading = "lazy";

  image.style.display = "block";
  image.style.width = "100%";
  image.style.maxHeight = "260px";
  image.style.objectFit = "contain";
  image.style.borderRadius = "12px";
  image.style.marginBottom = "12px";

  image.addEventListener("error", () => {
    image.remove();
  });

  article.append(image);
}
    const top = document.createElement("div"); top.className = "item-top";
    const checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.className = "check"; checkbox.checked = item.is_done; checkbox.setAttribute("aria-label", "เปลี่ยนสถานะเก็บแล้ว");
    checkbox.addEventListener("change", () => toggleItem(item.id, checkbox.checked));
    const details = document.createElement("div"); details.style.minWidth = "0"; details.style.flex = "1";
    const title = document.createElement("div"); title.className = "item-title"; title.textContent = item.title || "Giveaway ไม่มีชื่อ";
    const link = document.createElement("a"); link.className = "item-url"; link.href = item.post_url; link.target = "_blank"; link.rel = "noopener noreferrer"; link.textContent = item.post_url;
    details.append(title, link); top.append(checkbox, details); article.append(top);
    if (item.note) { const note = document.createElement("div"); note.className = "note"; note.textContent = "✎ " + item.note; article.append(note); }
    const actions = document.createElement("div"); actions.className = "item-actions";
    const open = document.createElement("button"); open.className = "open-link"; open.textContent = "เปิดต้นโพสต์ ↗"; open.addEventListener("click", () => window.open(item.post_url, "_blank", "noopener"));
    const del = document.createElement("button"); del.className = "delete"; del.textContent = "ลบรายการ"; del.addEventListener("click", () => deleteItem(item.id));
    actions.append(open, del); article.append(actions); $("items").append(article);
  });
}
async function toggleItem(id, value) {
  const { error } = await db.from("giveaway_items").update({is_done:value}).eq("id", id);
  if (error) { alert("บันทึกไม่สำเร็จ: " + error.message); await loadItems(); return; }
  const item = allItems.find(x => x.id === id); if (item) item.is_done = value; render();
}
$("addForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!db || !currentUser) return alert("กรุณาเข้าใช้งานก่อน");
  const postUrl = safeUrl($("postUrl").value.trim());
  if (!postUrl) return alert("กรุณาใส่ลิงก์โพสต์จาก x.com หรือ twitter.com");

const title = $("postTitle").value.trim();
const note = $("postNote").value.trim();

msg("กำลังค้นหารูปของรางวัล…");

const imageUrl = await getXImageUrl(postUrl);

const { error } = await db.from("giveaway_items").insert({
  owner_id: currentUser.id,
  title: title || "Giveaway",
  post_url: postUrl,
  note,
  image_url: imageUrl,
  is_done: false
});

  if (error) { alert("เพิ่มรายการไม่ได้: " + error.message); return; }
  $("addForm").reset(); await loadItems();
});
async function deleteItem(id) {
  if (!confirm("ต้องการลบรายการนี้ใช่ไหม?")) return;
  const { error } = await db.from("giveaway_items").delete().eq("id", id);
  if (error) { alert("ลบไม่สำเร็จ: " + error.message); return; }
  allItems = allItems.filter(x => x.id !== id); render();
}
$("filter").addEventListener("change", render);
init();
