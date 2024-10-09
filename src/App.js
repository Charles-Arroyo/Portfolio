import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import logo from "./bit.svg";
import chat from "./chat.svg";
import coupLanding from "./assets/images/LandingPage.png"; // Import the image
import github from "./assets/images/github 1.png";
import me from "./assets/images/YoungMe.png";
import google from "./assets/videos/google.mp4";
import vetaid from "./assets/images/vetaid.png"; // Import the image
import irobot from "./assets/images/irobot.png"; // Import the image
import coupvid from "./assets/videos/coupvid.mp4"; // Import the image
import test from "./assets/images/test.svg"; // Import the image
import grad from "./assets/images/grad.jpg"; // Import the image



const API_KEY = process.env.REACT_APP_API_KEY;




function App() {
  const [currentTime, setCurrentTime] = useState("");
  const [messages, setMessages] = useState([]); // State to store chat messages
  const [newMessage, setNewMessage] = useState(''); // State for input field
  const [isFirstMessage, setIsFirstMessage] = useState(true); // State to track first message
  const [selectedStory, setSelectedStory] = useState(null); // State for the clicked story
  const [isStoryVisible, setIsStoryVisible] = useState(false); // State for showing full-screen story
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track the current image in a story
  const [searchQuery, setSearchQuery] = useState(''); // State to track the search input
  const divRef = useRef(null); // Create a ref to the div
  



  const stories = [
    { id: 1, title: "My Story", images: [me, grad] },
    { id: 2, title: "Git Hub", images: [github] },
    { id: 3, title: "Collins", images: ["https://via.placeholder.com/100", "https://via.placeholder.com/500"] },
    { id: 4, title: "Coming Soon..", images: ["https://via.placeholder.com/100", "https://via.placeholder.com/500"] },
    { id: 5, title: "Coming Soon..", images: ["https://via.placeholder.com/100", "https://via.placeholder.com/500"] }

  ];
  

  const fypPosts = [
    {
      id: 1,
      title: "Google Clone",
      type: "video", // Specifies this is a video
      mediaUrl: google,
    },
    {
      id: 2,
      title: "VetAid",
      type: "image", // Specifies this is a video
      mediaUrl: vetaid,
    },
    {
      id: 3,
      title: "iRobot",
      type: "image", // Specifies this is an image
      mediaUrl: irobot,
    },
    {
      id: 4,
      title: "Coup Mobile",
      type: "video", // Specifies this is an image
      mediaUrl: coupvid, // Example image URL
    },
    {
      id: 5,
      title: "Coming Soon...",
      type: "image", // Specifies this is a video
      mediaUrl: test,
    },
    {
      id: 6,
      title: "Coup Landing Page",
      type: "image", // Specifies this is a video
      mediaUrl: coupLanding,
    },
    {
      id: 7,
      title: "Coming Soon...",
      type: "video", // Specifies this is a video
      mediaUrl: google,
    },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };

    

    

    // Update the time once when the component mounts
    updateTime();

    // Update the time every minute
    const intervalId = setInterval(updateTime, 60000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  // Toggle function to show/hide the overlay
  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };
  const [isScreenVisible, setIsScreenVisible] = useState(false);

  // Predefined contexts


  // Function to toggle the sliding screen
  const toggleScreen = () => {
    setIsScreenVisible(!isScreenVisible);
  };
  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  const personalInfo = {
    "name": "My name is Charles and I live in Ames, Iowa.",
    "location": "I live in Ames, Iowa.",
    "eat": "My favorite thing to eat is sushi.",
    "fun": "I enjoy working out and playing video games.",
    "music": "Bob Dylan, Classic Rock, ANYTHING",
    "java": [
    "I have experience in Java from taking a data structures class.",
    "I've worked with Java in backend development for a mobile card game.",
    "I took a data structures course and used Java extensively."
  ],
  "apps": [
    "I worked on backend code for a mobile card game.",
    "One of my key projects was developing backend features for a multiplayer card game."
  ]
  };
  // Function to determine which context to use based on user message
  const determineContext = (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase();

    if (lowerCaseMessage.includes("name")) {
      return personalInfo["name"];
    } else if (lowerCaseMessage.includes("location") || lowerCaseMessage.includes("live")) {
      return personalInfo["location"];
    } else if (lowerCaseMessage.includes("eat") || lowerCaseMessage.includes("favorite food")) {
      return personalInfo["food"];
    } else if (lowerCaseMessage.includes("fun") || lowerCaseMessage.includes("like to do")) {
      return personalInfo["fun"];    
    } else if (lowerCaseMessage.includes("music")) {
      return personalInfo["music"];    
    }
    else if (lowerCaseMessage.includes("java")) {
      return personalInfo["java"];    
    }
    else if (lowerCaseMessage.includes("apps")) {
      return personalInfo["apps"];    
    }
    else {
      return null; // No match found
    }
  };

  // Function to call Hugging Face RoBERTa model and get a response
  const getAIResponse = async (userMessage) => {
    const context = determineContext(userMessage); // Choose context based on user message
    
    try {
      console.log('Sending question to AI:', userMessage); // Debugging

      const response = await fetch(
        'https://api-inference.huggingface.co/models/deepset/roberta-base-squad2',
        {
          headers: { Authorization: `Bearer ${API_KEY}` },
          method: 'POST',
          body: JSON.stringify({
            inputs: {
              question: userMessage,  // The user's message is treated as the question
              context: context // The selected context
            }
          }),
        }
      );

      const result = await response.json();

      console.log('AI Response:', result); // Log the response for debugging

      if (result && result.answer) {
        return result.answer; // Return the AI's answer
      } else {
        return 'Sorry, I could not find an answer.';
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return 'Sorry, something went wrong with the AI.';
    }
  };

  // Handle sending new message
  const sendMessage = async () => {
    if (newMessage.trim()) {
      // Add the user's message to the message list
      setMessages((prevMessages) => [
        ...prevMessages, 
        { text: newMessage, type: 'user' }
      ]);

      // Store user's message before clearing
      const userMessage = newMessage;

      // Clear input field
      setNewMessage('');

      // Check if it's the first message
      if (isFirstMessage) {
        // Send a "Thank you" message as the first response
        setMessages((prevMessages) => [
          ...prevMessages, 
          { text: 'Thank you for reaching out! I will read your email as soon as I can. As you wait, feel free to chat with an AI version of me.', type: 'system' }
        ]);

        // After sending the "Thank you" message, allow AI responses
        setIsFirstMessage(false);
      } else {
        // Call the AI API and get a response after the first message
        const aiResponse = await getAIResponse(userMessage);

        // Add AI's response to the message list
        setMessages((prevMessages) => [
          ...prevMessages, 
          { text: aiResponse, type: 'system' }
        ]);
      }
    }
  };



  const handleStoryClick = (story) => {
    // You can log the story ID to the console or perform any action
    console.log(`Story with ID ${story} clicked!`);
    setSelectedStory(story); // Set the clicked story as the selected one
    setIsStoryVisible(true); // Show the story in full screen
    setCurrentImageIndex(0);
  };

  const closeStory = () => {
    setIsStoryVisible(false); // Hide the full-screen story
  };


  const handleImageClick = () => {
    if (currentImageIndex < selectedStory.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1); // Move to the next image
    } else {
      setCurrentImageIndex(0); // If it's the last image, loop back to the first image
    }
  };

  useEffect(() => {
    if (isScreenVisible && messages.length === 0) {
      setMessages([{ text: "Hello! My name is Charles, I am Software Engineer at Iowa State. Type in the chat a message you would like to send to me, and it will be forwarded to my email.", type: 'system' }]);
    }
  }, [isScreenVisible]);

  return (

    
<div className="App">  
  <div className="phone">
 
     {/* Conditionally render the selected story's image */}
     
    <div className="phoneContent">
      
      <nav className="batterybar">
        <div className="time">{currentTime}</div>
      </nav>
      <nav className="navbar">
      <div className="logo-container" onClick={toggleOverlay}>
              <img className="logo" src={logo} alt="Logo" />
      </div>
        <div className="search">
              <input 
        type="text" 
        placeholder="Search Stories..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
      />
        </div>
      </nav>
      
          <div className="stories-container" ref={divRef}>
      {filteredStories.length > 0 ? (
        filteredStories.map((story) => (
          <div key={story.id} className="story" onClick={() => handleStoryClick(story)}>
            <img src={story.images[0]} alt={story.title} /> {/* Show the first image in the story */}
            <p>{story.title}</p>
          </div>
        ))
      ) : (
        <p>No stories found</p>
      )}
    </div>


      {/* Full-Screen Story Modal */}
      {isStoryVisible && selectedStory && (
        <div className="full-screen-story">
          <div className="story-content">
            <button className="close-btn" onClick={closeStory}>Close</button>

            {/* Story Title */}
            <h2>{selectedStory.title}</h2>

            {/* Clickable image for changing to the next image */}
            <img
              src={selectedStory.images[currentImageIndex]}
              alt={`${selectedStory.title} - ${currentImageIndex + 1}`}
              className="story-image"
              onClick={handleImageClick} // Click image to move to the next one
            />

            {/* Image navigation indicator */}
            <p>
              {currentImageIndex + 1} / {selectedStory.images.length}
            </p>
          </div>
        </div>
      )}

     
      

    </div>
  <div className="fyp-container">
  {fypPosts.map((post) => (
    <div key={post.id} className="fyp-card">
      {post.type === "video" ? (
        <video
          src={post.mediaUrl}
          className="fyp-video"
          controls
          loop
          muted
          
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={post.mediaUrl}
          alt={post.title}
          className="fyp-image"
        />
      )}
      <p className="fyp-title">{post.title}</p>
    </div>
  ))}


<div className="camera-icon" onClick={toggleScreen}>
          <img src={chat} alt="Camera" />
        </div>
        <div className={`sliding-screen ${isScreenVisible ? 'visible' : ''}`}>
          <div className="sliding-content">
            <div>
            </div>
            <button onClick={toggleScreen}>Close</button>
          </div>
        </div>

</div>
        
        
        {/* Sliding chat screen */}
        <div className={`sliding-screen ${isScreenVisible ? 'visible' : ''}`}>
          <div className="chat-content">
            <div className="chat-header">
              <h2>Chat</h2>
              <button onClick={toggleScreen}>Close</button>
            </div>
            <div className="message-list">
              {messages.map((message, index) => (
                <div key={index} className={`message-container ${message.type}`}>
                  <div className="message-label">
                    {message.type === 'system' ? 'Charles' : 'Me'}
                  </div>
                  <div className={`message ${message.type === 'system' ? 'system-message' : 'user-message'}`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>


        {isOverlayVisible && (
  <div className="overlay">
    <div className="overlay-content">
      <h1>👋</h1>
      {/* Link to download or view the Overleaf resume */}
      <div>
      <a href="/Charles_Arroyo_Resume.pdf" download="Charles_Arroyo_Resume.pdf">
        Download My Resume
      </a>
      </div>

      <button onClick={toggleOverlay}>Close</button>
    </div>
  </div>
)}

  </div>
</div>

  );
}

export default App;
