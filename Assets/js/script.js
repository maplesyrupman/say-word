var timecountdown = 45;
var landingPage = document.getElementsByClassName("landing-flex-container");
var quizCard = document.getElementsByClassName("quiz-flex-container");
var quizCardItem = document.getElementsByClassName("quiz-flex-item one");
var para1 = document.createElement("p");
var para2 = document.createElement("p");
var para3 = document.createElement("p");
var quizTilte = document.createElement("h3");
//Time
var timeEl = document.querySelector("#cnt");
addedWordsToLocalStorage = ["aple", "test", "test", "test", "test"];

const dictionary = (() => {
  let words = {};

  const getDef = (word) => {
    let apiUrl = `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=eef68214-e15e-46fc-8e3b-5c0c4330f2db`;

    fetch(apiUrl).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          domOps.displayDef(createDefObj(data, word));

          words[word] = createDefObj(data, word);
        });
      }
    });
  };

  const getAntSyn = (word) => {
    let apiUrl = `https://dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=15205c99-2cb8-498d-a9f9-f5bdc4865029`;

    fetch(apiUrl).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log(data);
        });
      }
    });
  };

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

  const getWords = () => {
    return words;
  };

  return {
    getDef,
    getAntSyn,
    stripAstr,
    getAudioUrl,
    getWords,
  };
})();

const domOps = (() => {
  const createDefCard = (defObj) => {
    let word = defObj.word;
    let definitionCard = document.createElement("div");
    definitionCard.classList.add("card");
    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    let definitionHeader = document.createElement("div");
    definitionHeader.textContent = word;
    let soundButton = document.createElement("button");
    let saveButton = document.createElement("button");
    definitionHeader.classList.add("card");
    saveButton.classList.add("btn-save");
    soundButton.classList.add("btn-sound");

    definitionCard.appendChild(cardBody);
    cardBody.appendChild(definitionHeader);
    definitionHeader.appendChild(soundButton, saveButton);

    return definitionCard;
  };

  return {
    createDefCard,
  };
})();

const storage = (() => {
  let sayhi = function () {
    console.log("hi");
  };

  return {
    sayhi,
  };
})();
/*
#########################################################
Function name : getQuizCard
Description
- Randomly use random 3 words from list of local storage words
- Display defination and ask for word
- Check right or wrong
- Display results or start quiz again
- To start quiz altleast three words should be added to local storage words
#########################################################
*/

function getQuizCard() {
  // need to put code to remove landing page element
  landingPage[0].style.display = "none";

  if (this.addedWordsToLocalStorage.length < 3) {
    prompt(
      "Please add more words to take quiz.To memorize minimum 3 words should be added."
    );
  } else {
    quizCard[0].style.display = "flex";
    starTimer();

    //var randomThreeWords;

    /* for (let i = 0; i <3; i++) {
        
      }*/
  }
}
/*
#########################################################
Function name : starTimer()
Description
- This function is used to start timer
#########################################################
*/

function starTimer() {
  timeInterval = setInterval(function () {
    timecountdown--;

    this.timeEl.textContent = timecountdown;

    if (timecountdown === 0) {
      ShowScore();
      clearArea();
      //clearInterval(timeInterval);
    }
  }, 1000);
}
