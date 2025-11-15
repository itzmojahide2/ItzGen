import React from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import GlassCard from '../ui/GlassCard';
import { PaymentStatus } from '../../types';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <GlassCard className="flex items-center p-4">
        <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-400 mr-4">{icon}</div>
        <div>
            <p className="text-sm text-gray-200">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </GlassCard>
);

const DashboardPage: React.FC = () => {
    const { users, payments } = useAdmin();
    const totalUsers = users.length;
    const pendingPayments = payments.filter(p => p.status === PaymentStatus.Pending).length;
    const totalRevenue = payments.filter(p => p.status === PaymentStatus.Approved).reduce((acc, p) => acc + p.amount, 0);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Users" value={totalUsers} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 12a4 4 0 110-8 4 4 0 010 8z" /></svg>} />
                <StatCard title="Pending Payments" value={pendingPayments} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <StatCard title="Total Revenue (BDT)" value={totalRevenue.toLocaleString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} />
            </div>
            <GlassCard className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-white">Recent Activity</h2>
                <p className="text-gray-200">Activity feed placeholder...</p>
            </GlassCard>
        </div>
    );
}

export default DashboardPage;