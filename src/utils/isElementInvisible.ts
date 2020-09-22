export const isElementInvisible = (element: HTMLElement, parents: Array<HTMLElement>) => {
  const rect = element.getBoundingClientRect();

  return parents.some((parent, index) => {
    const parentRect = parent.getBoundingClientRect();

    return (
      rect.bottom < parentRect.top
    );
  });
};
