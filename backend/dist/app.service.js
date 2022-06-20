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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const dotenv = __importStar(require("dotenv"));
const twitch_js_1 = __importDefault(require("twitch-js"));
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
dotenv.config();
let AppService = class AppService {
    clientId;
    token;
    secret;
    refreshToken;
    twitchUrl;
    constructor() {
        this.clientId = process.env.CLIENT;
        this.token = process.env.TOKEN;
        this.secret = process.env.SECRET;
        this.refreshToken = process.env.REFRESH;
        this.twitchUrl = 'https://id.twitch.tv/oauth2/token';
    }
    async startChatSession() {
        const onAuthenticationFailure = async () => {
            let response = await axios_1.default.post(this.twitchUrl, {
                grant_type: constants_1.Constants.REFRESHTYPE,
                refresh_token: this.refreshToken,
                client_id: this.clientId,
                client_secret: this.secret,
            });
            return response.data.access_token;
        };
        const { chat } = new twitch_js_1.default({ token: this.token, username: 'testravioliBot', onAuthenticationFailure });
        await chat.connect();
        await chat.join('#rravioliii');
        return chat;
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map