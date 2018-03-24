const todos = new Array(30).fill(true).map((_, i) => ({
  id: i,
  name: `Todo ${i}`,
  comment: `This is the todo number ${i}`,
}));

const getTodos = async () => todos;
const getTodo = async (i: number) => todos[i];

export { getTodos, getTodo };
