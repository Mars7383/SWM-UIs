const { app, ipcMain, BrowserWindow, screen: electronScreen, nativeTheme, session, /*Notification,*/ dialog } = require('electron');
const isDev = require('electron-is-dev');
const fs = require("fs")
const path = require("path")
const os = require('os');
const keytar = require("keytar");
const fetch = require("node-fetch")

var prefs;
if (fs.existsSync(`${path.join(__dirname, "../../config.json")}`)) {
    prefs = require(`${path.join(__dirname, "../../config.json")}`) ;
} else {
    prefs = { 
        legacyWindow: false,
        multiInject: false,
        autoUpdate: true
    };
}  

let forceQuit = false;

var mainWindow;
var editorWindow;
let editorWindowLoaded = false;
const createMainWindow = () => {    
    mainWindow = new BrowserWindow({
            width: 250, //electronScreen.getPrimaryDisplay().workArea.width,
            height: 500, //electronScreen.getPrimaryDisplay().workArea.height,
            show: false,
            title: " ",
            backgroundColor: 'gray',
            webPreferences: {
                nodeIntegration: true, // false
                devTools: true, //isDev
                contextIsolation: false,
                enableRemoteModule: true
            },
            //titleBarStyle: 'inset',
            closable: true,
            maximizable: false,
            resizable: false
        });
        editorWindow = new BrowserWindow({
            width: 625, //electronScreen.getPrimaryDisplay().workArea.width,
            height: 375, //electronScreen.getPrimaryDisplay().workArea.height,
            show: false,
            title: " ",
            backgroundColor: 'gray',
            webPreferences: {
                nodeIntegration: true, // false
                devTools: true, //isDev
                contextIsolation: false,
                enableRemoteModule: true
            },
            //titleBarStyle: 'inset',
            closable: true,
            maximizable: true,
            resizable: true
        });
    const startURL = isDev
        ? `file://${path.join(__dirname, '../build/index.html')}`
        : `file://${path.join(__dirname, '../build/index.html')}`;

    mainWindow.loadURL(startURL);
    mainWindow.setMenu(null);
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        if (!editorWindowLoaded) {
            mainWindow = null;
            app.quit();
        } 
    });
    
    mainWindow.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        //mainWindow.loadURL(url);
        require('electron').shell.openExternal(url);
    });
};

ipcMain.handle("loadMainWindow", async (evt, arg) => {
    editorWindow.loadURL(`file://${path.join(__dirname, '../build/editor.html')}`);
    editorWindow.once('ready-to-show', () => {
        editorWindow.show();
        editorWindowLoaded = true;
        mainWindow.close();
    });
    editorWindow.on('closed', () => {
        editorWindow = null;
        app.quit();
    });
})

ipcMain.handle("autoUpdates", async (evt, arg) => {
    return "no";
})

ipcMain.handle("setPref", async (evt, arg) => {
    return "no";
})

app.whenReady().then(() => {
    createMainWindow();
    app.on('activate', () => {
        if (!BrowserWindow.getAllWindows().length) {
            createMainWindow();
        }
    });
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


require("./script-ware-electron-funcs.js"); // Exempt from source code