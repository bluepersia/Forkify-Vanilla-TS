import { Recipe } from "../models/recipe"
import Store, {State as StoreState, Action, ActionType} from "../store"
import { baseURL, error, spinner } from "../utility"

type State =  
{
    isLoading: boolean
    err: Error | null
    recipe: Recipe | null
}

export default class RecipeComponent 
{
    recipeEl:HTMLDivElement = document.querySelector<HTMLDivElement>('.recipe')!

    constructor ()
    {
        Store.onChange.push (this.handleStoreChange.bind (this));
        this.recipeEl.addEventListener ('click', this.handleRecipeClick.bind (this));
    }
    
    state:State = {
        isLoading: false,
        err: null,
        recipe: null
    }


    handleStoreChange (prevState:StoreState, currState:StoreState, action:Action) : void
    {
        if (prevState.activeId != currState.activeId)
            this.fetchRecipe (currState.activeId);
    }

    handleRecipeClick ({target}:MouseEvent) : void
    {
        const t = target as HTMLElement;
        if (t.closest ('.bookmark-btn'))
            Store.dispatch ({type: ActionType.Bookmark, payload: {recipe: this.state.recipe}});
        else
        if (t.closest ('.btn--decrease-servings'))
            this.decreaseServings ();
        else if (t.closest ('.btn--increase-servings'))
            this.increaseServings ();
    }


    increaseServings () : void
    {
        if (this.state.recipe)
            this.setServings (this.state.recipe.servings + 1)
    }

    decreaseServings () : void
    {
        if (this.state.recipe)
            this.setServings (this.state.recipe.servings - 1)
    }

    setServings (newServings:number) : void
    {
        const {recipe} = this.state;

        if(recipe)
        {
            const multiplier = newServings / recipe.servings;
            const newRecipe = {
                ...recipe,
                cooking_time: recipe.cooking_time * multiplier,
                ingredients: recipe.ingredients.map (ing => ({...ing, quantity: ing.quantity * multiplier})),
                servings: newServings
            }
            this.setRecipe (newRecipe);
        }

    }

    setRecipe (recipe:Recipe) : void 
    {
        this.state.recipe = recipe;
        this.render ();
    }
    async fetchRecipe (id:string) : Promise<void>
    {
        try
        {
            this.state.isLoading = true;
            this.render ();

            const res = await fetch (`${baseURL}/${id}`);

            if (!res.ok)
                throw new Error ((await res.json()).message || res.statusText);

            const json = await res.json ();

            this.setRecipe (json.data.recipe);

        }
        catch (err)
        {
            this.state.err = err as Error;
        }
        finally 
        {
            this.state.isLoading = false;
            this.render ();
        }
    }

    render ()
    {
        if (this.state.isLoading)
        {
            this.recipeEl.innerHTML = spinner;
            return;
        }
        if (this.state.err)
        {
            this.recipeEl.innerHTML = error (this.state.err);
            return;
        }

        if (this.state.recipe)
        {
        const {title, publisher, image_url, cooking_time, servings, source_url, ingredients} = this.state.recipe;

            this.recipeEl.innerHTML = `<figure class="recipe__fig">
            <img src="${image_url}" alt="${title}" class="recipe__img" />
            <h1 class="recipe__title">
            <span>${title}</span>
            </h1>
        </figure>

        <div class="recipe__details">
            <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="src/img/icons.svg#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${cooking_time}</span>
            <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="src/img/icons.svg#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${servings}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
                ${servings > 1 ? `<button class="btn--tiny btn--decrease-servings">
                <svg>
                    <use href="src/img/icons.svg#icon-minus-circle"></use>
                </svg>
                </button>` : ''}
                ${servings < 8 ? `<button class="btn--tiny btn--increase-servings">
                <svg>
                    <use href="src/img/icons.svg#icon-plus-circle"></use>
                </svg>
                </button>` : ''}
            </div>
            </div>

            <div class="recipe__user-generated">
            <svg>
                <use href="src/img/icons.svg#icon-user"></use>
            </svg>
            </div>
            <button class="btn--round bookmark-btn">
            <svg class="">
                <use href="src/img/icons.svg#icon-bookmark-fill"></use>
            </svg>
            </button>
        </div>

        <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
            ${ingredients.map (({quantity, description, unit}) => `<li class="recipe__ingredient">
                <svg class="recipe__icon">
                <use href="src/img/icons.svg#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${quantity || ''}</div>
                <div class="recipe__description">
                <span class="recipe__unit">${unit}</span>
                ${description}
                </div>
            </li>`).join ('')}

            
            </ul>
        </div>

        <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${publisher}</span>. Please check out
            directions at their website.
            </p>
            <a
            class="btn--small recipe__btn"
            href="${source_url}"
            target="_blank"
            >
            <span>Directions</span>
            <svg class="search__icon">
                <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
            </a>
        </div>`
        }
    }
}