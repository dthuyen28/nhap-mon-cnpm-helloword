let quizzes = {};
let currentQuestions = [];

async function loadQuizzes() {
  const res = await fetch("data/quizzes.json");
  quizzes = await res.json();

  // Hiển thị danh sách môn
  const subjectSel = document.getElementById("subject");
  subjectSel.innerHTML = "";
  for (let subject in quizzes) {
    let opt = document.createElement("option");
    opt.value = subject;
    opt.textContent = subject.toUpperCase();
    subjectSel.appendChild(opt);
  }

  // Khi đổi môn thì load đề
  subjectSel.addEventListener("change", loadExams);
  loadExams();
}

function loadExams() {
  const subject = document.getElementById("subject").value;
  const examSel = document.getElementById("exam");
  examSel.innerHTML = "";
  for (let exam in quizzes[subject]) {
    let opt = document.createElement("option");
    opt.value = exam;
    opt.textContent = exam.toUpperCase();
    examSel.appendChild(opt);
  }
}

function startQuiz() {
  const subject = document.getElementById("subject").value;
  const exam = document.getElementById("exam").value;
  currentQuestions = quizzes[subject][exam];
  renderQuiz();
}

function renderQuiz() {
  const container = document.getElementById("quiz");
  container.innerHTML = "";
  currentQuestions.forEach((q, i) => {
    const div = document.createElement("div");
    div.innerHTML = `<h3>Câu ${i+1}: ${q.title}</h3>`;
    q.options.forEach((opt, j) => {
      div.innerHTML += `
        <label>
          <input type="radio" name="q${q.id}" value="${j}">
          ${opt}
        </label><br>`;
    });
    container.appendChild(div);
  });
}

function submitQuiz() {
  let score = 0;
  currentQuestions.forEach(q => {
    const checked = document.querySelector(`input[name="q${q.id}"]:checked`);
    if (checked && parseInt(checked.value) === q.answer) {
      score++;
    }
  });
  document.getElementById("result").innerText = 
    `Bạn đúng ${score}/${currentQuestions.length} câu.`;
}

loadQuizzes();
