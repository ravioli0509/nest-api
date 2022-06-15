import { Get, Controller } from "@nestjs/common";
import { DetectionService } from "./detection.service";

@Controller()
export class DetectionController {
    constructor(private readonly detectionService: DetectionService) {}

		// possibly detect bots that come in chat. 
		// Detect using possible url link in the chat. 
		// Once detected, check if the user is in the follower or subscriber list of the streamer
		// If not in the list, ban the bot.
		
}