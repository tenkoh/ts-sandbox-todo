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

type TodoItem = z.infer<typeof TodoItemSchema>;

class TodoStore {
  todos: TodoItem[];

  constructor(filepath: string) {
    const data = readFileSync(filepath, { encoding: "utf-8" });
    const jsonData = JSON.parse(data);
    this.todos = z.array(TodoItemSchema).parse(jsonData);
  }

  filterBy<T extends keyof TodoItem>(key: T, value: TodoItem[T]) {
    return this.todos.filter((todo) => {
      return todo[key] === value;
    });
  }

  append(item: TodoItem) {
    try {
      const validated = TodoItemSchema.parse(item);
      this.todos.push(validated);
    } catch (error) {
      console.warn(`validation error: ${error}`);
    }
  }
}

type todoAppender = {
  append(todo: TodoItem): void;
};

class addTodoService {
  private readonly rl: rli;
  private readonly store: todoAppender;

  constructor(rl: rli, store: todoAppender) {
    this.rl = rl;
    this.store = store;
  }

  private askQuestion(prompt: string, must = false): Promise<string> {
    return new Promise((resolve) => {
      const askAgain = () => {
        this.rl.question(prompt, (answer) => {
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

  async addTodo() {
    const title = await this.askQuestion("TODOのタイトル: ", true);
    const body = await this.askQuestion("(任意)詳細: ");
    this.store.append({
      title: title,
      body: body === "" ? undefined : body,
      createdAt: new Date(),
      deadline: undefined,
      status: "before",
    });
  }
}

const main = async () => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const filename = path.join(dirname, "../todos.json");

  const store = new TodoStore(filename);
  await new addTodoService(rl, store).addTodo();
  rl.close();

  await writeFile(filename, JSON.stringify(store.todos, null, 2), {
    encoding: "utf-8",
  });
};

await main();
