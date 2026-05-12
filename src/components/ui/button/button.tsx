import React from 'react';
import styles from './button.module.css';

type UIButtonProps = {
  text: string;
  disabled?: boolean;
  handleClick: () => void;
  extraClass?: string;
};
export class UIButton extends React.Component<UIButtonProps> {
  render(): React.ReactNode {
    return (
      <button
        className={`${styles.button} ${this.props.extraClass}`}
        onClick={this.props.handleClick}
        type="button"
        disabled={this.props.disabled}
      >
        {this.props.text}
      </button>
    );
  }
}
