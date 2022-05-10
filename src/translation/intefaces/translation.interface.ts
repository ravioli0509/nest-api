interface TranslationType {
	detected_source_language: string;
	text: string;
}

export interface DeepLType {
	translation: [TranslationType]
}

export interface DeepLSupportedLang {
	language?: string;
	name?: string;
	supports_formality?: boolean
}


interface GoogleDetectProperties {
	confidence?: number;
	isReliable?: boolean;
	language?: string;
}

export interface GoogleTranslationDetect {
	data?: {
		detections?: [
			[
				GoogleDetectProperties
			]
		]
	}
}