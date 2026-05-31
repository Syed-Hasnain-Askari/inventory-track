"use client";

import React from "react";
import { 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  CheckCircle2 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const OrderStats = ({ stats }) => {
  const data = stats?.result || {};

  const statCards = [
    {
      title: "Total Orders",
      value: data.totalOrders || 0,
      icon: <ShoppingBag className="h-5 w-5 text-indigo-600" />,
      description: "Lifetime orders",
      color: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      title: "Total Revenue",
      value: `$${(data.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign className="h-5 w-5 text-emerald-600" />,
      description: "From paid orders",
      color: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
      title: "Pending Orders",
      value: data.pendingOrders || 0,
      icon: <Clock className="h-5 w-5 text-amber-600" />,
      description: "Awaiting processing",
      color: "bg-amber-50 dark:bg-amber-900/20"
    },
    {
      title: "Avg. Order Value",
      value: `$${(data.averageOrderValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <CheckCircle2 className="h-5 w-5 text-blue-600" />,
      description: "Revenue per order",
      color: "bg-blue-50 dark:bg-blue-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1 text-zinc-900 dark:text-zinc-50">{stat.value}</h3>
                <p className="text-[10px] text-zinc-400 mt-1 font-medium">{stat.description}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
