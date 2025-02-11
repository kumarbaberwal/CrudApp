import { Text, View, TextInput, Pressable, FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { DATA } from "@/data/todo";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { Inter_500Medium, useFonts } from '@expo-google-fonts/inter';
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from "react-native";

export default function Index() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('TodoApp');
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : [];
        if (storageTodos && storageTodos.length) {
          setTodos(storageTodos.sort((a, b) => b.id - a.id));
        }
        else {
          setTodos(DATA.sort((a, b) => b.id - a.id));
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [DATA]);

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = await JSON.stringify(todos);
        await AsyncStorage.setItem('TodoApp', jsonValue);
      } catch (error) {
        console.log(error);
      }
    }
    storeData();
  }, [todos]);

  if (!loaded && !error) {
    return null;
  }

  const styles = createStyles(theme, colorScheme);

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

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, complete: !todo.complete } : todo));
  }

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  const renderItem = ({ item }) => (
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
        <Pressable onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')} style={
          { marginLeft: 10, marginRight: 10 }
        }>
          {colorScheme === 'dark' ? <Octicons name="moon" size={36} color={theme.text} selectable={undefined} style={{ width: 36 }}></Octicons> : <Octicons name="sun" size={36} color={theme.text} selectable={undefined} style={{ width: 36 }}></Octicons>}
        </Pressable>
      </View>
      <Animated.FlatList
        data={todos}
        renderItem={
          renderItem
        }
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{
          flexGrow: 1
        }}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode={'on-drag'}
      />
      <StatusBar style={
        colorScheme === 'dark' ? 'light' : 'dark'
      }></StatusBar>
    </View>
  );
}


function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    inputContainer: {
      // flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      // marginLeft: 10,
      // marginBottom: 10,
      margin: 10,
      width: '100%',
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    textinput: {
      flex: 1,
      borderColor: colorScheme === 'dark' ? 'white' : 'black',
      borderWidth: 1,
      borderRadius: 15,
      marginRight: 10,
      marginLeft: 10,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      // minWidth: 0,
      padding: 15,
      height: 60,
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 15,
      padding: 10,
    },
    addButtonText: {
      fontSize: 18,
      color: colorScheme === 'dark' ? 'black' : 'white',
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
      color: theme.text,
      fontFamily: 'Inter_500Medium',
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: 'gray',
    },
  })
}