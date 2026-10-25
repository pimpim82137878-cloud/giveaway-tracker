
const SUPABASE_URL = "https://nszozmaqkupejplyqaus.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_pSqpW9NPCYfoG0UlNJyy-w_Jj4W4Bnn";

const configured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_") &&
  !SUPABASE_ANON_KEY.includes("YOUR_");

const $ = (id) => document.getElementById(id);

let db = null;
let currentUser = null;
let nickname = "";
let allItems = [];
let busy = false;

const translations = {
  th: {
    tagline: "เก็บลิงก์ให้ครบ ไม่พลาด Giveaway ที่อยากได้ 💗",
    welcome: "ยินดีต้อนรับ ✨",
    nicknameLabel: "ชื่อเล่นของคุณ",
    nicknamePlaceholder: "เช่น mochi / pinky",
    start: "เริ่มใช้งานของฉัน",
    starting: "กำลังเข้าใช้งาน…",
    logout: "ออกจากพื้นที่นี้",
    checklist: "เช็กลิสต์ของ",
    total: "ทั้งหมด",
    done: "เก็บแล้ว",
    todo: "ยังไม่ได้เก็บ",
    addTitle: "เพิ่ม Giveaway ใหม่",
    itemTitle: "ชื่อรายการ (ไม่ใส่ก็ได้)",
    titlePlaceholder: "เช่น แจกโฟโต้การ์ด / อัลบั้ม",
    postLink: "ลิงก์ต้นโพสต์ X / Twitter",
    urlPlaceholder: "https://x.com/...",
    note: "โน้ต (ไม่ใส่ก็ได้)",
    notePlaceholder: "เช่น ปิดรับ 30 ต.ค.",
    add: "＋ เพิ่มลงเช็กลิสต์",
    myItems: "รายการของฉัน",
    all: "ทั้งหมด",
    filterTodo: "ยังไม่ได้เก็บ",
    filterDone: "เก็บแล้ว",
    searchLabel: "ค้นหาชื่อรายการ",
searchPlaceholder: "พิมพ์ชื่อ Giveaway ที่ต้องการค้นหา...",
searchEmpty: "ไม่พบรายการที่ตรงกับคำค้นหา 🔎",
    empty: "ยังไม่มีรายการเลย 🌷",
    emptyHint: "เพิ่มลิงก์ต้นโพสต์แรกของคุณได้ด้านบน",
    editName: "แก้ไขชื่อ ✎",
    editTitle: "แก้ไขชื่อของรางวัล:",
    edit: "แก้ไขชื่อ ✎",
    delete: "ลบรายการ",
    open: "เปิดต้นโพสต์ ↗",
    saved: "ทำด้วยความรักสำหรับนักเก็บ Giveaway 💕",
    namePrompt: "แก้ไขชื่อเจ้าของเช็กลิสต์:",
    invalidName: "กรุณาใส่ชื่ออย่างน้อย 2 ตัวอักษร",
    nameRequired: "กรุณาใส่ชื่อของรางวัล",
    deleteConfirm: "ต้องการลบรายการนี้ใช่ไหม?",
    loading: "กำลังโหลดรายการ…",
    searching: "กำลังค้นหารูปของรางวัล…",
    addError: "กรุณาใส่ลิงก์โพสต์จาก x.com หรือ twitter.com",
    loginError: "กรุณาเข้าใช้งานก่อน",
    saveError: "บันทึกไม่สำเร็จ: ",
    addItemError: "เพิ่มรายการไม่ได้: ",
    deleteError: "ลบไม่สำเร็จ: ",
    editError: "แก้ไขชื่อไม่สำเร็จ: ",
    toggleError: "บันทึกสถานะไม่สำเร็จ: ",
    loadError: "โหลดรายการไม่ได้: ",
    connectError: "เชื่อมต่อไม่ได้: ",
    setupMissing: "ยังไม่ได้ตั้งค่า Supabase กรุณาตรวจสอบ README.md",
    loginFailed: "เข้าใช้งานไม่สำเร็จ: ",
    loginHint: "ตรวจว่าเปิด Anonymous Sign-ins ใน Supabase แล้ว",
    logoutConfirm: "ออกจากพื้นที่นี้บนอุปกรณ์นี้ใช่ไหม? บัญชี anonymous อาจกลับเข้าบัญชีเดิมไม่ได้หากออกจากระบบ",
    untitled: "Giveaway ไม่มีชื่อ",
    defaultTitle: "Giveaway",
    prizeImage: "รูปของรางวัล",
    toggleLabel: "เปลี่ยนสถานะเก็บแล้ว",
    deadlinePlaceholder: "เช่น ปิดรับ 30 ต.ค."
  },

  en: {
    tagline: "Keep every link. Never miss a giveaway you want 💗",
    welcome: "Welcome ✨",
    nicknameLabel: "Your nickname",
    nicknamePlaceholder: "e.g. mochi / pinky",
    start: "Start my tracker",
    starting: "Signing in…",
    logout: "Leave this space",
    checklist: "Giveaway Checklist",
    total: "Total",
    done: "Collected",
    todo: "Not collected",
    addTitle: "Add a new giveaway",
    itemTitle: "Item name (optional)",
    titlePlaceholder: "e.g. Photocard / Album",
    postLink: "Original X / Twitter post link",
    urlPlaceholder: "https://x.com/...",
    note: "Note (optional)",
    notePlaceholder: "e.g. Deadline: Oct 30",
    add: "＋ Add to checklist",
    myItems: "My giveaways",
    all: "All",
    filterTodo: "Not collected",
    filterDone: "Collected",
    searchLabel: "Search item names",
searchPlaceholder: "Search giveaway names...",
searchEmpty: "No matching items found 🔎",
    empty: "No items yet 🌷",
    emptyHint: "Add your first post link above",
    editName: "Edit name ✎",
    editTitle: "Edit prize name:",
    edit: "Edit name ✎",
    delete: "Delete",
    open: "Open original post ↗",
    saved: "Made with love for giveaway collectors 💕",
    namePrompt: "Edit checklist owner's name:",
    invalidName: "Please enter at least 2 characters",
    nameRequired: "Please enter a prize name",
    deleteConfirm: "Are you sure you want to delete this item?",
    loading: "Loading items…",
    searching: "Finding prize image…",
    addError: "Please enter an x.com or twitter.com post link",
    loginError: "Please sign in first",
    saveError: "Could not save: ",
    addItemError: "Could not add item: ",
    deleteError: "Could not delete: ",
    editError: "Could not update name: ",
    toggleError: "Could not update status: ",
    loadError: "Could not load items: ",
    connectError: "Connection failed: ",
    setupMissing: "Supabase is not configured. Please check README.md.",
    loginFailed: "Sign-in failed: ",
    loginHint: "Make sure Anonymous Sign-ins is enabled in Supabase.",
    logoutConfirm: "Leave this space on this device? You may not be able to recover an anonymous account if you sign out.",
    untitled: "Untitled giveaway",
    defaultTitle: "Giveaway",
    prizeImage: "Prize image",
    toggleLabel: "Toggle collected status",
    deadlinePlaceholder: "e.g. Deadline: Oct 30"
  },

  ko: {
    tagline: "원하는 이벤트 링크를 모아 놓치지 마세요 💗",
    welcome: "환영합니다 ✨",
    nicknameLabel: "닉네임",
    nicknamePlaceholder: "예: mochi / pinky",
    start: "시작하기",
    starting: "로그인 중…",
    logout: "이 공간 나가기",
    checklist: "이벤트 체크리스트",
    total: "전체",
    done: "완료",
    todo: "미완료",
    addTitle: "새 이벤트 추가",
    itemTitle: "항목 이름 (선택)",
    titlePlaceholder: "예: 포토카드 / 앨범",
    postLink: "X / Twitter 원본 게시물 링크",
    urlPlaceholder: "https://x.com/...",
    note: "메모 (선택)",
    notePlaceholder: "예: 마감일 10월 30일",
    add: "＋ 체크리스트에 추가",
    myItems: "내 이벤트",
    all: "전체",
    filterTodo: "미완료",
    filterDone: "완료",
    searchLabel: "항목 이름 검색",
searchPlaceholder: "Giveaway 이름 검색...",
searchEmpty: "검색 결과가 없습니다 🔎",
    empty: "아직 항목이 없어요 🌷",
    emptyHint: "위에서 첫 게시물 링크를 추가하세요",
    editName: "이름 수정 ✎",
    editTitle: "경품 이름 수정:",
    edit: "이름 수정 ✎",
    delete: "삭제",
    open: "원본 게시물 열기 ↗",
    saved: "이벤트 수집러를 위한 사랑을 담아 💕",
    namePrompt: "체크리스트 이름 수정:",
    invalidName: "이름을 2자 이상 입력하세요",
    nameRequired: "경품 이름을 입력하세요",
    deleteConfirm: "이 항목을 삭제할까요?",
    loading: "항목 불러오는 중…",
    searching: "경품 이미지 찾는 중…",
    addError: "x.com 또는 twitter.com 게시물 링크를 입력하세요",
    loginError: "먼저 시작해 주세요",
    saveError: "저장 실패: ",
    addItemError: "항목 추가 실패: ",
    deleteError: "삭제 실패: ",
    editError: "이름 수정 실패: ",
    toggleError: "상태 저장 실패: ",
    loadError: "항목을 불러오지 못했습니다: ",
    connectError: "연결 실패: ",
    setupMissing: "Supabase 설정을 확인해 주세요. README.md를 참고하세요.",
    loginFailed: "로그인 실패: ",
    loginHint: "Supabase에서 Anonymous Sign-ins가 활성화되어 있는지 확인하세요.",
    logoutConfirm: "이 기기에서 나갈까요? 익명 계정은 복구하지 못할 수 있습니다.",
    untitled: "이름 없는 이벤트",
    defaultTitle: "Giveaway",
    prizeImage: "경품 이미지",
    toggleLabel: "완료 상태 변경",
    deadlinePlaceholder: "예: 마감일 10월 30일"
  },

  ja: {
    tagline: "欲しいプレゼント企画のリンクをまとめよう 💗",
    welcome: "ようこそ ✨",
    nicknameLabel: "ニックネーム",
    nicknamePlaceholder: "例：mochi / pinky",
    start: "はじめる",
    starting: "ログイン中…",
    logout: "このスペースを退出",
    checklist: "のプレゼント企画リスト",
    total: "合計",
    done: "保存済み",
    todo: "未保存",
    addTitle: "新しい企画を追加",
    itemTitle: "項目名（任意）",
    titlePlaceholder: "例：フォトカード / アルバム",
    postLink: "X / Twitter の元投稿リンク",
    urlPlaceholder: "https://x.com/...",
    note: "メモ（任意）",
    notePlaceholder: "例：締切 10月30日",
    add: "＋ リストに追加",
    myItems: "マイリスト",
    all: "すべて",
    filterTodo: "未保存",
    filterDone: "保存済み",
    searchLabel: "項目名を検索",
searchPlaceholder: "Giveaway 名を検索...",
searchEmpty: "一致する項目がありません 🔎",
    empty: "まだ項目がありません 🌷",
    emptyHint: "上から最初の投稿リンクを追加してください",
    editName: "名前を編集 ✎",
    editTitle: "景品名を編集:",
    edit: "名前を編集 ✎",
    delete: "削除",
    open: "元の投稿を開く ↗",
    saved: "プレゼント企画を集める皆さんへ愛を込めて 💕",
    namePrompt: "リストの名前を編集:",
    invalidName: "2文字以上入力してください",
    nameRequired: "景品名を入力してください",
    deleteConfirm: "この項目を削除しますか？",
    loading: "読み込み中…",
    searching: "景品画像を検索中…",
    addError: "x.com または twitter.com のリンクを入力してください",
    loginError: "先にログインしてください",
    saveError: "保存できませんでした: ",
    addItemError: "追加できませんでした: ",
    deleteError: "削除できませんでした: ",
    editError: "名前を変更できませんでした: ",
    toggleError: "状態を保存できませんでした: ",
    loadError: "項目を読み込めませんでした: ",
    connectError: "接続できませんでした: ",
    setupMissing: "Supabase の設定を確認してください。README.md を参照してください。",
    loginFailed: "ログインに失敗しました: ",
    loginHint: "Supabase で Anonymous Sign-ins が有効か確認してください。",
    logoutConfirm: "この端末で退出しますか？匿名アカウントは復元できない場合があります。",
    untitled: "名前のない企画",
    defaultTitle: "Giveaway",
    prizeImage: "景品画像",
    toggleLabel: "保存状態を変更",
    deadlinePlaceholder: "例：締切 10月30日"
  },

  "zh-CN": {
    tagline: "收藏所有链接，不错过喜欢的 Giveaway 💗",
    welcome: "欢迎 ✨",
    nicknameLabel: "你的昵称",
    nicknamePlaceholder: "例如：mochi / pinky",
    start: "开始使用",
    starting: "正在登录…",
    logout: "退出此空间",
    checklist: "的 Giveaway 清单",
    total: "全部",
    done: "已收藏",
    todo: "未收藏",
    addTitle: "添加新的 Giveaway",
    itemTitle: "项目名称（选填）",
    titlePlaceholder: "例如：小卡 / 专辑",
    postLink: "X / Twitter 原帖链接",
    urlPlaceholder: "https://x.com/...",
    note: "备注（选填）",
    notePlaceholder: "例如：截止日期 10 月 30 日",
    add: "＋ 添加到清单",
    myItems: "我的清单",
    all: "全部",
    filterTodo: "未收藏",
    filterDone: "已收藏",
    searchLabel: "搜索项目名称",
searchPlaceholder: "搜索 Giveaway 名称...",
searchEmpty: "没有找到匹配的项目 🔎",
    empty: "还没有项目 🌷",
    emptyHint: "在上方添加你的第一个帖子链接",
    editName: "编辑名称 ✎",
    editTitle: "编辑奖品名称：",
    edit: "编辑名称 ✎",
    delete: "删除",
    open: "打开原帖 ↗",
    saved: "为 Giveaway 收藏爱好者用心制作 💕",
    namePrompt: "编辑清单名称：",
    invalidName: "请输入至少 2 个字符",
    nameRequired: "请输入奖品名称",
    deleteConfirm: "确定删除此项目吗？",
    loading: "正在加载…",
    searching: "正在查找奖品图片…",
    addError: "请输入 x.com 或 twitter.com 帖子链接",
    loginError: "请先开始使用",
    saveError: "保存失败：",
    addItemError: "添加失败：",
    deleteError: "删除失败：",
    editError: "修改名称失败：",
    toggleError: "保存状态失败：",
    loadError: "无法加载项目：",
    connectError: "连接失败：",
    setupMissing: "尚未配置 Supabase，请查看 README.md。",
    loginFailed: "登录失败：",
    loginHint: "请确认已在 Supabase 中启用 Anonymous Sign-ins。",
    logoutConfirm: "要在此设备退出吗？匿名账户退出后可能无法恢复。",
    untitled: "未命名的 Giveaway",
    defaultTitle: "Giveaway",
    prizeImage: "奖品图片",
    toggleLabel: "切换收藏状态",
    deadlinePlaceholder: "例如：截止日期 10 月 30 日"
  },

  "zh-TW": {
    tagline: "收藏所有連結，不錯過喜歡的 Giveaway 💗",
    welcome: "歡迎 ✨",
    nicknameLabel: "你的暱稱",
    nicknamePlaceholder: "例如：mochi / pinky",
    start: "開始使用",
    starting: "正在登入…",
    logout: "離開此空間",
    checklist: "的 Giveaway 清單",
    total: "全部",
    done: "已收藏",
    todo: "未收藏",
    addTitle: "新增 Giveaway",
    itemTitle: "項目名稱（選填）",
    titlePlaceholder: "例如：小卡 / 專輯",
    postLink: "X / Twitter 原始貼文連結",
    urlPlaceholder: "https://x.com/...",
    note: "備註（選填）",
    notePlaceholder: "例如：截止日期 10 月 30 日",
    add: "＋ 加入清單",
    myItems: "我的清單",
    all: "全部",
    filterTodo: "未收藏",
    filterDone: "已收藏",
    searchLabel: "搜尋項目名稱",
searchPlaceholder: "搜尋 Giveaway 名稱...",
searchEmpty: "找不到符合的項目 🔎",
    empty: "目前沒有項目 🌷",
    emptyHint: "在上方新增第一個貼文連結",
    editName: "編輯名稱 ✎",
    editTitle: "編輯獎品名稱：",
    edit: "編輯名稱 ✎",
    delete: "刪除",
    open: "開啟原始貼文 ↗",
    saved: "為 Giveaway 收藏愛好者用心製作 💕",
    namePrompt: "編輯清單擁有者名稱：",
    invalidName: "請輸入至少 2 個字元",
    nameRequired: "請輸入獎品名稱",
    deleteConfirm: "確定要刪除此項目嗎？",
    loading: "正在載入…",
    searching: "正在尋找獎品圖片…",
    addError: "請輸入 x.com 或 twitter.com 貼文連結",
    loginError: "請先開始使用",
    saveError: "儲存失敗：",
    addItemError: "新增失敗：",
    deleteError: "刪除失敗：",
    editError: "修改名稱失敗：",
    toggleError: "儲存狀態失敗：",
    loadError: "無法載入項目：",
    connectError: "連線失敗：",
    setupMissing: "尚未設定 Supabase，請查看 README.md。",
    loginFailed: "登入失敗：",
    loginHint: "請確認已在 Supabase 啟用 Anonymous Sign-ins。",
    logoutConfirm: "要在此裝置離開嗎？匿名帳戶離開後可能無法復原。",
    untitled: "未命名的 Giveaway",
    defaultTitle: "Giveaway",
    prizeImage: "獎品圖片",
    toggleLabel: "切換收藏狀態",
    deadlinePlaceholder: "例如：截止日期 10 月 30 日"
  },

  id: {
    tagline: "Simpan semua tautan dan jangan lewatkan giveaway favorit 💗",
    welcome: "Selamat datang ✨",
    nicknameLabel: "Nama panggilan",
    nicknamePlaceholder: "mis. mochi / pinky",
    start: "Mulai",
    starting: "Sedang masuk…",
    logout: "Keluar dari halaman",
    checklist: " — Daftar Giveaway",
    total: "Total",
    done: "Tersimpan",
    todo: "Belum tersimpan",
    addTitle: "Tambah Giveaway baru",
    itemTitle: "Nama item (opsional)",
    titlePlaceholder: "mis. Photocard / Album",
    postLink: "Tautan posting asli X / Twitter",
    urlPlaceholder: "https://x.com/...",
    note: "Catatan (opsional)",
    notePlaceholder: "mis. Batas waktu: 30 Okt",
    add: "＋ Tambahkan ke daftar",
    myItems: "Daftar saya",
    all: "Semua",
    filterTodo: "Belum tersimpan",
    filterDone: "Tersimpan",
    searchLabel: "Cari nama item",
searchPlaceholder: "Cari nama giveaway...",
searchEmpty: "Tidak ada item yang cocok 🔎",
    empty: "Belum ada item 🌷",
    emptyHint: "Tambahkan tautan posting pertama di atas",
    editName: "Ubah nama ✎",
    editTitle: "Ubah nama hadiah:",
    edit: "Ubah nama ✎",
    delete: "Hapus",
    open: "Buka posting asli ↗",
    saved: "Dibuat dengan cinta untuk penggemar giveaway 💕",
    namePrompt: "Ubah nama pemilik daftar:",
    invalidName: "Masukkan minimal 2 karakter",
    nameRequired: "Masukkan nama hadiah",
    deleteConfirm: "Yakin ingin menghapus item ini?",
    loading: "Memuat daftar…",
    searching: "Mencari gambar hadiah…",
    addError: "Masukkan tautan posting x.com atau twitter.com",
    loginError: "Silakan mulai terlebih dahulu",
    saveError: "Gagal menyimpan: ",
    addItemError: "Gagal menambahkan item: ",
    deleteError: "Gagal menghapus: ",
    editError: "Gagal mengubah nama: ",
    toggleError: "Gagal menyimpan status: ",
    loadError: "Gagal memuat item: ",
    connectError: "Koneksi gagal: ",
    setupMissing: "Supabase belum dikonfigurasi. Periksa README.md.",
    loginFailed: "Gagal masuk: ",
    loginHint: "Pastikan Anonymous Sign-ins diaktifkan di Supabase.",
    logoutConfirm: "Keluar dari perangkat ini? Akun anonim mungkin tidak dapat dipulihkan.",
    untitled: "Giveaway tanpa nama",
    defaultTitle: "Giveaway",
    prizeImage: "Gambar hadiah",
    toggleLabel: "Ubah status tersimpan",
    deadlinePlaceholder: "mis. Batas waktu: 30 Okt"
  },

  vi: {
    tagline: "Lưu mọi liên kết để không bỏ lỡ giveaway yêu thích 💗",
    welcome: "Chào mừng ✨",
    nicknameLabel: "Biệt danh của bạn",
    nicknamePlaceholder: "ví dụ: mochi / pinky",
    start: "Bắt đầu",
    starting: "Đang đăng nhập…",
    logout: "Rời khỏi trang",
    checklist: " — Danh sách Giveaway",
    total: "Tổng cộng",
    done: "Đã lưu",
    todo: "Chưa lưu",
    addTitle: "Thêm Giveaway mới",
    itemTitle: "Tên mục (không bắt buộc)",
    titlePlaceholder: "ví dụ: Photocard / Album",
    postLink: "Liên kết bài đăng gốc X / Twitter",
    urlPlaceholder: "https://x.com/...",
    note: "Ghi chú (không bắt buộc)",
    notePlaceholder: "ví dụ: Hạn chót 30/10",
    add: "＋ Thêm vào danh sách",
    myItems: "Danh sách của tôi",
    all: "Tất cả",
    filterTodo: "Chưa lưu",
    filterDone: "Đã lưu",
    searchLabel: "Tìm tên mục",
searchPlaceholder: "Tìm tên giveaway...",
searchEmpty: "Không tìm thấy mục phù hợp 🔎",
    empty: "Chưa có mục nào 🌷",
    emptyHint: "Thêm liên kết bài đăng đầu tiên ở trên",
    editName: "Sửa tên ✎",
    editTitle: "Sửa tên phần quà:",
    edit: "Sửa tên ✎",
    delete: "Xóa",
    open: "Mở bài đăng gốc ↗",
    saved: "Được tạo bằng tình yêu dành cho fan giveaway 💕",
    namePrompt: "Sửa tên chủ danh sách:",
    invalidName: "Vui lòng nhập ít nhất 2 ký tự",
    nameRequired: "Vui lòng nhập tên phần quà",
    deleteConfirm: "Bạn có chắc muốn xóa mục này không?",
    loading: "Đang tải…",
    searching: "Đang tìm hình ảnh phần quà…",
    addError: "Vui lòng nhập liên kết bài đăng x.com hoặc twitter.com",
    loginError: "Vui lòng bắt đầu trước",
    saveError: "Không thể lưu: ",
    addItemError: "Không thể thêm mục: ",
    deleteError: "Không thể xóa: ",
    editError: "Không thể sửa tên: ",
    toggleError: "Không thể lưu trạng thái: ",
    loadError: "Không thể tải mục: ",
    connectError: "Kết nối thất bại: ",
    setupMissing: "Chưa cấu hình Supabase. Vui lòng xem README.md.",
    loginFailed: "Đăng nhập thất bại: ",
    loginHint: "Hãy bật Anonymous Sign-ins trong Supabase.",
    logoutConfirm: "Rời khỏi trên thiết bị này? Tài khoản ẩn danh có thể không khôi phục được.",
    untitled: "Giveaway chưa có tên",
    defaultTitle: "Giveaway",
    prizeImage: "Hình ảnh phần quà",
    toggleLabel: "Thay đổi trạng thái đã lưu",
    deadlinePlaceholder: "ví dụ: Hạn chót 30/10"
  }
};

let currentLanguage = localStorage.getItem("giveaway_language") || "th";

if (!translations[currentLanguage]) {
  currentLanguage = "th";
}

function tr(key) {
  return translations[currentLanguage]?.[key]
    ?? translations.th[key]
    ?? key;
}

function getChecklistHeading(name) {
  const headings = {
    th: `เช็กลิสต์ของ ${name} 💗`,
    en: `${name}'s Giveaway Checklist 💗`,
    ko: `${name}의 이벤트 체크리스트 💗`,
    ja: `${name}のプレゼント企画リスト 💗`,
    "zh-CN": `${name}的 Giveaway 清单 💗`,
    "zh-TW": `${name}的 Giveaway 清單 💗`,
    id: `${name} — Daftar Giveaway 💗`,
    vi: `${name} — Danh sách Giveaway 💗`
  };

  return headings[currentLanguage] || headings.th;
}

function msg(text = "") {
  const element = $("statusMessage");
  if (element) element.textContent = text;
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    const allowedHosts = [
      "x.com",
      "www.x.com",
      "twitter.com",
      "www.twitter.com"
    ];

    if (!["https:", "http:"].includes(url.protocol)) return null;
    if (!allowedHosts.includes(url.hostname.toLowerCase())) return null;

    return url.href;
  } catch {
    return null;
  }
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
    console.error("Unable to retrieve X image:", error);
    return null;
  }
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;

  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  setText(".sub", tr("tagline"));
  setText("#loginPanel h2", tr("welcome"));
  setText('#loginPanel label[for="nickname"]', tr("nicknameLabel"));
  setText("#startBtn", busy ? tr("starting") : tr("start"));
  setText("#logoutBtn", tr("logout"));
  setText(".stats .stat:nth-child(1) span", tr("total"));
  setText(".stats .stat:nth-child(2) span", tr("done"));
  setText(".stats .stat:nth-child(3) span", tr("todo"));
  setText(".add-form h3", tr("addTitle") + " ✿");
  setText('label[for="postTitle"]', tr("itemTitle"));
  setText('label[for="postUrl"]', tr("postLink"));
  setText('label[for="postNote"]', tr("note"));
  setText('#addForm button[type="submit"]', tr("add"));
  setText(".list-head h3", tr("myItems"));
  setText("#searchLabel", tr("searchLabel"));

const searchInput = $("searchInput");
if (searchInput) {
  searchInput.placeholder = tr("searchPlaceholder");
}
  setText("#emptyState", tr("empty") + "\n" + tr("emptyHint"));
  setText("footer", tr("saved"));

  const nicknameInput = $("nickname");
  const titleInput = $("postTitle");
  const urlInput = $("postUrl");
  const noteInput = $("postNote");

  if (nicknameInput) nicknameInput.placeholder = tr("nicknamePlaceholder");
  if (titleInput) titleInput.placeholder = tr("titlePlaceholder");
  if (urlInput) urlInput.placeholder = tr("urlPlaceholder");
  if (noteInput) noteInput.placeholder = tr("notePlaceholder");

  const filter = $("filter");

  if (filter && filter.options.length >= 3) {
    filter.options[0].text = tr("all");
    filter.options[1].text = tr("filterTodo");
    filter.options[2].text = tr("filterDone");
    filter.setAttribute("aria-label", tr("myItems"));
  }

  const editNameBtn = $("editNicknameBtn");
  if (editNameBtn) editNameBtn.textContent = tr("editName");

  if (nickname && $("userHeading")) {
    $("userHeading").textContent = getChecklistHeading(nickname);
  }

  if (typeof render === "function" && $("items") && filter) {
    render();
  }
}


const languageSelect = $("languageSelect");

if (languageSelect) {
  languageSelect.value = currentLanguage;

  languageSelect.addEventListener("change", () => {
    currentLanguage = translations[languageSelect.value]
      ? languageSelect.value
      : "th";

    localStorage.setItem("giveaway_language", currentLanguage);
    applyLanguage();
    render();
  });
}


if (configured && window.supabase) {
  db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  $("setupNotice")?.classList.remove("hidden");
}

function showTracker(name) {
  nickname = name;

  $("loginPanel")?.classList.add("hidden");
  $("tracker")?.classList.remove("hidden");

  const heading = $("userHeading");

  if (heading) {
    heading.textContent = getChecklistHeading(name);
  }

  let editNameBtn = $("editNicknameBtn");

  if (!editNameBtn && heading) {
    editNameBtn = document.createElement("button");
    editNameBtn.id = "editNicknameBtn";
    editNameBtn.className = "light small-btn";
    editNameBtn.style.marginTop = "8px";

    editNameBtn.addEventListener("click", () => {
      const newName = prompt(tr("namePrompt"), nickname);
      if (newName === null) return;

      const trimmedName = newName.trim();

      if (trimmedName.length < 2) {
        alert(tr("invalidName"));
        return;
      }

      nickname = trimmedName;
      localStorage.setItem("giveaway_nickname", trimmedName);

      if (heading) {
        heading.textContent = getChecklistHeading(trimmedName);
      }
    });

    heading.insertAdjacentElement("afterend", editNameBtn);
  }

  if (editNameBtn) editNameBtn.textContent = tr("editName");
  applyLanguage();
}

async function init() {
  if (!db) return;

  try {
    const { data, error } = await db.auth.getSession();
    if (error) throw error;

    const session = data?.session;

    if (session) {
      currentUser = session.user;
      const savedName = localStorage.getItem("giveaway_nickname") || "เพื่อน";
      showTracker(savedName);
      await loadItems();
    }
  } catch (error) {
    msg(tr("connectError") + error.message);
  }
}

$("startBtn")?.addEventListener("click", async () => {
  if (busy) return;

  const name = $("nickname")?.value.trim() || "";

  if (name.length < 2) {
    alert(tr("invalidName"));
    return;
  }

  if (!db) {
    alert(tr("setupMissing"));
    return;
  }

  busy = true;
  applyLanguage();

  try {
    // Reuse the existing anonymous session if one is already active.
    const { data: sessionData, error: sessionError } =
      await db.auth.getSession();

    if (sessionError) throw sessionError;

    let user = sessionData?.session?.user;

    if (!user) {
      const { data, error } = await db.auth.signInAnonymously();
      if (error) throw error;
      user = data.user;
    }

    currentUser = user;
    localStorage.setItem("giveaway_nickname", name);

    showTracker(name);
    await loadItems();
  } catch (error) {
    alert(
      tr("loginFailed") + error.message + "\n" + tr("loginHint")
    );
  } finally {
    busy = false;
    applyLanguage();
  }
});

$("logoutBtn")?.addEventListener("click", () => {
  if (!confirm(tr("logoutConfirm"))) return;

  // Keep the anonymous session on this device so it can be reused.
  $("tracker")?.classList.add("hidden");
  $("loginPanel")?.classList.remove("hidden");

  const nicknameInput = $("nickname");
  if (nicknameInput) nicknameInput.value = "";

  currentUser = null;
  allItems = [];
  msg("");
  render();
});

async function loadItems() {
  if (!db || !currentUser) return;

  msg(tr("loading"));

  const { data, error } = await db
    .from("giveaway_items")
    .select("*")
    .eq("owner_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (error) {
    msg(tr("loadError") + error.message);
    return;
  }

  allItems = data || [];
  render();
  msg("");
}

function render() {
  const itemsElement = $("items");
  const filterElement = $("filter");
  const emptyState = $("emptyState");

  if (!itemsElement || !filterElement || !emptyState) return;

  const doneCount = allItems.filter(item => item.is_done).length;

  if ($("totalCount")) $("totalCount").textContent = allItems.length;
  if ($("doneCount")) $("doneCount").textContent = doneCount;
  if ($("todoCount")) {
    $("todoCount").textContent = allItems.length - doneCount;
  }

 const filter = filterElement.value;
const searchTerm = ($("searchInput")?.value || "")
  .trim()
  .toLocaleLowerCase();

const rows = allItems.filter(item => {
  const matchesFilter =
    filter === "all" ||
    (filter === "done" ? item.is_done : !item.is_done);

  const title = (item.title || tr("untitled"))
    .toLocaleLowerCase();

  const matchesSearch = title.includes(searchTerm);

  return matchesFilter && matchesSearch;
});

itemsElement.innerHTML = "";

emptyState.classList.toggle("hidden", rows.length !== 0);

if (rows.length === 0) {
  if (allItems.length === 0) {
    emptyState.textContent = tr("empty") + "\n" + tr("emptyHint");
  } else {
    emptyState.textContent = searchTerm
      ? tr("searchEmpty")
      : tr("empty");
  }
}

  rows.forEach(item => {
    const article = document.createElement("article");
    article.className = "item" + (item.is_done ? " done" : "");
    article.style.padding = "14px";

    const layout = document.createElement("div");
    layout.style.display = "flex";
    layout.style.alignItems = "flex-start";
    layout.style.gap = "12px";
    layout.style.width = "100%";

    if (item.image_url) {
      const imageBox = document.createElement("div");
      imageBox.style.flex = "0 0 105px";
      imageBox.style.width = "105px";
      imageBox.style.maxWidth = "35%";

      const image = document.createElement("img");
      image.src = item.image_url;
      image.alt = item.title || tr("prizeImage");
      image.loading = "lazy";
      image.style.display = "block";
      image.style.width = "100%";
      image.style.height = "125px";
      image.style.objectFit = "contain";
      image.style.borderRadius = "10px";

      image.addEventListener("error", () => imageBox.remove());

      imageBox.append(image);
      layout.append(imageBox);
    }

    const details = document.createElement("div");
    details.style.flex = "1";
    details.style.minWidth = "0";

    const top = document.createElement("div");
    top.style.display = "flex";
    top.style.alignItems = "flex-start";
    top.style.gap = "8px";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "check";
    checkbox.checked = Boolean(item.is_done);
    checkbox.setAttribute("aria-label", tr("toggleLabel"));
    checkbox.addEventListener("change", () => {
      toggleItem(item.id, checkbox.checked);
    });

    const textBox = document.createElement("div");
    textBox.style.flex = "1";
    textBox.style.minWidth = "0";

    const title = document.createElement("div");
    title.className = "item-title";
    title.textContent = item.title || tr("untitled");
    title.style.overflowWrap = "anywhere";

    const postUrl = safeUrl(item.post_url);
    const link = document.createElement("a");
    link.className = "item-url";
    link.textContent = item.post_url || "";
    link.style.overflowWrap = "anywhere";

    if (postUrl) {
      link.href = postUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.removeAttribute("href");
    }

    textBox.append(title, link);
    top.append(checkbox, textBox);
    details.append(top);
    layout.append(details);
    article.append(layout);

    if (item.note) {
      const note = document.createElement("div");
      note.className = "note";
      note.textContent = "✎ " + item.note;
      note.style.marginTop = "10px";
      article.append(note);
    }

    const actions = document.createElement("div");
    actions.className = "item-actions";
    actions.style.display = "flex";
    actions.style.flexWrap = "wrap";
    actions.style.gap = "8px";
    actions.style.marginTop = "12px";

    const open = document.createElement("button");
    open.className = "open-link";
    open.textContent = tr("open");
    open.disabled = !postUrl;
    open.addEventListener("click", () => {
      if (postUrl) window.open(postUrl, "_blank", "noopener,noreferrer");
    });

    const edit = document.createElement("button");
    edit.className = "open-link";
    edit.textContent = tr("edit");
    edit.addEventListener("click", () => editItem(item.id));

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = tr("delete");
    del.addEventListener("click", () => deleteItem(item.id));

    actions.append(open, edit, del);
    article.append(actions);
    itemsElement.append(article);
  });
}

async function editItem(id) {
  if (!db || !currentUser) {
    alert(tr("loginError"));
    return;
  }

  const item = allItems.find(entry => entry.id === id);
  if (!item || item.owner_id !== currentUser.id) return;

  const newTitle = prompt(tr("editTitle"), item.title || "");
  if (newTitle === null) return;

  const title = newTitle.trim();

  if (!title) {
    alert(tr("nameRequired"));
    return;
  }

  if (title === item.title) return;

  const { error } = await db
    .from("giveaway_items")
    .update({ title })
    .eq("id", id)
    .eq("owner_id", currentUser.id);

  if (error) {
    alert(tr("editError") + error.message);
    return;
  }

  item.title = title;
  render();
}

async function toggleItem(id, value) {
  if (!db || !currentUser) {
    alert(tr("loginError"));
    return;
  }

  const item = allItems.find(entry => entry.id === id);
  if (!item || item.owner_id !== currentUser.id) return;

  const { error } = await db
    .from("giveaway_items")
    .update({ is_done: value })
    .eq("id", id)
    .eq("owner_id", currentUser.id);

  if (error) {
    alert(tr("toggleError") + error.message);
    await loadItems();
    return;
  }

  item.is_done = value;
  render();
}

$("addForm")?.addEventListener("submit", async event => {
  event.preventDefault();

  if (!db || !currentUser) {
    alert(tr("loginError"));
    return;
  }

  const postUrl = safeUrl($("postUrl")?.value.trim() || "");

  if (!postUrl) {
    alert(tr("addError"));
    return;
  }

  const title = $("postTitle")?.value.trim() || "";
  const note = $("postNote")?.value.trim() || "";

  msg(tr("searching"));

  const imageUrl = await getXImageUrl(postUrl);

  const { error } = await db.from("giveaway_items").insert({
    owner_id: currentUser.id,
    title: title || tr("defaultTitle"),
    post_url: postUrl,
    note,
    image_url: imageUrl,
    is_done: false
  });

  if (error) {
    alert(tr("addItemError") + error.message);
    msg("");
    return;
  }

  $("addForm").reset();
  await loadItems();
});

async function deleteItem(id) {
  if (!db || !currentUser) {
    alert(tr("loginError"));
    return;
  }

  const item = allItems.find(entry => entry.id === id);
  if (!item || item.owner_id !== currentUser.id) return;

  if (!confirm(tr("deleteConfirm"))) return;

  const { error } = await db
    .from("giveaway_items")
    .delete()
    .eq("id", id)
    .eq("owner_id", currentUser.id);

  if (error) {
    alert(tr("deleteError") + error.message);
    return;
  }

  allItems = allItems.filter(entry => entry.id !== id);
  render();
}

$("filter")?.addEventListener("change", render);
$("searchInput")?.addEventListener("input", render);

/* ===== Custom Theme Settings ===== */
const themeDefaults = {
  bg: "#fff7fb",
  accent: "#e879a8",
  card: "#ffffff"
};

const themeKeys = {
  bg: "giveaway_theme_bg",
  accent: "giveaway_theme_accent",
  card: "giveaway_theme_card",
  image: "giveaway_theme_image"
};

function applyTheme() {
  const bg = localStorage.getItem(themeKeys.bg) || themeDefaults.bg;
  const accent = localStorage.getItem(themeKeys.accent) || themeDefaults.accent;
  const card = localStorage.getItem(themeKeys.card) || themeDefaults.card;
  const image = localStorage.getItem(themeKeys.image);

  const root = document.documentElement;
  root.style.setProperty("--theme-bg", bg);
  root.style.setProperty("--theme-accent", accent);
  root.style.setProperty("--theme-card", card);

  if (image) {
    root.style.setProperty("--theme-bg-image", `url("${image}")`);
  } else {
    root.style.removeProperty("--theme-bg-image");
  }

  const bgPicker = $("themeBg");
  const accentPicker = $("themeAccent");
  const cardPicker = $("themeCard");

  if (bgPicker) bgPicker.value = bg;
  if (accentPicker) accentPicker.value = accent;
  if (cardPicker) cardPicker.value = card;
}

function saveThemeColor(inputId, storageKey) {
  const input = $(inputId);
  if (!input) return;

  input.addEventListener("input", () => {
    localStorage.setItem(storageKey, input.value);
    applyTheme();
  });
}

saveThemeColor("themeBg", themeKeys.bg);
saveThemeColor("themeAccent", themeKeys.accent);
saveThemeColor("themeCard", themeKeys.card);

$("themeImage")?.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("กรุณาเลือกไฟล์รูปภาพ");
    event.target.value = "";
    return;
  }

  // จำกัดขนาดเพื่อป้องกัน localStorage เต็ม
  if (file.size > 1024 * 1024) {
    alert("กรุณาเลือกรูปขนาดไม่เกิน 1 MB");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    try {
      localStorage.setItem(themeKeys.image, reader.result);
      applyTheme();
    } catch (error) {
      alert("บันทึกรูปไม่ได้ พื้นที่จัดเก็บในเบราว์เซอร์อาจเต็ม");
    }
  };

  reader.readAsDataURL(file);
});

$("resetTheme")?.addEventListener("click", () => {
  Object.values(themeKeys).forEach(key => localStorage.removeItem(key));

  const imageInput = $("themeImage");
  if (imageInput) imageInput.value = "";

  applyTheme();
});

applyTheme();

applyLanguage();
init();
