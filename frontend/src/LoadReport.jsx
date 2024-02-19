import React from "react";
import myText from "./control/uploads/output.txt?raw";
import keywords from "./control/keywords.csv?raw";
import { useAnnotation } from './AnnotationContext';
import './LoadReportStyles.css'

export default function LoadReport() {
  window.globalNumber = 0;
  const {setAnnotation} = useAnnotation();
  const lines = myText.split('\n');
  const words = keywords.replaceAll("'", "").replaceAll('"', "").split("~");

  // Adjusted styles for the container
  const containerStyle = {
    fontSize: '20px', // Increase font size for better readability
    width: 'auto', // Use most of the webpage width
    maxWidth: '80%', // Ensure some margin remains
    minHeight: '120vh', // Minimum height to encourage scrolling
    margin: '0 auto', // Center the container horizontally
    display: 'flex', // Use flexbox
    flexDirection: 'column', // Stack children vertically
    alignItems: 'center', // Center children horizontally
    // justifyContent: 'center', // Center children vertically
    overflowY: 'auto', // Show scrollbar when content overflows
    padding: '30px', // Add some padding around the content
  };

  // Inner div to align text left
  const innerTextStyle = {
    textAlign: 'left', // Align text to the left
  };

  return (
    <div style={containerStyle} className="flex-col leading-loose">
        <div style={innerTextStyle}>
            {lines.map((line, lineIndex) => (
                <p key={lineIndex}>
                    {highlightWordsInLine(line, words, setAnnotation, words)}
                </p>
            ))}
        </div>
    </div>
  );
}


function highlightWordsInLine(line, keywords, setAnnotation, word_arr) {
  let elements = [];
  let lastIndex = 0; // Track the index of the char of the string we are at

  keywords.forEach((keyword, index) => {
      if (index % 2 === 0) {
          const regex = new RegExp(`(${keyword})`, 'gi');
          let match;

          while ((match = regex.exec(line)) !== null) {
              // Add text before the matched keyword
              if (match.index > lastIndex) {
                  elements.push(<span key={`text-${lastIndex}`}>{line.substring(lastIndex, match.index)}</span>);
              }
              // Add the keyword wrapped in a mark and button, change onClick to onMouseEnter and add onMouseLeave
              elements.push(
                <mark key={`mark-${index}-${window.globalNumber}`} className="highlight">
                  <button
                    id={`${index}`}
                    name={`${window.globalNumber}`}
                    onMouseEnter={(event) => showExplanation(event, index, setAnnotation, word_arr)}
                    onMouseLeave={() => hideExplanation(setAnnotation)}>
                    {match[0]}
                  </button>
                </mark>
              );
              
              window.globalNumber++;
              lastIndex = match.index + match[0].length; // Update lastIndex to the end of the current match
          }
      }
  });

  // Add any remaining text after the last match
  if (lastIndex < line.length) {
      elements.push(<span key={`text-end`}>{line.substring(lastIndex)}</span>);
  }
  return <span>{elements}</span>;
}

function showExplanation(event, index, setAnnotation, word_arr) {
  // Clear existing timeout if any
  if (window.fadeTimeout) {
    clearTimeout(window.fadeTimeout);
  }

  // Start a new timeout
  window.fadeTimeout = setTimeout(() => {
    const element_rect = event.target.getBoundingClientRect();
    const new_position = {
      x: element_rect.left + window.scrollX - 2,
      y: element_rect.bottom + window.scrollY + 7
    };
    const content = word_arr[index + 1];
    setAnnotation(prevAnnotation => ({
      ...prevAnnotation,
      content: content,
      position: new_position,
      isVisible: true, // Now controlled with delay
    }));
  }, 150); // Delay of 150ms
}

function hideExplanation(setAnnotation) {
  // Clear the timeout if mouse leaves before the annotation is shown
  if (window.fadeTimeout) {
    clearTimeout(window.fadeTimeout);
  }

  setAnnotation(prevAnnotation => ({
    ...prevAnnotation,
    isVisible: false,
  }));
}
