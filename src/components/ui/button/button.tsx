import styles from './button.module.css';
import classNames from 'classnames/bind';

const cn = classNames.bind(styles);

type ButtonProps = {
  text: string;
  disabled?: boolean;
  handleClick?: () => void;
  extraClass?: string;
  type?: 'submit';
};

export const Button = ({
  text,
  disabled,
  handleClick,
  extraClass,
  type,
}: ButtonProps) => {
  return (
    <button
      className={cn('button', extraClass)}
      onClick={handleClick}
      disabled={disabled}
      type={type ?? 'button'}
    >
      {text}
    </button>
  );
};
