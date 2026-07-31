import './globals.css';

export const metadata = {
  title: 'AEC Strength Club — 60-Day Challenge',
  description: '60-Day Challenge — Body, Mind & Faith',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
