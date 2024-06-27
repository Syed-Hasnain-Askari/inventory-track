import React from "react";

export default function Label({ text }) {
	return (
		<label htmlFor="guest" className="mb-3 block  text-gray-500 font-normal">
			{text}
		</label>
	);
}
