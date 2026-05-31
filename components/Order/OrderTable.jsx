"use client";

import React from "react";
import {
	TableHead,
	TableRow,
	TableHeader,
	TableBody,
	Table,
	TableCell
} from "@/components/ui/table";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Eye, 
  ShoppingBag, 
  RefreshCw,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function OrderTable({ data }) {
	const orders = data?.result || [];

	const getStatusStyles = (status) => {
		switch (status) {
			case "delivered":
				return "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
			case "shipped":
				return "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
			case "processing":
				return "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
			case "pending":
				return "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";
			case "cancelled":
				return "bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
			default:
				return "bg-zinc-100 text-zinc-700 border-zinc-200";
		}
	};

  const getPaymentStatusStyles = (status) => {
		switch (status) {
			case "paid":
				return "text-emerald-600 dark:text-emerald-400";
			case "failed":
				return "text-red-600 dark:text-red-400";
			case "pending":
				return "text-amber-600 dark:text-amber-400";
			default:
				return "text-zinc-500";
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	if (orders.length === 0) {
		return (
			<Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
				<CardHeader className="text-center">
					<CardTitle>Orders List</CardTitle>
					<CardDescription>No orders found matching your criteria.</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center py-12">
          <ShoppingBag className="h-12 w-12 text-zinc-200 dark:text-zinc-800 mb-4" />
					<Button 
						variant="outline" 
						size="sm" 
						onClick={() => window.location.href = window.location.pathname}
            className="gap-2"
					>
            <RefreshCw className="h-4 w-4" />
						Clear All Filters
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
			<CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-zinc-100 dark:border-zinc-800">
				<div>
					<CardTitle className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
						<ShoppingBag className="h-5 w-5 text-indigo-600" />
						Orders List
					</CardTitle>
					<CardDescription className="text-sm text-zinc-500 mt-1">
						Displaying {orders.length} orders in your system.
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<div className="overflow-x-auto">
					<Table className="w-full">
						<TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
							<TableRow className="hover:bg-transparent">
								<TableHead className="pl-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Order #</TableHead>
								<TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-500 py-4">Customer</TableHead>
								<TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-500 py-4">Date</TableHead>
								<TableHead className="text-right text-xs font-bold uppercase tracking-wider text-zinc-500 py-4">Total</TableHead>
								<TableHead className="text-center text-xs font-bold uppercase tracking-wider text-zinc-500 py-4">Payment</TableHead>
								<TableHead className="text-center text-xs font-bold uppercase tracking-wider text-zinc-500 py-4">Status</TableHead>
								<TableHead className="w-[100px] pr-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-zinc-500">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800">
							{orders.map((order) => (
								<TableRow key={order._id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
									<TableCell className="pl-6 py-4">
                    <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">
										  {order.orderNumber}
                    </span>
									</TableCell>
									<TableCell className="py-4">
										<div className="flex flex-col">
											<span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
												{order.user?.name || "Guest"}
											</span>
											<span className="text-xs text-zinc-500">
												{order.user?.email || "No email"}
											</span>
										</div>
									</TableCell>
									<TableCell className="py-4">
										<span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
											{formatDate(order.createdAt)}
										</span>
									</TableCell>
									<TableCell className="py-4 text-right">
										<span className="font-bold text-zinc-900 dark:text-zinc-100">
											${Number(order.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
										</span>
									</TableCell>
									<TableCell className="py-4 text-center">
										<span className={`text-xs font-bold uppercase tracking-wide ${getPaymentStatusStyles(order.paymentStatus)}`}>
											{order.paymentStatus}
										</span>
									</TableCell>
									<TableCell className="py-4 text-center">
										<span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(order.status)}`}>
											{order.status}
										</span>
									</TableCell>
									<TableCell className="pr-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                          <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl">
                        <DropdownMenuLabel className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-3 py-2">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                        <DropdownMenuItem asChild className="cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-900">
                          <Link href={`/order/${order._id}`} className="flex items-center gap-2 px-3 py-2 text-sm">
                            <ExternalLink className="h-4 w-4 text-zinc-400" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-900">
                          <div className="flex items-center gap-2 px-3 py-2 text-sm">
                            <RefreshCw className="h-4 w-4 text-zinc-400" />
                            Update Status
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
			<CardFooter className="py-4 px-6 bg-zinc-50/30 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800">
				<p className="text-xs font-medium text-zinc-500">
					Showing <span className="text-zinc-900 dark:text-zinc-200">{orders.length}</span> of{" "}
					<span className="text-zinc-900 dark:text-zinc-200">{data.pagination?.total || 0}</span> orders
				</p>
			</CardFooter>
		</Card>
	);
}
