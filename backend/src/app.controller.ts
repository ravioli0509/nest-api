import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Chat } from 'twitch-js';
import { TranslationService } from './translation/translation.service';
import { DetectionService } from './detection/detection.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly translationService: TranslationService,
    private readonly detectionService: DetectionService
  ) {}

  @Get()
  async startTwitchBot(): Promise<void> {
    let chatSession: Chat = await this.appService.startChatSession();
    await this.translationService.translateMessage(chatSession);

    // possibly start a thread run two services concurrently.
    // Detection Service and Translation Service. 
  }
}
