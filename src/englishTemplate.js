const vscode = require('vscode');
const fetch = require('node-fetch')
const template = require('./template')
const cache = {}



class ProviderTemplate {
  constructor() {
    this.data = null
  }
	async resolveWebviewView(webviewView) {
    const res = await this.fetch()
    if (cache.now) {
      this.data = cache.now
      this.render(webviewView, this.data)
    } else {
      this.fetch().then(json => {
        this.data = cache.now =  json
        this.render(webviewView, json)
      })
    }
  }
  fetch() {
    try {
      return fetch('http://sentence.iciba.com/api/sentence/list?app_type=0&brand=apple&ck=&client=3&limit=1')
      .then(res => res.json())
      .then(json => {
        console.log("数据请求成功!");
        const data = json.data || {}
        if (json.code === 0 && data.sentenceViewList && data.sentenceViewList.length) {
          return data.sentenceViewList[0]
        } else {
          window.showInformationMessage(json.msg);
        }
      });
    } catch (error) {
      window.showInformationMessage(error);
    }
  }
  render(webviewView, data=this.data) {
    template(webviewView, data)
  }
}

module.exports = ProviderTemplate