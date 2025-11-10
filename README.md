# Polyform Print Studio

## Project Overview

Polyform Print Studio is a comprehensive web application for sustainable 3D printing solutions, offering Print on Demand, Prototyping, and Batch Production services.

## Features

- **3D Printing Services**: Professional 3D printing with various materials
- **CAD Modeling**: Custom design and modeling services
- **CNC Machining**: Precision manufacturing solutions
- **Laser Engraving**: High-quality engraving services
- **Sheet Metal Fabrication**: Custom metal fabrication
- **Partner Network**: Vendor and partner management system
- **Order Management**: Complete order tracking and management
- **Admin Dashboard**: Comprehensive analytics and insights
- **Instant Pricing**: Real-time pricing calculator

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI framework
- **Supabase** - Backend and database
- **shadcn-ui** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun package manager

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd polyform-print-studio-main

# Install dependencies
npm install

# Set up environment variables
# Create a .env file in the root directory and add your Supabase credentials
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Database Setup

The application uses Supabase for backend services. Migration files are located in the `supabase/migrations` directory. Refer to `DATABASE_SETUP.md` for detailed setup instructions.

## Project Structure

```
src/
├── components/      # React components
├── pages/          # Page components
├── contexts/       # React contexts
├── hooks/          # Custom hooks
├── integrations/   # External integrations (Supabase)
├── lib/            # Utility functions
└── utils/          # Helper utilities
```

## Deployment

Build the project for production:

```sh
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

All rights reserved.
