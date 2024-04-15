import React from "react";
import { Typography } from "@mui/material";


export default function ContactUs() {
  return (
    <>
      {/* <Helmet>
        <title>Ajikya's Application1</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet> */}
      <div className="flex flex-col items-center justify-start w-full gap-[100px] overflow-auto bg-gray-50_01">
        <div className="flex flex-col items-center justify-start w-full gap-[60px]">
          {/* <Header1 className="flex justify-center items-center w-full md:h-auto p-[19px] bg-white-A700" /> */}
          <div className="flex flex-row justify-center w-full">
            <div className="flex flex-col items-center justify-start w-full gap-11 md:px-5 max-w-[1200px]">
              <div className="flex flex-col items-center justify-start w-full pt-0.5 gap-[15px]">
                <Typography  className="tracking-[-1.08px] text-center">
                  Get in touch
                </Typography>
                <Typography  className="!text-gray-600_02 text-center">
                  On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and
                  demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee
                  the pain and trouble.
                </Typography>
              </div>
              <div className="flex flex-row md:flex-col justify-start items-center w-full gap-[50px] p-[23px] md:gap-5 sm:p-5 border-blue_gray-100_01 border border-solid bg-white-A700 rounded-[10px]">
                <div className="flex flex-col items-center justify-start w-[44%] md:w-full ml-[25px] gap-10 sm:ml-5">
                  <div className="flex flex-col items-start justify-start w-full pt-[3px] gap-[19px]">
                    <Typography size="2xl" as="h2" className="tracking-[-0.56px]">
                      Send a message
                    </Typography>
                    <div className="flex flex-col items-center justify-start w-full gap-3">
                      {/* <Input
                        shape="round"
                        type="text"
                        name="message"
                        placeholder="Full Name"
                        prefix={<Img src="images/img_icon_24px_user.svg" alt="icon / 24px / user" />}
                        className="w-full gap-3.5 font-semibold border-blue_gray-100_01 border border-solid"
                      />
                      <Input
                        shape="round"
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        prefix={<Img src="images/img_icon_24px_email.svg" alt="icon / 24px / email" />}
                        className="w-full gap-3.5 font-semibold border-blue_gray-100_01 border border-solid"
                      />
                      <Input
                        shape="round"
                        type="number"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        prefix={<Img src="images/img_icon_20px_call.svg" alt="icon / 24px / call" />}
                        className="w-full gap-3.5 font-semibold border-blue_gray-100_01 border border-solid"
                      />
                      <TextArea
                        shape="round"
                        name="inputbox_one"
                        placeholder="Message"
                        className="w-full sm:pb-5 sm:pr-5 text-gray-600_02 font-semibold"
                      /> */}
                    </div>
                  </div>
                  {/* <Button size="2xl" shape="round" className="w-full sm:px-5">
                    Send Request
                  </Button> */}
                </div>
                <div className="h-[534px] w-px md:w-full md:h-px my-[25px] bg-blue_gray-100_01" />
                <div className="flex flex-col items-center justify-start w-[46%] md:w-full gap-10">
                  <div className="flex flex-col items-center justify-start w-[96%] md:w-full gap-4">
                    <div className="flex flex-col items-start justify-start w-full gap-[3px]">
                      <Typography  className="tracking-[-0.40px]">
                        Office Address
                      </Typography>
                      <Typography  className="!text-gray-600_02 !font-semibold">
                        <>
                          1421 San Pedro St, Los Angeles, <br />
                          CA 90015
                        </>
                      </Typography>
                    </div>
                    <div className="flex flex-col items-center justify-start w-full gap-2.5">
                      <div className="flex flex-row justify-start items-center w-full gap-[13px] py-0.5">
                        {/* <Img src="" alt="icon24pxcall" className="h-[24px] w-[24px]" /> */}
                        <Typography  className="!text-gray-600_02 !font-semibold">
                          (123) 456-7890
                        </Typography>
                      </div>
                      <div className="flex flex-row justify-start items-center w-full gap-3 py-0.5">
                        {/* <Img src="" alt="icon24pxemail" className="h-[24px] w-[24px]" /> */}
                        <Typography className="mt-0.5 !text-gray-600_02 !font-semibold">
                          info@mail.com
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-start w-full gap-3">
                    <Typography  className="tracking-[-0.40px]">
                      Social
                    </Typography>
                    <div className="flex flex-row justify-start gap-4">
                      <img
                        src=""
                        alt="socialicon_one"
                        className="h-[30px] w-[30px]"
                      />
                      <img src="" alt="socialicon" className="h-[30px] w-[30px]" />
                      {/* <Img
                        src=""
                        alt="socialicon_five"
                        className="h-[30px] w-[30px]"
                      />
                      <Img src="" alt="socialicon" className="h-[30px] w-[30px]" />
                      <Img src="" alt="socialiconrss" className="h-[30px] w-[30px]" /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Footer className="flex justify-center items-center w-full pl-[74px] pr-14 gap-[115px] py-[74px] md:p-5 bg-white-A700" /> */}
      </div>
    </>
  );
}
