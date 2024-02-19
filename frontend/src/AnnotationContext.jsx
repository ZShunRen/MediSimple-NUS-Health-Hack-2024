import React, { createContext, useContext, useState } from 'react';

const AnnotationContext = createContext();

export const useAnnotation = () => useContext(AnnotationContext);

export const AnnotationProvider = ({ children }) => {
  const [annotation, setAnnotation] = useState({ isVisible: false, 
                                                content: '',
                                                position: { x: 0, y: 0 } });

  return (
    <AnnotationContext.Provider value={{ annotation, setAnnotation }}>
      {children}
    </AnnotationContext.Provider>
  );
};