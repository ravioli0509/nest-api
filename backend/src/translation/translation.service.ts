import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import axios, { AxiosError } from 'axios';
import { Chat, Commands } from 'twitch-js';
import { Constants } from '../constants'
import { DeepLSupportedProperties, DeepLTranslationResponse, GoogleDetectResponse, GoogleTranslationResponse } from './intefaces/translation.interface';

dotenv.config();

@Injectable()
export class TranslationService {
	private deepLAuth: string;
	private deepLUrl: string;
	private googleUrl: string;
	private googleAPIKey: string;

  constructor() {
    this.deepLAuth = process.env.DEEPLAUTH;
		this.googleAPIKey = process.env.GOOGLEAPIKEY;
		this.deepLUrl = "https://api-free.deepl.com/v2";
		this.googleUrl = "https://translation.googleapis.com/language/translate/v2"
  }


	async getDeepLAvailableLang(): Promise<string[]> {
		try {
			const response = await axios.get<DeepLSupportedProperties[]>(
				`${this.deepLUrl}/languages`, 
				{
					params: {
						auth_key: this.deepLAuth,
						type: Constants.TARGETTYPE
					}
				})
			return response.data.map(item => item.language)
		} catch (e) {
			console.log(e);
		}
	}

	async translateUsingGoogle(messageText: string): Promise<string> {
		try {
			const resEng = axios.post<GoogleTranslationResponse>(
				`${this.googleUrl}`, null,
				{
					params: {
						q: messageText,
						target: Constants.ENGLISH,
						key: this.googleAPIKey
					},
				});

			const resJap = axios.post<GoogleTranslationResponse>(
				`${this.googleUrl}`, null,
				{
					params: {
						q: messageText,
						target: Constants.JAPANESE,
						key: this.googleAPIKey
					},
				});

			const AllRep = await Promise.all([resEng, resJap]);
			
			const firstM = AllRep[0].data.data.translations[0].translatedText;
			const secondM = AllRep[1].data.data.translations[0].translatedText;

			return `${Constants.ENGLISH}: ${firstM}, ${Constants.JAPANESE}: ${secondM}`;
		} catch (e) {
			console.log(e);
		}
	}

	async translateUsingDeepL(messageText: string, targetLang: string): Promise<string> {
		if (targetLang.includes(",")) {
			try {
				const resEng = axios.get<DeepLTranslationResponse>(
					`${this.deepLUrl}/translate`,
					{
						params: {
							text: messageText,
							target_lang: Constants.ENGLISH,
							auth_key: this.deepLAuth
						},
					});

				const resJap = axios.get<DeepLTranslationResponse>(
					`${this.deepLUrl}/translate`,
					{
						params: {
							text: messageText,
							target_lang: Constants.JAPANESE,
							auth_key: this.deepLAuth
						},
					});

				const AllRep = await Promise.all([resEng, resJap]);

				const firstM = AllRep[0].data.translations[0].text;
				const secondM = AllRep[1].data.translations[0].text;
	
				return `${Constants.ENGLISH}: ${firstM}, ${Constants.JAPANESE}: ${secondM}`;

			} catch(e) {
				console.log(e);
			}

		} else {
			try {
				const response = await axios.get<DeepLTranslationResponse>(
					`${this.deepLUrl}/translate`,
					{
						params: {
							text: messageText,
							target_lang: targetLang,
							auth_key: this.deepLAuth
						},
					});
					
				const message = response.data.translations[0].text;
				
				return `${targetLang}: ${message}`;
			} catch (e) {
				console.log(e);
			}
		}
	}

	async translateMessage(chatSession: Chat): Promise<void> {
		let langList: string[] = await this.getDeepLAvailableLang();
		let translatedMessage: string;

		chatSession.on(Commands.PRIVATE_MESSAGE, async (message) => {
			if (message.isSelf) return;

			let langCount: number = 0;
			let target: string;
	  	const name: string = message.username;
			const messageText: string = message.message;

			try {
				const response = await axios.post<GoogleDetectResponse>(
					`${this.googleUrl}/detect`, {timeout: Constants.TIMEOUT}, 
					{ 
						params:{
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

				if (langDetected == Constants.ENGLISH) {
					target = Constants.JAPANESE;
				} else if (langDetected == Constants.JAPANESE) {
					target = Constants.ENGLISH;
				} else {
					target = Constants.ENGJAP;
				}

				setTimeout(translatedMessage = langCount > 0 ? await this.translateUsingDeepL(messageText, target) : await this.translateUsingGoogle(messageText), Constants.TIMEOUT);		
			
			} catch(e) {
				console.log(e);
			}

			if (translatedMessage == undefined) {
				await chatSession.say('#papakimbuislove', "Sorry translation bot is currenty down...");
			} else {
				await chatSession.say('#papakimbuislove', name + " said, "+ translatedMessage);
			}
		}) 
	}
}