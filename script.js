// to test on the actual device if .js file loads up correctly
// it does not :(
let a = document.createElement("h1");
a.innerHTML = "Hello";
document.querySelector("body").appendChild(a);

// function stopOtherStations(currentAudioElement) {
//     let audioElements = document.getElementsByTagName("audio");
//     Array.from(audioElements).forEach(element => {
//         if (element !== currentAudioElement) element.pause();
//     });
// };

function playPause(audioElement) {
    let playing = false;
    return function() {
        if (!playing) {
            audioElement.play()
                .then(() => {
                    playing = true;
                });
        } else {
            // .pause() does not return anything
            audioElement.pause()
            playing = false;
        };
    };
};

window.onload = function(event) {
    let stations = Array.from(document.querySelectorAll(".station"));
    stations.forEach((station) => {
        let audioEl = station.querySelector("audio");
        let button = station.querySelector("button");
        let handler = playPause(audioEl);
        button.addEventListener("click", (event) => {
            handler();
        });
    });
};

// async function getAsebeiaNowPlaying() {
//     let response = await fetch("https://azura.asebeia.su/api/nowplaying/1");
//     let nowPlaying = await response.json();
//     return nowPlaying.now_playing.song.text;
// };

// window.onload = function (event) {
//     let audioElements = document.getElementsByTagName("audio");
//     Array.from(audioElements).forEach(element => {
//         element.addEventListener("play", (event) => {
//             stopOtherStations(element);
//         });
//     });

//     // asebeia-specific code
//     let audioAsebeia = document.getElementById("asebeia-station");
//     let intervalId;

//     audioAsebeia.addEventListener("playing", async (event) => {
//         let nowPlayingAsebeia = document.getElementById("now-playing-asebeia");
//         nowPlayingAsebeia.innerHTML = `Now playing: ${await getAsebeiaNowPlaying()}`;
//         intervalId = setInterval(async () => {
//             console.log(await getAsebeiaNowPlaying());
//             nowPlayingAsebeia.innerHTML = `Now playing: ${await getAsebeiaNowPlaying()}`;
//         }, 10000);
//     });

//     audioAsebeia.addEventListener("pause", (event) => {
//         clearInterval(intervalId);
//     });

// };

// // scraping HTML of https://www.silver.ru and other websites for tags
// // is in conflict with CORS restrictions and is hard to do in a
// // serverless environment (blocked by browser by design)