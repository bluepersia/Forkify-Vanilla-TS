export const baseURL = `https://forkify-api.herokuapp.com/api/v2/recipes`;
export const apiKey = "5ab39a09-ec0a-472d-a782-b995061e8853"
export const spinner = `
<div class="spinner">
    <svg>
    <use href="src/img/icons.svg#icon-loader"></use>
    </svg>
</div> `

export function error (err:Error){
return `
<div class="error">
<div>
  <svg>
    <use href="src/img/icons.svg#icon-alert-triangle"></use>
  </svg>
</div>
<p>${err.message}</p>
</div>`
};