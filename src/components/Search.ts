import { Recipe } from "../models/recipe";
import { apiKey, baseURL, spinner, error } from "../utility";
import RecipePreview from "./RecipePreview";
import Store, { ActionType } from '../store';

type State =
{
    results: Recipe[]
    page: number,
    isLoading: boolean,
    err: Error | null
}

export default class Search
{

   

    searchForm:HTMLFormElement = document.querySelector<HTMLFormElement>('.search')!;
    resultsEl:HTMLDivElement = document.querySelector<HTMLDivElement>('.results')!;
    paginationEl:HTMLDivElement = document.querySelector<HTMLDivElement> ('.pagination')!;
    state:State = {
        results: [],
        page: 1,
        isLoading: false,
        err: null
    }
    constructor ()
    {
        this.searchForm.addEventListener ('submit', this.handleFormSubmit.bind (this))    
        this.resultsEl.addEventListener ('click', this.handleResultsClick.bind (this));
        this.paginationEl.addEventListener ('click', this.handlePaginationClick.bind (this));
    }

    handleFormSubmit (e:SubmitEvent)
    {
        e.preventDefault ();

        const formData = new FormData (e.target as HTMLFormElement);

        this.search (formData.get ('name') as string);
    }

    handleResultsClick ({target}: Event)
    {
        const recipePreview = (target as HTMLElement).closest<HTMLElement> ('.preview');

        if (recipePreview)
        {
            Store.dispatch ({type: ActionType.SetActiveId, payload: {id: recipePreview.dataset.id}});
            this.render ();
        }
    }

    handlePaginationClick ({target}: Event)
    {
        const paginationBtn = (target as HTMLElement).closest ('.pagination__btn');
        
        if (paginationBtn?.classList.contains ('pagination__btn--prev'))
            this.setPage (this.state.page - 1);
        else
            this.setPage (this.state.page + 1);
    }



    async search (name:string)
    {
        try{
            this.state.isLoading = true;
            this.render ();

            const res = await fetch (`${baseURL}?search=${name}&key=${apiKey}`);

            if (!res.ok)
                throw new Error ((await res.json ()).message || res.statusText);

            const json = await res.json ();

            this.setResults (json.data.recipes);
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

    setResults (results:Recipe[])
    {
        this.state.results = results;
        this.render ();
    }

    getCurrentPage () : Recipe[]
    {
        const endIndex = this.state.page * 10;
        const startIndex = endIndex - 10;
        return this.state.results.slice (startIndex, endIndex);
    }

    get totalPages () : number 
    {
        return Math.ceil (this.state.results.length / 10);
    }

    setPage (page:number) : void 
    {
        this.state.page = page;
        this.render();
    }

    render ()
    {
        if (this.state.isLoading)
        {
            this.resultsEl.innerHTML = spinner;
            return;
        }
        if (this.state.err)
        {
            this.resultsEl.innerHTML = error (this.state.err);
            return;
        }

        this.resultsEl.innerHTML = this.getCurrentPage ().map (recipe => RecipePreview(recipe)).join ('');
        
        this.paginationEl.innerHTML = '';
        if (this.state.page > 1)
        {   
            this.paginationEl.innerHTML += `<button class="btn--inline pagination__btn--prev pagination__btn">
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-left"></use>
            </svg>
            <span>Page ${this.state.page - 1}</span>
          </button>`
        }

        if (this.state.page < this.totalPages)
        {
            this.paginationEl.innerHTML += `<button class="btn--inline pagination__btn--next pagination__btn">
            <span>Page ${this.state.page + 1}</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </button>`
        }


    }



}