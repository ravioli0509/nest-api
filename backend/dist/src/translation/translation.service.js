"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationService = void 0;
const common_1 = require("@nestjs/common");
const dotenv = __importStar(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const twitch_js_1 = require("twitch-js");
const constants_1 = require("../constants");
dotenv.config();
let TranslationService = class TranslationService {
    deepLAuth;
    deepLUrl;
    googleUrl;
    googleAPIKey;
    constructor() {
        this.deepLAuth = process.env.DEEPLAUTH;
        this.googleAPIKey = process.env.GOOGLEAPIKEY;
        this.deepLUrl = "https://api-free.deepl.com/v2";
        this.googleUrl = "https://translation.googleapis.com/language/translate/v2";
    }
    async getDeepLAvailableLang() {
        try {
            const response = await axios_1.default.get(`${this.deepLUrl}/languages`, {
                params: {
                    auth_key: this.deepLAuth,
                    type: constants_1.Constants.TARGETTYPE
                }
            });
            return response.data.map(item => item.language);
        }
        catch (e) {
            console.log(e);
        }
    }
    async translateUsingGoogle(messageText) {
        try {
            const resEng = axios_1.default.post(`${this.googleUrl}`, null, {
                params: {
                    q: messageText,
                    target: constants_1.Constants.ENGLISH,
                    key: this.googleAPIKey
                },
            });
            const resJap = axios_1.default.post(`${this.googleUrl}`, null, {
                params: {
                    q: messageText,
                    target: constants_1.Constants.JAPANESE,
                    key: this.googleAPIKey
                },
            });
            const AllRep = await Promise.all([resEng, resJap]);
            const firstM = AllRep[0].data.data.translations[0].translatedText;
            const secondM = AllRep[1].data.data.translations[0].translatedText;
            return `${constants_1.Constants.ENGLISH}: ${firstM}, ${constants_1.Constants.JAPANESE}: ${secondM}`;
        }
        catch (e) {
            console.log(e);
        }
    }
    async translateUsingDeepL(messageText, targetLang) {
        if (targetLang.includes(",")) {
            try {
                const resEng = axios_1.default.get(`${this.deepLUrl}/translate`, {
                    params: {
                        text: messageText,
                        target_lang: constants_1.Constants.ENGLISH,
                        auth_key: this.deepLAuth
                    },
                });
                const resJap = axios_1.default.get(`${this.deepLUrl}/translate`, {
                    params: {
                        text: messageText,
                        target_lang: constants_1.Constants.JAPANESE,
                        auth_key: this.deepLAuth
                    },
                });
                const AllRep = await Promise.all([resEng, resJap]);
                const firstM = AllRep[0].data.translations[0].text;
                const secondM = AllRep[1].data.translations[0].text;
                return `${constants_1.Constants.ENGLISH}: ${firstM}, ${constants_1.Constants.JAPANESE}: ${secondM}`;
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            try {
                const response = await axios_1.default.get(`${this.deepLUrl}/translate`, {
                    params: {
                        text: messageText,
                        target_lang: targetLang,
                        auth_key: this.deepLAuth
                    },
                });
                const message = response.data.translations[0].text;
                return `${targetLang}: ${message}`;
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    async translateMessage(chatSession) {
        let langList = await this.getDeepLAvailableLang();
        let translatedMessage;
        chatSession.on(twitch_js_1.Commands.PRIVATE_MESSAGE, async (message) => {
            if (message.isSelf)
                return;
            let langCount = 0;
            let target;
            const name = message.username;
            const messageText = message.message;
            try {
                const response = await axios_1.default.post(`${this.googleUrl}/detect`, { timeout: constants_1.Constants.TIMEOUT }, {
                    params: {
                        q: messageText,
                        key: this.googleAPIKey
                    },
                });
                const langDetected = response.data.data.detections[0][0].language.toUpperCase();
                langList.forEach(lang => {
                    if (lang.includes(langDetected)) {
                        langCount++;
                    }
                });
                if (langDetected == constants_1.Constants.ENGLISH) {
                    target = constants_1.Constants.JAPANESE;
                }
                else if (langDetected == constants_1.Constants.JAPANESE) {
                    target = constants_1.Constants.ENGLISH;
                }
                else {
                    target = constants_1.Constants.ENGJAP;
                }
                setTimeout(translatedMessage = langCount > 0 ? await this.translateUsingDeepL(messageText, target) : await this.translateUsingGoogle(messageText), constants_1.Constants.TIMEOUT);
            }
            catch (e) {
                console.log(e);
            }
            if (translatedMessage == undefined) {
                await chatSession.say('#rravioliii', "Sorry translation bot is currenty down..., 翻訳機が落ちてます。すみません。");
            }
            else {
                await chatSession.say('#rravioliii', name + " said, " + translatedMessage);
            }
        });
    }
};
TranslationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TranslationService);
exports.TranslationService = TranslationService;
//# sourceMappingURL=translation.service.js.map