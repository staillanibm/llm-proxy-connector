# LLM Proxy Connector for webMethods.io Integration

A webMethods.io Integration connector that provides access to multiple LLM providers through a unified interface. This connector supports both OpenAI-compatible APIs and Anthropic's Claude models.

## Supported Providers

- **OpenAI** - GPT-4, GPT-3.5, and other OpenAI models
- **Anthropic** - Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus
- **Groq** - Fast inference for various models
- **DeepSeek** - DeepSeek models
- **Mistral** - Mistral and Mixtral models
- **Perplexity** - Perplexity AI models
- **Together** - Together AI models

## Features

- **Unified API**: Single connector for multiple LLM providers
- **OpenAI Compatibility**: Most providers use OpenAI-compatible endpoints
- **Custom Authentication**: Secure API key management per provider
- **Flexible Configuration**: Optional system prompts, temperature control, and token limits
- **Token Usage Tracking**: Returns detailed usage statistics for all requests

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Test the connector locally:
   ```bash
   wmio test
   ```
4. Deploy to webMethods Integration SaaS:
   ```bash
   wmio deploy
   ```
5. Check the deployment status:
   ```bash
   wmio status
   ```

## Configuration

### Authentication

When setting up a connection in webMethods.io:

1. **Provider**: Select your LLM provider from the dropdown (openai, anthropic, groq, deepseek, mistral, perplexity, together)
2. **API Key**: Enter your provider's API key
3. **Base URL** (Optional): Override the default endpoint URL if needed

### Default Base URLs

The connector uses these default endpoints:
- OpenAI: `https://api.openai.com/v1`
- Groq: `https://api.groq.com/openai/v1`
- DeepSeek: `https://api.deepseek.com`
- Mistral: `https://api.mistral.ai/v1`
- Perplexity: `https://api.perplexity.ai`
- Together: `https://api.together.xyz/v1`
- Anthropic: Uses native Anthropic SDK

## Actions

### Generate Text

Generate text completions using any supported LLM model.

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| model | string | Yes | Model identifier (e.g., `gpt-4o`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`, `llama-3.3-70b`) |
| prompt | string | Yes | The text prompt to send to the model |
| system_prompt | string | No | System instructions for the model |
| max_tokens | number | No | Maximum tokens to generate (default: 1024 for Anthropic) |
| temperature | number | No | Controls randomness (0.0 to 2.0) |

**Output:**

| Field | Type | Description |
|-------|------|-------------|
| text | string | The generated text response |
| usage | object | Token usage statistics (prompt_tokens, completion_tokens, total_tokens) |
| finish_reason | string | Why the model stopped generating (e.g., "stop", "length") |

## Testing Locally

Create an `auth.conf` file in the root directory:

```json
{
  "provider": "anthropic",
  "api_key": "your-api-key-here"
}
```

Then test the connector:

```bash
wmio test
```

**Note:** Never commit `auth.conf` to version control (it's in `.gitignore`)

## Package Size

This connector uses lightweight official SDKs:
- `openai`: ~200KB
- `@anthropic-ai/sdk`: ~300KB

Total package size is well under the 10 MB webMethods connector limit.

## Error Handling

The connector includes comprehensive error handling:
- Invalid API keys are caught during authentication validation
- API errors are returned with descriptive messages
- Optional parameters are validated before being passed to providers

## Development

### Project Structure

```
vercelai/
├── action/
│   └── v1/
│       └── generateText.js    # Main text generation action
├── authentication.js           # Custom auth with validation
├── index.json                 # Connector metadata
├── package.json               # Dependencies
├── icon.png                   # Connector icon
├── .gitignore                # Git exclusions
└── README.md                 # This file
```

### Requirements

- Node.js 22.15.1
- `@webmethodsio/wmiocli` for deployment

### Dependencies

- `@webmethodsio/cli-sdk`: WebMethods connector SDK
- `openai@^4.70.0`: OpenAI SDK (also used for compatible providers)
- `@anthropic-ai/sdk@^0.32.0`: Anthropic Claude SDK

## Support

For issues or questions:
1. Check your API key is valid for the selected provider
2. Verify the model name is correct for your provider
3. Ensure your API key has sufficient credits/quota
4. Review error messages returned by the connector

## API Key Sources

- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/
- Groq: https://console.groq.com/
- DeepSeek: https://platform.deepseek.com/
- Mistral: https://console.mistral.ai/
- Perplexity: https://www.perplexity.ai/settings/api
- Together: https://api.together.xyz/settings/api-keys
