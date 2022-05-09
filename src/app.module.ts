import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranslationController } from './translation/translation.controller';
import { TranslationModule } from './translation/translation.module';
import { TranslationService } from './translation/translation.service';

@Module({
  imports: [
    TranslationModule,
    RouterModule.register([
      {
        path: 'test',
        
      }
    ]),
  ],
  controllers: [AppController, TranslationController],
  providers: [AppService, TranslationService],
})
export class AppModule {}
