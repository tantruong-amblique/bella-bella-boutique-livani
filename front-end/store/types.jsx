//Types should be in const to avoid typos and duplication since it's a string and could be easily miss spelled
const TYPES = { 
    ADD_TO_CART: 'ADD_TO_CART',
    REMOVE_ITEM: 'REMOVE_ITEM',
    SUB_QUANTITY: 'SUB_QUANTITY',
    ADD_QUANTITY: 'ADD_QUANTITY',
    ADD_SHIPPING: 'ADD_SHIPPING',
    ADD_QUANTITY_WITH_NUMBER: 'ADD_QUANTITY_WITH_NUMBER',
    ORDER_FORM: 'ORDER_FORM',
    CHECKOUT_CHARGE: 'CHECKOUT_CHARGE',
    RESET_CART: 'RESET_CART',
    ADD_PRODUCTS: 'ADD_PRODUCTS',
    USRER_LOGIN: 'USRER_LOGIN',
    CHECK_USRER_LOGIN: 'CHECK_USRER_LOGIN',
    USRER_LOGOUT: 'USRER_LOGOUT'
}

export default TYPES