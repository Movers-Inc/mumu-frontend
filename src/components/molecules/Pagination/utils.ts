type PaginationArray = number[][];

export function createPageGroup(
  currentPage: number,
  totalPage: number
): PaginationArray {
  const visiblePages = 3;
  const paginationArray: PaginationArray = [];

  if (totalPage <= visiblePages * 3) {
    paginationArray.push(Array.from({ length: totalPage }, (_, i) => i + 1));
  } else {
    const firstGroup = Array.from({ length: visiblePages }, (_, i) => i + 1);
    const lastGroup = Array.from(
      { length: visiblePages },
      (_, i) => totalPage - visiblePages + i + 1
    );

    if (currentPage <= visiblePages) {
      const middleGroup = Array.from(
        { length: visiblePages + 1 },
        (_, i) => currentPage + i
      );
      paginationArray.push(firstGroup, middleGroup, lastGroup);
    } else {
      const middleGroup = Array.from(
        { length: visiblePages },
        (_, i) => currentPage - 1 + i
      );
      paginationArray.push(firstGroup, middleGroup, lastGroup);
    }
  }

  for (let i = 0; i < paginationArray.length - 1; i++) {
    const leftArray = paginationArray[i];
    const rightArray = paginationArray[i + 1];
    const isConnected =
      leftArray[leftArray.length - 1] + 1 === rightArray[0] ||
      leftArray.some((page) => page === rightArray[0]);
    if (isConnected) {
      paginationArray[i] = [...leftArray, ...rightArray].filter(
        (page, index, array) => array.indexOf(page) === index
      );
      paginationArray.splice(i + 1, 1);
      i--;
    }
  }

  return paginationArray;
}
