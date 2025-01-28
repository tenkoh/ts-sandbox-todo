export function getTodosHandler(req?: Request): Response {
  return new Response(JSON.stringify(["hello", "world"]));
}
