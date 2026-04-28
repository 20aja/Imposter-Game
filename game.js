//شاشة البداية

setTimeout(function () {
  document.querySelector(".startScreen").style.opacity = "0";
  setTimeout(function () {
    document.querySelector(".startScreen").remove();
  }, 1000);
}, 3000);

//الفئات

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

// UI: تغيير المود

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

// UI: عرض وإخفاء صندوق تعديل اللاعبين

document.querySelector(".addPLAYERS").onclick = function () {
  document.querySelector(".box").classList.toggle("hidee");
};
document.querySelector(".box h3").onclick = function () {
  document.querySelector(".box").classList.remove("hidee");
};
document.querySelector(".closed").onclick = function () {
  document.querySelector(".box").classList.remove("hidee");
};

// show Note
document.querySelector(".notes").onclick = () => {
  document.querySelector(".showNotes").classList.toggle("hidee");
};
document.querySelector(".closNote").onclick = () => {
  document.querySelector(".showNotes").classList.remove("hidee");
};

// قلب الكرت باللمس (اضغط واستمر)
const flippedBox = document.querySelector(".flippedBox");
flippedBox.addEventListener("touchstart", function () {
  document.getElementById("showsund").currentTime = 0;
  document.getElementById("showsund").play();
  flippedBox.classList.add("flip");
});
flippedBox.addEventListener("touchend", function () {
  document.getElementById("flipsund").currentTime = 0;
  document.getElementById("flipsund").play();
  flippedBox.classList.remove("flip");
});

// عناصر DOM
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
const disclosure = document.querySelector(".disclosure");
let imposterNAME = [];
let keyNAME;
let create_or_update = "create";
let updateIndex;

// ألوان اللاعبين

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
  let categories = document.querySelectorAll(".types li");
  categories.forEach(function (el) {
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

// حالة اللعبة (State)

let namesOfplayers = JSON.parse(localStorage.getItem("NAMES") || "[]");
let impostersCount = 1; // عدد المحتالين المختار
let imposters = []; // اندكسات المحتالين
let currentIndex = 0; // اللاعب الحالي
let commonKey = ""; // الكلمة الموحدة (لغير المحتالين)
let imposterValue = ""; // الكلمة الخاصة (للمحتالين)
const gameBox = document.querySelector(".game-starter-box");

// اختيار عدد المحتالين من الراديو
document.querySelector(".count-imposter").addEventListener("change", () => {
  const value = document.querySelector('input[name="option"]:checked').value;
  impostersCount = +value;
});

// عرض اللاعبين في واجهة التعديل وواجهة العد

function renderPlayers() {
  ul.innerHTML = "";
  playersList.innerHTML = "";

  namesOfplayers.forEach((name, i) => {
    ul.innerHTML += `
      <li>
        <input class="player" type="text" value="${i + 1}. ${name}" data-index="${i}" disabled/>
        <i class="fa-solid fa-pen edit" id="${i}" onclick="editPlayer(${i})"></i>
        <i class="fa-solid fa-times del" onclick="deletePlayer(${i})"></i>
      </li>
    `;
    playersList.innerHTML += `
      <li>${name} <i class="fa-solid fa-times" onclick="deletePlayer(${i})"></i></li>
    `;
  });
}
renderPlayers();

// إضافة لاعب

addButton.onclick = function () {
  const name = playerTXT.value.trim();
  if (create_or_update === "create") {
    if (name) {
      namesOfplayers.push(name);
      playerTXT.value = "";
      localStorage.setItem("NAMES", JSON.stringify(namesOfplayers));
      renderPlayers();
      playerTXT.style.borderColor = "#006492";
    } else {
      playerTXT.style.borderColor = "#db0000";
      setTimeout(() => (playerTXT.style.borderColor = "#006492"), 2000);
    }
  } else {
    if (name) {
      create_or_update = "create";
      namesOfplayers[updateIndex] = playerTXT.value;
      localStorage.setItem("NAMES", JSON.stringify(namesOfplayers));
      document.querySelector(".addButton i").classList.remove("fa-check");
      playerTXT.value = "";
      renderPlayers();
    }
  }
  playerTXT.focus();
};

// حذف لاعب
function deletePlayer(i) {
  namesOfplayers.splice(i, 1);
  localStorage.setItem("NAMES", JSON.stringify(namesOfplayers));
  renderPlayers();
}
// تحرير لاعب
function editPlayer(i) {
  updateIndex = i;
  create_or_update = "update";
  document.querySelector(".addButton i").classList.add("fa-check");
  document.getElementById(`${i}`).style.transform = "rotate(45deg)";
  document.getElementById(`${i}`).style.top = "25%";
  playerTXT.value = namesOfplayers[i];
  playerTXT.focus();
}

// أدوات مساعدة

function uniqueRandomIndices(length, count) {
  const set = new Set();
  while (set.size < Math.min(count, length)) {
    set.add(Math.floor(Math.random() * length));
  }
  return [...set];
}
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
  backWord.textContent = isImposter ? `أنت Imposter - ${hintCase === true ? hint : ""}` : word;
}

// بدء اللعبة

function errors(error) {
  let interval = setInterval(function () {
    document.querySelector(`.error-box${error}`).classList.add("hidee");
  }, 100);
  setTimeout(() => {
    clearInterval(interval);
    document.querySelector(`.error-box${error}`).classList.remove("hidee");
  }, 2000);
}

startBtn.onclick = function () {
  if (namesOfplayers.length < 3 || namesOfplayers.length > 20) {
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

// اللاعب التالي

nextBtn.onclick = function () {
  document.getElementById("passing").currentTime = 0;
  document.getElementById("passing").play();
  currentIndex++;
  if (currentIndex < namesOfplayers.length) {
    showPlayer(currentIndex);
  } else {
    // نهاية اللعبة
    gameBox.classList.remove("go");
    guessingBegan.classList.add("goGuessing");
    document.querySelector(".startWith").textContent = namesOfplayers[Math.floor(Math.random() * namesOfplayers.length)];
    // اطبع أسماء المحتالين في الكونسول
    imposters.forEach((idx) => {
      imposterNAME.push(`( ${namesOfplayers[idx]} )`);
    });
  }
};
disclosure.onclick = () => {
  guessingBegan.classList.remove("goGuessing");
  document.querySelector(".dataDisclosure").classList.add("go");
  document.querySelector(".dataDisclosure .showWord").textContent = `( ${word} )`;
  if (impostersCount) {
    document.querySelector(".impostername").textContent = imposterNAME.join(" ");
  }
};

// البدأ من جديد

document.querySelectorAll(".startingOver").forEach((btn) => {
  btn.addEventListener("click", () => {
    dataDisclosure.classList.remove("go");
    guessingBegan.classList.remove("goGuessing");
    imposterNAME = [];
    startGame();
  });
});

// delete all
document.querySelector(".delAll").onclick = () => {
  if (localStorage.length > 0) {
    let delprompt = confirm("هل أنت متأكد من حذف جميع البيانات؟!");
    if (delprompt) {
      localStorage.clear();
      location.reload();
    }
  }
};
