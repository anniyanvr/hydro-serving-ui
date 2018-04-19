import { ModelBuild } from '@shared/models/_index';
import { ModelBuildsActions, GET_MODEL_BUILDS_SUCCESS } from '@models/actions/_index';



const initialState: ModelBuild[] = [];

export function ModelBuildsReducer(state = initialState, action: ModelBuildsActions) {
    switch (action.type) {
        case GET_MODEL_BUILDS_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}
