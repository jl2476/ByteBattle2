"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use Next.js router
import brandingLogo from "@/app/components/logo.png";
import "./index.css";

import { makeStyles, createStyles } from "@mui/styles";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "@/app/components/MaterialTheming";
import EditorBody from "@/app/components/editor-component";
import PropTypes from 'prop-types';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, onValue, set } from "firebase/database";
import { db, app } from "@/utils/firebase"; // Import Firebase app



import Nav from "@/pages/home/index";
import { Console } from "console";
console.log(db)

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
  const router = useRouter();
  const [editorID, setEditorID] = useState("");
  const [code, setCode] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const auth = getAuth(app);
  
  console.log(`CodeX/${editorID}`);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsOwner(false);
        console.log("user is signed off");
        //router.push("/login");
      }
      if (user) {
        console.log("user is signed in");
        setEditorID(user.uid);
        setIsOwner(true);
      }

    });
  }, [auth]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.editorPage}>

        <div className={classes.header}>
          <img
            className={classes.brandingLogo}
            src={brandingLogo.src}
            alt="branding-logo"
            style={{ width: "100px", height: "auto" }} // Adjust size here
          />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={classes.codeTitle}
            spellCheck={false}
            readOnly={!isOwner}
          />
        </div>
        
        {/* Pass editorID as the unique identifier to store code content */}
        <EditorBody storeAt={`CodeX/${editorID}`} Owner={isOwner} db={ db } />
      </div>
    </ThemeProvider>
  );
};

export default Editor;
