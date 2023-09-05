function playPause(audioElement) {
    let playing = false;
    return function () {
        if (!playing) {
            audioElement.play();
            // KaiOS browser apparently is too old and does not return a value from .play() so no promises
            playing = true;
        } else {
            // .pause() does not return anything by default
            audioElement.pause();
            playing = false;
        };
        return playing;
    };
};

function getAsebeiaNowPlaying() {
    return fetch("https://azura.asebeia.su/api/nowplaying/1")
        .then((response) => {
            return response.json();
        });
};

window.onload = function (event) {
    // stopping other stations when starting playback of a new one
    let lastPlayButton = undefined;
    let globalPlaying = false;
    let stations = Array.from(document.querySelectorAll(".station"));
    stations.forEach((station) => {
        let audioEl = station.querySelector("audio");
        let button = station.querySelector("button");
        let handler = playPause(audioEl);
        button.addEventListener("click", (event) => {
            let newPlaying = handler();
            if (globalPlaying && newPlaying) lastPlayButton.click();
            globalPlaying = newPlaying;
            newPlaying ? lastPlayButton = button : lastPlayButton = undefined;
        });
    });

    // get track info from asebeia
    let audioAsebeia = document.getElementById("asebeia-station");
    let nowPlayingAsebeia = document.createElement("p");
    let intervalId;

    audioAsebeia.addEventListener("playing", async (event) => {
        document.getElementById("now-playing").appendChild(nowPlayingAsebeia);
        getAsebeiaNowPlaying()
            .then((data) => {
                nowPlayingAsebeia.innerHTML = `Now playing: ${data.now_playing.song.text}`;
            });
        intervalId = setInterval(() => {
            getAsebeiaNowPlaying()
                .then((data) => {
                    nowPlayingAsebeia.innerHTML = `Now playing: ${data.now_playing.song.text}`;
                });
        }, 10000);
    });

    audioAsebeia.addEventListener("pause", (event) => {
        clearInterval(intervalId);
        nowPlayingAsebeia.remove();
    });
};

// scraping HTML of https://www.silver.ru and other websites for tags
// is in conflict with CORS restrictions and is hard to do in a
// serverless environment (blocked by browser by design)