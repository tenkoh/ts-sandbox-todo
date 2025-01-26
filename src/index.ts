import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface, type Interface as rli } from "node:readline";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const TodoItemSchema = z.object({
	title: z.string(),
	body: z.string().optional(),
	createdAt: z.coerce.date(),
	deadline: z.coerce.date().optional(),
	status: z.enum(["before", "progress", "finished", "canceled"]),
});

const TodoItemArraySchema = z.array(TodoItemSchema);

type TodoItem = z.infer<typeof TodoItemSchema>;
type TodoItemInput = z.input<typeof TodoItemSchema>;

class TodoStore {
	todos: TodoItem[];

	constructor(filepath: string) {
		const data = readFileSync(filepath, { encoding: "utf-8" });
		const jsonData = JSON.parse(data);
		this.todos = TodoItemArraySchema.parse(jsonData);
	}

	filterBy<T extends keyof TodoItem>(key: T, value: TodoItem[T]) {
		return this.todos.filter((todo) => {
			return todo[key] === value;
		});
	}

	append(item: TodoItemInput) {
		try {
			const validated = TodoItemSchema.parse(item);
			this.todos.push(validated);
		} catch (error) {
			console.warn(`validation error: ${error}`);
		}
	}
}

function askQuestion(rl: rli, prompt: string, must = false): Promise<string> {
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

async function addTodo(rl: rli, store: TodoStore) {
	const title = await askQuestion(
		rl,
		"TODOのタイトルを追加してください: ",
		true,
	);
	const body = await askQuestion(rl, "(任意)詳細を入力してください: ");
	store.append({
		title: title,
		body: body === "" ? undefined : body,
		createdAt: new Date(),
		deadline: undefined,
		status: "before",
	});
}

const main = async () => {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const dirname = path.dirname(fileURLToPath(import.meta.url));

	const store = new TodoStore(path.join(dirname, "../todos.json"));
	// const filtered = store.filterBy("status", "progress");
	await addTodo(rl, store);
	rl.close();

	await writeFile(
		path.join(dirname, "../todos.json"),
		JSON.stringify(store.todos, null, 2),
		{ encoding: "utf-8" },
	);
};

await main();
