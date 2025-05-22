import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { DeleteButton } from './DeleteButton';

export const Task = ({ task }) => {
  const [isChecked, setIsChecked] = useState(task.isChecked || false);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
    // Update the task in the database using Meteor method
    Meteor.call('tasks.setIsChecked', task._id, !isChecked, (error) => {
      if (error) {
        console.error('Error updating task:', error);
        setIsChecked(isChecked); // Revert UI state if the update fails
        alert('Could not update task: ' + error.reason);
      }
    });
  };

  const handleDelete = () => {
    // Delete the task from the database using Meteor method
    Meteor.call('tasks.remove', task._id, (error) => {
      if (error) {
        console.error('Error deleting task:', error);
        alert('Could not delete task: ' + error.reason);
      }
    });
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