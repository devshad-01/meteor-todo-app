import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { TasksCollection } from "./TasksCollection";

// Publish all tasks
Meteor.publish("tasks", function(filter = {}) {
  check(filter, Object);
  
  return TasksCollection.find(filter, {
    sort: { createdAt: -1 } // Sort by newest first
  });
});

// Publish pending tasks
Meteor.publish("pendingTasks", function() {
  return TasksCollection.find({ isChecked: false }, {
    sort: { createdAt: -1 }
  });
});

// Publish completed tasks
Meteor.publish("completedTasks", function() {
  return TasksCollection.find({ isChecked: true }, {
    sort: { createdAt: -1 }
  });
});