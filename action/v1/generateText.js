const OpenAI = require('openai').default;
const Anthropic = require('@anthropic-ai/sdk').default;

module.exports = {
  name: "generateText",
  title: "Generate Text",
  description: "Generate text using LLM models from OpenAI, Anthropic, Groq, Mistral, DeepSeek and others",
  version: "v1",
  mock_input: {
    model: "claude-sonnet-4-6",
    prompt: "Write a short poem about coding"
  },
  input: {
    title: "Generate Text Input",
    type: 'object',
    properties: {
      model: {
        type: 'string',
        title: 'Model',
        description: 'Model identifier (e.g., gpt-4o, claude-sonnet-4-6, claude-haiku-4-5-20251001, llama-3.3-70b)',
        minLength: 1,
        displayLabel: 'Model'
      },
      prompt: {
        type: 'string',
        title: 'Prompt',
        description: 'The text prompt to send to the model',
        minLength: 1,
        displayLabel: 'Prompt'
      },
      system_prompt: {
        type: 'string',
        title: 'System Prompt (Optional)',
        description: 'System instructions for the model',
        displayLabel: 'System Prompt'
      },
      max_tokens: {
        type: 'number',
        title: 'Max Tokens (Optional)',
        description: 'Maximum number of tokens to generate',
        displayLabel: 'Max Tokens'
      },
      temperature: {
        type: 'number',
        title: 'Temperature (Optional)',
        description: 'Controls randomness (0.0 to 2.0)',
        minimum: 0,
        maximum: 2,
        displayLabel: 'Temperature'
      }
    },
    required: ['model', 'prompt']
  },
  output: {
    type: 'object',
    displayTitle: 'Generate Text Output',
    properties: {
      text: {
        type: 'string',
        displayTitle: 'Generated Text',
        title: 'text'
      },
      usage: {
        type: 'object',
        displayTitle: 'Token Usage',
        title: 'usage'
      },
      finish_reason: {
        type: 'string',
        displayTitle: 'Finish Reason',
        title: 'finish_reason'
      }
    }
  },
  execute: async function (input, output) {
    try {
      const provider = input.auth.provider;
      const apiKey = input.auth.api_key;
      const baseURL = input.auth.base_url;

      if (provider.toLowerCase() === 'anthropic') {
        // Anthropic
        const anthropic = new Anthropic({ apiKey });

        const messages = [{ role: 'user', content: input.prompt }];
        const params = {
          model: input.model,
          messages: messages,
          max_tokens: input.max_tokens || 1024
        };

        if (input.system_prompt) {
          params.system = input.system_prompt;
        }
        if (input.temperature !== undefined && input.temperature !== null && typeof input.temperature === 'number') {
          params.temperature = input.temperature;
        }

        const message = await anthropic.messages.create(params);

        output(null, {
          text: message.content[0].text,
          usage: {
            prompt_tokens: message.usage.input_tokens,
            completion_tokens: message.usage.output_tokens,
            total_tokens: message.usage.input_tokens + message.usage.output_tokens
          },
          finish_reason: message.stop_reason
        });
      } else {
        // OpenAI-compatible
        const baseURLMap = {
          'openai': 'https://api.openai.com/v1',
          'groq': 'https://api.groq.com/openai/v1',
          'deepseek': 'https://api.deepseek.com',
          'mistral': 'https://api.mistral.ai/v1',
          'perplexity': 'https://api.perplexity.ai',
          'together': 'https://api.together.xyz/v1'
        };

        const finalBaseURL = baseURL || baseURLMap[provider.toLowerCase()];
        const openai = new OpenAI({ apiKey, baseURL: finalBaseURL });

        const messages = [{ role: 'user', content: input.prompt }];
        if (input.system_prompt) {
          messages.unshift({ role: 'system', content: input.system_prompt });
        }

        const params = {
          model: input.model,
          messages: messages
        };

        if (input.max_tokens) {
          params.max_tokens = input.max_tokens;
        }
        if (input.temperature !== undefined && input.temperature !== null && typeof input.temperature === 'number') {
          params.temperature = input.temperature;
        }

        const completion = await openai.chat.completions.create(params);

        output(null, {
          text: completion.choices[0].message.content,
          usage: completion.usage,
          finish_reason: completion.choices[0].finish_reason
        });
      }
    } catch (error) {
      output(error.message || 'Failed to generate text');
    }
  }
};
