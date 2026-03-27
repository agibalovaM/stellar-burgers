import { FC } from 'react';
import { ConstructorPageUI } from '@ui-pages';

import { useSelector } from '../../services/store';
import {
  selectIngredientsError,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';
import styles from './constructor-page.module.css';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  if (error) {
    return (
      <div className={`${styles.title} text text_type_main-medium pt-10`}>
        {error}
      </div>
    );
  }

  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};
