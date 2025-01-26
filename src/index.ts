class TodoItem {
	title: string;
	body?: string;
	readonly createdAt: Date;
	deadline?: Date;
	status: TodoStatus = "before";

	constructor(
		title: string,
		createdAt: Date,
		body = undefined,
		deadline = undefined,
	) {
		this.title = title;
		this.createdAt = createdAt;
		this.body = body;
		this.deadline = deadline;
	}
}

type TodoStatus = "before" | "progress" | "finished" | "canceled";

const todos: TodoItem[] = [
	new TodoItem("hello world", new Date()),
	new TodoItem("foo bar", new Date()),
];

todos[1].status = "progress";

class TodoStore {
	todos: TodoItem[];

	constructor(todos: TodoItem[]) {
		this.todos = todos;
	}

	filterBy<T extends keyof TodoItem>(key: T, value: TodoItem[T]) {
		return this.todos.filter((todo) => {
			return todo[key] === value;
		});
	}
}

const store = new TodoStore(todos);
const filtered = store.filterBy("status", "progress");
console.log(filtered);
