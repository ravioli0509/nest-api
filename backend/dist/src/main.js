"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const electron_1 = require("electron");
let mainWindow = null;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(3000);
}
bootstrap();
electron_1.app.on('ready', () => {
    mainWindow = new electron_1.BrowserWindow({ width: 1200, height: 720 });
    mainWindow.loadURL('http://localhost:3000/');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});
//# sourceMappingURL=main.js.map