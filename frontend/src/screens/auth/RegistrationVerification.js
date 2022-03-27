import { Text, TextInput, View, TouchableOpacity } from '../../components/react-native'
import React from 'react';
import GlobalStyles from '../../GlobalStyles'
import { useNavigate } from 'react-router-dom';
import CodeInput from '../../components/CodeInput';

const RegistrationVerification = (userData) => {
    const [inputValue, setInputValue] = React.useState()
    const [errorMessage, setErrorMessage] = React.useState()
    const navigate = useNavigate()



    const handlePress = async () => {
        if (!inputValue) {
            setErrorMessage('Введите Email')
            return
        }
        navigate('/login')
        // await fetch(`http://192.168.2.114:8000/verify_code`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'applications/json'
        //     },
        //     body: JSON.stringify({ code: inputValue })
        // })
        //     .then(res => {
        //         if (res.status === 200) {
        //             try {
        //                 fetch("http://192.168.2.114:8000/registration", {
        //                     method: "POST",
        //                     headers: {
        //                         "Content-Type": "applications/json",
        //                     },
        //                     body: JSON.stringify(userData),
        //                 })
        //                     .then((res) => res.json())
        //                     .then((data) => {
        //                         if (data.isRegistered) {
        //                             console.log('success')
        //                             navigate('/login')
        //                         } else {
        //                             console.log('Failure')
        //                         }
        //                     });
        //             } catch (error) {
        //                 console.log("Ошибка", error);
        //             }
        //         }
        //         else setErrorMessage('Ошибка')
        //     })
    }

    return (
        <View style={GlobalStyles.container}>
            <View style={styles.registrationVerificationForm}>
                <Text style={GlobalStyles.header}>Введите код</Text>
                {errorMessage ? <Text>{errorMessage}</Text> : null}
                <CodeInput />

                {/* <TextInput
                    style={GlobalStyles.input}
                    placeholder={`Код из письма ${userData.email}`}
                    onChangeText={text => setInputValue(text)}
                    keyboardType="number-pad"
                /> */}
                {/* <TouchableOpacity onPress={handlePress} style={GlobalStyles.button}><Text style={GlobalStyles.buttonText}>Проверить</Text></TouchableOpacity> */}
            </View>
        </View>
    )
}

export default RegistrationVerification

const styles = {
    registrationVerificationForm: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',

        padding: 50,
        minWidth: 320,
        width: '60%',

        backgroundColor: 'white',
        borderRadius: 15
    }
}
