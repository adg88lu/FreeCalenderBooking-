# Self-Hosted Booking System

A clean, animated booking system built with Next.js, Tailwind CSS, and Framer Motion. Emails are sent using Resend.

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment Variables**:
   Copy `.env.local` and add your Resend API key:
   ```bash
   RESEND_API_KEY=re_123456789...
   ```
   > You can get a free API key from [resend.com](https://resend.com).

3. **Run locally**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## ⚙️ Configuration

Edit `lib/availability.ts` to change your schedule:

```typescript
export const availability = {
  daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
  hours: { start: 9, end: 17 }, // 9 AM - 5 PM
  slotDuration: 30, // minutes
  // ...
};
```

## 🌍 Deployment (Vercel)

1. **Push to GitHub**:
   Create a new repository and push this code.

2. **Deploy to Vercel**:
   - Go to [Vercel](https://vercel.com) and "Add New Project".
   - Import your GitHub repository.
   - **Important**: In the "Environment Variables" section, add `RESEND_API_KEY`.
   - Click **Deploy**.

3. **Production Setup**:
   - Verify your domain in Resend to send emails from your own domain (e.g., `bookings@yourname.com`).
   - Update `app/api/book/route.ts` with your verified "from" and "to" email addresses.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Email**: Resend
- **Icons**: Lucide React
