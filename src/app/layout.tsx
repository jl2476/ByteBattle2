// app/layout.js or app/layout.tsx
import './globals.css'; // Import global CSS here
import Header from '@/pages/home'; // Import Header if it should be persistent

export const metadata = {
  title: 'Your Website Title',
  description: 'Your website description here',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header /> {/* Persistent Header */}
      
      </body>
    </html>
  );
}
