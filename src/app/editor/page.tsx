"use client"
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Use Next.js router
import brandingLogo from "../components/logo.png";
import "./editor.css";

import { makeStyles, createStyles } from "@mui/styles";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "../components/MaterialTheming";

import EditorBody from "../components/editor-component";

import { getDatabase, ref, get, set } from "firebase/database";
import { app } from "@/utils/firebase"; // Import Firebase app

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
  const { editorID, editorIndex } = useParams();
  const [className, setClassName] = useState("");
  const [notOwner, setNotOwner] = useState(false);

  useEffect(() => {
    const db = getDatabase(app);
    const classRef = ref(db, `CodeX/${editorID}/className`);

    // Fetch className from Firebase
    get(classRef).then((snapshot) => {
      if (snapshot.exists()) {
        setClassName(snapshot.val());
      } else {
        console.warn("Class name not found in Firebase.");
      }
    }).catch((error) => {
      console.error("Error fetching class name:", error);
    });

    const storedCodes = localStorage.getItem("codex-codes");
    if (storedCodes) {
      const codesArray = JSON.parse(storedCodes);
      const index = Number(editorIndex);
      if (Number.isInteger(index) && codesArray[index]?.key === editorID) {
        setNotOwner(true);
      }
    }
  }, [editorID, editorIndex]);

  useEffect(() => {
    if (className.trim() && notOwner) {
      const db = getDatabase(app);
      const classRef = ref(db, `CodeX/${editorID}/className`);
      set(classRef, className)
        .then(() => {
          console.log("Class name updated in Firebase.");
        })
        .catch((error) => {
          console.error("Error updating class name:", error);
        });

      const storedCodes = localStorage.getItem("codex-codes");
      if (storedCodes) {
        const classNames: { name: string; key: string }[] = JSON.parse(storedCodes);
        const index = Number(editorIndex);
        if (Number.isInteger(index) && classNames[index]) {
          if (classNames[Number(editorIndex)]) {
            if (classNames[index]) {
              classNames[index].name = className;
            }
          }
          localStorage.setItem("codex-codes", JSON.stringify(classNames));
        }
      }
    }
  }, [className, editorID, editorIndex, notOwner]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.editorPage}>
        <div className={classes.header}>
          <img
            className={classes.brandingLogo}
            src={brandingLogo.src}
            alt="branding-logo"
            onClick={() => router.push("/")} // use Next.js router to navigate
          />
          <input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className={classes.codeTitle}
            spellCheck={false}
            readOnly={!notOwner}
          />
        </div>
        <EditorBody storeAt={`CodeX/${editorID}`} index={editorIndex} />
      </div>
    </ThemeProvider>
  );
}

export default Editor;
