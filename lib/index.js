'use strict';

const path = require('path');
const processMultipart = require('./processMultipart');
const isEligibleRequest = require('./isEligibleRequest');
const { debugLog } = require('./utilities');

const DEFAULT_OPTIONS = {
  debug: false,
  uploadTimeout: 60000,
  fileHandler: false,
  uriDecodeFileNames: false,
  safeFileNames: false,
  preserveExtension: false,
  abortOnLimit: false,
  responseOnLimit: 'File size limit has been reached',
  limitHandler: false,
  createParentPath: false,
  parseNested: false,
  useTempFiles: false,
  tempFileDir: path.join(process.cwd(), 'tmp')
};

/**
 * Expose the file upload middleware
 * @param {Function} options - Middleware options, supplied on a per request basses
 * @returns {Function} - express-fileupload middleware.
 */
module.exports = (options) => {
  return (req, res, next) => {
    options(req, res, next).then(result => {
      const uploadOptions = Object.assign(DEFAULT_OPTIONS, result);

      if (!isEligibleRequest(req)) {
        debugLog(uploadOptions, 'Request is not eligible for file upload!');
        return next();
      }
      processMultipart(uploadOptions, req, res, next);
    })
  };
};
