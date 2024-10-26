"use client";
import { useEffect, Suspense, useState } from "react";
import {
    EmailShareButton,
    FacebookShareButton,
    GabShareButton,
    HatenaShareButton,
    InstapaperShareButton,
    LineShareButton,
    LinkedinShareButton,
    LivejournalShareButton,
    MailruShareButton,
    OKShareButton,
    PinterestShareButton,
    PocketShareButton,
    RedditShareButton,
    TelegramShareButton,
    TumblrShareButton,
    TwitterShareButton,
    ViberShareButton,
    VKShareButton,
    WhatsappShareButton,
    WorkplaceShareButton,
} from "react-share";
import {
    EmailIcon,
    FacebookIcon,
    FacebookMessengerIcon,
    GabIcon,
    HatenaIcon,
    InstapaperIcon,
    LineIcon,
    LinkedinIcon,
    LivejournalIcon,
    MailruIcon,
    OKIcon,
    PinterestIcon,
    PocketIcon,
    RedditIcon,
    TelegramIcon,
    TumblrIcon,
    TwitterIcon,
    ViberIcon,
    VKIcon,
    WeiboIcon,
    WhatsappIcon,
    WorkplaceIcon,
    XIcon,
} from "react-share";
import { LeTextInput, LeTextArea } from "../formComponent";

const ShareCard= ({ contestDetails, isOpen, onClose }) => {
    const shareUrl=`Check out this contest -> https://contest-sphere.vercel.app/?contestId=${contestDetails.id}` 

    if (!isOpen) return null;
    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 5000); // Reset after 2 seconds
        }).catch(err => {
          console.error('Failed to copy text: ', err);
        });
      };
    const handleDiscord = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 5000); // Reset after 5 seconds
    
          // Open Discord in a new tab or window
          window.open(`https://discord.com/channels/@me?content=${encodeURIComponent(discordShareText)}`, '_blank');
        }).catch(err => {
          console.error('Failed to copy text: ', err);
        });
      };
      const [copied, setCopied] = useState(false);

    return (
      <div className="fixed inset-0 bg-gray-900 backdrop-blur-md bg-opacity-60 flex items-center justify-center z-50">
        <span className="default flex flex-col border rounded-lg shadow-lg max-w-lg w-full">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute text-lg top-0 right-0 p-4 pt-2 text-default"
            >
              X
            </button>
            <h1 className="text-default text-2xl p-8 pb-0">
              Share {contestDetails.title} with your friends!
            </h1>
          </div>
          <div className="p-8 pt-0">
          <div className=" default-0 flex flex-row items-center p-1 rounded-full gap-2 ">
                                         {/* Discord Share Button */}
                                <button
                                   // href={`https://discord.com/channels/@me?content=${encodeURIComponent(discordShareText)}`}
                                    onClick={handleDiscord}
                                    className="flex justify-center items-center p-2 rounded-full bg-blue-600 text-white"
                                >Discord</button>
                                        <WhatsappShareButton title={contestDetails.title} separator="->" url={shareUrl} >   <WhatsappIcon size={32} round />
                                    </WhatsappShareButton>
                                    <TelegramShareButton
                                        url={shareUrl}
                                        title={contestDetails.title}
                                        className=""
                                    >
                                        <TelegramIcon size={32} round />
                                    </TelegramShareButton>
                                   
                                </div>
                                <div className="flex items-center ">
                            <input
                                type="text"
                                value={shareUrl}
                              
                                className="flex-1 default-2 p-2 border rounded-l-lg"
                               
                            />
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="px-4 py-2 default border  rounded-r-lg"
                            >
                               {copied ? 'Copied!' : 'Copy URL'}
                            </button>
                            </div>

  
           
          
          
  
            <div className='flex flex-col mt-2 gap-2 items-center w-full justify-center'>
               
              <button type="button" onClick={onClose} className='min-w-72 border border-green-700 text-default text-lg font-bold p-2 rounded-lg'>
                Close
              </button>
            </div>
          </div>
        </span>
      </div>
    );
  };

  export {ShareCard};