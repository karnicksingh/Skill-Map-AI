import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000/api",
   withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  },
});


/**
 * 
 * @description This function is responsible for generating interview report based on the resume, self description and job description provided by the user. It uses the interviewReportGenerator service to generate the report and saves it to the database.
 */
export const generateInterviewReport = async ({resume, selfDescription, jobDescription}) => {

const formData = new FormData();
formData.append("resume", resume);
formData.append("selfDescription", selfDescription);
formData.append("jobDescription", jobDescription);

const response = await api.post("/interview/", formData, {
   withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data"
  },
});
return response.data;

}

/**
 * 
 * @description This function is responsible for fetching the interview report based on the interviewId provided by the user. It uses the interviewReportGenerator service to fetch the report from the database.
 */

export const fetchInterviewReportById = async (interviewId) => {
  const response = await api.get(`/interview/report/${interviewId}`);
  return response.data;
};

/**
 * 
 * @description This function is responsible for fetching all interview reports from the database.
 */


export const getAllInterviewReports = async () => {
  const response = await api.get("/interview/");
  return response.data;
};





export default api;