"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const ollama_1 = __importDefault(require("ollama"));
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // Had issues with activating it while debugging: Solution from https://stackoverflow.com/questions/43197245/vscode-activating-extension-failed-cannot-find-module-with-non-relative-import?newreg=72b83b3abd374681b5e2152775af0b59 
    // For me the solution was to do an npm compile, which I did by doing a Run Build Task from the command palette (cmd+shift+p), then selecting npm compile - <extension name>. 
    // I believe you can also accomplish this from the terminal in your project directory with tsc -p ./
    // console.log('Congratulations, your extension "deepseek-vs-ext" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand('deepseek-vs-ext.deepSeek', () => {
        const panel = vscode.window.createWebviewPanel('deepChat', 'Deep Seek Chat', vscode.ViewColumn.One, { enableScripts: true });
        panel.webview.html = getWebviewContent();
        panel.webview.onDidReceiveMessage(async (message) => {
            if (message.command === 'chat') {
                const userPrompt = message.text;
                let responseText = '';
                try {
                    const streamResponse = await ollama_1.default.chat({
                        // I had to specify the specific mode otherwise it wouldn't work
                        model: 'deepseek-r1:1.5b',
                        messages: [{ role: 'user', content: userPrompt }],
                        stream: true
                    });
                    for await (const part of streamResponse) {
                        responseText += part.message.content;
                        panel.webview.postMessage({ command: 'chatResponse', text: responseText });
                    }
                }
                catch (error) {
                    console.error('Error with Ollama request:', error);
                    panel.webview.postMessage({ command: 'chatResponse', text: 'An error occurred while processing your request.' });
                }
            }
        });
    });
    context.subscriptions.push(disposable);
}
function getWebviewContent() {
    return /*html*/ `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<style>
			body { font-family: sans-serif; margin: 1rem; }
			#prompt { width: 100%; box-sizing: border-box; }
			#response { border: 1px solid #ccc; margin-top: 1rem; padding: 0.5rem; min-height: 75%; min-width: 40ch; font-size: 14px; }
			#askBtn { background-color:rgb(79, 76, 175); color: white; border: none; padding: 5px 10px; font-size: 16px; cursor: pointer; }
			#askBtn: hover { background-color:rgb(79, 62, 142); }
		</style>
	</head>
	<body>
		<h2>DeepSeek VS Code Extension</h2>
		<textarea id="prompt" rows="3" placeholder="Ask me something..."></textarea><br />
		<button id="askBtn">Ask</button>
		<div id="response">
			<p id="response-text"></p>
			<p id="response-status" style="color: green;"></p>
		</div>

		<script>
			const vscode = acquireVsCodeApi();

			document.getElementById('askBtn').addEventListener('click', () => {
				const text = document.getElementById('prompt').value;
				vscode.postMessage({ command: 'chat', text });
			});

			window.addEventListener('message', event => {
				const {command, text } = event.data;
				if (command === 'chatResponse') {
					document.getElementById('response-text').innerText = text;
					const statusElement = document.getElementById('response-status');
					if (text.startsWith('Error:')) {
						statusElement.style.color = 'red';
						statusElement.innerText = 'Error: ' + text.substring(6);
					} else {
						statusElement.style.color = 'green';
						statusElement.innerText = 'Succes!'
					}
				}
			});
		</script>
	</body>
	</html>
	`;
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map