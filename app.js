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
  `ช่วยวิเคราะห์ตัวตน Influencer / Affiliate ของฉัน

ข้อมูล:
ชื่อช่อง/ชื่อเพจ:
สินค้าหรือหมวดสินค้าที่ขาย:
กลุ่มลูกค้าหลัก:
สไตล์การพูด:
จุดแข็งของฉัน:
สิ่งที่อยากให้คนจำ:

ขอคำตอบเป็น 5 ส่วน:
1. Core Identity
2. Positioning
3. Audience
4. Key Message
5. โทนการพูดที่เหมาะกับช่อง`,
  `ช่วยวางแพลนโพสต์ 7 วันสำหรับ Influencer / Affiliate

ข้อมูล:
ตัวตนของช่อง:
สินค้าหรือหมวดสินค้า:
กลุ่มเป้าหมาย:
เป้าหมายสัปดาห์นี้:
แพลตฟอร์มหลัก:

ขอเป็นตาราง 7 วัน โดยมี:
- หัวข้อโพสต์
- ประเภทคอนเทนต์
- Hook เปิดคลิป
- Key Message
- CTA ท้ายโพสต์
- ไอเดียภาพ/วิดีโอที่ควรถ่าย`,
  `ช่วยสรุปข้อมูลสินค้าให้เป็นภาษาขายแบบ Influencer

ข้อมูลสินค้า:
ชื่อสินค้า:
หมวดสินค้า:
ราคาเต็ม:
ราคาโปร:
จุดเด่น:
วิธีใช้:
กลุ่มลูกค้า:
ข้อควรเลี่ยงในการพูด:

ขอคำตอบเป็น:
1. คีย์เวิร์ดหลัก
2. ข้อมูลสินค้าแบบสั้น
3. จุดขาย
4. Pain point
5. Reason to buy
6. คำเลี่ยงสำหรับ TikTok
7. ประโยคปิดการขาย`,
  `ช่วยคิด Hook 20 แบบสำหรับสินค้านี้

ข้อมูล:
ชื่อสินค้า:
กลุ่มลูกค้า:
ปัญหาที่ลูกค้าเจอ:
จุดขายหลัก:
ราคา/โปร:
โทนการพูด:

ขอแยก Hook เป็น:
1. Hook แบบจี้ปัญหา
2. Hook แบบเล่าเรื่อง
3. Hook แบบผลลัพธ์
4. Hook แบบคำถาม
5. Hook แบบรีวิวจริง

ใช้ภาษาพูด เปิดคลิปได้ทันที`,
  `ช่วยวางกรอบไลฟ์ขายสินค้าแบบ Influencer / Affiliate

สินค้า:
ราคาเต็ม:
ราคาโปร:
จุดขาย:
กลุ่มลูกค้า:
ข้อกังวลที่คนอาจถาม:
สไตล์การพูดของฉัน:

ขอคำตอบเป็น:
1. โครงไลฟ์ 30 นาที
2. ประโยคเปิดไลฟ์
3. ช่วงเล่า Pain point
4. ช่วงสาธิต/รีวิว
5. คำตอบข้อกังวล
6. CTA ปิดการขาย`,
  `ช่วยทำสรุป infographic 1 หน้า ขนาด A4 สำหรับสินค้านี้

ข้อมูลสินค้า:
ชื่อสินค้า:
ภาพสินค้า:
ราคาเต็ม:
ราคาโปรโมชั่น:
จุดขาย:
วิธีใช้:
กลุ่มลูกค้า:
คำเลี่ยง:

จัดหัวข้อให้ครบ:
คีย์เวิร์ดหลัก
ข้อมูลสินค้า
จุดขาย
คำเลี่ยงสำหรับไลฟ์/ทำคลิปใน TikTok
วิธีการใช้
กลุ่มลูกค้า
ราคาขายเต็มก่อนลด
ราคาโปรโมชั่น
ประโยค Hook คนดู 10 ประโยค
ประโยคปิดการขาย 10 ประโยค`
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
