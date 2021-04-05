import * as React from 'react';
import { Popover } from '../overlay/Popover';
import { useRef, useState } from 'react';
import { InputGroup } from './InputGroup';
import { TextInput } from './TextInput';
import { Menu } from '../menu/Menu';
import { MenuItem } from '../menu/MenuItem';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Box } from '../Box';
import { useTheme } from '../layout/ThemeProvider';

export const SearchSelect: React.FC<{
  onCreate?: (value: string) => void;
  options: Array<{ value: string, title: string, icon?: IconProp }>;
  onChange: (value: string) => void;
  value?: string;
  fill?: boolean;
}> = props => {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>();

  return (
    <Popover
      positions={['bottom', 'top']}
      fill={props.fill}
      trigger="manual"
      isOpen={open}
      onClickOutside={() => setOpen(false)}
      content={
        <Menu>
          {props.options
            .filter(option => !searchValue || option.title.toLowerCase().includes(searchValue.toLowerCase() ))
            .map(option => (
              <MenuItem
                key={option.value}
                text={option.title}
                icon={option.icon}
                onClick={() => {
                  setSearchValue(undefined);
                  props.onChange(option.value);
                  setOpen(false);
                }}
              />
            ))
          }

          {!!searchValue?.length && !!props.onCreate && (
            <MenuItem
              text={(
                <>
                  Create item{' '}
                  <Box as="span" color={theme.colors.text}>{searchValue}</Box>
                </>
              )}
              icon="plus"
              onClick={() => {
                props.onCreate?.(searchValue);
                setSearchValue(undefined);
                setOpen(false);
              }}
            />
          )}
        </Menu>
      }
    >
      <InputGroup>
        <TextInput
          onFocus={() => {
            setOpen(true);
            inputRef.current?.select();
          }}
          onBlur={() => {
            setTimeout(() => {
              setSearchValue(undefined);
              setOpen(false)
            }, 500);
          }}
          value={searchValue ?? props.options.find(o => o.value === props.value)?.title ?? props.value}
          onChangeValue={setSearchValue}
          ref={inputRef}
        />
      </InputGroup>
    </Popover>
  );
};
