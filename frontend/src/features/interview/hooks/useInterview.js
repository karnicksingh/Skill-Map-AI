import{ fetchInterviewReportById ,generateInterviewReport,getAllInterviewReports} from "../services/interview.api.js"
import {InterviewContext} from "../interview.context.jsx"
import { toast } from "sonner";
import { useState ,useContext } from "react";

export const useInterview = () => {

  const context = useContext(InterviewContext);

  if(!context){
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  const {interviewReport, setInterviewReport, interviewReports, setInterviewReports, loading, setLoading} = context;



    const handleGenerateInterviewReport = async ({resume, selfDescription, jobDescription}) => {
        setLoading(true);
        try{
            const data = await generateInterviewReport({resume, selfDescription, jobDescription});
            setInterviewReport(data);
            return data; // Return data so callers can navigate using the created report's _id
        } catch (error) {
            console.error("Error generating interview report:", error);
            throw error; // Rethrow the error to be handled by the caller
        } finally {
            setLoading(false);
        }
    }


    const handleFetchInterviewReportById = async (interviewId) => {
        setLoading(true);
        try{
            const data = await fetchInterviewReportById(interviewId);
            setInterviewReport(data);
        } catch (error) {
            console.error("Error fetching interview report:", error);
            throw error; // Rethrow the error to be handled by the caller
        } finally {
            setLoading(false);
        }
    }
    const handleGetAllInterviewReports = async () => {
        setLoading(true);
        try{
            const data = await getAllInterviewReports();
            setInterviewReports(data);
        } catch (error) {
            console.error("Error fetching all interview reports:", error);
            throw error; // Rethrow the error to be handled by the caller
        } finally {
            setLoading(false);
        }
    }

    return {interviewReport, setInterviewReport, interviewReports, setInterviewReports, loading, setLoading, handleGenerateInterviewReport, handleFetchInterviewReportById, handleGetAllInterviewReports};

}

