# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a webMethods.io Integration connector that provides access to Large Language Models (LLMs) through native provider SDKs. The connector abstracts away provider-specific implementations and allows workflows to interact with multiple LLM providers (OpenAI, Anthropic, Groq, Mistral, Perplexity, DeepSeek, Together) through a unified interface.

## Architecture

### Connector Structure

The connector follows the webMethods.io connector pattern:

- **`index.json`**: Main connector configuration file defining metadata, authentication type, actions, and triggers
- **`authentication.js`**: Custom authentication handler that collects provider selection and API keys
- **`action/`**: Directory containing action implementations
  - `generateText.js`: Synchronous text generation using Vercel AI SDK's `generateText()`
  - `streamText.js`: Streaming text generation using Vercel AI SDK's `streamText()`
- **`package.json`**: Node.js dependencies including `openai` and `@anthropic-ai/sdk`

### Key Design Patterns

1. **Provider Abstraction**: Uses direct provider SDKs with model identifiers (e.g., `gpt-4o`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`)
2. **Direct SDK Authentication**: API keys are passed directly to the provider SDKs (OpenAI SDK and Anthropic SDK)
3. **Unified Interface**: Both actions share the same input structure using native provider SDKs

## Testing and Deployment

### Prerequisites

Before testing or deploying, ensure you have:

1. Node.js 22.15.1 installed (use `nvm use 22.15.1`)
2. `@webmethodsio/wmiocli` installed globally (`npm install -g @webmethodsio/wmiocli`)
3. Access to a webMethods.io Integration tenant
4. An API key for at least one LLM provider (OpenAI, Anthropic, Google, etc.)

### Step-by-Step Testing

1. **Navigate to the connector directory**:
   ```bash
   cd llm-proxy-connector
   ```

2. **Ensure you're using the correct Node.js version**:
   ```bash
   nvm use 22.15.1
   ```

3. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

4. **Login to webMethods.io Integration**:
   ```bash
   wmio login
   ```
   - You'll be prompted to enter your deployment key
   - Get your deployment key from: webMethods.io Integration → Settings → Deploy Key

5. **Test the connector locally**:
   ```bash
   wmio test
   ```
   - This validates your connector structure
   - Checks for syntax errors
   - Verifies action/trigger definitions
   - Fix any errors reported before proceeding to deployment

### Step-by-Step Deployment

1. **Ensure the connector passes local tests**:
   ```bash
   wmio test
   ```
   - All tests must pass before deployment

2. **Deploy the connector to webMethods.io Integration**:
   ```bash
   wmio deploy
   ```
   - The CLI will build and upload your connector
   - Wait for the deployment to complete
   - The connector will undergo platform validation

3. **Verify deployment**:
   ```bash
   wmio connectors
   ```
   - This lists all your connectors
   - Look for "vercelai" in the list
   - Check the status (should be "active" or "validated")

4. **Check connector versions**:
   ```bash
   wmio versions
   ```
   - Lists all versions of the current connector
   - Shows deployment status for each version

### Using the Connector in webMethods.io

1. **Login to webMethods.io Integration** web interface

2. **Navigate to Connectors** section

3. **Find your "LLM Proxy" connector** in the list

4. **Create a new account/connection**:
   - Select the LLM provider (e.g., "openai", "anthropic")
   - Enter your API key for that provider
   - Optionally provide a custom base URL
   - Test the connection

5. **Use in a workflow**:
   - Create or edit a workflow
   - Add the "LLM Proxy" connector
   - Choose an action:
     - **Generate Text**: For synchronous text generation
     - **Stream Text**: For streaming text generation
   - Configure the action:
     - **Model**: Model identifier (e.g., `gpt-4o`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`)
     - **Prompt**: Your text prompt
     - **System Prompt** (optional): System instructions
     - **Max Tokens** (optional): Token limit
     - **Temperature** (optional): 0.0 to 2.0
   - Run the workflow

### Common Commands Reference

```bash
# Create a new action
wmio create action <action_name>

# Create a new trigger
wmio create trigger <trigger_name>

# Create a new lookup
wmio create lookup <lookup_name>

# Download connector as zip
wmio download

# Logout from webMethods.io
wmio logout
```

### Working with Provider SDKs

The connector uses native provider SDKs:

- **OpenAI SDK**: For OpenAI and OpenAI-compatible providers (Groq, DeepSeek, Mistral, Perplexity, Together)
- **Anthropic SDK**: For Claude models
- **Model Format**: Direct model identifiers (e.g., `gpt-4o`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`, `llama-3.3-70b`)
- **API Key Management**: Passed directly to SDK clients during initialization

## Action Development

### Action Structure

Each action must export an object with:

- **`name`**: Action identifier
- **`label`**: Display name in webMethods UI
- **`mock_input`**: Sample input for testing
- **`input`**: JSON Schema defining input parameters
- **`output`**: JSON Schema defining output fields
- **`execute`**: Async function that performs the action

### Environment Variable Mapping

Provider API keys map to these environment variables:

| Provider   | Environment Variable             |
|------------|----------------------------------|
| openai     | OPENAI_API_KEY                  |
| anthropic  | ANTHROPIC_API_KEY               |
| google     | GOOGLE_GENERATIVE_AI_API_KEY    |
| mistral    | MISTRAL_API_KEY                 |
| cohere     | COHERE_API_KEY                  |
| groq       | GROQ_API_KEY                    |
| perplexity | PERPLEXITY_API_KEY              |
| deepseek   | DEEPSEEK_API_KEY                |
| xai        | XAI_API_KEY                     |

### Adding New Actions

When adding new LLM capabilities:

1. Create action file in `action/` directory
2. Import required SDKs (`openai` and/or `@anthropic-ai/sdk`)
3. Initialize the appropriate SDK client with the API key from `input.auth`
4. Call the SDK methods with the model identifier from `input.model`
5. Return structured output via `output(null, result)`

## Dependencies

- **`openai`**: OpenAI SDK (v4.70.0+) - for OpenAI and OpenAI-compatible providers
- **`@anthropic-ai/sdk`**: Anthropic SDK (v0.32.0+) - for Claude models
- **`@webmethodsio/cli-sdk`**: webMethods.io connector SDK

## Resources

- OpenAI SDK Documentation: https://github.com/openai/openai-node
- Anthropic SDK Documentation: https://docs.anthropic.com/en/api/client-sdks
- webMethods.io Connector Builder: https://docs.webmethods.io/saas/webmethods-integration/connectors/connector_builder/
- Node.js Version: 22.15.1 required
