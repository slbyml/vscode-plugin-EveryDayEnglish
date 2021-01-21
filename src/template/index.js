function replaceTxt(txt, emphasis) {
  const paraphraseList = emphasis
  return paraphraseList.reduce((previous, current) => {
    const reg = new RegExp(`(${current})`,'gi')
    return previous.replace(reg,"<span class='highlight'>$1</span>")
  }, txt)
}

module.exports = function(webviewView, data) {
  try {
    const emphasis = (data?.sentenceLecture?.lectureConfigList[0]?.paraphraseList || []).map(item => item.sentence.replace(/^\s+|\s+$/g,""))

    const template = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
        *{padding:0;margin:0}h2{border-bottom:1px solid #393939;padding:10px 0 5px;margin-bottom:5px}h3{color:#1e90ff;line-height:24px}h4{color:#1e90ff;line-height:20px}.border{border-top:1px dashed #393939;height:0;margin:10px 0 5px}ul{padding:10px}li{padding-bottom:8px}.box{padding-left:10px}.highlight{color:#1d6fd8}
        .ys{color:#336699}
        </style>
      </head>
      <body>
        <h2>🍱&ensp;今日推荐</h2>
        <div class="box">
          <h3>💥&ensp;${data?.dailysentence?.content}</h3>
          <p style="font-size:16px">🧐&ensp;${data?.dailysentence?.note}</p>
        </div>
        <h2>🍱&ensp;重点词汇</h2>
        <div class="box">
          ${data?.sentenceLecture?.lectureConfigList[0]?.paraphraseList
            ?.map((ele, index) => {
              return `<h3>${ele.sentence} ${ele.symbol}</h3>
              <p style="font-size:14px">${ele.paraphrase}</p>
              `;
            })
            .join("<p class='border'></p>")}
        </div>
        <h2>🍱&ensp;词汇延伸</h2>
        <div class="box">
          <ul>
          ${data?.sentenceLecture?.lectureConfigList[1]?.paraphraseList
            ?.map((ele, index) => {
              return `<li><h4 class="ys">${replaceTxt(ele.sentence, emphasis)}</h4>
              <p>${ele.paraphrase}</p></li>
              `;
            })
            .join("")}
          </ul>
        </div>
      </body>
      </html>
    `
    webviewView.webview.html = template
  } catch (error) {
    console.log(error, data);
    window.showInformationMessage(error);
  }
}