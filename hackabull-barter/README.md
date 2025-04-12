# BarterSwap - A Modern Barter Marketplace

BarterSwap is a modern take on bartering, allowing users to trade items with no money involved. The app uses a swipe-based interface (similar to dating apps) for matching items of similar value.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database/Storage**: Supabase
- **Authentication**: Clerk
- **AI**: Gemini API for item value estimation
- **UI**: Tailwind CSS, React Spring, React Swipeable

## Features

- **Authentication**: Secure login and registration with Clerk
- **Item Management**: Upload items with descriptions, photos, and desired trades
- **AI Valuation**: Automatic estimation of item value using Gemini AI
- **Swipe Interface**: Tinder-like swipe mechanism for trading
- **Matching System**: Automatic pairing of items with similar values (±10%)
- **Real-time Updates**: Track trade statuses and manage matches

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Clerk account
- Gemini API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/hackabull-barter.git
   cd hackabull-barter
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env.local` file based on `.env.local.example` and fill in your API keys and credentials.

4. Set up the database:

   - Create a new Supabase project
   - Run the SQL schema in `/supabase/schema.sql` in your Supabase SQL editor

5. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## Project Structure

```
/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── (dashboard) # Authenticated routes
│   │   ├── sign-in     # Auth pages
│   │   ├── sign-up     # Auth pages
│   │   └── ...
│   ├── components/     # Reusable components
│   ├── lib/            # Utility functions and libraries
│   │   ├── supabase.ts # Supabase client and type definitions
│   │   └── gemini.ts   # Gemini AI integration
│   └── ...
├── supabase/
│   └── schema.sql      # Database schema
└── ...
```

## App Routes

- **/** - Landing page with login/signup prompt
- **/dashboard** - User's personal dashboard showing uploaded items and matches
- **/upload-item** - Form page for uploading item details and images
- **/trade** - Swipe interface for trading items
- **/matches** - Page displaying successful matches and ongoing trades

## Screenshots

[Coming soon]

## Development

### Database Schema

The app uses two main tables:

1. **Items Table**:

   - id (UUID)
   - user_id (foreign key to Clerk's user ID)
   - title (text)
   - description (text)
   - image_url (text)
   - estimated_value (decimal)
   - desired_items (text array)
   - created_at (timestamp)

2. **Matches Table**:
   - id (UUID)
   - item_a_id (foreign key to Items)
   - item_b_id (foreign key to Items)
   - matched_at (timestamp)
   - status ("pending", "accepted", "declined")

### Adding New Features

1. Create new routes in the `/src/app` directory
2. Add components to `/src/components`
3. Update database schema as needed

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built for Hackabull 2025
- Inspired by modern trading and dating applications
