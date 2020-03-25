/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateCommand
// ====================================================

export interface CreateCommand_createCommand {
  __typename: "FindReplaceCommand";
  command: string;
  shortcode: string;
}

export interface CreateCommand {
  createCommand: CreateCommand_createCommand;
}

export interface CreateCommandVariables {
  find: string;
  replace: string;
}
