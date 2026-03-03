module.exports = {
  label: 'Connect to LLM Provider',
  mock_input: {
    "provider": "openai",
    "api_key": "sk-test-key"
  },
  input: {
    type: 'object',
    properties: {
      provider: {
        type: 'string',
        enum: ['openai', 'anthropic', 'groq', 'deepseek', 'mistral', 'perplexity', 'together'],
        title: 'LLM Provider',
        description: 'Select the LLM provider (OpenAI, Anthropic, or OpenAI-compatible)',
        minLength: 1,
        displayLabel: 'Provider'
      },
      api_key: {
        type: 'string',
        title: 'API Key',
        description: 'Your API key for the selected provider',
        minLength: 1,
        displayLabel: 'API Key'
      },
      base_url: {
        type: 'string',
        title: 'Base URL (Optional)',
        description: 'Custom base URL for the API (optional, for custom endpoints)',
        displayLabel: 'Base URL'
      }
    },
    required: ['provider', 'api_key']
  },
  validate: async function (input, output) {
    const OpenAI = require('openai').default;
    const Anthropic = require('@anthropic-ai/sdk').default;

    const provider = input.auth.provider;
    const apiKey = input.auth.api_key;
    const baseURL = input.auth.base_url;

    if (!provider || !apiKey) {
      return output('Provider and API Key are required');
    }

    if (apiKey.length < 10) {
      return output('Invalid API Key format');
    }

    try {
      if (provider.toLowerCase() === 'anthropic') {
        // Anthropic uses its own SDK
        const anthropic = new Anthropic({ apiKey });

        const message = await anthropic.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 5,
          messages: [{ role: 'user', content: 'Hello' }]
        });

        output(null, {
          provider: provider,
          authenticated: true,
          message: 'Successfully authenticated with Anthropic'
        });
      } else {
        // OpenAI-compatible providers
        const baseURLMap = {
          'openai': 'https://api.openai.com/v1',
          'groq': 'https://api.groq.com/openai/v1',
          'deepseek': 'https://api.deepseek.com',
          'mistral': 'https://api.mistral.ai/v1',
          'perplexity': 'https://api.perplexity.ai',
          'together': 'https://api.together.xyz/v1'
        };

        const finalBaseURL = baseURL || baseURLMap[provider.toLowerCase()];

        const openai = new OpenAI({
          apiKey: apiKey,
          baseURL: finalBaseURL
        });

        // Test with a minimal completion
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini', // Default, will be overridden by user
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 5
        });

        output(null, {
          provider: provider,
          authenticated: true,
          message: 'Successfully authenticated with ' + provider
        });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      const errorMsg = error.message || 'Invalid API key';
      output('Authentication failed: ' + errorMsg);
    }
  }
}