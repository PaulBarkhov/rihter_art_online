import { Text, TextInput, View, TouchableOpacity } from '../../components'
import GlobalStyles from '../../GlobalStyles'
import React from 'react'

const ResetVerification = ({ navigation, route }) => {
    const [inputValue, setInputValue] = React.useState()
    const [errorMessage, setErrorMessage] = React.useState()

    const handlePress = async () => {
        if (!inputValue) {
            setErrorMessage('Введите Email')
            return
        }
        await fetch(`http://192.168.2.114:8000/verify_code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'applications/json'
            },
            body: JSON.stringify({ code: inputValue })
        })
            .then(res => {
                if (res.status === 200) navigation.navigate("newPassword")
                else setErrorMessage('Ошибка')
            })
    }

    return (
        <View style={GlobalStyles.container}>
            <View style={GlobalStyles.form}>
                <Text style={GlobalStyles.header}>Введите код</Text>
                {errorMessage ? <Text>{errorMessage}</Text> : null}
                <View style={{ width: '100%' }}>
                    <TextInput
                        style={GlobalStyles.input}
                        placeholder={`Код из письма ${route.params.email}`}
                        onChangeText={text => setInputValue(text)}
                        keyboardType="number-pad"
                    />
                </View>
                <TouchableOpacity onPress={handlePress} style={GlobalStyles.button}><Text style={GlobalStyles.buttonText}>Проверить</Text></TouchableOpacity>
            </View>
        </View>
    )
}

export default ResetVerification

const styles = StyleSheet.create({})
