const pdfParse = require("pdf-parse")
const { z } = require("zod")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")
const asyncHandler = require("../utils/asyncHandler")

const generateReportSchema = z.object({
    jobDescription: z.string().trim().min(1, "Job description is required").max(5000, "Job description is too long"),
    selfDescription: z.string().trim().max(3000, "Self description is too long").default("")
})


/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 * Either a resume or a self description is required.
 */
const generateInterViewReportController = asyncHandler(async (req, res) => {
    const parsedBody = generateReportSchema.safeParse(req.body)

    if (!parsedBody.success) {
        return res.status(400).json({ message: parsedBody.error.issues[0].message })
    }

    const { jobDescription, selfDescription } = parsedBody.data

    let resumeText = ""

    if (req.file) {
        // A real PDF always starts with "%PDF-", the mimetype alone can be faked
        if (req.file.buffer.subarray(0, 5).toString() !== "%PDF-") {
            return res.status(400).json({ message: "The uploaded file is not a valid PDF." })
        }

        try {
            const parsedPdf = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
            resumeText = parsedPdf.text.trim()
        } catch (err) {
            console.error("PDF parse error:", err.message)
            return res.status(400).json({ message: "Could not read the PDF file. Please upload a different one." })
        }

        if (!resumeText) {
            return res.status(400).json({
                message: "No text found in the PDF. Scanned or image-only resumes are not supported."
            })
        }
    }

    if (!resumeText && !selfDescription) {
        return res.status(400).json({
            message: "Please provide either a resume or a self description."
        })
    }

    let reportByAi

    try {
        reportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })
    } catch (err) {
        console.error("AI service error:", err.message)
        const aiError = new Error("The AI service is unavailable right now. Please try again in a moment.")
        aiError.statusCode = 503
        throw aiError
    }

    const interviewReport = await interviewReportModel.create({
        // AI output goes first, so our own trusted fields below always win
        ...reportByAi,
        user: req.user.id,
        resume: resumeText,
        selfDescription,
        jobDescription,
        title: reportByAi.title || "Interview Report"
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })
})


/**
 * @description Controller to get interview report by interviewId.
 */
const getInterviewReportByIdController = asyncHandler(async (req, res) => {
    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
})


/**
 * @description Controller to get all interview reports of logged in user.
 */
const getAllInterviewReportsController = asyncHandler(async (req, res) => {
    const interviewReports = await interviewReportModel
        .find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
})


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
const generateResumePdfController = asyncHandler(async (req, res) => {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
})

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}