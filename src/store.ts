import { Recipe } from "./models/recipe";

export type Action =
{
    type:ActionType,
    payload: any
}

export type State =
{
    bookmarks: Recipe[];
    activeId: string;
}

export type Store =
{
    dispatch: Function,
    getState: Function,
    onChange: Function[]
}
function createStore ()
{
    let state = initialState;

    const store:Store= {

        dispatch: (action:Action) =>
        {
            const prevState = state;
            state = reducer (state, action);
            onChange (prevState, state, action);
        },
        getState: () => state,
        onChange: []
    
    }
    return store;
}


const initialState:State = 
{
    bookmarks:[],
    activeId: ''
}


export enum ActionType 
{
    SetActiveId,
    Bookmark
}

function reducer (state:State, {type, payload}:Action)
{
    switch (type)
    {
        case ActionType.SetActiveId:
            return {...state, activeId: payload.id}
            break;
        case ActionType.Bookmark:
            if (state.bookmarks.find (bm => bm.id == payload.recipe.id))
                return {...state, bookmarks: state.bookmarks.filter (bm => bm.id != payload.recipe.id)}

            return {...state, bookmarks: [...state.bookmarks, payload.recipe]};
        break; 
        default:
            return state;
            break;
    }
}

const store = createStore ();


function onChange (prevState:State, state:State, action:Action)
{
    store.onChange.forEach ((cb:Function) => cb (prevState, state, action));
}


export default store;