import { Mongo } from "meteor/mongo";

// Create the collection
export const TasksCollection = new Mongo.Collection("tasks");