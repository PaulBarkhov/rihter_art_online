const GlobalStyles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',

        maxWidth: 800,
        margin: '0 auto',

        backgroundColor: 'tomato',
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        margin: 10,
        padding: 10,
        backgroundColor: 'tomato',
        borderRadius: 5,
        fontSize: 16,
        color: 'white',
        fontWeight: '700'
    },
    header: {
        fontSize: 30,
        marginBottom: 30,
        fontFamily: 'sans-serif',
        fontWeight: '700',
        color: 'black'
    },
    input: {
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5,
        width: '100%',
        padding: '10px 15px',
        marginBottom: 10,
        backgroundColor: 'white',
        fontFamily: 'sans-serif'
    },
    redBorderInput: {
        borderColor: 'red',
        borderWidth: 2,
        borderRadius: 5,
        width: '100%',
        paddingLeft: 15,
        paddingTop: 10,
        paddingRight: 15,
        paddingBottom: 10,
        marginBottom: 10,

    },
    inputError: {
        position: 'absolute',
        whiteSpace: 'nowrap',
        // left: '50%',
        bottom: 0,
        transform: 'translateY(50%)',
        paddingLeft: 10,
        paddingTop: 3,
        paddingRight: 10,
        paddingBottom: 3,
        fontSize: 12,
        backgroundColor: 'rgba(216, 24, 24, 0.698)',
        borderRadius: 5,
        color: 'white'
    },

}

export default GlobalStyles