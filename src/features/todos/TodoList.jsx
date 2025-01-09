import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { nanoid } from "nanoid";

import {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "../api/apiSlice";

function TodoList() {
  const [newTodo, setNewTodo] = useState("");

  const {
    data: todos,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTodosQuery();
  const [addTodo] = useAddTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo({
      id: nanoid(),
      userId: 1,
      title: newTodo,
      completed: false,
      createdAt: new Date().toISOString(),
    });
    setNewTodo("");
  };

  const newItemSection = (
    <form onSubmit={handleSubmit} className="mb-5">
      {/* <label htmlFor="new-todo" className="">
        Enter a new todo
      </label> */}
      <div className="flex items-center space-x-2 mt-1 h-[45px]">
        <input
          className="w-full h-full text-lg border border-gray-300 rounded-md px-2 py-1 bg-gray-50"
          type="text"
          value={newTodo}
          id="new-todo"
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new todo"
          autoComplete="off"
        />

        <button className="h-full bg-gray-950 text-gray-50 px-3 rounded-md">
          <IoMdAdd size={36} />
        </button>
      </div>
    </form>
  );

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = todos.map((todo) => {
      return (
        <article
          key={todo.id}
          className={` flex items-center justify-between px-2 py-1 rounded-md ${
            todo.completed ? "bg-red-100" : "bg-green-200"
          }`}
        >
          <div>
            <input
              className="mr-2 cursor-pointer"
              type="checkbox"
              checked={todo.completed}
              id={todo.id}
              onChange={() =>
                updateTodo({ ...todo, completed: !todo.completed })
              }
            />
            <label
              htmlFor={todo.id}
              className={`font-medium text-lg ${
                todo.completed ? "line-through text-gray-600" : ""
              }`}
            >
              {todo.title}
            </label>
          </div>
          <button
            className="text-gray-950 hover:text-red-500 transition-colors"
            onClick={() => deleteTodo({ id: todo.id })}
          >
            <MdDelete size={24} />
          </button>
        </article>
      );
    });
  } else if (isError) {
    content = <p>{error}</p>;
  }

  return (
    <main className="bg-gray-50 min-h-screen flex items-center justify-center px-2 py-10">
      <div className="w-full max-w-[500px]">
        <h1 className="text-4xl font-semibold mb-5 text-center">Todo List</h1>
        {newItemSection}
        <div className="space-y-3">{content}</div>
      </div>
    </main>
  );
}

export default TodoList;
