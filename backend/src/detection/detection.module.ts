import { Module } from '@nestjs/common';
import { DetectionController } from './detection.controller';
import { DetectionService } from './detection.service';

@Module({
	controllers: [DetectionController],
	providers: [DetectionService]
})

export class DetectionModule {}