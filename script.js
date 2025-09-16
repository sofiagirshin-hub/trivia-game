// ===== משתנים גלובליים =====
let currentCategory = '';      // הקטגוריה שנבחרה
let currentQuestion = 0;       // מספר השאלה הנוכחית
let score = 0;                 // ניקוד השחקן
let timeLeft = 15;             // זמן נותר לשאלה
let timer;                     // טיימר האינטרוול
let questions = [];            // מערך השאלות הנוכחי
let hasAnswered = false;       // האם השחקן כבר ענה

// ===== בנק השאלות =====
const questionBank = {
    general: [
        {
            question: "מה היא הבירה של אוסטרליה?",
            answers: ["סידני", "מלבורן", "קנברה", "פרת'"],
            correct: 2
        },
        {
            question: "איזה צבע מתקבל כאשר מערבבים כחול ואדום?",
            answers: ["ירוק", "סגול", "כתום", "צהוב"],
            correct: 1
        },
        {
            question: "כמה יבשות יש על כדור הארץ?",
            answers: ["5", "6", "7", "8"],
            correct: 2
        },
        {
            question: "איזה אוקיינוס הוא הגדול בעולם?",
            answers: ["האוקיינוס האטלנטי", "האוקיינוס השקט", "האוקיינוס ההודי", "הים התיכון"],
            correct: 1
        },
        {
            question: "כמה שעות יש ביום?",
            answers: ["23", "24", "25", "26"],
            correct: 1
        }
    ],
    
    science: [
        {
            question: "מה הוא הסמל הכימי של זהב?",
            answers: ["Go", "Au", "Ag", "Zn"],
            correct: 1
        },
        {
            question: "איזה כוכב לכת הכי קרוב לשמש?",
            answers: ["נוגה", "כוכב חמה", "כדור הארץ", "מאדים"],
            correct: 1
        },
        {
            question: "מה הוא הגז הנפוץ ביותר באטמוספירה?",
            answers: ["חמצן", "חנקן", "פחמן דו חמצני", "ארגון"],
            correct: 1
        },
        {
            question: "כמה עצמות יש בגוף האדם הבוגר?",
            answers: ["196", "206", "216", "226"],
            correct: 1
        },
        {
            question: "מהי מהירות האור?",
            answers: ["299,792,458 מ/ש", "300,000,000 מ/ש", "250,000,000 מ/ש", "350,000,000 מ/ש"],
            correct: 0
        }
    ],
    
    sports: [
        {
            question: "בכמה שחקנים מתחיל משחק כדורגל לכל קבוצה?",
            answers: ["10", "11", "12", "9"],
            correct: 1
        },
        {
            question: "איזה ענף ספורט קשור לטורניר ווימבלדון?",
            answers: ["גולף", "טניס", "כדורסל", "שחייה"],
            correct: 1
        },
        {
            question: "כמה פעמים זכתה ברזיל במונדיאל?",
            answers: ["4", "5", "6", "3"],
            correct: 1
        },
        {
            question: "באיזה ספורט משתמשים במחבט?",
            answers: ["כדורגל", "טניס", "בייסבול", "גולף"],
            correct: 2
        },
        {
            question: "כמה שחקנים יש בקבוצת כדורסל בזמן המשחק?",
            answers: ["4", "5", "6", "7"],
            correct: 1
        }
    ],
    
    history: [
        {
            question: "באיזו שנה הוקמה מדינת ישראל?",
            answers: ["1947", "1948", "1949", "1950"],
            correct: 1
        },
        {
            question: "מי היה הקיסר הראשון של רומא?",
            answers: ["יוליוס קיסר", "אוגוסטוס", "נירו", "טראיאנוס"],
            correct: 1
        },
        {
            question: "באיזו שנה נפלה חומת ברלין?",
            answers: ["1987", "1988", "1989", "1990"],
            correct: 2
        },
        {
            question: "מי גילה את אמריקה?",
            answers: ["מרקו פולו", "כריסטופר קולומבוס", "ואסקו דה גאמה", "מגלן"],
            correct: 1
        },
        {
            question: "באיזו מלחמת עולם השתמשו לראשונה בנשק גרעיני?",
            answers: ["מלחמת העולם הראשונה", "מלחמת העולם השנייה", "מלחמת קוריאה", "מלחמת וייטנאם"],
            correct: 1
        }
    ]
};

// ===== פונקציות המשחק =====

/**
 * בחירת קטגוריה
 * @param {string} category - הקטגוריה שנבחרה
 */
function selectCategory(category) {
    currentCategory = category;
    
    // איפוס עיצוב כפתורים
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // סימון הכפתור שנבחר
    event.target.classList.add('selected');
    
    // הפעלת כפתור ההתחלה
    document.getElementById('startBtn').disabled = false;
    
    console.log(`נבחרה קטגוריה: ${category}`);
}

/**
 * התחלת המשחק
 */
function startGame() {
    console.log('המשחק מתחיל!');
    
    // הסתרת מסך הפתיחה והצגת מסך המשחק
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    
    // הכנת השאלות
    questions = [...questionBank[currentCategory]];
    
    // ערבוב השאלות לסדר אקראי
    questions = shuffleArray(questions);
    
    // איפוס משתנים
    currentQuestion = 0;
    score = 0;
    
    // התחלת השאלה הראשונה
    showQuestion();
}

/**
 * הצגת שאלה
 */
function showQuestion() {
    console.log(`מציג שאלה ${currentQuestion + 1}`);
    
    // בדיקה אם נגמרו השאלות
    if (currentQuestion >= questions.length) {
        endGame();
        return;
    }

    // איפוס משתנים לשאלה החדשה
    hasAnswered = false;
    timeLeft = 15;
    
    const question = questions[currentQuestion];
    
    // עדכון תוכן הדף
    document.getElementById('questionNumber').textContent = 
        `שאלה ${currentQuestion + 1} מתוך ${questions.length}`;
    document.getElementById('question').textContent = question.question;
    document.getElementById('score').textContent = `ניקוד: ${score}`;
    document.getElementById('nextBtn').style.display = 'none';
    
    // יצירת כפתורי התשובות
    createAnswerButtons(question);
    
    // התחלת הטיימר
    startTimer();
}

/**
 * יצירת כפתורי התשובות
 * @param {Object} question - אובייקט השאלה
 */
function createAnswerButtons(question) {
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.onclick = () => selectAnswer(index);
        answersContainer.appendChild(button);
    });
}

/**
 * התחלת הטיימר
 */
function startTimer() {
    // איפוס טיימר קודם
    if (timer) {
        clearInterval(timer);
    }
    
    timer = setInterval(() => {
        document.getElementById('timer').textContent = `זמן: ${timeLeft}`;
        
        // צביעת הטיימר באדום כשנשארו 5 שניות
        const timerElement = document.getElementById('timer');
        if (timeLeft <= 5) {
            timerElement.style.background = '#dc3545';
        } else {
            timerElement.style.background = '#333';
        }
        
        timeLeft--;
        
        // סיום הזמן
        if (timeLeft < 0) {
            clearInterval(timer);
            if (!hasAnswered) {
                console.log('הזמן נגמר!');
                showCorrectAnswer();
                document.getElementById('nextBtn').style.display = 'block';
            }
        }
    }, 1000);
}

/**
 * בחירת תשובה
 * @param {number} selectedIndex - אינדקס התשובה שנבחרה
 */
function selectAnswer(selectedIndex) {
    if (hasAnswered) return;
    
    console.log(`נבחרה תשובה: ${selectedIndex}`);
    
    hasAnswered = true;
    clearInterval(timer);
    
    const question = questions[currentQuestion];
    const buttons = document.querySelectorAll('.answer-btn');
    
    // הדגשת התשובה הנכונה
    buttons[question.correct].classList.add('correct');
    
    // בדיקה אם התשובה נכונה
    if (selectedIndex === question.correct) {
        console.log('תשובה נכונה!');
        // ניקוד גבוה יותר לתשובה מהירה
        const timeBonus = Math.max(1, timeLeft + 1);
        score += timeBonus;
        
        // הדגשת התשובה שנבחרה כנכונה
        buttons[selectedIndex].classList.add('user-correct');
    } else {
        console.log('תשובה שגויה!');
        // הדגשת התשובה השגויה
        buttons[selectedIndex].classList.add('incorrect');
    }
    
    // עדכון הניקוד
    document.getElementById('score').textContent = `ניקוד: ${score}`;
    
    // הצגת כפתור המעבר לשאלה הבאה
    document.getElementById('nextBtn').style.display = 'block';
}

/**
 * הצגת התשובה הנכונה (כשהזמן נגמר)
 */
function showCorrectAnswer() {
    const question = questions[currentQuestion];
    const buttons = document.querySelectorAll('.answer-btn');
    buttons[question.correct].classList.add('correct');
}

/**
 * מעבר לשאלה הבאה
 */
function nextQuestion() {
    console.log('מעבר לשאלה הבאה');
    
    // איפוס עיצוב כפתורי התשובות
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('correct', 'incorrect', 'user-correct');
    });
    
    currentQuestion++;
    showQuestion();
}

/**
 * סיום המשחק
 */
function endGame() {
    console.log('המשחק הסתיים!');
    
    // הסתרת מסך המשחק והצגת מסך התוצאות
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'block';
    
    // חישוב הניקוד המקסימלי האפשרי
    const maxScore = questions.length * 16; // 15 שניות + 1 נקודה בסיס
    const percentage = Math.round((score / maxScore) * 100);
    
    // הצגת הניקוד
    document.getElementById('finalScore').textContent = 
        `ניקוד סופי: ${score} מתוך ${maxScore} (${percentage}%)`;
    
    // הודעה על פי הביצוע
    let message = '';
    if (percentage >= 90) {
        message = '🏆 מושלם! אתה גאון אמיתי!';
    } else if (percentage >= 80) {
        message = '🌟 מעולה! ביצוע מרשים!';
    } else if (percentage >= 70) {
        message = '👏 כל הכבוד! ביצוע טוב מאוד!';
    } else if (percentage >= 60) {
        message = '👍 לא רע! יש פוטנציאל';
    } else if (percentage >= 40) {
        message = '💪 צריך להתרגל עוד קצת';
    } else {
        message = '📚 כדאי ללמוד עוד ולנסות שוב';
    }
    
    document.getElementById('performanceMessage').textContent = message;
    
    // שמירת הישג הטוב ביותר
    saveHighScore(score, currentCategory);
}

/**
 * איפוס המשחק לתחילה
 */
function resetGame() {
    console.log('איפוס המשחק');
    
    // הסתרת מסך התוצאות והצגת מסך הפתיחה
    document.getElementById('resultsScreen').style.display = 'none';
    document.getElementById('welcomeScreen').style.display = 'block';
    
    // איפוס כל המשתנים
    currentCategory = '';
    currentQuestion = 0;
    score = 0;
    timeLeft = 15;
    hasAnswered = false;
    
    // איפוס בחירת קטגוריה
    document.getElementById('startBtn').disabled = true;
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // ניקוי טיימר אם פעיל
    if (timer) {
        clearInterval(timer);
    }
}

// ===== פונקציות עזר =====

/**
 * ערבוב מערך (Fisher-Yates shuffle)
 * @param {Array} array - המערך לערבוב
 * @returns {Array} - המערך המעורבב
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * שמירת ההישג הטוב ביותר
 * @param {number} currentScore - הניקוד הנוכחי
 * @param {string} category - הקטגוריה
 */
function saveHighScore(currentScore, category) {
    try {
        const key = `trivia_high_score_${category}`;
        const savedScore = localStorage.getItem(key);
        
        if (!savedScore || currentScore > parseInt(savedScore)) {
            localStorage.setItem(key, currentScore.toString());
            console.log(`שמור שיא חדש עבור ${category}: ${currentScore}`);
        }
    } catch (error) {
        console.log('לא ניתן לשמור את ההישג:', error);
    }
}

/**
 * קבלת ההישג הטוב ביותר
 * @param {string} category - הקטגוריה
 * @returns {number} - ההישג הטוב ביותר
 */
function getHighScore(category) {
    try {
        const key = `trivia_high_score_${category}`;
        const savedScore = localStorage.getItem(key);
        return savedScore ? parseInt(savedScore) : 0;
    } catch (error) {
        console.log('לא ניתן לקרוא את ההישג:', error);
        return 0;
    }
}

// ===== אירועים =====

// טעינת הדף - הצגת שיאים אם קיימים
document.addEventListener('DOMContentLoaded', function() {
    console.log('משחק הטריוויה נטען בהצלחה!');
    
    // הוספת מאזיני אירועים לכפתורי קיצורי מקלדת
    document.addEventListener('keydown', function(event) {
        // אם אנחנו במסך המשחק ולא ענינו עדיין
        if (document.getElementById('gameScreen').style.display === 'block' && !hasAnswered) {
            const key = event.key;
            
            // מקשים 1-4 לבחירת תשובות
            if (key >= '1' && key <= '4') {
                const answerIndex = parseInt(key) - 1;
                const buttons = document.querySelectorAll('.answer-btn');
                if (buttons[answerIndex]) {
                    selectAnswer(answerIndex);
                }
            }
        }
        
        // מקש Enter למעבר לשאלה הבאה
        if (event.key === 'Enter') {
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn && nextBtn.style.display === 'block') {
                nextQuestion();
            }
        }
    });
});

// הדפסת הודעת חיבור
console.log('🎯 קובץ JavaScript למשחק הטריוויה נטען בהצלחה!');
console.log('📝 פונקציות זמינות: selectCategory, startGame, selectAnswer, nextQuestion, resetGame');
console.log('⌨️  קיצורי מקלדת: 1-4 לבחירת תשובות, Enter למעבר לשאלה הבאה');