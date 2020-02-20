import React, {useState, useCallback} from 'react';
import styled from 'styled-components';
import Draggable from './Draggable';

const HEIGHT = 80;
const WIDTH = 300;

const Droppable = ({children, id, onDragStart, onDrop}) => {
  // const items = [11, 22, 33, 44, 55];
  let items = [];
  children.forEach(child => {
    items.push(child.props.id);
  });

  const [state, setState] = useState({
    order: items,
    dragOrder: items, // items order while dragging
    draggedIndex: null
  });
	
  const handleDragWithinContainer = useCallback(({translation, id}) => {
    const deltaY = Math.round(translation.y / HEIGHT);
    const deltaX = Math.round(translation.x / WIDTH); 
    const index = state.order.indexOf(id);
    const dragOrder = state.order.filter(index => index !== id);
    
    // make sure in range
    if ((index + deltaY) < 0 || (index + deltaY) >= items.length
        || deltaX <= -1 || deltaX >= 1) {
      onDragStart(id);
      return;
    }
      
    dragOrder.splice(index + deltaY, 0, id);
    
    setState(state => ({
      ...state,
      draggedIndex: id,
      dragOrder,
    }));
  }, [state.order, items.length]);
	
  const handleDragEndWithinContainer = useCallback(() => {
    setState(state => ({
      ...state,
      order: state.dragOrder,
      draggedIndex: null
    }));
  }, []);

  const handleDragOver = (e) => {
    console.log("dragOver");
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Container
      onDragOver={(e) => handleDragOver}
      onDrop={() => onDrop(id)}
      >
      {children.map((child) => {
        const isDragging = state.draggedIndex === child.props.id;
        const top = state.dragOrder.indexOf(child.props.id) * (HEIGHT + 10);
        const draggedTop = state.order.indexOf(child.props.id) * (HEIGHT + 10);
        return (
          <Draggable
            key={child.props.id}
            id={child.props.id}
            onDrag={handleDragWithinContainer}
            onDragEnd={handleDragEndWithinContainer}
          >
            <Rect
              isDragging={isDragging}
              top={isDragging ? draggedTop : top}
            >
             {child}
            </Rect>
          </Draggable>
        );
      })}
    </Container>
  );
	
  return (
    <Container
      onDragOver={handleDragOver}
      onDrop={() => onDrop(id)}
      >
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

export default Droppable;

const Container = styled.div`
  display: block;
  width: 100vw;
  max-height: 100vh;
`;

const Rect = styled.div.attrs(props => ({
  style: {
    transition: props.isDragging ? 'none' : 'all 500ms'
  }
}))`
  width: ${WIDTH}px;
  user-select: none;
  height: ${HEIGHT}px;
  background: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: ${({top}) => 100 + top}px;
  left: calc(50vw - 150px);
  font-size: 20px;
  color: #777;
`;