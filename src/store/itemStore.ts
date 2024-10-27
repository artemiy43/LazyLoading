import { makeAutoObservable } from "mobx";

export interface Item {
  id: number;
  package: {
    name: string;
    description: string;
    version: string;
    links: {
      homepage: string;
    };
  };
}

class UseItemStore {
  items: Item[] = [];

  constructor() {
    makeAutoObservable(this, {}, { deep: true });
  }

  deleteItem(id: number) {
    this.items = this.items.filter((el) => el.id !== id);
    for (let i = id; i < this.items.length; i++) {
      this.items[i].id = i;
    }
  }

  setItems(items: Item[]) {
    this.items = items;
  }

  //   editVersion(version: string, id: number) {
  //     const item = this.items.find((el) => el.id === id);
  //     item!.package.version = version;
  //   }
  //   editDescription(description: string, id: number) {
  //     const item = this.items.find((el) => el.id === id);
  //     item!.package.description = description;
  //   }
  //   editHomepage(homepage: string, id: number) {
  //     const item = this.items.find((el) => el.id === id);
  //     item!.package.links.homepage = homepage;
  //   }

  editItem({
    homepage,
    version,
    description,
    id,
  }: {
    homepage: string;
    version: string;
    description: string;
    id: number;
  }) {
    console.log(id);
    const item = this.items.find((el) => el.id === id);
    item!.package.links.homepage = homepage;
    item!.package.description = description;
    item!.package.version = version;
  }
}

export default new UseItemStore();
