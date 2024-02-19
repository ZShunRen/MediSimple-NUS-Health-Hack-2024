import React from 'react';
import { useAnnotation } from './AnnotationContext';

export default function AnnotationBox() {
  const { annotation } = useAnnotation();
  if (!annotation.isVisible) return null;

  // Set maximum dimensions
  const maxWidth = "300px"; // Maximum width
  const maxHeight = "450px"; // Maximum height

  const style = {
    fontSize: '18px', // Increase font size for better readability
    position: 'absolute',
    top: `${annotation.position.y}px`,
    left: `${annotation.position.x}px`,
    maxWidth: maxWidth,
    maxHeight: maxHeight,
    backgroundColor: "rgba(255,255,255)", // Opaque white background
    border: "1px solid black",
    borderRadius: "8px", // Rounded corners
    padding: "10px",
    boxSizing: "border-box",
    overflowY: "auto", // Scroll vertically if content overflows
    zIndex: 1000, // Ensure it's above other elements
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    whiteSpace: 'pre-wrap', // Ensures that the content wraps and respects newlines and spaces
    opacity: annotation.isVisible ? 1 : 0, // Control visibility through opacity
    transition: "opacity 150ms ease-in-out", // Apply transition effect
  };

  return(  
      <div style={style}>{annotation.content}</div>
  );
}
