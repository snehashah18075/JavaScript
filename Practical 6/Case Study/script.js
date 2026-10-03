// ============================================
// Practical 6 — Email & Text Analyzer
// String Functions + Regular Expressions
// ============================================

const emailInput = document.getElementById("emailInput");
const validateBtn = document.getElementById("validateBtn");
const emailResult = document.getElementById("emailResult");

const textInput = document.getElementById("textInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");

const statChars = document.getElementById("statChars");
const statWords = document.getElementById("statWords");
const statNumbers = document.getElementById("statNumbers");
const statEmails = document.getElementById("statEmails");

const extractedEmails = document.getElementById("extractedEmails");
const extractedNumbers = document.getElementById("extractedNumbers");

// ---------- Regex patterns ----------
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const EMAIL_FIND_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const NUMBER_REGEX = /\d+/g;

// ---------- 1. Email Validation ----------
validateBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();

  if (!email) {
    emailResult.textContent = "Please enter an email address.";
    emailResult.className = "result-msg invalid";
    return;
  }

  if (EMAIL_REGEX.test(email)) {
    emailResult.textContent = "✓ Valid Email Address";
    emailResult.className = "result-msg valid";
  } else {
    emailResult.textContent = "✗ Invalid Email Address";
    emailResult.className = "result-msg invalid";
  }
});

// Allow Enter key to trigger validation
emailInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") validateBtn.click();
});

// ---------- 2. Text Analyzer ----------
analyzeBtn.addEventListener("click", () => {
  const text = textInput.value;
  analyzeText(text);
});

clearBtn.addEventListener("click", () => {
  textInput.value = "";
  resetDashboard();
});

function analyzeText(text) {
  // Character count (using string length)
  const charCount = text.length;

  // Word count (split on whitespace using string functions)
  const trimmed = text.trim();
  const wordCount = trimmed === "" ? 0 : trimmed.split(/\s+/).length;

  // Extract numbers using regex
  const numbersFound = text.match(NUMBER_REGEX) || [];

  // Extract emails using regex
  const emailsFound = text.match(EMAIL_FIND_REGEX) || [];

  // Update dashboard stat cards
  statChars.textContent = charCount;
  statWords.textContent = wordCount;
  statNumbers.textContent = numbersFound.length;
  statEmails.textContent = emailsFound.length;

  // Update extracted data section
  extractedEmails.textContent = emailsFound.length > 0
    ? emailsFound.join(", ")
    : "No emails found";

  extractedNumbers.textContent = numbersFound.length > 0
    ? numbersFound.join(", ")
    : "No numbers found";
}

function resetDashboard() {
  statChars.textContent = "0";
  statWords.textContent = "0";
  statNumbers.textContent = "0";
  statEmails.textContent = "0";
  extractedEmails.textContent = "—";
  extractedNumbers.textContent = "—";
}