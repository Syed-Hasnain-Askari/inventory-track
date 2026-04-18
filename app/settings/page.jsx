"use client";
import React, { useState, useEffect } from "react";
import { User, Bell, Shield, Database } from "lucide-react";
import { useToast } from "../../components//ui/use-toast";
import { userProfileAction } from "../data/actions/auth-actions";
import ImageUploader from "../../components/imageuploader";
const SettingBoxes = () => {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">
					Settings
				</h1>
				<p className="text-zinc-600 dark:text-zinc-400">
					Manage your application preferences
				</p>
			</div>

			<div className="grid gap-6">
				<div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 transition-colors">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-blue-600 dark:text-blue-400">
							<User size={24} />
						</div>
						<div>
							<h2 className="font-semibold text-zinc-900 dark:text-white">
								Profile Settings
							</h2>
							<p className="text-sm text-zinc-600 dark:text-zinc-400">
								Manage your account information
							</p>
						</div>
					</div>
					<div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
						<div>
							<label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
								Full Name
							</label>
							<input
								type="text"
								defaultValue="Admin User"
								className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
								Email Address
							</label>
							<input
								type="email"
								defaultValue="admin@inventorypro.com"
								className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
							/>
						</div>
					</div>
				</div>

				<div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 transition-colors">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg text-green-600 dark:text-green-400">
							<Bell size={24} />
						</div>
						<div>
							<h2 className="font-semibold text-zinc-900 dark:text-white">
								Notifications
							</h2>
							<p className="text-sm text-zinc-600 dark:text-zinc-400">
								Configure notification preferences
							</p>
						</div>
					</div>
					<div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
						<label className="flex items-center justify-between">
							<span className="text-sm text-zinc-900 dark:text-white">
								Low stock alerts
							</span>
							<input
								type="checkbox"
								defaultChecked
								className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
							/>
						</label>
						<label className="flex items-center justify-between">
							<span className="text-sm text-zinc-900 dark:text-white">
								New product notifications
							</span>
							<input
								type="checkbox"
								defaultChecked
								className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
							/>
						</label>
						<label className="flex items-center justify-between">
							<span className="text-sm text-zinc-900 dark:text-white">
								Email notifications
							</span>
							<input
								type="checkbox"
								className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
							/>
						</label>
					</div>
				</div>

				<div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 transition-colors">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-purple-600 dark:text-purple-400">
							<Shield size={24} />
						</div>
						<div>
							<h2 className="font-semibold text-zinc-900 dark:text-white">
								Security
							</h2>
							<p className="text-sm text-zinc-600 dark:text-zinc-400">
								Manage your security settings
							</p>
						</div>
					</div>
					<div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
						<button className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
							Change Password
						</button>
					</div>
				</div>

				<div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 transition-colors">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg text-orange-600 dark:text-orange-400">
							<Database size={24} />
						</div>
						<div>
							<h2 className="font-semibold text-zinc-900 dark:text-white">
								Data Management
							</h2>
							<p className="text-sm text-zinc-600 dark:text-zinc-400">
								Export and backup your data
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
						<button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
							Export Data
						</button>
						<button className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
							Backup Now
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingBoxes;
