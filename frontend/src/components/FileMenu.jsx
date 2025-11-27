import React, { useState } from "react";
import "../backstage.css";
import DocumentsList from "./DocumentsList";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TumblrShareButton,
  TwitterShareButton,
  VKShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  RedditIcon,
  TumblrIcon,
  TwitterIcon,
  VKIcon,
  WhatsappIcon,
} from "react-share";

export default function FileMenu({
  isOpen,
  onClose,
  onSave,
  onSaveAs,
  documents = [],
  handleEdit,
  handleDelete,
  onPrint,
  onExportHTML,
  onExportTXT,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const handleNew = () => {
    window.location.reload();
  };

  console.log(documents);

  if (!isOpen) return null;

  const handleAdvEdit = (doc) => {
    setDialogOpen(false);
    onClose();
    handleEdit(doc);
  };

  return (
    <div className="backstage-overlay">
      <div className="backstage">
        <div className="backstage-sidebar">
          <h2 className="backstage-title">File</h2>

          <button className="backstage-item">Info</button>
          <button onClick={handleNew} className="backstage-item">
            New
          </button>
          <button
            onClick={() => setDialogOpen(true)}
            className="backstage-item"
          >
            Open
          </button>
          <button onClick={onSave} className="backstage-item">
            Save
          </button>
          <button onClick={onSaveAs} className="backstage-item">
            Save As
          </button>
          <button onClick={onPrint} className="backstage-item">
            Print
          </button>
          <button onClick={() => setShareOpen(true)} className="backstage-item">
            Share
          </button>
          <button onClick={onExportHTML} className="backstage-item">
            Export HTML
          </button>
          <button onClick={onExportTXT} className="backstage-item">
            Export TXT
          </button>

          <button className="backstage-item close-btn" onClick={onClose}>
            ✕ Close
          </button>
        </div>

        <div className="backstage-content">
          <h1>Info</h1>
          <p>Select an option from the left.</p>
        </div>

        <dialog
          open={dialogOpen}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "1px solid #ccc",
            padding: "10px",
            width: "80%",
            height: "80%",
          }}
        >
          {documents.length > 0 ? (
            <DocumentsList
              documents={documents}
              handleEdit={handleAdvEdit}
              handleDelete={handleDelete}
            />
          ) : (
            <p>No documents yet.</p>
          )}
          <button
            onClick={() => setDialogOpen(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "red",
              border: "none",
              cursor: "pointer",
              color: "white",
              padding: "5px 10px",
              borderRadius: "8px",
            }}
          >
            Close
          </button>
        </dialog>
        <dialog
          open={shareOpen}
          style={{
            width: "80%",
            maxWidth: "500px",
            height: "80%",
            maxHeight: "600px",
            borderRadius: "12px",
            border: "none",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            backgroundColor: "#fff",
            position: "relative",
            overflow: "auto", // allow scrolling if content overflows
          }}
        >
          <button
            onClick={() => setShareOpen(false)}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              background: "#ff4d4f",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              color: "white",
              padding: "8px 12px",
              fontWeight: "bold",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#ff7875")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#ff4d4f")}
          >
            Close
          </button>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              minHeight: "100%",
              gap: "1rem",
            }}
          >
            <h1
              style={{
                marginBottom: "1.5rem",
                fontSize: "1.8rem",
                color: "#f8f8f8ff",
              }}
            >
              Share
            </h1>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))",
                gap: "1.5rem",
                justifyItems: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <EmailShareButton url="https://example.com" className="share-btn">
                <EmailIcon size={50} round={true} />
              </EmailShareButton>
              <FacebookShareButton url="https://example.com">
                <FacebookIcon size={50} round={true} />
              </FacebookShareButton>
              <TwitterShareButton
                url="https://example.com"
                className="share-btn"
              >
                <TwitterIcon size={50} round={true} />
              </TwitterShareButton>
              <LinkedinShareButton
                url="https://example.com"
                className="share-btn"
              >
                <LinkedinIcon size={50} round={true} />
              </LinkedinShareButton>
              <RedditShareButton
                url="https://example.com"
                className="share-btn"
              >
                <RedditIcon size={50} round={true} />
              </RedditShareButton>
              <TumblrShareButton
                url="https://example.com"
                className="share-btn"
              >
                <TumblrIcon size={50} round={true} />
              </TumblrShareButton>
              <VKShareButton url="https://example.com" className="share-btn">
                <VKIcon size={50} round={true} />
              </VKShareButton>
              <WhatsappShareButton
                url="https://example.com"
                className="share-btn"
              >
                <WhatsappIcon size={50} round={true} />
              </WhatsappShareButton>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
}
