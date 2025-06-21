// Spinner.js
import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-full min-h-[100px]">
      <span className="loading loading-dots loading-xs text-amber-400"></span>
<span className="loading loading-dots loading-sm text-amber-400"></span>
<span className="loading loading-dots loading-md text-amber-400"></span>
<span className="loading loading-dots loading-lg text-amber-400"></span>
<span className="loading loading-dots loading-xl text-amber-400"></span>
    </div>
  );
};

export default Spinner;