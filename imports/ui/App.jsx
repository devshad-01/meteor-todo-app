import React, { useState } from 'react';
import { useTracker, useSubscribe } from 'meteor/react-meteor-data'; 
import { TasksCollection } from '/imports/api/TasksCollection';
import { Task } from './Task';

export const App = () => {

  const isLoading = useSubscribe("tasks");  
  const tasks = useTracker(() => TasksCollection.find({}).fetch());
  const [newTask, setNewTask] = useState('');

  if (isLoading()) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 mb-4 rounded-full border-4 border-t-blue-500 border-blue-200 animate-spin"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    // Here you would typically add the task to the database
    console.log('Add new task:', newTask);
    
    setNewTask('');
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Todo App</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-l-md"
          />
          <button
            type="submit"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Task
          </button>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your Tasks</h2>
          <p className="text-sm text-gray-500">You have {tasks.length} tasks</p>
        </div>
        
        {tasks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <Task key={task._id} task={task} />
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p className="mb-2 text-sm">No tasks yet</p>
            <p className="text-xs">Add a new task to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};