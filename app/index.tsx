import { Text, View, TextInput, Pressable, FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { DATA } from "@/data/todo";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Inter_500Medium, useFonts } from '@expo-google-fonts/inter';

export default function Index() {
  const [todos, setTodos] = useState(DATA.sort((a, b) => b.id - a.id));
  const [text, setText] = useState('');
  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  if (!loaded && !error) {
    return null;
  }

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

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  const renderItem = ({ item }: { item: { id: number, title: string, complete: boolean } }) => (
    <View style={{
      margin: 10,
    }}>
      <View style={styles.todoItem}>
        <Text style={[styles.todoText, item.complete && styles.completedText]} onPress={() => toggleTodo(item.id)}>
          {item.title}
        </Text>
        <Pressable onPress={() => removeTodo(item.id)}>
          <MaterialIcons name="delete" size={30} color="red" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textinput}
          placeholder="Add a new todo"
          placeholderTextColor={'gray'}
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>
            Add
          </Text>
        </Pressable>
      </View>
      <FlatList
        data={todos}
        renderItem={
          renderItem
        }
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{
          flexGrow: 1
        }}
      />
    </View>
  );
}


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 10,
    margin: 10,
    width: '100%',
    marginHorizontal: 'auto',
    pointerEvents: 'auto',
  },
  textinput: {
    flex: 1,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 15,
    marginRight: 10,
    fontSize: 18,
    // minWidth: 0,
    padding: 15,
    height: 50,
    color: 'white',
  },
  addButton: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
  },
  addButtonText: {
    fontSize: 18,
    color: 'black',
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // gap: 4,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    width: '100%',
    marginHorizontal: 'auto',
    pointerEvents: 'auto',
  },
  todoText: {
    flex: 1,
    fontSize: 18,
    color: 'white',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
})