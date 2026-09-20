
 const { GoogleGenAI } = require("@google/genai");
 const puppeteer = require("puppeteer");

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


async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({channel: "chrome", headless: true});
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}


async function generateResumePdf({jobDescription, selfDescription, resume}) {

  const resumePdfSchema = {
    type: "OBJECT",
    properties: {
        html: {
            type: "STRING",
            description:
                "Complete HTML content for the tailored resume. This HTML will be converted to a PDF using Puppeteer."
        }
    },
    required: ["html"]
};


const prompt = `
You are an expert resume writer, ATS optimizer, and professional resume designer.

Create a polished, modern, ATS-friendly resume in HTML using the candidate's
resume, self-description, and the target job description provided below.

CORE RULES:
1. Use the candidate's actual information. Never invent or replace personal
   details, companies, education, dates, skills, projects, achievements, or links.
2. Never use placeholders such as "Candidate", "Company Name",
   "candidate@example.com", "University Name", or "Skill 1".
3. Do not add technologies or experience that are not supported by the
   candidate's information.
4. Tailor the resume to the job description by highlighting the candidate's
   existing skills, experience, and projects that are most relevant.
5. You may rewrite existing content to make it clearer, stronger, and more
   professional, but do not change its factual meaning.
6. Create a concise professional summary based on the candidate's real
   background and the target role.

RESUME STRUCTURE:
Use appropriate sections such as:
- Professional Summary
- Technical Skills
- Experience
- Projects
- Education
- Certifications
- Achievements

Only include sections for which actual information is available.

DESIGN:
Create a clean, modern, professional software-engineering resume.
Use a strong visual hierarchy, readable typography, consistent spacing,
professional section headings, subtle separators, and a minimal accent color.

The resume must:
- Be optimized for A4 PDF printing.
- Be ATS-friendly and easy to parse.
- Have good margins and spacing.
- Avoid excessive colors and decorative elements.
- Avoid tables for the main layout.
- Avoid skill bars, percentage charts, graphics, and unnecessary icons.
- Avoid large empty spaces.
- Keep important information from being split awkwardly across pages.

HTML REQUIREMENTS:
- Return a complete HTML document.
- Put all CSS inside the HTML.
- Do not use external CSS, JavaScript, images, or fonts.
- The HTML must work offline in Puppeteer.
- Return ONLY the HTML document, without Markdown or explanation.

IMPORTANT:
The job description tells you what the employer wants, but the candidate's
resume tells you what the candidate actually has. Never sacrifice factual
accuracy just to match the job description.

CANDIDATE RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

Now create the final tailored resume as complete HTML.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumePdfSchema
        }
    });

    const jsonContent=JSON.parse(response.text);
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer;

}








module.exports = {
    interviewReportGenerator,
    generateResumePdf
};