// 20 道小學基礎英文單字題庫（每次隨機抽選 5 題）
let questionBank = [
  { word: "P E N C I L", displayWord: "P E N C _ L", correctAnswer: "I", options: ["I", "E", "A", "O"], iconType: "pencil" },
  { word: "C A T", displayWord: "C _ T", correctAnswer: "A", options: ["A", "E", "O", "U"], iconType: "cat" },
  { word: "S U N", displayWord: "S _ N", correctAnswer: "U", options: ["A", "U", "I", "O"], iconType: "sun" },
  { word: "D O G", displayWord: "D _ G", correctAnswer: "O", options: ["E", "A", "O", "I"], iconType: "dog" },
  { word: "B O O K", displayWord: "B _ O K", correctAnswer: "O", options: ["A", "O", "E", "U"], iconType: "book" },
  { word: "S T A R", displayWord: "S T _ R", correctAnswer: "A", options: ["E", "I", "A", "O"], iconType: "star" },
  { word: "F I S H", displayWord: "F _ S H", correctAnswer: "I", options: ["I", "E", "A", "U"], iconType: "fish" },
  { word: "B A L L", displayWord: "B _ L L", correctAnswer: "A", options: ["E", "A", "I", "O"], iconType: "ball" },
  { word: "B I R D", displayWord: "B _ R D", correctAnswer: "I", options: ["O", "I", "E", "A"], iconType: "bird" },
  { word: "D U C K", displayWord: "D _ C K", correctAnswer: "U", options: ["A", "E", "U", "I"], iconType: "duck" },
  { word: "C A R", displayWord: "C _ R", correctAnswer: "A", options: ["A", "E", "O", "U"], iconType: "car" },
  { word: "A P P L E", displayWord: "A P P L _", correctAnswer: "E", options: ["E", "A", "I", "O"], iconType: "apple" },
  { word: "T R E E", displayWord: "T R _ E", correctAnswer: "E", options: ["E", "A", "I", "U"], iconType: "tree" },
  { word: "F L O W E R", displayWord: "F L O W _ R", correctAnswer: "E", options: ["E", "A", "O", "I"], iconType: "flower" },
  { word: "C A K E", displayWord: "C _ K E", correctAnswer: "A", options: ["A", "E", "O", "I"], iconType: "cake" },
  { word: "M O O N", displayWord: "M _ O N", correctAnswer: "O", options: ["U", "O", "A", "E"], iconType: "moon" },
  { word: "C L O C K", displayWord: "C L _ C K", correctAnswer: "O", options: ["A", "O", "E", "U"], iconType: "clock" },
  { word: "H A T", displayWord: "H _ T", correctAnswer: "A", options: ["A", "E", "I", "O"], iconType: "hat" },
  { word: "I C E", displayWord: "I C _", correctAnswer: "E", options: ["E", "A", "O", "I"], iconType: "ice" },
  { word: "H E A R T", displayWord: "H E _ R T", correctAnswer: "A", options: ["A", "E", "O", "I"], iconType: "heart" }
];

// 遊戲狀態："start" (說明頁), "quiz" (測驗頁), "result" (結算頁)
let gameState = "start";

// 當前測驗 5 題資料
let quizData = [];
// 當前答題索引與總得分
let currentQuestionIndex = 0;
let score = 0;

// 可拖拽選項按鈕陣列
let draggableOptions = [];
let draggedIndex = -1;
let dragOffsetX = 0;
let dragOffsetY = 0;

// 目標放置區域（改成底線樣式）
let dropZone = { x: 0, y: 0, width: 65, height: 65 };

// 反饋訊息與計時器
let feedbackMessage = "";
let feedbackTimer = 0;

// 繽紛背景動態粒子陣列 (45 個)
let bgParticles = [];

// 音訊上下文
let audioCtx;

// p5.js 初始化設定
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // 初始化 45 個繽紛浮動粒子
  for (let i = 0; i < 45; i++) {
    bgParticles.push({
      x: random(width),
      y: random(height),
      size: random(12, 50),
      speedX: random(-0.7, 0.7),
      speedY: random(-0.8, -0.2),
      color: color(random(120, 255), random(140, 255), random(160, 255), random(80, 160))
    });
  }
}

// 初始化新測驗
function initNewQuiz() {
  currentQuestionIndex = 0;
  score = 0;

  // 隨機打亂題庫並選 5 題
  let shuffled = [...questionBank];
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(random(i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  quizData = shuffled.slice(0, 5);
  setupCurrentQuestion();
}

// 設定當前題目選項
function setupCurrentQuestion() {
  draggableOptions = [];
  let q = quizData[currentQuestionIndex];
  let opts = q.options;

  let btnSize = 75;
  let spacing = 25;
  let totalWidth = opts.length * btnSize + (opts.length - 1) * spacing;
  let startX = width / 2 - totalWidth / 2 + btnSize / 2;
  let btnY = height / 2 + 165;

  for (let i = 0; i < opts.length; i++) {
    let btnX = startX + i * (btnSize + spacing);
    draggableOptions.push({
      letter: opts[i],
      x: btnX,
      y: btnY,
      homeX: btnX,
      homeY: btnY,
      size: btnSize,
      isDragging: false
    });
  }
}

// 主繪製迴圈
function draw() {
  // 繪製繽紛歡樂漸層動態背景
  drawColorfulBackground();

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "quiz") {
    drawQuizScreen();
  } else if (gameState === "result") {
    drawResultsScreen();
  }
}

// 🌈 繪製繽紛漸層與動態彩彩粒子背景
function drawColorfulBackground() {
  // 漸層背景色基底
  let c1 = color(235, 240, 255);
  let c2 = color(255, 235, 245);
  for (let y = 0; y < height; y += 4) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    strokeWeight(4);
    line(0, y, width, y);
  }

  // 背景飄動繽紛粒子
  noStroke();
  for (let p of bgParticles) {
    fill(p.color);
    circle(p.x, p.y, p.size);
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.y < -p.size) {
      p.y = height + p.size;
      p.x = random(width);
    }
    if (p.x < -p.size || p.x > width + p.size) {
      p.speedX *= -1;
    }
  }
}

// 開始說明頁
function drawStartScreen() {
  fill(255, 255, 255, 240);
  stroke(180, 200, 230);
  strokeWeight(3);
  rectMode(CENTER);
  rect(width / 2, height / 2, 540, 360, 25);

  noStroke();
  fill(33, 150, 243);
  textSize(30); // 稍微調整字體大小以完整呈現名稱
  textStyle(BOLD);
  text("魔法字母村：英文單字大冒險", width / 2, height / 2 - 120);

  fill(70);
  textSize(20);
  textStyle(NORMAL);
  text("【測驗說明】", width / 2, height / 2 - 55);
  textSize(17);
  fill(100);
  text("1. 觀察上方立體逼真插畫與缺字單字", width / 2, height / 2 - 18);
  text("2. 將下方正確的英文字母拖曳至底線處", width / 2, height / 2 + 15);
  text("3. 共 5 道題目，挑戰看看你能拿高分！", width / 2, height / 2 + 48);

  // START! 按鈕
  let startBtnX = width / 2;
  let startBtnY = height / 2 + 118;
  let isHover = dist(mouseX, mouseY, startBtnX, startBtnY) < 70 && abs(mouseY - startBtnY) < 25;

  if (isHover) {
    fill(76, 175, 80);
  } else {
    fill(102, 187, 106);
  }
  rect(startBtnX, startBtnY, 190, 52, 26);

  fill(255);
  textSize(24);
  textStyle(BOLD);
  text("START !", startBtnX, startBtnY);
}

// 測驗畫面
function drawQuizScreen() {
  if (quizData.length === 0) return;
  let q = quizData[currentQuestionIndex];

  // 進度條
  stroke(200);
  strokeWeight(2);
  fill(255);
  rectMode(CORNER);
  rect(width / 2 - 150, 25, 300, 20, 10);

  noStroke();
  fill(76, 175, 80);
  let progressWidth = map(currentQuestionIndex, 0, quizData.length, 0, 300);
  rect(width / 2 - 150, 25, progressWidth, 20, 10);

  fill(60);
  textSize(18);
  textStyle(NORMAL);
  text("題目 " + (currentQuestionIndex + 1) + " / " + quizData.length, width / 2, 14);

  // 🎨 繪製 3D 立體逼真插畫圖示
  draw3DRealnessIllustration(width / 2, height / 2 - 120, q.iconType);

  // 繪製單字與無框藍色底線
  drawWordWithUnderline(q);

  // 繪製拖拽選項
  for (let i = 0; i < draggableOptions.length; i++) {
    if (i !== draggedIndex) {
      drawOptionButton(draggableOptions[i]);
    }
  }
  if (draggedIndex !== -1) {
    drawOptionButton(draggableOptions[draggedIndex]);
  }

  // 答題反饋提示
  if (feedbackTimer > 0) {
    textSize(24);
    textStyle(BOLD);
    if (feedbackMessage === "正確！") {
      fill(46, 125, 50);
    } else {
      fill(198, 40, 40);
    }
    text(feedbackMessage, width / 2, height / 2 + 235);
    feedbackTimer--;
  }
}

// 繪製單字與無框「純底線 (Underline)」放置區域
function drawWordWithUnderline(q) {
  let displayStr = q.displayWord;
  textSize(52);
  textStyle(BOLD);
  let totalW = textWidth(displayStr);
  let startX = width / 2 - totalW / 2;

  let currentX = startX;
  let charArray = displayStr.split(" ");

  for (let i = 0; i < charArray.length; i++) {
    let ch = charArray[i];
    let cw = textWidth(ch + " ");

    if (ch === "_") {
      // 紀錄 DropZone 中心位置以進行拖放判定
      dropZone.x = currentX + textWidth("_") / 2;
      dropZone.y = height / 2 + 35;
      dropZone.width = 65;
      dropZone.height = 65;

      // 無外框，改為繪製醒目的「藍色加粗底線」
      stroke(33, 150, 243);
      strokeWeight(5);
      strokeCap(ROUND);
      let lineY = height / 2 + 55;
      line(currentX + 5, lineY, currentX + cw - 15, lineY);
    } else {
      // 繪製正常字母
      noStroke();
      fill(40);
      text(ch, currentX + cw / 2 - textWidth(" ") / 2, height / 2 + 35);
    }
    currentX += cw;
  }
}

// 選項按鈕
function drawOptionButton(opt) {
  push();
  translate(opt.x, opt.y);

  if (opt.isDragging) {
    fill(0, 0, 0, 25);
    noStroke();
    circle(5, 5, opt.size + 10);
    fill(255, 243, 224);
    stroke(255, 152, 0);
    strokeWeight(4);
  } else {
    fill(255);
    stroke(200);
    strokeWeight(2);
  }

  circle(0, 0, opt.size);

  noStroke();
  fill(40);
  textSize(32);
  textStyle(BOLD);
  text(opt.letter, 0, 0);
  pop();
}

// 🎨 ✨ 3D 立體逼真光影向量繪製核心（切面與高光立體感）
function draw3DRealnessIllustration(cx, cy, type) {
  push();
  translate(cx, cy);

  let t = frameCount * 0.04;

  if (type === "pencil") {
    // ✏️ 超擬真立體切面黃色鉛筆
    translate(0, sin(t * 2) * 4);
    rotate(radians(-42));

    // 立體陰影
    noStroke(); fill(0, 25);
    polygon([-110, 92], [65, -12], [85, 25], [-75, 110]);

    stroke(35); strokeWeight(4.5); strokeJoin(ROUND);

    // 劃痕
    line(-110, 85, -50, 75);

    // 1. 金屬環 (立體金屬漸層質感)
    fill(235); rectMode(CORNERS); rect(35, -22, 60, 22, 3);
    fill(180); rect(42, -22, 48, 22); rect(52, -22, 56, 22);

    // 2. 橡皮擦 (白中帶光澤)
    fill(250, 245, 240); rect(60, -20, 90, 20, 0, 8, 8, 0);
    strokeWeight(2); fill(255); line(60, -12, 88, -12); stroke(35);

    // 3. 筆身三個高光/中色/陰影切面 (Hexagonal Shading)
    strokeWeight(4.5);
    // 上切面 (亮黃高光)
    fill(255, 230, 130);
    beginShape(); vertex(-45, -22); vertex(35, -22); vertex(35, -8); vertex(-35, -8); endShape(CLOSE);
    // 中切面 (標準主色)
    fill(238, 185, 45);
    beginShape(); vertex(-35, -8); vertex(35, -8); vertex(35, 8); vertex(-45, 8); endShape(CLOSE);
    // 下切面 (深黃陰影)
    fill(195, 140, 25);
    beginShape(); vertex(-45, 8); vertex(35, 8); vertex(35, 22); vertex(-35, 22); endShape(CLOSE);

    // 4. 木質木頭 (原木切削層次)
    fill(245, 220, 185);
    beginShape(); vertex(-45, -22); vertex(-35, -8); vertex(-45, 8); vertex(-35, 22); vertex(-85, 8); vertex(-85, -8); endShape(CLOSE);
    fill(225, 195, 155);
    beginShape(); vertex(-35, -8); vertex(-45, 8); vertex(-85, 0); endShape(CLOSE);

    // 木紋描邊與石墨筆芯
    strokeWeight(2.5); line(-45, -22, -85, 0); line(-35, 22, -85, 0);
    strokeWeight(4); fill(50); triangle(-85, -8, -85, 8, -102, 0);
    fill(120); triangle(-85, -8, -85, 0, -102, 0);
  }
  else if (type === "cat") {
    // 🐱 3D 立體球型貓咪
    scale(1.2); rotate(sin(t * 1.5) * 0.08); stroke(40); strokeWeight(4); strokeJoin(ROUND);
    fill(230, 110, 20); triangle(-42, -15, -20, -60, -2, -30); triangle(2, -30, 20, -60, 42, -15);
    fill(255, 170, 180); triangle(-32, -18, -20, -48, -8, -28); triangle(8, -28, 20, -48, 32, -18);
    fill(247, 160, 45); circle(0, 0, 95);
    fill(255, 180, 80); noStroke(); circle(-12, -15, 60); stroke(40);
    fill(255, 120, 140, 140); noStroke(); circle(-28, 12, 16); circle(28, 12, 16); stroke(40);
    fill(40); circle(-18, -4, 14); circle(18, -4, 14);
    fill(255); circle(-21, -7, 5); circle(15, -7, 5);
    fill(244, 143, 177); triangle(-6, 8, 6, 8, 0, 15);
    noFill(); strokeWeight(3.5); arc(-7, 20, 14, 10, 0, PI); arc(7, 20, 14, 10, 0, PI);
  }
  else if (type === "apple") {
    // 🍎 立體擬真紅蘋果
    scale(1.25); translate(0, sin(t * 2) * 4); stroke(40); strokeWeight(4);
    fill(215, 40, 40); circle(-18, 0, 68); circle(18, 0, 68);
    fill(255, 100, 100); noStroke(); circle(-25, -12, 35); stroke(40);
    fill(100, 60, 40); rectMode(CENTER); rect(0, -38, 8, 24, 3);
    fill(76, 175, 80); ellipse(16, -38, 26, 15);
  }
  else if (type === "sun") {
    // ☀️ 3D 光芒太陽
    scale(1.2); rotate(t * 0.3); stroke(40); strokeWeight(4); fill(255, 167, 38);
    for (let a = 0; a < 360; a += 30) { push(); rotate(radians(a)); triangle(-10, -45, 10, -45, 0, -65); pop(); }
    fill(255, 213, 79); circle(0, 0, 85);
    fill(255, 245, 160); noStroke(); circle(-15, -15, 50); stroke(40);
    fill(40); rectMode(CENTER); rect(-20, -5, 30, 20, 5); rect(20, -5, 30, 20, 5); line(-5, -10, 5, -10);
    noFill(); stroke(230, 81, 0); strokeWeight(4); arc(0, 14, 24, 18, 0, PI);
  }
  else if (type === "dog") {
    // 🐶 立體小狗
    scale(1.2); translate(0, sin(t * 2) * 4); stroke(40); strokeWeight(4);
    fill(141, 110, 99); circle(0, 0, 90); fill(93, 64, 55);
    ellipse(-40, -5, 28, 58); ellipse(40, -5, 28, 58);
    fill(255); circle(0, 15, 46); fill(40); circle(-18, -10, 12); circle(18, -10, 12);
    fill(255); circle(-20, -12, 4); circle(16, -12, 4); fill(50); circle(0, 5, 18);
    fill(255, 128, 171); ellipse(0, 26, 16, 22);
  }
  else if (type === "book") {
    // 📖 3D 立體精裝繪本
    scale(1.2); translate(0, sin(t * 2) * 5); stroke(40); strokeWeight(4); rectMode(CENTER);
    fill(229, 57, 53); rect(0, 5, 88, 100, 8); fill(255); rect(4, 5, 72, 92, 4);
    fill(33, 150, 243); rect(-38, 5, 12, 100, 4);
    strokeWeight(3); line(-20, -20, 20, -20); line(-20, 0, 20, 0); line(-20, 20, 10, 20);
  }
  else if (type === "star") {
    // ⭐️ 3D 金屬立體感星星
    scale(1.2 * (1 + sin(t * 2) * 0.08)); rotate(sin(t) * 0.12); stroke(40); strokeWeight(4);
    fill(255, 202, 40); beginShape();
    for (let i = 0; i < 5; i++) {
      let a1 = radians(i * 72 - 90); let a2 = radians(i * 72 + 36 - 90);
      vertex(cos(a1) * 55, sin(a1) * 55); vertex(cos(a2) * 25, sin(a2) * 25);
    }
    endShape(CLOSE);
    fill(40); circle(-12, -4, 10); circle(12, -4, 10);
    fill(255); circle(-14, -6, 4); circle(10, -6, 4);
    noFill(); stroke(180, 100, 0); strokeWeight(3); arc(0, 5, 12, 10, 0, PI);
  }
  else if (type === "fish") {
    // 🐟 立體熱帶魚
    scale(1.2); rotate(sin(t * 2) * 0.08); stroke(40); strokeWeight(4);
    fill(255, 112, 67); ellipse(0, 0, 90, 60); fill(244, 81, 30); triangle(35, 0, 68, -25, 68, 25);
    fill(255, 202, 40); rect(-5, 0, 12, 58, 6); fill(255); circle(-25, -10, 18); fill(0); circle(-27, -10, 8);
  }
  else if (type === "ball") {
    // ⚽ 3D 高光球體
    scale(1.2); translate(0, -abs(sin(t * 3)) * 20); rotate(t * 0.5); stroke(40); strokeWeight(4);
    fill(76, 175, 80); circle(0, 0, 80); fill(255, 235, 59); arc(0, 0, 80, 80, 0, HALF_PI);
    fill(244, 67, 54); arc(0, 0, 80, 80, PI, PI + HALF_PI); fill(33, 150, 243); arc(0, 0, 80, 80, HALF_PI, PI);
    fill(255); circle(0, 0, 22);
  }
  else if (type === "bird") {
    // 🐦 青鳥
    scale(1.2); translate(0, sin(t * 3) * 5); stroke(40); strokeWeight(4);
    fill(41, 182, 246); circle(0, 0, 75); fill(255, 224, 130); circle(-12, 15, 35);
    fill(255, 152, 0); triangle(-30, -5, -55, 2, -30, 12);
    fill(255); circle(-12, -12, 16); fill(0); circle(-14, -12, 7);
    fill(3, 155, 229); ellipse(15, -5, 45, 24);
  }
  else if (type === "duck") {
    // 🦆 黃鴨
    scale(1.2); translate(0, sin(t * 2) * 5); stroke(40); strokeWeight(4);
    fill(255, 238, 88); circle(0, -5, 75); fill(255, 152, 0); ellipse(-30, 2, 35, 20);
    fill(50); circle(-12, -15, 11); fill(255); circle(-14, -17, 4);
  }
  else if (type === "car") {
    // 🚗 立體小車
    scale(1.2); translate(sin(t * 6) * 2, 0); stroke(40); strokeWeight(4); rectMode(CENTER);
    fill(229, 57, 53); rect(0, 10, 105, 45, 10); fill(144, 202, 249); rect(-6, -12, 60, 26, 6);
    fill(255, 235, 59); circle(-48, 12, 12); fill(50); circle(-32, 32, 28); circle(32, 32, 28);
    fill(220); circle(-32, 32, 12); circle(32, 32, 12);
  }
  else if (type === "tree") {
    // 🌲 大樹
    scale(1.2); translate(0, sin(t * 1.5) * 3); stroke(40); strokeWeight(4);
    fill(121, 85, 72); rectMode(CENTER); rect(0, 20, 26, 50);
    fill(76, 175, 80); circle(0, -25, 75); circle(-25, -10, 55); circle(25, -10, 55);
  }
  else if (type === "flower") {
    // 🌸 花朵
    scale(1.2); rotate(sin(t) * 0.1); stroke(40); strokeWeight(4);
    fill(244, 143, 177);
    for (let a = 0; a < 360; a += 72) {
      push(); rotate(radians(a)); circle(0, -30, 40); pop();
    }
    fill(255, 235, 59); circle(0, 0, 42);
  }
  else if (type === "cake") {
    // 🎂 蛋糕
    scale(1.2); translate(0, sin(t * 2) * 4); stroke(40); strokeWeight(4); rectMode(CENTER);
    fill(248, 187, 208); rect(0, 15, 85, 50, 8);
    fill(255); rect(0, -8, 87, 18, 6);
    fill(229, 57, 53); circle(-25, -20, 16); circle(0, -20, 16); circle(25, -20, 16);
  }
  else if (type === "moon") {
    // 🌙 彎月
    scale(1.2); rotate(sin(t * 1.2) * 0.12); stroke(40); strokeWeight(4);
    fill(255, 235, 59);
    beginShape(); vertex(0, -45); bezierVertex(35, -35, 45, 10, 0, 45); bezierVertex(20, 20, 15, -20, 0, -45); endShape(CLOSE);
  }
  else if (type === "clock") {
    // ⏰ 時鐘
    scale(1.2); translate(0, sin(t * 2) * 3); stroke(40); strokeWeight(4);
    fill(239, 83, 80); circle(-30, -35, 24); circle(30, -35, 24);
    fill(255); circle(0, 0, 80);
    strokeWeight(4); line(0, 0, 0, -22); line(0, 0, 16, 0); circle(0, 0, 6);
  }
  else if (type === "hat") {
    // 🎩 帽子
    scale(1.2); rotate(sin(t * 2) * 0.1); stroke(40); strokeWeight(4); rectMode(CENTER);
    fill(66, 66, 66); rect(0, -10, 60, 60, 6, 6, 0, 0);
    fill(229, 57, 53); rect(0, 12, 61, 14);
    fill(40); rect(0, 22, 95, 10, 5);
  }
  else if (type === "ice") {
    // 🧊 冰塊
    scale(1.2); rotate(sin(t * 1.5) * 0.08); stroke(40); strokeWeight(4); rectMode(CENTER);
    fill(179, 229, 252); rect(0, 0, 70, 70, 12);
    fill(255, 200); rect(-12, -12, 35, 35, 6);
  }
  else if (type === "heart") {
    // ❤️ 愛心
    scale(1.2 * (1 + sin(t * 3) * 0.08)); stroke(40); strokeWeight(4);
    fill(244, 67, 54);
    beginShape(); vertex(0, 25); bezierVertex(-45, -5, -45, -40, 0, -15); bezierVertex(45, -40, 45, -5, 0, 25); endShape(CLOSE);
  }

  pop();
}

// 多邊形繪製輔助函式
function polygon(points) {
  beginShape();
  for (let p of points) {
    vertex(p[0], p[1]);
  }
  endShape(CLOSE);
}

// 結算畫面
function drawResultsScreen() {
  fill(255, 255, 255, 240);
  stroke(210);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width / 2, height / 2, 440, 320, 20);

  noStroke();
  if (score >= 60) {
    fill(46, 125, 50);
    textSize(36);
    textStyle(BOLD);
    text("🎉 恭喜通過！", width / 2, height / 2 - 90);
  } else {
    fill(198, 40, 40);
    textSize(36);
    textStyle(BOLD);
    text("💪 再接再厲！", width / 2, height / 2 - 90);
  }

  fill(60);
  textSize(24);
  textStyle(NORMAL);
  text("最終得分：" + score + " / " + (quizData.length * 20) + " 分", width / 2, height / 2 - 15);

  let restartBtnX = width / 2;
  let restartBtnY = height / 2 + 75;
  let isHover = dist(mouseX, mouseY, restartBtnX, restartBtnY) < 65;

  if (isHover) {
    fill(76, 175, 80);
  } else {
    fill(56, 142, 60);
  }
  rect(restartBtnX, restartBtnY, 170, 48, 25);

  fill(255);
  textSize(20);
  textStyle(BOLD);
  text("再玩一次", restartBtnX, restartBtnY);
}

// 按下事件
function mousePressed() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (gameState === "start") {
    let startBtnX = width / 2;
    let startBtnY = height / 2 + 118;
    if (dist(mouseX, mouseY, startBtnX, startBtnY) < 70 && abs(mouseY - startBtnY) < 25) {
      initNewQuiz();
      gameState = "quiz";
      playBeepSound(523, 0.1);
    }
  } else if (gameState === "quiz") {
    for (let i = 0; i < draggableOptions.length; i++) {
      let opt = draggableOptions[i];
      if (dist(mouseX, mouseY, opt.x, opt.y) < opt.size / 2) {
        draggedIndex = i;
        opt.isDragging = true;
        dragOffsetX = opt.x - mouseX;
        dragOffsetY = opt.y - mouseY;
        playBeepSound(400, 0.05);
        break;
      }
    }
  } else if (gameState === "result") {
    let restartBtnX = width / 2;
    let restartBtnY = height / 2 + 75;
    if (dist(mouseX, mouseY, restartBtnX, restartBtnY) < 65) {
      initNewQuiz();
      gameState = "quiz";
      playBeepSound(440, 0.1);
    }
  }
}

// 拖拽移動
function mouseDragged() {
  if (gameState === "quiz" && draggedIndex !== -1) {
    let opt = draggableOptions[draggedIndex];
    opt.x = mouseX + dragOffsetX;
    opt.y = mouseY + dragOffsetY;
  }
}

// 放開滑鼠
function mouseReleased() {
  if (gameState === "quiz" && draggedIndex !== -1) {
    let opt = draggableOptions[draggedIndex];
    opt.isDragging = false;

    let isInsideDropZone = dist(opt.x, opt.y, dropZone.x, dropZone.y) < dropZone.width / 1.2;

    if (isInsideDropZone) {
      let currentQ = quizData[currentQuestionIndex];

      if (opt.letter === currentQ.correctAnswer) {
        score += 20;
        feedbackMessage = "正確！";
        playBeepSound(659, 0.15);
      } else {
        feedbackMessage = "錯誤！正確答案是: " + currentQ.correctAnswer;
        playBeepSound(220, 0.3);
      }

      feedbackTimer = 60;
      currentQuestionIndex++;

      if (currentQuestionIndex >= quizData.length) {
        gameState = "result";
        if (score >= 60) {
          playVictorySound();
        } else {
          playFailureSound();
        }
      } else {
        setupCurrentQuestion();
      }
    } else {
      opt.x = opt.homeX;
      opt.y = opt.homeY;
    }

    draggedIndex = -1;
  }
}

// 🎵 60 分以上勝利音效 (和弦梯階)
function playVictorySound() {
  if (!audioCtx) return;
  let notes = [523.25, 659.25, 783.99, 1046.50];
  for (let i = 0; i < notes.length; i++) {
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.value = notes[i];
    let startTime = audioCtx.currentTime + i * 0.1;
    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.3);
  }
}

// 🎵 60 分以下失敗音效 (下滑音)
function playFailureSound() {
  if (!audioCtx) return;
  let osc = audioCtx.createOscillator();
  let gain = audioCtx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.6);
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.6);
}

// 點擊短響音
function playBeepSound(freq, duration) {
  if (!audioCtx) return;
  let osc = audioCtx.createOscillator();
  let gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// 視窗 resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}