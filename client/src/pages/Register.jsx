import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { toast } from "react-toastify";
import img1 from "../Images/fig1.png";

const defaultTheme = createTheme();

export default function SignInSide({ setNav }) {
  React.useEffect(() => {
    setNav(false);
  }, []);

  let navigate = useNavigate();
  const [userInfo, setUserInfo] = React.useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = React.useState({});

  const handleChangeUserInfo = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateFields = () => {
    const newErrors = {};
    if (!userInfo.name) newErrors.name = "Name is required";
    if (!userInfo.phone) newErrors.phone = "Phone number is required";
    if (!userInfo.email) newErrors.email = "Email is required";
    if (!userInfo.password) newErrors.password = "Password is required";
    if (!userInfo.confirmPassword) newErrors.confirmPassword = "Re-entering the password is required";
    if (userInfo.password !== userInfo.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    axios
      .post(`http://localhost:4000/customer/Register`, userInfo)
      .then((response) => {
        if (response.data.success) {
          navigate("/login");
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred. Please try again.");
      });
  };

  const Font = {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "700",
    fontSize: "20px",
    lineHeight: "21px",
    color: "rgba(0, 0, 0, 0.7)",
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${img1})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: 3,
          [defaultTheme.breakpoints.down("sm")]: {
            padding: 2,
          },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Typography component="h1" variant="h5" sx={Font}>
            Register
          </Typography>
          <TextField
            onChange={handleChangeUserInfo}
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            onChange={handleChangeUserInfo}
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number"
            name="phone"
            autoComplete="phone"
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <TextField
            onChange={handleChangeUserInfo}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            onChange={handleChangeUserInfo}
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            onChange={handleChangeUserInfo}
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            label="Re-enter Password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
          <Button
            onClick={handleSubmit}
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "#3A244A",

              mb: 2,
              boxShadow: "5px 5px 250px #657E96",
              borderRadius: "10px",
              height: "50px",
            }}
          >
            Register
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign In
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
