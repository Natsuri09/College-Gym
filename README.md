# College Gym Management System

A modern web application for managing a college gym, built with Next.js, TypeScript, and MongoDB.

## Features

- User authentication (Gym Members and Managers)
- Equipment management
- Calorie tracking
- Responsive design
- Modern UI with Bootstrap

## Tech Stack

- Next.js 14
- TypeScript
- MongoDB with Prisma ORM
- Bootstrap
- JWT Authentication

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/college_gym.git
cd college_gym
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret"
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - Reusable React components
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
