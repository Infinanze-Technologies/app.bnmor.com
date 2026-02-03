import React from 'react'  
  const getPages = () => {
    const elements = [];
    for (let i = 1; i <= pages; i++) {
      elements.push(

        <li
        key={1}
        className={`dt-item ${activePage === i ? "active" : ""}`}
    >
        <a
        
            className="dt-link"

        >
         {i < 10 ? `0${i}` : i}
        </a>
    </li>

      );
    }
    return elements; 
  }
  
  export default getPages