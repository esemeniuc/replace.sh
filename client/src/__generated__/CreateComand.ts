/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateComand
// ====================================================

export interface CreateComand_createCommand {
  __typename: "FindReplaceCommand";
  command: string;
  shortcode: string;
}

export interface CreateComand {
  createCommand: CreateComand_createCommand;
}

export interface CreateComandVariables {
  find: string;
  replace: string;
}
