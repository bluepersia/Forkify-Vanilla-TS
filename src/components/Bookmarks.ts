import { Recipe } from "../models/recipe";
import Store, { Action, ActionType, State as StoreState } from "../store";
import RecipePreview from "./RecipePreview";

export default class Bookmarks
{
    bookmarksEl:HTMLUListElement = document.querySelector<HTMLUListElement> ('.bookmarks__list')!;

    constructor ()
    {
        Store.onChange.push (this.handleStoreChange.bind (this));
        this.bookmarksEl.addEventListener ('click', this.handleBookmarkClick.bind (this))
    }

    handleStoreChange (prevState:StoreState, currState:StoreState, action:Action) : void
    {
        if (prevState.activeId != currState.activeId || prevState.bookmarks != currState.bookmarks)
            this.render ();
    }

    handleBookmarkClick ({target}:MouseEvent): void
    {
        const bm = (target as HTMLElement).closest<HTMLElement>('.preview');
        if (bm)
            Store.dispatch ({type: ActionType.SetActiveId, payload: {id: bm.dataset.id}})
    }

    render () : void
    {
        this.bookmarksEl.innerHTML = `<div class="message">
        <div>
          <svg>
            <use href="src/img/icons.svg#icon-smile"></use>
          </svg>
        </div>
        <p>
          No bookmarks yet. Find a nice recipe and bookmark it :)
        </p>
      </div>`
        const bookmarks = Store.getState ().bookmarks;

        if (bookmarks.length > 0)
            this.bookmarksEl.innerHTML = bookmarks.map ((bm:Recipe) => RecipePreview(bm)).join ('');
    }
}