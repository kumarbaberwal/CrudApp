import { ThemeContext } from "@/context/ThemeContext";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";


export default editScreen = () => {
    const { id } = useLocalSearchParams();
    const [todo, setTodo] = useState({});
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
    const router = useRouter();

    const [loaded, error] = useFonts({
        Inter_500Medium,
    });

    useEffect(() => {

        const fetchData = async (id) => {
            try {
                const jsonValue = await AsyncStorage.getItem('TodoApp');
                const storageValue = jsonValue != null ? JSON.parse(jsonValue) : null;
                if (storageValue && storageValue.length) {
                    const myTodo = storageValue.find(todo => todo.id.toString() === id);
                    setTodo(myTodo);
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchData(id);
    }, [id]);



    if (!loaded && !error) {
        return null;
    }

    const styles = createStyles(theme, colorScheme);

    const handleSave = async () => {
        try {
            const saveTodo = { ...todo, title: todo.title }
            const jsonValue = await AsyncStorage.getItem('TodoApp');
            const storageValue = jsonValue != null ? JSON.parse(jsonValue) : null;
            if (storageValue && storageValue.length) {
                const otherTodos = storageValue.filter(todo => todo.id !== saveTodo.id);
                const allTodos = [...otherTodos, saveTodo]
                await AsyncStorage.setItem('TodoApp', JSON.stringify(allTodos))
            } else {
                await AsyncStorage.setItem('TodoApp', JSON.stringify([saveTodo]));
            }

            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputText}
                    placeholder="edit todo"
                    placeholderTextColor={'grey'}
                    value={todo?.title || ''}
                    onChangeText={(text) => {
                        setTodo(prev => ({ ...prev, title: text }))
                    }}
                    maxLength={30}>

                </TextInput>
                <Pressable
                    onPress={() => setColorScheme(
                        colorScheme === 'light' ? 'dark' : 'light'
                    )}
                    style={
                        { marginLeft: 10, marginRight: 10 }
                    }>
                    {
                        colorScheme === 'dark' ?
                            <Octicons
                                name="moon"
                                size={36}
                                color={theme.text}
                                selectable={undefined}
                                style={{ width: 36 }}>

                            </Octicons>
                            :
                            <Octicons
                                name="sun"
                                size={36}
                                color={theme.text}
                                selectable={undefined}
                                style={{ width: 36 }}>
                            </Octicons>
                    }
                </Pressable>
            </View>
            <View
                style={styles.buttonContainer}>
                <Pressable
                    onPress={() => router.push('/')}
                    style={
                        [styles.saveButton, {
                            backgroundColor: 'red'
                        }]
                    }
                >
                    <Text
                        style={[styles.saveButtonText, {
                            color: 'white'
                        }]}>
                        Cancel
                    </Text>
                </Pressable>
                <Pressable
                    onPress={handleSave}
                    style={
                        styles.saveButton
                    }
                >
                    <Text
                        style={styles.saveButtonText}>
                        Save
                    </Text>
                </Pressable>
            </View>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </View>
    )
}

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            backgroundColor: theme.background,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            gap: 6,
            width: '100%',
            marginHorizontal: 'auto',
            pointerEvents: 'auto',
        },
        buttonContainer: {
            // flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            gap: 10,
            justifyContent: 'space-between',
            // marginHorizontal: 'auto',
            // pointerEvents: 'auto',
        },
        inputText: {
            flex: 1,
            borderColor: 'grey',
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            fontSize: 18,
            fontFamily: 'Inter_500Medium',
            color: theme.text,
        },
        saveButton: {
            flex: 1,
            backgroundColor: theme.button,
            borderRadius: 5,
            padding: 10,
            width: 'auto',
            justifyContent: 'center',
            alignItems: 'center',
        },
        saveButtonText: {
            fontSize: 18,
            color: colorScheme === 'dark' ? 'black' : 'white',
        }
    })
}