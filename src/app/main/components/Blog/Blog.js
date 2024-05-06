import { Card } from "@mui/material"
import { useEffect, useState } from "react";
import { eventAPIConfig } from "../../API/apiConfig";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { Box } from "@mui/system";
import BlogForm from "./BlogForm";

const Blog = () => {
    const dispatch = useDispatch()


    return <Box sx={{ width: '100%', padding: 2 }}>
        <Card className='shadow-5' sx={{ padding: { md: '16px 64px', sm: '16px' }, margin: '0 auto', maxWidth: '700px' }}>
            <BlogForm  />

        </Card>
    </Box>
}

export default Blog