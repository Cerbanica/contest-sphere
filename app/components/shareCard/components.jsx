"use client";
import { useEffect, Suspense, useState } from "react";
import { DocumentDuplicateIcon } from '@heroicons/react/24/solid'
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

const ShareCard = ({ contestDetails, isOpen, onClose }) => {
    const shareUrl = `https://contest-sphere.vercel.app/?contestId=${contestDetails.id}`

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
            <span className="default flex flex-col border rounded-lg shadow-lg max-w-lg w-full m-4 lg:m-0">
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
                <div className=" flex flex-col gap-4 p-8 ">
                <div className="flex items-center default-0 pl-1 rounded-lg ">
                        <input
                            type="text"
                            value={shareUrl}

                            className="flex-1 bg-transparent text-default p-1  rounded-lg"

                        />
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="p-2 default-2 rounded-r-lg"
                        >
                            <DocumentDuplicateIcon className="w-8 h-6 mb-1 cursor-pointer  text-default-2" />
                        </button>
                    </div>
                    <div className="  flex flex-row justify-center  items-center p-1 rounded-full gap-4 ">
                        {/* Discord Share Button */}
                        <button
                            // href={`https://discord.com/channels/@me?content=${encodeURIComponent(discordShareText)}`}
                            onClick={handleDiscord}
                            className="flex justify-center items-center bg-[#7289da] p-1 rounded-full"
                        ><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                                <path fill="#ffffff" d="M40,12c0,0-4.585-3.588-10-4l-0.488,0.976C34.408,10.174,36.654,11.891,39,14c-4.045-2.065-8.039-4-15-4s-10.955,1.935-15,4c2.346-2.109,5.018-4.015,9.488-5.024L18,8c-5.681,0.537-10,4-10,4s-5.121,7.425-6,22c5.162,5.953,13,6,13,6l1.639-2.185C13.857,36.848,10.715,35.121,8,32c3.238,2.45,8.125,5,16,5s12.762-2.55,16-5c-2.715,3.121-5.857,4.848-8.639,5.815L33,40c0,0,7.838-0.047,13-6C45.121,19.425,40,12,40,12z M17.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C21,28.209,19.433,30,17.5,30z M30.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C34,28.209,32.433,30,30.5,30z"></path>
                            </svg></button>
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

export { ShareCard };