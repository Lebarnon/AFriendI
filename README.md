# AFriendI
AFriendI presents a potential solution to address the pervasive issue of loneliness in modern society. By leveraging advanced artificial intelligence technologies, such as retrieval-augmented generation pipelines and context-aware conversations, AFriendI utilises a novel approach to facilitating meaningful human connections in a digital age. Coupled with the integration of familiar social media interfaces and nuanced chatbot interactions, users are provided with an immersive and engaging platform to combat loneliness and foster genuine connections.


# Getting Started
First, install the required packages:
```bash
bun i
# or
npm run i
```

Next, create accounts for the services utilised in this project.
- Clerk
- Vercel
- Vercel's Postgres 
- OpenAI API 
- Upstash 
- Pinecone

Add the required keys to a .env file at the root of the project:

```bash
# .env
PINECONE_INDEX=""
POSTGRES_DATABASE=""
POSTGRES_HOST=""
POSTGRES_PASSWORD=""
POSTGRES_PRISMA_URL=""
POSTGRES_URL=""
POSTGRES_URL_NON_POOLING=""
POSTGRES_URL_NO_SSL=""
POSTGRES_USER=""
REPLICATE_API_TOKEN=""
UPSTASH_REDIS_REST_TOKEN=""
UPSTASH_REDIS_REST_URL=""
VERCEL=""
VERCEL_ENV=""
```

Finally run the development server:

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
