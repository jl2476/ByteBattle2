
import './globals.css'; 
import Header from '../Components/Nav'; 

export const metadata = {
  title: 'Your Website Title',
  description: 'Your website description here',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
      
      </body>
    </html>
  );
}
