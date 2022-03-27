import { Dimensions, StyleSheet, Text, TextInput, View, Button, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import GlobalStyles from '../GlobalStyles'

const ResetPassword = ({ navigation, route }) => {
    const [inputValue, setInputValue] = React.useState()
    const [errorMessage, setErrorMessage] = React.useState()

    const handlePress = async () => {
        if (!inputValue) {
            setErrorMessage('Введите Email')
            return
        }
        await fetch('http://192.168.2.114:8000/verification', {
            method: 'POST',
            header: {
                "Content-Type": "applications/json",
            },
            body: JSON.stringify({ email: inputValue }),
        })
            .then(res => {
                if (res.status === 200) navigation.navigate('resetVerification', { email: inputValue })
                else setErrorMessage('Что-то пошло не так')
            })
            .catch(error => setErrorMessage('Ошибка: ' + error))
    }

    return (
        <View style={GlobalStyles.container}>
            <View style={GlobalStyles.form}>
                <Text style={GlobalStyles.header}>Сброс пароля</Text>
                {errorMessage ? <Text>{errorMessage}</Text> : null}
                <KeyboardAvoidingView style={{ width: '100%' }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <TextInput
                        style={GlobalStyles.input}
                        placeholder='Email'
                        onChangeText={text => setInputValue(text)}
                    />
                </KeyboardAvoidingView>
                <TouchableOpacity onPress={handlePress} style={GlobalStyles.button}><Text style={GlobalStyles.buttonText}>Сбросить пароль</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('registration')} style={{ flexDirection: 'row' }}><Text>Вспомнили пароль? </Text><Text style={{ color: 'blue' }}>Войти</Text></TouchableOpacity>
            </View>
        </View>
    )
}

export default ResetPassword;

const styles = StyleSheet.create({});
