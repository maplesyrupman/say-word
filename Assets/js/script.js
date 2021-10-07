// DOM Elements
const appContainer = document.getElementById("app-container");
const searchBtn = document.getElementById("search-btn");
const searchField = document.getElementById("search-field");
const quizStartButton = document.getElementById("btn-strt-quiz");
const reviewBtn = document.getElementById('review-btn');
var timeInterval;



const dictionary = (() => {
    let words = {};

    const getDef = (word) => {
        let apiUrl = `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=eef68214-e15e-46fc-8e3b-5c0c4330f2db`;

        fetch(apiUrl).then(response => {
            if (response.ok) {
                response.json().then(data => {
                  if (data[0] && data[0].hwi) {
                    let defObj = createDefObj(data, word);
                    appContainer.appendChild(domOps.createDefCard(defObj));
                  } else {
                    appContainer.appendChild(domOps.createWordNotFound(word));
                  }
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
            baseFilename.substr(0, 3) == "bix" ?
            "bix" :
            baseFilename.substr(0, 3) == "gg" ?
            "gg" :
            baseFilename[0];
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

    const setWords = (newWords) => {
      words = newWords;
    }

    const removeWord = (word) => {
      delete words[word];
    }

    const addDef = (defObj) => {
        words[defObj.word] = defObj;
    }

    return {
        getDef,
        stripAstr,
        getAudioUrl,
        getWords,
        setWords,
        addDef,
        removeWord,
        search
    }
})()



const domOps = (() => {
  const createDefCard = (defObj, isReview=false) => {
    let card = document.createElement("div");
    card.classList = "d-inline-block card defCardClass mt-5";

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    let headingBox = document.createElement("div");
    headingBox.classList = "d-flex flex-row justify-content-between";
    let wordBox = document.createElement("div");
    wordBox.classList = "d-flex flex-row";
    let wordHeading = document.createElement("h2");
    wordHeading.classList = "card-title fs-1 mr-2";
    wordHeading.textContent = defObj.word;
    let pronounciation = document.createElement("audio");
    pronounciation.setAttribute("src", defObj.audioUrl);
    let soundBtn = document.createElement("button");
    soundBtn.addEventListener("click", () => {
      pronounciation.play();
    });
    soundBtn.classList = "btn btn-secondary sound-btn";
    soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    wordBox.appendChild(wordHeading);
    wordBox.appendChild(soundBtn);
    let saveDeleteBtn = createSaveDeleteBtn(isReview, defObj);
    // let saveBtn = document.createElement("button");
    // saveBtn.classList = "btn btn-primary btn-sm save-delete-btn";
    // saveBtn.textContent = "Save Word";
    headingBox.appendChild(wordBox);
    headingBox.appendChild(saveDeleteBtn);
    cardBody.appendChild(headingBox);

    // saveBtn.addEventListener("click", () => {
    //   dictionary.addDef(defObj);
    //   storage.saveWords();
    // });

    for (let i = 0; i < defObj.defs.length; i++) {
      cardBody.appendChild(createDefEntry(defObj.defs[i], defObj.word));
    }

    card.appendChild(cardBody);
    return card;
  };

  const createSaveDeleteBtn = (isReview, defObj) => {
    let btn = document.createElement("button");
    btn.classList = "btn btn-sm";
    if (isReview) {
      btn.classList.add('btn-danger');
      btn.classList.add('delete-btn')
      btn.innerHTML = '<i class="fas fa-times"></i>';
      btn.setAttribute('data-is-save', false);
      btn.addEventListener('click', () => {
        dictionary.removeWord(defObj.word);
        storage.saveWords();
        appContainer.textContent = '';
        appContainer.appendChild(createReviewCard(dictionary.getWords()));
      });
    } else {
      btn.classList.add('btn-primary');
      btn.classList.add('save-btn');
      btn.textContent = 'Save Word';
      btn.setAttribute('data-is-save', true);
      btn.addEventListener('click', () => {
        dictionary.addDef(defObj);
        storage.saveWords();
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
        btn.disabled = true;
      })
    }

    return btn;
  }

  const createDefEntry = (defEntry, word) => {
    let entryBox = document.createElement("div");
    entryBox.classList = "mt-5";
    let entryHeading = document.createElement("h4");
    entryHeading.innerHTML = `${word} <span class='fs-5 text-muted'>${defEntry.fl}</span>`;
    entryHeading.classList = "fs-3";
    entryBox.appendChild(entryHeading);
    for (let i = 0; i < defEntry.defSentances.length; i++) {
      let defSentance = document.createElement("p");
      defSentance.classList = "px-3";
      defSentance.textContent = `${i + 1}. ${defEntry.defSentances[i]}`;
      entryBox.appendChild(defSentance);
    }
    return entryBox;
  };

  const createReviewCard = (defObjs) => {
    if (Object.keys(defObjs).length == 0) {
      return createNoSavedWordsMessage();
    }
    let reviewCard = document.createElement('div');
    reviewCard.classList = "d-flex flex-column justify-content-center align-items-center w-100";
    let keys = Object.keys(defObjs);
    for (let i = 0; i < keys.length; i++) {
      let currentKey = keys[i];
      let currentDefObj = defObjs[currentKey];
      reviewCard.appendChild(createDefCard(currentDefObj, true));
    }
    return reviewCard;
  }

  const createWordNotFound = (wrongWord) => {
    let notFoundDiv = document.createElement('div');
    notFoundDiv.classList = 'border border-warning border-2 d-inline-flex flex-column justify-content-center align-items-center p-5';
    let notFoundHeading = document.createElement('h3');
    notFoundHeading.classList = 'fs-4 text-secondary';
    notFoundHeading.textContent = `We couldn't find the word "${wrongWord}" in our files`;
    notFoundDiv.appendChild(notFoundHeading);
    let notFoundPara = document.createElement('p');
    notFoundPara.classList = 'fs-5 text-secondary';
    notFoundPara.textContent = 'Please check your spelling and try again';
    notFoundDiv.appendChild(notFoundPara);

    return notFoundDiv;
  }

  const createNoSavedWordsMessage = () => {
    let messageContainer = document.createElement('div');
    messageContainer.classList = 'border border-dark border-2 d-inline-flex flex-column justify-content-center align-items-center p-5';
    let messageHeading = document.createElement('h3');
    messageHeading.classList = 'fs-4 text-secondary';
    messageHeading.textContent = 'You don\'t have any words saved for review';
    messageContainer.appendChild(messageHeading);
    let messagePara = document.createElement('p');
    messagePara.classList = 'fs-5 text-secondary';
    messagePara.textContent = 'Please search for a word to begin';
    messageContainer.appendChild(messagePara);
    
    return messageContainer;
  }
  
  return {
    createDefCard,
    createReviewCard,
    createWordNotFound,
  };
})();



const storage = (() => {
    const saveWords = () => {
        let words = dictionary.getWords();
        localStorage.setItem("addedWords", JSON.stringify(words));
    };

    const getWords = () => {
      if(localStorage.getItem('addedWords')) {
        return JSON.parse(localStorage.getItem('addedWords'))
      }
      return {};

    };

    return {
        saveWords,
        getWords,
    }
})();



const quizcard = (() => {
  var timecountdown;
  var landingPage = document.getElementsByClassName("card-body");
  var para1 = document.createElement("p");
  var para2 = document.createElement("p");
  var para3 = document.createElement("p");
  var time = document.createElement("h3");
  var index = 0;
  var correctAnswer = "";
  var answerPara = document.createElement("p");
  var textbox = document.createElement("INPUT");
  var card = document.createElement("div");
  var cardBody = document.createElement("div");
  var countCorrectAnswer=0;
  var countWorngAnswer=0;

  const getQuizCard = () => {
    appContainer.textContent = "";

    $(cardBody).empty();
    card.style.display = "block";
    index = 0;
    generateQuiz();
  };

  const generateQuiz = () => {
    console.log(index);
    var listOfObject = [];
    var wordsToTest = [];
    var fetchedAddedWordsFromLocalStorage = JSON.parse(
      localStorage.getItem("addedWords")
    );

    for (obj in fetchedAddedWordsFromLocalStorage) {
      if (fetchedAddedWordsFromLocalStorage[obj] !== undefined) {
        listOfObject.push(fetchedAddedWordsFromLocalStorage[obj]);
      }
    }

    for (let i = 0; i < 3; i++) {
      if (listOfObject[i] !== undefined) {
        wordsToTest.push(listOfObject[i]);
      }
    }

    if (wordsToTest.length < 3) {
      alert("Please save more than 3 words to start quiz");
      return;
    }

    if (index == 0) {
      timecountdown =wordsToTest.length *15;
      timeInterval = setInterval(function () {
        timecountdown--;

        //time.style.color = "blue";
        time.innerHTML = "<br/>Time: " + timecountdown;
        console.log(1);
        if (timecountdown === 0) {
          console.log("Times up !!");
          showScore();
          clearInterval(timeInterval);
        }
      }, 1100);
    }

    if (index == 3) {
      console.log("Quiz Done");
      showScore();
      return;
    }

    document.getElementById("btn-strt-quiz").disabled = true;
    answerPara.textContent = "";
    textbox.value = "";

    card.classList = "card quiz-card";
    cardBody.classList.add("card-body");
    quizTitle = document.createElement("h3");
    quizTitle.textContent = "Quiz";
    time.style.color = "blue";
    time.innerHTML = "<br/>Time: " + timecountdown;
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
    quizUl.appendChild(quizLiTwo);
    quizUl.appendChild(quizLiThree);
    var labelTextbox = document.createElement("p");
    labelTextbox.classList.add("text-lable");
    labelTextbox.textContent = "Guess the word";
    textbox.classList.add("text-box-guess");
    var quizform = document.createElement("form");
    var button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.classList.add("quiz-button");
    button.type = "submit";
    button.textContent = "Next";
    // Next button event listener
    button.addEventListener("click", (e) => {
      e.preventDefault();
      onNext();
    });
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
    quizform.appendChild(labelTextbox);
    quizform.appendChild(textboxDiv);
    quizform.appendChild(answerPara);
    quizform.appendChild(buttonDiv);
    quizform.appendChild(buttonLeaveDiv);
    cardBody.appendChild(quizTitle);
    cardBody.appendChild(time);
    cardBody.appendChild(quizIns);
    cardBody.appendChild(quizUl);
    cardBody.appendChild(quizform);
    card.appendChild(cardBody);
    appContainer.appendChild(card);
  };

  const onNext = () => {
    var emo = emoji.getEmojis();
    //console.log(textbox.value);

    var answer = textbox.value;

    if (textbox.value == "") {
      alert("Answer cannot be empty");
      return;
    }
    index = index + 1;

    console.log(emo);
    if (answer.toLowerCase() == correctAnswer.toLowerCase()) {
      console.log(emo.smile);
      corrEmo = emo.smile == undefined ? "1F601" : emo.smile;
      answerPara.innerHTML =
        "Correct" + " " + '<p class="h2">&#x' + corrEmo + "</p>";
        countCorrectAnswer =countCorrectAnswer+2;
      answerPara.style.textAlign = "center";
    } else {
      console.log(emo.sad);
      wronEmo = emo.sad == undefined ? "1F622" : emo.sad;
      answerPara.innerHTML =
        "Wrong" + " " + '<p class="h2">&#x' + wronEmo + "</p>";
      answerPara.style.textAlign = "center";
      countWorngAnswer=countWorngAnswer-1;
    }

    setTimeout(() => {
      $(cardBody).empty();
      generateQuiz();
    }, 1000);
  };

  const showScore = () => {
    console.log("Time ID:" + timeInterval);
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
    var finalScore = timecountdown<=0?0:timecountdown+countWorngAnswer+countCorrectAnswer;
    console.log(finalScore);
    score.innerHTML = "<br/>" +finalScore;
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
    // default word
    dictionary.search("rain");
    document.getElementById("btn-strt-quiz").disabled = false;
  };

  const getTimeInterval = () => {
    return timeInterval;
  };

  return {
    getQuizCard,
    generateQuiz,
    onNext,
    showScore,
    goToHome,
    getTimeInterval,
  };
})();



const emoji = (() => {
  let emojis = {};

  const getSimeleyEmoji = () => {
    fetch(
      "https://emoji-api.com/emojis/beaming-face-with-smiling-eyes?access_key=548c874a77bdb7e98f428e9451e5e719da3ebb3f"
    )
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            emojis.smile = data[0].codePoint;
          });
        }
      })
      .catch((error) => {
        // handle the error
      });
  };

  const getCryEmoji = () => {
    fetch(
      "https://emoji-api.com/emojis/crying-face?access_key=548c874a77bdb7e98f428e9451e5e719da3ebb3f"
    )
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            emojis.sad = data[0].codePoint;
          });
        }
      })
      .catch((error) => {
        // handle the error
      });
  };
  const getEmojis = () => {
    getSimeleyEmoji();
    getCryEmoji();
    return emojis;
  };

  return {
    getSimeleyEmoji,
    getCryEmoji,
    getEmojis,
  };
})();


// event listeners start --------------------------------


searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let searchWord = searchField.value;
  dictionary.search(searchWord);
  searchField.value = '';
  document.getElementById("btn-strt-quiz").disabled = false;
  clearInterval(timeInterval);
});

reviewBtn.addEventListener('click', () => {
  appContainer.textContent = '';
  appContainer.appendChild(domOps.createReviewCard(dictionary.getWords()));
  document.getElementById("btn-strt-quiz").disabled = false;
  clearInterval(timeInterval);
});

quizStartButton.addEventListener("click", quizcard.getQuizCard);


//event listeners end ------------------------------------

dictionary.setWords(storage.getWords());
appContainer.appendChild(domOps.createReviewCard(dictionary.getWords()));