import { useEffect, useReducer, useState } from "react";

export default function UpdateProfileVLC() {
  const data = JSON.parse(localStorage.getItem("loggedUser"));

  const init = {
    fname: { value: "", valid: false, touched: false, error: "" },
    mname: { value: "", valid: false, touched: false, error: "" },
    lname: { value: "", valid: false, touched: false, error: "" },
    adhaar: { value: "", valid: false, touched: false, error: "" },
    accountNumber: { value: "", valid: false, touched: false, error: "" },
    phone: { value: 0, valid: false, touched: false, error: "" },
    formValid: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "update":
        return {
          ...state,
          [action.data.key]: {
            ...state[action.data.key],
            value: action.data.val,
            touched: action.data.touched,
            valid: action.data.valid,
            error: action.data.error,
          },
          formValid: action.data.formValid,
        };
      case "reset":
        return init;
      default:
        console.log("default switch");
        return state;
    }
  };

  const [vlc, dispatch] = useReducer(reducer, init);
  const [displayAlert, setDisplayAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [alertType, setAlertType] = useState("danger");
  const [obj1, setObj] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [cancelDisabled, setCancelDisabled] = useState(true);

  function showErrorMessage(msg, time) {
    setDisplayAlert(true);
    setErrorMsg(msg);
    if (time !== 0) {
      setTimeout(() => {
        setDisplayAlert(false);
      }, time);
    }
  }

  useEffect(() => {
    console.log("in show request");
    fetch("http://localhost:8080/getuservlcbyid?uid=" + data.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(JSON.stringify(data));
        setObj(data);
        initializeVlcState(data);
      });
  }, []);

  const initializeVlcState = (data) => {
    dispatch({
      type: "update",
      data: {
        key: "fname",
        val: data.firstName,
        touched: true,
        valid: true,
        error: "",
      },
    });
    dispatch({
      type: "update",
      data: {
        key: "mname",
        val: data.middleName,
        touched: true,
        valid: true,
        error: "",
      },
    });

    dispatch({
      type: "update",
      data: {
        key: "lname",
        val: data.lastName,
        touched: true,
        valid: true,
        error: "",
      },
    });

    dispatch({
      type: "update",
      data: {
        key: "adhaar",
        val: data.adhaar,
        touched: true,
        valid: true,
        error: "",
      },
    });
    dispatch({
      type: "update",
      data: {
        key: "accountNumber",
        val: data.accountNumber,
        touched: true,
        valid: true,
        error: "",
      },
    });

    dispatch({
      type: "update",
      data: {
        key: "phone",
        val: data.phoneNumber,
        touched: true,
        valid: true,
        error: "",
      },
    });
  };

  const handleReset = () => {
    initializeVlcState(obj1);
    setCancelDisabled(!cancelDisabled);
    setSubmitDisabled(!submitDisabled);
  };

  const handleChange = (key, value) => {
    const { valid, error } = validateData(key, value);
    let formValid = true;
    for (let k in vlc) {
      if (vlc[k] && vlc[k].valid === false) {
        formValid = false;
        break;
      }
    }
    dispatch({
      type: "update",
      data: {
        key,
        val: value,
        touched: true,
        valid,
        error,
        formValid: formValid,
      },
    });
  };

  const toggleDisable = () => {
    setSubmitDisabled(!submitDisabled);
    setCancelDisabled(!cancelDisabled);
  };

  const validateData = (key, value) => {
    console.log(key, value);
    let valid = true;
    let error = "";
    switch (key) {
      case "fname":
      case "mname":
      case "lname":
        var pattern = new RegExp("^[a-zA-Z]{3,}$");
        if (!pattern.test(value)) {
          valid = false;
          error = "Invalid Name (Only Alphabets allowed)";
        }
        break;
      case "phone":
        pattern = /^\d{10}$/;
        if (!pattern.test(value)) {
          valid = false;
          error = "Invalid Phone Number";
        }
        break;

      case "adhaar":
        pattern = /^\d{12}$/;
        if (!pattern.test(value)) {
          valid = false;
          error = "Invalid Adhaar Number";
        }
        break;
      case "accountNumber":
        pattern = /^\d{10}$/;
        if (!pattern.test(value)) {
          valid = false;
          error = "Invalid Account Number";
        }
        break;

      default:
        console.log("default switch");
    }
    return { valid: valid, error: error };
  };

  const submitData = (e) => {
    e.preventDefault();

    if (vlc.formValid === false) {
      setAlertType("alert-danger");
      showErrorMessage("Form is not valid. Please check the fields.", 5000);
      return;
    }

    var reqbody = JSON.stringify({
      userId: data.id,
      userName: obj1.uid,
      password: obj1.pwd,
      phoneNumber: vlc.phone.value,
      gender: vlc.gender,
      role: {
        roleId: 3,
      },
      adhaar: vlc.adhaar.value,
      accountNumber: vlc.accountNumber.value,
      securityQuestion: {
        securityQuestionId: vlc.question,
      },
      answer: obj1.answer.value,
      id: vlc.vlcid,
      firstName: vlc.fname.value,
      middleName: vlc.mname.value,
      lastName: vlc.lname.value,
      education: vlc.education,
      address: {
        addressLine1: obj1.address1,
        addressLine2: obj1.address2,
        city: {
          cityName: obj1.city,
          state: {
            stateName: obj1.state,
          },
        },
      },
    });

    fetch("http://localhost:8080/updateVlc", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: reqbody,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === 1) {
          setAlertType("alert-success");
          showErrorMessage("Updated successfully.", 5000);
          return;
        }
        if (data.msg === 0) {
          setAlertType("alert-danger");
          showErrorMessage("Failed to update. Please try again.", 5000);
          return;
        }
        setAlertType("alert-danger");
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlertType("alert-danger");
        showErrorMessage("Error", 5000);
      });
    setCancelDisabled(!cancelDisabled);
    setSubmitDisabled(!submitDisabled);
  };

  console.log(JSON.stringify(vlc));

  return (
    <div id="formContainer">
      <form id="vlcForm">
        <div className="container mt-5 mb-5 border border-dark rounded ">
          <div className="mt-3 mb-5 display-5 text-center">VLC PROFILE</div>
          {/* First row */}
          <div className="row">
            <div className="col">
              <div className="mb-3 border bg-light rounded p-2">
                <label htmlFor="fname">First Name:</label>
              </div>
            </div>
            <div className="col">
              <div className="mb-3 border bg-light rounded p-2">
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  defaultValue={obj1.firstName}
                  disabled={submitDisabled}
                  onChange={(e) => {
                    handleChange("fname", e.target.value);
                  }}
                  onBlur={(e) => {
                    handleChange("fname", e.target.value);
                  }}
                />
                <span className="error text-danger">
                  {vlc.fname.touched && !vlc.fname.valid && vlc.fname.error}
                </span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="mb-3 border bg-light rounded p-2">
                <label htmlFor="mname">Middle Name:</label>
              </div>
            </div>
            <div className="col">
              <div className="mb-3 border bg-light rounded p-2">
                <input
                  type="text"
                  id="mname"
                  name="mname"
                  defaultValue={obj1.middleName}
                  disabled={submitDisabled}
                  onChange={(e) => {
                    handleChange("mname", e.target.value);
                  }}
                  onBlur={(e) => {
                    handleChange("mname", e.target.value);
                  }}
                />
                <span className="error text-danger">
                  {vlc.mname.touched && !vlc.mname.valid && vlc.mname.error}
                </span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="mb-3 border bg-light rounded p-2">
                <label htmlFor="lname">Last Name:</label>
              </div>
            </div>
            <div className="col">
              <div className="mb-3 border bg-light rounded p-2">
                <input
                  type="text"
                  id="lname"
                  name="lname"
                  defaultValue={obj1.lastName}
                  disabled={submitDisabled}
                  onChange={(e) => {
                    handleChange("lname", e.target.value);
                  }}
                  onBlur={(e) => {
                    handleChange("lname", e.target.value);
                  }}
                />
                <span className="error text-danger">
                  {vlc.lname.touched && !vlc.lname.valid && vlc.lname.error}
                </span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="mb-3 border bg-light rounded p-2">
                <label htmlFor="adhar">Adhar:</label>
              </div>
            </div>
            <div className="col">
              <div className="mb-3 border bg-light rounded p-2">
                <input
                  type="text"
                  id="adhaar"
                  name="adhaar"
                  defaultValue={obj1.adhaar}
                  disabled={submitDisabled}
                  onChange={(e) => {
                    handleChange("adhaar", e.target.value);
                  }}
                  onBlur={(e) => {
                    handleChange("adhaar", e.target.value);
                  }}
                />
                <span className="error text-danger">
                  {vlc.adhaar.touched && !vlc.adhaar.valid && vlc.adhaar.error}
                </span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="mb-3 border bg-light rounded p-2">
                <label htmlFor="accno">Account Number:</label>
              </div>
            </div>
            <div className="col">
              <div className="mb-3 border bg-light rounded p-2">
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  defaultValue={obj1.accountNumber}
                  disabled={submitDisabled}
                  onChange={(e) => {
                    handleChange("accountNumber", e.target.value);
                  }}
                  onBlur={(e) => {
                    handleChange("accountNumber", e.target.value);
                  }}
                />
                <span className="error text-danger">
                  {vlc.accountNumber.touched &&
                    !vlc.accountNumber.valid &&
                    vlc.accountNumber.error}
                </span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="mb-3 border bg-light rounded p-2">
                <label htmlFor="phone">Phone:</label>
              </div>
            </div>
            <div className="col">
              <div className="mb-3 border bg-light rounded p-2">
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  defaultValue={obj1.phoneNumber}
                  disabled={submitDisabled}
                  onChange={(e) => {
                    handleChange("phone", e.target.value);
                  }}
                  onBlur={(e) => {
                    handleChange("phone", e.target.value);
                  }}
                />
                <span className="error text-danger">
                  {vlc.phone.touched && !vlc.phone.valid && vlc.phone.error}
                </span>
              </div>
            </div>
          </div>

          <div className="row text-center m-3">
            <div
              className={`col alert text-center d-flex justify-content-center ${alertType} p-2 w-75 ${
                displayAlert ? "d-block" : "d-none"
              }`}
              role="alert"
            >
              {errorMsg}
            </div>
          </div>
          
          <div className="row text-center m-3">
            <div className="col"></div>
            <div className="col">
              <button type="button" id="editBtn" onClick={toggleDisable}>
                Edit
              </button>
              <button
                type="button"
                id="submitBtn"
                onClick={submitData}
                disabled={submitDisabled}
              >
                Submit
              </button>
              <button
                type="button"
                id="cancelBtn"
                onClick={handleReset}
                disabled={cancelDisabled}
              >
                Cancel
              </button>
            </div>
            <div className="col"></div>
          </div>

        </div>
      </form>
      {/* {JSON.stringify(vlc)} */}
    </div>
  );
}
