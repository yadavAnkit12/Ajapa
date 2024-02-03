import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';


function EventFormHead(props) {
    const theme = useTheme()
    return <>
        <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-32 px-24 md:px-32">
            <div className="flex flex-col items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
                >
                </motion.div>

                <div className="flex items-center max-w-full">
                    <Typography
                        component={motion.span}
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.2 } }}
                        delay={300}
                        style={{fontStyle:'normal',fontSize:'24px',lineHeight:'28px',letterSpacing:'0px',textAlign:'center',fontWeight:'bold'}}
                    >
                        {props?.eventId?'Event Updation':'Event Creation'}
                        
                    </Typography>
                </div>
            </div>
            <motion.div
                className="flex"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
            >

                <Button
                    className="whitespace-nowrap mx-4"
                    variant="contained"
                    color="secondary"
                    // disabled={props?.disabled}
                    onClick={() => props.handleSubmit(props.values)}
                >
                    Save
                </Button>
            </motion.div>
        </div>
    </>

}

export default EventFormHead