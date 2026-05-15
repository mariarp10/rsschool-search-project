import React from 'react';
import { UIButton } from '@ui/button';
import styles from './pagination.module.css';

type TUIPaginationProps = {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
};

export class UIPagination extends React.Component<TUIPaginationProps> {
  render(): React.ReactNode {
    return (
      <div role="navigation" className={styles.container}>
        <UIButton
          text="Previous"
          handleClick={this.props.handlePreviousPage}
          disabled={this.props.isLoading || this.props.currentPage === 1}
        />
        <span>
          Page {this.props.currentPage} of {this.props.totalPages}
        </span>
        <UIButton
          text="Next"
          handleClick={this.props.handleNextPage}
          disabled={this.props.isLoading || this.props.currentPage === this.props.totalPages}
        />
      </div>
    );
  }
}
