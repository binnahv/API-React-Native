import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const authenticateWithBiometrics = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
            Alert.alert('Erro', 'O dispositivo não possui suporte a biometria.');
            return;
        }

        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (!supportedTypes.length) {
            Alert.alert('Erro', 'Nenhum método de autenticação biométrica disponível.');
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Autenticação Biométrica',
            fallbackLabel: 'Usar senha',
        });

        if (result.success) {
            navigation.navigate('MainScreen');
        } else {
            Alert.alert('Erro', 'Falha na autenticação biométrica.');
        }
    };

    const loginWithAPI = async () => {
        try {
            const response = await fetch(`http://192.168.1.236:3000/login?username=${username}&password=${password}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (data.success) {
                navigation.navigate('MainScreen');
            } else {
                Alert.alert('Erro', data.message);
            }
        } catch (error) {
            Alert.alert('Erro', 'Falha ao conectar à API.');
        }
    };

    return (
        <View style={styles.loginContainer}>
            <View style={styles.header}>
                <Text style={styles.welcome}>Acesse sua conta</Text>
                <Text style={styles.instructions}>Use sua senha ou biometria.</Text>
            </View>
            <View style={styles.inputSection}>
                <TextInput
                    style={styles.input}
                    placeholder="Usuário"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="#000"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#000"
                />
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={loginWithAPI}>
                <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={authenticateWithBiometrics}>
                <Text style={styles.linkText}>Entrar com Biometria</Text>
            </TouchableOpacity>
        </View>
    );
}

function MainScreen({ navigation }) {
    return (
        <View style={styles.mainContainer}>
            <Text style={styles.mainMessage}>Bem-vindo à página principal!</Text>
            <TouchableOpacity
                style={styles.exitButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.exitButtonText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginScreen">
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="MainScreen" component={MainScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: '#FFD700', 
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    welcome: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#000', 
    },
    instructions: {
        fontSize: 16,
        color: '#000',
    },
    inputSection: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 12,
        marginVertical: 8,
        backgroundColor: '#fff', 
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#000', 
        color: '#000', 
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#000', 
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: '#FFD700', 
        fontSize: 16,
        fontWeight: '600',
    },
    linkText: {
        color: '#000', 
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginTop: 15,
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFD700', 
    },
    mainMessage: {
        fontSize: 24,
        color: '#000', 
        marginBottom: 20,
    },
    exitButton: {
        padding: 15,
        backgroundColor: '#000', 
        borderRadius: 8,
    },
    exitButtonText: {
        color: '#FFD700', 
        fontSize: 16,
        fontWeight: '600',
    },
});
