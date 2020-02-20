import React, {useState, useCallback} from 'react';
import styled from 'styled-components';
import Droppable from './Droppable';

const DroppableManager = ({children}) => {
  const [state, setState] = useState({
    items: [
      {id:1, name:"Item 1", droppableId:1},
      {id:2, name:"Item 2", droppableId:1},
      {id:3, name:"Item 3", droppableId:2}
    ],
    currentDraggableId: null
  });

  const handleDragStartAcrossContainer = (draggableId) => {
    console.log('dragstart:',draggableId);
    setState(state => ({
      ...state,
      currentDraggableId: draggableId
    }));
  };

  const handleDrop = (droppableId) => {
    console.log("dropped:" + droppableId)
    // remove draggableId from draggableId.parent
    // add draggableId to droppableId.items 
    let items = state.items.filter((item) => {
        if (item.name == state.currentDraggableId) {
            item.droppableId = droppableId;
        }
        return item;
    });
    setState(state => ({
      ...state,
      items,
      draggableId: null
    }));
  };

  let categorizedItems = {
    1: [],
    2: []
  }
  state.items.forEach ((item) => {
    categorizedItems[item.droppableId].push(
        <div key={item.name} id={item.id}>
          {item.name}
        </div>
    );
  });

  return(
    <div style={{"display":"flex"}}>
      <Droppable 
        onDragStart={handleDragStartAcrossContainer}  
        onDrop={handleDrop}
      >
        {categorizedItems[1]}
      </Droppable>
      <Droppable 
        onDragStart={handleDragStartAcrossContainer}  
        onDrop={handleDrop}
      >
        {categorizedItems[2]}
      </Droppable>
    </div>
  )
	
  return (
    <Container>
      {items.map(index => {
        const isDragging = state.draggedIndex === index;
        const top = state.dragOrder.indexOf(index) * (HEIGHT + 10);
        const draggedTop = state.order.indexOf(index) * (HEIGHT + 10);
        return (
          <Draggable
            key={index}
            id={index}
            onDrag={handleDragWithinContainer}
            onDragEnd={handleDragEndWithinContainer}
          >
            <Rect
              isDragging={isDragging}
              top={isDragging ? draggedTop : top}
            >
             {index}
            </Rect>
          </Draggable>
        );
      })}
    </Container>
  );
};

export default DroppableManager;