import {SET_ERROR_STATE, SET_PROPERTY} from "./eventModalActions.js";

const eventModalReducer = (state, action) => {
	switch (action.type) {
		case SET_PROPERTY: {
			return {...state, [action.property]: action.value};
		}
		case SET_ERROR_STATE: {
			const errorState = state.errorState;

			Object.assign(errorState, {[action.property]: action.value});

			return {...state, errorState};
		}
		default: {
			console.error(action);
			throw new Error(`unexpected action.type: ${action.type}`);
		}
	}
};

export default eventModalReducer;
