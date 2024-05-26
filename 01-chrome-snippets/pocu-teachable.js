// 참고 gist: https://gist.github.com/ebidel/d923001dd7244dbd3fe0d5116050d227

const video = window.document.querySelector("video.vjs-tech");

let subscription = "";
let cur = "";
let prev = "";
let subNode = null;

console.log(video);
video.onended = function (e) {
  console.log("onended");
};

video.play = (event) => {
  console.log("play");
  const title = window.document
    .querySelector("h2#lecture_heading")
    .textContent.trim();
  console.log(title);
  video.currentTime = 0;
  video.play();
};
setTimeout(() => {
  video.onended = function (e) {
    console.log("onended");
  };

  video.play = (event) => {
    console.log("play");
    const title = window.document
      .querySelector("h2#lecture_heading")
      .textContent.trim();
    console.log(title);
    video.currentTime = 0;
    // video.play();
  };
}, 1000);

// setInterval(() => {
//     subNode = document.querySelector("pre[data-testid='subtitle-text']");
//     if (subNode !== null) {
//         cur = subNode.textContent + '\n\n\n';
//         if (cur !== prev) {
//             subscription += cur;
//             prev = cur;
//             console.log(subscription);
//         }
//     }
// }, 200);
