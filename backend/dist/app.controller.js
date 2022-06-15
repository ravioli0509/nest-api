"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const translation_service_1 = require("./translation/translation.service");
const detection_service_1 = require("./detection/detection.service");
let AppController = class AppController {
    appService;
    translationService;
    detectionService;
    constructor(appService, translationService, detectionService) {
        this.appService = appService;
        this.translationService = translationService;
        this.detectionService = detectionService;
    }
    async startTwitchBot() {
        let chatSession = await this.appService.startChatSession();
        await this.translationService.translateMessage(chatSession);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "startTwitchBot", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        translation_service_1.TranslationService,
        detection_service_1.DetectionService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map