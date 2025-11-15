
import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import GlassCard from '../ui/GlassCard';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { PaymentStatus, Payment } from '../../types';

const PaymentsManagementPage: React.FC = () => {
    const { payments, updatePayment } = useAdmin();
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, payment: Payment | null, action: 'Approve' | 'Reject' | null }>({ isOpen: false, payment: null, action: null });

    const openConfirmModal = (payment: Payment, action: 'Approve' | 'Reject') => {
        setConfirmModal({ isOpen: true, payment, action });
    };

    const closeConfirmModal = () => {
        setConfirmModal({ isOpen: false, payment: null, action: null });
    };

    const handleConfirm = () => {
        if (confirmModal.payment && confirmModal.action) {
            const newStatus = confirmModal.action === 'Approve' ? PaymentStatus.Approved : PaymentStatus.Rejected;
            updatePayment(confirmModal.payment.id, { status: newStatus });
            closeConfirmModal();
        }
    };
    
    const statusClasses: Record<PaymentStatus, string> = {
        [PaymentStatus.Pending]: 'bg-yellow-500/20 text-yellow-300',
        [PaymentStatus.Approved]: 'bg-green-500/20 text-green-300',
        [PaymentStatus.Rejected]: 'bg-red-500/20 text-red-300',
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-white">Payments Management</h1>
            <GlassCard className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">User Email</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Plan</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Amount</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Method</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Sender No.</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">TxID</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Date</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Status</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {payments.map(p => (
                                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white">{p.userEmail}</td>
                                    <td className="p-4 text-white">{p.planName}</td>
                                    <td className="p-4 text-white">{p.amount} BDT</td>
                                    <td className="p-4 text-white">{p.method}</td>
                                    <td className="p-4 font-mono text-xs text-gray-300">{p.senderNumber}</td>
                                    <td className="p-4 font-mono text-xs text-gray-300">{p.transactionId}</td>
                                    <td className="p-4 text-white">{p.date.toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[p.status]}`}>{p.status}</span>
                                    </td>
                                    <td className="p-4 space-x-2 whitespace-nowrap">
                                        {p.status === PaymentStatus.Pending && (
                                            <>
                                                <button onClick={() => openConfirmModal(p, 'Approve')} className="text-xs text-green-400 hover:text-green-300 hover:underline">Approve</button>
                                                <button onClick={() => openConfirmModal(p, 'Reject')} className="text-xs text-red-400 hover:text-red-300 hover:underline">Reject</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {confirmModal.isOpen && (
                <Modal title={`Confirm ${confirmModal.action}`} onClose={closeConfirmModal}>
                    <p className="text-white">Are you sure you want to {confirmModal.action?.toLowerCase()} this payment?</p>
                    <div className="flex justify-end gap-4 mt-4">
                        <Button variant="secondary" onClick={closeConfirmModal}>No</Button>
                        <Button
                            className={confirmModal.action === 'Approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                            onClick={handleConfirm}
                        >
                            Yes
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default PaymentsManagementPage;
