"use client";

import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/ext-language_tools";
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
import { ref, set, onValue } from "firebase/database";
import { auth, db } from "@/utils/firebase";
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

const EditorBody = () => {
  const classes = useStyles();
  const [codeFontSize, setCodeFontSize] = useState(16);
  //const [showLoader, setShowLoader] = useState(true);
  const [lang, setLang] = useState("");
  const [editorLanguage, setEditorLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [executing, setExecuting] = useState(false);
  const input = "";

  const [isOwner, setIsOwner] = useState(false);
  //const router = useRouter();
  const [editorID, setEditorID] = useState("");
  

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
 

  useEffect(() => {
    if (lang) {
      setEditorLanguage(lang); // Set editor language state
      
      console.log(db);

      const langRef = ref(db, `${editorID}/language`);

      console.log(langRef)
  
      // Update language in database if it changes
      set(langRef, lang)
      .then(() => {
        console.log("Language successfully stored in the database.");
      })
      .catch((error) => {
        console.error("Error storing language:", error);
      });
  
      // Set up a real-time listener for language changes
      const unsubscribe = onValue(langRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setLang(data); // Update local state with database value if it changes
        }
      });
  
      // Cleanup listener on component unmount
      return () => unsubscribe();
    }
  }, [lang, editorID]); 



  useEffect(() => {
    if (code.trim()) {
      const codeRef = ref(db, `${editorID}/code`);
      set(codeRef, code)
      .then(() => {
        console.log("Code successfully stored in the database.");
      })
      .catch((error) => {
        console.error("Error storing code:", error);
      });
    }
  }, [code, editorID]);


  const createExecutionRequest = () => {
    setExecuting(true);

    axios
      .post("https://api.codex.jaagrav.in", { code: code, language: editorLanguage, input: input })
      .then((response) => {
        setExecuting(false);
        setOutputValue(response.data.output || response.data.error || "Error");
      })
      .catch(() => {
        setOutputValue("Network Error");
      });
  };

  const SelectLanguage = () => {
    return (
      <Select
        labelId="language-select-label"
        id="language-select"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        variant="outlined"
        className={classes.selectlang}
        disabled={executing}
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
        <div className={classes.inputModal} onClick={(e) => e.stopPropagation()}>
          <span>Input</span>
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
   
      <div className={classes.body}>
        <AceEditor
          mode= {editorLanguage}
          theme="dracula"
          onChange={setCode}
          value={code}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            fontSize: codeFontSize,
            showPrintMargin: false,
          }}
          width="100%" 
          height="200px" 
          className={classes.modalInput}
        />
          <div className={classes.output}>
          <div className={classes.outputTitle}>Output</div>
          <div className={classes.outputTerminal}>{outputValue}</div>
          <div className={classes.runPanel}>
          <SelectLanguage />
          {executing && <LinearProgress size={14} className={classes.buttonProgress} />}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default EditorBody;