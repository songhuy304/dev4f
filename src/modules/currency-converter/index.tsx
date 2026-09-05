import { useCurrencies } from './hooks';

const CurrencyConverterPage = () => {
  const { data, isLoading } = useCurrencies();

  console.log(data);
  console.log(isLoading);

  return <div>CurrencyConverterPage</div>;
};

export { CurrencyConverterPage };
