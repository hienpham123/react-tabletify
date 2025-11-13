import React from "react";
import '../styles/pagination.css';
interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    maxVisible?: number;
}
export declare const Pagination: React.FC<PaginationProps>;
export {};
//# sourceMappingURL=Pagination.d.ts.map