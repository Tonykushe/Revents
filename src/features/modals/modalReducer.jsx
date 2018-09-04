import { MODAL_OPEN, MODAL_CLOSE } from "./modalConstants";


const initialState = null;

const modalReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case MODAL_OPEN:
            return {
                modalType: action.payload.modalType, 
                modalProps: action.payload.modalProps
            }
        
        case MODAL_CLOSE:
            return null
        default:
            return state
    }
}

export default modalReducer

