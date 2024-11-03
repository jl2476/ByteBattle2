"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use Next.js router
import brandingLogo from "@/app/components/logo.png";
import "./index.css";

import { StylesProvider, makeStyles, createStyles, createGenerateClassName } from "@mui/styles";
import { ThemeProvider } from "@mui/material/styles";

import { darkTheme } from "@/app/components/MaterialTheming";
import EditorBody from "@/app/components/editor-component";



const useStyles = makeStyles(() =>
  createStyles({
    editorPage: {
      height: "100%",
      width: "100%",
      display: "grid",
      gridGap: "14px",
      gridTemplateRows: "auto 1fr",
    },
    brandingLogo: {
      cursor: "pointer",
    },
    header: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      "& > *": {
        margin: "auto 0",
      },
    },
    codeTitle: {
      color: "#2196F3",
      backgroundColor: "transparent",
      border: "none",
      outline: "none",
      textAlign: "center",
      height: "100%",
      width: "100%",
    },
    body: {
      height: "100%",
      width: "100%",
      display: "grid",
      gridTemplateRows: "70% 30%",
    },
  })
);

const Editor = () => {
  const classes = useStyles();
  

  const generateClassName = createGenerateClassName({
    productionPrefix: 'editor', 
  });
  

  return (
    <StylesProvider generateClassName={generateClassName}>
      <ThemeProvider theme={darkTheme}>
        <div className={classes.editorPage}>

          <div className={classes.header}>
            <img
              className={classes.brandingLogo}
              src={brandingLogo.src}
              alt="branding-logo"
              style={{ width: "100px", height: "auto" }} // Adjust size here
            />
          </div>
          
          {/* Pass editorID as the unique identifier to store code content */}
          <EditorBody />
        </div>
      </ThemeProvider>
    </StylesProvider>);
};

export default Editor;
