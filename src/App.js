import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import FileUpload from './components/InputForm';
import CoursePrediction from './components/PredictionTable';

function App() {
  const [data, setData] = useState([]);

  const handleDataLoaded = (salesData) => {
    setData(salesData);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          
            
          Courses Prediction Dashboard
          
        </Typography>
        <input type="text"/>
        <label type="text">Input Course</label>
        <button type="submit" placeholder = "Submit" />
        <FileUpload onDataLoaded={handleDataLoaded} />
        {data.length > 0 && <CoursePrediction data={data} />}
        
      </Box>
    </Container>
  );
}

export default App;
