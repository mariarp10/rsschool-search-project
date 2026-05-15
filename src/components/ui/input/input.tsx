import React from 'react';

import styles from './input.module.css';

type TUIInputProps = {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export class UIInput extends React.Component<TUIInputProps> {
  render(): React.ReactNode {
    return (
      <input
        type="text"
        className={styles.input}
        placeholder={this.props.placeholder}
        onChange={this.props.onChange}
        onKeyDown={this.props.onKeyDown}
        value={this.props.value}
        id="search"
      />
    );
  }
}
