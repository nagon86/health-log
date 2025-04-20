import React, { useState, useEffect } from "react";
import {
  Rating,
  Stack,
  Button,
  Box,
  Typography,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import AlertSnack from "./AlertSnack";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const DataForm: React.FC = () => {
  const [date, setDate] = useState<Dayjs>(dayjs().startOf("day"));
  const [headache, setHeadache] = useState<number>(0);
  const [shoulderache, setShoulderache] = useState<number>(0);
  const [medicineOptions, setMedicineOptions] = useState<{
    [key: string]: number;
  }>({});
  const [medicine, setMedicine] = useState<{ [key: string]: number }>({});
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMedicines = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please login.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/medicines`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMedicineOptions(response.data);
      } catch (error) {
        alert("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    getMedicines();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized. Please login.");
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/data`, {
          params: {
            startDate: date.startOf("day").toISOString(),
            endDate: date.endOf("day").toISOString(),
          },
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response.data) && response.data.length > 0) {
          const { headache, shoulderache, medicine, text } = response.data[0];
          setMedicine({ ...medicine });
          setHeadache(headache);
          setShoulderache(shoulderache);
          setText(text);
        } else {
          setMedicine({})
          setHeadache(0);
          setShoulderache(0);
          setText("");
        }
      } catch (error) {
        alert("Error fetching data");
      }
    };
    fetchData();
  }, [date]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized. Please login.");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/data`,
        {
          date: date.startOf("day").toISOString(),
          headache,
          shoulderache,
          medicine,
          text,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Successful added data");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        await axios.put(
          `${API_URL}/data`,
          {
            date: date.startOf("day").toISOString(),
            headache,
            shoulderache,
            medicine,
            text,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Successfullu updated data");
        return;
      }
      setSuccess(null);
    }
  };

  return loading ? (
    <CircularProgress />
  ) : (
    <>
      <AlertSnack
        open={!!success}
        handleClose={(_, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setSuccess(null);
        }}
        severity="success"
        message={success || "Success"}
      />
      <AlertSnack
        open={!!error}
        handleClose={(_, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setError(null);
        }}
        severity="error"
        message={error || "Error"}
      />
      <Stack spacing={2}>
        <DatePicker
          value={date}
          onChange={(newValue) => {
            if (newValue) {
              setDate(newValue);
            }
          }}
        />
        <Box sx={{ "& > legend": { mt: 2 } }}>
          <Typography component="legend">Headache</Typography>
          <Rating
            name="headache"
            value={headache}
            max={10}
            onChange={(event, value) => {
              if (value) {
                setHeadache(value);
              }
            }}
          />
        </Box>
        <Box sx={{ "& > legend": { mt: 2 } }}>
          <Typography component="legend">Shoulderache</Typography>
          <Rating
            name="shoulderache"
            value={shoulderache}
            max={10}
            onChange={(event, value) => {
              if (value) {
                setShoulderache(value);
              }
            }}
          />
        </Box>
        <FormGroup>
          {Object.entries(medicineOptions).map(([id, str]) => (
            <FormControlLabel
              key={id}
              control={
                <Checkbox
                  checked={!!medicine[id] && medicine[id] > 0}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setMedicine((prev) => ({
                      ...prev,
                      [id]: event.target.checked ? 1 : 0,
                    }));
                  }}
                />
              }
              label={str}
            />
          ))}
        </FormGroup>
        <TextField
          label="Text"
          variant="outlined"
          multiline
          fullWidth
          value={text}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setText(event.target.value);
          }}
        />

        <Button onClick={() => handleSubmit()}>Submit</Button>
      </Stack>
    </>
  );
};

export default DataForm;
