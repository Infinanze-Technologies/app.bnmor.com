import { useRef } from 'react';

const useChartData = () => {
  const ref = useRef(null);
  
  return {
    ref
  };
};

export default useChartData;
