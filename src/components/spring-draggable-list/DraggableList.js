// Original: https://github.com/chenglou/react-motion/tree/master/demos/demo8-draggable-list

import React, { useRef, useState, useEffect } from 'react'
import clamp from 'lodash-es/clamp'
import swap from 'lodash-move'
import { useGesture } from 'react-use-gesture'
import { useSprings, animated, interpolate } from 'react-spring'
import './styles.css'

// Returns fitting styles for dragged/idle items
const fn = (order, down, originalIndex, curIndex, x, y, isInsideContainer) => index =>
    down && index === originalIndex
    ? { x: x, y: curIndex * 100 + y, scale: 1.1, zIndex: '2', shadow: 15, immediate: n => n === 'y' || n === 'zIndex' }
    : { x: 0, y: order.indexOf(index) * 100, scale: 1, zIndex: '1', shadow: 1, immediate: false }

export function DraggableList({ listId, items, onDragEnter, setDragItem}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isInsideContainer, setIsInsideContainer] = useState(true);
  const order = useRef(items.map((_, index) => index)) // Store indicies as a local ref, this represents the item order
  const [springs, setSprings] = useSprings(items.length, fn(order.current)) // Create springs, each corresponds to an item, controlling its transform, scale, etc.

  const bind = useGesture(({ args: [originalIndex, itemId], down, delta: [x, y] }) => {
    const curIndex = order.current.indexOf(originalIndex)
    const curRow = clamp(Math.round((curIndex * 100 + y) / 100), 0, items.length - 1)
    const newOrder = swap(order.current, curIndex, curRow)

    setIsDragging(true);
    setDragItem(itemId);
    setSprings(fn(newOrder, down, originalIndex, curIndex, x, y, isInsideContainer)) // Feed springs new style data, they'll animate the view without causing a single render
    if (!down) {
      order.current = newOrder;
      setIsDragging(false);
      setDragItem(null);
    }
  })


  const handleItemLeave = () => {
    if (isDragging) {
      setIsInsideContainer(false);
    }
  }

  const handleItemEnter = () => {
    if (isDragging) {
      setIsInsideContainer(true);
    }
    onDragEnter(listId);
  }

  return (
    <div className="content" style={{ height: items.length * 100 }} 
      onMouseLeave={handleItemLeave}
      onMouseEnter={handleItemEnter}>
      {springs.map(({ zIndex, shadow, x, y, scale }, i) => (
        <animated.div
          {...bind(i, items[i])}
          key={i}
          style={{
            zIndex,
            boxShadow: shadow.interpolate(s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
            transform: interpolate([x, y, scale], (x, y, s) => `translate3d(${x}px,${y}px,0) scale(${s})`)
          }}
          children={items[i]}
        />
      ))}
    </div>
  )
}
