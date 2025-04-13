# Bartr - Currency-less Trading Platform

A modern web application for trading items, built with Next.js, Supabase, and Clerk Authentication.

## Features

### Core Functionality

- **User Authentication**: Secure user authentication powered by Clerk
- **Real-time Trading**: Interactive bidding system for item trading
- **Dashboard Interface**: Clean and intuitive dashboard with multiple cards:
  - Current Bids
  - My Items
  - Notifications
  - Wishlist

### Key Components

#### Bidding System

- Place bids on items
- Accept/reject incoming bids
- Real-time bid status updates
- Grouped bid display by target item

#### Item Management

- Add and manage personal items
- View item status (active/pending/traded)
- Image upload and display
- Price tracking

#### Notifications

- Real-time notification system
- Different notification types:
  - Bid notifications
  - Match notifications
  - System messages
- Timestamp tracking
- Priority-based display

#### Wishlist

- Add items to personal wishlist
- Quick access to desired items
- Seamless integration with main product view

## Technical Stack

### Frontend

- Next.js 13+ (App Router)
- React
- TypeScript
- Tailwind CSS
- ShadcN UI Components

### Backend

- Supabase (PostgreSQL)
- Clerk Authentication
- Server Actions

### Database Schema

#### Products Table

- id (UUID)
- name (String)
- price (Number)
- image (String)
- status (Enum: active/pending/traded)
- description (String)
- userId (Foreign Key)

#### Bids Table

- id (UUID)
- offered_item_id (Foreign Key)
- target_item_id (Foreign Key)
- bidder_id (Foreign Key)
- status (Enum: pending/accepted/rejected)
- created_at (Timestamp)

#### Notifications Table

- id (UUID)
- user_id (Foreign Key)
- type (Enum: bid/match/message/system)
- title (String)
- body (String)
- created_at (Timestamp)

#### Wishlists Table

- user_id (Foreign Key)
- product_id (Foreign Key)

## Setup Instructions

1. Clone the repository

```bash
git clone [repository-url]
cd hackabull25
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

4. Run the development server

```bash
npm run dev
```

## Project Structure

```
hackabull25/
├── app/
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── DashboardBody.tsx
│   │   │   └── DashboardSidebar.tsx
│   │   └── products/
│   │       └── page.tsx
│   └── layout.tsx
├── actions/
│   ├── createItem.ts
│   ├── createNotification.ts
│   └── updateBidStatus.ts
├── components/
│   └── ui/
├── utils/
│   └── supabase/
└── public/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[License Type] - See LICENSE file for details
