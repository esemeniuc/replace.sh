/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SendFax
// ====================================================

export interface SendFax_fax {
  __typename: "Order";
  /**
   * Price is in the format of numbers followed by 2 decimal places
   */
  id: string;
  numPages: number;
  cost: string;
}

export interface SendFax {
  /**
   * uploadTransactionId is created by getUploadTransactionId()
   * it is used for finding the uploaded files associated with this fax
   * returns null if phone number is invalid or txn id not found
   */
  fax: SendFax_fax | null;
}

export interface SendFaxVariables {
  to: string;
  uploadTransactionId: string;
}
