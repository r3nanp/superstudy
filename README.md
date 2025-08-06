# SuperStudy 📚

Your AI-powered reading companion

SuperStudy is a personal project designed to help you organize, analyze,
and truly understand your postponed readings. It leverages AI to
summarize content, extract key insights, and centralize your resources,
making your reading experience smarter and more productive.

## Key Features

- Smart Aggregation -- Collect and organize all your reading materials
  in one place.
- AI Summarization -- Get concise summaries and highlights of your
  content.
- Insight Extraction -- Identify key ideas, themes, and takeaways
  effortlessly.
- Unified Dashboard -- Manage and access all your resources from a
  single interface.

## Tech Stack

- Frontend: Next.js + Tailwind CSS
- Backend: Node.js / API routes / Supabase
- AI Integration: OpenAI API
- Database: PostgreSQL (Supabase)

## Getting Started

1.  Clone the Repository

```{=html}

    git clone https://github.com/r3nanp/superstudy.git
    cd superstudy

2.  Install Dependencies

```

```
  pnpm install
```

3.  Set Up Environment Variables Create a `.env.local` file and
    configure:

```
  OPENAI_API_KEY=your-api-key
  DATABASE_URL=your-database-url

```

4.  Run the Project

```
  pnpm run dev
```

Access the app at: http://localhost:3001

## Roadmap

- [ ] Add tagging and categorization for readings.
- [ ] Implement advanced search and filtering.
- [ ] Support PDF and audio file uploads.
- [ ] Improve crawler system.
- [ ] Personal recommendations based on reading history.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull
request.

## License

This project is licensed under the GNU AGPL.
