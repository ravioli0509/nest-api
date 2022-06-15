import { AppService } from './app.service';
import { TranslationService } from './translation/translation.service';
import { DetectionService } from './detection/detection.service';
export declare class AppController {
    private readonly appService;
    private readonly translationService;
    private readonly detectionService;
    constructor(appService: AppService, translationService: TranslationService, detectionService: DetectionService);
    startTwitchBot(): Promise<void>;
}
