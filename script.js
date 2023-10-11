function playPause(audioElement, buttonElement) {
    let playing = false;
    return function () {
        if (!playing) {
            audioElement.play();
            // KaiOS browser apparently is too old and does not return a value from .play() so no promises
            playing = true;
            buttonElement.innerHTML = "Pause";
        } else {
            // .pause() does not return anything by default
            audioElement.pause();
            playing = false;
            buttonElement.innerHTML = "Play";
        };
        return playing;
    };
};

// fetch is not compatible with gecko 38
function getAsebeiaNowPlaying(callback) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            callback(xhr.response);
        };
    };

    xhr.open("GET", "https://azura.asebeia.su/api/nowplaying/1", true);
    xhr.send();
};

function getSilverHTML(callback) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            callback(xhr.response);
        };
    };
    // bypassing cors to scrape for data
    xhr.open("GET", 'https://corsproxy.io/?' + encodeURIComponent('https://www.silver.ru/time-schedule/'), true);
    xhr.send();
};

function findSilverNowPlaying(scrapedText) {
    let match = scrapedText.match(/'В эфире: .+?'/g);
    if (match[0].includes("player.SetArtist")) {
        return "Информация об эфире обновляется";
    } else {
        return match[0].slice(1, match[0].length - 1);
    };
};

window.onload = function (event) {
    // stopping other stations when starting playback of a new one
    let lastPlayButton = undefined;
    let globalPlaying = false;
    let stations = Array.from(document.querySelectorAll(".station"));
    stations.forEach((station) => {
        let audioEl = station.querySelector("audio");
        let button = station.querySelector("button");
        let handler = playPause(audioEl, button);
        button.addEventListener("click", (event) => {
            let newPlaying = handler();
            if (globalPlaying && newPlaying) lastPlayButton.click();
            globalPlaying = newPlaying;
            newPlaying ? lastPlayButton = button : lastPlayButton = undefined;
        });
    });

    // get track info from asebeia
    let nowPlayingA = document.createElement("p");
    let audioAsebeia = document.getElementById("asebeia-station");
    let intervalId;

    audioAsebeia.addEventListener("playing", (event) => {
        document.getElementById("now-playing").appendChild(nowPlayingA);
        getAsebeiaNowPlaying((data) => {
            data = JSON.parse(data);
            nowPlayingA.innerHTML = `Now playing: ${data.now_playing.song.text}`;
        });
        intervalId = setInterval(() => {
            getAsebeiaNowPlaying((data) => {
                data = JSON.parse(data);
                nowPlayingA.innerHTML = `Now playing: ${data.now_playing.song.text}`;
            });
        }, 10000);
    });

    audioAsebeia.addEventListener("pause", (event) => {
        clearInterval(intervalId);
        nowPlayingA.remove();
    });

    // get program info from silver
    let nowPlayingS = document.createElement("p");
    let audioSilver = document.getElementById("silver-station");
    let silverIntervalId;

    audioSilver.addEventListener("playing", (event) => {
        document.getElementById("now-playing").appendChild(nowPlayingS);
        getSilverHTML((response) => {
            nowPlayingS.innerHTML = findSilverNowPlaying(response);
        });
        silverIntervalId = setInterval(() => {
            getSilverHTML((response) => {
                nowPlayingS.innerHTML = findSilverNowPlaying(response);
            });
        }, 60000);
    })

    audioSilver.addEventListener("pause", (event) => {
        clearInterval(silverIntervalId);
        nowPlayingS.remove();
    });
};