export interface IItem 
{
    id:string;
}

export interface IRecipe extends IItem {
    title:string;
    publisher:string;
    image_url:string;
    source_url:string;
    ingredients:IIngredient[];
    cooking_time:number;
    servings:number;
}

export interface IIngredient extends IItem
{
    description:string;
    quantity:number;
    unit:string;
}

abstract class Item implements IItem
{
    id: string = '';
}

export class Recipe extends Item implements IRecipe
{
    title:string = '';
    publisher:string = ''
    image_url:string = ''
    source_url:string = ''
    ingredients:IIngredient[] = [];
    cooking_time:number = 0;
    servings:number = 0;
}