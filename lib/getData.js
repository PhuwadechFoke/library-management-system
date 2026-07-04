// export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function getData(endpoint) {
  try {
    const timestamp = Date.now();

    const response = await fetch(`/api/${endpoint}?tid=${timestamp}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}