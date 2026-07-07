import Report from "../models/Report.js";

// Get All Reports
export const getReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Report
export const addReport = async (req, res) => {
    try {
        const report = await Report.create(req.body);
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Report
export const updateReport = async (req, res) => {
    try {

        const report = await Report.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!report) {

            return res.status(404).json({
                message: "Report not found"
            });

        }

        res.json(report);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Delete Report
export const deleteReport = async (req, res) => {

    try {

        const report = await Report.findByIdAndDelete(req.params.id);

        if (!report) {

            return res.status(404).json({
                message: "Report not found"
            });

        }

        res.json({
            message: "Report deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Report Statistics
export const getReportStats = async (req, res) => {

    try {

        const totalReports = await Report.countDocuments();

        const generated = await Report.countDocuments({
            status: "Generated"
        });

        const pending = await Report.countDocuments({
            status: "Pending"
        });

        const archived = await Report.countDocuments({
            status: "Archived"
        });

        res.json({
            totalReports,
            generated,
            pending,
            archived
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};