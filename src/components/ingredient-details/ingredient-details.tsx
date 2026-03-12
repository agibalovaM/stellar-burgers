import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import {
  selectIngredientById,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id = '' } = useParams();
  const ingredientData = useSelector(selectIngredientById(id));
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  if (isIngredientsLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return (
      <div className='text text_type_main-medium'>Ингредиент не найден</div>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
