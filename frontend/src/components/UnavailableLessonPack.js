import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { X } from 'react-bootstrap-icons'

const UnavailableLessonPack = ({ pack, index, selectedLessonPacks, selectLessonPack }) => {
    const { cart, setCart, deleteCartItem, en } = useContext(AuthContext)
    const [isInCart, setIsInCart] = useState(false)

    useEffect(() => {
        setIsInCart(!!cart.filter(item => item.ref.id === pack.id).length)
    }, [cart, pack])

    const handleDelete = () => {
        deleteCartItem(pack.id)
            .then(res => console.log(res))
        // setCart(prev => prev.filter(item => item.id !== pack.id))
        selectLessonPack(false, index)

    }

    return (
        <div key={pack.id} className="form-check">
            <input
                className="form-check-input mr-1"
                type="checkbox"
                name="lessonPack"
                checked={!!selectedLessonPacks[index] || isInCart}
                disabled={isInCart}
                id={pack.id}
                style={{ backgroundColor: isInCart && 'brown' }}
                onChange={e => {
                    if (index === 0) e.target.checked = true
                    selectLessonPack(e.target.checked, index)
                }}
            ></input>
            <label
                className="form-check-label"
                htmlFor={pack.id}
                onClick={() => { }}
            >
                {en ? 'Lessons' : 'Уроки'} {pack.name} {en ? 'for' : 'за'} {pack.price} {en ? pack.price_currency : (pack.price_currency === 'RUB' ? 'рублей' : pack.price_currency)} {isInCart && (en ? 'in cart' : 'в корзине')}
                {isInCart &&
                    <X
                        size='20'
                        color='red'
                        onClick={handleDelete} />
                }
            </label>
        </div>

    )
}

export default UnavailableLessonPack