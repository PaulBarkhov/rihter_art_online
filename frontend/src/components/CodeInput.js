import React from 'react'

function CodeInput() {
    const [code, setCode] = React.useState([...Array(4)].map(() => ""))
    const inputs = React.useRef([])

    const sdf = () => {
        console.log(code)
    }

    return (
        <div className="d-flex flex-row justify-content-evenly">
            {code.map((num, index) => {
                return (
                    <input
                        // style={styles.codeInput}
                        className="col-2 rounded shadow-sm border border-2 text-center"
                        key={index}
                        value={num}
                        type='text'
                        inputMode='numeric'
                        maxLength='1'
                        autoFocus={index === 0}
                        onChange={e => {
                            const newCode = [...code]
                            newCode[index] = e.target.value
                            console.log(!!newCode[index])

                            setCode(newCode)
                            if (e.target.value && index < 3) inputs.current[index + 1].focus()

                            // if (!newCode[index] && index > 0) inputs.current[index - 1].focus()

                            if (e.target.value && index === 3) console.log(newCode)

                        }}
                        onKeyPress={e => {
                            console.log(e.key)
                        }}
                        ref={ref => inputs.current.push(ref)}
                    />
                )
            })}
        </div>
    )
}

export default CodeInput
