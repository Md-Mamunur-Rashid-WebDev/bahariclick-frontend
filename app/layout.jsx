import './globals.css';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: {
    default: 'BahariClick',
    template: '%s | BahariClick',
  },
  description: 'Your online shop in Bangladesh',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold text-indigo-600 mb-3">
                  BahariClick
                </h3>
                <p className="text-gray-500 text-sm">
                  Your trusted online shop in Bangladesh. Quality products at great prices.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
                <div className="space-y-2">
                  <a href="/products" className="block text-gray-500 hover:text-indigo-600 text-sm">Products</a>
                  <a href="/cart" className="block text-gray-500 hover:text-indigo-600 text-sm">Cart</a>
                  <a href="/orders" className="block text-gray-500 hover:text-indigo-600 text-sm">My Orders</a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Account</h4>
                <div className="space-y-2">
                  <a href="/auth/login" className="block text-gray-500 hover:text-indigo-600 text-sm">Sign In</a>
                  <a href="/auth/register" className="block text-gray-500 hover:text-indigo-600 text-sm">Create Account</a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6 text-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} BahariClick. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}