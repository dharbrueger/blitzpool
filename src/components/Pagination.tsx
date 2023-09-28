import React from 'react';
import { usePagination, DOTS } from '../hooks/usePagination';

type PaginationProps = {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  className?: string;
}

const Pagination = (props: PaginationProps) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || !paginationRange?.length || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul
      className={`flex gap-2 pt-6 ${className ? className : ''}`}
    >
      <li
        className={`${currentPage === 1 ? 'text-slate-700' : ''}`}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onClick={currentPage !== 1 ? onPrevious : () => {}}
      >
        <i className="fa fa-arrow-left cursor-pointer" />
      </li>
      {paginationRange.map(pageNumber => {
        if (pageNumber === DOTS) {
          return <li key={pageNumber} className="select-none">&#8230;</li>;
        }

        return (
          <li
            key={pageNumber}
            className={`cursor-pointer select-none ${currentPage === pageNumber ? 'text-white' : 'text-slate-600'}`}
            onClick={() => onPageChange(pageNumber as number)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={`${currentPage === lastPage ? 'text-slate-600' : ''}`}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onClick={currentPage !== lastPage ? onNext : () => {}}
      >
        <i className="fa fa-arrow-right cursor-pointer" />
      </li>
    </ul>
  );
};

export default Pagination;