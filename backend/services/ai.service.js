// const { GoogleGenAI } = require( "@google/genai");
// const {z}=require("zod");
// const { zodToJsonSchema } = require("zod-to-json-schema")
// // const {resume, selfDescription, jobDescription} = require("../services/temp.js")


// const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});


// const interviewReportSchema = z.object({
//     matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
//     technicalQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
//     behavioralQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
//     skillGaps: z.array(z.object({
//         skill: z.string().describe("The skill which the candidate is lacking"),
//         severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
//     })).describe("List of skill gaps in the candidate's profile along with their severity"),
//     preparationPlan: z.array(z.object({
//         day: z.number().describe("The day number in the preparation plan, starting from 1"),
//         focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
//         tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
//     })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
//     title: z.string().describe("The title of the job for which the interview report is generated"),
// })

// async  function interviewReportGenerator(resume,selfDescription, jobDescription,  ) {


//     const prompt = `Generate an interview report for a candidate with the following details:
//                         Resume: ${resume}
//                         Self Description: ${selfDescription}
//                         Job Description: ${jobDescription}`;   

//     const response = await ai.models.generateContent({
//      model: "gemini-3.5-flash-lite",
//      contents: prompt,
//      config: {
//         responseMimeType: "application/json",
//         responseSchema: zodToJsonSchema(interviewReportSchema)
//      }

//     });

//     return JSON.parse(response.text);

// }


//     module.exports = {
//         interviewReportGenerator
//     };




 const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
});


// ================================
// INTERVIEW REPORT SCHEMA
// (plain Gemini-compatible schema — no $ref / definitions.
// Type values are the literal uppercase strings Gemini's API
// expects on the wire ("OBJECT", "ARRAY", "STRING", ...).
// Deliberately NOT using the @google/genai `Type` enum here:
// if that enum doesn't resolve in a given SDK version, every
// `type` key silently becomes `undefined` and gets dropped by
// JSON serialization, leaving Gemini with an untyped schema —
// which is what caused technicalQuestions/behavioralQuestions
// to come back as arrays of plain strings instead of objects.
// ================================

const interviewReportSchema = {
    type: "OBJECT",
    properties: {

        jobTitle: {
            type: "STRING",
            description: "The title of the job for which the interview report is generated"
        },

        matchScore: {
            type: "NUMBER",
            description: "A score between 0 and 100 representing how well the candidate matches the job description"
        },

        technicalQuestions: {
            type: "ARRAY",
            description: "Technical interview questions generated specifically from the candidate's profile and the requirements of the job",
            items: {
                type: "OBJECT",
                properties: {
                    question: {
                        type: "STRING",
                        description: "A technical interview question relevant to the candidate and the target job"
                    },
                    intention: {
                        type: "STRING",
                        description: "The interviewer's purpose behind asking the technical question"
                    },
                    answer: {
                        type: "STRING",
                        description: "A useful explanation of how the candidate should answer the question and the important points they should cover"
                    }
                },
                required: [ "question", "intention", "answer" ]
            }
        },

        behavioralQuestions: {
            type: "ARRAY",
            description: "Behavioral interview questions relevant to the candidate's background and target job",
            items: {
                type: "OBJECT",
                properties: {
                    question: {
                        type: "STRING",
                        description: "A behavioral interview question relevant to the candidate and target job"
                    },
                    intention: {
                        type: "STRING",
                        description: "The interviewer's purpose behind asking the behavioral question"
                    },
                    answer: {
                        type: "STRING",
                        description: "Guidance on how the candidate should approach and answer the behavioral question"
                    }
                },
                required: [ "question", "intention", "answer" ]
            }
        },

        skillGaps: {
            type: "ARRAY",
            description: "Meaningful skill gaps identified by comparing the candidate's profile with the job description",
            items: {
                type: "OBJECT",
                properties: {
                    skill: {
                        type: "STRING",
                        description: "A skill required or preferred by the job that is missing or insufficiently demonstrated by the candidate"
                    },
                    severity: {
                        type: "STRING",
                        enum: [ "low", "medium", "high" ],
                        description: "The importance of the skill gap for the target job"
                    }
                },
                required: [ "skill", "severity" ]
            }
        },

        preparationPlan: {
            type: "ARRAY",
            description: "A personalized preparation plan based on the candidate's skill gaps and the requirements of the target job",
            items: {
                type: "OBJECT",
                properties: {
                    day: {
                        type: "INTEGER",
                        description: "The day number in the preparation plan"
                    },
                    focus: {
                        type: "STRING",
                        description: "The main topic or area the candidate should focus on that day"
                    },
                    tasks: {
                        type: "ARRAY",
                        description: "Specific preparation tasks for that day",
                        items: {
                            type: "STRING"
                        }
                    }
                },
                required: [ "day", "focus", "tasks" ]
            }
        }

    },
    required: [
        "jobTitle",
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan"
    ]
};


// ================================
// INTERVIEW REPORT GENERATOR
// ================================

async function interviewReportGenerator(
    resume,
    selfDescription,
    jobDescription
) {

    const prompt = `
You are an AI career analysis and interview preparation assistant.

Analyze the candidate's resume and self-description against the provided job description.

Generate a personalized interview report based on the comparison.

The report must provide:

- A match score between the candidate and the job.
- Relevant technical interview questions.
- Relevant behavioral interview questions.
- Meaningful skill gaps.
- A practical preparation plan.

The generated content must be specific to the information provided.

Determine the relevant technologies, concepts, skills, questions, and preparation topics from the resume, self-description, and job description.

Do not assume that every candidate has the same skills, weaknesses, interview questions, or preparation requirements.

Do not hardcode or force unrelated technologies, skills, or topics into the report.

Do not invent experience, projects, qualifications, skills, or technologies that are not supported by the provided information.

For technical and behavioral questions, provide useful answers and explain what the interviewer is trying to evaluate.

For skill gaps, identify skills that are required or preferred by the job but are missing or insufficiently demonstrated in the candidate's profile.

For the preparation plan, create tasks based on the candidate's actual gaps and the requirements of the specific job.

Every field in the response schema should contain meaningful information. Do not return empty arrays when relevant information can reasonably be derived from the provided resume and job description. Generate at least 3 technical questions, 3 behavioral questions, and a preparation plan spanning at least 5 days unless the provided information is too sparse to support that.

Return only JSON that follows the provided response schema.

-------------------------
CANDIDATE RESUME
-------------------------

${resume}

-------------------------
SELF DESCRIPTION
-------------------------

${selfDescription}

-------------------------
JOB DESCRIPTION
-------------------------

${jobDescription}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema
        }
    });

    return JSON.parse(response.text);
}


module.exports = {
    interviewReportGenerator
};