

import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { Plan, PlanName } from '../../types';

const PlansManagementPage: React.FC = () => {
    const { plans, addPlan, updatePlan, deletePlan, movePlan } = useAdmin();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<Partial<Plan> | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

    const openModal = (plan: Partial<Plan> | null = null) => {
        setCurrentPlan(plan ? { ...plan } : { name: PlanName.Free, price: 0, limits: { image: 0, thumbnail: 0, switch: 0 }, description: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentPlan(null);
    };

    const handleSave = () => {
        if (currentPlan) {
            if ('id' in currentPlan && currentPlan.id) {
                updatePlan(currentPlan as Plan);
            } else {
                addPlan(currentPlan as Omit<Plan, 'id'>);
            }
            closeModal();
        }
    };

    const openDeleteConfirm = (plan: Plan) => {
        setPlanToDelete(plan);
        setIsDeleteConfirmOpen(true);
    };

    const closeDeleteConfirm = () => {
        setPlanToDelete(null);
        setIsDeleteConfirmOpen(false);
    };

    const handleDelete = () => {
        if (planToDelete) {
            deletePlan(planToDelete.id);
            closeDeleteConfirm();
        }
    };
    
    const commonInputClass = "w-full p-2 bg-white/10 rounded border border-white/20 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none";

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Plans Management</h1>
                <Button onClick={() => openModal()}>Add New Plan</Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan, index) => (
                    <GlassCard key={plan.id} className="flex flex-col">
                        <h3 className="text-2xl font-bold text-indigo-400">{plan.name}</h3>
                        <p className="text-4xl font-extrabold my-4 text-white">{plan.price}<span className="text-lg font-medium text-gray-400"> BDT/mo</span></p>
                        <p className="text-gray-200 mb-6 flex-grow">{plan.description}</p>
                        <ul className="space-y-2 text-sm text-gray-100 mb-6">
                            <li>✓ {plan.limits.image} Images/day</li>
                            <li>✓ {plan.limits.thumbnail} Thumbnails/day</li>
                            <li>✓ {plan.limits.switch} Switches/day</li>
                        </ul>
                        <div className="flex gap-2 mt-auto">
                            <Button variant="secondary" className="w-full" onClick={() => openModal(plan)}>Edit</Button>
                            <Button variant="secondary" className="w-full bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20" onClick={() => openDeleteConfirm(plan)}>Delete</Button>
                        </div>
                        <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-white/10">
                            <button
                                onClick={() => movePlan(plan.id, 'up')}
                                disabled={index === 0}
                                className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                aria-label="Move plan up"
                                title="Move Up"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                </svg>
                            </button>
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Move</span>
                            <button
                                onClick={() => movePlan(plan.id, 'down')}
                                disabled={index === plans.length - 1}
                                className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                aria-label="Move plan down"
                                title="Move Down"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {isModalOpen && currentPlan && (
                <Modal title={currentPlan.id ? "Edit Plan" : "Add Plan"} onClose={closeModal}>
                    <div className="space-y-4 text-white">
                        <input type="text" placeholder="Plan Name" value={currentPlan.name} onChange={e => setCurrentPlan({ ...currentPlan, name: e.target.value as PlanName })} className={commonInputClass} />
                        <input type="number" placeholder="Price" value={currentPlan.price} onChange={e => setCurrentPlan({ ...currentPlan, price: parseInt(e.target.value) || 0 })} className={commonInputClass} />
                        <input type="text" placeholder="Description" value={currentPlan.description} onChange={e => setCurrentPlan({ ...currentPlan, description: e.target.value })} className={commonInputClass} />
                        <input type="number" placeholder="Image Limit" value={currentPlan.limits?.image} onChange={e => setCurrentPlan({ ...currentPlan, limits: { ...currentPlan.limits!, image: parseInt(e.target.value) || 0 } })} className={commonInputClass} />
                        <input type="number" placeholder="Thumbnail Limit" value={currentPlan.limits?.thumbnail} onChange={e => setCurrentPlan({ ...currentPlan, limits: { ...currentPlan.limits!, thumbnail: parseInt(e.target.value) || 0 } })} className={commonInputClass} />
                        <input type="number" placeholder="Switch Limit" value={currentPlan.limits?.switch} onChange={e => setCurrentPlan({ ...currentPlan, limits: { ...currentPlan.limits!, switch: parseInt(e.target.value) || 0 } })} className={commonInputClass} />
                        <Button onClick={handleSave} className="w-full">Save</Button>
                    </div>
                </Modal>
            )}

            {isDeleteConfirmOpen && planToDelete && (
                <Modal title="Confirm Deletion" onClose={closeDeleteConfirm}>
                    <p className="text-white">Are you sure you want to delete the plan "{planToDelete.name}"?</p>
                    <div className="flex justify-end gap-4 mt-4">
                        <Button variant="secondary" onClick={closeDeleteConfirm}>No</Button>
                        <Button className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>Yes</Button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default PlansManagementPage;