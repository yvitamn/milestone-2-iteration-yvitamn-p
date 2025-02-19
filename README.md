

![Product Image](./assets/product.jpg)


## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Key Implementations](#key-implementations)
- [Build Details & Performance](#build-details)
- [Future Roadmap](#future-roadmap)


## Features

-**Product Listing**: Fetches and displays all products from the server
-**Product Details**: Displays detailed product information on individual product pages (/products/[id])
-**Categories-based Product Filtering**: Displays products based on categories (/categories/[id])
-**Cart Modal & Functionality**: Shows cart items, allows quantity updates, and displays total price before checkout. Users can add items to the cart with quantity selection
-**User Authentication**: Uses token-based authentication (stored in localStorage) for user login and checkout access
-**API Caching**: Caches product data to improve performance and reduce redundant API calls.
-**Error Handling**: Integrates error handling for API responses and faulty data.

## Tech Stack

- **Framework**: Next.js 13.4.0
- **Language**: TypeScript 5.0+
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **API**: RESTful integration
- **Deployment**: Vercel


## Installation

```bash
git clone https://github.com/revou-fsse-oct24/milestone-2-iteration-yvitamn.git
cd milestone-2-iteration-yvitamn
npm install
npm run dev
```

## Project Structure

```text
milestone-2-iteration-yvitamn/
src/
├── pages/
│   ├── products/         # Product Listing
│   ├── categories/       # Display based on categories
│   ├── checkout/         # Checkout pages
│   └── ...               # Other route segments
├── components/           # Reusable UI components
├── lib/                  # API clients and utilities
├── hooks/                # Custom React hooks
└── types/                # TypeScript type definitions
```


## Key Implementations



## Build Details & Performance
![Build](./assets/build2.jpg)


## Future Roadmap
-[] UI Enhancements
-[] Shopping Experience
-[] Categories & Navigation
-[] Performance
-[] CI/CD 






