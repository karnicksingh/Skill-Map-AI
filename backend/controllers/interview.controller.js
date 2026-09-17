
const {PDFParse} = require("pdf-parse");
const  {interviewReportGenerator}=require("../services/ai.service.js");
const interviewReportModel=require("../models/interviewReport.model.js");








/**
 * @name intervew report generator controller
 * @description This controller is responsible for generating interview report based on the resume, self description and job description provided by the user. It uses the interviewReportGenerator service to generate the report and saves it to the database.
 
*/
async function interviewReportGeneratorController(req,res){
const parser = new PDFParse({
    data: req.file.buffer
});
const result = await parser.getText();
const resumeContent = result.text;
const{selfDescription,jobDescription}=req.body;

const interviewReport=await interviewReportGenerator(resumeContent,selfDescription,jobDescription);

const interviewReportData= await interviewReportModel.create({
    jobDescription:jobDescription,
    resume:resumeContent,
    selfDescription:selfDescription,
    ...interviewReport

})
res.status(200).json({
    message: "Interview report generated successfully",
    data: interviewReportData
});

}



/**
 * @name intervew report fetch controller
 * @description This controller is responsible for fetching the interview report based on the interviewId provided by the user. It uses the interviewReportGenerator service to fetch the report from the database.
 */

async function interviewReportFetchByIdController(req,res){
       const {interviewId}=req.params;
       const interviewReport=await interviewReportModel.findById(interviewId);
       if(!interviewReport){
        return res.status(404).json({
            message: "Interview report not found"
        });
       }
       res.status(200).json({
        message: "Interview report fetched successfully",
        data: interviewReport
    });
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        data:interviewReports
    })
}

module.exports={
    interviewReportGeneratorController,
    interviewReportFetchByIdController,
    getAllInterviewReportsController
}