let result = "";

const transcriptRenderers = window.document.querySelectorAll(
  "ytd-transcript-segment-renderer"
);
transcriptRenderers.forEach((item) => {
  // console.log(item.querySelector('div.segment-timestamp').textContent)
  const timestamp = item
    .querySelector("div.segment-timestamp")
    .textContent.trim();
  const text = item.querySelector(".segment-text").textContent;
  // console.log(timestamp + ' ' + text)
  result += `시간: ${timestamp}\r\n\r\n${text}\r\n\r\n\r\n\r\n`;
});

console.log(result);
