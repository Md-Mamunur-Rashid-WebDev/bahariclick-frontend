'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Spinner from '@/components/ui/Spinner';

export default function AdminLayout({ children }) {
    const { user } = useAuthStore();
    const router = useRouter();

    // Protect all admin routes
    useEffect(() => {
        if (user === null) {
        router.push('/auth/login');
        } else if (user?.role !== 'admin') {
        router.push('/');
        }
    }, [user, router]);

    if (!user || user.role !== 'admin') {
        return <div className="flex justify-center items-center min-h-screen"><Spinner size="lg" /></div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-8">{children}</main>
        </div>
    );
}