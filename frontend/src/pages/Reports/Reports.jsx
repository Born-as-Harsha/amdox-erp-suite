import "./Reports.css";
import { useEffect, useState } from "react";

import {
    getReports,
    addReport,
    updateReport,
    deleteReport,
    getReportStats
} from "../../api/reportApi";

import ReportTable from "./ReportTable";
import ReportStats from "./ReportStats";
import ReportModal from "./ReportModal";
import SearchBar from "./SearchBar";

function Reports() {

    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        reportId: "",
        reportName: "",
        category: "",
        generatedBy: "",
        status: "Generated"
    });

    async function fetchReports() {

        try {

            const response = await getReports();

            setReports(response.data);

            const statResponse = await getReportStats();

            setStats(statResponse.data);

        }

        catch (error) {

            alert(error.response?.data?.message || error.message);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        const loadReports = async () => {

            await fetchReports();

        };

        loadReports();

    }, []);

    async function handleSave() {

        try {

            if (editingId) {

                await updateReport(editingId, formData);

                alert("Report Updated Successfully");

            }

            else {

                await addReport(formData);

                alert("Report Added Successfully");

            }

            setEditingId(null);

            setShowModal(false);

            setFormData({

                reportId: "",
                reportName: "",
                category: "",
                generatedBy: "",
                status: "Generated"

            });

            await fetchReports();

        }

        catch (error) {

            alert(error.response?.data?.message || error.message);

        }

    }

    function handleEdit(report) {

        setEditingId(report._id);

        setFormData({

            reportId: report.reportId,
            reportName: report.reportName,
            category: report.category,
            generatedBy: report.generatedBy,
            status: report.status

        });

        setShowModal(true);

    }

    async function handleDelete(id) {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this report?"
        );

        if (!confirmDelete) return;

        try {

            await deleteReport(id);

            alert("Report Deleted Successfully");

            await fetchReports();

        }

        catch (error) {

            alert(error.response?.data?.message || error.message);

        }

    }

    const filteredReports = reports.filter((report) => {

        return (

            report.reportName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||

            report.category
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||

            report.generatedBy
                .toLowerCase()
                .includes(searchTerm.toLowerCase())

        );

    });

    if (loading) {

        return <h2 style={{ padding: "20px" }}>Loading...</h2>;

    }

    return (

        <div className="reports">

            <div className="reports-header">

                <h1>Report Management</h1>

                <button

                    onClick={() => {

                        setEditingId(null);

                        setFormData({

                            reportId: "",
                            reportName: "",
                            category: "",
                            generatedBy: "",
                            status: "Generated"

                        });

                        setShowModal(true);

                    }}

                >

                    Add Report

                </button>

            </div>

            <SearchBar

                searchTerm={searchTerm}

                setSearchTerm={setSearchTerm}

            />

            <ReportStats

                stats={stats}

                reports={reports}

            />

            <ReportTable

                reports={filteredReports}

                handleEdit={handleEdit}

                handleDelete={handleDelete}

            />

            <ReportModal

                showModal={showModal}

                setShowModal={setShowModal}

                formData={formData}

                setFormData={setFormData}

                handleSave={handleSave}

                editingId={editingId}

            />

        </div>

    );

}

export default Reports;