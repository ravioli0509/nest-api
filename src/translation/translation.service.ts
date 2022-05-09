import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { Chat, Commands } from 'twitch-js';
import LanguageDetect from 'languagedetect';

dotenv.config();

interface translationType {
	detected_source_language: string;
	text: string;
}

interface deepLType {
	translation: [translationType]
}

interface googleDetectProperties {
	confidence?: number;
	isReliable?: boolean;
	language?: string;
}

interface googleTranslationDetect {
	data?: {
		detections?: [
			[
				googleDetectProperties
			]
		]
	}
}

@Injectable()
export class TranslationService {
	private deepLAuth: string;
	private deepLUrl: string;
	private googleUrl: string;

  constructor() {
    this.deepLAuth = process.env.DEEPLAUTH;
		this.deepLUrl = "https://api-free.deepl.com/v2/translate";
		this.googleUrl = "https://translation.googleapis.com/language/translate/v2"
  }

	async translateMessage(chatSession: Chat): Promise<void> {
		chatSession.on(Commands.PRIVATE_MESSAGE, async (message) => {
			if (message.isSelf) return;
	  	const name: string = message.username;
			const messageText: string = message.message;

			try {
				let response = await axios.post<googleTranslationDetect>(`${this.googleUrl}/detect`,
					{ 
						params:{
							q: messageText,
							key: process.env.GOOGLEAPIKEY
						},
						
					},
					{timeout: 2000}
				)
				console.log(response.data.data.detections[0][0].language)
			} catch(e) {
				console.log(e)
			}

	  	await chatSession.say('#papakimbuislove', name + " said, "+ messageText)
		}) 
	}
}