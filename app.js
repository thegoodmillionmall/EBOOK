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

document.querySelectorAll(".prompt-cards article").forEach((card) => {
  card.classList.add("copy-card");
  attachCopyButton(card, () => {
    const title = card.querySelector("h3")?.innerText || "";
    const body = card.querySelector("p")?.innerText || "";
    return `${title}\n${body}`;
  });
});

const initialId = decodeURIComponent(window.location.hash || "").replace("#", "");
const initialIndex = sections.findIndex((section) => section.id === initialId);
setActive(initialIndex >= 0 ? initialIndex : 0, { scroll: false, updateHash: false });
