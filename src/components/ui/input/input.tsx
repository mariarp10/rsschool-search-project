import React from 'react';

import styles from './input.module.css';

type UIInputProps = {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

class UIInput extends React.Component<UIInputProps> {
  render() {
    return (
      <input
        className={styles.input}
        placeholder={this.props.placeholder}
        onChange={this.props.onChange}
        value={this.props.value}
      ></input>
    );
  }
}

export default UIInput;
