import { Injectable } from '@nestjs/common';
import { providerModels } from './config/provider-models.config';

export interface RouteConfig {
  provider: string;
  model: string;
}

@Injectable()
export class RouterService {
  // Unified universal routing: attempt openrouter, then groq, then mistral, then glm for other tasks
  private readonly universalSequence = ['openrouter', 'groq', 'mistral', 'glm'];

  getRoute(taskType: string): RouteConfig[] {
    const routes: RouteConfig[] = [];

    // Task-specific routing for Career Prediction and Counselor
    if (taskType === 'career_recommendation' || taskType === 'counselor_chat' || taskType === 'roadmap_generation') {
      // Specifically use Gemini 3.1 Pro as requested
      routes.push({ provider: 'gemini', model: 'gemini-3.1-pro' });
      // Add gemini fallbacks
      const geminiCfg = providerModels['gemini'];
      if (geminiCfg) {
        routes.push({ provider: 'gemini', model: geminiCfg.model });
        if (geminiCfg.fallback_models) {
          geminiCfg.fallback_models.forEach(m => routes.push({ provider: 'gemini', model: m }));
        }
      }
    }

    // Default universal fallback sequence
    const providers = this.universalSequence;

    for (const p of providers) {
      const cfg = providerModels[p];
      if (!cfg) continue;

      // 1. Add primary model
      routes.push({ provider: p, model: cfg.model });

      // 2. Add fallback models if they exist
      if (cfg.fallback_models && cfg.fallback_models.length > 0) {
        for (const fbModel of cfg.fallback_models) {
          routes.push({ provider: p, model: fbModel });
        }
      } else if (cfg.fallback_model) {
        routes.push({ provider: p, model: cfg.fallback_model });
      }
    }

    return routes;
  }
}
