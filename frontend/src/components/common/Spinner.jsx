import React from 'react';

const Spinner = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} border-2 border-royal-400 border-t-transparent rounded-full animate-spin`} />
      {text && <p className="text-slate-400 text-sm font-body">{text}</p>}
    </div>
  );
};

export const PageLoader = ({ text = 'Loading...' }) => (
  <div className="min-h-[400px] flex items-center justify-center">
    <Spinner size="lg" text={text} />
  </div>
);

export default Spinner;
