import React from 'react';

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#EEF2FF] to-[#E0E7FF] opacity-60 blur-3xl animate-blob-1" />
      <div className="absolute bottom-[-10%] right-[15%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#ECFDF5] to-[#E0E7FF] opacity-50 blur-3xl animate-blob-2" />
    </div>
  );
}
