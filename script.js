
const card = document.getElementById("flipCard");
const inner = document.getElementById("flipCardInner");
const flipButton = document.getElementById("flipButton");
const flipLabel = document.getElementById("flipLabel");

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

let flipped = false;
let dragging = false;
let moved = false;
let startX = 0;
let startY = 0;
let pointerX = 0;
let pointerY = 0;

function updateFlip() {
  card.classList.toggle("is-flipped", flipped);
  flipButton.setAttribute("aria-pressed", String(flipped));
  flipLabel.textContent = flipped
    ? "View Heritage Card"
    : "Meet the Artisan";

  card.setAttribute(
    "aria-label",
    flipped
      ? "Artisan profile shown. Tap to view heritage card."
      : "Heritage card shown. Tap to meet the artisan."
  );
}

function toggleFlip() {
  flipped = !flipped;
  updateFlip();
}

flipButton.addEventListener("click", toggleFlip);

card.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch") return;
  if (event.button !== 0) return;

  dragging = true;
  moved = false;
  startX = event.clientX;
  startY = event.clientY;
  pointerX = event.clientX;
  pointerY = event.clientY;
});

window.addEventListener("pointermove", (event) => {
  if (!dragging || reduceMotion.matches) return;

  const dx = event.clientX - startX;
  const dy = event.clientY - startY;

  if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
    moved = true;
  }

  if (!moved) return;

  pointerX = event.clientX;
  pointerY = event.clientY;

  const rect = card.getBoundingClientRect();
  const x = (pointerX - rect.left) / rect.width;
  const y = (pointerY - rect.top) / rect.height;

  const rotateY = (x - 0.5) * 22;
  const rotateX = (0.5 - y) * 16;
  const faceRotation = flipped ? 180 : 0;

  inner.style.transition = "none";
  inner.style.transform =
    `rotateX(${rotateX}deg) rotateY(${faceRotation + rotateY}deg)`;
});

window.addEventListener("pointerup", () => {
  if (!dragging) return;
  dragging = false;

  if (moved) {
    inner.style.transition = "";
    inner.style.transform = "";
  }
});

window.addEventListener("pointercancel", () => {
  dragging = false;
  moved = false;
  inner.style.transition = "";
  inner.style.transform = "";
});

card.addEventListener("click", (event) => {
  if (moved) {
    event.preventDefault();
    event.stopImmediatePropagation();
    moved = false;
    return;
  }

  toggleFlip();
});

card.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleFlip();
  }
});

const craftStages = [
  {
    title: "Shaping the model",
    description:
      "An artisan shapes a wax model and carefully adds the details that define the intended form.",
    image: "images/process-model.jpg",
    alt: "Artisan shaping a wax model"
  },
  {
    title: "Preparing the mould",
    description:
      "The wax model is covered with a suitable moulding material. The mould captures the form and fine details.",
    image: "images/process-mould.jpg",
    alt: "Preparing a mould around the model"
  },
  {
    title: "The lost-wax stage",
    description:
      "The mould is heated so the wax melts and drains away, leaving a cavity for the metal.",
    image: "images/process-wax.jpg",
    alt: "Mould preparation and wax removal"
  },
  {
    title: "Casting the metal",
    description:
      "Molten metal is introduced into the prepared mould. This stage requires specialist tools and safety precautions.",
    image: "images/process-casting.jpg",
    alt: "Metal casting in a craft workshop"
  },
  {
    title: "Finishing the artwork",
    description:
      "After cooling, the mould is removed and the object is cleaned, refined and finished by hand.",
    image: "images/process-finish.jpg",
    alt: "Finishing a traditional metal-cast object"
  }
];

const journeyImage = document.getElementById("journey-image");
const journeyPlaceholder = document.getElementById("journey-placeholder");
const journeyPlaceholderNumber =
  document.getElementById("journey-placeholder-number");
const journeyCount = document.getElementById("journey-count");
const journeyLabel = document.getElementById("journey-label");
const journeyTitle = document.getElementById("journey-title");
const journeyDescription =
  document.getElementById("journey-description");
const journeyProgress =
  document.getElementById("journey-progress-fill");
const journeyPrev = document.getElementById("journey-prev");
const journeyNext = document.getElementById("journey-next");

if (
  journeyImage &&
  journeyPlaceholder &&
  journeyCount &&
  journeyTitle &&
  journeyDescription &&
  journeyProgress &&
  journeyPrev &&
  journeyNext
) {
  let currentStage = 0;

  function showCraftStage(index) {
    currentStage = index;
    const stage = craftStages[currentStage];
    const number = String(currentStage + 1).padStart(2, "0");

    journeyCount.textContent = `${number} / ${String(craftStages.length).padStart(2, "0")}`;
    journeyLabel.textContent = `STAGE ${number}`;
    journeyTitle.textContent = stage.title;
    journeyDescription.textContent = stage.description;
    journeyProgress.style.width =
      `${((currentStage + 1) / craftStages.length) * 100}%`;

    journeyPrev.disabled = currentStage === 0;
    journeyNext.disabled = currentStage === craftStages.length - 1;
    journeyNext.textContent =
      currentStage === craftStages.length - 1
        ? "Journey complete ✓"
        : "Next stage →";

    journeyPlaceholderNumber.textContent = number;
    journeyPlaceholder.hidden = true;
    journeyImage.hidden = false;
    journeyImage.alt = stage.alt;
    journeyImage.src = stage.image;
  }

  journeyImage.addEventListener("error", () => {
    journeyImage.hidden = true;
    journeyPlaceholder.hidden = false;
  });

  journeyPrev.addEventListener("click", () => {
    if (currentStage > 0) {
      showCraftStage(currentStage - 1);
    }
  });

  journeyNext.addEventListener("click", () => {
    if (currentStage < craftStages.length - 1) {
      showCraftStage(currentStage + 1);
    }
  });

  showCraftStage(0);
}

const recordToggle = document.getElementById("record-toggle");
const recordNotice = document.getElementById("record-notice");

if (recordToggle && recordNotice) {
  recordToggle.addEventListener("click", () => {
    const isExpanded =
      recordToggle.getAttribute("aria-expanded") === "true";

    recordToggle.setAttribute("aria-expanded", String(!isExpanded));
    recordNotice.hidden = isExpanded;

    const symbol = recordToggle.querySelector("span");
    if (symbol) {
      symbol.textContent = isExpanded ? "＋" : "−";
    }
  });
}

const artisanShopButton = document.getElementById("artisan-shop-button");
const artisanSupportButton = document.getElementById("artisan-support-button");
const artisanSupportStatus = document.getElementById("artisan-support-status");

function showArtisanMessage(message) {
  if (!artisanSupportStatus) return;

  artisanSupportStatus.textContent = message;
  artisanSupportStatus.hidden = false;
}

if (artisanShopButton) {
  artisanShopButton.addEventListener("click", () => {
    showArtisanMessage(
      "The artisan's shop link will appear here once a participating " +
      "artisan has approved the listing and shared their official shop URL."
    );
  });
}

if (artisanSupportButton) {
  artisanSupportButton.addEventListener("click", () => {
    showArtisanMessage(
      "You will be able to support the artisan through an approved " +
      "shop or payment link. No payment is processed on this demo website."
    );
  });
}

/* DHOKRA MITRA: SIMPLE QUESTION-ANSWER DEMO */
(() => {
  const launcher = document.getElementById("mitra-launcher");
  const panel = document.getElementById("mitra-panel");
  const closeButton = document.getElementById("mitra-close");
  const form = document.getElementById("mitra-form");
  const input = document.getElementById("mitra-input");
  const messages = document.getElementById("mitra-messages");
  const suggestions = document.querySelector(".mitra-suggestions");


if (!launcher || !panel || !form || !input || !messages) {
  console.error("Dhokra Mitra: Missing HTML element", {
    launcher: !!launcher,
    panel: !!panel,
    form: !!form,
    input: !!input,
    messages: !!messages
  });
  return;
}

  function togglePanel(open) {
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", String(open));

    if (open) input.focus();
    else launcher.focus();
  }

  launcher.addEventListener("click", () => {
    togglePanel(panel.hidden);
  });

 if (closeButton) {
  closeButton.addEventListener("click", () => togglePanel(false));
}
  function addMessage(text, sender) {
    const bubble = document.createElement("div");
    bubble.className = `mitra-message ${sender}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  
function getAnswer(question) {
  const q = question.toLowerCase();

  if (/\b(hello|hi|hey|namaste)\b/.test(q)) {
    return "Namaste! 🙏 Welcome to Dhokra Mitra. Ask me about artisans, products, the heritage passport, or supporting traditional crafts.";
  }

  // ABOUT THE ARTISAN
  if (q.includes("who makes") || q.includes("who is the artisan")) {
    return "Dhokra products are made by skilled artisans who practise traditional metal casting. The maker of a specific artifact should be identified through an artisan-approved profile. This demo does not identify a verified maker.";
  }

  if (q.includes("skills") || q.includes("experience")) {
    return "Dhokra artisans may use skills such as wax modelling, mould preparation, metal casting and finishing. The skills and experience of a particular artisan should be confirmed directly with them.";
  }

  if (q.includes("where is the artisan") || q.includes("artisan from")) {
    return "This project's sample artifact refers to the Bastar region of Chhattisgarh. The actual maker's location has not been verified in this demo.";
  }

  if (q.includes("contact the artisan") || q.includes("contact artisan")) {
    return "An approved artisan contact link can be added when the participating artisan gives permission. No direct artisan contact is connected yet.";
  }

  // ABOUT THE PRODUCT
  if (q.includes("made of") || q.includes("material") || q.includes("what is it made")) {
    return "Dhokra metalwork commonly uses non-ferrous metals such as brass or bronze, depending on the artisan and process. The exact material composition of this sample artifact has not been verified.";
  }

  if (q.includes("how is") || q.includes("process") || q.includes("lost wax")) {
    return "A traditional lost-wax process generally involves shaping a wax model, preparing a mould, removing the wax, pouring molten metal and finishing the casting. Specific methods can vary.";
  }

  if (q.includes("authentic") || q.includes("genuine") || q.includes("verify")) {
    return "This prototype does not independently verify authenticity. Check the record's evidence and sources, and seek confirmation from the maker or a qualified source. A QR code or artifact ID alone is not proof of authenticity.";
  }

  if (q.includes("care") || q.includes("clean") || q.includes("maintain")) {
    return "Keep your Dhokra piece dry and dust it gently with a soft, dry cloth. Avoid abrasive cleaners, harsh chemicals and prolonged moisture. If the item has a special finish, ask the maker for care instructions.";
  }

  if (q.includes("artifact id") || q.includes("passport") || q.includes("heritage record")) {
    return "The sample artifact ID is DHP-BASTAR-001. A Heritage Passport can show an artifact's description, information sources, verification status and update history. This sample record is illustrative.";
  }

  // BUYING AND SUPPORT
  if (q.includes("buy") || q.includes("purchase") || q.includes("shop")) {
    return "The artisan shop is not connected yet. Once a participating artisan approves their listing and shares a shop link, visitors can use that link to explore available products.";
  }

  if (q.includes("support") || q.includes("help the artisan")) {
    return "You can support artisans by purchasing through their approved shop, sharing their work with permission, and helping preserve traditional craft knowledge. The support links on this demo are not active yet.";
  }

  if (q.includes("payment") || q.includes("pay online") || q.includes("donate")) {
    return "Online payments are not available through this prototype. A verified, artisan-approved payment or shop link can be added in a future version. Do not send money through unverified links.";
  }

  if (q.includes("bastar") || q.includes("chhattisgarh") || q.includes("region")) {
    return "Bastar is a region of Chhattisgarh known for traditional arts and crafts, including Dhokra metalwork. The origin of a particular object should be confirmed separately.";
  }

  return "I don't have a reliable answer to that yet. Please try an FAQ about the artisan, product materials, craft process, authenticity, artifact ID, product care or artisan support.";
}


  function askQuestion(question) {
    const cleaned = question.trim();
    if (!cleaned) return;

    addMessage(cleaned, "user");
    addMessage(getAnswer(cleaned), "bot");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    askQuestion(input.value);
    input.value = "";
    input.focus();
  });


document.querySelectorAll(".mitra-faq-questions button[data-question]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      askQuestion(button.dataset.question);
    });
  }
);
})();
