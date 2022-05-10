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
		try {
			const response1 = await axios.post(
				`${this.googleUrl}`, {timeout: 2000},
				{
					params: {
						q: messageText,
						target: "EN",
						key: this.googleAPIKey
					},
				});

			const response2 = await axios.post(
				`${this.googleUrl}`, {timeout: 2000},
				{
					params: {
						q: messageText,
						target: "JA",
						key: this.googleAPIKey
					},
				});



			// console.log(response1.data, response2.data, "HI!!!1")

			const firstM = response1.data.data.translations[0].translatedText
			const secondM = response2.data.data.translations[0].translatedText

			return `en: ${firstM}, ja: ${secondM}`
		} catch (e) {
			console.log(e);
		}
		
	}

	async translateUsingDeepL(messageText: string, targetLang: string): Promise<string> {
		const multiple = this.checkMultiple(targetLang);

		if (multiple) {
			try {
				const response1 = await axios.get(
					`${this.deepLUrl}/translate`,
					{
						params: {
							text: messageText,
							target_lang: targetLang.split(",")[0],
							auth_key: this.deepLAuth
						},
					});
				const response2 = await axios.get(
					`${this.deepLUrl}/translate`,
					{
						params: {
							text: messageText,
							target_lang: targetLang.split(",")[1],
							auth_key: this.deepLAuth
						},
					});

				const firstM = response1.data.translations[0].text
				const secondM = response2.data.translations[0].text
	
				return `EN: ${firstM}, JA: ${secondM}`

			} catch(e) {
				console.log(e);
			}

		} else {
			try {
				const response = await axios.get(
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
				const response = await axios.post<GoogleTranslationDetect>(
					`${this.googleUrl}/detect`, {timeout: 2000}, 
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

				if (langDetected == "EN") {
					target = "ja"
				} else if (langDetected == "JA") {
					target = "en"
				} else {
					target = "en,ja"
				}

				translatedMessage = langCount > 0 ? await this.translateUsingDeepL(messageText, target) : await this.translateUsingGoogle(messageText, target);
			
				
			} catch(e) {
				console.log(e);
			}

	  	await chatSession.say('#papakimbuislove', name + " said, "+ translatedMessage);
		}) 
	}
}