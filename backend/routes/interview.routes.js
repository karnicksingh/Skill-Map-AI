 const express= require("express");
 const interviewRouter= express.Router();
 const {verifyToken}= require("../middleware/auth.middleware.js");
 const {upload}= require("../middleware/file.middleware.js");
 const {interviewReportGeneratorController}= require("../controllers/interview.controller.js");
 const {interviewReportFetchByIdController}= require("../controllers/interview.controller.js");
 const {getInterviewReportByIdController}= require("../controllers/interview.controller.js");


 /**
  * @route post /api/interview
  */

 interviewRouter.post("/",verifyToken,upload.single("resume"),interviewReportGeneratorController);

 /**
  * @route get /api/report/interview/:interviewId
  * @description This route is responsible for fetching the interview report based on the interviewId provided by the user. It uses the interviewReportGenerator service to fetch the report from the database.
  * @access private
  */
 interviewRouter.get("/report/:interviewId",verifyToken,getInterviewReportByIdController);

 /**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/",verifyToken,getAllInterviewReportsController);

 module.exports= interviewRouter;