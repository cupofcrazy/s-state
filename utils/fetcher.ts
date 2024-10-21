export const fetcher = async (...args: any) => {
  const response = await fetch(...args);
  return response.json();
};