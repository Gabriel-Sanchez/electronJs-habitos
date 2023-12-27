console.log('hola gabo');
const fs = require('fs');

const { app, BrowserWindow, ipcMain, screen } = require('electron')


const createWindow = () => {
  const win = new BrowserWindow({
    width: 500,
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

  ipcMain.on('abrir-ventana-secundaria', (event, value) => {
    let { width, height } = screen.getPrimaryDisplay().workAreaSize;
    let winSecundaria = new BrowserWindow({
      width: 230,
      height: 100,
      frame: false,
      x: width - 230,
      y: height - 102,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
      }
    })
    winSecundaria.loadFile('pomodoro.html');



    winSecundaria.webContents.on('did-finish-load', function () {
      winSecundaria.webContents.send('button-value', value)
    })

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

  ipcMain.on('abrir-ventana-grafico', (event, value) => {
    let { width, height } = screen.getPrimaryDisplay().workAreaSize;
    let wingrafico = new BrowserWindow({
      width: 1020,
      height: 800,
      // frame: false,
      //x: width - 400,
      //y: height - 300,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
      }
    })
    wingrafico.loadFile('grafico/grafico_habito.html');
    wingrafico.webContents.on('did-finish-load', function () {
      wingrafico.webContents.send('button-value', value)
    })
  });

  // wingrafico.webContents.on('did-finish-load', () => {
  //   const cal = new CalHeatMap();
  //   cal.init({
  //     itemSelector: '#cal-heatmap-container', // Selecciona el elemento donde se renderizará el mapa de calor
  //     domain: 'month',
  //     subDomain: 'day',
  //     data: myData, // Asegúrate de tener los datos adecuados para el mapa de calor
  //     start: new Date(2023, 0), // Fecha de inicio
  //     cellSize: 20
  //   });
  // });


}

app.whenReady().then(() => {
  createWindow()
})