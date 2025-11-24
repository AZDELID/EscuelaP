import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from './ui/pagination';

interface SmartPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function SmartPagination({ currentPage, totalItems, itemsPerPage, onPageChange }: SmartPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-gray-600">
        Mostrando {startIndex + 1} - {endIndex} de {totalItems}
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
          
          {/* Primera página */}
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(1)}
                isActive={false}
                className="cursor-pointer"
              >
                1
              </PaginationLink>
            </PaginationItem>
          )}
          
          {/* Ellipsis si hay páginas en el medio */}
          {currentPage > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          
          {/* Página anterior a la actual */}
          {currentPage > 2 && (
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(currentPage - 1)}
                isActive={false}
                className="cursor-pointer"
              >
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          
          {/* Página actual */}
          <PaginationItem>
            <PaginationLink
              isActive={true}
              className="cursor-pointer"
            >
              {currentPage}
            </PaginationLink>
          </PaginationItem>
          
          {/* Página siguiente a la actual */}
          {currentPage < totalPages - 1 && (
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(currentPage + 1)}
                isActive={false}
                className="cursor-pointer"
              >
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          
          {/* Ellipsis si hay páginas en el medio */}
          {currentPage < totalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          
          {/* Última página */}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(totalPages)}
                isActive={false}
                className="cursor-pointer"
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}
          
          <PaginationNext
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationContent>
      </Pagination>
    </div>
  );
}