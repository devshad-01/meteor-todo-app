import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker, useSubscribe } from 'meteor/react-meteor-data'; 
import { TasksCollection } from '/imports/api/TasksCollection';
import { Task } from './Task';

export const App = () => {
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'pending', or 'completed'

  // Subscribe to the appropriate publication based on filter
  const isLoading = useSubscribe(filter === 'pending' ? 'pendingTasks' : 
                               filter === 'completed' ? 'completedTasks' : 'tasks');

  // Get tasks based on the active filter
  const tasks = useTracker(() => {
    if (!isLoading()) {
      const query = filter === 'pending' ? { isChecked: false } :
                  filter === 'completed' ? { isChecked: true } : {};
      return TasksCollection.find(query, { sort: { createdAt: -1 } }).fetch();
    }
    return [];
  });

  // Count tasks for each category
  const pendingTasksCount = useTracker(() => 
    TasksCollection.find({ isChecked: false }).count()
  );
  const completedTasksCount = useTracker(() => 
    TasksCollection.find({ isChecked: true }).count()
  );

  // Loading state
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

  // Handle adding a new task
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    // Call the Meteor method to add the task
    Meteor.call('tasks.insert', newTask.trim(), (error) => {
      if (error) {
        console.error('Error adding task:', error);
        alert('Could not add task: ' + error.reason);
      }
    });
    
    setNewTask('');
  };
  
  // Handle removing all completed tasks
  const handleRemoveCompleted = () => {
    if (window.confirm('Are you sure you want to remove all completed tasks?')) {
      Meteor.call('tasks.removeCompleted', (error) => {
        if (error) {
          console.error('Error removing completed tasks:', error);
          alert('Could not remove completed tasks: ' + error.reason);
        }
      });
    }
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

      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
        {/* Filter tabs */}
        <div className="bg-gray-100 border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium ${filter === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              All ({pendingTasksCount + completedTasksCount})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 text-sm font-medium ${filter === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Pending ({pendingTasksCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 text-sm font-medium ${filter === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Completed ({completedTasksCount})
            </button>
          </nav>
        </div>

        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Your Tasks</h2>
            <p className="text-sm text-gray-500">You have {tasks.length} {filter !== 'all' ? filter : ''} tasks</p>
          </div>
          
          {completedTasksCount > 0 && (
            <button
              onClick={handleRemoveCompleted}
              className="px-3 py-1 text-xs text-red-600 hover:text-red-800 focus:outline-none"
            >
              Clear completed
            </button>
          )}
        </div>
        
        {tasks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <Task key={task._id} task={task} />
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p className="mb-2 text-sm">No {filter !== 'all' ? filter : ''} tasks yet</p>
            <p className="text-xs">{filter === 'all' || filter === 'pending' ? 'Add a new task to get started' : 'Complete some tasks to see them here'}</p>
          </div>
        )}
      </div>
    </div>
  );
};