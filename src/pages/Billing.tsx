import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { billingService } from '../services/billing';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CreditCard, DollarSign, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const RECHARGE_AMOUNTS = [
  { amount: 10, tokens: '1M' },
  { amount: 20, tokens: '2M' },
  { amount: 50, tokens: '5M' },
  { amount: 100, tokens: '10M' },
];

const Billing = () => {
  const { user, setUser } = useAuthStore();
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRecharge = async (amount: number) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await billingService.recharge(user!.user_id, { amount });
      setUser({
        ...user!,
        balance: response.balance,
        available_tokens: response.available_tokens,
      });
      toast.success(`Successfully recharged $${amount}`);
      setCustomAmount('');
    } catch (error) {
      toast.error('Failed to process recharge');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    handleRecharge(amount);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <CreditCard className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Billing & Recharge</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
            <h2 className="text-lg font-medium mb-4">Current Balance</h2>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">${user?.balance.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-6 text-white">
            <h2 className="text-lg font-medium mb-4">Available Tokens</h2>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{user?.available_tokens.toLocaleString()}</span>
              <span className="ml-2">tokens</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Recharge Options</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {RECHARGE_AMOUNTS.map(({ amount, tokens }) => (
                <button
                  key={amount}
                  onClick={() => handleRecharge(amount)}
                  disabled={isLoading}
                  className="relative p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 transition-colors duration-200"
                >
                  <div className="text-center">
                    <DollarSign className="h-6 w-6 mx-auto text-indigo-600 mb-2" />
                    <span className="block text-2xl font-bold text-gray-900">${amount}</span>
                    <span className="block text-sm text-gray-500">{tokens} tokens</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Custom Amount</h2>
            <form onSubmit={handleCustomRecharge} className="flex space-x-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <Input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  className="pl-8"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                <Zap className="h-5 w-5 mr-2" />
                Recharge
              </Button>
            </form>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rate</span>
                <span className="font-medium">$10 per 1M tokens</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Minimum Recharge</span>
                <span className="font-medium">$10</span>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Tokens are used for AI chat interactions. The more complex the conversation,
                the more tokens are used. Recharge your account to continue using the service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;