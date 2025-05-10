
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PersonalFinance = () => {
  // Sample data for personal finance
  const cashBalance = 5200;
  const savingsBalance = 15000;
  const totalBalance = cashBalance + savingsBalance;
  
  return (
    <div className="space-y-4">
      <Card className="border border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl">Total Cash</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">€{totalBalance.toLocaleString()}</span>
            <span className="text-sm text-gray-500 mt-1">Available Balance</span>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="border border-gray-800">
          <CardHeader className="py-3">
            <CardTitle className="text-base">Cash</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-center">
              <span className="text-xl font-medium">€{cashBalance.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-800">
          <CardHeader className="py-3">
            <CardTitle className="text-base">Savings</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-center">
              <span className="text-xl font-medium">€{savingsBalance.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg">Cash Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Interest Rate</span>
              <span className="font-medium">3.1%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Interest Earned (YTD)</span>
              <span className="font-medium">€234.18</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Next Interest Payment</span>
              <span className="font-medium">Jun 1, 2025</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalFinance;
