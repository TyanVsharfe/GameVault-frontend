import React from "react";

const NotFoundPage: React.FC = () => {
    return (
        <div style={{display: "flex", justifyContent: "center",textAlign: "center",  alignItems: "center", height: "80vh"}}>
            <div>
                <h2>404</h2>
                <h3>Page not found.</h3>
            </div>
        </div>
    );
};

export default NotFoundPage;