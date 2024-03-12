import { Typography } from "@mui/material";


function UserEventHeader(props) {





    return (
        <>
            <div className="w-full flex flex-col min-h-full">
                <div className='flex sm:flex-row flex-wrap flex-col justify-between mx-10  mb-10 shadow-1 rounded-16 py-2'>
                    <div className="flex sm:flex-row flex-wrap flex-col justify-start p-2">
                        <Typography variant="h3"            style={{fontStyle: "normal",fontSize: "24px",lineHeight: "28px", letterSpacing: "0px", textAlign: "center", fontWeight: "bold"}}>
                            Upcoming Events
                        </Typography>

                    </div>
                </div>
            </div>
        </>
    );
}

export default UserEventHeader;
