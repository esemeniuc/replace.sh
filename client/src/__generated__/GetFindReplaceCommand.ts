/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetFindReplaceCommand
// ====================================================

export interface GetFindReplaceCommand_getFindReplaceCommand {
  __typename: "FindReplaceCommand";
  find: string;
  replace: string;
  command: string;
  isGlobal: boolean;
  isInplace: boolean;
  shortcode: string;
}

export interface GetFindReplaceCommand {
  getFindReplaceCommand: GetFindReplaceCommand_getFindReplaceCommand | null;
}

export interface GetFindReplaceCommandVariables {
  shortcode: string;
}
