import React, { useState } from "react";
import { DeleteButton } from './DeleteButton';

export const Task = ({ task }) => {
  const [isChecked, setIsChecked] = useState(task.isChecked || false);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
    // Here you would typically update the task in the database
  };

  const handleDelete = () => {
    // Here you would typically delete the task from the database
    console.log('Delete task:', task._id);
  };

  return (
    <li className="py-3 flex items-center justify-between hover:bg-gray-50 px-2 transition-colors duration-150 rounded-md">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={toggleCheckbox}
          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-3"
        />
        <span className={`text-gray-700 ${isChecked ? 'line-through text-gray-400' : ''}`}>
          {task.text}
        </span>
      </div>
      <DeleteButton onClick={handleDelete} />
    </li>
  );
};