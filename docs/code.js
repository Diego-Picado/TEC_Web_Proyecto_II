// Variables with original questions, answers and possible answers
let questions = [
  { question: "Who is the captain of the Straw Hat Pirates?", options: ["Zoro", "Luffy", "Sanji", "Nami"], answer: 1 },
  { question: "What is the name of the Strawhats's first ship?", options: ["Going Merry", "Thousand Sunny", "Red Force", "Moby Dick"], answer: 0 },
  { question: "Which fruit did Ace eat?", options: ["Mera Mera no Mi", "Gomu Gomu no Mi", "Hito Hito no Mi", "Yami Yami no Mi"], answer: 0 },
  { question: "Who is the swordsman of the crew?", options: ["Usopp", "Zoro", "Brook", "Franky"], answer: 1 },
  { question: "What is Nami’s role?", options: ["Cook", "Doctor", "Navigator", "Sniper"], answer: 2 }
];

let arrOfCurrentQuestions = [];  
let mainIndex = 0;
let mainScore = 0;
let arrayWithWrongAnswers = [];   

// Variables that will start modifying the DOM
const mainScreen = document.getElementById("start-screen");
const triviaScreen = document.getElementById("trivia-screen");
const resultScreen = document.getElementById("result-screen");
const editScreen = document.getElementById("edit-screen");

const questionSection = document.getElementById("question-section");
const mainScoreText = document.getElementById("mainScore-text");
const editSection = document.getElementById("edit-section");

let failedQuestionsContainer = document.createElement("div"); 
resultScreen.appendChild(failedQuestionsContainer);  

// Section dedicated to button "assignment"
document.getElementById("play-button").addEventListener("click", startQuiz);

document.getElementById("restart").addEventListener("click", function() {
  backToMenu();
  setTimeout(startQuiz, 1);
});
document.getElementById("edit-button").addEventListener("click", showEdit);
document.getElementById("next-button").addEventListener("click", nextQuestion);
document.getElementById("restart-button").addEventListener("click", backToMenu);
document.getElementById("back-button").addEventListener("click", backToMenu);
document.getElementById("add-question-button").addEventListener("click", addQuestionForm);

// We are going to kick the quiz in, the function basically hides the unnecesary screens, resets the score and index and calls the shuffle function to show the questionsin a dinamyc order.
function startQuiz() { 
  mainScreen.classList.add("hidden");
  triviaScreen.classList.remove("hidden");
  mainScore = 0;
  mainIndex = 0;
  arrayWithWrongAnswers = [];
  arrOfCurrentQuestions = shuffle(questions).slice(0, 5);
  showQuestion();
  //console.log(mainScore);
  //console.log(mainIndex);
}

// The function will clear que question section, take the current question and also builds the radio buttons for the user to select them, this per question.
function showQuestion() {
  questionSection.innerHTML = "";
  let currentQuestion = arrOfCurrentQuestions[mainIndex];
  let titleElement = document.createElement("h3");
  titleElement.textContent = currentQuestion.question;
  questionSection.appendChild(titleElement);

  for (let optionIndex = 0; optionIndex < currentQuestion.options.length; optionIndex++) {
    let labelElement = document.createElement("label");
    let radioElement = document.createElement("input");
    radioElement.type = "radio";
    radioElement.name = "option";
    radioElement.value = optionIndex;
    labelElement.appendChild(radioElement);
    labelElement.appendChild(document.createTextNode(currentQuestion.options[optionIndex]));
    questionSection.appendChild(labelElement);
    questionSection.appendChild(document.createElement("br"));
  }
}

// Valdidates the current answer, and moves to the next question, also, if we have reached the max questions, it will end the quiz.
function nextQuestion() {
  checkAnswer();
  if (mainIndex < arrOfCurrentQuestions.length - 1) {
    mainIndex++;
    showQuestion();
  } else {
    finishQuiz(false);
  }
}

// Ends the quiz, moves to the result screen only, calculates the score and also displays the wrong answers.
function finishQuiz(startCheck) {
  if (startCheck === undefined) startCheck = true;
  if (startCheck) checkAnswer();
  triviaScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  let percent = (mainScore / arrOfCurrentQuestions.length) * 100;
  mainScoreText.textContent = "Your score: " + percent + "%";

  failedQuestionsContainer.innerHTML = "";
  if (arrayWithWrongAnswers.length > 0) {
    let titleElement = document.createElement("h3");
    titleElement.textContent = "Failed Questions:";
    failedQuestionsContainer.appendChild(titleElement);

    for (let wrongIndex = 0; wrongIndex < arrayWithWrongAnswers.length; wrongIndex++) {
      let wrongAnswerElement = document.createElement("div");
      wrongAnswerElement.textContent = arrayWithWrongAnswers[wrongIndex].text + " Answer: " + arrayWithWrongAnswers[wrongIndex].correct;
      failedQuestionsContainer.appendChild(wrongAnswerElement);
    }
  }
}

// We are going to check the answers that the user added with the real answers that we have hardcoded
function checkAnswer() {
  let selectedQuestion = document.querySelector("input[name='option']:checked");
  let currentQuestion = arrOfCurrentQuestions[mainIndex];

  if (selectedQuestion) {
    if (parseInt(selectedQuestion.value) === currentQuestion.answer) {
      mainScore++;
    } else {
      arrayWithWrongAnswers.push({ text: currentQuestion.question, correct: currentQuestion.options[currentQuestion.answer] });
    }
  } else {
    arrayWithWrongAnswers.push({ text: currentQuestion.question, correct: currentQuestion.options[currentQuestion.answer] });
  }
}

// Disabling the other screens to go back to main menu
function backToMenu() {
  triviaScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  editScreen.classList.add("hidden");
  mainScreen.classList.remove("hidden");
}

// Disabling the other screens to go edit screen
function showEdit() {
  mainScreen.classList.add("hidden");
  editScreen.classList.remove("hidden");
  renderEdit();
}

// Displays all the current questions that we have , also creates a "delete" button on every question for the user to delete them if needed
function renderEdit() {
  editSection.innerHTML = "";

  for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
    let renderBlock = document.createElement("div");
    renderBlock.innerHTML = "<strong>" + questions[questionIndex].question + "</strong><br>" + 
      questions[questionIndex].options.join(", ") + "<br>Answer: " + questions[questionIndex].options[questions[questionIndex].answer] + "<br>";
    
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function() {
      questions.splice(questionIndex, 1);
      renderEdit();
    };
    renderBlock.appendChild(deleteButton);

    renderBlock.appendChild(document.createElement("hr"));
    editSection.appendChild(renderBlock);
  }
}

// Creates a space for th euser to generate a new question, new options and select the radio button to tell the tool that such selection is the answer
function addQuestionForm() {
  let questionFormSection = document.createElement("div"); 
  let questionInput = document.createElement("input"); 
  questionInput.placeholder = "Add a question title"; 
  questionFormSection.appendChild(questionInput); 
  questionFormSection.appendChild(document.createElement("br")); 

  let options = []; 
  for (let optionIndex = 0; optionIndex < 4; optionIndex++) {
    let radioElement = document.createElement("input"); 
    radioElement.type = "radio"; 
    radioElement.name = "correct";
    radioElement.value = optionIndex; 
    questionFormSection.appendChild(radioElement);

    let optionInput = document.createElement("input"); 
    optionInput.placeholder = "Option " + (optionIndex + 1); 
    options.push(optionInput); 
    //console.log(options);
    questionFormSection.appendChild(optionInput); 
    questionFormSection.appendChild(document.createElement("br"));
  }

  let saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.onclick = function() {
    let selectedQuestion = document.querySelector("input[name='correct']:checked");
    //console.log(selectedQuestion);
    questions.push({ 
      question: questionInput.value, 
      options: options.map(function(option) { return option.value; }), 
      answer: selectedQuestion ? parseInt(selectedQuestion.value) : 0
    });
    renderEdit();
  };
  questionFormSection.appendChild(saveButton);

  editSection.appendChild(questionFormSection);
}

// here, we will randomize/suffle the questions, what the function does is: 
// Create a temporary array, randomly pick an index from the questions array and move it to the temporary array.
function shuffle(arrayOfQuestions) {
  let originalArray = arrayOfQuestions.slice();
  let shuffledArray = [];

  while (originalArray.length > 0) {
    let randomPickedNumber = Math.floor(Math.random() * originalArray.length);
    let chosenElement = originalArray[randomPickedNumber];
    shuffledArray.push(chosenElement);
    originalArray.splice(randomPickedNumber, 1);
    //console.log("Picked:", chosenElement.question);
  }
  return shuffledArray;
}
