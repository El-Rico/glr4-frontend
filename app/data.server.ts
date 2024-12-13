import qs from "qs";

const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:1337"
    : "https://srv636619.hstgr.cloud";

const authToken = process.env.STRAPI_TOKEN;

export async function getPageContent(slug: string, personalAuthToken: string) {
  try {
    const response = await fetch(url + "/api/pages/" + slug, {
      headers: {
        Authorization: `Bearer ${personalAuthToken}`,
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

export async function getLessons(userID: string, personalAuthToken: string) {
  const query = qs.stringify({
    sort: ["date:asc"],
    filters: {
      users_permissions_users: {
        $eq: +userID,
      },
      date: {
        $gt: new Date(),
      },
    },
    fields: ["date", "datename", "cancelled"],
    pagination: {
      pageSize: 15,
      page: 1,
    },
    status: "published",
    locale: "nl",
  });

  try {
    const response = await fetch(url + "/api/lessons?" + query, {
      headers: {
        Authorization: `Bearer ${personalAuthToken}`,
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

export async function getAvailableLessons(personalAuthToken: string) {
  const dateStart = new Date();
  let dateEnd = new Date();
  dateEnd = new Date(dateEnd.setMonth(dateEnd.getMonth() + 2));

  const query = qs.stringify({
    sort: ["date:asc"],
    filters: {
      $and: [
        {
          date: {
            $gt: dateStart,
          },
        },
        {
          date: {
            $lt: dateEnd,
          },
        },
      ],
    },
    fields: ["date", "datename", "capacity", "cancelled"],
    populate: {
      users_permissions_users: { count: true },
    },
    pagination: {
      pageSize: 80,
      page: 1,
    },
    status: "published",
    locale: "nl",
  });

  try {
    const response = await fetch(url + "/api/lessons?" + query, {
      headers: {
        Authorization: `Bearer ${personalAuthToken}`,
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

export async function getLesson(lessonID: string, personalAuthToken: string) {
  try {
    const response = await fetch(url + "/api/lessons/" + lessonID, {
      headers: {
        Authorization: `Bearer ${personalAuthToken}`,
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

export async function rescheduleLesson(
  oldLesson: number,
  newLesson: number,
  personalAuthToken: string,
  userID: string,
) {
  const body: object = {
    lessons: {
      disconnect: [
        {
          id: oldLesson,
        },
      ],
      connect: [
        {
          id: newLesson,
        },
      ],
    },
  };
  try {
    const response = await fetch(url + `/api/users/${userID}?`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${personalAuthToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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

export async function buyLesson(
  credit: number,
  newLesson: number,
  personalAuthToken: string,
  userID: string,
) {
  const body: object = {
    credit: credit - 1,
    lessons: {
      connect: [
        {
          id: newLesson,
        },
      ],
    },
  };

  try {
    const response = await fetch(url + `/api/users/${userID}?`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${personalAuthToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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

export async function acceptTerms(userID: string, personalAuthToken: string) {
  const body: object = {
    acceptedterms: true,
  };

  try {
    const response = await fetch(url + `/api/users/${userID}`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${personalAuthToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
