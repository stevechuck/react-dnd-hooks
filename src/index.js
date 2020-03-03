import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import DragItem from "./components/drag-item";
import DropItem from "./components/drop-item";
import { TreeNode } from "./components/tree-node/TreeNode"
import { Global } from './components/tree-node/styles'
import { DraggableList } from './components/spring-draggable-list/DraggableList'
import { MyDraggableList } from './components/my-draggable-list/MyDraggableList'

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
    state: "wip"
  },
  4: {
    text: "Fourth thing",
    state: "wip"
  }
};

const lists = {
  todo: ["1","2"],
  wip: ["3", "4"],
  done: []
};



function App() {
  const [todoValues, setValue] = useState(todos);
  const [list, setLists] = useState(lists);
  const [currentDraggedId, setCurrentDraggedId] = useState(null);

  const onDragStart = (draggedId) => {
    setCurrentDraggedId(draggedId);
  }

  const onDragOver = (id) => {
    const draggedOverItemParentListId = todoValues[id].state;
    const draggedOverItemIndex = list[draggedOverItemParentListId].indexOf(id);

    const draggedItemParentListId = todoValues[currentDraggedId].state;

    // if the item is dragged over itself, ignore
    if (currentDraggedId == id || draggedItemParentListId != draggedOverItemParentListId) {
      return;
    }
    // filter out the currently dragged item
    let items = list[draggedOverItemParentListId].filter(item => item != currentDraggedId);
    
    // add the dragged item after the dragged over item
    items.splice(draggedOverItemIndex, 0, currentDraggedId);
    setLists(lists => ({
      ...lists,
      [draggedOverItemParentListId]: items
    }));
  };

  const onDroppableDragOver = useCallback((listId) => {
    const currentDraggedItem = { ...todoValues[currentDraggedId] };
    const previousState = currentDraggedItem.state; 
    // console.log(previousState == listId);
    if (previousState == listId) return;

    let previousList = list[currentDraggedItem.state];
    const indexInList = previousList.indexOf(currentDraggedId);
    if (indexInList > -1) {
      previousList.splice(indexInList, 1);
    }
    currentDraggedItem.state = listId;
    const currentList = list[currentDraggedItem.state];
    currentList.push(currentDraggedId);
    setValue({ ...todoValues, [currentDraggedId]: currentDraggedItem });
    setLists({ ...list, [previousState]: previousList, [currentDraggedItem.state]: currentList} );
  }, [todoValues, list, currentDraggedId])

  const onDrop = () => {
    setValue({ ...todoValues});
    setCurrentDraggedId(null);
  }
  
  const onSpringDragOver = (listId) => {
    // console.log(list);
    // console.log(todoValues);
    const currentDraggedItem = { ...todoValues[currentDraggedId] };
    const previousState = currentDraggedItem.state; 
    // console.log(previousState == listId);
    if (previousState == listId || currentDraggedId == null) return;

    let previousList = list[currentDraggedItem.state];
    const indexInList = previousList.indexOf(currentDraggedId);
    if (indexInList > -1) {
      previousList.splice(indexInList, 1);
    }
    currentDraggedItem.state = listId;
    const currentList = list[currentDraggedItem.state];
    currentList.push(currentDraggedId);
    setValue({ ...todoValues, [currentDraggedId]: currentDraggedItem });
    setLists({ ...list, [previousState]: previousList, [currentDraggedItem.state]: currentList} );
  };

  const onDragStateChanged = (draggedId) => {
    setCurrentDraggedId(draggedId);
  }

  return (
    <div className="App">
      <div className="box">
        <DropItem heading="Todo" onDragOver={() => {onDroppableDragOver("todo")}} onDrop={onDrop}>
        { renderDragItems(list["todo"], todoValues, onDragStart, onDragOver) }
        </DropItem>
        <DropItem heading="WIP" onDragOver={() => {onDroppableDragOver("wip")}} onDrop={onDrop}>
          { renderDragItems(list["wip"], todoValues, onDragStart, onDragOver) }
        </DropItem>
        <DropItem heading="Done" onDragOver={() => {onDroppableDragOver("done")}} onDrop={onDrop}>
          { renderDragItems(list["done"], todoValues, onDragStart, onDragOver) }
        </DropItem>
      </div>
      <div style={{ "textAlign": "left", "marginTop":"2em"}}>
        <Global />
        <TreeNode name="main" defaultOpen>
          <TreeNode name="hello" />
          <TreeNode name="subtree with children">
            <TreeNode name="hello" />
            <TreeNode name="sub-subtree with children">
              <TreeNode name="child 1" style={{ color: '#37ceff' }} />
              <TreeNode name="child 2" style={{ color: '#37ceff' }} />
              <TreeNode name="child 3" style={{ color: '#37ceff' }} />
              <TreeNode name="custom content">
                <div style={{ position: 'relative', width: '100%', height: 200, padding: 10 }}>
                  <div style={{ width: '100%', height: '100%', background: 'black', borderRadius: 5 }} />
                </div>
              </TreeNode>
            </TreeNode>
            <TreeNode name="hello" />
          </TreeNode>
          <TreeNode name="world" />
          <TreeNode name={<span>🙀 something something</span>} />
        </TreeNode>
      </div>      
      {/* <div style={{border: "#fff 1px solid", width: "800px", zIndex: "5"}} onMouseOver={() => {console.log("HERE")}}>
          <span>TEST</span>
      </div> */}
      <div style={{ "display": "flex", "justifyContent": "start", "marginTop":"2em"}}>
        <DraggableList listId="todo" items={lists.todo} onDragEnter={onSpringDragOver} setDragItem={onDragStateChanged}/>
        <div><span>  Divider  </span></div>
        <DraggableList listId="wip" items={lists.wip} onDragEnter={onSpringDragOver} setDragItem={onDragStateChanged}/>
        {/* <MyDraggableList/> */}
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