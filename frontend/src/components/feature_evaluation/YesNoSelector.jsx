import React from 'react';

const YesNoSelector = ({ selected, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-3">

      <button
        onClick={() => onChange('yes')}
        className={`h-[64px] rounded-lg border flex flex-col items-center justify-center gap-1
        ${selected === 'yes'
          ? 'border-[#2563EB] bg-[#EAF1FF]'
          : 'border-gray-200 bg-gray-100'}`}
      >
        <img src="/yes_icon.png" className="w-4 h-4 brightness-0" />
        <span className="text-[11px] font-bold text-black">
          Yes
        </span>
      </button>

      <button
        onClick={() => onChange('no')}
        className={`h-[64px] rounded-lg border flex flex-col items-center justify-center gap-1
        ${selected === 'no'
          ? 'border-red-500 bg-red-50'
          : 'border-gray-200 bg-gray-100'}`}
      >
        <img src="/no_icon.png" className="w-4 h-4 brightness-0" />
        <span className="text-[11px] font-bold text-black">
          No
        </span>
      </button>

    </div>
  );
};

export default YesNoSelector;