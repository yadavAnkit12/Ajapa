import React from 'react';
import { CardContent, Card, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
const style = {
    width: '50%',
    margin: 'auto',
    marginTop: '100px',
    padding: '5px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
};
const Confirmation = () => {
    const navigate=useNavigate()
    const handleLogin = () => {
        navigate('/sign-in')
    };

    return (
        <Card sx={style}>
            <CardContent>
                <div style={{fontStyle:'normal',fontSize:'24px',lineHeight:'28px',letterSpacing:'0px',textAlign:'center',fontWeight:'bold'}}>
                    <img className="w-95" src="assets/images/logo/logo1.png" alt="logo" style={{ margin: '0 auto' }} />
                    <hr style={{ border: '2px solid #72A0C1', margin: '10px 0' }} />
                    <div style={{ textAlign: 'center', lineHeight: '20px' }}>
                        <h3 >Dear User,</h3>
                        <h3 >Your request has been received successfully!</h3>
                        <h3 >You can explore all our services by login after Approval</h3>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{ margin: '20px 0', width: 'auto' }}
                            onClick={handleLogin}
                        >
                            Log In
                        </Button>
                        <h3 >Thank you for choosing our platform!</h3>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default Confirmation;
