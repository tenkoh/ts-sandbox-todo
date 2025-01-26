import { createInterface } from "node:readline";
const rl = createInterface({
	input: process.stdin,
	output: process.stdout,
});

class TodoItem {
	title: string;
	body?: string;
	readonly createdAt: Date;
	deadline?: Date;
	status: TodoStatus = "before";

	constructor(
		title: string,
		createdAt: Date,
		body: string | undefined = undefined,
		deadline: Date | undefined = undefined,
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

	append(title: string, body: string | undefined = undefined) {
		this.todos.push(new TodoItem(title, new Date(), body, undefined));
	}
}

const store = new TodoStore(todos);
const filtered = store.filterBy("status", "progress");
console.log(filtered);

function askQuestion(prompt: string, must = false): Promise<string> {
	return new Promise((resolve) => {
		const askAgain = () => {
			rl.question(prompt, (answer) => {
				if (!must || (must && answer.trim() !== "")) {
					resolve(answer);
				} else {
					console.log("input required");
					askAgain();
				}
			});
		};
		askAgain();
	});
}

async function addTodo(store: TodoStore) {
	const title = await askQuestion("TODOのタイトルを追加してください", true);
	const body = await askQuestion("(任意)詳細を入力してください");
	store.append(title, body === "" ? undefined : body);
}

await addTodo(store);
console.log(store.todos);
rl.close();
