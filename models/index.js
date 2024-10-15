const { log } = require("console");

let formW2Data = [
	{
		form_id: 1,
		form_data: { name: "muhib" }
	},
	{
		form_id: 3,
		form_data: { name: "ali" }
	},
	{
		form_id: 2,
		form_data: { name: "asrar" }
	}
];

let formW2StateInfoData = [
	{
		form_id: 1,
		form_data: { parentId: 3, name: "muhib" }
	},
	{
		form_id: 2,
		form_data: { parentId: 3, name: "ali" }
	},
	{
		form_id: 3,
		form_data: { parentId: 9, name: "asrar" }
	},
	{
		form_id: 4,
		form_data: { parentId: 2, name: "suneel" }
	},
	{
		form_id: 5,
		form_data: { parentId: 10, name: "rehan" }
	}
];
// I want you to give ma all state information records whose parentId matches the formId of formW2Data array.
const res = formW2StateInfoData.some((item) => item.form_data.parentId === 10);
console.log(res);
