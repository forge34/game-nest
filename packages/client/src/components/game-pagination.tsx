import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type GamePaginationProps = {
  currentPage: number;
  totalItems: number;
  limit:number;
  onPageChange: (page: number) => void;
};

function pages(current: number, total: number) {
  const delta = 2;
  const range: (number | "...")[] = [];
  let left = Math.max(2, current - delta);
  let right = Math.min(total - 1, current + delta);

  if (current - delta <= 2) left = 2;
  if (current + delta >= total - 1) right = total - 1;

  range.push(1);
  if (left > 2) range.push("...");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("...");
  if (total > 1) range.push(total);

  return range;
}

function GamePagination({
  currentPage,
  totalItems,
  limit,
  onPageChange,
}: GamePaginationProps) {
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const pageNumbers = pages(currentPage, totalPages);
  return (
    <Pagination className="my-4">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
          </PaginationItem>
        )}

        {pageNumbers.map((page, idx) => (
          <PaginationItem key={idx}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

export default GamePagination;
