"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import {
	updateOrderStatus,
	updatePaymentStatus,
	cancelOrder
} from "../../app/actions/orderActions";
import {
	ShoppingBag,
	DollarSign,
	Clock,
	CheckCircle2,
	Truck,
	RotateCw,
	ChevronLeft,
	Calendar,
	Mail,
	Phone,
	MapPin,
	CreditCard,
	AlertTriangle,
	Printer,
	ArrowRight,
	Ban,
	User,
	ChevronDown
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "../ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "../ui/dropdown-menu";

export default function OrderDetailClient({ initialOrder }) {
	const [order, setOrder] = useState(initialOrder);
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
	const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);
	const [showCancelModal, setShowCancelModal] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const handleStatusUpdate = async (newStatus) => {
		setIsUpdatingStatus(true);
		try {
			const res = await updateOrderStatus(order._id, newStatus);
			if (res.success) {
				setOrder((prev) => ({ ...prev, status: newStatus }));
				toast({
					title: "Status Updated Successfully",
					description: `Order #${order.orderNumber} is now ${newStatus.toUpperCase()}.`,
				});
				router.refresh();
			} else {
				toast({
					variant: "destructive",
					title: "Update Failed",
					description: res.message || "Failed to update order status.",
				});
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: error.message || "An unexpected error occurred.",
			});
		} finally {
			setIsUpdatingStatus(false);
		}
	};

	const handlePaymentUpdate = async (newPaymentStatus) => {
		setIsUpdatingPayment(true);
		try {
			const res = await updatePaymentStatus(order._id, newPaymentStatus);
			if (res.success) {
				setOrder((prev) => ({ ...prev, paymentStatus: newPaymentStatus }));
				toast({
					title: "Payment Updated Successfully",
					description: `Payment status for Order #${order.orderNumber} is now ${newPaymentStatus.toUpperCase()}.`,
				});
				router.refresh();
			} else {
				toast({
					variant: "destructive",
					title: "Update Failed",
					description: res.message || "Failed to update payment status.",
				});
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: error.message || "An unexpected error occurred.",
			});
		} finally {
			setIsUpdatingPayment(false);
		}
	};

	const handleCancelOrder = async () => {
		setIsCancelling(true);
		setShowCancelModal(false);
		try {
			const res = await cancelOrder(order._id);
			if (res.success) {
				setOrder((prev) => ({ ...prev, status: "cancelled" }));
				toast({
					title: "Order Cancelled",
					description: `Order #${order.orderNumber} has been successfully cancelled and stock restored.`,
				});
				router.refresh();
			} else {
				toast({
					variant: "destructive",
					title: "Cancellation Failed",
					description: res.message || "Failed to cancel order.",
				});
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: error.message || "An unexpected error occurred.",
			});
		} finally {
			setIsCancelling(false);
		}
	};

	const getStatusStyles = (status) => {
		switch (status) {
			case "delivered":
				return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50";
			case "shipped":
				return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50";
			case "processing":
				return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50";
			case "pending":
				return "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";
			case "cancelled":
				return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50";
			default:
				return "bg-zinc-100 text-zinc-700 border-zinc-200";
		}
	};

	const getPaymentStatusStyles = (status) => {
		switch (status) {
			case "paid":
				return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50";
			case "failed":
				return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50";
			case "pending":
				return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50";
			default:
				return "bg-zinc-100 text-zinc-700 border-zinc-200";
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString(undefined, {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	};

	// Determine current step index in the progress timeline
	const statuses = ["pending", "processing", "shipped", "delivered"];
	const currentStatusIndex = statuses.indexOf(order.status);
	const isCancelled = order.status === "cancelled";

	const timelineSteps = [
		{ key: "pending", label: "Pending Confirmed", icon: ShoppingBag, color: "indigo" },
		{ key: "processing", label: "Processing Order", icon: RotateCw, color: "amber" },
		{ key: "shipped", label: "Shipped & In Transit", icon: Truck, color: "blue" },
		{ key: "delivered", label: "Completed & Delivered", icon: CheckCircle2, color: "emerald" }
	];

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			{/* Breadcrumb / Top Navigation Bar */}
			<div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
				<div className="flex items-center gap-3">
					<Button
						asChild
						variant="outline"
						size="sm"
						className="h-9 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:scale-[1.02] active:scale-[0.98] transition-all"
					>
						<Link href="/order">
							<ChevronLeft className="h-4 w-4 mr-1.5 text-zinc-500" />
							Back to Orders
						</Link>
					</Button>
					<span className="text-zinc-300 dark:text-zinc-700">|</span>
					<span className="font-mono text-sm font-semibold text-zinc-500">
						ID: {order._id}
					</span>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => window.print()}
						className="h-9 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:scale-[1.02] transition-all gap-1.5"
					>
						<Printer className="h-4 w-4 text-zinc-500" />
						Print Invoice
					</Button>
				</div>
			</div>

			{/* Main Summary Header Card */}
			<div className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 md:p-8 shadow-sm relative overflow-hidden">
				{/* Top-Right Decorative Background Gradients */}
				<div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/5 to-purple-500/0 rounded-full blur-3xl pointer-events-none" />
				
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
					<div className="space-y-2">
						<div className="flex flex-wrap items-center gap-3">
							<h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 font-mono tracking-tight">
								{order.orderNumber}
							</h1>
							<span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyles(order.status)}`}>
								{order.status}
							</span>
							<span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getPaymentStatusStyles(order.paymentStatus)}`}>
								{order.paymentStatus}
							</span>
						</div>
						<div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-zinc-500 font-medium">
							<span className="flex items-center gap-1.5">
								<Calendar className="h-4 w-4 text-zinc-400" />
								{formatDate(order.createdAt)}
							</span>
							<span className="hidden sm:inline text-zinc-300 dark:text-zinc-800">•</span>
							<span className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
								<CreditCard className="h-4 w-4 text-zinc-400" />
								COD (Cash on Delivery)
							</span>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						{!isCancelled && (
							<>
								{/* Update Order Status Dropdown */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											disabled={isUpdatingStatus || order.status === "delivered"}
											className="h-10 rounded-xl font-semibold border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all gap-1.5"
										>
											{isUpdatingStatus ? (
												<RotateCw className="h-4 w-4 animate-spin text-zinc-500" />
											) : (
												<RotateCw className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
											)}
											Update Status
											<ChevronDown className="h-4 w-4 opacity-50" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-52 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl p-1.5">
										<DropdownMenuLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2.5 py-1.5">
											Set Order Status
										</DropdownMenuLabel>
										<DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
										<DropdownMenuItem
											disabled={order.status === "pending"}
											onClick={() => handleStatusUpdate("pending")}
											className="cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded-lg text-sm px-2.5 py-2 font-medium"
										>
											Pending
										</DropdownMenuItem>
										<DropdownMenuItem
											disabled={order.status === "processing"}
											onClick={() => handleStatusUpdate("processing")}
											className="cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded-lg text-sm px-2.5 py-2 font-medium"
										>
											Processing
										</DropdownMenuItem>
										<DropdownMenuItem
											disabled={order.status === "shipped"}
											onClick={() => handleStatusUpdate("shipped")}
											className="cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded-lg text-sm px-2.5 py-2 font-medium"
										>
											Shipped
										</DropdownMenuItem>
										<DropdownMenuItem
											disabled={order.status === "delivered"}
											onClick={() => handleStatusUpdate("delivered")}
											className="cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded-lg text-sm px-2.5 py-2 font-medium"
										>
											Delivered
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>

								{/* Update Payment Status Dropdown */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											disabled={isUpdatingPayment}
											className="h-10 rounded-xl font-semibold border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all gap-1.5"
										>
											{isUpdatingPayment ? (
												<RotateCw className="h-4 w-4 animate-spin text-zinc-500" />
											) : (
												<DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
											)}
											Payment Status
											<ChevronDown className="h-4 w-4 opacity-50" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-52 rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl p-1.5">
										<DropdownMenuLabel className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2.5 py-1.5">
											Set Payment Status
										</DropdownMenuLabel>
										<DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
										<DropdownMenuItem
											disabled={order.paymentStatus === "pending"}
											onClick={() => handlePaymentUpdate("pending")}
											className="cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded-lg text-sm px-2.5 py-2 font-medium text-amber-600 dark:text-amber-400"
										>
											Pending
										</DropdownMenuItem>
										<DropdownMenuItem
											disabled={order.paymentStatus === "paid"}
											onClick={() => handlePaymentUpdate("paid")}
											className="cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded-lg text-sm px-2.5 py-2 font-medium text-emerald-600 dark:text-emerald-400"
										>
											Paid
										</DropdownMenuItem>
										<DropdownMenuItem
											disabled={order.paymentStatus === "failed"}
											onClick={() => handlePaymentUpdate("failed")}
											className="cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-900 rounded-lg text-sm px-2.5 py-2 font-medium text-rose-600 dark:text-rose-400"
										>
											Failed
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>

								{/* Cancel Button */}
								<Button
									variant="outline"
									disabled={isCancelling}
									onClick={() => setShowCancelModal(true)}
									className="h-10 rounded-xl font-semibold border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-all gap-1.5"
								>
									<Ban className="h-4 w-4" />
									Cancel Order
								</Button>
							</>
						)}
					</div>
				</div>

				{/* Custom Cancellation Alert Box */}
				{isCancelled && (
					<div className="mt-8 flex items-start gap-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 animate-in zoom-in duration-300">
						<div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400 shrink-0">
							<AlertTriangle className="h-5 w-5" />
						</div>
						<div className="space-y-1">
							<h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
								This order has been cancelled
							</h3>
							<p className="text-xs text-rose-600 dark:text-rose-400/80 font-medium">
								All related items have been returned to their active product stock. Further changes or processing for this order are disabled.
							</p>
						</div>
					</div>
				)}

				{/* Dynamic Visual Progress Timeline */}
				{!isCancelled && (
					<div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-900">
						<div className="relative">
							{/* Background Track Line */}
							<div className="absolute top-[21px] left-8 right-8 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
							
							{/* Filled Vibrant Track Line */}
							<div
								className="absolute top-[21px] left-8 h-1 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 rounded-full transition-all duration-700 ease-out"
								style={{
									width: `${(currentStatusIndex / (timelineSteps.length - 1)) * 100}%`
								}}
							/>

							{/* Steps */}
							<div className="flex items-center justify-between relative z-10">
								{timelineSteps.map((step, idx) => {
									const isCompleted = idx < currentStatusIndex;
									const isActive = idx === currentStatusIndex;
									const StepIcon = step.icon;

									return (
										<div key={step.key} className="flex flex-col items-center group">
											{/* Outer Circle Container */}
											<div
												className={`
													w-[44px] h-[44px] rounded-full flex items-center justify-center border-4 transition-all duration-500
													${isCompleted 
														? "bg-indigo-600 border-indigo-100 dark:bg-indigo-600 dark:border-indigo-900/50 text-white shadow-md" 
														: isActive
														? "bg-white dark:bg-zinc-950 border-indigo-600 text-indigo-600 shadow-lg scale-110 shadow-indigo-500/10 dark:shadow-indigo-500/5"
														: "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-400"
													}
												`}
											>
												{isCompleted ? (
													<CheckCircle2 className="h-5 w-5" />
												) : (
													<StepIcon className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />
												)}
											</div>
											
											{/* Step Label */}
											<span
												className={`
													mt-3 text-xs font-bold text-center tracking-tight transition-all duration-300 max-w-[80px] sm:max-w-none
													${isActive 
														? "text-indigo-600 dark:text-indigo-400 scale-105" 
														: isCompleted 
														? "text-zinc-800 dark:text-zinc-300 font-semibold" 
														: "text-zinc-400 font-medium"
													}
												`}
											>
												{step.label}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Main Grid: Details Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
				{/* Left Side: Items Card (8 Columns) */}
				<div className="lg:col-span-8 space-y-6">
					<Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
						<CardHeader className="p-6 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/10">
							<CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
								<ShoppingBag className="h-5 w-5 text-indigo-600" />
								Ordered Items List
							</CardTitle>
							<CardDescription className="text-xs text-zinc-400">
								Detailed view of the items in this order
							</CardDescription>
						</CardHeader>
						
						<CardContent className="p-0">
							<div className="overflow-x-auto">
								<Table className="w-full">
									<TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-900">
										<TableRow>
											<TableHead className="pl-6 py-4 text-xs font-bold uppercase text-zinc-400">
												Product Info
											</TableHead>
											<TableHead className="text-right py-4 text-xs font-bold uppercase text-zinc-400 w-[120px]">
												Price
											</TableHead>
											<TableHead className="text-center py-4 text-xs font-bold uppercase text-zinc-400 w-[80px]">
												Qty
											</TableHead>
											<TableHead className="pr-6 text-right py-4 text-xs font-bold uppercase text-zinc-400 w-[140px]">
												Subtotal
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody className="divide-y divide-zinc-100 dark:divide-zinc-900">
										{order.items?.map((item) => {
											const product = item.product || {};
											const imageSrc = product.images?.[0] || "/placeholder-product.png";
											const productPrice = item.price || product.price || 0;
											const itemSubtotal = productPrice * item.quantity;

											return (
												<TableRow key={item._id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-colors">
													<TableCell className="pl-6 py-4">
														<div className="flex items-center gap-4">
															{/* Image Container with Glass Effects */}
															<div className="relative w-16 h-16 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900 overflow-hidden flex items-center justify-center shrink-0">
																{product.images?.[0] ? (
																	<Image
																		src={product.images[0]}
																		alt={product.name || "Product image"}
																		fill
																		className="object-cover object-center group-hover:scale-105 transition-transform"
																	/>
																) : (
																	<ShoppingBag className="h-6 w-6 text-zinc-300 dark:text-zinc-700" />
																)}
															</div>
															{/* Metadata */}
															<div className="space-y-0.5">
																<h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
																	{product.name || "Deleted Product"}
																</h4>
																{product.sku && (
																	<p className="text-[11px] font-semibold text-zinc-400 font-mono">
																		SKU: {product.sku}
																	</p>
																)}
															</div>
														</div>
													</TableCell>
													<TableCell className="py-4 text-right">
														<span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
															${Number(productPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
														</span>
													</TableCell>
													<TableCell className="py-4 text-center">
														<span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">
															{item.quantity}
														</span>
													</TableCell>
													<TableCell className="pr-6 py-4 text-right">
														<span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">
															${Number(itemSubtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
														</span>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>

							{/* Summary Calculation Block */}
							<div className="p-6 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/10 flex justify-end">
								<div className="w-full sm:w-80 space-y-3 text-sm">
									<div className="flex justify-between font-medium text-zinc-500">
										<span>Items Subtotal</span>
										<span className="font-mono text-zinc-900 dark:text-zinc-100">
											${Number(order.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
										</span>
									</div>
									<div className="flex justify-between font-medium text-zinc-500">
										<span>Shipping Fee</span>
										<span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs">
											Free Shipping
										</span>
									</div>
									<div className="flex justify-between font-medium text-zinc-500">
										<span>Estimated Tax</span>
										<span className="font-mono text-zinc-900 dark:text-zinc-100">
											$0.00
										</span>
									</div>
									<div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />
									<div className="flex justify-between items-center text-zinc-900 dark:text-zinc-50 font-bold">
										<span className="text-base">Grand Total</span>
										<span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tracking-tight">
											${Number(order.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Side: Customer Info & Address Cards (4 Columns) */}
				<div className="lg:col-span-4 space-y-6">
					{/* Customer Profile Card */}
					<Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
						<CardHeader className="p-6 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/10">
							<CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
								<User className="h-4.5 w-4.5 text-indigo-600" />
								Customer Information
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6 space-y-5">
							{/* Profile Box */}
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white text-base font-bold shadow-sm">
									{(order.customer?.firstName?.[0] || "") + (order.customer?.lastName?.[0] || "") || "C"}
								</div>
								<div>
									<h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">
										{order.customer?.firstName + " " + order.customer?.lastName || "Guest Customer"}
									</h4>
									<p className="text-xs text-zinc-400 font-medium mt-0.5">
										Registered Customer
									</p>
								</div>
							</div>

							<div className="h-px bg-zinc-100 dark:bg-zinc-900" />

							{/* Contacts */}
							<div className="space-y-3.5 text-sm">
								<div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
									<Mail className="h-4 w-4 text-zinc-400 shrink-0" />
									<a
										href={`mailto:${order.customer?.email}`}
										className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium truncate"
									>
										{order.customer?.email || "No email provided"}
									</a>
								</div>
								<div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
									<Phone className="h-4 w-4 text-zinc-400 shrink-0" />
									<a
										href={`tel:${order.customer?.phone}`}
										className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium font-mono"
									>
										{order.customer?.phone || "No phone number"}
									</a>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Shipping Address Card */}
					<Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
						<CardHeader className="p-6 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/10">
							<CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
								<MapPin className="h-4.5 w-4.5 text-indigo-600" />
								Shipping Destination
							</CardTitle>
						</CardHeader>
						<CardContent className="p-6 space-y-4">
							{order.shippingAddress ? (
								<div className="space-y-4">
									{/* Full Address details */}
									<div className="flex gap-3">
										<div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl self-start">
											<MapPin className="h-4.5 w-4.5" />
										</div>
										<div className="space-y-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed">
											<p className="font-bold text-zinc-900 dark:text-zinc-100">
												{order.customer?.firstName} {order.customer?.lastName}
											</p>
											<p className="font-medium text-zinc-600 dark:text-zinc-400 text-xs">
												{order.shippingAddress.street}
											</p>
											<p className="text-zinc-500 font-medium text-xs">
												{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
											</p>
											<p className="text-zinc-400 font-bold text-[10px] tracking-wider uppercase">
												{order.shippingAddress.country}
											</p>
										</div>
									</div>
								</div>
							) : (
								<p className="text-sm text-zinc-400 font-medium">
									No shipping address provided.
								</p>
							)}
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Custom Animated Cancellation Modal */}
			{showCancelModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
					<div
						className="bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 max-w-md w-full overflow-hidden shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center gap-4">
							<div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl">
								<AlertTriangle className="h-6 w-6" />
							</div>
							<div>
								<h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
									Cancel Order
								</h3>
								<p className="text-xs text-zinc-400 font-medium mt-0.5">
									Are you sure you want to cancel this order?
								</p>
							</div>
						</div>

						<div className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-900/30 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-900 font-medium">
							Cancelling Order <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{order.orderNumber}</span> will immediately return all quantities of purchased items to their corresponding product stock levels in the system. This action is irreversible.
						</div>

						<div className="flex items-center justify-end gap-3">
							<Button
								variant="outline"
								onClick={() => setShowCancelModal(false)}
								className="rounded-xl border-zinc-200 dark:border-zinc-800 font-semibold"
							>
								Keep Order
							</Button>
							<Button
								onClick={handleCancelOrder}
								className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
							>
								Yes, Cancel Order
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
