import { useState, useEffect } from "react";
import itemStore from "./store/itemStore";
import { observer } from "mobx-react";
import "./App.css";

const App = observer(() => {
  const [from, setFrom] = useState(0);
  const [fetching, setFetching] = useState(true);
  useEffect(() => {
    if (fetching) {
      fetch(`https://api.npms.io/v2/search?q=react&from=${from}&size=15`)
        .then((res) => res.json())
        .then((data) => {
          itemStore.setItems([...itemStore.items, ...data.results]);
          setFrom((prev) => prev + 15);
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [fetching]);

  useEffect(() => {
    document.addEventListener("scroll", scrollHandler);
    return function () {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const scrollHandler = (e) => {
    if (
      e.target.documentElement.scrollHeight -
        (e.target.documentElement.scrollTop + window.innerHeight) <
      100
    ) {
      setFetching(true);
    }
  };

  return (
    <div>
      <ul className="itemList">
        {itemStore.items.map((el, index) => {
          return (
            <li className="item" key={index}>
              {el.package.name + " " + index}
            </li>
          );
        })}
      </ul>
    </div>
  );
});

export default App;
