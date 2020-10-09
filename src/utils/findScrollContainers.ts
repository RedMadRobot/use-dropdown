export const findScrollContainers = (node: HTMLElement): Array<HTMLElement> => {
  const result: Array<HTMLElement> = [];

  if (node === null) {
    return result;
  }

  if (node === document.body) {
    return [document.body, ...result];
  }

  if (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth) {
    result.push(node);
  }

  return [
    ...result,
    ...findScrollContainers(node.parentElement),
  ]
}
