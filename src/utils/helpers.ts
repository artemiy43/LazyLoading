import { Item } from "../store/itemStore";
export function modify(arr: Item[]) {
  //console.log(arr);
  const arrNew = arr.map((item: Item, index: number) => {
    return { ...item, id: index };
  });
  return arrNew;
}
