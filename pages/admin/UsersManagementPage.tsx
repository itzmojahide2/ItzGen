import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import GlassCard from '../ui/GlassCard';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { AdminManagedUser, PlanName } from '../../types';

const UsersManagementPage: React.FC = () => {
    const { users, updateUser } = useAdmin();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminManagedUser | null>(null);

    const handleOpenModal = (user: AdminManagedUser) => {
        setEditingUser({ ...user, password: '' }); // Clear password for form
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSave = () => {
        if (editingUser) {
            const updates: Partial<AdminManagedUser> = {
                name: editingUser.name,
                email: editingUser.email,
                plan: editingUser.plan,
                isBanned: editingUser.isBanned,
            };
            if (editingUser.password) {
                updates.password = editingUser.password;
            }
            updateUser(editingUser.id, updates);
            handleCloseModal();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (editingUser) {
            setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
        }
    };
    
    const handleToggleBan = () => {
        if(editingUser) {
            setEditingUser({...editingUser, isBanned: !editingUser.isBanned});
        }
    };
    
    const commonInputClass = "w-full p-2 bg-white/10 rounded border border-white/20 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none";


    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-white">Users Management</h1>
            <GlassCard className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Name</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Email</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Plan</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Join Date</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Status</th>
                                <th className="p-4 uppercase text-gray-300 tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white">{user.name}</td>
                                    <td className="p-4 text-white">{user.email}</td>
                                    <td className="p-4"><span className="px-2 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-300">{user.plan}</span></td>
                                    <td className="p-4 text-white">{user.joinDate.toLocaleDateString()}</td>
                                    <td className="p-4">
                                        {user.isBanned
                                            ? <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-300">Banned</span>
                                            : <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-300">Active</span>
                                        }
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => handleOpenModal(user)} className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
            
            {isModalOpen && editingUser && (
                <Modal title={`Edit User: ${editingUser.name}`} onClose={handleCloseModal}>
                    <div className="space-y-4 text-white">
                        <div>
                            <label className="text-sm">Name</label>
                            <input type="text" name="name" value={editingUser.name} onChange={handleInputChange} className={commonInputClass} />
                        </div>
                         <div>
                            <label className="text-sm">Email</label>
                            <input type="email" name="email" value={editingUser.email} onChange={handleInputChange} className={commonInputClass} />
                        </div>
                        <div>
                            <label className="text-sm">Plan</label>
                            <select name="plan" value={editingUser.plan} onChange={handleInputChange} className={commonInputClass}>
                                {Object.values(PlanName).map(plan => <option key={plan} value={plan}>{plan}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="text-sm">New Password</label>
                            <input type="password" name="password" value={editingUser.password} onChange={handleInputChange} placeholder="Leave blank to keep unchanged" className={commonInputClass} />
                        </div>
                         <div className="flex items-center justify-between">
                            <label className="text-sm">Status</label>
                            <button onClick={handleToggleBan} className={`px-3 py-1 text-sm rounded-full ${editingUser.isBanned ? 'bg-red-500/50 text-red-200' : 'bg-green-500/50 text-green-200'}`}>
                                {editingUser.isBanned ? 'Banned' : 'Active'}
                            </button>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default UsersManagementPage;