import { Text, View } from "react-native";
import { useState } from "react";
import { DATA } from "@/data/todo";

export default function Index() {
  const [todos, setTodos] = useState(DATA.sort((a, b) => b.id - a.id));
  const [text, setText] = useState('');

  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([{
        id: newId,
        title: text,
        complete: false
      }, ...todos]);
      setText('');
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, complete: !todo.complete } : todo));
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
