export const fetcher = async (...args: any) => {
  // @ts-ignore
  const response = await fetch(...args);
  return response.json();
};