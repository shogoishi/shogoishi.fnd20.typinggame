'use strict'
// 1行目に記載している 'use strict' は削除しないでください

function changeScreenStartToCheck() {
    setLimitTime();
    nowScore = 0;
    remainingTime.value = gameTimeSec;
    currentAnswerLabel.value = "";//再プレイ時に前回値が表示されないようにするため
    scoreDisplayLabel.value = nowScore;
    inputLabel.value = "";
    // inputLabel.focus();//※focusはここに入れると動作しない。
    tmpAnswerNum = 0;
    // gameTimer();
    // updateScore();
    // shuffleArray();
    // updateCurrentAnswer();

    startScreen.style.display = "none";
    // checkScreen.style.display = "block";
    checkScreenFull.style.display = "block";
    playScreen.style.display = "block";
    resultScreen.style.display = "none";
    imeCheckLabel.focus();
}

function changeScreenCheckToPlay() {
    // inputLabel.value = "";
    // inputLabel.focus();//※focusはここに入れると動作しない。
    // tmpAnswerNum = 0;
    // nowScore = 0;
    gameTimer();
    updateScore();
    shuffleArray();
    updateCurrentAnswer();

    startScreen.style.display = "none";
    // checkScreen.style.display = "none";
    checkScreenFull.style.display = "none";
    playScreen.style.display = "block";
    resultScreen.style.display = "none";
    inputLabel.focus();//入力欄に自動でカーソルを合わせすぐに入力できる状態にする。タイミングが重要で、プレイ画面表示後に実行しないとカーソルが合わないため注意。
}
function changeScreenPlayToResult() {
    lastScore.value = nowScore;
    startScreen.style.display = "none";
    playScreen.style.display = "none";
    resultScreen.style.display = "block";
}
function changeScreenToStart() {
    clearTimeout(timerID);
    clearInterval(intervalId);
    nowScore = 0;
    startScreen.style.display = "block";
    playScreen.style.display = "none";
    resultScreen.style.display = "none";
}

function setLimitTime() {
    for(let i = 0; i < choiceTimeButton.length; i++) {
        if (choiceTimeButton[i].checked === true) {
            gameTimeSec = choiceTimeButton[i].value;
        }
    }
}

function gameTimer() {
    let lastTime = gameTimeSec;
    let lastTimeMill = gameTimeSec * 1000; 
    remainingTime.value = lastTime;
    timerID = setTimeout(changeScreenPlayToResult,lastTimeMill);
    intervalId = setInterval(() => {
        lastTime--;
        remainingTime.value = lastTime;
        if (lastTime === 0) {
            clearInterval(intervalId);
            console.log("タイムアップ")
            lastTime = gameTimeSec;
        }
    }, 1000);
}

function updateScore() {
    scoreDisplayLabel.value = nowScore;
}

function addScore() {
    nowScore += inputLabel.value.length * 10;
    updateScore();
}

function shuffleArray() {
    const cloneArray = [...answerList];//※スプレッド構文(...)を使うことで、新しい参照先を生成し元の配列に影響与えない。
    //配列から順番に数値を取り出し、ランダム生成したインデックス番号の要素と入れ替える。全ての要素に対して行う。
    for (let i = cloneArray.length -1; i >= 0; i--) {
        const randomNumber = Math.floor(Math.random() * (i + 1));
        let temp = cloneArray[i];
        cloneArray[i] = cloneArray[randomNumber];
        cloneArray[randomNumber] = temp;
    }
    shuffledAnswerList = cloneArray;
}

function updateCurrentAnswer() {
    const answer = shuffledAnswerList[tmpAnswerNum];
    currentAnswerLabel.value = answer;
    tmpAnswerNum ++;
}

function judgement() {
    let expected = currentAnswerLabel.value;
    const actual = inputLabel.value;
    if (expected.includes("（")) {
        expected = expected.substr(0, expected.indexOf("（"));
    }
    if (expected === actual) {
        displayPassed();
        addScore();
        updateCurrentAnswer();
        inputLabel.value = "";
    } else {
        displayFailed();
    }
}

function imeCheckLabelIsEnter(keyEvent) {
    if (keyEvent.key === "Enter") {
        changeScreenCheckToPlay();
    }
} 
function inputLabelIsEnter(keyEvent) {
    console.log(keyEvent);
    if (keyEvent.key === "Enter") {
        judgement();
    }
} 

function displayPassed() {
    rightAudio.currentTime = 0;//音声ファイルの再生秒数を0秒に戻す(連続押しした際でも鳴るようにするために必要)
    rightAudio.play();//オーディオを再生する
    displayJudge.innerHTML = " 〇 ";
    displayJudge.style.background = "chartreuse";
    setTimeout(judgeDisplayClear,700);
}

function displayFailed() {
    wrongAudio.currentTime = 0;
    wrongAudio.play();
    displayJudge.innerHTML = "×";
    displayJudge.style.background = "red";
    setTimeout(judgeDisplayClear,700);
}

function judgeDisplayClear() {
    displayJudge.innerHTML = "判定";
    displayJudge.style.background = "white";
}

const startScreen = document.querySelector("#startScreen");
// const checkScreen = document.querySelector("#checkScreen");
const checkScreenFull = document.querySelector("#checkScreenFull");
const playScreen = document.querySelector("#playScreen");
const resultScreen =document.querySelector("#resultScreen");

const choiceTimeButton = document.querySelectorAll("input[name='choiceTimeButton']")

const startButton = document.querySelector("#start");
const cancelButton = document.querySelector("#cancel");
const remainingTime = document.querySelector("#remainingTime");
const retryButton = document.querySelector("#retry");
const backButton = document.querySelector("#backToTop");

const imeCheckLabel = document.querySelector("#imeCheckLabel");
const inputLabel = document.querySelector("#inputLabel");

const scoreDisplayLabel = document.querySelector("#score");
const currentAnswerLabel = document.querySelector("#currentAnsLabel");
const displayJudge = document.querySelector("#judge");
const rightAudio = document.querySelector("#rightAudio");
const wrongAudio = document.querySelector("#wrongAudio");

const lastScore = document.querySelector("#lastScore"); 

let gameTimeSec;
let intervalId;
let timerID;

let nowScore = 0;

const prefectureList = [
    "ほっかいどう（北海道）",
    "あおもり（青森）",
    "いわて（岩手）",
    "みやぎ（宮城）",
    "あきた（秋田））",
    "やまがた（山形）",
    "ふくしま（福島）",
    "いばらぎ（茨城）",
    "とちぎ（栃木）",
    "ぐんま（群馬）",
    "さいたま（埼玉）",
    "ちば（千葉）",
    "とうきょう（東京）",
    "かながわ（神奈川）",
    "にいがた（新潟）",
    "とやま（富山）",
    "いしかわ（石川）",
    "ふくい（福井）",
    "やまなし（山梨）",
    "ながの（長野）",
    "ぎふ（岐阜）",
    "しずおか（静岡）",
    "あいち（愛知）",
    "みえ（三重）",
    "しが（滋賀）",
    "きょうと（京都）",
    "おおさか（大阪）",
    "ひょうご（兵庫）",
    "なら（奈良）",
    "わかやま（和歌山）",
    "とっとり（鳥取）",
    "しまね（島根）",
    "おかやま（岡山）",
    "ひろしま（広島）",
    "やまぐち（山口）",
    "とくしま（徳島）",
    "かがわ（香川）",
    "えひめ（愛媛）",
    "こうち（高知）",
    "ふくおか（福岡）",
    "さが（佐賀）",
    "ながさき（長崎）",
    "くまもと（熊本）",
    "おおいた（大分）",
    "みやざき（宮崎）",
    "かごしま（鹿児島）",
    "おきなわ（沖縄）"
];

let answerList = prefectureList;
let shuffledAnswerList;

let tmpAnswerNum = 0; 
let tmpProgress = 0;

startButton.addEventListener("click", changeScreenStartToCheck);
// startButton.addEventListener("click", gameTimer);
// startButton.addEventListener("click", updateScore);
// startButton.addEventListener("click", shuffleArray);
// startButton.addEventListener("click", updateCurrentAnswer);

cancelButton.addEventListener("click",changeScreenToStart)

retryButton.addEventListener("click",changeScreenStartToCheck)

backButton.addEventListener("click",changeScreenToStart)

imeCheckLabel.addEventListener("keypress",imeCheckLabelIsEnter);
inputLabel.addEventListener("keypress",inputLabelIsEnter);
