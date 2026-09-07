import type { CurrencyOption } from '../types';

function CurrencyFlagOption({ option }: { option: CurrencyOption }) {
  return (
    <span className="flex items-center gap-2">
      {option.flag ? (
        <img
          src={option.flag}
          alt={option.label}
          className="size-4 rounded-sm object-cover"
        />
      ) : null}
      <span>{option.label}</span>
    </span>
  );
}

export { CurrencyFlagOption };
