# Setting Up Claude Pro API Integration

## Step 1: Get Your Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign in with your Claude Pro account
3. Navigate to **API Keys** section
4. Click **Create Key** or use an existing key
5. Copy your API key (it starts with `sk-ant-...`)

⚠️ **Important**: Keep your API key secret! Never commit it to version control.

## Step 2: Create Environment File

1. In your project root, create a file named `.env` (not `.env.example`)
2. Add your API key:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
```

**Note**: The `VITE_` prefix is required for Vite to expose the variable to your React app.

## Step 3: Add .env to .gitignore

Make sure your `.env` file is in `.gitignore` to prevent accidentally committing your API key:

```gitignore
# Environment variables
.env
.env.local
.env.production
```

## Step 4: Restart Your Dev Server

After creating the `.env` file, restart your Vite dev server:

1. Stop the current server (Ctrl+C)
2. Run `npm run dev` again

The environment variable will be loaded when the server starts.

## Step 5: Test the Integration

1. Open your app in the browser
2. Select a carousel frame
3. Click on a text field (headline or body)
4. Click the **AI Rewrite** button (star icon)
5. Wait for Claude to rewrite your text!

## Troubleshooting

### "API key not found" error
- Make sure your `.env` file is in the project root (same folder as `package.json`)
- Verify the variable name is exactly `VITE_ANTHROPIC_API_KEY`
- Restart your dev server after creating/modifying `.env`

### API errors
- Check that your API key is valid and active
- Verify you have API access enabled on your Anthropic account
- Check the browser console for detailed error messages

### Rate limits
- Claude Pro has rate limits based on your subscription tier
- If you hit limits, wait a moment and try again

## API Model Used

The integration uses **Claude 3.5 Sonnet** (`claude-3-5-sonnet-20241022`), which provides:
- High-quality text rewriting
- Professional tone appropriate for LinkedIn
- Context-aware improvements

## Cost Information

- API calls are billed per token used
- Check your Anthropic console for usage and billing details
- Each rewrite typically uses ~100-200 tokens







