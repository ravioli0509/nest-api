import { Chat } from 'twitch-js';
export declare class TranslationService {
    private deepLAuth;
    private deepLUrl;
    private googleUrl;
    private googleAPIKey;
    constructor();
    getDeepLAvailableLang(): Promise<string[]>;
    translateUsingGoogle(messageText: string): Promise<string>;
    translateUsingDeepL(messageText: string, targetLang: string): Promise<string>;
    translateMessage(chatSession: Chat): Promise<void>;
}
