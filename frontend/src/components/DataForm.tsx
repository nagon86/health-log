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

const DataForm: React.FC = () => {
  const [date, setDate] = useState<Dayjs>(dayjs().startOf("day"));
  const [headache, setHeadache] = useState<number>(0);
  const [shoulderache, setShoulderache] = useState<number>(0);
  const [medicineOptions, setMedicineOptions] = useState<{
    [key: string]: number;
  }>({
  });
  const [medicine, setMedicine] = useState<{ [key: string]: number }>({
  });
  const [text, setText] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getMedicines()
  }, []);

  const getMedicines = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized. Please login.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get("http://localhost:3001/medicines", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedicineOptions(response.data);
    } catch (error) {
      alert("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized. Please login.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:3001/data",
        {
          date: date.startOf("day").toISOString(),
          headache,
          shoulderache,
          medicine,
          text,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Data saved successfully!");
    } catch (error) {
      alert("Error saving data");
    }
  };

  return loading ? <CircularProgress /> : (
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
  );
};

export default DataForm;
