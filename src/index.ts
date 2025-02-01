import type { TodoItem } from "./entity/todo";
import { getTodosHandler } from "./server";

export default {
	fetch: (req?: Request) => {
		const srv = {
			getTodos(): TodoItem[] {
				return [
					{
						title: "title1",
						createdAt: new Date("2024-09-22T12:34:56+09:00"),
						status: "before",
					},
					{
						title: "title2",
						body: "body2",
						createdAt: new Date("2024-09-22T12:34:56+09:00"),
						status: "finished",
					},
				];
			},
		};
		return getTodosHandler(srv)();
	},
};
