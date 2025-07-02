import React from "react";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const EmojiPicker = ({ showEmoji, input, setInput, onSelectEmoji }) => {
  if (!showEmoji) return null;

  return (
    <div className="absolute z-50">
      <Picker 
        data={data} 
        onEmojiSelect={(emoji) => {
          if (onSelectEmoji){
            onSelectEmoji(emoji.native);
          }
          else{
            setInput(input + emoji.native);
          }
        }} 
      />
    </div>
  );
};

export default EmojiPicker;