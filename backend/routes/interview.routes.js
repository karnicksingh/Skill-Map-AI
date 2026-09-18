 const express= require("express");
 const interviewRouter= express.Router();
 const {verifyToken}= require("../middleware/auth.middleware.js");
 const {upload}= require("../middleware/file.middleware.js");
 const {interviewReportGeneratorController,interviewReportFetchByIdController,getAllInterviewReportsController,generateResumePdfController}= require("../controllers/interview.controller.js");


 /**
  * @route post /api/interview
  */

 interviewRouter.post("/",verifyToken,upload.single("resume"),interviewReportGeneratorController);

 /**
  * @route get /api/report/interview/:interviewId
  * @description This route is responsible for fetching the interview report based on the interviewId provided by the user. It uses the interviewReportGenerator service to fetch the report from the database.
  * @access private
  */
 interviewRouter.get("/report/:interviewId",verifyToken,interviewReportFetchByIdController);

 /**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/",verifyToken,getAllInterviewReportsController);


/**
 * @route GET /api/interview/resume/:interviewId
 * @description This route is responsible for generating a PDF of the interview report based on the interviewId provided by the user. It uses the generateResumePdf service to generate the PDF and send it as a response.
 * @access private
 */
interviewRouter.get("/resume/:interviewId",verifyToken,generateResumePdfController);

 module.exports= interviewRouter;