import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebar";
import "../Page.css";
import "./SalesFunnel.css";

const Leads: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Leads</h1>
                    <p>Your lead database from all funnels.</p>
                </div>
                <div className="card">
                    <p style={{ color: "#6b7280", fontSize: 14 }}>Lead management is available in the CRM module.</p>
                    <button className="btn-primary-modern" style={{ marginTop: 12 }} onClick={() => navigate("/crm")}>
                        Go to CRM →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Leads;