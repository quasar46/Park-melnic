(function () {
  if (document.querySelectorAll(".player").length > 0) {
    let audio = document.querySelector(".player audio");

    let time = document.querySelector(".player .time");
    let timeCurrent = document.querySelector(".player .time-current");
    let timeDuration = document.querySelector(".player .time-duration");

    let btnPlay = document.querySelector(".player .play");
    let btnPause = document.querySelector(".player .pause");
    let btnPrev = document.querySelector(".player .prev");
    let btnNext = document.querySelector(".player .next");
    let treck = 0;

    function updateTrack() {
      let audioTime = Math.round(audio.currentTime);
      let audioLength = Math.round(audio.duration);

      if (audioLength && audioTime) {
        time.style.width = (audioTime * 100) / audioLength + "%";

        let allHours = Math.floor(audio.duration / 60 / 60);
        let allMinute = Math.floor(audio.duration / 60) - allHours * 60;
        let allSeconds = audio.duration % 60;

        timeDuration.innerHTML = `${allMinute
          .toFixed(0)
          .toString()
          .padStart(2, "0")}:${allSeconds
          .toFixed(0)
          .toString()
          .padStart(2, "0")}`;

        let currentHours = Math.floor(audio.currentTime / 60 / 60);
        let currentMinute =
          Math.floor(audio.currentTime / 60) - currentHours * 60;
        let currentSeconds = audio.currentTime % 60;

        timeCurrent.innerHTML = `${currentMinute
          .toFixed(0)
          .toString()
          .padStart(2, "0")}:${currentSeconds
          .toFixed(0)
          .toString()
          .padStart(2, "0")}`;
      }
    }

    btnPlay.addEventListener("click", function () {
      audio.play();
      audioPlay = setInterval(updateTrack, 10);
      btnPlay.style.display = "none";
      btnPause.style.display = "inline-block";
    });

    btnPause.addEventListener("click", function () {
      audio.pause();
      clearInterval(audioPlay);
      btnPlay.style.display = "inline-block";
      btnPause.style.display = "none";
    });

    btnPrev.addEventListener("click", function () {
      if (audio) {
        audio.currentTime = audio.currentTime - 10;
        updateTrack();
      }
    });

    btnNext.addEventListener("click", function () {
      if (audio) {
        audio.currentTime = audio.currentTime + 10;
        updateTrack();
      }
    });

    audio.addEventListener("ended", function () {
      audio.currentTime = 0;
      btnPlay.style.display = "inline-block";
      btnPause.style.display = "none";
      updateTrack();
    });
  }
})();
