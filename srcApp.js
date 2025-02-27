import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://crime-app-backend.azurewebsites.net"; // Replace with your backend URL

function App() {
  const [reports, setReports] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", location: "" });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  // Fetch crime reports
  const fetchReports = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports`);
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit crime report
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/report`, formData);
      setMessage(response.data.message);
      fetchReports();
      setFormData({ title: "", description: "", location: "" });
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  // Upload image
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="container">
      <h1>Crime Reporting App</h1>
      {message && <p className="message">{message}</p>}

      {/* Report Crime Form */}
      <form onSubmit={handleSubmit} className="form">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <button type="submit">Submit Report</button>
      </form>

      {/* Image Upload Form */}
      <form onSubmit={handleFileUpload} className="form">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        <button type="submit">Upload Image</button>
      </form>

      {/* Display Crime Reports */}
      <h2>Crime Reports</h2>
      <ul className="report-list">
        {reports.map((report, index) => (
          <li key={index}>
            <h3>{report.title}</h3>
            <p>{report.description}</p>
            <p><strong>Location:</strong> {report.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
