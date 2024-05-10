import React from "react";

const LatestChangesCard = () => (
  <div className="mt-4 flex flex-col gap-y-2 rounded-sm border border-semantic-bg-line p-2">
    <h2 className="text-2xl font-bold">Latest Changes</h2>
    <div className="inline-block rounded-sm bg-blue-500 px-2 py-1 font-bold text-white">
      Tag
    </div>
    <p>Text goes here</p>
    <div className="inline-block rounded-sm bg-blue-500 px-2 py-1 font-bold text-white">
      Tag
    </div>
    <p>Text goes here</p>
  </div>
);

export default LatestChangesCard;
