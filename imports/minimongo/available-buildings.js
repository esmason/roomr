import { Mongo } from 'meteor/mongo';

export const availableBuildings = new Mongo.Collection('available-buildings');
