import type { TodoItem } from "../entity/todo";

export type getTodoInterface = {
  getTodos(): TodoItem[];
};
