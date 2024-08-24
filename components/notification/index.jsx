import Link from "next/link";
import Image from "next/image";

const chatData = [
	{
		active: true,
		avatar: "/images/user/user-01.png",
		name: "Devid Heilo",
		text: "Hello, how are you?",
		time: "12 min",
		textCount: 3,
		dot: 3
	},
	{
		active: true,
		avatar: "/images/user/user-02.png",
		name: "Henry Fisher",
		text: "I am waiting for you",
		time: "5:54 PM",
		textCount: 0,
		dot: 1
	},
	{
		active: null,
		avatar: "/images/user/user-04.png",
		name: "Wilium Smith",
		text: "Where are you now?",
		time: "10:12 PM",
		textCount: 0,
		dot: 3
	},
	{
		active: true,
		seen: true,
		avatar: "/images/user/user-05.png",
		name: "Henry Deco",
		text: "Thank you so much!",
		time: "Sun",
		textCount: 2,
		dot: 6
	},
	{
		active: false,
		avatar: "/images/user/user-06.png",
		name: "Jubin Jack",
		text: "Hello, how are you?",
		time: "Oct 23",
		textCount: 0,
		dot: 3
	}
];
const Notification = () => {
	return (
		<div className="relative">
			<div className="absolute top-4 right-0 bg-white w-96  py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
				<div className="flex space-x-2.5 py-3 px-3">
					<div className="relative h-10 w-10">
						<img
							className="h-50 w-50 rounded-full object-cover object-center"
							src="https://images.unsplash.com/photo-1645378999013-95abebf5f3c1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
							alt=""
						/>
						<span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-green-400 ring ring-white"></span>
					</div>
					<div className="flex justify-end">
						<button className="ttop-4 absolute right-4 ml-auto text-slate-500 hover:text-slate-900">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								className="h-5 w-5"
							>
								<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
							</svg>
						</button>
					</div>
					<div className="flex-1">
						<h4 className="pr-6 font-medium text-slate-900">
							Taylor Swift{" "}
							<span className="ml-2 font-normal text-slate-500">5 min ago</span>
						</h4>
						<div className="py-2 px-2 mt-1 text-slate-500">
							Your team has made changes to your company profile since you last
							logged in.
						</div>
					</div>
				</div>
				<hr />
				<div className="flex space-x-2.5 py-3 px-3">
					<div className="relative h-10 w-10">
						<img
							className="h-50 w-50 rounded-full object-cover object-center"
							src="https://images.unsplash.com/photo-1645378999013-95abebf5f3c1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
							alt=""
						/>
						<span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-green-400 ring ring-white"></span>
					</div>
					<div className="flex justify-end">
						<button className="ttop-4 absolute right-4 ml-auto text-slate-500 hover:text-slate-900">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								className="h-5 w-5"
							>
								<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
							</svg>
						</button>
					</div>
					<div className="flex-1">
						<h4 className="pr-6 font-medium text-slate-900">
							Taylor Swift{" "}
							<span className="ml-2 font-normal text-slate-500">5 min ago</span>
						</h4>
						<div className="py-2 px-2 mt-1 text-slate-500">
							Your team has made changes to your company profile since you last
							logged in.
						</div>
					</div>
				</div>
				<hr />
				<div className="flex space-x-2.5 py-3 px-3">
					<div className="relative h-10 w-10">
						<img
							className="h-50 w-50 rounded-full object-cover object-center"
							src="https://images.unsplash.com/photo-1645378999013-95abebf5f3c1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
							alt=""
						/>
						<span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-green-400 ring ring-white"></span>
					</div>
					<div className="flex justify-end">
						<button className="ttop-4 absolute right-4 ml-auto text-slate-500 hover:text-slate-900">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								className="h-5 w-5"
							>
								<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
							</svg>
						</button>
					</div>
					<div className="flex-1">
						<h4 className="pr-6 font-medium text-slate-900">
							Taylor Swift{" "}
							<span className="ml-2 font-normal text-slate-500">5 min ago</span>
						</h4>
						<div className="py-2 px-2 mt-1 text-slate-500">
							Your team has made changes to your company profile since you last
							logged in.
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Notification;
