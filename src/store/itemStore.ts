import { makeAutoObservable } from "mobx";

export interface Item {
  id: number;
  name: string;
}

class UseItemStore {
  items: Item[] = [];

  constructor() {
    makeAutoObservable(this, {});
  }

  deleteItem(id: number) {
    this.items = this.items.filter((el) => el.id !== id);
  }

  addItem(item: Item) {
    this.items.push(item);
  }

  setItems(items: Item[]) {
    this.items = items;
  }

  //   editTask(newTask: Task) {
  //     const index = this.tasks.findIndex((el) => el.id === newTask.id);
  //     // const pizzaExist =
  //     //   this.tasks.find((item) => item?.id === newTask?.id) ?? -1;
  //     this.tasks.splice(index, 1, newTask);
  //   }
}

export default new UseItemStore();
