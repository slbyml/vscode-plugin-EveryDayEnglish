const vscode = require('vscode');
const fetch = require('node-fetch')
const template = require('./template')
const fs = require("fs")
const path = require("path")

// 获取今日的日期y-m-d
const getDate = (date = new Date()) => {
  const day =date;
  var current = "";
  const Year= day.getFullYear();
  const Month= day.getMonth()+1;
  const Day= day.getDate();
  current += Year + "-";
  if (Month >= 10 ){
    current += Month + "-";
  }else {
   current += "0" + Month + "-";
  }
  if (Day >= 10 ){
   current += Day ;
  } else {
   current += "0" + Day ;
  }
  return current;
}


class ProviderTemplate {
  constructor(context) {
    this.data = null
    this.webview = null
    this.cachePath = ""
    try {
      // 优先读取缓存的数据
      this.cachePath  = context.globalStoragePath
      if (!fs.existsSync(this.cachePath)) {
        fs.mkdirSync(this.cachePath)
      }
      const pathCache = this.cachePath =  path.join(this.cachePath, 'cache.json')
      if (!fs.existsSync(pathCache)) {
        // 如果没有cache.json文件,则说明没有缓存
        this.fetchData()
        return this
      }
      const data = JSON.parse(fs.readFileSync(pathCache, 'utf8'))
      if (getDate() === data.dailysentence.title) {
        // 使用缓存数据
        this.data  = data        
      } else {
        // 缓存已过期
        this.fetchData()
      }
      
    } catch (error) {
      console.log(error);
    }
  }
	async resolveWebviewView(webviewView) {
    if (this.data) {
      this.render(webviewView, this.data)
    } else {
      this.webview = webviewView
    }
  }
  fetchData() {
    this.fetch().then(json => {
      this.data =  json
      if (this.webview) {
        this.render(this.webview, this.data)
      }
    })
  }
  fetch() {
    try {
      return fetch('https://sentence.iciba.com/api/sentence/list?app_type=0&brand=apple&ck=&client=3&limit=1')
      .then(res => res.json())
      .then(json => {
        const data = json.data || {}
        if (json.code === 0 && data.sentenceViewList && data.sentenceViewList.length) {
          vscode.window.showInformationMessage(`最新每日英语(${data.sentenceViewList[0].dailysentence.title})已经更新!`)
          fs.writeFile(this.cachePath, JSON.stringify(data.sentenceViewList[0]), err => {
            console.log(err);
          })
          return data.sentenceViewList[0]
        } else {
          vscode.window.showInformationMessage(json.msg);
        }
      });
    } catch (error) {
      vscode.window.showInformationMessage(error);
    }
  }
  render(webviewView, data=this.data) {
    template(webviewView, data)
  }
}

module.exports = ProviderTemplate