// export const DEBUG_MANUAL = true;
export const DEBUG_MANUAL = false;
export const DEBUG = process.env.NODE_ENV === 'production' ? false : DEBUG_MANUAL; //don't use debug in prod

export const BACKEND_ROOT_URL = process.env.NODE_ENV === 'production' ? "https://faxtail.com" : "http://localhost:8001";
export const GRAPHQL_ENDPOINT = `${BACKEND_ROOT_URL}/graphql`;
export const VIEW_FRC_ENDPOINT = `${BACKEND_ROOT_URL}/r`;
