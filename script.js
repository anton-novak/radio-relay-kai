// to test on the actual device if .js file loads up correctly
// it does not :(
// window.addEventListener("load", (event) => {
    // console.log("run")
    let a = document.createElement("h1");
    a.innerHTML = "Hello";
    document.querySelector("body").prepend(a);
// })

// function stopOtherStations(currentAudioElement) {
//     let audioElements = document.getElementsByTagName("audio");
//     Array.from(audioElements).forEach(element => {
//         if (element !== currentAudioElement) element.pause();
//     });
// };

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

// scraping HTML of https://www.silver.ru and other websites for tags
// is in conflict with CORS restrictions and is hard to do in a
// serverless environment (blocked by browser by design)