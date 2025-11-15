

import React, { useState, useMemo } from 'react';
import GlassCard from './ui/GlassCard';
import { Plan, PlanName } from '../types';
import Button from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import { useNavigate } from 'react-router-dom';
import { usePlan } from '../hooks/usePlan';

interface PlanCardProps {
  plan: Plan;
  onSelect: () => void;
  isCurrent: boolean;
  disabled: boolean;
  actionText: string;
  actionVariant: 'primary' | 'secondary';
  glow?: { color: string; opacity: number };
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect, isCurrent, disabled, actionText, actionVariant, glow }) => {
    
    const glowStyle = useMemo(() => {
        if (!glow) return {};
        // Convert opacity (0-100) to a 2-digit hex string (00-FF)
        const opacityHex = Math.round((glow.opacity / 100) * 255).toString(16).padStart(2, '0');
        const glowColor = `${glow.color}${opacityHex}`;
        return {
            boxShadow: `0 0 20px 5px ${glowColor}`,
            borderColor: glow.color,
        };
    }, [glow]);

    return (
        <GlassCard 
            className={`flex flex-col transition-all duration-300 ${isCurrent ? 'border-indigo-500' : ''}`}
            style={glowStyle}
        >
            <h3 className="text-2xl font-bold text-indigo-400">{plan.name}</h3>
            <p className="text-4xl font-extrabold my-4">{plan.price}<span className="text-lg font-medium text-gray-400"> BDT/mo</span></p>
            <p className="text-gray-400 mb-6 flex-grow">{plan.description}</p>
            <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li>✓ {plan.limits.image} Images/day</li>
                <li>✓ {plan.limits.thumbnail} Thumbnails/day</li>
                <li>✓ {plan.limits.switch} Switches/day</li>
            </ul>
            <Button onClick={onSelect} disabled={disabled} variant={actionVariant} className="w-full mt-auto">
                {actionText}
            </Button>
        </GlassCard>
    );
};

const PlanPage: React.FC = () => {
    const { user } = useAuth();
    const { currentPlan } = usePlan();
    const { addPayment, users, gateways, plans, settings } = useAdmin();
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [paymentStep, setPaymentStep] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [senderNumber, setSenderNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(gateways.length > 0 ? gateways[0].name : '');
    const [paymentSubmitted, setPaymentSubmitted] = useState(false);
    
    const handleSelectPlan = (plan: Plan) => {
        if (!user) {
            navigate('/auth');
            return;
        }
        setSelectedPlan(plan);
        setPaymentStep(true);
        setPaymentSubmitted(false);
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedPlan && transactionId && senderNumber && user) {
            const managedUser = users.find(u => u.email === user.email);
            addPayment({
                userId: managedUser ? managedUser.id : 'new-user',
                userEmail: user.email,
                planName: selectedPlan.name,
                amount: selectedPlan.price,
                method: paymentMethod,
                transactionId,
                senderNumber,
            });
            setPaymentSubmitted(true);
            setTransactionId('');
            setSenderNumber('');
        }
    }
    
    const selectedGateway = useMemo(() => {
        return gateways.find(g => g.name === paymentMethod);
    }, [paymentMethod, gateways]);

    if(paymentSubmitted) {
        return (
            <div className="container mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-bold mb-8">Payment Submitted</h1>
                <GlassCard>
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-2xl font-semibold mb-2">Thank you!</h2>
                        <p className="text-gray-400 mb-6">Your payment is pending verification. Your plan will be updated once approved by an admin.</p>
                        <Button onClick={() => { setPaymentSubmitted(false); setPaymentStep(false); setSelectedPlan(null); }} variant="secondary">
                            Back to Plans
                        </Button>
                    </div>
                </GlassCard>
            </div>
        );
    }

    if(paymentStep && selectedPlan) {
        return (
             <div className="container mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-bold mb-2">Manual Payment</h1>
                <p className="text-gray-400 mb-8">For {selectedPlan.name} Plan</p>
                <GlassCard>
                    <p className="mb-4">Please send <span className="font-bold text-indigo-400">{selectedPlan.price} BDT</span> to our {paymentMethod} number: <span className="font-mono bg-white/10 px-2 py-1 rounded">{selectedGateway?.number || 'Not available'}</span></p>
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        <select
                            value={paymentMethod}
                            onChange={e => setPaymentMethod(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        >
                            {gateways.map(gateway => (
                                <option key={gateway.id} value={gateway.name}>{gateway.name}</option>
                            ))}
                        </select>
                         <input
                            type="text"
                            placeholder="Your Sender Number"
                            value={senderNumber}
                            onChange={(e) => setSenderNumber(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                            required
                         />
                         <input
                            type="text"
                            placeholder="Enter Transaction ID"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                            required
                         />
                         <div className="text-left">
                             <label className="block text-sm font-medium text-gray-300 mb-2">Upload Payment Proof (Optional)</label>
                            <input type="file" className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30"/>
                         </div>
                         <div className="flex gap-4">
                            <Button variant="secondary" onClick={() => setPaymentStep(false)} className="w-full">Back to Plans</Button>
                            <Button type="submit" className="w-full" disabled={!transactionId || !senderNumber}>Submit Payment</Button>
                         </div>
                    </form>
                </GlassCard>
            </div>
        )
    }

  return (
    <div className="container mx-auto max-w-7xl text-center">
      <h1 className="text-4xl font-bold mb-2">Choose Your Plan</h1>
      <p className="text-gray-400 mb-12">Flexible plans for every creator. Upgrade, downgrade, or cancel anytime.</p>
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
        {plans.map(plan => {
            const glowConfig = (settings.planGlow.enabled && settings.planGlow.planId === plan.id)
                ? { color: settings.planGlow.color, opacity: settings.planGlow.opacity }
                : undefined;

            const isCurrent = user?.plan === plan.name;
            const isFreePlanCard = plan.name === PlanName.Free;

            let actionText = 'Choose Plan';
            let actionVariant: 'primary' | 'secondary' = 'primary';
            let isDisabled = false;

            if (isCurrent) {
                actionText = 'Current Plan';
                actionVariant = 'secondary';
                isDisabled = true;
            } else if (user && currentPlan) {
                if (isFreePlanCard) {
                    actionText = 'Default Plan';
                    actionVariant = 'secondary';
                    isDisabled = true;
                } else if (plan.price > currentPlan.price) {
                    actionText = 'Upgrade';
                } else if (plan.price < currentPlan.price) {
                    actionText = 'Downgrade';
                    actionVariant = 'secondary';
                }
                
                if (currentPlan.name === PlanName.Free && plan.name === PlanName.Go) {
                     actionText = 'Upgrade to Go';
                }
            }
            
            return (
                <PlanCard 
                    key={plan.id} 
                    plan={plan} 
                    onSelect={() => handleSelectPlan(plan)} 
                    isCurrent={isCurrent}
                    disabled={isDisabled}
                    actionText={actionText}
                    actionVariant={actionVariant}
                    glow={glowConfig}
                />
            );
        })}
      </div>
    </div>
  );
};

export default PlanPage;