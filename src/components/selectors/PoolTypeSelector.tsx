import React from 'react';
import CustomSelect from "./CustomSelect";
import { api } from "~/utils/api";

type PoolTypeSelectorProps = {
  onChange?: (value: string) => void;
  className?: string;
  optionsClassName?: string;
};
type PoolType = {
  id: string;
  name: string;
};

const PoolTypeSelector = React.forwardRef<HTMLSelectElement, PoolTypeSelectorProps>((props, ref) => {
  const poolTypes = api.poolTypes.list.useQuery().data;

  const options = poolTypes?.map((poolType: PoolType) => ({
    value: poolType.id,
    label: poolType.name,
  }));

  return (
    <CustomSelect
      options={options ?? []}
      defaultOption={options ? options[0] : undefined}
      onChange={props.onChange}
      className={props.className}
      optionsClassName={props.optionsClassName}
      ref={ref}
    />
  );
});

PoolTypeSelector.displayName = 'PoolTypeSelector';

export default PoolTypeSelector;
