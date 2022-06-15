import { Chat } from 'twitch-js';
export declare class AppService {
    private clientId;
    private token;
    private secret;
    private refreshToken;
    private twitchUrl;
    constructor();
    startChatSession(): Promise<Chat>;
}
