    import React, {useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    
    export default function UploadSect() {
        const SERVER_IP = "http://localhost:5000";
        const navigate = useNavigate();
        const [countdown, setCountdown] = useState(null);
        useEffect(() => {
            if (countdown === 0) {
                console.log('leyew');
                navigate('/report');
                //should be pushing
            } else if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(countdown - 1), 1000); 
                return () => clearTimeout(timer);
            }
        }, [countdown, navigate]);
        const handleUpload = () => {
            const file = event.target.files;
            if (file[0].type==="image/png" || file[0].type==="image/jpg"){
                renderButton();
            }
            else {
                alert("Only PNG or JPG files are allowed.");
                resetButton();
            }
            //subsequently render a upload button
        };

        function handleRequest(event) {
            event.preventDefault();
            resetButton();
            wait_text();
            uploadFile();
        }
        function uploadFile() {
            // this function handles the uploading of the image file to the flask api server (hosted locally and each file)
            // is found and deleted.
            const image_input = document.getElementById("image_upload");
            if (image_input.files.length > 0) {
                const image = image_input.files[0];
                //Use formData api to call
                const formData = new FormData();
                formData.append("image", image);
                console.log(image);
                fetch(SERVER_IP + "/upload", {
                    method: "POST",
                    body: formData,
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text(); 
                })
                // for debugging purposes, can remove lter
                .then(data => console.log("Success: ", data))
                .catch(error => console.error('Error: ', error));
            }
            //here for countdown
            setCountdown(15);
        }
        const renderButton = () => {
            const newButton = (
                <button key= {buttons.length} className="rounded-md h-10 w-40
                bg-green-600 p-1 focus:outline-none
                text-slate-200 hover:text-white hover:bg-green-800"
                onClick={(event) => handleRequest(event)}>Upload</button>
                )
                
                setButtons([newButton]);
            }
            const wait_text = () => {
                const text = (
                    <>
                        <p>In the meantime, feel free to grab a cup of coffee or tea!☕</p>
                    </>
                )
                const button = (
                    <>
                    </>
            )
            setContent([text]);
            setButtons([button]);
        }
        const resetButton = () => {
            setButtons([]);
        }
        const init_content = (
            <>
            <h2>Upload a file of the format ending in .jpg, .png</h2>
                <div id="innerDiv" className="flex justify-center items-center mt-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <label className="block">
                        <input type="file" className="w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-violet-50 file:text-violet-600
                            hover:file:bg-violet-100" id = "image_upload" name="image"
                            onChange={handleUpload}
                            />
                    </label>
                </div>
                </>
        )
        const [buttons, setButtons] = useState([]);
        const [content, setContent] = useState([init_content]);
        return (
            <div>
                <form className="flex flex-col justify-center items-center bg-slate-200 h-screen">
                    <div id="initialContent">
                    {countdown !== null && (
                    <div>Redirecting in {countdown} seconds...</div> )}
                        {content.map(element => element)}
                    </div>
                    <div id="uploadButton" className="mt-10 justify-center items-center">
                        {buttons.map(button => button)}
                    </div>
                </form>
            </div>
        );
    }

    