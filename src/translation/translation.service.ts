import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { Chat, Commands } from 'twitch-js';
import { GoogleTranslationDetect, DeepLSupportedLang } from './intefaces/translation.interface';
import { first } from 'rxjs';

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

	logError(e: any) {
		console.log(e.data?.response)
	}

	async getDeepLAvailableLang(): Promise<string[]> {
		try {
			const response = await axios.get<DeepLSupportedLang[]>(
				`${this.deepLUrl}/languages`, 
				{
					params: {
						auth_key: this.deepLAuth,
						type: "target"
					}
				})
			return response.data.map(item => item.language)
		} catch (e) {
			this.logError(e);
		}
	}

	checkMultiple(lang: string): Boolean {
		return lang.includes(",") ? true : false;
	}

	async translateUsingGoogle(messageText: string, targetLang: string): Promise<string> {
		const multiple = this.checkMultiple(messageText);

		if (multiple) {
			const response1 = axios.post(
				`${this.googleUrl}`, {timeout: 2000},
				{
					params: {
						q: messageText,
						target: targetLang.split(",")[0],
						key: this.googleAPIKey
					},
				});
			const response2 = axios.post(
				`${this.googleUrl}`, {timeout: 2000},
				{
					params: {
						q: messageText,
						target: targetLang.split(",")[1],
						key: this.googleAPIKey
					},
				});


			const allRep = await Promise.all([response1, response2])

			const firstM = allRep[0].data.data.translations[0].translatedText
			const secondM = allRep[1].data.data.translations[0].translatedText

			return `EN: ${firstM}, JA: ${secondM}`

		} else {
			try {
				const response = await axios.post(
					`${this.googleUrl}`, {timeout: 2000},
					{
						params: {
							q: messageText,
							target: targetLang,
							key: this.googleAPIKey
						},
					});
					
				const message = response.data.data.translations[0].translatedText;
				
				return `${targetLang.toUpperCase}: ${message}`;
			} catch (e) {
				this.logError(e);
			}
		}
	}

	async translateUsingDeepL(messageText: string, targetLang: string): Promise<string> {
		const multiple = this.checkMultiple(messageText);


		return "";
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
				const response = await axios.post<GoogleTranslationDetect>(
					`${this.googleUrl}/detect`, {timeout: 2000}, 
					{ 
						params:　{
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

				if (langDetected == "EN") {
					target = "ja"
				} else if (langDetected == "JA") {
					target = "en"
				} else {
					target = "en,ja"
				}

				console.log(target, langCount)

				translatedMessage = langCount > 0 ? await this.translateUsingDeepL(messageText, target) : await this.translateUsingGoogle(messageText, target);
			
				
			} catch(e) {
				this.logError(e);
			}

	  	await chatSession.say('#papakimbuislove', name + " said, "+ translatedMessage);
		}) 
	}
}