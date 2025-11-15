

import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { AdminUser, AdminRole } from '../../types';

const AdminsManagementPage: React.FC = () => {
    const { admins, addAdmin, updateAdmin, deleteAdmin } = useAdmin();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState<Partial<AdminUser>>({});
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null);

    const openModal = (admin: AdminUser | null = null) => {
        setCurrentAdmin(admin ? { ...admin, password: '' } : { name: '', email: '', role: AdminRole.Moderator, password: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentAdmin({});
    };

    const handleSave = () => {
        if (!currentAdmin.name || !currentAdmin.email) {
            alert("Name and email are required.");
            return;
        }

        if (currentAdmin.id) {
            // Editing existing admin
            const originalAdmin = admins.find(a => a.id === currentAdmin.id);
            if (!originalAdmin) return;
            
            const updatedAdmin: AdminUser = {
                ...originalAdmin,
                name: currentAdmin.name,
                email: currentAdmin.email,
                role: currentAdmin.role || originalAdmin.role,
                id: currentAdmin.id,
            };

            if (currentAdmin.password) {
                updatedAdmin.password = currentAdmin.password;
            }
            
            updateAdmin(updatedAdmin);
        } else {
            // Adding new admin
            if (!currentAdmin.password) {
                alert("Password is required for new admins.");
                return;
            }
            addAdmin(currentAdmin as Omit<AdminUser, 'id'>);
        }
        closeModal();
    };

    const openDeleteConfirm = (admin: AdminUser) => {
        setAdminToDelete(admin);
        setIsDeleteConfirmOpen(true);
    };

    const closeDeleteConfirm = () => {
        setAdminToDelete(null);
        setIsDeleteConfirmOpen(false);
    };

    const handleDelete = () => {
        if (adminToDelete) {
            deleteAdmin(adminToDelete.id);
            closeDeleteConfirm();
        }
    };
    
    const commonInputClass = "w-full p-2 bg-white/10 rounded border border-white/20 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none";

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Admins Management</h1>
                <Button onClick={() => openModal()}>Add New Admin</Button>
            </div>
            <GlassCard className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Name</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Email</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Role (Permit)</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {admins.map(admin => (
                                <tr key={admin.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white">{admin.name}</td>
                                    <td className="p-4 text-white">{admin.email}</td>
                                    <td className="p-4 text-white">{admin.role}</td>
                                    <td className="p-4 space-x-2">
                                        <button onClick={() => openModal(admin)} className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline">Edit</button>
                                        <button onClick={() => openDeleteConfirm(admin)} className="text-xs text-red-400 hover:text-red-300 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {isModalOpen && (
                <Modal title={currentAdmin.id ? "Edit Admin" : "Add Admin"} onClose={closeModal}>
                    <div className="space-y-4 text-white">
                        <input type="text" placeholder="Name" value={currentAdmin.name || ''} onChange={e => setCurrentAdmin({ ...currentAdmin, name: e.target.value })} className={commonInputClass} />
                        <input type="email" placeholder="Email" value={currentAdmin.email || ''} onChange={e => setCurrentAdmin({ ...currentAdmin, email: e.target.value })} className={commonInputClass} />
                        <input type="password" placeholder={currentAdmin.id ? "Leave blank to keep unchanged" : "Password"} value={currentAdmin.password || ''} onChange={e => setCurrentAdmin({ ...currentAdmin, password: e.target.value })} className={commonInputClass} />
                        <select value={currentAdmin.role} onChange={e => setCurrentAdmin({ ...currentAdmin, role: e.target.value as AdminRole })} className={commonInputClass}>
                            {Object.values(AdminRole).map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                        <Button onClick={handleSave} className="w-full">Save</Button>
                    </div>
                </Modal>
            )}

            {isDeleteConfirmOpen && adminToDelete && (
                <Modal title="Confirm Deletion" onClose={closeDeleteConfirm}>
                    <p className="text-white">Are you sure you want to delete the admin "{adminToDelete.name}"?</p>
                    <div className="flex justify-end gap-4 mt-4">
                        <Button variant="secondary" onClick={closeDeleteConfirm}>No</Button>
                        <Button className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>Yes</Button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default AdminsManagementPage;