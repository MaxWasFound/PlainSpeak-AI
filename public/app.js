const source = document.querySelector("#source");
const count = document.querySelector("#count");
const modeInput = document.querySelector("#mode");
const modeButtons = [...document.querySelectorAll(".mode-option")];
const go = document.querySelector("#go");
const goLabel = document.querySelector("#go-label");
const output = document.querySelector("#output");
const outputPanel = document.querySelector(".result-card");
const status = document.querySelector("#status");
const resultBadge = document.querySelector("#result-badge");
const copy = document.querySelector("#copy");
const clear = document.querySelector("#clear");
let latestResult = "";
let isWorking = false;

const example = "Photosynthesis is the biochemical process by which autotrophic organisms convert light energy into chemical energy, which is subsequently used to synthesize organic compounds from carbon dioxide and water.";
const labels = { simple: "Make it clearer", summary: "Summarise it", terms: "Explain these words" };
const resultLabels = { simple: "SIMPLIFIED VERSION", summary: "KEY POINTS", terms: "DIFFICULT WORDS, EXPLAINED" };

function updateCount() {
  const length = source.value.length;
  count.textContent = `${length.toLocaleString()} / 8,000 characters`;
  count.classList.toggle("near-limit", length >= 7200);
}

function setMode(nextMode) {
  modeInput.value = nextMode;
  modeButtons.forEach(button => {
    const active = button.dataset.mode === nextMode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  goLabel.textContent = labels[nextMode];
}

function resetCopyButton() {
  copy.innerHTML = '<span aria-hidden="true">▢</span> Copy result';
}

function message(title, detail, kind = "") {
  output.replaceChildren();
  const box = document.createElement("div");
  box.className = `message-state ${kind}`.trim();
  const mark = document.createElement("div");
  mark.className = "message-mark";
  mark.textContent = kind === "error" ? "!" : "✳";
  const heading = document.createElement("h3");
  heading.textContent = title;
  const paragraph = document.createElement("p");
  paragraph.textContent = detail;
  box.append(mark, heading, paragraph);
  output.append(box);
}

function showResult(text) {
  output.replaceChildren();
  const label = document.createElement("span");
  label.className = "result-label";
  label.textContent = resultLabels[modeInput.value];
  const paragraph = document.createElement("p");
  paragraph.className = "result-text";
  paragraph.textContent = text;
  output.append(label, paragraph);
  resultBadge.textContent = "COMPLETE";
  resultBadge.classList.add("complete");
}

source.addEventListener("input", updateCount);

document.querySelector("#example").addEventListener("click", () => {
  if (isWorking) return;
  source.value = example;
  updateCount();
  source.focus();
  status.textContent = "Example loaded — choose a mode";
});

clear.addEventListener("click", () => {
  if (isWorking) return;
  source.value = "";
  updateCount();
  latestResult = "";
  copy.disabled = true;
  resetCopyButton();
  output.replaceChildren();
  const empty = document.createElement("div");
  empty.className = "empty-state";
  const symbol = document.createElement("div");
  symbol.className = "empty-symbol";
  symbol.textContent = "✳";
  const heading = document.createElement("h3");
  heading.textContent = "Your aha moment goes here.";
  const detail = document.createElement("p");
  detail.textContent = "Your result will appear here, ready to read, copy, and use.";
  empty.append(symbol, heading, detail);
  output.append(empty);
  resultBadge.textContent = "READY";
  resultBadge.classList.remove("complete");
  status.textContent = "Waiting for your text";
  source.focus();
});

modeButtons.forEach(button => button.addEventListener("click", () => setMode(button.dataset.mode)));

async function processText() {
  const text = source.value.trim();
  if (isWorking) return;
  if (!text) {
    status.textContent = "Add some text first";
    source.focus();
    source.classList.add("input-error");
    source.addEventListener("input", () => source.classList.remove("input-error"), { once: true });
    return;
  }

  isWorking = true;
  go.disabled = true;
  clear.disabled = true;
  outputPanel.setAttribute("aria-busy", "true");
  goLabel.textContent = "Finding the clear version…";
  status.textContent = "Working on your text";
  resultBadge.textContent = "THINKING";
  resultBadge.classList.remove("complete");
  copy.disabled = true;
  resetCopyButton();
  message("Making the meaning clearer…", "This usually takes a few moments.");

  try {
    const response = await fetch("/api/simplify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, mode: modeInput.value })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
    if (typeof data.result !== "string" || !data.result.trim()) throw new Error("The AI returned an empty result. Please try again.");
    latestResult = data.result.trim();
    showResult(latestResult);
    status.textContent = "Result ready · Review before relying on it";
    copy.disabled = false;
  } catch (error) {
    latestResult = "";
    resultBadge.textContent = "TRY AGAIN";
    message("We couldn't create a result", error.message || "Check your connection and try again.", "error");
    status.textContent = "Your original text is still here";
  } finally {
    isWorking = false;
    go.disabled = false;
    clear.disabled = false;
    goLabel.textContent = labels[modeInput.value];
    outputPanel.setAttribute("aria-busy", "false");
  }
}

go.addEventListener("click", processText);
source.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    processText();
  }
});

copy.addEventListener("click", async () => {
  if (!latestResult) return;
  try {
    await navigator.clipboard.writeText(latestResult);
    copy.innerHTML = '<span aria-hidden="true">✓</span> Copied';
    status.textContent = "Copied to clipboard";
    window.setTimeout(resetCopyButton, 1800);
  } catch {
    status.textContent = "Clipboard access was blocked by your browser";
  }
});
