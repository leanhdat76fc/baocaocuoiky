import React, { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, TouchableWithoutFeedback, View,TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import { KeyboardAvoidingView, Platform, Keyboard } from 'react-native';

const Login = ({ navigation }) => {
    const [values, setValues] = useState({ email: '', password: '' });
    const [focused, setFocused] = useState(false);

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
                navigation.navigate('Home'); 
            })
            .catch(error => {
                Alert.alert("Error", error.message);
            });
    };

    return (
        <SafeAreaView>
            <View style={{ padding: 20 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        resizeMode='contain'
                        source={require('../assets/firebase-la-gi-1.png')}
                        style={{ width: '100%', height: 200, display: focused ? 'none' : 'flex' }}
                    />
                    <Text style={{ fontSize: 30, color: '#f6880e', fontWeight: 'bold', marginTop: 10 }}>Login Here</Text>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <TouchableWithoutFeedback onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
                        <View style={{ justifyContent: 'space-around', marginTop: 20 }}>
                            <TextInput
                                placeholder='Email'
                                value={values.email}
                                onChangeText={val => updateInputval(val, 'email')}
                            />
                            <TextInput
                                placeholder='Password'
                                value={values.password}
                                onChangeText={val => updateInputval(val, 'password')}
                                secureTextEntry
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableOpacity onPress={loginSubmit} style={{ marginTop: 20 }}>
                        <Text style={{ padding: 15, textAlign: 'center', color: 'white', backgroundColor: 'orange', borderRadius: 10 }}>Sign In</Text>
                    </TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 20 }}>
                        <Text style={{ padding: 15, textAlign: 'center', color: '#000', borderRadius: 10 }}>Create new account!</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
};

export default Login;