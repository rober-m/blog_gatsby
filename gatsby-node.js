'use strict';

exports.createPages = require('./gatsby/create-pages');
exports.onCreateNode = require('./gatsby/on-create-node');

exports.sourceNodes = ({ actions }) => {
  actions.createTypes(`
      type Tag implements Node @dontInfer {
        id: ID!
        name: String!
      }
    `);
};
