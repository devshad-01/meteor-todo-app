import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TasksCollection } from './TasksCollection';
import SimpleSchema from 'simpl-schema';

Meteor.methods({
  async 'tasks.insert'(text) {
    check(text, String);
    
    if (!text.trim()) {
      throw new Meteor.Error('text-required', 'Task text is required');
    }
    
    const taskDoc = {
      text: text.trim(),
      createdAt: new Date(),
      isChecked: false,
    };
    
    try {
      return await TasksCollection.insertAsync(taskDoc);
    } catch (error) {
      throw new Meteor.Error('insert-failed', 'Failed to insert task: ' + error.message);
    }
  },
  
  async 'tasks.remove'(taskId) {
    check(taskId, String);
    
    try {
      return await TasksCollection.removeAsync(taskId);
    } catch (error) {
      throw new Meteor.Error('remove-failed', 'Failed to remove task: ' + error.message);
    }
  },
  
  async 'tasks.setIsChecked'(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);
    
    try {
      return await TasksCollection.updateAsync(taskId, {
        $set: { isChecked }
      });
    } catch (error) {
      throw new Meteor.Error('update-failed', 'Failed to update task: ' + error.message);
    }
  },

  async 'tasks.removeCompleted'() {
    try {
      return await TasksCollection.removeAsync({ isChecked: true });
    } catch (error) {
      throw new Meteor.Error('remove-completed-failed', 'Failed to remove completed tasks: ' + error.message);
    }
  },

  async 'tasks.updateText'(taskId, newText) {
    check(taskId, String);
    check(newText, String);

    if (!newText.trim()) {
      throw new Meteor.Error('text-required', 'Task text is required');
    }
    
    try {
      return await TasksCollection.updateAsync(taskId, {
        $set: { text: newText.trim() }
      });
    } catch (error) {
      throw new Meteor.Error('update-text-failed', 'Failed to update task text: ' + error.message);
    }
  }
});
