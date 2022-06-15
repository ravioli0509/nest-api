import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { app, BrowserWindow } from 'electron';

let mainWindow = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

// const Electron = require('electron');

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

app.on('ready', () => {
  // メイン画面の表示。ウィンドウの幅、高さを指定できる
  mainWindow = new BrowserWindow({ width: 1200, height: 720 })
  mainWindow.loadURL('http://localhost:3000/')

  // ウィンドウが閉じられたらアプリも終了
  mainWindow.on('closed', () => {
    mainWindow = null
  })
})
// const App = Electron.app;
