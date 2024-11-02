
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

import { makeStyles, createStyles } from "@mui/styles";
import { ThemeProvider } from "@mui/material/styles";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { darkTheme } from "./MaterialTheming";

import { getDatabase, ref, get, set } from "firebase/database";
import { app } from "@/utils/firebase";
import axios from "axios";

const useStyles = makeStyles((theme) =>
  createStyles({
    body: {
      display: "grid",
      gridGap: "0 20px",
      gridTemplateRows: "calc(100% - 200px) 200px",
      "& .ace_gutter": { backgroundColor: "#19202b" },
      "& .ace_editor": { backgroundColor: "#19202b" },
      "& .ace_support.ace_function": { color: "#2196F3" },
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
      "& *": { fontFamily: "monospace" },
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
    runPanel: { textAlign: "left !important" },
    runBtn: { marginRight: 10 },
    inputModal: {
      height: "fit-content",
      width: "90%",
      maxHeight: 500,
      maxWidth: 400,
      background: "#19202b",
      borderRadius: "5px",
      padding: 15,
      textAlign: "left",
      "& text": { display: "block", color: "#2196F3", fontSize: "20px" },
      "& small": { display: "block", fontSize: "14px" },
    },
    modalInput: {
      width: "100%",
      marginTop: "10px",
    },
    runBtnOnModal: { marginTop: "20px" },
    buttonProgress: { color: "white", margin: "auto" },
    outputTitle: { color: "#2196F3", margin: "7px 0", textAlign: "left !important" },
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

const languageMapping = {
  cpp: "c_cpp",
  java: "java",
  c: "c_cpp",
  cs: "csharp",
  rb: "ruby",
  py: "python",
  kt: "kotlin",
  swift: "swift",
};

function EditorBody({ storeAt, index }) {
  
  const classes = useStyles();
  const [codeFontSize, setCodeFontSize] = useState(16);
  
  const [showLoader, setShowLoader] = useState(true);
  const [lang, setLang] = useState("");
  const [editorLanguage, setEditorLanguage] = useState("c_cpp");
  const [code, setCode] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [takeInput, setTakeInput] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [input, setInput] = useState("");

  const notOwner = typeof window !== "undefined" &&
    localStorage.getItem("codex-codes") &&
    JSON.parse(localStorage.getItem("codex-codes"))[index]?.key === storeAt.split("/")[1];


  useEffect(() => {
    const db = getDatabase(app);
    const codeRef = ref(db, storeAt);

    get(codeRef).then((snap) => {
      if (snap.exists()) {
        const data = snap.val();
        setLang(data.language);
        setCode(data.code);
      }
      setShowLoader(false);
    });
  }, [storeAt]);

  useEffect(() => {
    if (lang && languageMapping[lang]) {
      setEditorLanguage(languageMapping[lang]);

      if (!notOwner) {
        const db = getDatabase(app);
        set(ref(db, `${storeAt}/language`), lang);

        const storedCodes = localStorage.getItem("codex-codes");
        if (storedCodes) {
          const classNames = JSON.parse(storedCodes);
          classNames[index].lang = lang;
          localStorage.setItem("codex-codes", JSON.stringify(classNames));
        }
      }
    }
  }, [lang, storeAt, index, notOwner]);

  useEffect(() => {
    if (code && !notOwner) {
      const db = getDatabase(app);
      set(ref(db, `${storeAt}/code`), code);
    }
  }, [code, storeAt, notOwner]);

  const createExecutionRequest = () => {
    setTakeInput(false);
    setExecuting(true);

    axios
      .post("https://api.codex.jaagrav.in", {
        code: code,
        language: lang,
        input: input,
      })
      .then((response) => {
        setExecuting(false);
        if (response.data?.output) setOutputValue(response.data.output);
        if (response.data?.error) setOutputValue((prev) => prev + response.data.error);
      })
      .catch(() => {
        setExecuting(false);
        setOutputValue("Network Error");
      });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Backdrop className={classes.backdrop} open={showLoader}>
        <CircularProgress color="primary" />
      </Backdrop>

      <Backdrop className={classes.backdrop} open={takeInput} onClick={() => setTakeInput(false)}>
        <div className={classes.inputModal} onClick={(e) => e.stopPropagation()}>
        <p>Input</p>
          <small>Provide input line by line if required.</small>
          <TextField
            label="STD Input"
            variant="filled"
            className={classes.modalInput}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            multiline
            maxRows={7}
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
          fontSize={codeFontSize}
          value={code}
          onChange={setCode}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showPrintMargin: false,
          }}
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

            <Select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
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

            {executing && <LinearProgress size={14} className={classes.buttonProgress} />}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default EditorBody;
