// ==UserScript==
// @name         Webpage Data Panel
// @namespace    https://github.com/nathfung83-creator/Userscript
// @version      1.0
// @description  shows eta reat time, words, and reading progress
// @match        https://*.wikipedia.org/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
    #firstHeading + p {
      font-style: italic;
      color: blue;
    }

    #panel {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      background-color: #4682d1;
      color: #ffffff;
      border: 1px solid #ffffff;
      border-radius: 5px;
      padding: 12px 18px;
      font-family: system-ui, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      min-width: 220px;
    }

    #panel .panel-title {
      font-weight: 700;
      font-size: 16px;
      margin-bottom: 8px;
      color: #ffffff;
    }

    #panel .panel-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-top: 4px;
    }
  `;
  document.head.append(style);

  // Build the panel UI
  const panel = document.createElement("div");
  panel.id = "panel";

  const title = document.createElement("div");
  title.className = "panel-title";
  title.textContent = "Webpage Data";

  const readTimeRow = document.createElement("div");
  readTimeRow.className = "panel-row";
  const readTimeLabel = document.createElement("span");
  readTimeLabel.textContent = "Estimated Read Time:";
  const readTimeValue = document.createElement("strong");
  readTimeValue.textContent = "Calculating...";
  readTimeRow.append(readTimeLabel, readTimeValue);

  const wordCountRow = document.createElement("div");
  wordCountRow.className = "panel-row";
  const wordCountLabel = document.createElement("span");
  wordCountLabel.textContent = "Word Count:";
  const wordCountValue = document.createElement("strong");
  wordCountValue.textContent = "0";
  wordCountRow.append(wordCountLabel, wordCountValue);

  const progressRow = document.createElement("div");
  progressRow.className = "panel-row";
  const progressLabel = document.createElement("span");
  progressLabel.textContent = "Progress:";
  const progressValue = document.createElement("strong");
  progressValue.textContent = "0%";
  progressRow.append(progressLabel, progressValue);

  panel.append(title, readTimeRow, wordCountRow, progressRow);

  function placePanel() {
    if (document.body && !document.body.contains(panel)) {
      document.body.append(panel);
    }
  }

  function updateReadTime() {
    let words = 0;

    for (const paragraph of document.querySelectorAll("p")) {
      if (panel.contains(paragraph)) continue;
      const tokens = paragraph.textContent.trim().split(/\s+/).filter(Boolean);
      words += tokens.length;
    }

    wordCountValue.textContent = words.toLocaleString();

    if (words > 0) {
      const minutes = Math.max(1, Math.ceil(words / 200));
      readTimeValue.textContent = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else {
      readTimeValue.textContent = "No text is located inside this page.";
    }
  }

  function updateScrollProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) {
      progressValue.textContent = "100%";
      return;
    }
    const percent = Math.min(100, Math.max(0, Math.floor((window.scrollY / scrollable) * 100)));
    progressValue.textContent = `${percent}%`;
  }

  placePanel();
  updateReadTime();
  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
})();