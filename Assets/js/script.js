// DOM Elements
const appContainer = document.getElementById('app-container');
const searchBtn = document.getElementById('search-btn');
const searchField = document.getElementById('search-field');



let testDefObj = {
    word: 'interest',
    audioUrl: 'https://media.merriam-webster.com/audio/prons/en/us/mp3/i/intere01.mp3',
    defs: [{
            fl: 'noun',
            defSentances: [
                "a feeling that accompanies or causes special attention to something or someone : concern",
                "something or someone that arouses such attention",
                "a quality in a thing or person arousing interest"
            ]
        },
        {
            fl: 'adjective',
            defSentances: [
                "to engage the attention or arouse the interest of",
                "to induce or persuade to participate or engage"
            ]
        }
    ]
}

var testDefObjs = {
  interest1: testDefObj,
  interest2: testDefObj,
  interest3: testDefObj,
  interest4: testDefObj,
  interest5: testDefObj,
}
var listOfTestObject = [testDefObj, testDefObj, testDefObj, testDefObj, testDefObj];

const dictionary = (() => {
  let words = {};

  const getDef = (word) => {
    let apiUrl = `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=eef68214-e15e-46fc-8e3b-5c0c4330f2db`;

        fetch(apiUrl).then(response => {
            if (response.ok) {
              console.log(response);
                response.json().then(data => {
                    let defObj = createDefObj(data, word);
                    appContainer.appendChild(domOps.createDefCard(defObj));
                });
            }
        })
    }

  const stripAstr = (word) => {
    let strippedArr = word.split("*");
    return strippedArr.join("");
  };

  const createDefObj = (defArr, word) => {
    let defObj = {
      word: word,
      audioUrl: getAudioUrl(defArr),
      defs: [],
    };
    for (let i = 0; i < defArr.length; i++) {
      let currentDef = defArr[i];
      if (stripAstr(currentDef.hwi.hw) == word) {
        let type = {
          fl: currentDef.fl,
          defSentances: currentDef.shortdef,
        };
        defObj.defs.push(type);
      } else {
        break;
      }
    }
    return defObj;
  };

  const getAudioUrl = (defArr) => {
    let baseFilename = defArr[0].hwi.prs[0].sound.audio;
    let subdirectory =
      baseFilename.substr(0, 3) == "bix"
        ? "bix"
        : baseFilename.substr(0, 3) == "gg"
        ? "gg"
        : baseFilename[0];
    return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${baseFilename}.mp3`;
  };

  const search = (word) => {
    let cleanWord = word.toLowerCase().trim();
    appContainer.textContent = '';
    getDef(cleanWord);
  }

  const getWords = () => {
    return words;
  };

  const addDef = (defObj) => {
    words[defObj.word] = defObj;
  }

  return {
    getDef,
    stripAstr,
    getAudioUrl,
    getWords,
    addDef,
    search
  }
})();

// event listener for search button 
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  let searchWord = searchField.value;
  dictionary.search(searchWord);

})

const domOps = (() => {
  const createDefCard = (defObj) => {
    let card = document.createElement('div');
    card.classList = 'd-inline-block card defCardClass mt-5';

    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    let headingBox = document.createElement('div');
    headingBox.classList = 'd-flex flex-row justify-content-between';
    let wordBox = document.createElement('div');
    wordBox.classList = 'd-flex flex-row';
    let wordHeading = document.createElement('h2');
    wordHeading.classList = ('card-title fs-1 mr-2');
    wordHeading.textContent = defObj.word;
    let pronounciation = document.createElement('audio');
    pronounciation.setAttribute('src', defObj.audioUrl);
    let soundBtn = document.createElement('button');
    soundBtn.addEventListener('click', () => {
      pronounciation.play();
    });
    soundBtn.classList = 'btn btn-secondary sound-btn';
    soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    wordBox.appendChild(wordHeading);
    wordBox.appendChild(soundBtn);
    let saveBtn = document.createElement('button');
    saveBtn.classList = 'btn btn-primary btn-sm save-btn';
    saveBtn.textContent = 'Save Word';
    headingBox.appendChild(wordBox);
    headingBox.appendChild(saveBtn);
    cardBody.appendChild(headingBox);

    saveBtn.addEventListener('click', () => {
      dictionary.addDef(defObj);
      storage.addWord();

    })

    for (let i=0; i< defObj.defs.length; i++) {
      cardBody.appendChild(createDefEntry(defObj.defs[i], defObj.word));
    }

    card.appendChild(cardBody);
    return card;    
  };

  const createDefEntry = (defEntry, word) => {
    let entryBox = document.createElement('div');
    entryBox.classList = 'mt-5';
    let entryHeading = document.createElement('h4');
    entryHeading.innerHTML = `${word} <span class='fs-5 text-muted'>${defEntry.fl}</span>`;
    entryHeading.classList = 'fs-3';
    entryBox.appendChild(entryHeading);
    for (let i=0; i < defEntry.defSentances.length; i++) {
      let defSentance = document.createElement('p');
      defSentance.classList = 'px-3';
      defSentance.textContent = `${i+1}. ${defEntry.defSentances[i]}`;
      entryBox.appendChild(defSentance);
    }
    return entryBox;
  }
  
  const createReviewCard = (defObjs) => {
    let reviewCard = document.createElement('div');
    reviewCard.classList = "d-flex flex-column";
    let keys = Object.keys(defObjs);
    for (let i = 0; i < keys.length; i++) {
      let currentKey = keys[i];
      let currentDefObj = defObjs[currentKey];
      reviewCard.appendChild(domOps.createDefCard(currentDefObj));
    }
    return reviewCard;
  }
  return {
    createDefCard,
    createReviewCard,
  };
})();


// Storage Module

const storage = (() => {
  const addWord = () => {
    let words = dictionary.getWords();
    localStorage.setItem('addedWords', JSON.stringify(words));
    
    // if (confirmBox) {
    //   if (addedWords.length > 0) {
    //     const listOfStoredWords = addedWords.map(function (wordObj) {
    //       const wordFromList = Object.keys(wordObj)[0];
    //       return wordFromList;
    //     });
    //     if (listOfStoredWords.includes(Object.keys(searchedWord)[0])) {
    //       window.alert("You Have Already Added This Word To Your List");
    //       return 
    //     }
    //   }
    //   addedWords.push(searchedWord);
    //   localStorage.setItem(key, JSON.stringify(addedWords));
    // }
    return 
  };

  return {
    addWord,
  };
})();

// Quiz card Module

const quizcard = (() => {

  var timecountdown;
  var timeInterval;
  var landingPage = document.getElementsByClassName("card-body");
  var para1 = document.createElement("p");
  var para2 = document.createElement("p");
  var para3 = document.createElement("p");
  var time = document.createElement("h3");
  var index = 0;
  var correctAnswer = "";
  var answerPara = document.createElement("p");
  var textbox = document.createElement("INPUT");
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  

  const getQuizCard = () => {
    //console.log(index);
    landingPage[0].style.display = "none";

    if (this.listOfTestObject.length < 3) {
      prompt(
        "Please add more words to take quiz.To memorize minimum 3 words should be added."
      );
    } else {
      $(cardBody).empty();
      card.style.display = "block";
      index=0;
      generateQuiz();
    }
  };

  const generateQuiz = () => {
    console.log(index);
    if(index==0){
      timecountdown=91;
      timeInterval = setInterval(function () {
        timecountdown--;
    
        time.style.color = "blue";
        time.innerHTML = "<br/>Time: " + timecountdown;
        console.log(1);
        if (timecountdown === 0) {
          console.log("Times up !!")
          showScore();
          clearInterval(timeInterval);
         
        }
      }, 1000);
    }
    
    if (index == 3) {
      console.log("Quiz Done");
      showScore();
      return;
    }

    document.getElementById("btn-strt-quiz").disabled = true;
    answerPara.textContent = "";
    textbox.value = "";
    // Card title
    var listOfObject = [];
    var wordsToTest = [];
    var fetchedAddedWordsFromLocalStorage = JSON.parse(
      localStorage.getItem("addedWords")
    );

    for (
      var i = 0, length = fetchedAddedWordsFromLocalStorage.length;
      i < length;
      i++
    ) {
      for (obj in fetchedAddedWordsFromLocalStorage[i]) {
        var attr = String(obj);
        listOfObject.push(fetchedAddedWordsFromLocalStorage[i][attr]);
      }
    }

    console.log(listOfObject);

    for (let i = 0; i < 3; i++) {
      wordsToTest.push(listOfObject[i]);
    }

    console.log(wordsToTest);

    card.classList = 'card quiz-card';
    cardBody.classList.add('card-body');
    quizTitle = document.createElement("h3");
    quizTitle.textContent = "Quiz";
    var quizIns = document.createElement("p");
    quizIns.classList.add("text-lable");
    quizIns.textContent = "The following are definations/meanings of words: ";
    var quizUl = document.createElement("ul");
    quizUl.classList.add("list-group");
    quizUl.style.marginLeft = "50px";
    quizUl.style.marginTop = "25px";
    quizUl.style.marginBottom = "25px";
    var quizLiOne = document.createElement("li");
    var quizLiTwo = document.createElement("li");
    var quizLiThree = document.createElement("li");
    quizLiOne.classList.add("list-group-item");
    quizLiOne.classList.add("list-group-item-success");
    quizLiTwo.classList.add("list-group-item");
    quizLiTwo.classList.add("list-group-item-primary");
    quizLiThree.classList.add("list-group-item");
    quizLiThree.classList.add("list-group-item-warning");
    para1.textContent =
      wordsToTest[index].defs[0] !== undefined
        ? "1. " + wordsToTest[index].defs[0].defSentances[0]
        : (quizLiOne.style.display = "none");
    para2.textContent =
      wordsToTest[index].defs[1] !== undefined
        ? "2. " + wordsToTest[index].defs[1].defSentances[0]
        : (quizLiTwo.style.display = "none");
    para3.textContent =
      wordsToTest[index].defs[2] !== undefined
        ? "3. " + wordsToTest[index].defs[2].defSentances[0]
        : (quizLiThree.style.display = "none");
    correctAnswer = wordsToTest[index].word;
    quizLiOne.appendChild(para1);
    quizLiTwo.appendChild(para2);
    quizLiThree.appendChild(para3);
    quizUl.appendChild(quizLiOne);
    quizUl.appendChild(quizLiTwo)
    quizUl.appendChild(quizLiThree);
    var labelTextbox = document.createElement("p");
    labelTextbox.classList.add("text-lable");
    labelTextbox.textContent = "Guess the word";
    textbox.classList.add("text-box-guess");
    var button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.classList.add("quiz-button");
    button.textContent = "Next";
    button.addEventListener("click", onNext);
    var buttonLeave = document.createElement("button");
    buttonLeave.classList.add("btn");
    buttonLeave.classList.add("btn-danger");
    buttonLeave.classList.add("quiz-button");
    buttonLeave.textContent = "Exit Quiz";
    buttonLeave.addEventListener("click", goToHome);
    textbox.setAttribute("type", "text");
    var textboxDiv = document.createElement("div");
    textboxDiv.classList.add("quiz-align");
    var buttonDiv = document.createElement("div");
    buttonDiv.classList.add("quiz-align");
    var buttonLeaveDiv = document.createElement("div");
    buttonLeaveDiv.classList.add("quiz-align");
    textboxDiv.appendChild(textbox);
    buttonDiv.appendChild(button);
    buttonLeaveDiv.appendChild(buttonLeave);
    cardBody.appendChild(quizTitle);
    cardBody.appendChild(time);
    cardBody.appendChild(quizIns);
    cardBody.appendChild(quizUl);
    cardBody.appendChild(labelTextbox);
    cardBody.appendChild(textboxDiv);
    cardBody.appendChild(answerPara);
    cardBody.appendChild(buttonDiv);
    cardBody.appendChild(buttonLeaveDiv);
    card.appendChild(cardBody);
    appContainer.appendChild(card);
    //starTimer();
  };

  const starTimer = () => {
   
  };

  const onNext = () => {
   
    //console.log(textbox.value);

    var answer=textbox.value;

    if(textbox.value==""){
      alert("Answer cannot be empty");
      return;
    }
    index = index + 1;

    if (answer.toLowerCase() == correctAnswer.toLowerCase()) {
      answerPara.textContent = "Correct";
      answerPara.style.textAlign = "center";
    } else {
      answerPara.textContent = "Wrong";
      answerPara.style.textAlign = "center";
    }

    setTimeout(() => {
      $(cardBody).empty();
      generateQuiz();
    }, 1000);
  };

  const showScore = () => {
    console.log("Time ID:" +timeInterval);
    clearInterval(timeInterval);
    $(cardBody).empty();
    var showScoreTitle = document.createElement("h3");
    var score = document.createElement("p");
    var buttonDiv = document.createElement("div");
    var ins = document.createElement("p");
    ins.classList.add("quiz-align");
    ins.innerHTML = "<br/>" + "Click here go to home page";
    buttonDiv.classList.add("quiz-align");
    var buttonHome = document.createElement("button");
    buttonHome.classList.add("btn");
    buttonHome.classList.add("btn-primary");
    buttonHome.classList.add("quiz-button");
    buttonHome.textContent = "Home Page";
    buttonHome.addEventListener("click", goToHome);
    buttonDiv.appendChild(buttonHome);
    score.classList.add("quiz-align");
    showScoreTitle.textContent = "YOUR SCORE IS: ";
    score.innerHTML = "<br/>" + timecountdown;
    cardBody.appendChild(showScoreTitle);
    cardBody.appendChild(score);
    cardBody.appendChild(ins);
    cardBody.appendChild(buttonDiv);
  };

  const goToHome = () => {
   
    clearInterval(timeInterval);
    card.style.display = "none";
    landingPage[0].style.display = "block";
    $(cardBody).empty();
    document.getElementById("btn-strt-quiz").disabled = false;
  };

  return {
    getQuizCard,
    generateQuiz,
    starTimer,
    onNext,
    showScore,
    goToHome,
  };
})();

var quizStartButton = document.getElementById("btn-strt-quiz");
quizStartButton.addEventListener("click", quizcard.getQuizCard);
