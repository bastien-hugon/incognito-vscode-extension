"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const utils_1 = require("./utils");
const newScreen_1 = require("../templates/newScreen");
const prompt = {
    prompt: 'What is the screen\'s name ?',
    placeHolder: 'MyAwesomeScreen'
};
const createScreen = (ctx, uri) => __awaiter(void 0, void 0, void 0, function* () {
    vscode.window.showErrorMessage('CALLED');
    if (utils_1.isLukoWorkspace()) {
        const screenName = yield vscode.window.showInputBox(prompt);
        if (!screenName) {
            return;
        }
        ;
        const newFile = vscode.Uri.parse('untitled:' + path.join(uri.path, `${screenName}.tsx`));
        vscode.workspace.openTextDocument(newFile).then(document => {
            const edit = new vscode.WorkspaceEdit();
            edit.insert(newFile, new vscode.Position(0, 0), newScreen_1.default.split('SCREEN_NAME').join(screenName));
            return vscode.workspace.applyEdit(edit).then(success => {
                if (success) {
                    vscode.window.showTextDocument(document);
                }
                else {
                    vscode.window.showInformationMessage('An error occured :(');
                }
            });
        });
        const screenFilePath = vscode.Uri.parse(`${utils_1.getWorkspaceFolder()}/app/screens.tsx`);
        vscode.workspace.openTextDocument(screenFilePath).then(document => {
            const edit = new vscode.WorkspaceEdit();
            edit.insert(screenFilePath, new vscode.Position(10, 0), `import ${screenName} from '~/features/${path.join(uri.path, `${screenName}`).split('/features/')[1]}';\n`);
            // Search registerComponent available line
            const line = document.getText().split('\n').findIndex((lineValue) => /registerComponent\(\'Initializing\', InitializingScreen\);/g.test(lineValue));
            edit.insert(screenFilePath, new vscode.Position(line + 1, 0), `  registerComponent('myLuko.${screenName}', ${screenName});\n`);
            return vscode.workspace.applyEdit(edit).then(success => {
                if (success) {
                    vscode.window.showTextDocument(document);
                }
                else {
                    vscode.window.showInformationMessage('An error occured :(');
                }
            });
        });
    }
});
exports.default = createScreen;
//# sourceMappingURL=createScreen%20copy.js.map