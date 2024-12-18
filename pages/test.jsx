import React from "react";
import { FlipBook } from "../components/componentsindex";

const TestPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#00000",
      }}
    >

      <FlipBook />
    </div>
  );
};

export default TestPage;

