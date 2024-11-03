"use client"
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Use Next.js router
import brandingLogo from "@/app/components/logo.png";
import "./index.css";

import { makeStyles, createStyles } from "@mui/styles";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "@/app/components/MaterialTheming";

import EditorBody from "@/app/components/editor-component";

import { getDatabase, ref, get, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, auth} from "@/utils/firebase"; // Import Firebase app
import { edit } from "ace-builds";

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
  const [editorID, setEditorID] = useState("1000");
  const [className, setClassName] = useState("");
  const [Owner, setOwner] = useState(true);



  useEffect(() => {
    const fetchClassName = async () => {
      const db = getDatabase(app);
      const classRef = ref(db, `Editor/${editorID}/className`);

      try {
        const snapshot = await get(classRef);
        if (snapshot.exists()) {
          setClassName(snapshot.val());
        } else {
          console.warn("Class name not found in Firebase.");
        }
      } catch (error) {
        console.error("Error fetching class name:", error);
      }
    };

    fetchClassName();
  }, [editorID]);

  useEffect(() => {
    if (className.trim() && Owner) {
      const db = getDatabase(app);
      const classRef = ref(db, `CodeX/${editorID}/code`);
      set(classRef, className)
        .then(() => {
          console.log("Class name updated in Firebase.");
        })
        .catch((error) => {
          console.error("Error updating class name:", error);
        });

    }
  }, [className, editorID, Owner]);

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
            spellCheck={true}
            readOnly={!Owner}
          />
        </div>
        <EditorBody storeAt={`CodeX/${editorID}`} index={editorID} />
      </div>
    </ThemeProvider>
  );
}

export default Editor;