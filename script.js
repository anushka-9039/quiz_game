let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let quizData = [];
let timerInterval;

async function startQuiz() {
    const category = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;

    document.getElementById('category-selection').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    document.getElementById('time').textContent = timeLeft;
    
    const response = await fetch(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`);
    const data = await response.json();
    quizData = data.results;
    
    displayQuestion();
    startTimer();
}

function displayQuestion() {
    const questionData = quizData[currentQuestionIndex];
    document.getElementById('question').textContent = questionData.question;
    
    const answers = [...questionData.incorrect_answers, questionData.correct_answer];
    shuffleArray(answers);
    
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';
    
    answers.forEach(answer => {
        const answerDiv = document.createElement('div');
        answerDiv.textContent = answer;
        answerDiv.onclick = () => selectAnswer(answer);
        answersContainer.appendChild(answerDiv);
    });
    
    document.getElementById('question-number').textContent = currentQuestionIndex + 1;
}

function selectAnswer(answer) {
    const correctAnswer = quizData[currentQuestionIndex].correct_answer;
    
    if (answer === correctAnswer) {
        score++;
    }
    
    document.querySelectorAll('#answers div').forEach(div => {
        div.style.pointerEvents = 'none';
    });

    document.getElementById('next').style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex === quizData.length) {
        clearInterval(timerInterval);
        showResult();
    } else {
        displayQuestion();
        document.getElementById('next').style.display = 'none';
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            nextQuestion();
        }
    }, 1000);
}

function showResult() {
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    document.getElementById('final-score').textContent = score;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 30;
    document.getElementById('result').style.display = 'none';
    document.getElementById('category-selection').style.display = 'block';
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
