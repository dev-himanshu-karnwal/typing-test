'use strict'

// DOM elements 
const timerEle = document.querySelector('#timer');
const mistakesEle = document.querySelector('#mistakes');
const wholeTextEle = document.querySelector('#text');
let restTextEle = document.querySelector('#rest');
const inputLabel = document.querySelector('#quote-input');
const startBtn = document.querySelector('#start-test');
const stopBtn = document.querySelector('#stop-test');
const accuracyEle = document.querySelector('#accuracy');
const speedEle = document.querySelector('#wpm');
const statsContainer = document.querySelector('.result');
const messageEle = document.querySelector('.message');

// quotes that will be used as user test strings
const quotes = [
    'It is often the small steps, not the giant leaps, that bring about the most lasting change.',
    'Education is the most powerful weapon which you can use to change the world',
    `There is always light. If only we're brave enough to see it.If only we're brave enough to be it.`,
    `You’re braver than you believe, stronger than you seem, and smarter than you think.`,
    'We will fail when we fail to try.',
    'All our dreams can come true - if we have the courage to pursue them.',
    'The people who are crazy enough to think they can change the world are the ones who do.',
    `Don't save your best for when you think the material calls for it. Always bring your full potential to every take, and be on top of your job, or they will replace you.`,
    'The Sun himself is weak when he first rises, and gathers strength and courage as the day gets on.',
    'Never bend your head. Always hold it high. Look the world straight in the eye.',
    'What you get by achieving your goals is not as important as what you become by achieving your goals.',
    `I can't change the direction of the wind, but I can adjust my sails to always reach my destination`,
    'The best revenge is massive success.',
    `Nothing is impossible. The word itself says "I'm possible!"`,
];

// global variables
let restText = null,
    testGoingOn = false,
    mistakes = 0,
    time = 0,
    originalTextLength = null,
    timerOn = null;


const startTimer = function () {

    //  function to update(by 1 sec) and display on page  
    const tick = () =>
        timerEle.textContent = `${time++} seconds`;

    // set timer for every 1 second to update time variable for each second and display on page 
    tick();
    return setInterval(tick, 1000);
}

const toggleBtnClasses = function () {
    // toggles start and stop btn on page
    stopBtn.classList.toggle('hidden');
    startBtn.classList.toggle('hidden');
}

const startTest = function () {

    // remove all spans (success and fail) from text added in last test and add only one rest text span
    wholeTextEle.innerHTML = '<span id="rest"></span>';
    // update restTextEle to get new span element 
    restTextEle = document.querySelector('#rest');

    // Get a random quote as test string
    restText = quotes[Math.trunc(Math.random() * quotes.length)];
    // display same on page
    restTextEle.textContent = restText;

    // store its length
    originalTextLength = restText.length;

    // hide stats and message container
    statsContainer.classList.add('hidden');
    messageEle.classList.add('hidden');
    // show stop test btn and hide start test btn
    toggleBtnClasses();

    // start timer
    timerOn = startTimer();

    // make 0 mistakes on page for new test
    mistakesEle.textContent = mistakes; 

    // set veriable to true to show test is started
    testGoingOn = true;

    // clear all user input
    inputLabel.value = '';
    // focus on input label
    inputLabel.focus();
}

const updateRestText = function (Class) {

    // add new element with specified class 
    restTextEle.insertAdjacentHTML('beforebegin',
        `<span class="${Class}">${restText[0]}</span>`);
    // remove first char from string 
    restText = restText.slice(1);
    // update on page
    restTextEle.textContent = restText;

    // increment mistake
    if (Class === 'fail') {
        mistakes++;
        mistakesEle.textContent = mistakes;
    }
}

const showStats = function () {

    // remove stats container
    statsContainer.classList.remove('hidden');

    // calculate and show accuracy
    accuracyEle.textContent = `${((originalTextLength - mistakes) / originalTextLength * 100).toFixed(2)} %`;

    // calculate and show speed
    speedEle.textContent = `${((originalTextLength * 60) / time).toFixed(2)} cpm`;
}

const stopInput = function () {
    if (!testGoingOn)
        inputLabel.blur();
}

const stopTest = function () {

    // set to false to show test is stopped 
    testGoingOn = false;

    // clear time inerval that was recording time
    clearInterval(timerOn);

    // change text shown on start button
    startBtn.textContent = 'Start Test Again';
    // show start button and hide stop button
    toggleBtnClasses();

    // Restrict user from emtering more input
    stopInput();

    // if test not completed then show message else calculate and show stats
    if (restText.length)
        messageEle.classList.remove('hidden');
    else
        showStats();

    // set variables to initial stage to start test again next time
    restText = '';
    mistakes = time = originalTextLength = 0;
    timerOn = false;

}

const testInput = function (e) {

    // If test not yet startted
    if (!testGoingOn) return;

    // if some invalid key is pressed then return 
    if (!
        `qwertyuiopasdfghjklzxcvbnm QWERTYUIOPASDFGHJKLZXCVBNM1234567890!@#$%^&*()_+-=[]\{}|;':"<>?,./`
            .includes(e.key)) return;

    // Update the rest Text on page according to  input
    updateRestText(e.key === restText[0] ? 'success' : 'fail');

    // All text done (no rest text is there then stop test)
    if (restText.length === 0)
        stopTest();

}

const preventBckspcDlt = function (e) {
    // if user pressed backspace or dlt key then don't do so    
    if (e.key === 'Backspace' || e.key === 'Delete')
        e.preventDefault();
}


// event for each key pressed in page
document.addEventListener('keyup', testInput);
// event listenerto prevent user pressed backspace and dlt key
document.addEventListener('keydown', preventBckspcDlt);
// start and stop btn event listeners
startBtn.addEventListener('click', startTest);
stopBtn.addEventListener('click', stopTest);
// user focus on input field
inputLabel.addEventListener('focus', stopInput);
