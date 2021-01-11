const vscode = require('vscode');
const ProviderTemplate = require('./src/englishTemplate')


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('every-day-english插件已经被激活');
	// vscode.window.setStatusBarMessage('你好，朋友！');
	try {
		const sidebarProvider = new ProviderTemplate()
		let disposable = vscode.window.registerWebviewViewProvider("everyDayEnglishOne", sidebarProvider)
		// let disposable2 = vscode.window.registerWebviewViewProvider("everyDayEnglishTwo", sidebarProvider)
	
		context.subscriptions.push(disposable);
		context.subscriptions.push(disposable2);
	} catch (error) {
		window.showInformationMessage(error);
	}
	
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
