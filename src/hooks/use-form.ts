import { ChangeEvent, useCallback, useRef, useState } from 'react';

type TFormValues = Record<string, string>;

export const useForm = <T extends TFormValues>(initialValues: T) => {
  const initialValuesRef = useRef(initialValues);
  const [values, setValues] = useState(initialValues);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setValues((prevState) => ({
      ...prevState,
      [name]: value
    }));
  }, []);

  const resetForm = useCallback((nextValues: T = initialValuesRef.current) => {
    setValues(nextValues);
  }, []);

  return {
    values,
    setValues,
    handleChange,
    resetForm
  };
};
