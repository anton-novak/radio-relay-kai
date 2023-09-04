function stopOtherStations(currentAudioElement) {
    console.log('called')
    let audioElements = document.getElementsByTagName("audio");
    Array.from(audioElements).forEach(element => {
        if (element !== currentAudioElement) element.pause();
    });
};

window.onload = function (event) {
    console.log('onload')
    let audioElements = document.getElementsByTagName("audio");
    Array.from(audioElements).forEach(element => {
        element.addEventListener("play", (event) => {
            stopOtherStations(element);
        });
    });
};