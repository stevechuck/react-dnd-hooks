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
  const listRef = React.useRef();
  const todoValuesRef = React.useRef();

  useEffect(() => {
    currentDraggedIdRef.current = currentDraggedId;
    listRef.current = list;
    todoValuesRef.current = todoValues;
  }, [currentDraggedId, list, todoValues]);

  const onDragStart = (draggedId) => {
    setCurrentDraggedId(draggedId);
  }

  const onDragOver = (id) => {
    const draggedOverItemParentListId = todoValuesRef.current[id].state;
    const draggedOverItemIndex = listRef.current[draggedOverItemParentListId].indexOf(id)

    const draggedItemId = currentDraggedIdRef.current;    
    const draggedItemParentListId = todoValuesRef.current[draggedItemId].state;


    // if the item is dragged over itself, ignore
    if (draggedItemId == id || draggedItemParentListId != draggedOverItemParentListId) {
      return;
    }
    // filter out the currently dragged item
    let items = listRef.current[draggedOverItemParentListId].filter(item => item != draggedItemId);
    
    // add the dragged item after the dragged over item
    items.splice(draggedOverItemIndex, 0, draggedItemId);
    setLists(lists => ({
      ...lists,
      [draggedOverItemParentListId]: items
    }));
  };

  const onDrop = (listId, droppedItemId) => {
    const currentTodo = { ...todoValues[droppedItemId] };
    const previousState = currentTodo.state;
    if (previousState == listId) return;

    let previousList = list[currentTodo.state];
    const indexInList = previousList.indexOf(droppedItemId);
    if (indexInList > -1) {
      previousList.splice(indexInList, 1);
    }
    currentTodo.state = listId;
    const currentList = list[currentTodo.state];
    currentList.push(droppedItemId);
    setLists({ ...list, [previousState]: previousList, [currentTodo.state]: currentList} );
    setValue({ ...todoValues, ...{ [droppedItemId]: currentTodo }});
    setCurrentDraggedId(null);
  }

  return (
    <div className="App">
      <div className="box">
          <DropItem
          onDrop={(id) => {onDrop("todo", id)}}
        >
        { renderDragItems(list["todo"], todoValues, onDragStart, onDragOver) }
        </DropItem>
        <DropItem
          onDrop={(id) => {onDrop("wip", id)}}
        >
          { renderDragItems(list["wip"], todoValues, onDragStart, onDragOver) }
        </DropItem>
        <DropItem
          heading="Done"
          onDrop={(id) => {onDrop("done", id)}}
        >
          { renderDragItems(list["done"], todoValues, onDragStart, onDragOver) }
        </DropItem>
      </div>
    </div>
  );
}

function renderDragItems(list, todoValues, onDragStart, onDragOver) {
  return list.map((id, i) => {
    return <DragItem id={id} data={todoValues[id]} key={id} index={i} 
      onDragStart={onDragStart}
      onDragOver={onDragOver}
  />
  });
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

// {/* {Object.keys(todoValues)
//             .map(key => ({ id: key, ...todoValues[key] }))
//             .filter(todo => todo.state === "todo")
//             .map(todo => <DragItem id={todo.id} data={todo} key={todo.id} />)} */}