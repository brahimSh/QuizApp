const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarfull = document.getElementById("progressBarfull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");


let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("api.json")
.then( res => {
    return res.json();
})
.then(loadedQuestions => {
    console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map(loadedQuestion => {
        const formattedQuestion = {
            question: loadedQuestion.question
        };

        const answerChoices = [ ... loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
        answerChoices.splice(
            formattedQuestion.answer - 1,
            0,
             loadedQuestion.correct_answer
             );

        answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index +1 )] = choice;
    });
        return formattedQuestion;
    });

    startGame();
})
.catch(err => {
    return 0;
});


//Constants

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [ ...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {
    if (availableQuestions.length == 0 || questionCounter > MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore', score);
        //go to end page
        return window.location.assign("end.html");
    }
   questionCounter++;
   progressText.innerText = questionCounter + "/" + MAX_QUESTIONS; // display the question number from average max 
   // update progress Bar
   progressBarfull.style.width = '${(questionCounter / MAX_QUESTIONS) * 100}%';
   const questionIndex = Math.floor(Math.random() * availableQuestions.length);
   currentQuestion = availableQuestions[questionIndex];
   question.innerText = currentQuestion.question;

   choices.forEach(choice => {
const number = choice.dataset["number"];
choice.innerText = currentQuestion["choice" + number];
   } );

   availableQuestions.splice(questionIndex, 1);
   console.log(availableQuestions);
   acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectAnswer = selectedChoice.dataset["number"];

        const classToApply = 
        selectAnswer == currentQuestion.answer ? "correct" : "incorrect"; // give the selected answer a value of coorect or incorrect.
    if (classToApply == 'correct'){
        incrementScore(CORRECT_BONUS)
    }
        selectedChoice.parentElement.classList.add(classToApply); // applying classes
        
        
       setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply);
        getNewQuestion();
       }, 1000);
        
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}


