import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { X } from 'react-bootstrap-icons'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const Cart = ({ showCartModal, setShowCartModal, }) => {
    const { user, header, cart, setCart, en, getPaymentLink } = useContext(AuthContext)

    const [loading, setLoading] = useState(false)

    const currency = cart[0] && cart[0].price_currency

    const handleBuy = () => {
        setLoading(true)

        getPaymentLink({
            lessonPacks: cart.map(cartItem => (({ id, name, price, course_name }) => ({ id, name, price, course_name }))(cartItem)),
            currency: currency
        })
            .then(res => window.open(res.data, '_blank', 'noopener,noreferrer'))
            .finally(() => setLoading(false))
    }

    return (
        <Modal show={showCartModal} onHide={() => setShowCartModal(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>{en ? 'Cart' : 'Корзина'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    cart.length === 0 ? <div className="d-flex justify-content-center align-items-center">{en ? 'Nothing here' : 'Тут пока пусто'}</div> :
                        <div className='text-end'>
                            {cart.map(cartItem =>
                                <div key={cartItem.id} className='d-flex flex-row justify-content-between align-items-end border rounded p-2 my-2'>
                                    <h4>
                                        {cartItem.course_name} {cartItem.name}
                                    </h4>
                                    <div>
                                        {cartItem.price} {en ? cartItem.price_currency : (cartItem.price_currency === 'RUB' ? '₽' : cartItem.price_currency)}
                                        <X
                                            size='20'
                                            color='red'
                                            onClick={() => setCart(prev => prev.filter(item => item.id !== cartItem.id))} />
                                    </div>
                                </div>
                            )}

                            <h4 className='mt-3'>
                                {en ? 'Total: ' : 'Итого: '}
                                {cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2) + ' '}
                                {en ? currency : (currency === 'RUB' ? '₽' : currency)}
                            </h4>

                        </div>

                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowCartModal(false)}>
                    {en ? 'Close' : 'Закрыть'}
                </Button>
                {!!cart.length && <Button variant="primary" onClick={handleBuy}>
                    {en ? 'Buy now' : 'Купить'}
                </Button>}
            </Modal.Footer>
        </Modal>
    )
}

export default Cart