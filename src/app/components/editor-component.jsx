"use client";

import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/mode-swift";

import {
  Button,
  TextField,
  Select,
  MenuItem,
  Backdrop,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "@/app/components/MaterialTheming";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { app, auth } from "@/utils/firebase";
import axios from "axios";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { makeStyles, createStyles } from "@mui/styles";
import { onAuthStateChanged } from "firebase/auth";

const useStyles = makeStyles((theme) =>
  createStyles({
    body: {
      display: "grid",
      gridGap: "0 20px",
      gridTemplateRows: "calc(100% - 200px) 200px",
      "& .ace_gutter": {
        backgroundColor: "#19202b",
      },
      "& .ace_editor": {
        backgroundColor: "#19202b",
      },
      "& .ace_support.ace_function": {
        color: "#2196F3",
      },
      [theme.breakpoints.up("sm")]: {
        gridTemplateRows: "unset",
        gridTemplateColumns: "calc(100% - 350px) 330px",
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    editor: {
      height: "100% !important",
      width: "100% !important",
      borderBottom: "2px solid #2196F3",
      "& *": {
        fontFamily: "monospace",
      },
      [theme.breakpoints.up("sm")]: {
        borderBottom: "none",
        borderRight: "2px solid #2196F3",
      },
    },
    output: {
      display: "grid",
      gridTemplateRows: "auto 1fr auto",
    },
    selectlang: {
      height: "32px",
      margin: "7px 0",
      textAlign: "left !important",
    },
    runPanel: {
      textAlign: "left !important",
    },
    runBtn: {
      marginRight: 10,
    },
    inputModal: {
      height: "fit-content",
      width: "90%",
      maxHeight: 500,
      maxWidth: 400,
      background: "#19202b",
      borderRadius: "5px",
      padding: 15,
      textAlign: "left",
      "& span": {
        display: "block",
        color: "#2196F3",
        fontSize: "20px",
      },
      "& small": {
        display: "block",
        fontSize: "14px",
      },
    },
    modalInput: {
      width: "100%",
      marginTop: "10px",
    },
    runBtnOnModal: {
      marginTop: "20px",
    },
    buttonProgress: {
      color: "white",
      margin: "auto",
    },
    outputTitle: {
      color: "#2196F3",
      margin: "7px 0",
      textAlign: "left !important",
    },
    outputTerminal: {
      textAlign: "left",
      color: "white",
      overflow: "auto",
      whiteSpace: "pre-line",
      fontFamily: "monospace",
      fontSize: "17px",
    },
  })
);

function EditorBody({ storeAt, index }) {
  const classes = useStyles();
  const [codeFontSize, setCodeFontSize] = useState(16);
  const [showLoader, setShowLoader] = useState(true);
  const [lang, selectlang] = useState("");
  const [editorLanguage, setEditorLanguage] = useState("c_cpp");
  const [code, setCode] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [takeInput, setTakeInput] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [input, setInput] = useState("");

  let notOwner = true;

  function setNotOwner(bool) {
    notOwner = bool;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
  
        // Assuming you have a way to fetch the owner UID from Firebase or another source
        // Example: owner UID is stored in a variable `ownerId` (fetched from Firebase or other storage)
        const ownerId = "WeeCCz0AUGb1z7QVftaesG2sBlo2"; // replace this with actual fetching logic
  
        // Check if the authenticated user's UID matches the stored owner UID
        if (userId === ownerId) {
          setNotOwner(false); // The user is the owner
        } else {
          setNotOwner(true); // The user is not the owner
        }
      } else {
        // Redirect to the home or login page if not authenticated
      }
    });
  
    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const resizeListener = () => {
      setCodeFontSize(window.innerWidth > 600 ? 20 : 14);
    };
    window.addEventListener("resize", resizeListener);
    resizeListener();

    const db = getDatabase(app);
    const codeRef = ref(db, storeAt);
    onValue(codeRef, (snapshot) => {
      const data = snapshot.val();
      setShowLoader(false);
      selectlang(data.language);
      setCode(data.code);
    });

    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  useEffect(() => {
    if (lang && !notOwner) {
      const langMap = {
        cpp: "c_cpp",
        java: "java",
        c: "c_cpp",
        cs: "csharp",
        rb: "ruby",
        py: "python",
        kt: "kotlin",
        swift: "swift",
      };
      setEditorLanguage(langMap[lang] || "c_cpp");

      const db = getDatabase(app);
      const langRef = ref(db, `${storeAt}/language`);
      set(langRef, lang);
    }
  }, [lang]);

  useEffect(() => {
    if (code.trim() && !notOwner) {
      const db = getDatabase(app);
      const codeRef = ref(db, `${storeAt}/code`);
      set(codeRef, code);
    }
  }, [code]);

  const createExecutionRequest = () => {
    setTakeInput(false);
    setExecuting(true);

    axios
      .post("https://api.codex.jaagrav.in", { code, language: lang, input })
      .then((response) => {
        setExecuting(false);
        setOutputValue(response.data.output || response.data.error || "Error");
      })
      .catch(() => {
        setExecuting(false);
        setOutputValue("Network Error");
      });
  };

  function SelectLanguage() {
    return (
      <Select
        labelId="language-select-label"
        id="language-select"
        value={lang}
        onChange={(e) => selectlang(e.target.value)}
        variant="outlined"
        className={classes.selectlang}
        disabled={executing || notOwner}
      >
        <MenuItem value="py">Python3</MenuItem>
        <MenuItem value="c">C</MenuItem>
        <MenuItem value="cpp">C++</MenuItem>
        <MenuItem value="java">Java</MenuItem>
        <MenuItem value="cs">C#</MenuItem>
        <MenuItem value="go">Golang</MenuItem>
        <MenuItem value="js">NodeJS</MenuItem>
      </Select>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Backdrop className={classes.backdrop} open={showLoader}>
        <CircularProgress color="primary" />
      </Backdrop>
      <Backdrop
        className={classes.backdrop}
        open={takeInput}
        onClick={() => {
          setTakeInput(false);
          setExecuting(false);
        }}
      >
        <div className={classes.inputModal} onClick={(e) => e.stopPropagation()}>
          <span>Input</span>
          <small>
            If your code requires an input, please type it below. For multiple inputs, type each
            input on a new line.
          </small>
          <TextField
            id="input-field"
            label="STD Input"
            variant="filled"
            className={classes.modalInput}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            multiline
            rows={7}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.runBtnOnModal}
            startIcon={<PlayArrowRoundedIcon />}
            onClick={createExecutionRequest}
          >
            Run
          </Button>
        </div>
      </Backdrop>
      <div className={classes.body}>
        <AceEditor
          mode={editorLanguage}
          theme="dracula"
          onChange={setCode}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            fontSize: codeFontSize,
            showPrintMargin: false,
          }}
          value={code}
          className={classes.editor}
          readOnly={notOwner}
        />
        <div className={classes.output}>
          <div className={classes.outputTitle}>Output</div>
          <div className={classes.outputTerminal}>{outputValue}</div>
          <div className={classes.runPanel}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              className={classes.runBtn}
              startIcon={<PlayArrowRoundedIcon />}
              onClick={() => setTakeInput(true)}
              disabled={executing}
            >
              Run
            </Button>
            <SelectLanguage />
            {executing && <LinearProgress size={14} className={classes.buttonProgress} />}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default EditorBody;
