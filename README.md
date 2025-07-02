This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## System Monitor Widget

The System Monitor widget now displays **real-time system information** from your machine:

### Features
- **Real CPU Usage**: Current CPU load percentage
- **Real RAM Usage**: Memory utilization percentage  
- **Real Disk Usage**: Primary disk space utilization
- **Live Updates**: Refreshes every 3 seconds
- **Fallback System**: Gracefully falls back to simulated data if system access fails

### Technical Implementation
- **API Endpoint**: `/api/system` - Returns current system metrics
- **System Library**: Uses `systeminformation` package for accurate readings
- **Fallback**: Uses Node.js built-in `os` module as backup
- **Real-time**: Widget updates automatically every 3 seconds
- **Visual Indicator**: Green pulsing dot shows live data status

### API Response Format
```json
{
  "success": true,
  "data": {
    "cpu": 46,
    "ram": 78,
    "disk": 45
  },
  "timestamp": "2025-07-02T07:09:38.193Z"
}
```

### Testing
Test the API directly: `curl http://localhost:3000/api/system`
