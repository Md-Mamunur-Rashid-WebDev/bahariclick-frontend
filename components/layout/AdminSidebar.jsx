'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Tag, LogOut } from 'lucide-react';
import useAuthStore from '@/store/authStore';

const navItems = [
    { href: '/admin',           label: 'Dashboard',  icon: LayoutDashboard },
    { href: '/admin/products',  label: 'Products',   icon: Package },
    { href: '/admin/orders',    label: 'Orders',     icon: ShoppingBag },
    { href: '/admin/categories',label: 'Categories', icon: Tag },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const logout = useAuthStore((state) => state.logout);

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-indigo-600">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => (
            <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                pathname === href
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
                <Icon size={18} />
                {label}
            </Link>
            ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
            <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full font-medium transition-colors"
            >
            <LogOut size={18} />
            Logout
            </button>
        </div>
        </aside>
    );
}