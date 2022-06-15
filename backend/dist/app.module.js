"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const detection_module_1 = require("./detection/detection.module");
const detection_service_1 = require("./detection/detection.service");
const translation_controller_1 = require("./translation/translation.controller");
const translation_module_1 = require("./translation/translation.module");
const translation_service_1 = require("./translation/translation.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            translation_module_1.TranslationModule,
            detection_module_1.DetectionModule,
            core_1.RouterModule.register([
                { path: 'test' }
            ]),
        ],
        controllers: [app_controller_1.AppController, translation_controller_1.TranslationController],
        providers: [app_service_1.AppService, translation_service_1.TranslationService, detection_service_1.DetectionService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map