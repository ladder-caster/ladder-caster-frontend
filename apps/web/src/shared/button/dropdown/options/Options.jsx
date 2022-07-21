import { useKeys } from 'core/hooks/useKeys';
import React, { useMemo } from 'react';
import { _options } from './Options.styled';
import Option from './option/Option';

const Options = ({ options, selected, callback }) => {
  const options = useMemo(() => {
    if (!options || options.length == 0) return [];
    const keys = useKeys(options.length, options.length);
    return options.map((option, index) => {
      return (
        <Option
          key={keys[i]}
          label={option.label}
          icon={option.icon}
          callback={option.callback ?? callback}
          selected={selected === option}
        />
      );
    });
  }, [options]);
  return <_options>{options}</_options>;
};
export default Options;
