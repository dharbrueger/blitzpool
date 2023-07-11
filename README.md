![image](https://github.com/dharbrueger/blitzpool/assets/46617788/1f65e75b-f840-4792-b135-c87adca99d38)

## Scripts
```
"build": "next build",
"dev": "next dev",
"lint": "next lint",
"start": "next start",
"vercel-build": "prisma generate && prisma migrate deploy && next build && npx prisma db push",
"prisma:generate": "prisma generate"
```

## Technology
I'm using the T3 stack (https://create.t3.gg/) and bootstrapped this project using the create-t3-app CLI.
I've deployed this app to Vercel and I'm currently using a free tier of Supabase to host my database since I prefer using Postgresql.

## Inspiration
I've always wanted a dead simple way to keep track of my and my friends weekly predictions for sports games (mainly NFL) so I thought it would be a fun experiment to translate the traditional pick 'em process into a web application.

I haven't used Next.js much so I wanted to take this idea from nothing to an actual deployed application that people can actually use.
I thought it would be cool to explore a more opinionated tech stack as well which is why I opted for the T3 stack (https://create.t3.gg/).

