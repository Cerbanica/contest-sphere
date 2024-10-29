"use client";
import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { categoriesList, contestPromptAI } from "../dataList";
import { DynamicForm, LeGeminiAnalyzer, LeTextInput, LeDateInput, LeTextArea,LeListbox,  LeDynamicInputList } from "../components";
import supabase from '@/utils/supabaseClient';

import { useAuth } from '@/utils/useAuth';
import { useRouter } from 'next/navigation';


// Your API Key


const Page = () => {
  const prompt = contestPromptAI;
  const [output, setOutput] = useState("(Results will appear here)");
  const[error,setError]=useState("Click the button to auto-fill the form");
  const [showForm, setShowForm] = useState(false);
  const router = useRouter(); // Next.js router for redirection
  //const userAuth = useAuth();

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const defaultFormData = {
    title: '',
    organizer: '',
    category: '',
    description: '',
    startdate: null,
    mainPrize: '',
    deadline: '',
    prizeList: [],
    judgeList: [],
    winnerAnnouncement: null,
    entryFee: '',
    eligibility: '',
    submission: '',
    linkToPost: '',
    prizeRange: 0,
    linkToPost: '',
    howToEnter:'',
    linkToThumbnail: '',
  }
  const [formData, setFormData] = useState(defaultFormData);
 /*  useEffect(() => {
    if (userAuth) {
      setUser(userAuth);
    
      fetchUserContests(userAuth.email);
    }else{
      alert("not logged");
    }
  }, [userAuth]); */

  const handleSubmit = async ({ files, textInput }) => {
    //e.preventDefault();
    setOutput("Generating...");
    setError("Generating...");

    try {
      // Check if no files are uploaded and no text input is provided
      if (files.length === 0 && (!textInput || textInput.trim() === "")) {
        let ErrorText="Please upload at least one image or enter contest details.";
        setError(ErrorText)
        throw new Error(ErrorText);
      }

      let imagesBase64 = [];
      let contents = [];

      if (files.length > 0) {
        // Convert images to base64 if any files are uploaded
        imagesBase64 = await Promise.all(files.map((file) => getBase64(file)));

        // Create contents for AI analysis with image and predefined prompt
        contents = [
          {
            role: "user",
            parts: [
              ...imagesBase64.map((imageBase64) => ({
                inline_data: { mime_type: "image/jpeg", data: imageBase64 },
              })),
              { text: prompt }, // Predefined image prompt
            ],
          },
        ];
      } else {

        // If no image is uploaded, use the text input in place of the image
        contents = [
          {
            role: "user",
            parts: [

              { text: prompt }, // Predefined text prompt
              { text: textInput },
              // Use the provided textInput as a replacement for the image
            ],
          },
        ];
      }

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
      });

      const result = await model.generateContentStream({ contents });

      //ensure that the parsed data is fully completed
      let parsedData = "";
      for await (let response of result.stream) {
        parsedData += response.text();
      }

      const realTitle = extractField(parsedData, "Title") || "";
      const realOrganizer = extractField(parsedData, "Organizer") || "";
      const realCategory = extractField(parsedData, "category") || "";
      const realDescription = extractField(parsedData, "description") || "";


      const realDeadline = extractField(parsedData, "Deadline") || "";
      const realStartDate = extractField(parsedData, "StartDate") || "";
      const realWinnerAnnouncement = extractField(parsedData, "WinnerAnnouncement") || "";

      const mainPrizeValue = extractField(parsedData, "mainPrizeValue") || "";
      const realPrize = extractField(parsedData, "MainPrize") || "";
      const prizeCategory = extractField(parsedData, "prizeCategoryList") || "";
      const realEntryFee = extractField(parsedData, "entryFee") || "";

      const judges = extractField(parsedData, "judgeList") || "";
      const howToEnter = extractField(parsedData, "HowToEnter") || "";
      
      const eligibility = extractField(parsedData, "eligibility") || "";
      const submission = extractField(parsedData, "submission") || "";
      const linkToPost = extractField(parsedData, "linkToPost") || "";


      // Calculate prize range
      let prizeRange = 0;
      if (parseInt(mainPrizeValue)) {
        const prize = parseInt(mainPrizeValue);
        if (prize > 50) prizeRange = 1;
        if (prize > 500) prizeRange = 2;
        if (prize > 1000) prizeRange = 3;
        if (prize > 5000) prizeRange = 4;
        if (prize > 10000) prizeRange = 5;
      }
      setOutput(parsedData);
      setError("Form has been auto-filled! Click again if you're not satisfied");

      let mappedPrizes;
      let mappedJudges;
      let prizeList;


      if (prizeCategory !== "" && prizeCategory !== "NA") {
        prizeList = prizeCategory.replace(/[\[\]]/g, "").split("#");

        // Map the prizes directly and use it in setFormData
        mappedPrizes = prizeList.map((prize) => {
          const [label, value] = prize.split(':');
          return { label: label.trim(), value: value.trim() };
        });
      } else {
        mappedPrizes = [];
      }

      // Check if the judges data exists and is not an empty string
      if (judges !== "") {
        // Process the judge list
        let judgeList = judges.replace(/[\[\]]/g, "").split(",");
        mappedJudges = judgeList.map((prize, index) => {
          const [label, value] = prize.split('@');
          return {
            label: `Judge ${index + 1}`,
            value: value.trim() === "" ? `${label.trim()} ` : `${label.trim()} @ ${value.trim()}`
          };

        });
      } else {
        // If no judge list is provided, initialize an empty array
        mappedJudges = [];
      }



      setFormData({
        title: realTitle || formData.title,
        organizer: realOrganizer || formData.organizer,
        category: realCategory || formData.category,
        description: realDescription,

        startdate: realStartDate,
        deadline: realDeadline || formData.description,
        winnerAnnouncement: realWinnerAnnouncement || formData.winnerAnnouncement,

        mainPrize: realPrize || formData.prize,
        prizeList: mappedPrizes || formData.prizeList,
        prizeRange: prizeRange || formData.prizeRange,
        entryFee: realEntryFee,
        howToEnter: howToEnter,
        judgeList: mappedJudges || formData.judgeList,
        
        eligibility: eligibility,
        submission: submission,
        linkToPost: linkToPost,



      });
      setShowForm(true);
    } catch (error) {
      setOutput(`${error.message}`);
      handleSubmit;
    }

  };


  const extractField = (text, fieldName) => {
    const escapedFieldName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`${escapedFieldName}\\s*=\\s*(.*?)\\s*(?:\\n|$)`, "i");
    const match = text.match(regex);
    return match ? match[1].trim() : "";
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };
  // Handle category change
  const handleCategoryChange = (target) => {
    setFormData({
      ...formData,
      category: target.value,
    });
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    alert(JSON.stringify(formData));


    try {
      const { data, error } = await supabase
        .from('contests')
        .insert([{
          title: formData.title || 'No title',
          category: formData.category || "No Categories",
          description: formData.description,
          organizer: formData.organizer,
          startdate: null,
          deadline: formatDate(formData.deadline) || "12/09/1869",
          mainPrize: formData.mainPrize,
          status: "On Going",
          prizeRange: formData.prizeRange,
          prizeList: formData.prizeList,
          judges: formData.judgeList,
          entryFee: formData.entryFee,
          winnerAnnouncement: formatDate(formData.winnerAnnouncement) || null,
          eligibility: formData.eligibility,
          linkToPost: formData.linkToPost,
          howToEnter: formData.howToEnter,
          linkToThumbnail: formData.linkToThumbnail,


        }]);

      if (error) throw error; // Catch and throw error if occurs

      alert("Data submitted successfully!");
      // Reset formData
      setFormData(defaultFormData);

    } catch (error) {
      console.error("Error inserting data into Supabase:", error);
    }
  };

  const updateList = (listType, newList) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [listType]: newList,
    }));
  };


  const formatDate = (dateString) => {
    if (dateString == null || dateString == "NA" || dateString == "") {
      return null;
    }
    // If the date is in DD/MM/YYYY format, convert it to YYYY-MM-DD
    const [day, month, year] = dateString.split("/");
    if (day && month && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateString; // Return as-is if it's already in YYYY-MM-DD format
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 default border shadow-md rounded-md mb-64">

      <LeGeminiAnalyzer handleSubmit={handleSubmit} />
      <div className="w-full flex justify-center mt-2">
    <span className="text-default-2 text-center  ">{error}</span>
  </div>
       <div className="output-box mt-8 p-4 rounded-md border">
       
        <h3 className="text-xl font-semibold mb-4">AI Output</h3>
        <div className="output" dangerouslySetInnerHTML={{ __html: output }} />
      </div>
 


      {showForm && (
        <>
          <h2 className="text-2xl font-bold pt-4 text-center mt-12 mb-6 default border-t">Generated Form</h2>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="form-group ">

              <LeTextInput title="Title" name="title" value={formData.title} onChange={handleFormChange} />
             
              <div className="flex flex-row space-x-2">
                <div className="flex-1">
                <LeTextInput title="Organizer" name="organizer" value={formData.organizer} onChange={handleFormChange} />

                </div>
                <div className="flex-1">
                <label htmlFor="category" className="block text-lg text-default-2 mt-4">Category</label>
              <LeListbox items={categoriesList} selectedItem={formData.category} onSelect={handleCategoryChange} />

                </div>

              </div>
              <LeTextArea title="Description" name="description" value={formData.description} onChange={handleFormChange} rows={4} />
              <LeTextArea title="How To Enter" name="howToEnter" value={formData.howToEnter} onChange={handleFormChange} rows={4} />

              <div className="flex flex-row space-x-2">
                <div className="flex-1">
                  <LeDateInput title="Start Date" name="startdate" value={formatDate(formData.startdate)} onChange={handleFormChange} />

                </div>
                <div className="flex-1">
                  <LeDateInput title="Deadline" name="deadline" value={formatDate(formData.deadline)} onChange={handleFormChange} />

                </div>
                <div className="flex-1">
                  <LeDateInput title="Winner Announcement" name="winnerAnnouncement" value={formatDate(formData.winnerAnnouncement)} onChange={handleFormChange} />

                </div>
              </div>
              <h3 className="text-2xl font-bold pt-4 text-center mt-12 mb-6 default border-t">Prizes</h3>
              <LeTextInput title="Main Prize" name="mainPrize" value={formData.mainPrize} onChange={handleFormChange} />
              <LeDynamicInputList items={formData.prizeList} setItems={(newList) => updateList('prizeList', newList)} itemType={"Prize"} />

              <h3 className="text-2xl font-bold pt-4 text-center mt-12 mb-6 default border-t">Judges</h3>
              <LeDynamicInputList items={formData.judgeList} setItems={(newList) => updateList('judgeList', newList)} itemType={"Judge"} />
              <h3 className="text-2xl font-bold pt-4 text-center mt-12 mb-6 default border-t">Others</h3>

              <LeTextInput title="Entry Fee" name="entryFee" value={formData.entryFee} onChange={handleFormChange} />
              <LeTextInput title="Eligibility" name="eligibility" value={formData.eligibility} onChange={handleFormChange} />
              <LeTextInput title="Link to post" name="linkToPost" value={formData.linkToPost} onChange={handleFormChange} />
              <LeTextInput title="Thumbnail Image Link" name="linkToThumbnail" value={formData.linkToThumbnail} onChange={handleFormChange} />

              {/*  
    <label htmlFor="deadline" className="block text-lg font-medium">Deadline</label>
    <input
      type="date"
      id="deadline"
      name="deadline"
      value={formatDate(formData.deadline)}
      onChange={handleFormChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
    /> */}
            </div>

            <button type="submit" className="button-primary">
              Submit
            </button>
          </form>
        </>
      )}


    </div>
  );
};

export default Page;
