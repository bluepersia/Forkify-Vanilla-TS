import Bookmarks from './components/Bookmarks';
import RecipeComponent from './components/Recipe';
import Search from './components/Search';

class App 
{
    search:Search = new Search ();
    recipe:RecipeComponent = new RecipeComponent ();
    bookmarks:Bookmarks = new Bookmarks ();
}


new App ();