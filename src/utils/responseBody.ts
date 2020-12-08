export const responseBody = (body: Record<string, unknown>, indent?: number) => {
  return JSON.stringify(body, null, indent ?? 2);
};
