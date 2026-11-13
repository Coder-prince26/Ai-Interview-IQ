import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext, useEffect, useState } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"


// Reads the message sent by our backend. If the server could not be reached, shows a general message.
const getErrorMessage = async (error, fallback) => {
    if (!error.response) {
        return "Cannot connect to the server. Please try again."
    }

    const data = error.response.data

    // The PDF request asks for a blob, so its error body also arrives as a blob. Read it as text first.
    if (data instanceof Blob) {
        try {
            const parsed = JSON.parse(await data.text())
            return parsed.message || fallback
        } catch (err) {
            return fallback
        }
    }

    return data?.message || fallback
}


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    // These two belong only to the component that calls this hook
    const [ error, setError ] = useState("")
    const [ pdfLoading, setPdfLoading ] = useState(false)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    // Returns the new report, or null if something failed (the message is saved in "error")
    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        setError("")

        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (err) {
            setError(await getErrorMessage(err, "Could not generate the report. Please try again."))
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        setError("")

        try {
            const response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (err) {
            setError(await getErrorMessage(err, "Could not load this report."))
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        setError("")

        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)
            return response.interviewReports
        } catch (err) {
            setError(await getErrorMessage(err, "Could not load your reports."))
            return []
        } finally {
            setLoading(false)
        }
    }

    // Uses its own pdfLoading, so the whole page does not switch to a loading screen
    const getResumePdf = async (interviewReportId) => {
        setPdfLoading(true)
        setError("")

        try {
            const pdfBlob = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ pdfBlob ], { type: "application/pdf" }))

            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Release the memory after the download has started
            setTimeout(() => window.URL.revokeObjectURL(url), 1000)
        } catch (err) {
            setError(await getErrorMessage(err, "Could not generate the resume PDF. Please try again."))
        } finally {
            setPdfLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [ interviewId ])

    return { loading, pdfLoading, error, report, reports, generateReport, getReportById, getReports, getResumePdf }

}