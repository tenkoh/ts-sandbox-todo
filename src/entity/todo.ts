import { z } from "zod";

const TodoItemSchema = z.object({
  title: z.string(),
  body: z.string().optional(),
  createdAt: z.coerce.date(),
  deadline: z.coerce.date().optional(),
  status: z.enum(["before", "progress", "finished", "canceled"]),
});

export type TodoItem = z.infer<typeof TodoItemSchema>;
