import React from "react";

const NewCollectionPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{background:'#061f1c'}}>
      <div className="bg-[#f5f5dc] rounded-3xl shadow-2xl p-16 flex flex-col md:flex-row items-center gap-8 max-w-2xl w-full">
        <div className="text-4xl md:text-5xl font-bold text-[#061f1c] text-center md:text-left">New Collection is yet to be launched</div>
        <div className="text-4xl md:text-5xl font-bold text-lime-500 ml-0 md:ml-8 text-center md:text-left">Soon...</div>
      </div>
    </div>
  );
};

export default NewCollectionPage; 