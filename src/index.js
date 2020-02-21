import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import DragItem from "./components/drag-item";
import DropItem from "./components/drop-item";

import "./index.css";

const todos = {
  1: {
    text: "First thing",
    state: "todo"
  },
  2: {
    text: "Second thing",
    state: "todo"
  },
  3: {
    text: "Third thing",
    state: "todo"
  },
  4: {
    text: "Fourth thing",
    state: "todo"
  }
};

const lists = {
  todo: ["1","2", "3", "4"],
  wip: [],
  done: []
};

function App() {
  const [todoValues, setValue] = useState(todos);
  const [list, setLists] = useState(lists);
  const [currentDraggedId, setCurrentDraggedId] = useState(null);
  const currentDraggedIdRef = React.useRef();

  useEffect(() => {
    currentDraggedIdRef.current = currentDraggedId;
  }, [currentDraggedId]);

  const onDragStart = useCallback((draggedId) => {
    setCurrentDraggedId(draggedId);
  }, [currentDraggedId])

  const onDragOver = (id) => {
    const draggedOverItemParentListId = todoValues[id].state;
    const draggedOverItemIndex = list[draggedOverItemParentListId].indexOf(id)
    console.log(list[draggedOverItemParentListId]);

    const draggedItemId = currentDraggedIdRef.current;

    // if the item is dragged over itself, ignore
    if (draggedItemId == id) {
      return;
    }
    // filter out the currently dragged item
    let items = list[draggedOverItemParentListId].filter(item => item != draggedItemId);
    // console.log(items);
    
    // add the dragged item after the dragged over item
    items.splice(draggedOverItemIndex, 0, draggedItemId);
    // console.log(items);
    setLists(lists => ({
      ...lists,
      [draggedOverItemParentListId]: items
    }));
  }

  return (
    <div className="App">
      <div className="box">
        <DropItem
          heading="Todos"
          onDrop={(id) => {
            const currentTodo = { ...todoValues[id] };
            const previousState = currentTodo.state;
            if (previousState == "todo") return;
            let previousList = list[currentTodo.state];
            const indexInList = previousList.indexOf(id);
            if (indexInList > -1) {
              previousList.splice(indexInList, 1);
            }
            currentTodo.state = "todo";
            const currentList = list[currentTodo.state];
            currentList.push(id);
            setLists({ ...list, [previousState]: previousList, [currentTodo.state]: currentList} );
            setValue({ ...todoValues, ...{ [id]: currentTodo }});
            setCurrentDraggedId(null);
          }}
        >
          {list.todo.map((id, i) => {
            return <DragItem id={id} data={todoValues[id]} key={id} index={i} 
              onDragStart={onDragStart}
              onDragOver={onDragOver}/>
          })}
        </DropItem>
        <DropItem
          heading="WIP"
          onDrop={(id) => {
            const currentTodo = { ...todoValues[id] };
            let previousState = currentTodo.state;
            let previousList = list[currentTodo.state];
            if (previousState == "wip") return;
            let indexInList = previousList.indexOf(id);
            if (indexInList > -1) {
              previousList.splice(indexInList, 1);
            }
            currentTodo.state = "wip";
            const currentList = list[currentTodo.state];
            currentList.push(id);
            setLists({ ...list, [previousState]: previousList, [currentTodo.state]: currentList} );
            setValue({ ...todoValues, ...{ [id]: currentTodo }});
            setCurrentDraggedId(null);
          }}
        >
          {list.wip.map((id, i) => {
            return <DragItem id={id} data={todoValues[id]} key={id} index={i}/>
          })}
        </DropItem>
        <DropItem
          heading="Done"
          onDrop={(id) => {
            const currentTodo = { ...todoValues[id] };
            let previousState = currentTodo.state;
            if (previousState == "done") return;
            let previousList = list[currentTodo.state];
            let indexInList = previousList.indexOf(id);
            if (indexInList > -1) {
              previousList.splice(indexInList, 1);
            }
            currentTodo.state = "done";
            const currentList = list[currentTodo.state];
            currentList.push(id);
            setLists({ ...list, [previousState]: previousList, [currentTodo.state]: currentList} );
            setValue({ ...todoValues, ...{ [id]: currentTodo }});
            setCurrentDraggedId(null);
          }}
        >
          {list.done.map((id, i) => {
            return <DragItem id={id} data={todoValues[id]} key={id} index={i}/>
          })}
        </DropItem>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

// {/* {Object.keys(todoValues)
//             .map(key => ({ id: key, ...todoValues[key] }))
//             .filter(todo => todo.state === "todo")
//             .map(todo => <DragItem id={todo.id} data={todo} key={todo.id} />)} */}