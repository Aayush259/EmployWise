
const BASE_URL = "https://reqres.in"

async function fetchApi(url: string, options?: RequestInit) {

    try {
        const response = await fetch(`${BASE_URL}${url}`, options);

        if (!response.ok) {
            if (response.status === 404) {
                return { data: null, error: "NOT_FOUND" };
            } else {
                throw new Error('Network response was not ok');
            }
        }

        const result = await response.json();

        return { data: result, error: null };
    } catch (error) {
        return { data: null, error: error };
    }
};

export default async function login({
    email,
    password
}: {
    email: string;
    password: string
}) {

    return await fetchApi("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });
};

