const dictionary = (() => {

    const getDef = (word) => {
        let apiUrl = `https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=eef68214-e15e-46fc-8e3b-5c0c4330f2db`;
        let apiResponse;
        fetch(apiUrl).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    return data;
                });
            }
        });

    }
    
    const getAntSyn = (word) => {
        let apiUrl = `https://dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=15205c99-2cb8-498d-a9f9-f5bdc4865029`;
    
        fetch(apiUrl).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    console.log(data);
                });
            }
        });
    }

    const stripAstr = word => {
        let strippedArr = word.split('*');
        return strippedArr.join('');
    }

    const createDefObj = (defArr, word) => {
        for (let i=0; i< defArr.length; i++) {

        }
    }

    const getAudioUrl = defArr => {
        let baseFilename = defArr[0].hwi.prs[0].sound.audio;
        let subdirectory = (baseFilename.substr(0, 3) == 'bix') ? 'bix' :
                            (baseFilename.substr(0, 3) == 'gg') ? 'gg' :
                            baseFilename[0];
        return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${baseFilename}.mp3`
    }


    return {
        getDef, 
        getAntSyn,
        stripAstr,
        getAudioUrl
    }
})();
