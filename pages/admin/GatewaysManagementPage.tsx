
import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { Gateway } from '../../types';

const GatewaysManagementPage: React.FC = () => {
    const { gateways, addGateway, updateGateway, deleteGateway } = useAdmin();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentGateway, setCurrentGateway] = useState<Partial<Gateway>>({});
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [gatewayToDelete, setGatewayToDelete] = useState<Gateway | null>(null);

    const openModal = (gateway: Gateway | null = null) => {
        setCurrentGateway(gateway ? { ...gateway } : { name: '', number: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentGateway({});
    };

    const handleSave = () => {
        if (!currentGateway.name || !currentGateway.number) {
            alert("Name and number are required.");
            return;
        }

        if (currentGateway.id) {
            updateGateway(currentGateway as Gateway);
        } else {
            addGateway(currentGateway as Omit<Gateway, 'id'>);
        }
        closeModal();
    };

    const openDeleteConfirm = (gateway: Gateway) => {
        setGatewayToDelete(gateway);
        setIsDeleteConfirmOpen(true);
    };

    const closeDeleteConfirm = () => {
        setGatewayToDelete(null);
        setIsDeleteConfirmOpen(false);
    };

    const handleDelete = () => {
        if (gatewayToDelete) {
            deleteGateway(gatewayToDelete.id);
            closeDeleteConfirm();
        }
    };
    
    const commonInputClass = "w-full p-2 bg-white/10 rounded border border-white/20 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none";

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Gateways Management</h1>
                <Button onClick={() => openModal()}>Add New Gateway</Button>
            </div>
            <GlassCard className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Name</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Number</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {gateways.map(gateway => (
                                <tr key={gateway.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white">{gateway.name}</td>
                                    <td className="p-4 font-mono text-gray-300">{gateway.number}</td>
                                    <td className="p-4 space-x-4">
                                        <button onClick={() => openModal(gateway)} className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline">Edit</button>
                                        <button onClick={() => openDeleteConfirm(gateway)} className="text-xs text-red-400 hover:text-red-300 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {isModalOpen && (
                <Modal title={currentGateway.id ? "Edit Gateway" : "Add Gateway"} onClose={closeModal}>
                    <div className="space-y-4 text-white">
                        <div>
                            <label className="text-sm">Gateway Name</label>
                            <input type="text" placeholder="e.g., bKash" value={currentGateway.name || ''} onChange={e => setCurrentGateway({ ...currentGateway, name: e.target.value })} className={commonInputClass} />
                        </div>
                        <div>
                            <label className="text-sm">Gateway Number</label>
                            <input type="text" placeholder="e.g., 01xxxxxxxxx" value={currentGateway.number || ''} onChange={e => setCurrentGateway({ ...currentGateway, number: e.target.value })} className={commonInputClass} />
                        </div>
                        <Button onClick={handleSave} className="w-full mt-4">Save</Button>
                    </div>
                </Modal>
            )}

            {isDeleteConfirmOpen && gatewayToDelete && (
                <Modal title="Confirm Deletion" onClose={closeDeleteConfirm}>
                    <p className="text-white">Are you sure you want to delete the gateway "{gatewayToDelete.name}"?</p>
                    <div className="flex justify-end gap-4 mt-4">
                        <Button variant="secondary" onClick={closeDeleteConfirm}>No</Button>
                        <Button className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>Yes</Button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default GatewaysManagementPage;
