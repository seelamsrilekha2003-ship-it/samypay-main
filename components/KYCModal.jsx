import React from 'react';
import "../assets/styles/KYCModal.css";

export default function KYCModal({ isOpen, onClose, user }) {
    if (!isOpen) return null;

    // Placeholder data if specific user details aren't fully available
    const details = {
        partnerName: user.name || "Neelakandan",
        name: user.name || "Neelakandan",
        outletName: user.outletName || "Samypay",
        dob: "25 May 1988",
        pan: "AZSPN9624J",
        aadhar: "389734663199",
        isRegisterWithGST: "False",
        gstin: "33AZSPN9624J1ZP",
        address: user.address || "Thottakara Steer",
        city: user.city || "Kanchipuram",
        state: user.state || "Tamilnadu",
        pincode: "601102",
        landmark: "Bus Stop",
        locationType: "Rural",
        shopType: "Mobile Shop",
        qualification: "SSC",
        bankName: "INDIAN BANK"
    };

    return (
        <div className="kyc-modal-overlay">
            <div className="kyc-modal-content">
                <div className="kyc-modal-header">
                    <h3>User KYC Details</h3>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="kyc-modal-body">
                    {/* Left: Document Preview */}
                    <div className="kyc-document-preview">
                        {/* Placeholder image similar to screenshot */}
                        <div style={{ textAlign: 'center', color: '#888' }}>
                            <p>PAN Card Preview</p>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="kyc-details-section">
                        <table className="kyc-docs-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>DocName</th>
                                    <th>Document</th>
                                    <th>Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>
                                        PAN Card
                                        <span className="verified-tag">[ VERIFIED ]</span>
                                    </td>
                                    <td><button className="btn-view">View</button> ℹ️</td>
                                    <td><input type="text" readOnly style={{ background: '#eee', border: '1px solid #ccc' }} /></td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>
                                        Aadhaar Card
                                        <span className="verified-tag">[ VERIFIED ]</span>
                                    </td>
                                    <td><button className="btn-view">View</button> ℹ️</td>
                                    <td><input type="text" readOnly style={{ background: '#eee', border: '1px solid #ccc' }} /></td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>
                                        Photo (Passport Size)
                                        <span className="verified-tag">[ VERIFIED ]</span>
                                    </td>
                                    <td><button className="btn-view">View</button> ℹ️</td>
                                    <td><input type="text" readOnly style={{ background: '#eee', border: '1px solid #ccc' }} /></td>
                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td>
                                        Shop Image
                                        <span className="verified-tag">[ VERIFIED ]</span>
                                    </td>
                                    <td><button className="btn-view">View</button> ℹ️</td>
                                    <td><input type="text" readOnly style={{ background: '#eee', border: '1px solid #ccc' }} /></td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="kyc-info-table">
                            <tbody>
                                <tr><td>Partner Name</td><td>{details.partnerName}</td></tr>
                                <tr><td>Name</td><td>{details.name}</td></tr>
                                <tr><td>OutletName</td><td>{details.outletName}</td></tr>
                                <tr><td>DOB</td><td>{details.dob}</td></tr>
                                <tr><td>PAN</td><td>{details.pan}</td></tr>
                                <tr><td>AADHAR</td><td>{details.aadhar}</td></tr>
                                <tr><td>IsRegisterWithGST</td><td>{details.isRegisterWithGST}</td></tr>
                                <tr><td>GSTIN</td><td>{details.gstin}</td></tr>
                                <tr><td>Address</td><td>{details.address}</td></tr>
                                <tr><td>City</td><td>{details.city}</td></tr>
                                <tr><td>State</td><td>{details.state}</td></tr>
                                <tr><td>Pincode</td><td>{details.pincode}</td></tr>
                                <tr><td>Landmark</td><td>{details.landmark}</td></tr>
                                <tr><td>LocationType</td><td>{details.locationType}</td></tr>
                                <tr><td>ShopType</td><td>{details.shopType}</td></tr>
                                <tr><td>Qualification</td><td>{details.qualification}</td></tr>
                                <tr><td>BankName</td><td>{details.bankName}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
