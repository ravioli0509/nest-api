// DeepL Translation Interfaces

interface DeepLTranslationProperties {
	detected_source_language: string;
	text: string;
}

export interface DeepLTranslationResponse {
	translations?: [DeepLTranslationProperties]
}

export interface DeepLSupportedProperties {
	language?: string;
	name?: string;
	supports_formality?: boolean
}

// Google Translation Interfaces

interface GoogleTranslationProperties {
	translatedText?: string;
	detectedSourceLanguage?: string;
}

interface GoogleDetectProperties {
	confidence?: number;
	isReliable?: boolean;
	language?: string;
}

export interface GoogleTranslationResponse {
	data?: {
		translations?: [GoogleTranslationProperties]
	}
}

export interface GoogleDetectResponse {
	data?: {
		detections?: [
			[GoogleDetectProperties]
		]
	}
}