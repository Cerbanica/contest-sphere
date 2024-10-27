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

                    <div className="grid grid-cols-3 gap-4 p-1">
                        <WhatsappShareButton title={contestDetails.title} separator="->" url={shareUrl}>
                            <div className="bg-[#4fce5d] h-full min-h-[100px] flex items-center rounded-lg justify-center">
                                WhatsApp
                            </div>
                        </WhatsappShareButton>

                        <button
                            // href={`https://discord.com/channels/@me?content=${encodeURIComponent(discordShareText)}`}
                            onClick={handleDiscord}
                            className="flex justify-center items-center bg-[#7289da] p-1 rounded-lg  h-full min-h-[100px] "
                        ><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 48 48">
                                <path fill="#ffffff" d="M40,12c0,0-4.585-3.588-10-4l-0.488,0.976C34.408,10.174,36.654,11.891,39,14c-4.045-2.065-8.039-4-15-4s-10.955,1.935-15,4c2.346-2.109,5.018-4.015,9.488-5.024L18,8c-5.681,0.537-10,4-10,4s-5.121,7.425-6,22c5.162,5.953,13,6,13,6l1.639-2.185C13.857,36.848,10.715,35.121,8,32c3.238,2.45,8.125,5,16,5s12.762-2.55,16-5c-2.715,3.121-5.857,4.848-8.639,5.815L33,40c0,0,7.838-0.047,13-6C45.121,19.425,40,12,40,12z M17.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C21,28.209,19.433,30,17.5,30z M30.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C34,28.209,32.433,30,30.5,30z"></path>
                            </svg></button>
                        <div className="bg-[#E1306c] h-full min-h-[100px] flex items-center rounded-lg justify-center">
                            Insta
                        </div>
                        <FacebookShareButton quote={contestDetails.title} url={shareUrl}>
                            <div className="bg-[#1877F2] h-full min-h-[100px]  flex items-center rounded-lg justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
                                    <path fill="#b0bec5" d="M29,3c-5.523,0-10,4.477-10,10v5h-6v8h6v19h8V26h7l1-8h-8v-4c0-2.209,1.791-4,4-4h4V3.322 C33.091,3.125,30.921,2.996,29,3L29,3z"></path>
                                </svg>
                            </div>
                        </FacebookShareButton>
                        <TelegramShareButton title={contestDetails.title} url={shareUrl}>
                            <div className="bg-[#24a1de] h-full min-h-[100px] flex items-center rounded-lg justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="96" height="96" viewBox="0 0 48 48">
<path fill="#29b6f6" d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"></path><path fill="#fff" d="M33.95,15l-3.746,19.126c0,0-0.161,0.874-1.245,0.874c-0.576,0-0.873-0.274-0.873-0.274l-8.114-6.733 l-3.97-2.001l-5.095-1.355c0,0-0.907-0.262-0.907-1.012c0-0.625,0.933-0.923,0.933-0.923l21.316-8.468 c-0.001-0.001,0.651-0.235,1.126-0.234C33.667,14,34,14.125,34,14.5C34,14.75,33.95,15,33.95,15z"></path><path fill="#b0bec5" d="M23,30.505l-3.426,3.374c0,0-0.149,0.115-0.348,0.12c-0.069,0.002-0.143-0.009-0.219-0.043 l0.964-5.965L23,30.505z"></path><path fill="#cfd8dc" d="M29.897,18.196c-0.169-0.22-0.481-0.26-0.701-0.093L16,26c0,0,2.106,5.892,2.427,6.912 c0.322,1.021,0.58,1.045,0.58,1.045l0.964-5.965l9.832-9.096C30.023,18.729,30.064,18.416,29.897,18.196z"></path>
</svg>
                            </div>
                        </TelegramShareButton>
                        <TwitterShareButton title={contestDetails.title} url={shareUrl}>
                            <div className="bg-black h-full min-h-[100px] flex items-center rounded-lg justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="96" height="96" viewBox="0 0 48 48">
<path fill="#212121" fill-rule="evenodd" d="M38,42H10c-2.209,0-4-1.791-4-4V10c0-2.209,1.791-4,4-4h28	c2.209,0,4,1.791,4,4v28C42,40.209,40.209,42,38,42z" clip-rule="evenodd"></path><path fill="#fff" d="M34.257,34h-6.437L13.829,14h6.437L34.257,34z M28.587,32.304h2.563L19.499,15.696h-2.563 L28.587,32.304z"></path><polygon fill="#fff" points="15.866,34 23.069,25.656 22.127,24.407 13.823,34"></polygon><polygon fill="#fff" points="24.45,21.721 25.355,23.01 33.136,14 31.136,14"></polygon>
</svg>
                            </div>
                        </TwitterShareButton>

                    </div>

                    <div className="  flex flex-row justify-center  items-center p-1 rounded-full gap-4 ">
                        {/* Discord Share Button */}


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