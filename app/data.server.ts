import qs from "qs";

const url = process.env.STRAPI_URL || "http://localhost:1337";

export async function getLessons(userID: string, authToken: string) {
	const query = qs.stringify({
		sort: ["date:asc"],
		filters: {
			users_permissions_users: {
				$eq: +userID,
			},
		},
		fields: ["date", "datename"],
		pagination: {
			pageSize: 10,
			page: 1,
		},
		status: "published",
		locale: "nl",
	});

	try {
		const response = await fetch(url + "/api/lessons?" + query, {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
		throw new Response("Oh no! Something went wrong!", {
			status: 500,
		});
	}
}

// Get the lessons user is NOT attending
export async function getAvailableLessons(userID: string, authToken: string) {
	const query = qs.stringify({
		sort: ["date:asc"],
		fields: ["date", "datename"],
		pagination: {
			pageSize: 10,
			page: 1,
		},
		status: "published",
		locale: "nl",
	});

	try {
		const response = await fetch(url + "/api/lessons?" + query, {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
		throw new Response("Oh no! Something went wrong!", {
			status: 500,
		});
	}
}

export async function getLesson(lessonID: string, authToken: string) {
	try {
		const response = await fetch(url + "/api/lessons/" + lessonID, {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
		throw new Response("Oh no! Something went wrong!", {
			status: 500,
		});
	}
}
