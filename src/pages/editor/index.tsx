"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use Next.js router
import brandingLogo from "@/app/components/logo.png";
import "./index.css";

import { makeStyles, createStyles } from "@mui/styles";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "@/app/components/MaterialTheming";

import EditorBody from "@/app/components/editor-component";

import { getDatabase, ref, get, set } from "firebase/database";
import { app, auth } from "@/utils/firebase"; // Import Firebase app

import { onAuthStateChanged } from "firebase/auth";

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
  const [editorID] = useState("1000"); // Example editorID, replace as necessary
  const [className, setClassName] = useState("");
  const [Owner, setOwner] = useState(false);

  useEffect(() => {
    const db = getDatabase(app);

    // Auth State Changed
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const ownershipRef = ref(db, `CodeX/${editorID}/owner`);
        get(ownershipRef).then((snapshot) => {
          const ownerId = snapshot.val();
          setOwner(ownerId === user.uid); // Set true if user is owner
        });
      }
    });

    // Fetch className from Firebase
    const classRef = ref(db, `CodeX/${editorID}/className`);
    get(classRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setClassName(snapshot.val());
        } else {
          console.warn("Class name not found in Firebase.");
        }
      })
      .catch((error) => {
        console.error("Error fetching class name:", error);
      });
  }, [editorID]);

  useEffect(() => {
    const db = getDatabase(app);

    if (className.trim() && Owner) {
      const classRef = ref(db, `CodeX/${editorID}/code`);
      set(classRef, className)
        .then(() => console.log("Class name updated in Firebase."))
        .catch((error) => console.error("Error updating class name:", error));
    }
  }, [className, editorID, Owner]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.editorPage}>
        <div className={classes.header}>
          <input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className={classes.codeTitle}
            spellCheck={false}
            readOnly={!Owner}
          />
        </div>
        <EditorBody storeAt={`CodeX/${editorID}`} Owner={Owner} />
      </div>
    </ThemeProvider>
  );
};

export default Editor;