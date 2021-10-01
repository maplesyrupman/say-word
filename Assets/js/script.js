const dictionary = (() => {

    let words = {1word, 2word};

    const getDef = word => {
        let apiUrl = `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=eef68214-e15e-46fc-8e3b-5c0c4330f2db`;

        fetch(apiUrl).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    domOps.displayDef(createDefObj(data,word));

                    words[word] = createDefObj(data, word);
                });
            }
        })
    }
    
    const getAntSyn = word => {
        let apiUrl = `https://dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=15205c99-2cb8-498d-a9f9-f5bdc4865029`;
    
        fetch(apiUrl).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    console.log(data)
                });
            }
        });
    }

    const stripAstr = word => {
        let strippedArr = word.split('*');
        return strippedArr.join('');
    }

    const createDefObj = (defArr, word) => {
        let defObj = {
            word: word,
            audioUrl: getAudioUrl(defArr),
            defs: []
        };
        for (let i=0; i< defArr.length; i++) {
            let currentDef = defArr[i];
            if (stripAstr(currentDef.hwi.hw) == word) {
                let type = {
                    fl: currentDef.fl,
                    defSentances: currentDef.shortdef
                };
                defObj.defs.push(type);
            } else {
                break;
            }
        }
        return defObj
    }

    const getAudioUrl = defArr => {
        let baseFilename = defArr[0].hwi.prs[0].sound.audio;
        let subdirectory = (baseFilename.substr(0, 3) == 'bix') ? 'bix' :
                            (baseFilename.substr(0, 3) == 'gg') ? 'gg' :
                            baseFilename[0];
        return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${baseFilename}.mp3`
    }

    const getWords = () => {
        return words;
    }

    return {
        getDef, 
        getAntSyn,
        stripAstr,
        getAudioUrl,
        getWords
    }
})();

const domOps = (() => {
    const createDefCard = (defObj) => {
        let definitionCard = document.createElement('div');
    }

    return {
        createDefCard,
    }
})();

const storage = (() => {

    let sayhi = function () {
        console.log('hi');
    }

    return {
        sayhi
    }
})()