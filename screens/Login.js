import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import { KeyboardAvoidingView, Platform } from 'react-native';

const Login = ({ navigation }) => {
    const [values, setValues] = useState({ email: '', password: '' });

    const updateInputval = (val, key) => {
        setValues(prevValues => ({
            ...prevValues,
            [key]: val
        }));
    };

    const loginSubmit = () => {
        console.log(values);
        if (!values.email || !values.password) {
            Alert.alert("All fields are required");
            return false;
        }
        auth()
            .signInWithEmailAndPassword(values.email, values.password)
            .then(() => {
                setValues({ email: '', password: '' });
                navigation.navigate('Home'); // Điều hướng đến màn hình Home sau khi đăng nhập thành công
            })
            .catch(error => {
                Alert.alert("Error", error.message);
            });
    };

    return (
        <SafeAreaView>
            <View style={{ padding: 20 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 30, color: '#f6880e', fontWeight: 'bold', marginTop: 10 }}>Login Here</Text>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={{ justifyContent: 'space-around', marginTop: 20 }}>
                        <TextInput
                            placeholder='Email'
                            value={values.email}
                            onChangeText={val => updateInputval(val, 'email')}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder='Password'
                            value={values.password}
                            onChangeText={val => updateInputval(val, 'password')}
                            secureTextEntry
                            style={styles.input}
                        />
                    </View>
                    <TouchableOpacity onPress={loginSubmit} style={styles.button}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>
                    {/* Thêm nút chuyển hướng đến trang đăng ký */}
                    <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.button}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: 'orange',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
    },
});

export default Login;
