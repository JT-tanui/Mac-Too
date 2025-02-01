/**
 * @api {post} /api/contacts Create Contact
 * @apiName CreateContact
 * @apiGroup Contacts
 * @apiParam {String} name Name of the contact
 * @apiParam {String} email Email of the contact
 * @apiParam {String} message Message content
 * @apiSuccess {Object} contact Created contact
 */

/**
 * @api {post} /api/upload Upload File
 * @apiName UploadFile
 * @apiGroup Files
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {File} file File to upload
 * @apiSuccess {Object} file Uploaded file details
 */