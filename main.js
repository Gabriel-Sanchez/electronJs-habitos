console.log('hola gabo'); 
const fs = require('fs');

const { app, BrowserWindow, ipcMain , screen} = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      enableRemoteModule: true
      }
    })
  
    win.loadFile('index.html')

    ipcMain.on('request-data', (event) => {
      var data = fs.readFileSync("data.json", 'utf8');
      var jsonData = JSON.parse(data);
      event.sender.send('send-data', jsonData);
    });

    ipcMain.on('abrir-ventana-secundaria', () => {
      let { width, height } = screen.getPrimaryDisplay().workAreaSize;
      let winSecundaria = new BrowserWindow({
          width: 400,
          height: 300,
          // frame: false,
          x: width - 400,
          y: height - 300,
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
      enableRemoteModule: true
          }
      })
      winSecundaria.loadFile('pomodoro.html');
   
      ipcMain.on('cerrar-ventana-pom', (event, arg) => {
        if (!winSecundaria.isDestroyed()) {
          winSecundaria.close();
        }
      });


      ipcMain.on('mover-ventana-pom', (event, arg) => {
        if (!winSecundaria.isDestroyed()) {
          winSecundaria.setPosition(arg.x, arg.y);
          // winSecundaria.setPosition(Math.round(arg.x), Math.round(arg.y));
        }
      });

      ipcMain.on('obtener-ventana-pom', (event) => {
        if (!winSecundaria.isDestroyed()) {
          event.returnValue = winSecundaria.getBounds();
        }
      });

      winSecundaria.on('closed', () => {
        winSecundaria = null;
        ipcMain.removeAllListeners('cerrar-ventana-pom');
        ipcMain.removeAllListeners('mover-ventana-pom');
        ipcMain.removeAllListeners('obtener-ventana-pom');
      });

   

    
      
      
  });


  
  }

  app.whenReady().then(() => {
    createWindow()
  })