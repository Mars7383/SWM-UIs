const { app, ipcMain, BrowserWindow, screen: electronScreen, nativeTheme, session, /*Notification,*/ dialog } = require('electron');
const isDev = require('electron-is-dev');
const fs = require("fs")
const path = require("path")
const os = require('os');
const keytar = require("keytar");
const fetch = require("node-fetch")
const { localStorage } = require('electron-browser-storage');

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
const createMainWindow = async () => {
    let existingAsar = await localStorage.getItem("asar-path");
    let loadable = true; // ui asar loadable
    if (existingAsar != null) {
        try {
            if (path.join(existingAsar, "electron/main.js") == "electron/main.js") loadable = false;
            require(path.join(existingAsar, "electron/main.js"));
        } catch (e) {
            console.log("Couldn't load asar. \n" + e);
            loadable = false;
        }
    } else {
        loadable = false; // path doesnt exist
    }
    if (!loadable) {
    mainWindow = new BrowserWindow({
            width: 510,
            height: 510,
            show: false,
            title: " ",
            //backgroundColor: '#ffffffff',
            webPreferences: {
                nodeIntegration: true, // false
                devTools: true, //isDev
                contextIsolation: false,
                enableRemoteModule: true
            },
            //titleBarStyle: 'inset',
            //titleBarStyle: 'customButtonsOnHover',
            frame: false,
            transparent: true,
            closable: true,
            maximizable: false,
            resizable: false
        });
    const startURL = isDev
        ? `file://${path.join(__dirname, '../build/blank.html')}`
        : `file://${path.join(__dirname, '../build/blank.html')}`;

    mainWindow.loadURL(startURL);
    mainWindow.setMenu(null);
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        //require(`${path.join(__dirname, '../build/sigma.asar/electron/main.js')}`);
    });

    mainWindow.on('closed', () => {
        if (!editorWindowLoaded) {
            mainWindow = null;
            app.quit();
        } 
    });
    
    mainWindow.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        require('electron').shell.openExternal(url);
    });
    }
};

app.whenReady().then(() => {
    createMainWindow();
    app.on('activate', () => {
        if (!BrowserWindow.getAllWindows().length) {
            createMainWindow();
        }
    });
});

ipcMain.handle('save-asar-path', async (evt, arg) => {
    await localStorage.setItem("asar-path", arg);
});

ipcMain.handle('clear-asar-path', async (evt, arg) => {
    await localStorage.clear();
});

ipcMain.handle('quit', (evt, arg) => {
    app.quit();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});