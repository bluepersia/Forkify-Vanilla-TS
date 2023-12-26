import { Recipe } from "../models/recipe";
import Store from '../store';

export default function RecipePreview ({id, image_url, title, publisher}:Recipe)
{
    return `<li class="preview" data-id=${id}>
    <a class="preview__link ${Store.getState ().activeId == id && 'preview__link--active'}" href="#23456">
      <figure class="preview__fig">
        <img src="${image_url}" alt="${title}" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${title}</h4>
        <p class="preview__publisher">${publisher}</p>
        <div class="preview__user-generated">
          <svg>
            <use href="src/img/icons.svg#icon-user"></use>
          </svg>
        </div>
      </div>
    </a>
  </li>`
}