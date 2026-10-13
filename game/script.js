const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

const $ = (id) => document.getElementById(id);

const setup = $('setup');
const quizArea = $('quiz-area');
const resultArea = $('result-area');

let questions = [];
let current = 0;
let score = 0;
let timeLeft = 20;
let timer = null;
let locked = false;
let questionCount = 10;

const questionBank = {
    Matematika: [
        {
            q: '12 × 8 nechaga teng?',
            a: ['86', '96', '88', '108'],
            correct: 1
        },
        {
            q: '144 ning kvadrat ildizi nechaga teng?',
            a: ['10', '11', '12', '14'],
            correct: 2
        },
        {
            q: '3x = 27 bo‘lsa, x nechaga teng?',
            a: ['6', '8', '9', '12'],
            correct: 2
        },
        {
            q: 'Uchburchak ichki burchaklari yig‘indisi necha gradus?',
            a: ['90°', '180°', '270°', '360°'],
            correct: 1
        },
        {
            q: '2 ning 5-darajasi nechaga teng?',
            a: ['10', '16', '25', '32'],
            correct: 3
        }
    ],

    Fizika: [
        {
            q: 'Elektr tokining SI sistemasidagi birligi qaysi?',
            a: ['Volt', 'Amper', 'Om', 'Vatt'],
            correct: 1
        },
        {
            q: 'Kuchning SI birligi qaysi?',
            a: ['Joul', 'Paskal', 'Nyuton', 'Vatt'],
            correct: 2
        },
        {
            q: 'Suv normal atmosfera bosimida necha °C da qaynaydi?',
            a: ['0 °C', '50 °C', '100 °C', '120 °C'],
            correct: 2
        }
    ],

    Ingliz_tili: [
        {
            q: 'Choose the correct form: She ___ to school every day.',
            a: ['go', 'goes', 'going', 'gone'],
            correct: 1
        },
        {
            q: 'What is the past form of “eat”?',
            a: ['eated', 'eaten', 'ate', 'eats'],
            correct: 2
        }
    ]
};

function getQuestions(subject) {
    const oldQuestions = questionBank[subject] || [];
    const newQuestions = window.extraQuestions?.[subject] || [];

    return [...oldQuestions, ...newQuestions];
}
function showOnly(section) {
    setup.hidden = true;
    quizArea.hidden = true;
    resultArea.hidden = true;
    section.hidden = false;
}

document.querySelectorAll('.game-card').forEach((card) => {
    card.addEventListener('click', () => {
        const mode = card.dataset.mode;

        if (mode === 'quiz') {
            $('setup-title').textContent = 'Quiz Game';
            setup.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        const message = mode === 'battle'
            ? 'Brain Battle rejimini keyingi bosqichda yaratamiz!'
            : 'Super Game Center mini-o‘yinlarini keyingi bosqichda yaratamiz!';

        alert(message);
    });
});

$('start-game').addEventListener('click', () => {
    const subject = $('subject').value;
    const bank = getQuestions(subject);

    if (!bank.length) {
        alert('Bu fan uchun savollarni hali qo‘shmadik. Savollarni birgalikda tayyorlaymiz!');
        return;
    }

    questionCount = Number($('count').value);
    questions = [...bank]
        .sort(() => Math.random() - 0.5)
        .slice(0, questionCount);

    current = 0;
    score = 0;

    $('quiz-subject').textContent = subject.toUpperCase();
    showOnly(quizArea);
    renderQuestion();
});

function renderQuestion() {
    clearInterval(timer);
    locked = false;
    timeLeft = 20;

    const item = questions[current];

    $('question-counter').textContent =
        `${current + 1} / ${questions.length}`;

    $('progress').style.width =
        `${(current / questions.length) * 100}%`;

    $('question').textContent = item.q;
    $('timer').textContent = `⏱ ${timeLeft}`;
    $('feedback').textContent = '';
    $('next-question').hidden = true;

    const answers = $('answers');
    answers.replaceChildren();

    item.a.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;

        button.addEventListener('click', () => chooseAnswer(index));

        answers.appendChild(button);
    });

    timer = setInterval(() => {
        timeLeft--;
        $('timer').textContent = `⏱ ${timeLeft}`;

        if (timeLeft <= 0) {
            finishQuestion(null);
        }
    }, 1000);
}

function chooseAnswer(index) {
    if (locked) return;
    finishQuestion(index);
}

function finishQuestion(index) {
    if (locked) return;

    locked = true;
    clearInterval(timer);

    const item = questions[current];
    const buttons = [...$('answers').children];

    buttons.forEach((button, i) => {
        button.disabled = true;

        if (i === item.correct) {
            button.classList.add('correct');
        }

        if (i === index && i !== item.correct) {
            button.classList.add('wrong');
        }
    });

    if (index === item.correct) {
        score += 100;
        $('feedback').textContent = '✅ To‘g‘ri! +100 ball';
    } else if (index === null) {
        $('feedback').textContent = '⏰ Vaqt tugadi!';
    } else {
        $('feedback').textContent = '❌ Noto‘g‘ri javob. Yashil variant — to‘g‘ri javob.';
    }

    $('progress').style.width =
        `${((current + 1) / questions.length) * 100}%`;

    $('next-question').textContent =
        current === questions.length - 1
            ? 'NATIJANI KO‘RISH →'
            : 'KEYINGI SAVOL →';

    $('next-question').hidden = false;
}

$('next-question').addEventListener('click', () => {
    current++;

    if (current >= questions.length) {
        showResult();
    } else {
        renderQuestion();
    }
});

function showResult() {
    clearInterval(timer);
    showOnly(resultArea);

    $('final-score').textContent = score;
    $('result-text').textContent =
        `${questions.length} ta savoldan ${score / 100} tasiga to‘g‘ri javob berding!`;
}

$('quit-game').addEventListener('click', () => {
    clearInterval(timer);
    showOnly(setup);
});

$('play-again').addEventListener('click', () => {
    showOnly(setup);
});