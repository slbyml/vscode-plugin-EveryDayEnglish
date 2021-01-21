const vscode = require('vscode');
const ProviderTemplate = require('./src/englishTemplate')


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('every-day-english插件已经被激活');
	try {
		const sidebarProvider = new ProviderTemplate(context)
		let disposable = vscode.window.registerWebviewViewProvider("everyDayEnglishOne", sidebarProvider)
	
		context.subscriptions.push(disposable);
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
