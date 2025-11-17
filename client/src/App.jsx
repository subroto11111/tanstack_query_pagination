import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Alert,
  Button,
  Stack
} from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchStudents = async ({ queryKey }) => {
  const response = await axios.get('http://localhost:4000/api/students', {
    params: {
      cursor: queryKey[1],
    }
  });
  return response.data;
};

function App() {
  const [cursor, setCursor] = useState(0);
  const { data: studentsData, isLoading, error, refetch, isFetching, isPlaceholderData } = useQuery({
    queryKey: ['students', cursor],
    queryFn: fetchStudents,
    placeholderData: keepPreviousData
  });
  console.log(studentsData)
  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={loadingContainerStyles}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={errorContainerStyles}>
        <Alert severity="error">
          Failed to load students: {error.message}
        </Alert>
      </Container>
    );
  }
  return (
    <Container maxWidth="xl" sx={mainContainerStyles}>


      <Grid container spacing={4}>
        {studentsData?.data?.map((student) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={student.id}>
            <Card sx={cardStyles}>
              <CardContent sx={cardContentStyles}>
                <Avatar src={student.avatar} sx={avatarStyles}>
                  {student.name.split(' ').map(n => n[0]).join('')}
                </Avatar>

                <Typography variant="h6" gutterBottom sx={nameStyles}>
                  {student.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={descriptionStyles}>
                  {student.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Stack direction={"row"} justifyContent="center" alignItems="center">
        <Button disabled={studentsData.hasMore === false} onClick={() => {
          if (studentsData.hasMore) {
            setCursor(studentsData.nextCursor);
          }
        }} variant="contained" color="primary" sx={{ mt: 4 }}>
          Load More
        </Button>

      </Stack>
    </Container>
  );
}

// Clean organized styles
const mainContainerStyles = {
  py: 4
};

const loadingContainerStyles = {
  py: 4,
  display: 'flex',
  justifyContent: 'center'
};

const errorContainerStyles = {
  py: 4
};

const titleStyles = {
  textAlign: 'center',
  mb: 4
};

const cardStyles = {
  height: '100%',
  borderRadius: 2,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    transform: 'translateY(-2px)'
  }
};

const cardContentStyles = {
  textAlign: 'center',
  p: 4
};

const avatarStyles = {
  width: 100,
  height: 100,
  mx: 'auto',
  mb: 3,
  border: '4px solid #f5f5f5',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

const nameStyles = {
  fontWeight: 600,
  color: '#2c3e50',
  mb: 2
};

const descriptionStyles = {
  lineHeight: 1.6,
  fontSize: '0.875rem'
};

export default App