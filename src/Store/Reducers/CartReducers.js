const initialState = {
    cartItems: [],
    wishListItems: [],
    itemsCount: 0

}

export default (state = initialState, action) => {
    console.log("state=initialState>>>>", state = initialState);
    console.log("action>>>>", action);
    console.log("state>>>>", state);
    if (action.type == "ADD_TO_CART") {
        return {
            ...state,
            cartItems: action.item,
        }
    }
    else if (action.type == "DELETE_ITEM") {
        let newCartItems = state.cartItems.filter(
            (item) => {
                return item.id != action.item
            }
        );
        let count = state.itemsCount - 1;
        return {
            ...state,
            itemsCount: count,
            cartItems: newCartItems,

        }

    }
    else if (action.type == "DECREASE_QUANTITY") {
        return {
            ...state,
            cartItems: state.cartItems.map(item => item.id === action.item ?
                { ...item, quantity: item.quantity - 1 } :
                item
            ),
        }
    }
    else if (action.type == "INCREASE_QUANTITY") {
        return {
            ...state,
            cartItems: state.cartItems.map(item => item.id === action.item ?
                { ...item, quantity: item.quantity + 1 } :
                item
            ),
        }
    }
    else if (action.type == "ADD_TO_WISH_LIST") {

        for (let i = 0; i < state.wishListItems.length; i++) {
            if (state.wishListItems[i].id == action.item.id) {

                return state;
            }
        }

        let updatedWishListItems = [...state.wishListItems, action.item];
        return {
            ...state,
            wishListItems: updatedWishListItems,

        }
    }
    else if (action.type == "DELETE_FROM_CART") {
        let newWishListItems = state.wishListItems.filter(
            (item) => {
                return item.id != action.item.id
            }
        );

        return {
            ...state,
            wishListItems: newWishListItems,

        }
    }
    else if (action.type == "ORDER_PLACED") {
        return {
            ...state,
            itemsCount: 0,
            cartItems: [],
        }
    }


    console.log('state>><<>', state);
    return state
}


