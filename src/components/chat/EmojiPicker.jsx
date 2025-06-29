import React from "react";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const EmojiPicker = ({ showEmoji, input, setInput }) => {
  if (!showEmoji) return null;

  return (
    <div className="absolute z-50">
      <Picker 
        data={data} 
        onEmojiSelect={(emoji) => setInput(input + emoji.native)} 
      />
    </div>
  );
};

export default EmojiPicker;