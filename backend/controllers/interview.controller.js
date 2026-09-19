
const { PDFParse } = require("pdf-parse");
const  {interviewReportGenerator,generateResumePdf}=require("../services/ai.service.js");
const interviewReportModel=require("../models/interviewReport.model.js");







/**
 * @name intervew report generator controller
 * @description This controller is responsible for generating interview report based on the resume, self description and job description provided by the user. It uses the interviewReportGenerator service to generate the report and saves it to the database.
 
*/
async function interviewReportGeneratorController(req,res){
const parser = new PDFParse({ data: req.file.buffer });
const result = await parser.getText();
const resumeContent = result.text;
const{selfDescription,jobDescription}=req.body;

console.log("[Generate] req.user:", req.user);

const interviewReport=await interviewReportGenerator(resumeContent,selfDescription,jobDescription);

const interviewReportData= await interviewReportModel.create({
    jobDescription:jobDescription,
    resume:resumeContent,
    selfDescription:selfDescription,
    user: req.user.id,
    ...interviewReport

})

// console.log("[Generate] saved with user:", interviewReportData.user, "| _id:", interviewReportData._id);

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
    try {
        console.log("[Reports] req.user:", req.user);

        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        console.log("[Reports] found:", interviewReports.length);

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            data: interviewReports
        });
    } catch (err) {
        console.error("[Reports] error:", err.message);
        res.status(500).json({ message: "Failed to fetch reports.", error: err.message });
    }
}

/**
 * @description Creating pdf from html content and returning the buffer.
 * 
 */
 async function generateResumePdfController(req,res) {
   const{interviewId}=req.params;

   const interviewReport=await interviewReportModel.findById(interviewId);
   if(!interviewReport){
    return res.status(404).json({
        message: "Interview report not found"
    });
   }
   const{resume, selfDescription, jobDescription}=interviewReport;
    const pdfBuffer=await generateResumePdf(resume, selfDescription, jobDescription);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${interviewId}_resume.pdf`);
    res.send(pdfBuffer);

 }


module.exports={
    interviewReportGeneratorController,
    interviewReportFetchByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}