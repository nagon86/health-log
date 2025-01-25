import React from "react";
import { Container, Typography } from "@mui/material";
import DataForm from "../components/DataForm";

const FormPage: React.FC = () => {
    return (
        <Container>
            <Typography variant="h3">Insert Data</Typography>
            <DataForm />
        </Container>
    );
};

export default FormPage;
