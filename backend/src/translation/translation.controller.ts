import { Controller } from '@nestjs/common';
import { TranslationService } from './translation.service';

@Controller()
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}
}