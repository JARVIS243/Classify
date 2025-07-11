let className = "";
let days = [];
let periodsPerDay = 0;
let subjects = [];

// === STEP 1: Handle Class Setup Form ===
document.getElementById("setup-form").addEventListener("submit", function (e) {
  e.preventDefault();

  className = document.getElementById("class-name").value.trim();
  days = document.getElementById("days").value.trim().split(",");
  periodsPerDay = parseInt(document.getElementById("periods").value);

  if (!className || days.length === 0 || isNaN(periodsPerDay)) {
    alert("Please enter valid class details.");
    return;
  }

  document.getElementById("subjects-section").style.display = "block";
  this.style.display = "none";
});

// === STEP 2: Add Subject Row ===
document.getElementById("add-subject").addEventListener("click", () => {
  const container = document.getElementById("subject-inputs");
  const row = document.createElement("div");
  row.className = "subject-row";
  row.innerHTML = `
    <input type="text" placeholder="Subject Name" class="subject-name" />
    <input type="text" placeholder="Teacher Name" class="teacher-name" />
    <input type="number" placeholder="Periods/Week" class="subject-count" min="1" />
    <button type="button" class="remove-subject">❌</button>
  `;
  container.appendChild(row);
});

// === STEP 3: Remove Subject Row ===
document.getElementById("subject-inputs").addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-subject")) {
    e.target.parentElement.remove();
  }
});

// === STEP 4: Generate Timetable on Button Click ===
document.getElementById("generate-timetable").addEventListener("click", () => {
  const names = document.querySelectorAll(".subject-name");
  const teachers = document.querySelectorAll(".teacher-name");
  const counts = document.querySelectorAll(".subject-count");

  subjects = [];

  for (let i = 0; i < names.length; i++) {
    const subject = names[i].value.trim();
    const teacher = teachers[i].value.trim();
    const count = parseInt(counts[i].value);

    if (subject && teacher && count > 0) {
      subjects.push({ subject, teacher, count });
    }
  }

  if (subjects.length === 0) {
    alert("Please add at least one valid subject.");
    return;
  }

  generateTimetable();
});

// === STEP 5: Generate Timetable Logic ===
function generateTimetable() {
  let timetable = Array.from({ length: days.length }, () =>
    Array(periodsPerDay).fill("")
  );

  let slots = [];
  days.forEach((_, dayIdx) => {
    for (let p = 0; p < periodsPerDay; p++) {
      slots.push({ dayIdx, periodIdx: p });
    }
  });

  shuffle(slots);
  const usedSlots = new Set();

  subjects.forEach((item) => {
    let placed = 0;
    while (placed < item.count && slots.length > 0) {
      const slot = slots.pop();
      const key = `${slot.dayIdx}-${slot.periodIdx}-${item.teacher}`;
      if (!usedSlots.has(key)) {
        timetable[slot.dayIdx][slot.periodIdx] = `${item.subject} (${item.teacher})`;
        usedSlots.add(key);
        placed++;
      }
    }
  });

  // Save data to localStorage for timetable.html
  localStorage.setItem("generatedTimetable", JSON.stringify({
    data: timetable,
    className,
    days,
    periodsPerDay
  }));

  // Redirect to second page
  window.location.href = "timetable.html";
}

// === Utility Function: Shuffle Array ===
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
