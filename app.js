const sections = Array.from(document.querySelectorAll(".chapter"));
const tocLinks = Array.from(document.querySelectorAll(".toc a"));
const prevButton = document.getElementById("prevChapter");
const nextButton = document.getElementById("nextChapter");
const statusText = document.getElementById("chapterStatus");
const modeButtons = Array.from(document.querySelectorAll(".mode-btn"));
const readerShell = document.querySelector(".reader-shell");

let currentIndex = 0;
let currentMode = "book";

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function attachCopyButton(container, getText) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "copy-btn";
  button.textContent = "\u0e04\u0e31\u0e14\u0e25\u0e2d\u0e01";

  button.addEventListener("click", async () => {
    try {
      await copyText(getText().trim());
      button.textContent = "\u0e04\u0e31\u0e14\u0e25\u0e2d\u0e01\u0e41\u0e25\u0e49\u0e27";
      button.classList.add("copied");
    } catch (error) {
      button.textContent = "\u0e04\u0e31\u0e14\u0e25\u0e2d\u0e01\u0e44\u0e21\u0e48\u0e44\u0e14\u0e49";
    }

    setTimeout(() => {
      button.textContent = "\u0e04\u0e31\u0e14\u0e25\u0e2d\u0e01";
      button.classList.remove("copied");
    }, 1600);
  });

  container.appendChild(button);
}

function setActive(index, options = {}) {
  currentIndex = Math.max(0, Math.min(sections.length - 1, index));
  const activeSection = sections[currentIndex];
  const activeId = `#${activeSection.id}`;

  sections.forEach((section, sectionIndex) => {
    section.classList.toggle("is-active", sectionIndex === currentIndex);
  });

  tocLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === activeId);
  });

  const activeTitle = activeSection.dataset.title || activeSection.querySelector("h2").textContent;
  statusText.textContent = `\u0e01\u0e33\u0e25\u0e31\u0e07\u0e2d\u0e48\u0e32\u0e19: ${activeTitle}`;
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === sections.length - 1;

  if (options.updateHash !== false) {
    history.replaceState(null, "", activeId);
  }

  if (options.scroll !== false) {
    const scrollTarget = currentMode === "website" ? activeSection : readerShell;
    scrollTarget?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function goToSection(index) {
  setActive(index);
}

function setReaderMode(mode) {
  currentMode = mode === "website" ? "website" : "book";
  document.body.classList.toggle("book-mode", currentMode === "book");
  document.body.classList.toggle("website-mode", currentMode === "website");

  modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === currentMode);
  });

  setActive(currentIndex, { scroll: false });
}

tocLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href").slice(1);
    const index = sections.findIndex((section) => section.id === targetId);

    if (index >= 0) {
      event.preventDefault();
      setActive(index);
    }
  });
});

prevButton.addEventListener("click", () => goToSection(currentIndex - 1));
nextButton.addEventListener("click", () => goToSection(currentIndex + 1));

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setReaderMode(button.dataset.mode);
  });
});

document.querySelectorAll("pre").forEach((pre) => {
  attachCopyButton(pre, () => pre.querySelector("code")?.innerText || pre.innerText);
});

const promptCopyTexts = [
  `เธเนเธงเธขเธงเธดเน€เธเธฃเธฒเธฐเธซเนเธ•เธฑเธงเธ•เธ Influencer / Affiliate เธเธญเธเธเธฑเธ

เธเนเธญเธกเธนเธฅ:
เธเธทเนเธญเธเนเธญเธ/เธเธทเนเธญเน€เธเธ:
เธชเธดเธเธเนเธฒเธซเธฃเธทเธญเธซเธกเธงเธ”เธชเธดเธเธเนเธฒเธ—เธตเนเธเธฒเธข:
เธเธฅเธธเนเธกเธฅเธนเธเธเนเธฒเธซเธฅเธฑเธ:
เธชเนเธ•เธฅเนเธเธฒเธฃเธเธนเธ”:
เธเธธเธ”เนเธเนเธเธเธญเธเธเธฑเธ:
เธชเธดเนเธเธ—เธตเนเธญเธขเธฒเธเนเธซเนเธเธเธเธณ:

เธเธญเธเธณเธ•เธญเธเน€เธเนเธ 5 เธชเนเธงเธ:
1. Core Identity
2. Positioning
3. Audience
4. Key Message
5. เนเธ—เธเธเธฒเธฃเธเธนเธ”เธ—เธตเนเน€เธซเธกเธฒเธฐเธเธฑเธเธเนเธญเธ`,
  `เธเนเธงเธขเธงเธฒเธเนเธเธฅเธเนเธเธชเธ•เน 7 เธงเธฑเธเธชเธณเธซเธฃเธฑเธ Influencer / Affiliate

เธเนเธญเธกเธนเธฅ:
เธ•เธฑเธงเธ•เธเธเธญเธเธเนเธญเธ:
เธชเธดเธเธเนเธฒเธซเธฃเธทเธญเธซเธกเธงเธ”เธชเธดเธเธเนเธฒ:
เธเธฅเธธเนเธกเน€เธเนเธฒเธซเธกเธฒเธข:
เน€เธเนเธฒเธซเธกเธฒเธขเธชเธฑเธเธ”เธฒเธซเนเธเธตเน:
เนเธเธฅเธ•เธเธญเธฃเนเธกเธซเธฅเธฑเธ:

เธเธญเน€เธเนเธเธ•เธฒเธฃเธฒเธ 7 เธงเธฑเธ เนเธ”เธขเธกเธต:
- เธซเธฑเธงเธเนเธญเนเธเธชเธ•เน
- เธเธฃเธฐเน€เธ เธ—เธเธญเธเน€เธ—เธเธ•เน
- Hook เน€เธเธดเธ”เธเธฅเธดเธ
- Key Message
- CTA เธ—เนเธฒเธขเนเธเธชเธ•เน
- เนเธญเน€เธ”เธตเธขเธ เธฒเธ/เธงเธดเธ”เธตเนเธญเธ—เธตเนเธเธงเธฃเธ–เนเธฒเธข`,
  `เธเนเธงเธขเธชเธฃเธธเธเธเนเธญเธกเธนเธฅเธชเธดเธเธเนเธฒเนเธซเนเน€เธเนเธเธ เธฒเธฉเธฒเธเธฒเธขเนเธเธ Influencer

เธเนเธญเธกเธนเธฅเธชเธดเธเธเนเธฒ:
เธเธทเนเธญเธชเธดเธเธเนเธฒ:
เธซเธกเธงเธ”เธชเธดเธเธเนเธฒ:
เธฃเธฒเธเธฒเน€เธ•เนเธก:
เธฃเธฒเธเธฒเนเธเธฃ:
เธเธธเธ”เน€เธ”เนเธ:
เธงเธดเธเธตเนเธเน:
เธเธฅเธธเนเธกเธฅเธนเธเธเนเธฒ:
เธเนเธญเธเธงเธฃเน€เธฅเธตเนเธขเธเนเธเธเธฒเธฃเธเธนเธ”:

เธเธญเธเธณเธ•เธญเธเน€เธเนเธ:
1. เธเธตเธขเนเน€เธงเธดเธฃเนเธ”เธซเธฅเธฑเธ
2. เธเนเธญเธกเธนเธฅเธชเธดเธเธเนเธฒเนเธเธเธชเธฑเนเธ
3. เธเธธเธ”เธเธฒเธข
4. Pain point
5. Reason to buy
6. เธเธณเน€เธฅเธตเนเธขเธเธชเธณเธซเธฃเธฑเธ TikTok
7. เธเธฃเธฐเนเธขเธเธเธดเธ”เธเธฒเธฃเธเธฒเธข`,
  `เธเนเธงเธขเธเธดเธ” Hook 20 เนเธเธเธชเธณเธซเธฃเธฑเธเธชเธดเธเธเนเธฒเธเธตเน

เธเนเธญเธกเธนเธฅ:
เธเธทเนเธญเธชเธดเธเธเนเธฒ:
เธเธฅเธธเนเธกเธฅเธนเธเธเนเธฒ:
เธเธฑเธเธซเธฒเธ—เธตเนเธฅเธนเธเธเนเธฒเน€เธเธญ:
เธเธธเธ”เธเธฒเธขเธซเธฅเธฑเธ:
เธฃเธฒเธเธฒ/เนเธเธฃ:
เนเธ—เธเธเธฒเธฃเธเธนเธ”:

เธเธญเนเธขเธ Hook เน€เธเนเธ:
1. Hook เนเธเธเธเธตเนเธเธฑเธเธซเธฒ
2. Hook เนเธเธเน€เธฅเนเธฒเน€เธฃเธทเนเธญเธ
3. Hook เนเธเธเธเธฅเธฅเธฑเธเธเน
4. Hook เนเธเธเธเธณเธ–เธฒเธก
5. Hook เนเธเธเธฃเธตเธงเธดเธงเธเธฃเธดเธ

เนเธเนเธ เธฒเธฉเธฒเธเธนเธ” เน€เธเธดเธ”เธเธฅเธดเธเนเธ”เนเธ—เธฑเธเธ—เธต`,
  `สร้างภาพโปรโมชันสำหรับใช้ไลฟ์สด/ทำคลิปขายของ

ไฟล์งาน:
- PNG
- พื้นหลัง transparent
- ขนาด 3:2 แนวนอน
- วางสินค้าเด่นชัด เห็นแพ็กเกจครบ
- ตกแต่งให้สวย พรีเมียม หยุดนิ้วคนดู

ธีม:
ข้อความหลัก:
ข้อความรอง:
ราคา:
จาก:

คำสั่งออกแบบ:
จัดวางสินค้าไว้ฝั่งขวาหรือกลางภาพให้โดดเด่น
ใส่ข้อความหลักขนาดใหญ่ อ่านชัดในมือถือ
ราคาเป็นจุดเด่นที่สุด ใช้สีสด มีลูกเล่นวิบวับ/ประกาย/ขอบหนา
ราคาเต็มหลังคำว่า “จาก” ให้ใส่ขีดฆ่า
ใช้แสงเงาและ sticker-style text แบบงานไลฟ์สด
ให้ภาพดูสะอาด แพง สนุก และพร้อมใช้ยิงโปรทันที

ห้าม:
- ห้ามใส่พื้นหลังทึบ
- ห้ามครอปสินค้า
- ห้ามทำตัวหนังสือเล็กจนอ่านบนมือถือไม่ออก`,
  `เธเนเธงเธขเธ—เธณเธชเธฃเธธเธ infographic 1 เธซเธเนเธฒ เธเธเธฒเธ” A4 เธชเธณเธซเธฃเธฑเธเธชเธดเธเธเนเธฒเธเธตเน

เธเนเธญเธกเธนเธฅเธชเธดเธเธเนเธฒ:
เธเธทเนเธญเธชเธดเธเธเนเธฒ:
เธ เธฒเธเธชเธดเธเธเนเธฒ:
เธฃเธฒเธเธฒเน€เธ•เนเธก:
เธฃเธฒเธเธฒเนเธเธฃเนเธกเธเธฑเนเธ:
เธเธธเธ”เธเธฒเธข:
เธงเธดเธเธตเนเธเน:
เธเธฅเธธเนเธกเธฅเธนเธเธเนเธฒ:
เธเธณเน€เธฅเธตเนเธขเธ:

เธเธฑเธ”เธซเธฑเธงเธเนเธญเนเธซเนเธเธฃเธ:
เธเธตเธขเนเน€เธงเธดเธฃเนเธ”เธซเธฅเธฑเธ
เธเนเธญเธกเธนเธฅเธชเธดเธเธเนเธฒ
เธเธธเธ”เธเธฒเธข
เธเธณเน€เธฅเธตเนเธขเธเธชเธณเธซเธฃเธฑเธเนเธฅเธเน/เธ—เธณเธเธฅเธดเธเนเธ TikTok
เธงเธดเธเธตเธเธฒเธฃเนเธเน
เธเธฅเธธเนเธกเธฅเธนเธเธเนเธฒ
เธฃเธฒเธเธฒเธเธฒเธขเน€เธ•เนเธกเธเนเธญเธเธฅเธ”
เธฃเธฒเธเธฒเนเธเธฃเนเธกเธเธฑเนเธ
เธเธฃเธฐเนเธขเธ Hook เธเธเธ”เธน 10 เธเธฃเธฐเนเธขเธ
เธเธฃเธฐเนเธขเธเธเธดเธ”เธเธฒเธฃเธเธฒเธข 10 เธเธฃเธฐเนเธขเธ`
];

document.querySelectorAll(".prompt-cards article").forEach((card, cardIndex) => {
  card.classList.add("copy-card");
  attachCopyButton(card, () => {
    if (card.dataset.copy) {
      return card.dataset.copy;
    }

    if (promptCopyTexts[cardIndex]) {
      return promptCopyTexts[cardIndex];
    }

    const title = card.querySelector("h3")?.innerText || "";
    const body = card.querySelector("p")?.innerText || "";
    return `${title}\n${body}`;
  });
});

const initialId = decodeURIComponent(window.location.hash || "").replace("#", "");
const initialIndex = sections.findIndex((section) => section.id === initialId);
setActive(initialIndex >= 0 ? initialIndex : 0, { scroll: false, updateHash: false });
