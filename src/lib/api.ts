export const fetchWithAuth = async (endpoint: string) => {
  const base = import.meta.env.VITE_BALLDONTLIE_API;
  const key = import.meta.env.VITE_BALLDONTLIE_KEY;

  const res = await fetch(`${base}/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${key}`,
    },
  });
  if (!res.ok) throw new Error(`Failed: ${res.status}`);
  return await res.json();
};
