/* ============================================================
   Student Grading System — script.js
   Demonstrates: control structures (if-else), loops, and
   client-side form validation, split into modular functions.
   ============================================================ */

// Number of subjects the form collects marks for.
const SUBJECT_COUNT = 5;

// Subject names, in the same order as subject1..subject5 in the form.
const SUBJECT_NAMES = [
  "Data Analytics",
  "Economics",
  "Business for Data Driven Companies",
  "Operating Systems",
  "DBMS",
];

// Marks below this value, in ANY subject, cause an automatic fail
// regardless of overall percentage.
const FAIL_THRESHOLD_PER_SUBJECT = 35;

// DOM references used across functions.
const studentNameInput = document.getElementById("studentName");
const rollNumberInput = document.getElementById("rollNumber");
const evaluateBtn = document.getElementById("evaluateBtn");
const resetBtn = document.getElementById("resetBtn");

const reportSection = document.getElementById("reportSection");

/**
 * Builds an array of the 5 subject <input> elements using a loop,
 * rather than referencing subject1..subject5 by hand everywhere.
 */
function getSubjectInputs() {
  const inputs = [];
  for (let i = 1; i <= SUBJECT_COUNT; i++) {
    inputs.push(document.getElementById("subject" + i));
  }
  return inputs;
}

/**
 * Clears all inline error messages and error styling.
 * Called at the start of every validation pass.
 */
function clearErrors() {
  const errorSpans = document.querySelectorAll(".field__error");
  errorSpans.forEach((span) => {
    span.textContent = "";
  });

  const errorFields = document.querySelectorAll(".field.has-error");
  errorFields.forEach((field) => {
    field.classList.remove("has-error");
  });
}

/**
 * Displays an inline error message below the given input's field wrapper.
 */
function showError(inputEl, message) {
  const fieldWrapper = inputEl.closest(".field");
  const errorSpan = document.getElementById("error-" + inputEl.id);

  if (fieldWrapper) {
    fieldWrapper.classList.add("has-error");
  }
  if (errorSpan) {
    errorSpan.textContent = message;
  }
}

/**
 * Validates the entire form: student name, roll number, and marks.
 * Returns true if every field is valid, false otherwise.
 * Uses if-else control structures for each validation rule.
 */
function validateForm() {
  clearErrors();
  let isValid = true;

  // --- Student Name ---
  const nameValue = studentNameInput.value.trim();
  const nameRegex = /^[A-Za-z\s]+$/;

  if (nameValue === "") {
    showError(studentNameInput, "Student name is required.");
    isValid = false;
  } else if (!nameRegex.test(nameValue)) {
    showError(studentNameInput, "Name should contain only alphabets and spaces.");
    isValid = false;
  }

  // --- Roll Number ---
  const rollValue = rollNumberInput.value.trim();
  const rollRegex = /^[0-9]+$/;

  if (rollValue === "") {
    showError(rollNumberInput, "Roll number is required.");
    isValid = false;
  } else if (!rollRegex.test(rollValue)) {
    showError(rollNumberInput, "Roll number should contain only digits.");
    isValid = false;
  }

  // --- Subject Marks --- (looped instead of repeated per-field checks)
  const subjectInputs = getSubjectInputs();

  for (let i = 0; i < subjectInputs.length; i++) {
    const input = subjectInputs[i];
    const rawValue = input.value.trim();

    if (rawValue === "") {
      showError(input, "Required.");
      isValid = false;
    } else {
      const numericValue = Number(rawValue);

      if (Number.isNaN(numericValue)) {
        showError(input, "Must be a number.");
        isValid = false;
      } else if (numericValue < 0 || numericValue > 100) {
        showError(input, "Must be 0–100.");
        isValid = false;
      }
    }
  }

  return isValid;
}

/**
 * Determines the letter grade for a given percentage using if-else.
 */
function calculateGrade(percentage) {
  if (percentage >= 90) {
    return "A+";
  } else if (percentage >= 80) {
    return "A";
  } else if (percentage >= 70) {
    return "B";
  } else if (percentage >= 60) {
    return "C";
  } else if (percentage >= 50) {
    return "D";
  } else {
    return "F";
  }
}

/**
 * Gathers marks, computes total/percentage/grade/pass-fail,
 * and returns a single result object consumed by the renderer.
 */
function calculateResult() {
  const subjectInputs = getSubjectInputs();
  const marks = [];
  let total = 0;
  let hasFailingSubject = false;

  // Loop through each subject mark instead of repeating code 5 times.
  for (let i = 0; i < subjectInputs.length; i++) {
    const value = Number(subjectInputs[i].value.trim());
    marks.push(value);
    total += value;

    if (value < FAIL_THRESHOLD_PER_SUBJECT) {
      hasFailingSubject = true;
    }
  }

  const maxTotal = SUBJECT_COUNT * 100;
  const percentage = (total / maxTotal) * 100;
  const grade = calculateGrade(percentage);

  // A student fails if any single subject is below the threshold,
  // OR their overall grade works out to F.
  let status;
  if (hasFailingSubject || grade === "F") {
    status = "FAIL";
  } else {
    status = "PASS";
  }

  return {
    name: studentNameInput.value.trim(),
    roll: rollNumberInput.value.trim(),
    marks: marks,
    total: total,
    maxTotal: maxTotal,
    percentage: percentage,
    grade: grade,
    status: status,
  };
}

/**
 * Renders the computed result into the transcript panel and
 * reveals it in place of the placeholder message.
 */
function renderReport(result) {
  document.getElementById("reportName").textContent = result.name;
  document.getElementById("reportRoll").textContent = "Roll No. " + result.roll;
  document.getElementById("reportGrade").textContent = result.grade;
  document.getElementById("reportPercentage").textContent = result.percentage.toFixed(1) + "%";
  document.getElementById("reportTotal").textContent = result.total + " / " + result.maxTotal;

  const statusBadge = document.getElementById("statusBadge");
  statusBadge.textContent = result.status;
  statusBadge.classList.remove("status-badge--pass", "status-badge--fail");
  statusBadge.classList.add(result.status === "PASS" ? "status-badge--pass" : "status-badge--fail");

  // Progress bar reflects percentage, clamped to [0, 100] for width safety.
  const clampedPercentage = Math.max(0, Math.min(100, result.percentage));
  document.getElementById("progressFill").style.width = clampedPercentage + "%";
  document.getElementById("progressPercentLabel").textContent = result.percentage.toFixed(0) + "%";

  // Build the subject-wise breakdown list using a loop.
  const breakdownList = document.getElementById("breakdownList");
  breakdownList.innerHTML = "";

  for (let i = 0; i < result.marks.length; i++) {
    const mark = result.marks[i];
    const isLow = mark < FAIL_THRESHOLD_PER_SUBJECT;

    const li = document.createElement("li");

    const nameSpan = document.createElement("span");
    nameSpan.className = "subject-name";
    nameSpan.textContent = SUBJECT_NAMES[i];

    const figuresWrap = document.createElement("span");
    figuresWrap.className = "subject-figures";

    const markSpan = document.createElement("span");
    markSpan.className = "subject-mark";
    if (isLow) {
      markSpan.classList.add("is-low");
    }
    markSpan.textContent = mark + " / 100";

    const gradeSpan = document.createElement("span");
    gradeSpan.className = "subject-grade";
    if (isLow) {
      gradeSpan.classList.add("is-low");
    }
    // Subject-wise grade uses the same grading scale as the overall grade.
    gradeSpan.textContent = calculateGrade(mark);

    figuresWrap.appendChild(markSpan);
    figuresWrap.appendChild(gradeSpan);

    li.appendChild(nameSpan);
    li.appendChild(figuresWrap);
    breakdownList.appendChild(li);
  }

  reportSection.hidden = false;
  reportSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Hides the report section entirely (used on reset or failed validation).
 */
function resetReport() {
  reportSection.hidden = true;
}

/**
 * Handles the "Evaluate Performance" click: validate, then
 * compute and render, or leave inline errors in place.
 */
function handleEvaluate() {
  const isValid = validateForm();

  if (!isValid) {
    resetReport();
    return;
  }

  const result = calculateResult();
  renderReport(result);
}

/**
 * Handles the "Reset Form" click: clears all inputs, errors,
 * and returns the report panel to its placeholder state.
 */
function handleReset() {
  studentNameInput.value = "";
  rollNumberInput.value = "";

  const subjectInputs = getSubjectInputs();
  for (let i = 0; i < subjectInputs.length; i++) {
    subjectInputs[i].value = "";
  }

  clearErrors();
  resetReport();
  studentNameInput.focus();
}

// ============ EVENT LISTENERS ============
evaluateBtn.addEventListener("click", handleEvaluate);
resetBtn.addEventListener("click", handleReset);

// Allow pressing Enter inside any input to trigger evaluation.
document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleEvaluate();
    }
  });
});