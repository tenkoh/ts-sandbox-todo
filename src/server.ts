import type { getTodoInterface } from "./repository/todo";

export function getTodosHandler(srv: getTodoInterface) {
	return (req?: Request): Response => {
		return new Response(JSON.stringify(srv.getTodos()));
	};
}
