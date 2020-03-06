import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import DragItem from "./components/drag-item";
import DropItem from "./components/drop-item";
import { TreeNode, LeafNode, ParentNode } from "./components/tree-node/TreeNode"
import { Global } from './components/tree-node/styles'
import { DraggableList } from './components/spring-draggable-list/DraggableList'
import { MyDraggableList } from './components/my-draggable-list/MyDraggableList'
import { useGesture } from 'react-use-gesture'
import { useTransition, animated, config } from 'react-spring'

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
    state: "wip"
  }
};

const listData = {
  todo: [{id: "1"}, {id: "2"}, {id: "3"}],
  wip: [{id: "4"}],
  done: []
};

const springList = {
  todo: ["1", "2", "3"],
  wip: ["4"],
  done: []
};

function renderDragItems(transition, todoValues, onDragStart, onDragOver) {
  return transition.map(({ item, props: { y, ...rest }, key }, index) => (
    <animated.div
      key={key}
      style={{
        transform: y.interpolate(y => `translate3d(0,${y}px,0)`),
        width: "100%",
        height: "100%",
        ...rest
      }}
    >
    <DragItem id={item.id} key={item.id} index={index}  onDragStart={onDragStart} onDragOver={onDragOver} >
      <div className="item">{todoValues[item.id].text}</div>
    </DragItem>
    </animated.div>
  ))
}

function renderLeafNodes(transition, todoValues, onDragStart, onDragOver) {
  return transition.map(({ item, props: { y, ...rest }, key }, index) => (
    <animated.div
      key={key}
      style={{
        transform: y.interpolate(y => `translate3d(0,${y}px,0)`),
        width: "100%",
        height: "100%",
        ...rest
      }}
    >
    <LeafNode 
      id={item.id} key={item.id} index={index}
      data={todoValues[item.id].text} 
      style={{ color: '#37ceff' }}  
      onDragStart={onDragStart} 
      onDragOver={onDragOver} />
    </animated.div>
  ))
}

function App() {
  const [todoValues, setValue] = useState(todos);
  const [list, setLists] = useState(listData);
  const [currentDraggedObject, setCurrentDraggedObject] = useState({id: null, ev: null});
  
  let height = 0
  let transitions = {};
  for (let [listId, listVal] of Object.entries(list)) {
    const transition = useTransition(
      listVal.map((data, i) => ({ ...data, y: (height += 3) - 3 })),
      d => d.id,
      {
        from: { opacity: 0 },
        leave: { height: 0, opacity: 0 },
        enter: ({ y }) => ({ y, opacity: 1 }),
        update: ({ y }) => ({ y })
      }
    );
    transitions[listId] = transition;
  }


  const onDragStart = (draggedId, ev) => {
    setCurrentDraggedObject({id: draggedId, ev: ev});
  }

  const onDragOver = (id) => {
    const draggedOverItemParentListId = todoValues[id].state;
    const draggedOverItemIndex = list[draggedOverItemParentListId].findIndex(item => item.id == id);

    const draggedItemParentListId = todoValues[currentDraggedObject.id].state;

    // if the item is dragged over itself, ignore
    if (currentDraggedObject.id == id || draggedItemParentListId != draggedOverItemParentListId) {
      return;
    } 
    // filter out the currently dragged item
    let items = list[draggedOverItemParentListId].filter(item => item.id != currentDraggedObject.id);
    // add the dragged item after the dragged over item
    items.splice(draggedOverItemIndex, 0, {id: currentDraggedObject.id});
    setLists(lists => ({
      ...lists,
      [draggedOverItemParentListId]: items
    }));
  };

  const onDroppableDragOver = useCallback((listId) => {
    const currentDraggedItem = { ...todoValues[currentDraggedObject.id] };
    const previousState = currentDraggedItem.state; 
    if (previousState == listId) return;

    let previousList = list[currentDraggedItem.state];
    const indexInList = previousList.findIndex(item => item.id == currentDraggedObject.id);
    if (indexInList > -1) {
      previousList.splice(indexInList, 1);
    }
    currentDraggedItem.state = listId;
    const currentList = list[currentDraggedItem.state];
    currentList.push({id: currentDraggedObject.id});
    setValue({ ...todoValues, [currentDraggedObject.id]: currentDraggedItem });
    setLists({ ...list, [previousState]: previousList, [currentDraggedItem.state]: currentList} );
    window.requestAnimationFrame(() => { currentDraggedObject.ev.target.style.visibility = "hidden"; });
  }, [todoValues, list, currentDraggedObject.id])

  const onDrop = () => {
    window.requestAnimationFrame(() => { currentDraggedObject.ev.target.style.visibility = "visible"; });
    setValue({ ...todoValues});
    setCurrentDraggedObject({id: null, ev: null});
  }

  return (
    <div className="App">
      <div className="box">
        <DropItem heading="Todo" 
          className="container"
          id="todo"
          onDragOver={onDroppableDragOver} 
          onDrop={onDrop}>
          { renderDragItems(transitions["todo"], todoValues, onDragStart, onDragOver) }
        </DropItem>
        <DropItem heading="WIP" 
          className="container"
          id="wip"
          onDragOver={onDroppableDragOver} 
          onDrop={onDrop}>
          { renderDragItems(transitions["wip"], todoValues, onDragStart, onDragOver) }
        </DropItem>
        <DropItem heading="Done" 
          className="container"
          id="done"
          onDragOver={onDroppableDragOver} 
          onDrop={onDrop}>
          { renderDragItems(transitions["done"], todoValues, onDragStart, onDragOver) }
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
        <ParentNode data="Todo" id="todo" onDroppableDragOver={onDroppableDragOver} onDrop={onDrop}>
          {/* <LeafNode data="child1" style={{ color: '#37ceff' }} id="4" onDragStart={onDragStart} onDragOver={onDragOver} /> */}
          { renderLeafNodes(transitions["todo"], todoValues, onDragStart, onDragOver) }
        </ParentNode>
        
      </div>      
      {/* <div style={{ "display": "flex", "justifyContent": "start", "marginTop":"2em"}}>
        <DraggableList listId="todo" items={springList.todo} onDragEnter={onSpringDragOver} setDragItem={onDragStateChanged}/>
        <div><span>  Divider  </span></div>
        <DraggableList listId="wip" items={springList.wip} onDragEnter={onSpringDragOver} setDragItem={onDragStateChanged}/>
      </div> */}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

// {/* {Object.keys(todoValues)
//             .map(key => ({ id: key, ...todoValues[key] }))
//             .filter(todo => todo.state === "todo")
//             .map(todo => <DragItem id={todo.id} data={todo} key={todo.id} />)} */}