# DeepSeek VS Extension
A simple chatbot extension for Visual Studio Code using Ollama API.

## Features

*   Ask questions and get answers from a built-in chatbot
*   Powered by the Ollama API, providing natural language processing capabilities
*   Customizable UI with HTML and CSS styles

## Usage

To use this chatbot, follow these steps:

1.  `git clone` to local machine 
2.  Open Command Palette by pressing (Cmd + Shift +P) and run the command **Tasks: Run Build Tasks** and enter following commands <br>` npm: compile - deepseek-vs-ext`<br>`tsc -p ./`
    1.  I had to run this command every time I made a change in my code. I will have to go back and look into this. 
3.  Open Command Palette by pressing (Cmd + Shift +P) and run the command **Debug: Start Debugging**
    1.  This will run the extension in a new **Extension Development Host** window
4.  In the new window run the command **DeepSeek** and a new panel will appear with a text input field and a button labeled "Ask".
5.  Type your question or query in the text input field.
6.  Click the "Ask" button to send the query to the chatbot.
7.  The response from the chatbot will be displayed below the text input field.

