
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


const Navbar = () => {
  return (
    <Box sx={{ flexGrow: 1 }} >
      <AppBar position="static" sx={{backgroundColor: "#171718"}}>
        <Toolbar variant="dense">
          <Typography   variant="h6" component="div">
          
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
export default Navbar
