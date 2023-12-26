import { useInView } from "react-intersection-observer";
import "./App.css";
import TodoCard from "./components/TodoCard";
import { Todo } from "./types/todo";
import { useInfiniteQuery } from "react-query";
import { useEffect } from "react";

function App() {
  const fetchTodo = async ({ pageParam = 1 }: { pageParam: number }) => {
    const endpoint = `https://jsonplaceholder.typicode.com/todos?_page=${pageParam}`;
    const response = await fetch(endpoint);

    return response.json();
  };

  const { ref, inView } = useInView();

  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery<Todo, Error>({
    queryKey: ["todos"],
    queryFn: ({ pageParam }) => fetchTodo({ pageParam }),
    getNextPageParam: (lastPage, allPages) => allPages.length + 1,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      console.log("load next!");
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const flattenedTodos = data?.pages.flatMap((page) => page) || [];
  const content = flattenedTodos.map((todo, idx) =>
    flattenedTodos.length === idx + 1 ? (
      <TodoCard key={todo.id} title={todo.title} innerRef={ref} />
    ) : (
      <TodoCard key={todo.id} title={todo.title} />
    )
  );

  if (status === "loading") {
    return <div>Loading</div>;
  }

  if (status === "error") {
    return <div>{(error as Error).message}</div>;
  }

  return (
    <div>
      {content}
      {isFetchingNextPage && <h3>Loading...</h3>}
    </div>
  );
}

export default App;
