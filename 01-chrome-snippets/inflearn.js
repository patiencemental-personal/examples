function extractAndValidateTexts(timeout = 20000) {
  const container = document.querySelector(
    "div[data-radix-scroll-area-viewport]"
  );
  let texts = {};

  // 1초마다 실행되는 함수
  let interval = setInterval(function () {
    container.querySelectorAll("div[data-index]").forEach((div) => {
      let dataIndex = parseInt(div.getAttribute("data-index"));
      let p = div.querySelector("p:last-of-type");
      if (p) {
        texts[dataIndex] = p.textContent;
      }
    });
    console.log("execute...");
  }, 1000); // 1초 간격으로 반복

  // 20초 후에 반복 중지하고 처리
  setTimeout(function () {
    clearInterval(interval);

    // data-index 별로 정렬
    let sortedIndices = Object.keys(texts)
      .map(Number)
      .sort((a, b) => a - b);
    let sortedTexts = sortedIndices.map((index) => texts[index]);

    // 인접한 요소 간의 data-index 확인
    for (let i = 0; i < sortedIndices.length - 1; i++) {
      if (sortedIndices[i] + 1 !== sortedIndices[i + 1]) {
        console.error(
          "인접하지 않은 index:",
          sortedIndices[i],
          "및",
          sortedIndices[i + 1]
        );
        throw new Error("인접하지 않은 index 발견");
      }
    }

    // 정렬된 텍스트 출력
    console.log(sortedTexts.join("\n"));
  }, timeout);
}
