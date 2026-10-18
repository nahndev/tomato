import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { BuiltInAgent, CopilotRuntime } from '@copilotkit/runtime/v2';
import type { CopilotExpressRouter } from '@copilotkit/runtime/v2/express';
import { createCopilotExpressHandler } from '@copilotkit/runtime/v2/express';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../../config.schema';
import { COPILOT_AGENT_ID, COPILOT_ENDPOINT, COPILOT_PROMPT } from './copilot.constants';

@Injectable()
export class CopilotService {
  private readonly logger = new Logger(CopilotService.name);
  readonly router: CopilotExpressRouter;

  constructor(config: ConfigService<Env, true>) {
    const modelName = config.get('GEMINI_MODEL', { infer: true });
    const origin = config.get('CORS_ORIGIN', { infer: true }).split(',');
    const google = createGoogleGenerativeAI({ apiKey: config.get('GEMINI_AI_KEY', { infer: true }) });
    const runtime = new CopilotRuntime({
      agents: {
        [COPILOT_AGENT_ID]: new BuiltInAgent({ model: google(modelName), prompt: COPILOT_PROMPT }),
      },
    });

    this.router = createCopilotExpressHandler({ runtime, basePath: COPILOT_ENDPOINT, cors: { origin } });
    this.logger.log(`CopilotKit runtime enabled (model: ${modelName})`);
  }
}
