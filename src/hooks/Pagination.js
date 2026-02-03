import React from 'react'
import styles from '../../styles/Home.module.css'
import { Button } from 'antd'


const Pagination = ({ items, pageSize, currentPage, onPageChange }) => {
  // const pagesCount = Math.ceil(items / pageSize);
  

  // console.log('====================================');
  // console.log(items);
  // console.log(pageSize);
  console.log(pageSize);
  
  // console.log('====================================');

  if (pageSize === 0) return null
  const pages = Array.from({ length: pageSize }, (_, i) => i + 1)

  return (
    <>
      <div style={{ backgroundColor : '#fff', display:'flex', justifyContent : 'center' }}>
      {
        items > 10 
        &&
        (
          <>
          <ul className={styles.pagination}>
          {pages.map(page => (
            
            <>
         
              <li
                key={page}
                style={{ padding:'3px' }}
              >
                <Button
                className="custom-button"
                style={{ 
                  background : `${currentPage + 1 === page ? '#5F63F2' : '#fff'}`,
                  color : `${currentPage + 1 === page ? '#fff' : '#201E1E'}`
                }}
 
                  size="sm"
                  onClick={() => onPageChange(page)}
                  _hover={false}
                >
                  {page}
                </Button>
              </li>
            
            </>
          ))}
        </ul>
     
          </>
        )
      }
       
              {/* <div className="dt-pagination">
                <ul className="dt-pagination-ul">


                {pages.map(page => (
            
            <>
         
              <li
                key={page}
                className='dt-item'
              >
                <Button
                // className="custom-button"
                className="dt-link custom-button" 
                style={{ 
                  background : `${currentPage + 1 === page ? '#5F63F2' : '#fff'}`,
                  color : `${currentPage + 1 === page ? '#fff' : '#201E1E'}`
                }}
 
                  size="sm"
                  onClick={() => onPageChange(page)}
                  _hover={false}
                >
                  {page}
                </Button>
              </li>
            
            </>
          ))}

            
                </ul>
              </div> */}
        
      </div>
    </>
  )
}

export default Pagination
