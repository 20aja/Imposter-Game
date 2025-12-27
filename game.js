// =================================
// UI:  شاشة البداية
// =================================
setTimeout(function () {
  document.querySelector(".startScreen").style.opacity = "0";
  setTimeout(function () {
    document.querySelector(".startScreen").remove();
  }, 1000);
}, 3000);
// =================================
// UI:  الفئات
// =================================
const items = document.querySelectorAll(".types li");
const savedActive = JSON.parse(localStorage.getItem("activeItems")) || [];
savedActive.forEach((index) => {
  if (items[index]) {
    items[index].classList.add("active");
  }
});

items.forEach((item, index) => {
  item.addEventListener("click", () => {
    item.classList.toggle("active");
    // تحديث قائمة العناصر المفعلة
    const activeItems = [];
    items.forEach((el, i) => {
      if (el.classList.contains("active")) {
        activeItems.push(i); // نخزن الفهرس (index) لكل عنصر مفعّل
      }
    });

    // حفظها بالـ localStorage
    localStorage.setItem("activeItems", JSON.stringify(activeItems));
  });
});

const btn = document.getElementById("toggleBtn");
const hiddenItems = document.querySelectorAll(".types .hidden");
let expanded = false;
btn.addEventListener("click", () => {
  hiddenItems.forEach((item) => {
    item.style.display = expanded ? "none" : "inline-block";
  });
  btn.textContent = expanded ? "المزيد" : "إخفاء";
  expanded = !expanded;
});

// =================================
// UI: تغيير المود
// =================================
let mode = localStorage.getItem("Mode") || "night";
if (mode === "day") {
  document.body.classList.add("changeMode");
} else {
  document.body.classList.remove("changeMode");
}
document.querySelector(".mode").addEventListener("click", function () {
  if (mode === "night") {
    document.body.classList.add("changeMode");
    localStorage.setItem("Mode", "day");
    mode = "day";
  } else if (mode === "day") {
    document.body.classList.remove("changeMode");
    localStorage.setItem("Mode", "night");
    mode = "night";
  }
});
// =================================
// UI: عرض وإخفاء صندوق تعديل اللاعبين
// =================================
document.querySelector(".addPLAYERS").onclick = function () {
  document.querySelector(".box").classList.toggle("hidee")
};
document.querySelector(".closed").onclick = function () {
  document.querySelector(".box").classList.remove("hidee")
};

// show Note
document.querySelector(".notes").onclick = () => {
  document.querySelector(".showNotes").classList.toggle("hidee")
};
document.querySelector(".closNote").onclick = () => {
  document.querySelector(".showNotes").classList.remove("hidee")
};

// // =================================
// // UI: قلب الكرت باللمس (اضغط واستمر)
// // =================================
const flippedBox = document.querySelector(".flippedBox");
flippedBox.addEventListener("touchstart", function () {
  flippedBox.classList.add("flip");
});
flippedBox.addEventListener("touchend", function () {
  flippedBox.classList.remove("flip");
});

// // =================================
// // عناصر DOM
// // =================================
const addButton = document.querySelector(".addButton");
const playerTXT = document.querySelector(".playerTXT");
const playersList = document.querySelector(".playersList");
const startBtn = document.querySelector(".start");
const nextBtn = document.querySelector(".next");
const frontFace = document.querySelector(".front");
const backFace = document.querySelector(".back");
const frontName = document.querySelector(".front h1");
const backWord = document.querySelector(".back h2");
const ul = document.querySelector(".ul");
const guessingBegan = document.querySelector(".guessing-began");
const dataDisclosure = document.querySelector(".dataDisclosure");
const startingOver = document.querySelector(".startingOver");
const startingOver2 = document.querySelector(".startingOver2");
const disclosure = document.querySelector(".disclosure");
let imposterNAME = [];
let keyNAME;
let counT = 1;

// =================================
// ألوان اللاعبين
// =================================
const colors = [
  "#ffff50ff",
  "#7aff52ff",
  "#ffa74fff",
  "#80ffaaff",
  "#60afffff",
  "#9966B2",
  "#66B2CC",
  "#de7cffff",
  "#80BFA6",
  "#CC8088",
  "#CC9966",
  "#999999",
  "#8099A6",
  "#B2B266",
  "#99CC80",
  "#669999",
  "#CC9966",
  "#CC8080",
  "#9966CC",
];

// جلب الفئات المختارة من واجهة HTML
function getSelectedCategories() {
  let selected = [];
  let test = document.querySelectorAll(".types li");

  test.forEach(function (el) {
    if (el.classList.contains("active")) {
      let categoryName = el.getAttribute("data-category");
      selected.push(categoryName);
    }
  });
  return selected;
}

// بناء قائمة الكلمات والتلميحات من الفئات المختارة
function getWordsFromSelected() {
  let selectedCategories = getSelectedCategories();
  let wordsPool = [];

  selectedCategories.forEach((cat) => {
    if (categoriesWords[cat]) {
      categoriesWords[cat].words.forEach((word, i) => {
        wordsPool.push({
          word: word,
          hint: categoriesWords[cat].hints[i],
          category: cat,
        });
      });
    }
  });

  return wordsPool;
}

// جلب كلمة عشوائية من الفئات المختارة
function getRandomWord() {
  let pool = getWordsFromSelected();
  if (pool.length === 0) return null;
  let randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

// تحديد الكلمة والتلميح
let hint;
let word;
function startGame() {
  let randomItem = getRandomWord();
  if (randomItem) {
    hint = randomItem.hint;
    word = randomItem.word;
  }
}
startGame();
document.querySelectorAll(".types li").forEach((el) => {
  el.addEventListener("click", () => {
    startGame();
  });
});
// =================================
// حالة اللعبة (State)
// =================================
let namesOfplayers = JSON.parse(localStorage.getItem("NAMESp") || "[]");
let impostersCount = 1; // عدد المحتالين المختار
let imposters = []; // اندكسات المحتالين
let currentIndex = 0; // اللاعب الحالي
let commonKey = ""; // الكلمة الموحدة (لغير المحتالين)
let imposterValue = ""; // الكلمة الخاصة (للمحتالين)
const gameBox = document.querySelector(".game-starter-box");

// =================================
// اختيار عدد المحتالين من الراديو
// =================================
document.querySelector(".count-imposter").addEventListener("change", () => {
  const value = document.querySelector('input[name="option"]:checked').value;
  impostersCount = +value;
  counT = +value;
});

// =================================
// عرض اللاعبين في واجهة التعديل وواجهة العد
// =================================
function renderPlayers() {
  ul.innerHTML = "";
  playersList.innerHTML = "";

  namesOfplayers.forEach((name, i) => {
    ul.innerHTML += `
      <li>
        <input class="player" type="text" value="${name}" data-index="${i}" />
        <i class="fa-solid fa-pen edit" data-edit="${i}"></i>
        <i class="fa-solid fa-times del" data-del="${i}"></i>
      </li>
    `;
    playersList.innerHTML += `
      <li>${name} <i class="fa-solid fa-times fa-0 del" data-del="${i}"></i></li>
    `;
  });
}
renderPlayers();

// =================================
// إضافة لاعب
// =================================
addButton.onclick = function () {
  const name = playerTXT.value.trim();
  if (name) {
    namesOfplayers.push(name);
    playerTXT.value = "";
    localStorage.setItem("NAMESp", JSON.stringify(namesOfplayers));
    renderPlayers();
    playerTXT.style.borderColor = "#22c55e";
  } else {
    playerTXT.style.borderColor = "red";
    setTimeout(() => (playerTXT.style.borderColor = "#22c55e"), 2000);
  }
  playerTXT.focus();
};

// =================================
// حذف وتحرير لاعب (تفويض أحداث)
// =================================
document.addEventListener("click", (e) => {
  // حذف
  const delIndex = e.target.getAttribute("data-del");
  if (delIndex !== null) {
    namesOfplayers.splice(+delIndex, 1);
    localStorage.setItem("NAMESp", JSON.stringify(namesOfplayers));
    renderPlayers();
    return;
  }
  // تحرير
  const editIndex = e.target.getAttribute("data-edit");
  if (editIndex !== null) {
    const input = ul.querySelector(`input[data-index="${editIndex}"]`);
    if (input) {
      input.focus();
      input.select();
    }
  }
});

// حفظ التعديلات عند تغيير النص
ul.addEventListener("input", (e) => {
  const input = e.target;
  if (input.classList.contains("player")) {
    const idx = +input.getAttribute("data-index");
    namesOfplayers[idx] = input.value.trim();
    localStorage.setItem("NAMESp", JSON.stringify(namesOfplayers));
    renderPlayers();
  }
});

// =================================
// أدوات مساعدة
// =================================
function uniqueRandomIndices(length, count) {
  const set = new Set();
  while (set.size < Math.min(count, length)) {
    set.add(Math.floor(Math.random() * length));
  }
  return [...set];
}

function pickRandomWordPair() {
  const entries = Object.entries(allWords);
  const r = Math.floor(Math.random() * entries.length);
  const [key, value] = entries[r];
  return {key, value};
}

// =================================
// عرض اللاعب الحالي على الكرت
// =================================

// حذف أو إضافة تلميح
const hintEl = document.querySelector(".hint");
const iconEl = document.querySelector(".hint i");

let hintCase = JSON.parse(localStorage.getItem("hintCase") ?? "true");

function renderHintState() {
  if (hintCase) {
    hintEl.classList.remove("check");
    iconEl.classList.add("fa-check");
    iconEl.classList.remove("fa-times");
  } else {
    hintEl.classList.add("check");
    iconEl.classList.remove("fa-check");
    iconEl.classList.add("fa-times");
  }
}

// 3) دالة حفظ الحالة
function saveHintState() {
  localStorage.setItem("hintCase", JSON.stringify(hintCase));
}

// 4) تطبيق الحالة عند التحميل
renderHintState();

// 5) التبديل عند النقر (flip) ثم العرض والحفظ
hintEl.addEventListener("click", () => {
  hintCase = !hintCase; // عكس الحالة
  renderHintState(); // تحديث الواجهة
  saveHintState(); // حفظ التخزين
});

function showPlayer(index) {
  const name = namesOfplayers[index];
  const color = colors[index % colors.length];
  frontName.textContent = name;
  frontFace.style.backgroundColor = color;
  backFace.style.backgroundColor = color;

  // إذا اللاعب محتـال → يعرض كلمة Imposter فوق التلميح
  const isImposter = imposters.includes(index);
  backWord.textContent = isImposter
    ? `أنت Imposter - ${hintCase === true ? hint : ""}`
    : word;

  // تمييز بصري للمحتال
  //   backFace.classList.toggle("imposter-card", isImposter);
}

// =================================
// بدء اللعبة
// =================================
function errors(error) {
  let interval = setInterval(function () {
    document.querySelector(`.notifications${error}`).style.opacity = "1";
    document.querySelector(`.notifications${error}`).style.zIndex = "1";
  }, 100);
  setTimeout(() => {
    clearInterval(interval);
    document.querySelector(`.notifications${error}`).style.opacity = "0";
    document.querySelector(`.notifications${error}`).style.zIndex = "0";
  }, 2000);
}

startBtn.onclick = function () {
  if (namesOfplayers.length < 3) {
    errors(1);
    return;
  }
  if (getWordsFromSelected().length === 0) {
    errors(2);
    return;
  }

  // اختيار المحتالين حسب العدد المختار بدون تكرار
  imposters = uniqueRandomIndices(namesOfplayers.length, impostersCount);

  // تهيئة المؤشر والواجهة
  currentIndex = 0;
  gameBox.classList.add("go");
  showPlayer(currentIndex);
};

// =================================
// اللاعب التالي
// =================================
nextBtn.onclick = function () {
  currentIndex++;
  if (currentIndex < namesOfplayers.length) {
    showPlayer(currentIndex);
  } else {
    // نهاية اللعبة
    gameBox.classList.remove("go");
    guessingBegan.classList.add("go");
    document.querySelector(".startWith").textContent =
      namesOfplayers[Math.floor(Math.random() * namesOfplayers.length)];

    // اطبع أسماء المحتالين في الكونسول
    imposters.forEach((idx) => {
      imposterNAME.push(namesOfplayers[idx]);
    });
  }
};
disclosure.onclick = () => {
  guessingBegan.classList.remove("go");
  document.querySelector(".dataDisclosure").classList.add("go");
  document.querySelector(".dataDisclosure .showWord").textContent = word;
  if (counT == 1) {
    document.querySelector(".impostername").textContent = imposterNAME[0];
  } else if (counT == 2) {
    document.querySelector(
      ".impostername"
    ).textContent = `${imposterNAME[0]} و ${imposterNAME[1]}`;
  } else {
    document.querySelector(
      ".impostername"
    ).textContent = `${imposterNAME[0]} و ${imposterNAME[1]} و ${imposterNAME[2]}`;
  }
};

// البدأ من جديد
startingOver.onclick = () => {
  dataDisclosure.classList.remove("go");
  guessingBegan.classList.remove("go");
  startGame();
};
startingOver2.onclick = () => {
  dataDisclosure.classList.remove("go");
  guessingBegan.classList.remove("go");
  startGame();
};
