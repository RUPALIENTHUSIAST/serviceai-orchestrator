# ServiceAI Orchestrator

## Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Set environment variable in Vercel dashboard:
- Go to your project settings
- Add environment variable: `GEMINI_API_KEY` with your API key value

5. Redeploy:
```bash
vercel --prod
```
